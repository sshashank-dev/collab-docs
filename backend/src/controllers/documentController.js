const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Document = require("../models/Document");
const User = require("../models/User");

const {
    createActivity,
} = require("./activityController");

const {
    createNotification,
} = require("./notificationController");

// =========================================================
// CREATE DOCUMENT
// =========================================================

const createDocument = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required",
            });
        }

        const document = await Document.create({
            title: title.trim(),
            content: "",
            owner: req.userId,
            collaborators: [],
        });

        // Activity
        await createActivity({
            documentId: document._id,
            userId: req.userId,
            action: "created",
            metadata: {
                title: document.title,
            },
        });

        res.status(201).json({
            message: "Document created successfully",
            document,
        });
    } catch (error) {
        console.error(
            "Create document error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// GET USER DOCUMENTS
// =========================================================

const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            $and: [
                {
                    trashed: {
                        $ne: true,
                    },
                },
                {
                    $or: [
                        {
                            owner: req.userId,
                        },
                        {
                            "collaborators.user":
                                req.userId,
                        },
                    ],
                },
            ],
        })
            .populate(
                "owner",
                "name email"
            )
            .populate(
                "collaborators.user",
                "name email"
            )
            .sort({
                updatedAt: -1,
            });

        res.json({
            documents,
        });
    } catch (error) {
        console.error(
            "Get documents error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// GET TRASHED DOCUMENTS
// =========================================================

const getTrashDocuments = async (req, res) => {
    try {
        const documents =
            await Document.find({
                owner: req.userId,
                trashed: true,
            })
                .populate(
                    "owner",
                    "name email"
                )
                .sort({
                    trashedAt: -1,
                });

        res.json({
            documents,
        });
    } catch (error) {
        console.error(
            "Get trash documents error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// GET SINGLE DOCUMENT
// =========================================================

const getDocument = async (req, res) => {
    try {
        const document =
            await Document.findById(
                req.params.id
            )
                .populate(
                    "owner",
                    "name email"
                )
                .populate(
                    "collaborators.user",
                    "name email"
                );

        if (!document) {
            return res.status(404).json({
                message: "Document not found",
            });
        }

        // Trashed documents cannot be opened normally
        if (document.trashed) {
            return res.status(404).json({
                message:
                    "Document is in the trash",
            });
        }

        // Owner
        const isOwner =
            document.owner._id.toString() ===
            req.userId;

        // Collaborator
        const collaborator =
            document.collaborators.find(
                (item) =>
                    item.user._id.toString() ===
                    req.userId
            );

        // No access
        if (!isOwner && !collaborator) {
            return res.status(403).json({
                message:
                    "You do not have access to this document",
            });
        }

        res.json({
            document,

            permission: isOwner
                ? "owner"
                : collaborator.role,
        });
    } catch (error) {
        console.error(
            "Get document error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// UPDATE DOCUMENT
// =========================================================

const updateDocument = async (req, res) => {
    try {
        const { title, content } =
            req.body;

        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                message: "Document not found",
            });
        }

        // Cannot edit trashed document
        if (document.trashed) {
            return res.status(400).json({
                message:
                    "Cannot edit a document in the trash",
            });
        }

        // Owner
        const isOwner =
            document.owner.toString() ===
            req.userId;

        // Collaborator
        const collaborator =
            document.collaborators.find(
                (item) =>
                    item.user.toString() ===
                    req.userId
            );

        // Viewer cannot edit
        if (
            !isOwner &&
            (!collaborator ||
                collaborator.role !==
                "editor")
        ) {
            return res.status(403).json({
                message:
                    "You do not have permission to edit this document",
            });
        }

        /*
         * Remember the old values.
         * This prevents unnecessary activity
         * records when an autosave sends the
         * exact same data again.
         */
        const oldTitle = document.title;
        const oldContent = document.content;

        if (title !== undefined) {
            document.title = title;
        }

        if (content !== undefined) {
            document.content = content;
        }

        const titleChanged =
            title !== undefined &&
            title !== oldTitle;

        const contentChanged =
            content !== undefined &&
            content !== oldContent;

        await document.save();

        // Activity
        if (titleChanged || contentChanged) {
            await createActivity({
                documentId: document._id,
                userId: req.userId,
                action: "edited",
                metadata: {
                    titleChanged,
                    contentChanged,
                },
            });
        }

        res.json({
            message:
                "Document updated successfully",
            document,
        });
    } catch (error) {
        console.error(
            "Update document error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// MOVE DOCUMENT TO TRASH
// =========================================================

const deleteDocument = async (req, res) => {
    try {
        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                message: "Document not found",
            });
        }

        // Only owner can delete
        if (
            document.owner.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only the owner can delete this document",
            });
        }

        // Already in trash
        if (document.trashed) {
            return res.status(400).json({
                message:
                    "Document is already in the trash",
            });
        }

        document.trashed = true;
        document.trashedAt = new Date();

        await document.save();

        // Activity
        await createActivity({
            documentId: document._id,
            userId: req.userId,
            action: "trashed",
        });

        res.json({
            message:
                "Document moved to trash",
            document,
        });
    } catch (error) {
        console.error(
            "Move document to trash error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// RESTORE DOCUMENT
// =========================================================

const restoreDocument = async (req, res) => {
    try {
        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                message: "Document not found",
            });
        }

        // Only owner can restore
        if (
            document.owner.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only the owner can restore this document",
            });
        }

        if (!document.trashed) {
            return res.status(400).json({
                message:
                    "Document is not in the trash",
            });
        }

        document.trashed = false;
        document.trashedAt = null;

        await document.save();

        // Activity
        await createActivity({
            documentId: document._id,
            userId: req.userId,
            action: "restored",
        });

        res.json({
            message:
                "Document restored successfully",
            document,
        });
    } catch (error) {
        console.error(
            "Restore document error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// PERMANENTLY DELETE DOCUMENT
// =========================================================

const permanentlyDeleteDocument =
    async (req, res) => {
        try {
            const document =
                await Document.findById(
                    req.params.id
                );

            if (!document) {
                return res.status(404).json({
                    message:
                        "Document not found",
                });
            }

            // Only owner can permanently delete
            if (
                document.owner.toString() !==
                req.userId
            ) {
                return res.status(403).json({
                    message:
                        "Only the owner can permanently delete this document",
                });
            }

            if (!document.trashed) {
                return res.status(400).json({
                    message:
                        "Document must be in the trash before permanent deletion",
                });
            }

            /*
             * Create the activity before deleting
             * the document.
             */
            await createActivity({
                documentId: document._id,
                userId: req.userId,
                action: "permanently_deleted",
                metadata: {
                    title: document.title,
                },
            });

            await document.deleteOne();

            res.json({
                message:
                    "Document permanently deleted",
            });
        } catch (error) {
            console.error(
                "Permanent delete error:",
                error
            );

            res.status(500).json({
                message: "Server error",
            });
        }
    };


// =========================================================
// ADD COLLABORATOR
// =========================================================

const addCollaborator = async (
    req,
    res
) => {
    try {
        const { email, role } =
            req.body;

        if (!email) {
            return res.status(400).json({
                message:
                    "User email is required",
            });
        }

        if (
            role !== "viewer" &&
            role !== "editor"
        ) {
            return res.status(400).json({
                message:
                    "Role must be viewer or editor",
            });
        }

        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found",
            });
        }

        // Only owner can share
        if (
            document.owner.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only the owner can manage collaborators",
            });
        }

        // Find user
        const user =
            await User.findOne({
                email: email
                    .toLowerCase()
                    .trim(),
            });

        if (!user) {
            return res.status(404).json({
                message:
                    "No user found with this email",
            });
        }

        // Cannot share with yourself
        if (
            user._id.toString() ===
            req.userId
        ) {
            return res.status(400).json({
                message:
                    "You are already the owner",
            });
        }

        // Check existing collaborator
        const existing =
            document.collaborators.find(
                (item) =>
                    item.user.toString() ===
                    user._id.toString()
            );

        let activityAction =
            "collaborator_added";

        let metadata = {
            collaboratorId:
                user._id.toString(),
            collaboratorName:
                user.name,
            collaboratorEmail:
                user.email,
            role,
        };

        if (existing) {
            const oldRole =
                existing.role;

            existing.role = role;

            /*
             * If collaborator already exists,
             * this operation is effectively a
             * permission change.
             */
            if (oldRole !== role) {
                activityAction =
                    "role_changed";

                metadata = {
                    collaboratorId:
                        user._id.toString(),
                    collaboratorName:
                        user.name,
                    collaboratorEmail:
                        user.email,
                    oldRole,
                    newRole: role,
                };
            } else {
                /*
                 * Same role means there is no
                 * meaningful activity to record.
                 */
                activityAction = null;
            }
        } else {
            document.collaborators.push({
                user: user._id,
                role,
            });
        }

        await document.save();

        await document.populate(
            "collaborators.user",
            "name email"
        );

        // Activity
        if (activityAction) {
            await createActivity({
                documentId: document._id,
                userId: req.userId,
                action: activityAction,
                metadata,
            });

            // Notification
            if (
                activityAction ===
                "collaborator_added"
            ) {
                await createNotification({
                    recipient: user._id,
                    sender: req.userId,
                    document:
                        document._id,
                    type:
                        "collaborator_added",
                    message: `You were added to "${document.title}"`,
                });
            }

            // Notification for permission change
            if (
                activityAction ===
                "role_changed"
            ) {
                await createNotification({
                    recipient: user._id,
                    sender: req.userId,
                    document:
                        document._id,
                    type:
                        "role_changed",
                    message: `Your role was changed to ${role} in "${document.title}"`,
                });
            }
        }

        res.json({
            message:
                "Collaborator added successfully",
            document,
        });
    } catch (error) {
        console.error(
            "Add collaborator error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// REMOVE COLLABORATOR
// =========================================================

const removeCollaborator = async (
    req,
    res
) => {
    try {
        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found",
            });
        }

        // Only owner can remove
        if (
            document.owner.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only the owner can manage collaborators",
            });
        }

        const collaborator =
            document.collaborators.find(
                (item) =>
                    item.user.toString() ===
                    req.params.userId
            );

        document.collaborators =
            document.collaborators.filter(
                (item) =>
                    item.user.toString() !==
                    req.params.userId
            );

        await document.save();

        // Activity only if someone was actually removed
        if (collaborator) {
            let collaboratorUser = null;

            try {
                collaboratorUser =
                    await User.findById(
                        req.params.userId
                    ).select(
                        "name email"
                    );
            } catch (error) {
                console.error(
                    "Could not fetch removed collaborator:",
                    error
                );
            }

            await createActivity({
                documentId: document._id,
                userId: req.userId,
                action:
                    "collaborator_removed",
                metadata: {
                    collaboratorId:
                        req.params.userId,
                    collaboratorName:
                        collaboratorUser?.name ||
                        "",
                    collaboratorEmail:
                        collaboratorUser?.email ||
                        "",
                    role:
                        collaborator.role,
                },
            });
        }

        res.json({
            message:
                "Collaborator removed successfully",
        });
    } catch (error) {
        console.error(
            "Remove collaborator error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// UPDATE COLLABORATOR ROLE
// =========================================================

const updateCollaboratorRole = async (
    req,
    res
) => {
    try {
        const { id, userId } =
            req.params;

        const { role } = req.body;

        if (
            !["viewer", "editor"].includes(
                role
            )
        ) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        const document =
            await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found",
            });
        }

        if (
            document.owner.toString() !==
            req.userId.toString()
        ) {
            return res.status(403).json({
                message:
                    "Only the owner can change permissions",
            });
        }

        const collaborator =
            document.collaborators.find(
                (item) =>
                    item.user.toString() ===
                    userId.toString()
            );

        if (!collaborator) {
            return res.status(404).json({
                message:
                    "Collaborator not found",
            });
        }

        const oldRole =
            collaborator.role;

        collaborator.role = role;

        await document.save();

        await document.populate([
            {
                path: "owner",
                select:
                    "name email avatar",
            },
            {
                path: "collaborators.user",
                select:
                    "name email avatar",
            },
        ]);

        // Activity + Notification
        if (oldRole !== role) {
            const changedUser =
                await User.findById(
                    userId
                ).select(
                    "name email"
                );

            await createActivity({
                documentId: document._id,
                userId: req.userId,
                action: "role_changed",
                metadata: {
                    collaboratorId:
                        userId,
                    collaboratorName:
                        changedUser?.name ||
                        "",
                    collaboratorEmail:
                        changedUser?.email ||
                        "",
                    oldRole,
                    newRole: role,
                },
            });

            await createNotification({
                recipient: userId,
                sender: req.userId,
                document: document._id,
                type: "role_changed",
                message: `Your role was changed to ${role} in "${document.title}"`,
            });
        }

        res.json({
            message:
                "Permission updated",
            document,
        });
    } catch (error) {
        console.error(
            "Update collaborator role error:",
            error
        );

        res.status(500).json({
            message: "Server error",
        });
    }
};


