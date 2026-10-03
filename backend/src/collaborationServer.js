const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const Document = require("./models/Document");

const {
    setupWSConnection,
} = require("y-websocket/bin/utils");

const PORT = process.env.PORT || process.env.COLLAB_PORT || 1234;
const HOST = process.env.COLLAB_HOST || "0.0.0.0";

/* =========================================================
   HTTP SERVER
========================================================= */

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain",
    });

    res.end(
        "CollabDocs collaboration server is running"
    );
});

/* =========================================================
   WEBSOCKET SERVER
========================================================= */

const wss = new WebSocket.Server({
    noServer: true,
});

/* =========================================================
   NORMAL USER PERMISSION
========================================================= */

async function getDocumentPermission(
    userId,
    documentId
) {
    try {
        if (
            !mongoose.Types.ObjectId.isValid(
                documentId
            )
        ) {
            console.log(
                "❌ Invalid MongoDB document ID:",
                documentId
            );

            return null;
        }

        const document =
            await Document.findById(
                documentId
            ).select(
                "owner collaborators trashed"
            );

        if (!document) {
            console.log(
                "❌ Document not found:",
                documentId
            );

            return null;
        }

        if (document.trashed) {
            return null;
        }

        /* OWNER */

        if (
            document.owner.toString() ===
            userId.toString()
        ) {
            return "owner";
        }

        /* COLLABORATOR */

        const collaborator =
            document.collaborators.find(
                (item) =>
                    item.user.toString() ===
                    userId.toString()
            );

        if (!collaborator) {
            return null;
        }

        return collaborator.role;
    } catch (error) {
        console.error(
            "❌ Permission lookup error:",
            error
        );

        return null;
    }
}

/* =========================================================
   PUBLIC SHARE-LINK PERMISSION
========================================================= */

async function getSharePermission(
    shareToken,
    documentId
) {
    try {
        if (!shareToken) {
            return null;
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                documentId
            )
        ) {
            return null;
        }

        const document =
            await Document.findOne({
                _id: documentId,
                "shareLink.token": shareToken,
                "shareLink.enabled": true,
                trashed: false,
            }).select(
                "shareLink owner collaborators trashed"
            );

        if (!document) {
            return null;
        }

        if (
            !document.shareLink ||
            !document.shareLink.enabled
        ) {
            return null;
        }

        if (
            document.shareLink.token !==
            shareToken
        ) {
            return null;
        }

        return document.shareLink.role;
    } catch (error) {
        console.error(
            "❌ Share permission lookup error:",
            error
        );

        return null;
    }
}

/* =========================================================
   WEBSOCKET UPGRADE
========================================================= */