// =========================================================
// TOGGLE STAR
// =========================================================

const toggleStarDocument = async (
    req,
    res
) => {
    try {
        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found",
            });
        }

        const userId =
            req.userId.toString();

        // Owner
        const isOwner =
            document.owner.toString() ===
            userId;

        // Collaborator
        const collaborator =
            document.collaborators.find(
                (item) =>
                    item.user.toString() ===
                    userId
            );

        // No access
        if (!isOwner && !collaborator) {
            return res.status(403).json({
                message:
                    "You do not have access to this document",
            });
        }

        document.starred =
            !document.starred;

        await document.save();

        // Activity
        await createActivity({
            documentId: document._id,
            userId: req.userId,
            action: document.starred
                ? "starred"
                : "unstarred",
        });

        res.json({
            message: document.starred
                ? "Document starred"
                : "Document unstarred",
            document,
        });
    } catch (error) {
        console.error(
            "Toggle star error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update document star",
        });
    }
};


// =========================================================
// SHAREABLE LINK - GENERATE / ENABLE
// =========================================================

const generateShareLink = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const { role = "viewer" } =
            req.body;

        if (
            !["viewer", "editor"].includes(
                role
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid share link role.",
            });
        }

        const document =
            await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found.",
            });
        }

        // Only owner can manage share link
        if (
            document.owner.toString() !==
            req.userId.toString()
        ) {
            return res.status(403).json({
                message:
                    "Only the document owner can manage the share link.",
            });
        }

        // Generate secure token only once
        if (!document.shareLink?.token) {
            document.shareLink.token =
                crypto
                    .randomBytes(32)
                    .toString("hex");
        }

        document.shareLink.enabled = true;
        document.shareLink.role = role;

        await document.save();

        // Activity
        await createActivity({
            documentId: document._id,
            userId: req.userId,
            action:
                "share_link_created",
            metadata: {
                role,
            },
        });

        res.json({
            message:
                "Share link enabled.",
            shareLink:
                document.shareLink,
        });
    } catch (error) {
        console.error(
            "Generate share link error:",
            error
        );

        res.status(500).json({
            message: "Server error.",
        });
    }
};


// =========================================================
// SHAREABLE LINK - DISABLE
// =========================================================

const disableShareLink = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const document =
            await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found.",
            });
        }

        // Only owner can disable
        if (
            document.owner.toString() !==
            req.userId.toString()
        ) {
            return res.status(403).json({
                message:
                    "Only the document owner can disable the share link.",
            });
        }

        document.shareLink.enabled =
            false;

        await document.save();

        // Activity
        await createActivity({
            documentId: document._id,
            userId: req.userId,
            action:
                "share_link_disabled",
        });

        res.json({
            message:
                "Share link disabled.",
        });
    } catch (error) {
        console.error(
            "Disable share link error:",
            error
        );

        res.status(500).json({
            message: "Server error.",
        });
    }
};


// =========================================================
// SHAREABLE LINK - UPDATE ROLE
// =========================================================

const updateShareLinkRole = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const { role } = req.body;

        if (
            !["viewer", "editor"].includes(
                role
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid share link role.",
            });
        }

        const document =
            await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found.",
            });
        }

        // Only owner can change link permission
        if (
            document.owner.toString() !==
            req.userId.toString()
        ) {
            return res.status(403).json({
                message:
                    "Only the document owner can change the share link.",
            });
        }

        const oldRole =
            document.shareLink?.role ||
            "viewer";

        document.shareLink.enabled = true;
        document.shareLink.role = role;

        // Create token if it doesn't exist
        if (!document.shareLink.token) {
            document.shareLink.token =
                crypto
                    .randomBytes(32)
                    .toString("hex");
        }

        await document.save();

        // Activity
        if (oldRole !== role) {
            await createActivity({
                documentId: document._id,
                userId: req.userId,
                action:
                    "share_link_role_changed",
                metadata: {
                    oldRole,
                    newRole: role,
                },
            });
        }

        res.json({
            message:
                "Share link permission updated.",
            shareLink:
                document.shareLink,
        });
    } catch (error) {
        console.error(
            "Update share link role error:",
            error
        );

        res.status(500).json({
            message: "Server error.",
        });
    }
};