server.on(
    "upgrade",
    async (
        request,
        socket,
        head
    ) => {
        try {
            const requestUrl =
                new URL(
                    request.url,
                    `http://${request.headers.host || "localhost"}`
                );

            /* =================================================
               ROOM NAME
            ================================================= */

            const roomName =
                requestUrl.pathname.replace(
                    /^\/+/,
                    ""
                );

            console.log(
                "\n========================================"
            );

            console.log(
                "🔎 New WebSocket request"
            );

            console.log(
                "Room:",
                roomName
            );

            /* =================================================
               VALIDATE ROOM
            ================================================= */

            if (
                !roomName.startsWith(
                    "document-"
                )
            ) {
                console.log(
                    "❌ Invalid collaboration room"
                );

                socket.write(
                    "HTTP/1.1 400 Bad Request\r\n" +
                    "Connection: close\r\n\r\n"
                );

                socket.destroy();

                return;
            }

            /* =================================================
               GET DOCUMENT ID
            ================================================= */

            const documentId =
                roomName.replace(
                    "document-",
                    ""
                );

            console.log(
                "Document ID:",
                documentId
            );

            /* =================================================
               GET JWT
            ================================================= */

            const token =
                requestUrl.searchParams.get(
                    "token"
                );

            if (!token) {
                console.log(
                    "❌ WebSocket rejected: no JWT"
                );

                socket.write(
                    "HTTP/1.1 401 Unauthorized\r\n" +
                    "Connection: close\r\n\r\n"
                );

                socket.destroy();

                return;
            }

            /* =================================================
               VERIFY JWT
            ================================================= */

            let decoded;

            try {
                decoded =
                    jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );
            } catch (error) {
                console.log(
                    "❌ WebSocket rejected: invalid or expired JWT"
                );

                socket.write(
                    "HTTP/1.1 401 Unauthorized\r\n" +
                    "Connection: close\r\n\r\n"
                );

                socket.destroy();

                return;
            }

            /* =================================================
               DETERMINE AUTH TYPE
            ================================================= */

            const isShareToken =
                decoded.type === "share";

            /* =================================================
               PUBLIC SHARE TOKEN
            ================================================= */

            if (isShareToken) {
                console.log(
                    "🔗 Share-link WebSocket connection"
                );

                /* ---------------------------------------------
                   Verify document ID inside token
                --------------------------------------------- */

                if (
                    !decoded.documentId ||
                    decoded.documentId !==
                    documentId
                ) {
                    console.log(
                        "❌ Share token document mismatch"
                    );

                    socket.write(
                        "HTTP/1.1 403 Forbidden\r\n" +
                        "Connection: close\r\n\r\n"
                    );

                    socket.destroy();

                    return;
                }

                /* ---------------------------------------------
                   Verify share token exists
                --------------------------------------------- */

                if (!decoded.shareToken) {
                    console.log(
                        "❌ Share token missing shareToken"
                    );

                    socket.write(
                        "HTTP/1.1 403 Forbidden\r\n" +
                        "Connection: close\r\n\r\n"
                    );

                    socket.destroy();

                    return;
                }

                /* ---------------------------------------------
                   Check current database permission
                --------------------------------------------- */

                const permission =
                    await getSharePermission(
                        decoded.shareToken,
                        documentId
                    );

                if (!permission) {
                    console.log(
                        "❌ Share link is invalid, disabled, or document is unavailable"
                    );

                    socket.write(
                        "HTTP/1.1 403 Forbidden\r\n" +
                        "Connection: close\r\n\r\n"
                    );

                    socket.destroy();

                    return;
                }

                /* ---------------------------------------------
                   Verify role hasn't been forged
                --------------------------------------------- */

                if (
                    decoded.role !==
                    permission
                ) {
                    console.log(
                        "❌ Share token role mismatch"
                    );

                    socket.write(
                        "HTTP/1.1 403 Forbidden\r\n" +
                        "Connection: close\r\n\r\n"
                    );

                    socket.destroy();

                    return;
                }

                /* ---------------------------------------------
                   Store guest information
                --------------------------------------------- */

                request.authType =
                    "share";

                request.userId =
                    `guest:${decoded.shareToken.slice(
                        0,
                        12
                    )}`;

                request.permission =
                    permission;

                request.documentId =
                    documentId;

                request.roomName =
                    roomName;

                request.shareToken =
                    decoded.shareToken;

                console.log(
                    `✅ Share guest authorized → ${documentId} → ${permission}`
                );

                /* ---------------------------------------------
                   CREATE WEBSOCKET CONNECTION
                --------------------------------------------- */

                wss.handleUpgrade(
                    request,
                    socket,
                    head,
                    (ws) => {
                        wss.emit(
                            "connection",
                            ws,
                            request
                        );
                    }
                );

                return;
            }

            /* =================================================
               NORMAL USER JWT
            ================================================= */

            const userId =
                decoded.userId;

            if (!userId) {
                console.log(
                    "❌ JWT does not contain userId"
                );

                socket.write(
                    "HTTP/1.1 401 Unauthorized\r\n" +
                    "Connection: close\r\n\r\n"
                );

                socket.destroy();

                return;
            }

            console.log(
                "User:",
                userId
            );

            /* =================================================
               CHECK NORMAL USER PERMISSION
            ================================================= */

            const permission =
                await getDocumentPermission(
                    userId,
                    documentId
                );

            if (!permission) {
                console.log(
                    "❌ User has no access"
                );

                socket.write(
                    "HTTP/1.1 403 Forbidden\r\n" +
                    "Connection: close\r\n\r\n"
                );

                socket.destroy();

                return;
            }

            /* =================================================
               AUTHORIZED NORMAL USER
            ================================================= */

            console.log(
                `✅ Authorized: ${userId} → ${documentId} → ${permission}`
            );

            request.authType =
                "user";

            request.userId =
                userId;

            request.permission =
                permission;

            request.documentId =
                documentId;

            request.roomName =
                roomName;

            /* =================================================
               CREATE WEBSOCKET CONNECTION
            ================================================= */

            wss.handleUpgrade(
                request,
                socket,
                head,
                (ws) => {
                    wss.emit(
                        "connection",
                        ws,
                        request
                    );
                }
            );
        } catch (error) {
            console.error(
                "❌ WebSocket authorization error:",
                error
            );

            socket.destroy();
        }
    }
);

/* =========================================================
   WEBSOCKET CONNECTION
========================================================= */