// =========================================================
// GET SHARED DOCUMENT
// =========================================================

const getSharedDocument = async (
    req,
    res
) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                message:
                    "Share token is required.",
            });
        }

        const document =
            await Document.findOne({
                "shareLink.token": token,
                "shareLink.enabled": true,
                trashed: false,
            })
                .populate(
                    "owner",
                    "name email avatar"
                )
                .populate(
                    "collaborators.user",
                    "name email avatar"
                );

        if (!document) {
            return res.status(404).json({
                message:
                    "Share link is invalid or has been disabled.",
            });
        }

        // Create a short-lived guest token.
        //
        // This is different from a normal user JWT.
        // It only grants access to this shared document.
        const collabToken = jwt.sign(
            {
                type: "share",

                documentId:
                    document._id.toString(),

                role:
                    document.shareLink.role,

                shareToken: token,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        // Do not expose the permanent
        // share token again in the response.
        const sharedDocument =
            document.toObject();

        if (sharedDocument.shareLink) {
            delete sharedDocument.shareLink.token;
        }

        res.json({
            document: sharedDocument,

            permission:
                document.shareLink.role,

            collabToken,
        });
    } catch (error) {
        console.error(
            "Get shared document error:",
            error
        );

        res.status(500).json({
            message: "Server error.",
        });
    }
};