wss.on(
    "connection",
    (ws, request) => {
        console.log(
            "\n🔌 Collaboration connected"
        );

        console.log(
            "Room:",
            request.roomName
        );

        console.log(
            "Auth type:",
            request.authType
        );

        console.log(
            "User:",
            request.userId
        );

        console.log(
            "Permission:",
            request.permission
        );

        /* =====================================================
           YJS CONNECTION
        ===================================================== */

        setupWSConnection(
            ws,
            request
        );

        /* =====================================================
           LIVE PERMISSION MONITOR
        ===================================================== */

        const permissionCheck =
            setInterval(
                async () => {
                    try {
                        if (
                            ws.readyState !==
                            WebSocket.OPEN
                        ) {
                            clearInterval(
                                permissionCheck
                            );

                            return;
                        }

                        /* =====================================
                           SHARE LINK USER
                        ===================================== */

                        if (
                            request.authType ===
                            "share"
                        ) {
                            const latestPermission =
                                await getSharePermission(
                                    request.shareToken,
                                    request.documentId
                                );

                            /* ---------------------------------
                               Link disabled / document deleted
                            --------------------------------- */

                            if (
                                !latestPermission
                            ) {
                                console.log(
                                    `🚫 Share access revoked → ${request.documentId}`
                                );

                                clearInterval(
                                    permissionCheck
                                );

                                ws.close(
                                    4403,
                                    "Share access revoked"
                                );

                                return;
                            }

                            /* ---------------------------------
                               Permission changed
                            --------------------------------- */

                            if (
                                latestPermission !==
                                request.permission
                            ) {
                                console.log(
                                    `🔄 Share permission changed: ${request.permission} → ${latestPermission}`
                                );

                                request.permission =
                                    latestPermission;

                                /*
                                 * Close the existing connection.
                                 *
                                 * This forces the frontend to
                                 * reconnect using the latest
                                 * share permission.
                                 */

                                clearInterval(
                                    permissionCheck
                                );

                                ws.close(
                                    4403,
                                    "Share permission changed"
                                );

                                return;
                            }

                            return;
                        }

                        /* =====================================
                           NORMAL LOGGED-IN USER
                        ===================================== */

                        const latestPermission =
                            await getDocumentPermission(
                                request.userId,
                                request.documentId
                            );

                        /* ---------------------------------
                           User no longer has access
                        --------------------------------- */

                        if (
                            !latestPermission
                        ) {
                            console.log(
                                `🚫 Access revoked: ${request.userId} → ${request.documentId}`
                            );

                            clearInterval(
                                permissionCheck
                            );

                            ws.close(
                                4403,
                                "Access revoked"
                            );
                            return;
                        }

                        /* ---------------------------------
                           Permission changed
                        --------------------------------- */

                        if (
                            latestPermission !==
                            request.permission
                        ) {
                            console.log(
                                `🔄 Permission changed: ${request.permission} → ${latestPermission}`
                            );

                            request.permission =
                                latestPermission;

                            /*
                             * If editor becomes viewer,
                             * close the connection.
                             */

                            if (
                                latestPermission ===
                                "viewer"
                            ) {
                                console.log(
                                    `🔒 Closing editor connection for viewer: ${request.userId}`
                                );

                                clearInterval(
                                    permissionCheck
                                );

                                ws.close(
                                    4403,
                                    "Permission changed to viewer"
                                );

                                return;
                            }
                        }
                    } catch (error) {
                        console.error(
                            "❌ Live permission check failed:",
                            error
                        );
                    }
                },
                250
            );
        /* =====================================================
           DISCONNECT
        ===================================================== */

        ws.on(
            "close",
            () => {
                clearInterval(
                    permissionCheck
                );

                console.log(
                    "\n🔌 Collaboration disconnected"
                );

                console.log(
                    "Room:",
                    request.roomName
                );

                console.log(
                    "User:",
                    request.userId
                );

                console.log(
                    "Auth type:",
                    request.authType
                );
            }
        );
    }
);

/* =========================================================
   START SERVER
========================================================= */

async function start() {
    try {
        await connectDB();

        server.listen(
            PORT,
            HOST,
            () => {
                console.log(
                    "\n========================================"
                );

                console.log(
                    "🚀 Collaboration server running"
                );

                console.log(
                    `ws://${HOST}:${PORT}`
                );

                console.log(
                    "========================================\n"
                );
            }
        );
    } catch (error) {
        console.error(
            "❌ Failed to start collaboration server:",
            error
        );

        process.exit(1);
    }
}

start();