// =========================================================
// UPDATE SHARED DOCUMENT - EDITOR LINK
// =========================================================

const updateSharedDocument = async (
    req,
    res
) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (content === undefined) {
            return res.status(400).json({
                message:
                    "Content is required.",
            });
        }

        // -------------------------------------------------
        // READ TEMPORARY SHARE JWT
        // -------------------------------------------------

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message:
                    "Shared editor authentication required.",
            });
        }

        const token =
            authHeader.split(" ")[1];

        let decoded;

        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
        } catch (error) {
            return res.status(401).json({
                message:
                    "Shared editor session expired.",
            });
        }

        // -------------------------------------------------
        // MAKE SURE THIS IS A SHARE TOKEN
        // -------------------------------------------------

        if (decoded.type !== "share") {
            return res.status(403).json({
                message:
                    "Invalid shared editor token.",
            });
        }

        // -------------------------------------------------
        // TOKEN MUST BELONG TO THIS DOCUMENT
        // -------------------------------------------------

        if (
            decoded.documentId !==
            id.toString()
        ) {
            return res.status(403).json({
                message:
                    "Token does not belong to this document.",
            });
        }

        if (!decoded.shareToken) {
            return res.status(403).json({
                message:
                    "Invalid share token.",
            });
        }

        // -------------------------------------------------
        // RE-CHECK SHARE LINK IN DATABASE
        // -------------------------------------------------

        const document =
            await Document.findOne({
                _id: id,
                "shareLink.token":
                    decoded.shareToken,
                "shareLink.enabled": true,
                trashed: false,
            });

        if (!document) {
            return res.status(404).json({
                message:
                    "Share link is invalid or has been disabled.",
            });
        }

        // -------------------------------------------------
        // ONLY EDITOR LINKS CAN SAVE
        // -------------------------------------------------

        if (
            document.shareLink.role !==
            "editor"
        ) {
            return res.status(403).json({
                message:
                    "This shared document is view only.",
            });
        }

        // -------------------------------------------------
        // SAVE CONTENT
        // -------------------------------------------------

        document.content = content;

        await document.save();

        /*
         * Anonymous share-link edits are intentionally
         * not recorded in Activity yet because the current
         * Activity model requires a real User reference.
         */

        res.json({
            message:
                "Shared document saved successfully.",

            document: {
                _id: document._id,
                title: document.title,
                updatedAt:
                    document.updatedAt,
            },
        });
    } catch (error) {
        console.error(
            "Update shared document error:",
            error
        );

        res.status(500).json({
            message: "Server error.",
        });
    }
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
    createDocument,
    getDocuments,
    getTrashDocuments,
    getDocument,
    updateDocument,
    deleteDocument,
    restoreDocument,
    permanentlyDeleteDocument,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorRole,
    toggleStarDocument,

    // Shareable link
    generateShareLink,
    disableShareLink,
    updateShareLinkRole,
    getSharedDocument,
    updateSharedDocument,
};