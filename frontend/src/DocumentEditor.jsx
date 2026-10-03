import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useEditor,
    EditorContent,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
    TextStyle,
    Color,
    BackgroundColor,
} from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


import Collaboration from "@tiptap/extension-collaboration";

import CollaborationCaret from "@tiptap/extension-collaboration-caret";

import * as Y from "yjs";

import {
    WebsocketProvider,
} from "y-websocket";

import {
    IndexeddbPersistence,
} from "y-indexeddb";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import {
    MessageSquare,
    Check,
    History,
    Activity,
    Bell,
    Search,
    X,
} from "lucide-react";

import api from "./api";



// =========================================================
// EDITOR TOOLBAR
// =========================================================

function EditorToolbar({ editor, disabled, onFindReplace, findReplaceOpen, onExportPDF, exportingPDF }) {
    const [, forceToolbarUpdate] = useState(0);

    useEffect(() => {
        if (!editor) return undefined;

        const refresh = () => forceToolbarUpdate((value) => value + 1);
        editor.on("selectionUpdate", refresh);
        editor.on("transaction", refresh);
        editor.on("focus", refresh);
        editor.on("blur", refresh);

        return () => {
            editor.off("selectionUpdate", refresh);
            editor.off("transaction", refresh);
            editor.off("focus", refresh);
            editor.off("blur", refresh);
        };
    }, [editor]);

    if (!editor) return null;

    const buttonStyle = (active = false) => ({
        "--toolbar-active": active ? "1" : "0",
        padding: "7px 10px",
        borderRadius: "6px",
        border: active
            ? "1px solid #7c3aed"
            : "1px solid #d1d5db",
        background: active
            ? "linear-gradient(180deg, #ede9fe 0%, #ddd6fe 100%)"
            : "#ffffff",
        color: active
            ? "#5b21b6"
            : "#111827",
        boxShadow: active
            ? "0 0 0 2px rgba(124,58,237,.12), 0 4px 12px rgba(124,58,237,.14)"
            : "0 1px 2px rgba(15,23,42,.04)",
        transform: active ? "translateY(-1px)" : "translateY(0)",
        transition: "background 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 220ms ease, transform 220ms cubic-bezier(.22,1,.36,1)",
        cursor: disabled
            ? "not-allowed"
            : "pointer",
        fontSize: "13px",
        fontWeight: "600",
        opacity: disabled ? 0.5 : 1,
    });

    const run = (command) => {
        if (disabled) return;
        command();
    };

    const applyTextColor = (color) => {
        if (disabled) return;
        const saved = editor.storage.collabDocsColorSelection;
        const chain = editor.chain().focus();
        if (saved && Number.isInteger(saved.from) && Number.isInteger(saved.to)) {
            chain.setTextSelection({ from: saved.from, to: saved.to });
        }
        chain.setColor(color).run();
        editor.view.focus();
        delete editor.storage.collabDocsColorSelection;
    };

    const resetTextColor = () => {
        if (disabled) return;
        const saved = editor.storage.collabDocsColorSelection;
        const chain = editor.chain().focus();
        if (saved && Number.isInteger(saved.from) && Number.isInteger(saved.to)) {
            chain.setTextSelection({ from: saved.from, to: saved.to });
        }
        chain.unsetColor().run();
        delete editor.storage.collabDocsColorSelection;
    };

    return (
        <div
            className="collabdocs-editor-toolbar"
            style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px",
                padding: "10px 12px",
                borderBottom: "1px solid #e5e7eb",
                background: "#f9fafb",
            }}
        >
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(editor.isActive("bold"))}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleBold().run()
                    )
                }
            >
                B
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={{
                    ...buttonStyle(editor.isActive("italic")),
                    fontStyle: "italic",
                }}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleItalic().run()
                    )
                }
            >
                I
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={{
                    ...buttonStyle(editor.isActive("strike")),
                    textDecoration: "line-through",
                }}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleStrike().run()
                    )
                }
            >
                S
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={{
                    ...buttonStyle(editor.isActive("underline")),
                    textDecoration: "underline",
                }}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleUnderline().run()
                    )
                }
            >
                U
            </button>

            <div
                style={{
                    width: "1px",
                    height: "24px",
                    background: "#d1d5db",
                    margin: "0 3px",
                }}
            />

            {[1, 2, 3].map((level) => (
                <button
                    key={level}
                    type="button"
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    style={buttonStyle(
                        editor.isActive("heading", { level })
                    )}
                    onClick={() =>
                        run(() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level })
                                .run()
                        )
                    }
                >
                    H{level}
                </button>
            ))}

            <div
                style={{
                    width: "1px",
                    height: "24px",
                    background: "#d1d5db",
                    margin: "0 3px",
                }}
            />

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(editor.isActive("bulletList"))}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleBulletList().run()
                    )
                }
            >
                • List
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(editor.isActive("orderedList"))}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleOrderedList().run()
                    )
                }
            >
                1. List
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(
                    editor.isActive({ textAlign: "left" })
                )}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().setTextAlign("left").run()
                    )
                }
            >
                ←
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(
                    editor.isActive({ textAlign: "center" })
                )}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().setTextAlign("center").run()
                    )
                }
            >
                ≡
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(
                    editor.isActive({ textAlign: "right" })
                )}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().setTextAlign("right").run()
                    )
                }
            >
                →
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(editor.isActive("blockquote"))}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleBlockquote().run()
                    )
                }
            >
                Quote
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(editor.isActive("code"))}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleCode().run()
                    )
                }
            >
                {"</>"}
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(editor.isActive("codeBlock"))}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    )
                }
            >
                Code
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle()}
                onClick={() =>
                    run(() =>
                        editor.chain().focus().setHorizontalRule().run()
                    )
                }
            >
                ―
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle()}
                onClick={() => {
                    if (disabled) return;
                    const url = window.prompt("Image URL:", "https://");
                    if (!url) return;
                    editor.chain().focus().setImage({ src: url, alt: "Document image" }).run();
                }}
                title="Insert image"
            >
                Image
            </button>

            {/* =========================================================
                TEXT COLOR PALETTE
            ========================================================= */}

            <div style={{ position: "relative" }}>
                <button
                    type="button"
                    disabled={disabled}
                    style={{
                        ...buttonStyle(),
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                    title="Text color"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                        if (disabled) return;
                        if (editor) {
                            const { from, to } = editor.state.selection;
                            editor.storage.collabDocsColorSelection = { from, to };
                        }
                        const palette = document.getElementById("collabdocs-text-color-palette");
                        if (palette) {
                            palette.style.display =
                                palette.style.display === "grid" ? "none" : "grid";
                        }
                    }}
                >
                    <span style={{ fontWeight: 700, fontSize: "15px", lineHeight: 1 }}>A</span>
                    <span
                        style={{
                            width: "18px",
                            height: "3px",
                            background: editor.getAttributes("textStyle").color || "#202124",
                            borderRadius: "2px",
                            display: "block",
                        }}
                    />
                    <span style={{ fontSize: "9px" }}>▼</span>
                </button>

                <div
                    id="collabdocs-text-color-palette"
                    style={{
                        display: "none",
                        position: "absolute",
                        top: "44px",
                        left: 0,
                        zIndex: 2000,
                        width: "224px",
                        padding: "12px",
                        background: "#ffffff",
                        border: "1px solid #dadce0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 16px rgba(60,64,67,.18)",
                        gridTemplateColumns: "repeat(8, 22px)",
                        gap: "8px",
                    }}
                >
                    <div
                        style={{
                            gridColumn: "1 / -1",
                            fontSize: "11px",
                            color: "#5f6368",
                            marginBottom: "2px",
                            fontWeight: 500,
                        }}
                    >
                        Text color
                    </div>

                    {[
                        "#202124", "#5f6368", "#000000", "#b3261e",
                        "#d93025", "#e37400", "#f9ab00", "#188038",
                        "#137333", "#0b8043", "#00796b", "#0077cc",
                        "#1a73e8", "#185abc", "#5f6368", "#8430ce",
                        "#a142f4", "#c5221f", "#9334e6", "#d01884",
                        "#8d6e63", "#795548", "#546e7a", "#37474f",
                    ].map((color) => (
                        <button
                            key={color}
                            type="button"
                            className="collabdocs-color-swatch"
                            disabled={disabled}
                            title={color}
                            onMouseDown={(event) => {
                                event.preventDefault();
                                applyTextColor(color);
                                const palette = document.getElementById("collabdocs-text-color-palette");
                                if (palette) palette.style.display = "none";
                            }}
                            onClick={(event) => event.preventDefault()}
                            style={{
                                "--swatch-color": color,
                                width: "22px",
                                height: "22px",
                                minWidth: "22px",
                                minHeight: "22px",
                                padding: 0,
                                borderRadius: "50%",
                                border: "1px solid rgba(0,0,0,.12)",
                                background: color,
                                cursor: disabled ? "not-allowed" : "pointer",
                                boxShadow:
                                    editor.getAttributes("textStyle").color === color
                                        ? "0 0 0 2px #ffffff, 0 0 0 4px #7c3aed"
                                        : "none",
                                transition: "transform 180ms ease, box-shadow 180ms ease",
                            }}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.transform = "scale(1.12)";
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.transform = "scale(1)";
                            }}
                        />
                    ))}

                    <button
                        type="button"
                        disabled={disabled}
                        onMouseDown={(event) => {
                            event.preventDefault();
                            resetTextColor();
                            const palette = document.getElementById("collabdocs-text-color-palette");
                            if (palette) palette.style.display = "none";
                        }}
                        onClick={(event) => event.preventDefault()}
                        style={{
                            gridColumn: "1 / -1",
                            marginTop: "4px",
                            border: "1px solid #dadce0",
                            background: "#fff",
                            borderRadius: "6px",
                            padding: "6px 8px",
                            cursor: disabled ? "not-allowed" : "pointer",
                            color: "#5f6368",
                            fontSize: "12px",
                        }}
                    >
                        Reset text color
                    </button>
                </div>
            </div>

            {/* =========================================================
                HIGHLIGHT PALETTE
            ========================================================= */}

            <div style={{ position: "relative" }}>
                <button
                    type="button"
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    style={{
                        ...buttonStyle(),
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                    title="Highlight color"
                    onClick={() => {
                        if (disabled) return;
                        const { from, to } = editor.state.selection;
                        editor.storage.collabDocsColorSelection = { from, to };
                        const palette = document.getElementById("collabdocs-highlight-palette");
                        if (palette) {
                            palette.style.display =
                                palette.style.display === "grid" ? "none" : "grid";
                        }
                    }}
                >
                    <span
                        style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            background: "#fff2cc",
                            padding: "1px 3px",
                            borderRadius: "2px",
                        }}
                    >
                        A
                    </span>
                    <span style={{ fontSize: "9px" }}>▼</span>
                </button>

                <div
                    id="collabdocs-highlight-palette"
                    style={{
                        display: "none",
                        position: "absolute",
                        top: "44px",
                        left: 0,
                        zIndex: 2000,
                        width: "224px",
                        padding: "12px",
                        background: "#ffffff",
                        border: "1px solid #dadce0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 16px rgba(60,64,67,.18)",
                        gridTemplateColumns: "repeat(8, 22px)",
                        gap: "8px",
                    }}
                >
                    <div
                        style={{
                            gridColumn: "1 / -1",
                            fontSize: "11px",
                            color: "#5f6368",
                            marginBottom: "2px",
                            fontWeight: 500,
                        }}
                    >
                        Highlight color
                    </div>

                    {[
                        "#fff2cc", "#fce8e6", "#fef7e0", "#e6f4ea",
                        "#e8f0fe", "#e8eaed", "#f3e8fd", "#fce8f3",
                        "#fff8e1", "#ffe0b2", "#fff9c4", "#dcedc8",
                        "#d7efff", "#e0e0e0", "#e8d7f5", "#f8d7e8",
                    ].map((color) => (
                        <button
                            key={color}
                            type="button"
                            className="collabdocs-highlight-swatch"
                            disabled={disabled}
                            title={color}
                            onMouseDown={(event) => {
                                event.preventDefault();
                                if (disabled) return;
                                const saved = editor.storage.collabDocsColorSelection;
                                const chain = editor.chain().focus();
                                if (saved && Number.isInteger(saved.from) && Number.isInteger(saved.to)) {
                                    chain.setTextSelection({ from: saved.from, to: saved.to });
                                }
                                chain.setBackgroundColor(color).run();
                                delete editor.storage.collabDocsColorSelection;
                                const palette = document.getElementById("collabdocs-highlight-palette");
                                if (palette) palette.style.display = "none";
                            }}
                            onClick={(event) => event.preventDefault()}
                            style={{
                                "--swatch-color": color,
                                width: "22px",
                                height: "22px",
                                minWidth: "22px",
                                minHeight: "22px",
                                padding: 0,
                                borderRadius: "4px",
                                border: "1px solid rgba(0,0,0,.12)",
                                background: color,
                                cursor: disabled ? "not-allowed" : "pointer",
                                boxShadow:
                                    editor.getAttributes("textStyle").backgroundColor === color
                                        ? "0 0 0 2px #ffffff, 0 0 0 4px #7c3aed"
                                        : "none",
                                transition: "transform 180ms ease, box-shadow 180ms ease",
                            }}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.transform = "scale(1.12)";
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.transform = "scale(1)";
                            }}
                        />
                    ))}

                    <button
                        type="button"
                        disabled={disabled}
                        onMouseDown={(event) => {
                            event.preventDefault();
                            if (disabled) return;
                            const saved = editor.storage.collabDocsColorSelection;
                            const chain = editor.chain().focus();
                            if (saved && Number.isInteger(saved.from) && Number.isInteger(saved.to)) {
                                chain.setTextSelection({ from: saved.from, to: saved.to });
                            }
                            chain.unsetBackgroundColor().run();
                            delete editor.storage.collabDocsColorSelection;
                            const palette = document.getElementById("collabdocs-highlight-palette");
                            if (palette) palette.style.display = "none";
                        }}
                        onClick={(event) => event.preventDefault()}
                        style={{
                            gridColumn: "1 / -1",
                            marginTop: "4px",
                            border: "1px solid #dadce0",
                            background: "#fff",
                            borderRadius: "6px",
                            padding: "6px 8px",
                            cursor: disabled ? "not-allowed" : "pointer",
                            color: "#5f6368",
                            fontSize: "12px",
                        }}
                    >
                        Remove highlight
                    </button>
                </div>
            </div>

            <button
                type="button"
                disabled={!editor}
                style={{
                    ...buttonStyle(findReplaceOpen),
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                }}
                onClick={() => onFindReplace?.()}
                title="Find and replace"
            >
                <Search size={14} />
                Find
            </button>

            <button
                type="button"
                disabled={disabled || exportingPDF}
                onMouseDown={(event) => event.preventDefault()}
                style={{
                    ...buttonStyle(false),
                    opacity: exportingPDF ? 0.65 : 1,
                    minWidth: "76px",
                }}
                onClick={() => onExportPDF?.()}
                title="Download document as PDF"
            >
                {exportingPDF ? "PDF…" : "↓ PDF"}
            </button>

            <button
                type="button"
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                style={buttonStyle(editor.isActive("link"))}
                onClick={() => {
                    if (disabled) return;

                    const previousUrl =
                        editor.getAttributes("link").href;

                    const url = window.prompt(
                        "Enter URL:",
                        previousUrl || "https://"
                    );

                    if (url === null) return;

                    if (url === "") {
                        editor
                            .chain()
                            .focus()
                            .unsetLink()
                            .run();
                        return;
                    }

                    editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: url })
                        .run();
                }}
            >
                🔗
            </button>
        </div>
    );
}


function DocumentEditor() {
    const { id } = useParams();

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [document, setDocument] =
        useState(null);

    const [title, setTitle] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [exportingPDF, setExportingPDF] =
        useState(false);

    const [connectionStatus, setConnectionStatus] =
        useState("connecting");

    const [isOnline, setIsOnline] =
        useState(navigator.onLine);

    // ONLINE USERS / PRESENCE
    const [onlineUsers, setOnlineUsers] =
        useState([]);


    // SHARE

    const [showShare, setShowShare] =
        useState(false);

    const [shareEmail, setShareEmail] =
        useState("");

    const [shareRole, setShareRole] =
        useState("editor");

    const [sharing, setSharing] =
        useState(false);

    const [shareMessage, setShareMessage] =
        useState("");

    const [shareError, setShareError] =
        useState("");

    const [shareLinkLoading, setShareLinkLoading] =
        useState(false);

    const [copyingShareLink, setCopyingShareLink] =
        useState(false);


    // COMMENTS

    const [comments, setComments] =
        useState([]);

    const [showComments, setShowComments] =
        useState(false);

    const [commentText, setCommentText] =
        useState("");

    const [selectedText, setSelectedText] =
        useState("");

    const [commentLoading, setCommentLoading] =
        useState(false);

    const [replyText, setReplyText] =
        useState("");

    const [replyingTo, setReplyingTo] =
        useState(null);

    const [replyLoading, setReplyLoading] =
        useState(false);


    // VERSION HISTORY

    const [versions, setVersions] =
        useState([]);

    const [showVersionHistory, setShowVersionHistory] =
        useState(false);

    const [versionsLoading, setVersionsLoading] =
        useState(false);

    const [restoringVersion, setRestoringVersion] =
        useState(false);


    // ACTIVITY HISTORY

    const [activities, setActivities] =
        useState([]);

    const [showActivityHistory, setShowActivityHistory] =
        useState(false);

    const [activitiesLoading, setActivitiesLoading] =
        useState(false);


    // NOTIFICATIONS

    const [notifications, setNotifications] =
        useState([]);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [notificationsLoading, setNotificationsLoading] =
        useState(false);


    // PERMISSION

    const [permission, setPermission] =
        useState(null);

    // FIND & REPLACE
    const [showFindReplace, setShowFindReplace] =
        useState(false);

    const [findText, setFindText] =
        useState("");

    const [replaceText, setReplaceText] =
        useState("");

    const [matchCase, setMatchCase] =
        useState(false);

    const [findMessage, setFindMessage] =
        useState("");

    const [findMatchIndex, setFindMatchIndex] =
        useState(0);


    // IMPORTANT:
    // Prevent MongoDB content from being
    // inserted into Yjs multiple times.
    const initializedRef =
        useRef(false);

    // Version snapshots are throttled so we do not create a
    // MongoDB version on every keystroke/autosave.
    const lastVersionSnapshotRef =
        useRef(0);

    const versionSnapshotInProgressRef =
        useRef(false);

    // Keeps track of edits that must be pushed to MongoDB
    // after internet connectivity returns.
    const pendingServerSyncRef =
        useRef(false);


    // =========================================================
    // CURRENT USER
    // =========================================================

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const currentUser = {
        name:
            storedUser.name ||
            storedUser.username ||
            storedUser.email ||
            "Anonymous",

        color: "#3b82f6",
    };


    // =========================================================
    // YJS DOCUMENT + AUTHENTICATED WEBSOCKET
    // =========================================================

    const {
        ydoc,
        provider,
        persistence,
    } = useMemo(() => {

        const newYdoc =
            new Y.Doc();


        // JWT used by our custom
        // collaboration server.
        const token =
            localStorage.getItem("token");


        const newProvider =
            new WebsocketProvider(
                import.meta.env.VITE_COLLAB_URL || "ws://localhost:1234",
                `document-${id}`,
                newYdoc,
                {
                    connect: true,

                    params: {
                        token,
                    },

                    maxBackoffTime: 2500,
                }
            );


        // Persist the Yjs document locally.
        // This is what makes the editor truly offline-first:
        // edits survive refreshes and internet outages.
        const newPersistence =
            new IndexeddbPersistence(
                `collabdocs-${id}`,
                newYdoc
            );


        return {
            ydoc: newYdoc,
            provider: newProvider,
            persistence: newPersistence,
        };

    }, [id]);


    // =========================================================
    // ONLINE / OFFLINE
    // =========================================================

    useEffect(() => {

        const handleOnline = async () => {

            console.log(
                "🌐 Internet connection restored"
            );

            setIsOnline(true);

            // Reconnect Yjs. Local IndexedDB updates are then
            // synchronized through the Yjs CRDT protocol.
            provider.connect();

            // Give the WebSocket a moment to reconnect, then
            // persist the current collaborative state to MongoDB.
            setTimeout(async () => {
                if (!editor || permission === "viewer") return;

                try {
                    await api.put(
                        `/documents/${id}`,
                        {
                            title,
                            content: editor.getHTML(),
                        }
                    );

                    pendingServerSyncRef.current = false;

                    console.log(
                        "☁️ Offline changes synced to MongoDB"
                    );
                } catch (error) {
                    pendingServerSyncRef.current = true;

                    console.error(
                        "Failed to sync offline changes:",
                        error.response?.data || error.message
                    );
                }
            }, 1000);
        };


        const handleOffline = () => {

            console.log(
                "📴 Internet connection lost"
            );

            setIsOnline(false);
        };


        window.addEventListener(
            "online",
            handleOnline
        );

        window.addEventListener(
            "offline",
            handleOffline
        );


        return () => {

            window.removeEventListener(
                "online",
                handleOnline
            );

            window.removeEventListener(
                "offline",
                handleOffline
            );
        };

    }, [provider]);


    // =========================================================
    // WEBSOCKET STATUS
    // =========================================================

    useEffect(() => {

        const handleStatus = ({
            status,
        }) => {

            console.log(
                "🔌 Yjs WebSocket:",
                status
            );

            setConnectionStatus(
                status
            );
        };


        provider.on(
            "status",
            handleStatus
        );


        return () => {

            provider.off(
                "status",
                handleStatus
            );

        };

    }, [provider]);


    // =========================================================
    // ONLINE USER PRESENCE
    // =========================================================

    useEffect(() => {
        if (!provider?.awareness) return;

        const updateOnlineUsers = () => {
            const states = Array.from(
                provider.awareness.getStates().values()
            );

            const users = states
                .map((state) => state?.user)
                .filter(Boolean);

            const uniqueUsers = users.filter(
                (user, index, array) => {
                    const identity =
                        user.id ||
                        user._id ||
                        user.email ||
                        user.name ||
                        "anonymous";

                    return (
                        index ===
                        array.findIndex(
                            (item) =>
                                (
                                    item.id ||
                                    item._id ||
                                    item.email ||
                                    item.name ||
                                    "anonymous"
                                ) === identity
                        )
                    );
                }
            );

            setOnlineUsers(uniqueUsers);
        };

        updateOnlineUsers();

        provider.awareness.on(
            "change",
            updateOnlineUsers
        );

        return () => {
            provider.awareness.off(
                "change",
                updateOnlineUsers
            );
        };
    }, [provider]);

    // =========================================================
    // TIPTAP EDITOR
    // =========================================================

    const editor = useEditor(
        {
            extensions: [

                StarterKit.configure({
                    undoRedo: false,
                }),

                Underline,
                TextStyle,
                Color,
                BackgroundColor,
                Highlight.configure({ multicolor: true }),
                Image.configure({ inline: false, allowBase64: false }),

                Link.configure({
                    openOnClick: false,
                    autolink: true,
                    defaultProtocol: "https",
                }),

                TextAlign.configure({
                    types: [
                        "heading",
                        "paragraph",
                    ],
                }),


                Collaboration.configure({
                    document: ydoc,

                    field: "default",
                }),


                CollaborationCaret.configure({
                    provider,
                    user: {
                        name:
                            JSON.parse(localStorage.getItem("user"))?.name ||
                            "Anonymous",
                        color: "#7c3aed",
                    },
                }),
            ],


            // IMPORTANT:
            // Yjs owns the document content.
            content: "",


            editable: permission !== "viewer",

            editorProps: {
                attributes: {
                    style: `
                        min-height: 500px;
                        outline: none;
                        padding: 30px;
                        font-size: 17px;
                        line-height: 1.7;
                        white-space: pre-wrap;
                    `,
                },
            },
        },

        [ydoc, provider]
    );


    // =========================================================
    // EDITOR PERMISSION
    // =========================================================

    // ========================================
    // LIVE PERMISSION CHECK
    // ========================================

    // Keep the actual Tiptap editor read-only for viewers.
    // Disabling the toolbar alone does NOT prevent typing.
    useEffect(() => {
        if (!editor) return;

        editor.setEditable(permission !== "viewer");
    }, [editor, permission]);

    // =========================================================
    // FIND & REPLACE
    // =========================================================

    const getFindMatches = (query = findText) => {
        if (!editor || !query) return [];

        const matches = [];
        const needle = matchCase ? query : query.toLowerCase();

        editor.state.doc.descendants((node, pos) => {
            if (!node.isText || !node.text) return;

            const source = matchCase
                ? node.text
                : node.text.toLowerCase();

            let start = 0;

            while (true) {
                const index = source.indexOf(needle, start);

                if (index === -1) break;

                matches.push({
                    from: pos + index,
                    to: pos + index + query.length,
                });

                start = index + Math.max(query.length, 1);
            }
        });

        return matches;
    };

    const focusFindMatch = (match, index, total) => {
        if (!editor || !match) return;

        editor
            .chain()
            .focus()
            .setTextSelection({
                from: match.from,
                to: match.to,
            })
            .run();

        setFindMatchIndex(index);
        setFindMessage(
            total
                ? `${index + 1} of ${total}`
                : "No matches"
        );
    };

    const handleExportPDF = async () => {
        if (!editor || exportingPDF) return;

        setExportingPDF(true);

        let exportRoot = null;
        let exportStyle = null;

        try {
            const browserDocument = globalThis.document;
            const source = editor.getHTML();
            const safeTitle = (title || "CollabDocs document")
                .replace(/[\\/:*?"<>|]+/g, " ")
                .replace(/\s+/g, " ")
                .trim() || "CollabDocs document";

            // Build a clean A4-sized HTML copy of the document. It stays in the
            // current page, so there is no popup and no print dialog.
            exportRoot = browserDocument.createElement("div");
            exportRoot.id = "collabdocs-direct-pdf-export";
            exportRoot.innerHTML = `
                <div class="collabdocs-pdf-page">
                    <h1 class="collabdocs-pdf-title">${safeTitle
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")}</h1>
                    <div class="collabdocs-pdf-rule"></div>
                    <div class="collabdocs-pdf-content">${source}</div>
                </div>
            `;

            exportStyle = browserDocument.createElement("style");
            exportStyle.id = "collabdocs-direct-pdf-export-style";
            exportStyle.textContent = `
                #collabdocs-direct-pdf-export {
                    position: fixed !important;
                    left: -100000px !important;
                    top: 0 !important;
                    width: 794px !important;
                    min-height: 1123px !important;
                    padding: 60px 56px !important;
                    box-sizing: border-box !important;
                    background: #ffffff !important;
                    color: #202124 !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    z-index: 2147483647 !important;
                    font-family: Arial, Helvetica, sans-serif !important;
                }

                #collabdocs-direct-pdf-export .collabdocs-pdf-page {
                    width: 100%;
                    box-sizing: border-box;
                    background: #ffffff;
                    color: #202124;
                    font-size: 15px;
                    line-height: 1.6;
                    overflow-wrap: anywhere;
                }

                #collabdocs-direct-pdf-export .collabdocs-pdf-title {
                    margin: 0 0 18px;
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 600;
                    color: #202124;
                }

                #collabdocs-direct-pdf-export .collabdocs-pdf-rule {
                    height: 1px;
                    background: #e5e7eb;
                    margin: 0 0 26px;
                }

                #collabdocs-direct-pdf-export .collabdocs-pdf-content {
                    width: 100%;
                    overflow-wrap: anywhere;
                }

                #collabdocs-direct-pdf-export h1 {
                    font-size: 26px;
                    line-height: 1.25;
                    margin: 26px 0 12px;
                }
                #collabdocs-direct-pdf-export h2 {
                    font-size: 21px;
                    line-height: 1.3;
                    margin: 24px 0 10px;
                }
                #collabdocs-direct-pdf-export h3 {
                    font-size: 17px;
                    line-height: 1.35;
                    margin: 20px 0 8px;
                }
                #collabdocs-direct-pdf-export p {
                    margin: 0 0 11px;
                }
                #collabdocs-direct-pdf-export ul,
                #collabdocs-direct-pdf-export ol {
                    margin: 0 0 13px;
                    padding-left: 26px;
                }
                #collabdocs-direct-pdf-export li {
                    margin: 3px 0;
                }
                #collabdocs-direct-pdf-export blockquote {
                    margin: 16px 0;
                    padding: 9px 16px;
                    border-left: 3px solid #8b5cf6;
                    color: #4b5563;
                    background: #f7f5ff;
                }
                #collabdocs-direct-pdf-export pre {
                    white-space: pre-wrap;
                    padding: 13px;
                    border-radius: 7px;
                    background: #f3f4f6;
                    color: #202124;
                    font-family: Consolas, Monaco, monospace;
                    font-size: 13px;
                }
                #collabdocs-direct-pdf-export code {
                    font-family: Consolas, Monaco, monospace;
                }
                #collabdocs-direct-pdf-export table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 16px 0;
                }
                #collabdocs-direct-pdf-export th,
                #collabdocs-direct-pdf-export td {
                    border: 1px solid #d9dee8;
                    padding: 8px 10px;
                    text-align: left;
                    vertical-align: top;
                }
                #collabdocs-direct-pdf-export th {
                    background: #f5f6f8;
                    font-weight: 600;
                }
                #collabdocs-direct-pdf-export img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 14px 0;
                }
                #collabdocs-direct-pdf-export hr {
                    border: 0;
                    border-top: 1px solid #dfe3eb;
                    margin: 20px 0;
                }
                #collabdocs-direct-pdf-export a {
                    color: #5b3cc4;
                    text-decoration: underline;
                }
            `;

            browserDocument.head.appendChild(exportStyle);
            browserDocument.body.appendChild(exportRoot);

            // Wait for images and fonts before capturing the page.
            const images = Array.from(exportRoot.querySelectorAll("img"));
            await Promise.all(images.map((image) => {
                if (image.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    image.addEventListener("load", resolve, { once: true });
                    image.addEventListener("error", resolve, { once: true });
                });
            }));

            if (browserDocument.fonts?.ready) {
                await browserDocument.fonts.ready;
            }

            await new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve))
            );

            const canvas = await html2canvas(exportRoot, {
                scale: Math.min(2, globalThis.window.devicePixelRatio || 1.5),
                useCORS: true,
                allowTaint: false,
                backgroundColor: "#ffffff",
                logging: false,
                imageTimeout: 15000,
                width: exportRoot.offsetWidth,
                windowWidth: exportRoot.offsetWidth,
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                compress: true,
            });

            const pageWidth = 210;
            const pageHeight = 297;
            const marginX = 15;
            const marginY = 16;
            const usableWidth = pageWidth - marginX * 2;
            const usableHeight = pageHeight - marginY * 2;
            const pxPerMm = canvas.width / usableWidth;
            const pageCanvasHeight = Math.floor(usableHeight * pxPerMm);

            let offsetY = 0;
            let pageIndex = 0;

            while (offsetY < canvas.height) {
                const sliceHeight = Math.min(
                    pageCanvasHeight,
                    canvas.height - offsetY
                );

                const pageCanvas = browserDocument.createElement("canvas");
                pageCanvas.width = canvas.width;
                pageCanvas.height = sliceHeight;

                const pageContext = pageCanvas.getContext("2d");
                pageContext.fillStyle = "#ffffff";
                pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                pageContext.drawImage(
                    canvas,
                    0,
                    offsetY,
                    canvas.width,
                    sliceHeight,
                    0,
                    0,
                    canvas.width,
                    sliceHeight
                );

                if (pageIndex > 0) {
                    pdf.addPage();
                }

                const renderedHeight = sliceHeight / pxPerMm;
                pdf.addImage(
                    pageCanvas.toDataURL("image/jpeg", 0.92),
                    "JPEG",
                    marginX,
                    marginY,
                    usableWidth,
                    renderedHeight,
                    undefined,
                    "FAST"
                );

                offsetY += sliceHeight;
                pageIndex += 1;
            }

            pdf.save(`${safeTitle}.pdf`);

            exportRoot.remove();
            exportStyle.remove();
            exportRoot = null;
            exportStyle = null;
        } catch (error) {
            console.error("PDF export failed:", error);

            if (exportRoot?.isConnected) exportRoot.remove();
            if (exportStyle?.isConnected) exportStyle.remove();

            globalThis.window.alert(
                `PDF export failed: ${error?.message || "Unknown error"}`
            );
        } finally {
            setExportingPDF(false);
        }
    };

    const handleFindNext = () => {
        if (!findText.trim()) {
            setFindMessage("Type something to find.");
            return;
        }

        const matches = getFindMatches(findText);

        if (!matches.length) {
            setFindMatchIndex(0);
            setFindMessage("No matches");
            return;
        }

        const currentFrom = editor.state.selection.from;

        const nextIndex = matches.findIndex(
            (match) => match.from > currentFrom
        );

        const index =
            nextIndex === -1 ? 0 : nextIndex;

        focusFindMatch(
            matches[index],
            index,
            matches.length
        );
    };

    const handleFindPrevious = () => {
        if (!findText.trim()) {
            setFindMessage("Type something to find.");
            return;
        }

        const matches = getFindMatches(findText);

        if (!matches.length) {
            setFindMatchIndex(0);
            setFindMessage("No matches");
            return;
        }

        const currentFrom = editor.state.selection.from;

        let index = -1;

        for (let i = matches.length - 1; i >= 0; i--) {
            if (matches[i].from < currentFrom) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            index = matches.length - 1;
        }

        focusFindMatch(
            matches[index],
            index,
            matches.length
        );
    };

    const handleReplaceCurrent = () => {
        if (!editor || permission === "viewer") return;

        if (!findText.trim()) {
            setFindMessage("Type something to find.");
            return;
        }

        const matches = getFindMatches(findText);

        if (!matches.length) {
            setFindMessage("No matches");
            return;
        }

        const selection = editor.state.selection;

        const selectedMatch = matches.find(
            (match) =>
                match.from === selection.from &&
                match.to === selection.to
        );

        if (!selectedMatch) {
            focusFindMatch(
                matches[0],
                0,
                matches.length
            );
            setFindMessage("Match selected. Click Replace again.");
            return;
        }

        const transaction = editor.state.tr.insertText(
            replaceText,
            selectedMatch.from,
            selectedMatch.to
        );

        editor.view.dispatch(transaction);

        const remaining = getFindMatches(findText);

        if (remaining.length) {
            focusFindMatch(
                remaining[0],
                0,
                remaining.length
            );
        } else {
            setFindMessage("No matches");
            setFindMatchIndex(0);
        }
    };

    const handleReplaceAll = () => {
        if (!editor || permission === "viewer") return;

        if (!findText.trim()) {
            setFindMessage("Type something to find.");
            return;
        }

        const matches = getFindMatches(findText);

        if (!matches.length) {
            setFindMessage("No matches");
            return;
        }

        const transaction = editor.state.tr;

        // Replace from the end so earlier positions stay valid.
        [...matches]
            .reverse()
            .forEach((match) => {
                transaction.insertText(
                    replaceText,
                    match.from,
                    match.to
                );
            });

        editor.view.dispatch(transaction);

        setFindMessage(
            `${matches.length} replacement${matches.length === 1 ? "" : "s"
            } made`
        );

        setFindMatchIndex(0);
    };

    const handleFindTextChange = (value) => {
        setFindText(value);
        setFindMatchIndex(0);
        setFindMessage("");
    };

    const handleMatchCaseChange = (checked) => {
        setMatchCase(checked);
        setFindMatchIndex(0);
        setFindMessage("");
    };

    useEffect(() => {
        if (!showFindReplace || !findText) {
            setFindMessage("");
            setFindMatchIndex(0);
            return;
        }

        const matches = getFindMatches(findText);

        setFindMessage(
            matches.length
                ? `${Math.min(
                    findMatchIndex + 1,
                    matches.length
                )} of ${matches.length}`
                : "No matches"
        );
    }, [findText, matchCase, showFindReplace, editor]);

    useEffect(() => {
        if (!showFindReplace) return;

        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "f") {
                event.preventDefault();
                setShowFindReplace(true);
                setFindMessage("");
                return;
            }

            if (event.key === "Escape") {
                setShowFindReplace(false);
                setFindMessage("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [showFindReplace]);

    useEffect(() => {
        if (!id) return;

        const checkPermission = async () => {
            try {
                const response = await api.get(
                    `/documents/${id}`
                );

                const latestPermission =
                    response.data.permission;

                setPermission((currentPermission) => {
                    if (
                        currentPermission !==
                        latestPermission
                    ) {
                        console.log(
                            `🔐 Permission changed: ${currentPermission} → ${latestPermission}`
                        );
                    }

                    return latestPermission;
                });

            } catch (error) {
                console.error(
                    "Permission check failed:",
                    error
                );
            }
        };

        // Check immediately
        checkPermission();

        // Then keep checking while document is open
        const permissionInterval =
            setInterval(
                checkPermission,
                1000
            );

        return () => {
            clearInterval(
                permissionInterval
            );
        };
    }, [id]);


    // =========================================================
    // LOAD DOCUMENT FROM MONGODB
    // =========================================================

    useEffect(() => {

        if (!editor) return;


        let cancelled = false;


        const loadDocument =
            async () => {

                try {

                    setLoading(true);


                    const response =
                        await api.get(
                            `/documents/${id}`
                        );


                    if (cancelled) {
                        return;
                    }


                    const doc =
                        response.data.document;


                    setDocument(doc);

                    const cachedTitle =
                        localStorage.getItem(
                            `collabdocs-title-${id}`
                        );

                    setTitle(
                        !navigator.onLine && cachedTitle !== null
                            ? cachedTitle
                            : doc.title || ""
                    );


                    setPermission(
                        response.data.permission
                    );


                    console.log(
                        "📄 MongoDB document loaded"
                    );


                    console.log(
                        "🔐 Permission:",
                        response.data.permission
                    );


                    console.log(
                        "📝 Existing content:",
                        Boolean(
                            doc.content &&
                            doc.content.trim()
                        )
                    );


                } catch (error) {

                    console.error(
                        "Failed to load document:",
                        error.response?.data ||
                        error.message
                    );


                    if (
                        error.response?.status ===
                        401
                    ) {

                        localStorage.removeItem(
                            "token"
                        );

                        localStorage.removeItem(
                            "user"
                        );

                        navigate("/");

                        return;
                    }


                    if (
                        error.response?.status ===
                        403
                    ) {

                        alert(
                            "You don't have access to this document."
                        );

                        navigate("/");

                        return;
                    }


                } finally {

                    if (!cancelled) {
                        setLoading(false);
                    }

                }

            };


        loadDocument();


        return () => {
            cancelled = true;
        };

    }, [
        id,
        editor,
        navigate,
    ]);


    // =========================================================
    // INITIALIZE YJS FROM MONGODB
    // =========================================================

    useEffect(() => {

        if (
            !editor ||
            !document
        ) {
            return;
        }


        if (
            initializedRef.current
        ) {
            return;
        }


        let cancelled = false;


        const initializeCollaboration =
            async () => {

                try {

                    console.log(
                        "⏳ Restoring local Yjs state..."
                    );


                    // IndexedDB must finish restoring the local document
                    // BEFORE we decide whether MongoDB content should be
                    // inserted. Otherwise an offline edit could be
                    // overwritten by the older MongoDB version.
                    if (persistence?.whenSynced) {
                        await persistence.whenSynced;
                    }


                    console.log(
                        "💾 Local Yjs state restored"
                    );


                    // Wait until the server
                    // has sent the current
                    // Yjs state.
                    if (!provider.synced) {

                        await new Promise(
                            (resolve) => {

                                let resolved =
                                    false;


                                const handleSync =
                                    (
                                        isSynced
                                    ) => {

                                        if (
                                            !isSynced ||
                                            resolved
                                        ) {
                                            return;
                                        }


                                        resolved =
                                            true;


                                        provider.off(
                                            "sync",
                                            handleSync
                                        );


                                        resolve();
                                    };


                                provider.on(
                                    "sync",
                                    handleSync
                                );


                                // Safety fallback.
                                // Prevent the editor from
                                // staying frozen forever.
                                setTimeout(
                                    () => {

                                        if (
                                            resolved
                                        ) {
                                            return;
                                        }


                                        resolved =
                                            true;


                                        provider.off(
                                            "sync",
                                            handleSync
                                        );


                                        resolve();

                                    },
                                    5000
                                );

                            }
                        );
                    }


                    if (cancelled) {
                        return;
                    }


                    console.log(
                        "🔄 Yjs synced"
                    );


                    const fragment =
                        ydoc.getXmlFragment(
                            "default"
                        );


                    console.log(
                        "Yjs fragment length:",
                        fragment.length
                    );


                    // =================================================
                    // IMPORTANT
                    //
                    // If Yjs is empty AND MongoDB already
                    // contains content, put MongoDB content
                    // into the collaborative document.
                    // =================================================

                    if (
                        fragment.length === 0 &&
                        document.content &&
                        document.content.trim() !== ""
                    ) {

                        console.log(
                            "📥 Loading MongoDB content into Yjs"
                        );


                        editor.commands.setContent(
                            document.content,
                            false
                        );


                        console.log(
                            "✅ MongoDB content inserted into Yjs"
                        );

                    }


                    // If both MongoDB and Yjs are empty,
                    // the user simply gets a blank document
                    // and can start typing.


                    initializedRef.current =
                        true;


                    console.log(
                        "✅ Collaboration initialized"
                    );


                } catch (error) {

                    console.error(
                        "❌ Collaboration initialization failed:",
                        error
                    );

                }

            };


        initializeCollaboration();


        return () => {
            cancelled = true;
        };

    }, [
        editor,
        document,
        provider,
        ydoc,
    ]);


    // =========================================================
    // SAVE CONTENT TO MONGODB
    // =========================================================

    useEffect(() => {

        if (
            !editor ||
            !document
        ) {
            return;
        }


        // Viewer never saves.
        if (
            permission === "viewer"
        ) {
            return;
        }


        let timeout;


        const handleUpdate = () => {

            // Don't save during initial
            // Yjs/MongoDB initialization.
            if (
                !initializedRef.current
            ) {
                return;
            }


            console.log(
                "✏️ TIPTAP UPDATE"
            );


            setSaving(true);

            // Yjs + IndexedDB already saved the edit locally.
            // When offline, do NOT throw away the change just because
            // MongoDB cannot be reached. Mark it for the reconnect sync.
            if (!navigator.onLine) {
                pendingServerSyncRef.current = true;
                setSaving(false);
                return;
            }


            clearTimeout(timeout);


            timeout = setTimeout(
                async () => {

                    try {

                        await api.put(
                            `/documents/${id}`,
                            {
                                title,

                                content:
                                    editor.getHTML(),
                            }
                        );


                        pendingServerSyncRef.current = false;

                        console.log(
                            "💾 Saved to MongoDB"
                        );

                        // Create a durable history snapshot periodically,
                        // not on every keystroke.
                        await createVersionSnapshot(
                            title,
                            editor.getHTML()
                        );

                        setSaving(false);


                    } catch (error) {

                        pendingServerSyncRef.current = true;

                        console.error(
                            "Failed to save:",
                            error.response
                                ?.data ||
                            error.message
                        );


                        setSaving(false);
                    }

                },
                800
            );

        };


        editor.on(
            "update",
            handleUpdate
        );


        return () => {

            clearTimeout(
                timeout
            );


            editor.off(
                "update",
                handleUpdate
            );

        };

    }, [
        editor,
        document,
        id,
        title,
        permission,
    ]);


    // =========================================================
    // SAVE TITLE
    // =========================================================

    useEffect(() => {

        if (
            !document ||
            !editor
        ) {
            return;
        }


        if (
            !initializedRef.current
        ) {
            return;
        }


        if (
            permission === "viewer"
        ) {
            return;
        }


        // Keep title edits locally while offline.
        localStorage.setItem(
            `collabdocs-title-${id}`,
            title
        );


        if (!navigator.onLine) {
            pendingServerSyncRef.current = true;
            return;
        }


        const timeout =
            setTimeout(
                async () => {

                    try {

                        await api.put(
                            `/documents/${id}`,
                            {
                                title,

                                content:
                                    editor.getHTML(),
                            }
                        );


                        console.log(
                            "💾 Title saved"
                        );


                    } catch (error) {

                        console.error(
                            "Title save failed:",
                            error
                        );

                    }

                },
                800
            );


        return () =>
            clearTimeout(timeout);

    }, [
        title,
        document,
        id,
        editor,
        permission,
    ]);


    // =========================================================
    // YJS DEBUG
    // =========================================================

    useEffect(() => {

        if (!ydoc) return;


        const handleYjsUpdate = (
            update,
            origin
        ) => {

            console.log(
                "📡 YJS UPDATE:",
                update.length,
                "bytes",
                "origin:",
                origin
            );

        };


        ydoc.on(
            "update",
            handleYjsUpdate
        );


        return () => {

            ydoc.off(
                "update",
                handleYjsUpdate
            );

        };

    }, [ydoc]);


    // =========================================================
    // SHARE DOCUMENT
    // =========================================================

    const handleShare =
        async () => {

            if (
                !shareEmail.trim()
            ) {

                setShareError(
                    "Enter a user's email address."
                );

                setShareMessage("");

                return;
            }


            setSharing(true);

            setShareError("");

            setShareMessage("");


            try {

                const response =
                    await api.post(
                        `/documents/${id}/collaborators`,
                        {
                            email:
                                shareEmail.trim(),

                            role:
                                shareRole,
                        }
                    );


                setDocument(
                    response.data.document
                );


                setShareMessage(
                    "Document shared successfully."
                );


                setShareEmail("");


                console.log(
                    "👤 Collaborator added"
                );


            } catch (error) {

                console.error(
                    "Share failed:",
                    error.response?.data ||
                    error.message
                );


                setShareError(
                    error.response?.data
                        ?.message ||
                    "Failed to share document."
                );


            } finally {

                setSharing(false);
            }

        };


    // =========================================================
    // SHAREABLE LINK
    // =========================================================

    const getShareUrl = () => {
        const token = document?.shareLink?.token;

        if (!token) return "";

        return `${window.location.origin}/share/${token}`;
    };


    const handleGenerateShareLink =
        async () => {

            setShareLinkLoading(true);
            setShareError("");
            setShareMessage("");

            try {
                const response =
                    await api.post(
                        `/documents/${id}/share-link`,
                        {
                            role: shareRole,
                        }
                    );

                setDocument(
                    (previous) => ({
                        ...previous,
                        shareLink:
                            response.data.shareLink,
                    })
                );

                setShareMessage(
                    shareRole === "editor"
                        ? "Share link is ready. Anyone with the link can edit."
                        : "Share link is ready. Anyone with the link can view."
                );

            } catch (error) {
                console.error(
                    "Generate share link failed:",
                    error.response?.data ||
                    error.message
                );

                setShareError(
                    error.response?.data?.message ||
                    "Failed to create share link."
                );

            } finally {
                setShareLinkLoading(false);
            }
        };


    const handleCopyShareLink =
        async () => {

            const shareUrl = getShareUrl();

            if (!shareUrl) return;

            setCopyingShareLink(true);
            setShareError("");

            try {
                await navigator.clipboard.writeText(
                    shareUrl
                );

                setShareMessage(
                    "Share link copied to clipboard."
                );

            } catch (error) {
                console.error(
                    "Copy share link failed:",
                    error
                );

                setShareError(
                    "Could not copy the link. Copy it manually."
                );

            } finally {
                setCopyingShareLink(false);
            }
        };


    const handleDisableShareLink =
        async () => {

            setShareLinkLoading(true);
            setShareError("");
            setShareMessage("");

            try {
                await api.delete(
                    `/documents/${id}/share-link`
                );

                setDocument(
                    (previous) => ({
                        ...previous,
                        shareLink: {
                            ...(previous.shareLink || {}),
                            enabled: false,
                        },
                    })
                );

                setShareMessage(
                    "Share link disabled."
                );

            } catch (error) {
                console.error(
                    "Disable share link failed:",
                    error.response?.data ||
                    error.message
                );

                setShareError(
                    error.response?.data?.message ||
                    "Failed to disable share link."
                );

            } finally {
                setShareLinkLoading(false);
            }
        };


    // =========================================================
    // REMOVE COLLABORATOR
    // =========================================================

    const handleRemoveCollaborator =
        async (userId) => {

            try {

                await api.delete(
                    `/documents/${id}/collaborators/${userId}`
                );


                setDocument(
                    (previous) => ({
                        ...previous,

                        collaborators:
                            previous.collaborators.filter(
                                (item) =>
                                    item.user._id !==
                                    userId
                            ),
                    })
                );


                setShareMessage(
                    "Collaborator removed."
                );

                setShareError("");


            } catch (error) {

                console.error(
                    "Remove collaborator failed:",
                    error.response?.data ||
                    error.message
                );


                setShareError(
                    error.response?.data
                        ?.message ||
                    "Failed to remove collaborator."
                );

            }

        };


    // =========================================================
    // CHANGE COLLABORATOR ROLE
    // =========================================================

    const handleRoleChange =
        async (
            userId,
            newRole
        ) => {

            try {

                const response =
                    await api.patch(
                        `/documents/${id}/collaborators/${userId}`,
                        {
                            role:
                                newRole,
                        }
                    );


                setDocument(
                    response.data.document
                );


                setShareMessage(
                    "Permission updated."
                );

                setShareError("");


            } catch (error) {

                console.error(
                    "Role update failed:",
                    error.response?.data ||
                    error.message
                );


                setShareError(
                    error.response?.data
                        ?.message ||
                    "Failed to update permission."
                );

            }

        };


    // =========================================================
    // COMMENTS
    // =========================================================

    const loadComments = async () => {

        try {

            const response =
                await api.get(
                    `/comments/${id}`
                );

            setComments(
                response.data.comments || []
            );

        } catch (error) {

            console.error(
                "Failed to load comments:",
                error.response?.data ||
                error.message
            );

        }

    };


    const handleStartComment = () => {

        if (!editor) return;

        const { from, to } =
            editor.state.selection;

        if (from !== to) {

            const text =
                editor.state.doc.textBetween(
                    from,
                    to,
                    " "
                );

            setSelectedText(text);

        } else {

            setSelectedText("");

        }

        setShowComments(true);
        setShowNotifications(false);
        setShowVersionHistory(false);
        setShowActivityHistory(false);
        setShowShare(false);

    };


    const handleCreateComment = async () => {

        if (!commentText.trim()) return;

        if (permission === "viewer") return;

        setCommentLoading(true);

        try {

            const response =
                await api.post(
                    `/comments/${id}`,
                    {
                        text: commentText.trim(),
                        selectedText,
                    }
                );

            setComments((previous) => [
                ...previous,
                response.data.comment,
            ]);

            setCommentText("");
            setSelectedText("");

        } catch (error) {

            console.error(
                "Failed to create comment:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to add comment."
            );

        } finally {

            setCommentLoading(false);

        }

    };


    const handleReplyToComment = async (
        commentId
    ) => {
        if (!replyText.trim()) return;
        if (permission === "viewer") return;

        setReplyLoading(true);

        try {
            const response =
                await api.post(
                    `/comments/${id}/${commentId}/reply`,
                    {
                        text: replyText.trim(),
                    }
                );

            setComments((previous) => [
                ...previous,
                response.data.comment,
            ]);

            setReplyText("");
            setReplyingTo(null);

        } catch (error) {
            console.error(
                "Failed to reply:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to add reply."
            );

        } finally {
            setReplyLoading(false);
        }
    };


    const handleResolveComment = async (
        commentId
    ) => {

        try {

            const response =
                await api.patch(
                    `/comments/${id}/${commentId}/resolve`
                );

            setComments((previous) =>
                previous.map((comment) =>
                    comment._id === commentId
                        ? response.data.comment
                        : comment
                )
            );

        } catch (error) {

            console.error(
                "Failed to resolve comment:",
                error.response?.data ||
                error.message
            );

        }

    };


    // Load comments when the document is available.
    useEffect(() => {

        if (!document || !id) return;

        loadComments();

    }, [document, id]);


    // =========================================================
    // VERSION HISTORY
    // =========================================================

    const loadVersions = async () => {
        if (!id) return;

        setVersionsLoading(true);

        try {
            const response =
                await api.get(
                    `/versions/${id}`
                );

            setVersions(
                response.data.versions || []
            );

        } catch (error) {

            console.error(
                "Failed to load version history:",
                error.response?.data ||
                error.message
            );

        } finally {

            setVersionsLoading(false);

        }
    };


    const createVersionSnapshot = async (
        snapshotTitle = title,
        snapshotContent = editor?.getHTML() || "",
        force = false
    ) => {

        if (
            !editor ||
            !document ||
            permission === "viewer" ||
            !navigator.onLine
        ) {
            return;
        }

        // Automatic snapshots are limited to one every 30 seconds.
        // Forced snapshots are used for important actions such as restore.
        const now = Date.now();

        if (
            !force &&
            now - lastVersionSnapshotRef.current < 30000
        ) {
            return;
        }

        if (versionSnapshotInProgressRef.current) {
            return;
        }

        versionSnapshotInProgressRef.current = true;

        try {

            await api.post(
                `/versions/${id}`,
                {
                    title:
                        snapshotTitle ||
                        "Untitled document",

                    content:
                        snapshotContent,
                }
            );

            lastVersionSnapshotRef.current = Date.now();

            console.log("🕘 Version snapshot created");

        } catch (error) {

            console.error(
                "Failed to create version snapshot:",
                error.response?.data ||
                error.message
            );

        } finally {
            versionSnapshotInProgressRef.current = false;
        }
    };


    const handleToggleVersionHistory =
        async () => {

            const next =
                !showVersionHistory;

            setShowVersionHistory(next);

            if (next) {

                setShowComments(false);
                setShowActivityHistory(false);
                setShowNotifications(false);
                setShowShare(false);

                await loadVersions();

            }

        };


    // =========================================================
    // ACTIVITY HISTORY
    // =========================================================

    const loadActivities = async () => {
        if (!id) return;

        setActivitiesLoading(true);

        try {
            const response =
                await api.get(
                    `/activities/document/${id}`
                );

            setActivities(
                response.data.activities || []
            );
        } catch (error) {
            console.error(
                "Failed to load activity history:",
                error.response?.data ||
                error.message
            );
        } finally {
            setActivitiesLoading(false);
        }
    };


    const handleToggleActivityHistory =
        async () => {

            const next =
                !showActivityHistory;

            setShowActivityHistory(next);

            if (next) {
                setShowComments(false);
                setShowVersionHistory(false);
                setShowNotifications(false);

                await loadActivities();
            }
        };


    // =========================================================
    // NOTIFICATIONS
    // =========================================================

    const loadNotifications = async () => {
        setNotificationsLoading(true);

        try {
            const response =
                await api.get("/notifications");

            setNotifications(
                response.data.notifications || []
            );
        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error.response?.data ||
                error.message
            );
        } finally {
            setNotificationsLoading(false);
        }
    };


    const handleToggleNotifications = async () => {
        const next = !showNotifications;

        setShowNotifications(next);

        if (next) {
            setShowShare(false);
            setShowComments(false);
            setShowVersionHistory(false);
            setShowActivityHistory(false);

            await loadNotifications();
        }
    };


    const handleMarkNotificationRead =
        async (notificationId) => {
            try {
                await api.patch(
                    `/notifications/${notificationId}/read`
                );

                setNotifications((previous) =>
                    previous.map((notification) =>
                        notification._id ===
                            notificationId
                            ? {
                                ...notification,
                                read: true,
                            }
                            : notification
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to mark notification as read:",
                    error.response?.data ||
                    error.message
                );
            }
        };


    const handleMarkAllNotificationsRead =
        async () => {
            try {
                await api.patch(
                    "/notifications/read-all"
                );

                setNotifications((previous) =>
                    previous.map((notification) => ({
                        ...notification,
                        read: true,
                    }))
                );
            } catch (error) {
                console.error(
                    "Failed to mark all notifications read:",
                    error.response?.data ||
                    error.message
                );
            }
        };


    const handleDeleteNotification =
        async (notificationId) => {
            try {
                await api.delete(
                    `/notifications/${notificationId}`
                );

                setNotifications((previous) =>
                    previous.filter(
                        (notification) =>
                            notification._id !==
                            notificationId
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to delete notification:",
                    error.response?.data ||
                    error.message
                );
            }
        };


    const unreadNotificationCount =
        notifications.filter(
            (notification) => !notification.read
        ).length;


    // Refresh notifications periodically so new collaborator
    // events appear without requiring a page refresh.
    useEffect(() => {
        if (!document) return;

        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 30000);

        return () => {
            clearInterval(interval);
        };
    }, [document]);


    const handleRestoreVersion =
        async (version) => {

            if (
                permission === "viewer" ||
                !editor
            ) {
                return;
            }


            const confirmed =
                window.confirm(
                    `Restore this version from ${new Date(
                        version.createdAt
                    ).toLocaleString()}?`
                );


            if (!confirmed) {
                return;
            }


            setRestoringVersion(true);


            const restoredTitle =
                version.title ||
                "Untitled document";

            const restoredContent =
                version.content || "";


            try {

                // Update the collaborative editor
                editor.commands.setContent(
                    restoredContent,
                    false
                );


                setTitle(
                    restoredTitle
                );


                // Save restored document
                await api.put(
                    `/documents/${id}`,
                    {
                        title:
                            restoredTitle,

                        content:
                            restoredContent,
                    }
                );


                // Create a new snapshot
                // representing the restore action.
                await createVersionSnapshot(
                    restoredTitle,
                    restoredContent,
                    true
                );


                await loadVersions();


                alert(
                    "Version restored successfully."
                );


            } catch (error) {

                console.error(
                    "Failed to restore version:",
                    error.response?.data ||
                    error.message
                );


                alert(
                    error.response?.data?.message ||
                    "Failed to restore version."
                );


            } finally {

                setRestoringVersion(false);

            }

        };

    // =========================================================
    // CONNECTION INFO
    // =========================================================

    const getConnectionInfo =
        () => {

            if (!isOnline) {

                return {
                    text: "🔴 Offline",
                    color: "#dc2626",
                };

            }


            if (
                connectionStatus ===
                "connected"
            ) {

                return {
                    text: "🟢 Live",
                    color: "#16a34a",
                };

            }


            if (
                connectionStatus ===
                "connecting"
            ) {

                return {
                    text: "🟡 Connecting...",
                    color: "#f59e0b",
                };

            }


            return {
                text: "🟡 Reconnecting...",
                color: "#f59e0b",
            };

        };


    const connectionInfo =
        getConnectionInfo();


    // =========================================================
    // CLEANUP
    // =========================================================

    useEffect(() => {

        return () => {

            provider.destroy();

            persistence?.destroy();

            ydoc.destroy();

        };

    }, [
        provider,
        persistence,
        ydoc,
    ]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="collabdocs-editor-loading">
                <div className="collabdocs-loading-glow" />
                <div className="collabdocs-loading-card">
                    <div className="collabdocs-loading-spinner" />
                    <div className="collabdocs-loading-title">Loading document</div>
                    <div className="collabdocs-loading-subtitle">Preparing your workspace...</div>
                </div>
                <style>{`
                    .collabdocs-editor-loading {
                        position: fixed;
                        inset: 0;
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background:
                            radial-gradient(circle at 15% 5%, rgba(124,58,237,.16), transparent 30%),
                            radial-gradient(circle at 85% 15%, rgba(59,130,246,.12), transparent 28%),
                            radial-gradient(circle at 50% 100%, rgba(139,92,246,.08), transparent 34%),
                            #07080d;
                        color: #f5f7fb;
                        font-family: Arial, sans-serif;
                    }
                    .collabdocs-editor-loading::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        pointer-events: none;
                        background-image:
                            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
                        background-size: 42px 42px;
                        mask-image: linear-gradient(to bottom, black, transparent 85%);
                    }
                    .collabdocs-loading-glow {
                        position: absolute;
                        width: 260px;
                        height: 260px;
                        border-radius: 50%;
                        background: rgba(124,58,237,.14);
                        filter: blur(70px);
                        animation: collabdocsLoadingPulse 2.4s ease-in-out infinite;
                    }
                    .collabdocs-loading-card {
                        position: relative;
                        z-index: 1;
                        min-width: 250px;
                        padding: 30px 34px;
                        text-align: center;
                        border: 1px solid rgba(255,255,255,.10);
                        border-radius: 22px;
                        background: rgba(15,17,26,.62);
                        backdrop-filter: blur(22px) saturate(145%);
                        -webkit-backdrop-filter: blur(22px) saturate(145%);
                        box-shadow: 0 24px 70px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.05);
                    }
                    .collabdocs-loading-spinner {
                        width: 28px;
                        height: 28px;
                        margin: 0 auto 18px;
                        border: 2px solid rgba(255,255,255,.14);
                        border-top-color: #a78bfa;
                        border-right-color: #60a5fa;
                        border-radius: 50%;
                        animation: collabdocsLoadingSpin .8s linear infinite;
                    }
                    .collabdocs-loading-title {
                        font-size: 15px;
                        font-weight: 600;
                        letter-spacing: .01em;
                    }
                    .collabdocs-loading-subtitle {
                        margin-top: 7px;
                        color: #8f96a6;
                        font-size: 12px;
                    }
                    @keyframes collabdocsLoadingSpin { to { transform: rotate(360deg); } }
                    @keyframes collabdocsLoadingPulse {
                        0%,100% { transform: scale(.92); opacity: .55; }
                        50% { transform: scale(1.08); opacity: .9; }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .collabdocs-loading-spinner,
                        .collabdocs-loading-glow { animation: none; }
                    }
                `}</style>
            </div>
        );

    }


    // =========================================================
    // DOCUMENT NOT FOUND
    // =========================================================

    if (!document) {

        return (
            <div
                style={{
                    padding: "40px",
                    fontFamily: "Arial",
                }}
            >

                <h2>
                    Document not found
                </h2>


                <button
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Back to Dashboard
                </button>

            </div>
        );

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div
            className="collabdocs-editor-page"
            style={{
                minHeight: "100vh",
                background: "#07080d",
                fontFamily:
                    "Arial, sans-serif",
            }}
        >
            <style>{`
                .collabdocs-editor-page {
                    --cd-bg: #07080d;
                    --cd-panel: rgba(16, 18, 27, 0.72);
                    --cd-panel-strong: rgba(20, 22, 32, 0.88);
                    --cd-border: rgba(255,255,255,0.10);
                    --cd-text: #f5f7fb;
                    --cd-muted: #9ca3af;
                    --cd-accent: #8b5cf6;
                    position: fixed;
                    inset: 0;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    color: var(--cd-text);
                    background:
                        radial-gradient(circle at 15% 5%, rgba(124,58,237,.16), transparent 30%),
                        radial-gradient(circle at 85% 15%, rgba(59,130,246,.12), transparent 28%),
                        radial-gradient(circle at 50% 100%, rgba(139,92,246,.08), transparent 34%),
                        #07080d !important;
                }

                .collabdocs-editor-page::before {
                    content: "";
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    background:
                        linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
                    background-size: 42px 42px;
                    mask-image: linear-gradient(to bottom, rgba(0,0,0,.5), transparent 75%);
                    opacity: .32;
                }

                .collabdocs-editor-header {
                    position: absolute !important;
                    z-index: 1000;
                    top: 14px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: min(1180px, calc(100vw - 28px));
                    height: 58px !important;
                    padding: 0 12px !important;
                    gap: 10px !important;
                    border: 1px solid rgba(255,255,255,.10) !important;
                    border-radius: 22px !important;
                    background: rgba(14,16,24,.66) !important;
                    backdrop-filter: blur(24px) saturate(145%);
                    -webkit-backdrop-filter: blur(24px) saturate(145%);
                    box-shadow:
                        0 18px 55px rgba(0,0,0,.34),
                        inset 0 1px 0 rgba(255,255,255,.06);
                }

                .collabdocs-editor-header button,
                .collabdocs-editor-page button {
                    transition:
                        transform 320ms cubic-bezier(.22,1,.36,1),
                        background-color 260ms ease,
                        border-color 260ms ease,
                        box-shadow 320ms ease,
                        color 220ms ease,
                        opacity 220ms ease;
                }

                .collabdocs-editor-header button:hover:not(:disabled),
                .collabdocs-editor-page button:hover:not(:disabled) {
                    transform: translateY(-1px);
                }

                .collabdocs-editor-header button:active:not(:disabled),
                .collabdocs-editor-page button:active:not(:disabled) {
                    transform: scale(.985);
                }

                .collabdocs-editor-back {
                    background: rgba(255,255,255,.055) !important;
                    color: #f3f4f6 !important;
                    border: 1px solid rgba(255,255,255,.10) !important;
                    border-radius: 14px !important;
                }

                .collabdocs-editor-title {
                    color: #f8fafc !important;
                    caret-color: #a78bfa;
                }

                .collabdocs-editor-main {
                    position: absolute !important;
                    inset: 88px 0 0 !important;
                    width: 100% !important;
                    margin: 0 auto !important;
                    padding: 34px 24px 80px !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    display: flex !important;
                    justify-content: center;
                    align-items: flex-start !important;
                    gap: 20px !important;
                    scroll-behavior: smooth;
                    overscroll-behavior: contain;
                    scrollbar-width: none;
                }

                .collabdocs-editor-main::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }

                .collabdocs-editor-paper {
                    border: 1px solid rgba(255,255,255,.10) !important;
                    border-radius: 18px !important;
                    background: rgba(255,255,255,.045) !important;
                    box-shadow:
                        0 30px 90px rgba(0,0,0,.42),
                        0 0 0 1px rgba(255,255,255,.02);
                    overflow: hidden !important;
                    transition: box-shadow 500ms cubic-bezier(.22,1,.36,1), transform 500ms cubic-bezier(.22,1,.36,1);
                }

                .collabdocs-editor-paper:hover {
                    box-shadow:
                        0 36px 100px rgba(0,0,0,.50),
                        0 0 50px rgba(124,58,237,.06);
                }

                .collabdocs-editor-toolbar {
                    position: relative !important;
                    z-index: 50 !important;
                    overflow: visible !important;
                    isolation: isolate;
                    background: rgba(17,19,28,.92) !important;
                    border-bottom: 1px solid rgba(255,255,255,.09) !important;
                    color: #e5e7eb;
                    backdrop-filter: blur(18px);
                    -webkit-backdrop-filter: blur(18px);
                }

                .collabdocs-editor-toolbar button {
                    color: #d1d5db !important;
                    border-color: rgba(255,255,255,.10) !important;
                    background: rgba(255,255,255,.045) !important;
                    border-radius: 9px !important;
                }

                /* Color swatches override the generic dark-toolbar button rule. */
                .collabdocs-editor-toolbar .collabdocs-color-swatch,
                .collabdocs-editor-toolbar .collabdocs-highlight-swatch {
                    background: var(--swatch-color) !important;
                    color: transparent !important;
                    border: 1px solid rgba(0,0,0,.14) !important;
                    box-shadow: 0 1px 2px rgba(15,23,42,.12) !important;
                    border-radius: 50% !important;
                }

                .collabdocs-editor-toolbar .collabdocs-highlight-swatch {
                    border-radius: 4px !important;
                }

                .collabdocs-editor-toolbar .collabdocs-color-swatch:hover,
                .collabdocs-editor-toolbar .collabdocs-highlight-swatch:hover {
                    background: var(--swatch-color) !important;
                    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px rgba(124,58,237,.72) !important;
                }

                #collabdocs-text-color-palette,
                #collabdocs-highlight-palette {
                    z-index: 5000 !important;
                    isolation: isolate;
                }

                /* Clear, unmistakable active formatting state. Inline styles are
                   intentionally reinforced here because the dark-glass toolbar
                   uses !important backgrounds elsewhere. */
                .collabdocs-editor-toolbar button[style*="--toolbar-active: 1"] {
                    background: linear-gradient(180deg, #ede9fe 0%, #ddd6fe 100%) !important;
                    color: #4c1d95 !important;
                    border-color: #8b5cf6 !important;
                    box-shadow: 0 0 0 2px rgba(139,92,246,.18), 0 6px 18px rgba(124,58,237,.22) !important;
                    transform: translateY(-1px) !important;
                    font-weight: 800 !important;
                }

                .collabdocs-editor-toolbar button[style*="--toolbar-active: 0"] {
                    background: rgba(255,255,255,.045) !important;
                    color: #d1d5db !important;
                    border-color: rgba(255,255,255,.10) !important;
                    box-shadow: none !important;
                    transform: translateY(0) !important;
                }

                .collabdocs-editor-toolbar button[style*="--toolbar-active: 1"]:hover:not(:disabled) {
                    background: linear-gradient(180deg, #f5f3ff 0%, #ddd6fe 100%) !important;
                    color: #4c1d95 !important;
                    border-color: #7c3aed !important;
                }

                .collabdocs-editor-toolbar button:hover:not(:disabled) {
                    background: rgba(139,92,246,.16) !important;
                    border-color: rgba(167,139,250,.30) !important;
                    color: #fff !important;
                    box-shadow: 0 8px 22px rgba(0,0,0,.18);
                }

                .collabdocs-editor-findbar {
                    position: relative !important;
                    z-index: 10 !important;
                    background: rgba(18,20,29,.96) !important;
                    border-bottom: 1px solid rgba(255,255,255,.08) !important;
                }

                .collabdocs-editor-findbar input {
                    background: rgba(255,255,255,.055) !important;
                    color: #f9fafb !important;
                    border-color: rgba(255,255,255,.10) !important;
                }

                .collabdocs-editor-findbar button {
                    background: rgba(255,255,255,.055) !important;
                    color: #e5e7eb !important;
                    border-color: rgba(255,255,255,.10) !important;
                }

                .collabdocs-editor-page .ProseMirror {
                    background: #ffffff;
                    color: #202124;
                }

                /* Keep the document at its original size. Side panels live
                   independently in the empty right side of the viewport. */
                .collabdocs-editor-main {
                    max-width: 900px !important;
                    width: 900px !important;
                    box-sizing: border-box !important;
                }

                .collabdocs-editor-sidepanel {
                    position: fixed !important;
                    top: 88px !important;
                    right: 24px !important;
                    width: 320px !important;
                    max-width: calc(100vw - 48px) !important;
                    max-height: calc(100vh - 112px) !important;
                    height: auto !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                    z-index: 80 !important;
                    box-sizing: border-box !important;

                    /* Intentionally different from the main glass UI so the
                       written content remains easy to scan. */
                    background: #11151f !important;
                    border: 1px solid rgba(139,92,246,.24) !important;
                    border-radius: 16px !important;
                    box-shadow:
                        0 24px 70px rgba(0,0,0,.48),
                        0 0 0 1px rgba(255,255,255,.025),
                        0 0 35px rgba(124,58,237,.08) !important;
                    color: #f4f6fb !important;
                    backdrop-filter: blur(18px);
                    -webkit-backdrop-filter: blur(18px);
                    animation: collabdocsPanelIn 360ms cubic-bezier(.22,1,.36,1) both;
                }

                .collabdocs-editor-sidepanel::-webkit-scrollbar {
                    width: 0 !important;
                    height: 0 !important;
                    display: none !important;
                }

                .collabdocs-editor-sidepanel > div:first-child {
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(255,255,255,.08);
                }

                .collabdocs-editor-sidepanel input,
                .collabdocs-editor-sidepanel textarea,
                .collabdocs-editor-sidepanel select {
                    background: #191e2a !important;
                    color: #f8fafc !important;
                    border-color: rgba(255,255,255,.12) !important;
                    border-radius: 9px !important;
                }

                .collabdocs-editor-sidepanel textarea::placeholder,
                .collabdocs-editor-sidepanel input::placeholder {
                    color: #7f899b !important;
                }

                .collabdocs-editor-sidepanel button {
                    background: #191e2a !important;
                    color: #e9edf5 !important;
                    border-color: rgba(255,255,255,.10) !important;
                    border-radius: 9px !important;
                    transition: transform 220ms cubic-bezier(.22,1,.36,1),
                                background 220ms ease,
                                border-color 220ms ease,
                                box-shadow 220ms ease !important;
                }

                .collabdocs-editor-sidepanel button:hover:not(:disabled) {
                    background: #232a3a !important;
                    border-color: rgba(167,139,250,.38) !important;
                    box-shadow: 0 8px 22px rgba(0,0,0,.22) !important;
                    transform: translateY(-1px);
                }

                /* Make names/people visually distinct from body copy. */
                .collabdocs-editor-sidepanel strong {
                    color: #ffffff !important;
                    letter-spacing: -.01em;
                }

                .collabdocs-editor-sidepanel [style*="fontWeight: \"700\"],
                .collabdocs-editor-sidepanel [style*="fontWeight:\"700\"],
                .collabdocs-editor-sidepanel [style*="font-weight: 700"] {
                    color: #c4b5fd !important;
                }

                .collabdocs-editor-sidepanel p {
                    color: #dbe2ee !important;
                }

                .collabdocs-editor-sidepanel small {
                    color: #8d98aa !important;
                }

                @keyframes collabdocsPanelIn {
                    from {
                        opacity: 0;
                        transform: translate3d(22px, 0, 0) scale(.985);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }


                .collabdocs-editor-sidepanel [style*="color: #111827"],
                .collabdocs-editor-sidepanel [style*="color:#111827"] {
                    color: #ffffff !important;
                }

                .collabdocs-editor-sidepanel [style*="color: #374151"],
                .collabdocs-editor-sidepanel [style*="color:#374151"] {
                    color: #dbe2ee !important;
                }

                .collabdocs-editor-sidepanel [style*="color: #6b7280"],
                .collabdocs-editor-sidepanel [style*="color:#6b7280"] {
                    color: #8d98aa !important;
                }

                .collabdocs-editor-page [style*="color: #374151"],
                .collabdocs-editor-page [style*="color:#374151"] {
                    color: #d1d5db !important;
                }

                .collabdocs-editor-page [style*="color: #6b7280"],
                .collabdocs-editor-page [style*="color:#6b7280"] {
                    color: #9ca3af !important;
                }

                .collabdocs-editor-page [style*="borderBottom: 1px solid #e5e7eb"] {
                    border-bottom-color: rgba(255,255,255,.08) !important;
                }

                @media (max-width: 800px) {
                    .collabdocs-editor-header {
                        width: calc(100vw - 18px);
                        top: 9px;
                        height: 56px !important;
                        border-radius: 19px !important;
                    }

                    .collabdocs-editor-header > span {
                        display: none;
                    }

                    .collabdocs-editor-main {
                        inset: 78px 0 0 !important;
                        padding: 20px 10px 50px !important;
                    }

                    .collabdocs-editor-main {
                        width: 100% !important;
                        max-width: 100% !important;
                    }

                    .collabdocs-editor-sidepanel {
                        position: fixed !important;
                        top: 78px !important;
                        right: 10px !important;
                        left: 10px !important;
                        bottom: 10px !important;
                        width: auto !important;
                        max-width: none !important;
                        max-height: none !important;
                        z-index: 90 !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .collabdocs-editor-page *,
                    .collabdocs-editor-page *::before,
                    .collabdocs-editor-page *::after {
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                        animation-duration: .01ms !important;
                    }
                }
                /* =========================================================
                   PROFESSIONAL LIGHT SIDE PANELS
                   The panels stay mounted so open AND close animate smoothly.
                ========================================================= */

                .collabdocs-editor-sidepanel {
                    position: fixed !important;
                    top: 88px !important;
                    right: 24px !important;
                    width: 320px !important;
                    max-width: calc(100vw - 48px) !important;
                    height: calc(100vh - 112px) !important;
                    max-height: calc(100vh - 112px) !important;
                    box-sizing: border-box !important;
                    z-index: 100 !important;

                    background: #f7f9fc !important;
                    color: #202124 !important;
                    border: 1px solid #dfe3eb !important;
                    border-radius: 18px !important;
                    box-shadow:
                        0 22px 60px rgba(15, 23, 42, .20),
                        0 4px 18px rgba(15, 23, 42, .08) !important;

                    overflow-x: hidden !important;
                    overflow-y: auto !important;
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;

                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                    transform: translate3d(26px, 0, 0) scale(.985);
                    transform-origin: right center;

                    transition:
                        opacity 360ms ease,
                        transform 440ms cubic-bezier(.22, 1, .36, 1),
                        visibility 0s linear 440ms,
                        box-shadow 360ms ease !important;

                    backdrop-filter: blur(18px) saturate(115%);
                    -webkit-backdrop-filter: blur(18px) saturate(115%);
                }

                .collabdocs-editor-sidepanel.is-open {
                    opacity: 1 !important;
                    visibility: visible !important;
                    pointer-events: auto !important;
                    transform: translate3d(0, 0, 0) scale(1) !important;
                    transition:
                        opacity 300ms ease,
                        transform 440ms cubic-bezier(.22, 1, .36, 1),
                        visibility 0s linear 0s,
                        box-shadow 360ms ease !important;
                }

                .collabdocs-editor-sidepanel::-webkit-scrollbar {
                    width: 0 !important;
                    height: 0 !important;
                    display: none !important;
                }

                /* Clean light panel header / content surfaces. */
                .collabdocs-editor-sidepanel > div:first-child {
                    border-bottom: 1px solid #e5e7eb !important;
                    background: #f7f9fc !important;
                }

                .collabdocs-editor-sidepanel > div {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .collabdocs-editor-sidepanel > div::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                    display: none;
                }

                /* Make ordinary panel copy readable even where old inline
                   dark-theme colors are still present. */
                .collabdocs-editor-sidepanel p,
                .collabdocs-editor-sidepanel span,
                .collabdocs-editor-sidepanel label,
                .collabdocs-editor-sidepanel li,
                .collabdocs-editor-sidepanel h1,
                .collabdocs-editor-sidepanel h2,
                .collabdocs-editor-sidepanel h3,
                .collabdocs-editor-sidepanel h4,
                .collabdocs-editor-sidepanel div[style*="color"] {
                    color: #3c4043 !important;
                }

                .collabdocs-editor-sidepanel strong,
                .collabdocs-editor-sidepanel div[style*="font-weight"],
                .collabdocs-editor-sidepanel div[style*="fontWeight"] {
                    color: #202124 !important;
                }

                /* Person names get a clear accent so they don't blend into
                   timestamps/body copy. */
                .collabdocs-editor-sidepanel strong,
                .collabdocs-editor-sidepanel div[style*="font-weight: 700"],
                .collabdocs-editor-sidepanel div[style*="font-weight:700"] {
                    color: #5b3cc4 !important;
                }

                .collabdocs-editor-sidepanel small {
                    color: #70757a !important;
                }

                /* Inputs are deliberately white and calm for readability. */
                .collabdocs-editor-sidepanel input,
                .collabdocs-editor-sidepanel textarea,
                .collabdocs-editor-sidepanel select {
                    background: #ffffff !important;
                    color: #202124 !important;
                    border: 1px solid #d9dee8 !important;
                    border-radius: 10px !important;
                    box-shadow: 0 1px 2px rgba(15,23,42,.03) !important;
                    outline: none !important;
                    transition:
                        border-color 180ms ease,
                        box-shadow 180ms ease,
                        background 180ms ease !important;
                }

                .collabdocs-editor-sidepanel input:focus,
                .collabdocs-editor-sidepanel textarea:focus,
                .collabdocs-editor-sidepanel select:focus {
                    border-color: #9b82e8 !important;
                    box-shadow: 0 0 0 3px rgba(124,58,237,.10) !important;
                    background: #ffffff !important;
                }

                .collabdocs-editor-sidepanel input::placeholder,
                .collabdocs-editor-sidepanel textarea::placeholder {
                    color: #9aa0a6 !important;
                }

                /* Buttons stay mostly white/neutral, with a restrained
                   purple hover that matches the application chrome. */
                .collabdocs-editor-sidepanel button {
                    border-radius: 9px !important;
                    transition:
                        transform 220ms cubic-bezier(.22,1,.36,1),
                        background-color 220ms ease,
                        border-color 220ms ease,
                        box-shadow 220ms ease,
                        color 180ms ease !important;
                }

                .collabdocs-editor-sidepanel button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 5px 16px rgba(15,23,42,.08) !important;
                }

                .collabdocs-editor-sidepanel button:active:not(:disabled) {
                    transform: translateY(0) scale(.985);
                }

                /* Keep primary dark action buttons readable. */
                .collabdocs-editor-sidepanel button[style*="background: #111827"],
                .collabdocs-editor-sidepanel button[style*="background:#111827"] {
                    color: #ffffff !important;
                    background: #202124 !important;
                }

                /* Light separators and quoted text blocks. */
                .collabdocs-editor-sidepanel hr {
                    border: 0 !important;
                    border-top: 1px solid #e5e7eb !important;
                }

                /* Smooth content reveal inside the panel. */
                .collabdocs-editor-sidepanel > * {
                    opacity: .96;
                    transform: translate3d(8px, 0, 0);
                    transition:
                        opacity 380ms cubic-bezier(.22,1,.36,1),
                        transform 520ms cubic-bezier(.22,1,.36,1);
                }

                .collabdocs-editor-sidepanel.is-open > * {
                    opacity: 1;
                    transform: translate3d(0, 0, 0);
                }

                /* Slightly different accents for each panel. */
                .collabdocs-editor-sidepanel[data-panel="comments"] {
                    border-top: 3px solid #8b5cf6 !important;
                }

                .collabdocs-editor-sidepanel[data-panel="history"] {
                    border-top: 3px solid #3b82f6 !important;
                }

                .collabdocs-editor-sidepanel[data-panel="activity"] {
                    border-top: 3px solid #14b8a6 !important;
                }

                @media (max-width: 1250px) {
                    .collabdocs-editor-sidepanel {
                        right: 16px !important;
                        width: 320px !important;
                    }
                }

                @media (max-width: 760px) {
                    .collabdocs-editor-sidepanel {
                        top: 82px !important;
                        right: 12px !important;
                        left: 12px !important;
                        width: auto !important;
                        max-width: none !important;
                        height: calc(100vh - 94px) !important;
                        max-height: calc(100vh - 94px) !important;
                        border-radius: 16px !important;
                        transform: translate3d(0, 18px, 0) scale(.985);
                    }

                    .collabdocs-editor-sidepanel.is-open {
                        transform: translate3d(0, 0, 0) scale(1) !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .collabdocs-editor-sidepanel,
                    .collabdocs-editor-sidepanel > * {
                        transition: none !important;
                    }
                }
                `}</style>

            {/* =================================================
                HEADER
            ================================================= */}

            <header
                className="collabdocs-editor-header"
                style={{
                    height: "64px",
                    background: "white",
                    borderBottom:
                        "1px solid #e5e7eb",

                    display: "flex",
                    alignItems: "center",

                    gap: "20px",

                    padding: "0 24px",

                    position: "relative",
                }}
            >

                {/* BACK */}

                <button
                    className="collabdocs-editor-back"
                    onClick={() =>
                        navigate("/")
                    }
                    style={{
                        padding:
                            "8px 12px",

                        cursor:
                            "pointer",

                        border:
                            "1px solid #ddd",

                        background:
                            "white",

                        borderRadius:
                            "6px",
                    }}
                >
                    ← Back
                </button>


                {/* TITLE */}

                <input
                    className="collabdocs-editor-title"
                    value={title}
                    disabled={
                        permission ===
                        "viewer"
                    }
                    onChange={(e) =>
                        setTitle(
                            e.target.value
                        )
                    }
                    style={{
                        border: "none",
                        outline: "none",

                        fontSize: "20px",
                        fontWeight: "600",

                        flex: 1,

                        background:
                            "transparent",
                    }}
                />


                {/* CURRENT USER */}

                <span
                    style={{
                        fontSize: "13px",
                        color: "#ffffff",
                        fontWeight: "800",
                    }}
                >
                    {currentUser.name}
                </span>

                {/* ONLINE USERS */}

                <div
                    title={
                        onlineUsers.length === 1
                            ? "1 person online"
                            : `${onlineUsers.length} people online`
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "5px 9px",
                        borderRadius: "999px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                    }}
                >
                    <span
                        style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#22c55e",
                            display: "inline-block",
                            boxShadow:
                                "0 0 0 2px rgba(34,197,94,0.12)",
                        }}
                    />

                    <span
                        style={{
                            fontSize: "12px",
                            color: "#166534",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {onlineUsers.length} online
                    </span>
                </div>


                {/* PERMISSION */}

                {permission && (

                    <span
                        style={{
                            fontSize:
                                "11px",

                            padding:
                                "4px 8px",

                            borderRadius:
                                "999px",

                            background:
                                permission ===
                                    "owner"
                                    ? "#ede9fe"
                                    : permission ===
                                        "editor"
                                        ? "#dcfce7"
                                        : "#f3f4f6",

                            color:
                                permission ===
                                    "owner"
                                    ? "#6d28d9"
                                    : permission ===
                                        "editor"
                                        ? "#166534"
                                        : "#4b5563",

                            fontWeight:
                                "600",
                        }}
                    >
                        {permission}
                    </span>

                )}


                {/* COMMENT BUTTON */}

                <button
                    onClick={handleStartComment}
                    disabled={permission === "viewer"}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        background: "white",
                        color: "#374151",
                        fontWeight: "600",
                        cursor:
                            permission === "viewer"
                                ? "not-allowed"
                                : "pointer",
                        opacity:
                            permission === "viewer"
                                ? 0.5
                                : 1,
                        whiteSpace: "nowrap",
                    }}
                >
                    <MessageSquare size={16} />
                    Comment
                </button>


                {/* VERSION HISTORY BUTTON */}

                <button
                    onClick={handleToggleVersionHistory}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        background:
                            showVersionHistory
                                ? "#eff6ff"
                                : "white",
                        color:
                            showVersionHistory
                                ? "#2563eb"
                                : "#374151",
                        fontWeight: "600",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}
                    title="Version history"
                >
                    <History size={16} />
                    History
                </button>


                {/* ACTIVITY HISTORY BUTTON */}

                <button
                    onClick={handleToggleActivityHistory}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        background:
                            showActivityHistory
                                ? "#f0fdf4"
                                : "white",
                        color:
                            showActivityHistory
                                ? "#15803d"
                                : "#374151",
                        fontWeight: "600",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}
                    title="Activity history"
                >
                    <Activity size={16} />
                    Activity
                </button>


                {/* NOTIFICATIONS */}

                <div
                    style={{
                        position: "relative",
                    }}
                >
                    <button
                        type="button"
                        onClick={handleToggleNotifications}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                            border: showNotifications
                                ? "1px solid #8b5cf6"
                                : "1px solid #d1d5db",
                            borderRadius: "10px",
                            background: showNotifications
                                ? "linear-gradient(180deg, #ede9fe 0%, #ddd6fe 100%)"
                                : "white",
                            color: showNotifications
                                ? "#5b21b6"
                                : "#374151",
                            boxShadow: showNotifications
                                ? "0 0 0 3px rgba(124,58,237,.10), 0 6px 16px rgba(124,58,237,.12)"
                                : "0 1px 2px rgba(15,23,42,.04)",
                            transform: showNotifications ? "translateY(-1px)" : "translateY(0)",
                            transition: "background 220ms ease, border-color 220ms ease, color 180ms ease, box-shadow 260ms ease, transform 260ms cubic-bezier(.22,1,.36,1)",
                            cursor: "pointer",
                            position: "relative",
                        }}
                        title="Notifications"
                    >
                        <Bell size={18} />

                        {unreadNotificationCount > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-5px",
                                    minWidth: "18px",
                                    height: "18px",
                                    padding: "0 4px",
                                    borderRadius: "999px",
                                    background: "#dc2626",
                                    color: "white",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid white",
                                    boxSizing: "border-box",
                                }}
                            >
                                {unreadNotificationCount > 99
                                    ? "99+"
                                    : unreadNotificationCount}
                            </span>
                        )}
                    </button>
                </div>


                {/* NOTIFICATION PANEL */}

                <div
                    aria-hidden={!showNotifications}
                    className="collabdocs-notification-panel"
                    style={{
                        position: "absolute",
                        opacity: showNotifications ? 1 : 0,
                        visibility: showNotifications ? "visible" : "hidden",
                        pointerEvents: showNotifications ? "auto" : "none",
                        transform: showNotifications
                            ? "translate3d(0, 0, 0) scale(1)"
                            : "translate3d(0, -10px, 0) scale(.98)",
                        transition: "opacity 420ms cubic-bezier(.22,1,.36,1), transform 520ms cubic-bezier(.22,1,.36,1), visibility 0s linear 520ms, box-shadow 420ms ease",
                        top: "58px",
                        right: "24px",
                        width: "380px",
                        maxWidth:
                            "calc(100vw - 40px)",
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow:
                            "0 15px 40px rgba(0,0,0,0.15)",
                        zIndex: 200,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            padding: "16px",
                            borderBottom:
                                "1px solid #e5e7eb",
                        }}
                    >
                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    color: "#111827",
                                }}
                            >
                                Notifications
                            </h3>

                            <p
                                style={{
                                    margin: "4px 0 0",
                                    fontSize: "12px",
                                    color: "#6b7280",
                                }}
                            >
                                {unreadNotificationCount} unread
                            </p>
                        </div>

                        {unreadNotificationCount > 0 && (
                            <button
                                type="button"
                                onClick={
                                    handleMarkAllNotificationsRead
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    color: "#2563eb",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div
                        style={{
                            maxHeight: "450px",
                            overflowY: "auto",
                        }}
                    >
                        {notificationsLoading ? (
                            <div
                                style={{
                                    padding: "40px 20px",
                                    textAlign: "center",
                                    color: "#6b7280",
                                    fontSize: "14px",
                                }}
                            >
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div
                                style={{
                                    padding: "50px 20px",
                                    textAlign: "center",
                                }}
                            >
                                <Bell
                                    size={32}
                                    color="#9ca3af"
                                    style={{
                                        marginBottom: "10px",
                                    }}
                                />

                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        color: "#374151",
                                    }}
                                >
                                    No notifications
                                </div>

                                <div
                                    style={{
                                        marginTop: "4px",
                                        fontSize: "12px",
                                        color: "#9ca3af",
                                    }}
                                >
                                    You're all caught up.
                                </div>
                            </div>
                        ) : (
                            notifications.map(
                                (notification) => (
                                    <div
                                        key={
                                            notification._id
                                        }
                                        onClick={() =>
                                            !notification.read &&
                                            handleMarkNotificationRead(
                                                notification._id
                                            )
                                        }
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            padding:
                                                "14px 16px",
                                            borderBottom:
                                                "1px solid #f3f4f6",
                                            background:
                                                notification.read
                                                    ? "white"
                                                    : "#eff6ff",
                                            cursor:
                                                notification.read
                                                    ? "default"
                                                    : "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                minWidth: "36px",
                                                borderRadius:
                                                    "50%",
                                                background:
                                                    "#e5e7eb",
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                                color: "#374151",
                                            }}
                                        >
                                            {(
                                                notification
                                                    .sender
                                                    ?.name ||
                                                notification
                                                    .sender
                                                    ?.email ||
                                                "U"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "13px",
                                                    lineHeight: 1.5,
                                                    color: "#111827",
                                                    fontWeight:
                                                        notification.read
                                                            ? "400"
                                                            : "600",
                                                }}
                                            >
                                                {notification.message ||
                                                    "You have a new notification."}
                                            </div>

                                            {notification.document
                                                ?.title && (
                                                    <div
                                                        style={{
                                                            marginTop: "3px",
                                                            fontSize: "11px",
                                                            color: "#6b7280",
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            notification
                                                                .document
                                                                .title
                                                        }
                                                    </div>
                                                )}

                                            <div
                                                style={{
                                                    marginTop: "5px",
                                                    fontSize: "11px",
                                                    color: "#9ca3af",
                                                }}
                                            >
                                                {notification.createdAt
                                                    ? new Date(
                                                        notification.createdAt
                                                    ).toLocaleString()
                                                    : ""}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDeleteNotification(
                                                    notification._id
                                                );
                                            }}
                                            style={{
                                                border: "none",
                                                background:
                                                    "transparent",
                                                color: "#9ca3af",
                                                cursor: "pointer",
                                                padding: "4px",
                                                height: "28px",
                                                flexShrink: 0,
                                            }}
                                            title="Delete notification"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>

                {/* SHARE BUTTON */}

                {permission ===
                    "owner" && (

                        <button
                            onClick={() => {
                                const next = !showShare;
                                setShowShare(next);

                                if (next) {
                                    setShowNotifications(false);
                                    setShowComments(false);
                                    setShowVersionHistory(false);
                                    setShowActivityHistory(false);
                                }
                            }}
                            style={{
                                padding:
                                    "8px 14px",

                                border:
                                    "none",

                                borderRadius:
                                    "6px",

                                background:
                                    "#2563eb",

                                color:
                                    "white",

                                fontWeight:
                                    "600",

                                cursor:
                                    "pointer",
                            }}
                        >
                            Share
                        </button>

                    )}


                {/* CONNECTION */}

                <span
                    style={{
                        fontSize:
                            "12px",

                        color:
                            connectionInfo.color,

                        fontWeight:
                            "500",

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    {
                        connectionInfo.text
                    }
                </span>


                {/* SAVE */}

                <span
                    style={{
                        fontSize:
                            "13px",

                        color:
                            saving
                                ? "#f59e0b"
                                : "#16a34a",

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    {permission ===
                        "viewer"
                        ? "View only"
                        : saving
                            ? "Saving..."
                            : "Saved"}
                </span>


                {/* =================================================
                    SHARE PANEL
                ================================================= */}

                {showShare &&
                    permission === "owner" && (
                        <div
                            style={{
                                position: "absolute",
                                top: "58px",
                                right: "24px",
                                width: "380px",
                                maxHeight: "calc(100vh - 90px)",
                                overflowY: "auto",
                                background: "#151821",
                                border: "1px solid #2b3040",
                                borderRadius: "14px",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                                padding: "20px",
                                zIndex: 1100,
                                color: "#f1f5f9",
                                boxSizing: "border-box",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#f8fafc", letterSpacing: "-0.02em" }}>
                                        Share document
                                    </h3>
                                    <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#8b93a3" }}>
                                        Give someone access to this document.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowShare(false)}
                                    style={{ width: "30px", height: "30px", border: "none", borderRadius: "7px", background: "transparent", color: "#8b93a3", cursor: "pointer", fontSize: "21px", lineHeight: 1 }}
                                >
                                    ×
                                </button>
                            </div>

                            <div style={{ border: "1px solid #2b3040", borderRadius: "10px", padding: "12px", marginBottom: "16px", background: "#1b1f2a" }}>
                                <div style={{ marginBottom: "10px" }}>
                                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#f1f5f9" }}>
                                        Anyone with the link
                                    </div>
                                    <div style={{ marginTop: "3px", fontSize: "11px", color: "#858da0" }}>
                                        Share this document without adding an email.
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "8px" }}>
                                    <select
                                        value={shareRole}
                                        onChange={(e) => setShareRole(e.target.value)}
                                        style={{ flex: 1, minWidth: 0, padding: "9px 10px", border: "1px solid #343a4a", borderRadius: "7px", background: "#11141c", color: "#e5e7eb", outline: "none", fontSize: "12px" }}
                                    >
                                        <option value="editor">Can edit</option>
                                        <option value="viewer">View only</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={handleGenerateShareLink}
                                        disabled={shareLinkLoading}
                                        style={{ padding: "9px 12px", border: "none", borderRadius: "7px", background: shareLinkLoading ? "#355a9c" : "#2563eb", color: "#fff", fontWeight: 600, fontSize: "12px", cursor: shareLinkLoading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
                                    >
                                        {shareLinkLoading ? "Updating..." : document?.shareLink?.enabled ? "Update link" : "Create link"}
                                    </button>
                                </div>

                                {document?.shareLink?.enabled && document?.shareLink?.token && (
                                    <div style={{ marginTop: "9px" }}>
                                        <div style={{ display: "flex", gap: "7px" }}>
                                            <input
                                                readOnly
                                                value={getShareUrl()}
                                                onFocus={(e) => e.target.select()}
                                                style={{ flex: 1, minWidth: 0, padding: "8px 9px", border: "1px solid #343a4a", borderRadius: "7px", background: "#11141c", color: "#cbd5e1", fontSize: "11px", outline: "none" }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCopyShareLink}
                                                disabled={copyingShareLink}
                                                style={{ padding: "8px 10px", border: "1px solid #343a4a", borderRadius: "7px", background: "#202531", color: "#e5e7eb", cursor: "pointer", fontWeight: 600, fontSize: "11px" }}
                                            >
                                                {copyingShareLink ? "Copying..." : "Copy"}
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleDisableShareLink}
                                            disabled={shareLinkLoading}
                                            style={{ marginTop: "8px", padding: 0, border: "none", background: "transparent", color: "#f87171", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}
                                        >
                                            Disable link
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                type="email"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                placeholder="user@example.com"
                                onKeyDown={(e) => { if (e.key === "Enter") handleShare(); }}
                                style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1px solid #343a4a", borderRadius: "7px", outline: "none", fontSize: "13px", marginBottom: "10px", background: "#11141c", color: "#f1f5f9" }}
                            />

                            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                                <select
                                    value={shareRole}
                                    onChange={(e) => setShareRole(e.target.value)}
                                    style={{ flex: 1, padding: "10px", border: "1px solid #343a4a", borderRadius: "7px", background: "#11141c", color: "#e5e7eb", cursor: "pointer", outline: "none", fontSize: "12px" }}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    disabled={sharing}
                                    style={{ padding: "10px 17px", border: "none", borderRadius: "7px", background: sharing ? "#355a9c" : "#2563eb", color: "#fff", fontWeight: 600, fontSize: "12px", cursor: sharing ? "not-allowed" : "pointer" }}
                                >
                                    {sharing ? "Sharing..." : "Share"}
                                </button>
                            </div>

                            {shareMessage && (
                                <div style={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.20)", color: "#86efac", padding: "8px 10px", borderRadius: "7px", fontSize: "11px", marginBottom: "12px" }}>
                                    {shareMessage}
                                </div>
                            )}

                            {shareError && (
                                <div style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#fca5a5", padding: "8px 10px", borderRadius: "7px", fontSize: "11px", marginBottom: "12px" }}>
                                    {shareError}
                                </div>
                            )}

                            <div style={{ borderTop: "1px solid #2b3040", paddingTop: "15px" }}>
                                <h4 style={{ margin: "0 0 8px", fontSize: "13px", color: "#e5e7eb", fontWeight: 600 }}>
                                    People with access
                                </h4>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0" }}>
                                    <div style={{ width: "32px", height: "32px", flexShrink: 0, borderRadius: "50%", background: "#27213d", color: "#a78bfa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
                                        {document.owner?.name?.charAt(0)?.toUpperCase() || "O"}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#fefeff", lineHeight: 1.3 }}>
                                            {document.owner?.name || "Owner"}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#8b93a3", marginTop: "2px", lineHeight: 1.3 }}>
                                            {document.owner?.email}
                                        </div>
                                    </div>
                                    <span style={{ flexShrink: 0, fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>
                                        Owner
                                    </span>
                                </div>

                                {document.collaborators?.map((collaborator) => (
                                    <div
                                        key={collaborator.user._id}
                                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderTop: "1px solid #252a36" }}
                                    >
                                        <div style={{ width: "32px", height: "32px", flexShrink: 0, borderRadius: "50%", background: "#172b4d", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
                                            {collaborator.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#f1f5f9", lineHeight: 1.3 }}>
                                                {collaborator.user?.name}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#8b93a3", marginTop: "2px", lineHeight: 1.3 }}>
                                                {collaborator.user?.email}
                                            </div>
                                        </div>

                                        {permission === "owner" ? (
                                            <select
                                                value={collaborator.role}
                                                onChange={(e) => handleRoleChange(collaborator.user._id, e.target.value)}
                                                style={{ padding: "5px 7px", border: "1px solid #343a4a", borderRadius: "6px", background: "#11141c", color: "#e5e7eb", fontSize: "11px", outline: "none" }}
                                            >
                                                <option value="editor">Editor</option>
                                                <option value="viewer">Viewer</option>
                                            </select>
                                        ) : (
                                            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>
                                                {collaborator.role}
                                            </span>
                                        )}

                                        {permission === "owner" && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCollaborator(collaborator.user._id)}
                                                style={{ border: "none", background: "transparent", color: "#f87171", cursor: "pointer", fontSize: "11px", padding: "4px 0" }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                {/* =================================================
                OFFLINE BANNER
            ================================================= */}

            </header>

            {!isOnline && (

                <div
                    style={{
                        background:
                            "#fee2e2",

                        color:
                            "#991b1b",

                        padding:
                            "10px 24px",

                        textAlign:
                            "center",

                        fontSize:
                            "13px",
                    }}
                >
                    You are offline.
                    Your changes will
                    continue locally and
                    sync when connection
                    returns.
                </div>

            )}


            {/* =================================================
                EDITOR
            ================================================= */}

            <main
                className="collabdocs-editor-main"
                style={{
                    maxWidth:
                        showComments || showVersionHistory
                            ? "1220px"
                            : "900px",

                    margin:
                        "40px auto",

                    padding:
                        "0 20px",

                    display: "flex",

                    gap: "20px",

                    alignItems: "flex-start",
                }}
            >

                {/* EDITOR */}

                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >

                    <div
                        className="collabdocs-editor-paper"
                        style={{
                            background:
                                "white",

                            minHeight:
                                "600px",

                            border:
                                "1px solid #e5e7eb",

                            borderRadius:
                                "10px",

                            boxShadow:
                                "0 8px 30px rgba(0,0,0,0.05)",

                            overflow:
                                "hidden",
                        }}
                    >

                        <EditorToolbar
                            editor={editor}
                            disabled={
                                permission === "viewer"
                            }
                            onFindReplace={() => {
                                setShowFindReplace((current) => !current);
                                setFindMessage("");
                            }}
                            findReplaceOpen={showFindReplace}
                            onExportPDF={handleExportPDF}
                            exportingPDF={exportingPDF}
                        />

                        {showFindReplace && (
                            <div
                                className="collabdocs-editor-findbar"
                                style={{
                                    padding: "12px",
                                    borderBottom: "1px solid #e5e7eb",
                                    background: "#ffffff",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <input
                                    value={findText}
                                    onChange={(e) =>
                                        handleFindTextChange(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            e.shiftKey
                                        ) {
                                            e.preventDefault();
                                            handleFindPrevious();
                                            return;
                                        }

                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleFindNext();
                                        }

                                        if (e.key === "Escape") {
                                            setShowFindReplace(false);
                                        }
                                    }}
                                    placeholder="Find"
                                    autoFocus
                                    style={{
                                        width: "180px",
                                        padding: "8px 10px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        outline: "none",
                                        fontSize: "13px",
                                    }}
                                />

                                <input
                                    value={replaceText}
                                    onChange={(e) =>
                                        setReplaceText(e.target.value)
                                    }
                                    placeholder="Replace with"
                                    disabled={permission === "viewer"}
                                    style={{
                                        width: "180px",
                                        padding: "8px 10px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        outline: "none",
                                        fontSize: "13px",
                                        opacity:
                                            permission === "viewer"
                                                ? 0.5
                                                : 1,
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={handleFindPrevious}
                                    style={{
                                        padding: "8px 10px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        background: "white",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                    }}
                                    title="Previous match"
                                >
                                    ↑
                                </button>

                                <button
                                    type="button"
                                    onClick={handleFindNext}
                                    style={{
                                        padding: "8px 10px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        background: "white",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                    }}
                                    title="Next match"
                                >
                                    ↓
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReplaceCurrent}
                                    disabled={
                                        permission === "viewer"
                                    }
                                    style={{
                                        padding: "8px 11px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        background: "white",
                                        color: "#374151",
                                        cursor:
                                            permission === "viewer"
                                                ? "not-allowed"
                                                : "pointer",
                                        fontSize: "12px",
                                        opacity:
                                            permission === "viewer"
                                                ? 0.5
                                                : 1,
                                    }}
                                >
                                    Replace
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReplaceAll}
                                    disabled={
                                        permission === "viewer"
                                    }
                                    style={{
                                        padding: "8px 11px",
                                        border: "none",
                                        borderRadius: "6px",
                                        background:
                                            permission === "viewer"
                                                ? "#93c5fd"
                                                : "#2563eb",
                                        color: "white",
                                        cursor:
                                            permission === "viewer"
                                                ? "not-allowed"
                                                : "pointer",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Replace all
                                </button>

                                <label
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        fontSize: "12px",
                                        color: "#4b5563",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={matchCase}
                                        onChange={(e) =>
                                            handleMatchCaseChange(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Match case
                                </label>

                                {findMessage && (
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color:
                                                findMessage === "No matches"
                                                    ? "#dc2626"
                                                    : "#6b7280",
                                            minWidth: "80px",
                                        }}
                                    >
                                        {findMessage}
                                    </span>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFindReplace(false);
                                        setFindMessage("");
                                    }}
                                    style={{
                                        marginLeft: "auto",
                                        width: "30px",
                                        height: "30px",
                                        border: "none",
                                        background: "transparent",
                                        color: "#6b7280",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    title="Close find and replace"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <style>{`
                            .collabdocs-editor .ProseMirror {
                                min-height: 600px;
                                padding: 56px 64px;
                                outline: none;
                                color: #202124;
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: 16px;
                                line-height: 1.72;
                                background: #fff;
                            }
                            .collabdocs-editor .ProseMirror h1 {
                                font-size: 30px;
                                line-height: 1.2;
                                font-weight: 500;
                                letter-spacing: -0.02em;
                                margin: 0 0 18px;
                            }
                            .collabdocs-editor .ProseMirror h2 {
                                font-size: 19px;
                                line-height: 1.35;
                                font-weight: 500;
                                color: #3c4043;
                                margin: 28px 0 10px;
                            }
                            .collabdocs-editor .ProseMirror h3 {
                                font-size: 16px;
                                font-weight: 500;
                                margin: 20px 0 8px;
                            }
                            .collabdocs-editor .ProseMirror p { margin: 0 0 12px; }
                            .collabdocs-editor .ProseMirror strong { font-weight: 600; }
                            .collabdocs-editor .ProseMirror hr { border: 0; border-top: 1px solid #dadce0; margin: 22px 0; }
                            .collabdocs-editor .ProseMirror blockquote {
                                border-left: 3px solid #d9dce1;
                                margin: 18px 0;
                                padding: 8px 18px;
                                color: #5f6368;
                                background: #f8f9fa;
                            }
                            .collabdocs-editor .ProseMirror img {
                                display: block;
                                max-width: 100%;
                                height: auto;
                                max-height: 360px;
                                object-fit: cover;
                                margin: 18px auto;
                                border-radius: 6px;
                            }
                            .collabdocs-editor .ProseMirror mark {
                                background: #fff4cc;
                                border-radius: 2px;
                                padding: 0 2px;
                            }
                /* Smooth notification popover */
                .collabdocs-notification-panel {
                    transform-origin: top right;
                    will-change: opacity, transform;
                    z-index: 300 !important;
                    overflow: hidden;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    transition-timing-function: cubic-bezier(.22,1,.36,1) !important;
                }

                .collabdocs-notification-panel > div {
                    transition: opacity 360ms ease, transform 460ms cubic-bezier(.22,1,.36,1);
                }

                .collabdocs-notification-panel button {
                    transition: transform 220ms cubic-bezier(.22,1,.36,1), background 220ms ease, color 180ms ease, box-shadow 220ms ease !important;
                }

                .collabdocs-notification-panel button:hover:not(:disabled) {
                    transform: translateY(-1px);
                }

                .collabdocs-notification-panel button:active:not(:disabled) {
                    transform: translateY(0) scale(.97);
                }

                .collabdocs-notification-panel button,
                .collabdocs-notification-panel [role="button"] {
                    transition: transform 220ms cubic-bezier(.22, 1, .36, 1),
                                background-color 220ms ease,
                                border-color 220ms ease,
                                box-shadow 220ms ease,
                                color 180ms ease !important;
                }

                .collabdocs-notification-panel button:hover:not(:disabled),
                .collabdocs-notification-panel [role="button"]:hover {
                    transform: translateY(-1px);
                }

                .collabdocs-notification-panel button:active:not(:disabled),
                .collabdocs-notification-panel [role="button"]:active {
                    transform: translateY(0) scale(.98);
                }

                `}</style>

                        <div className="collabdocs-editor">
                            <EditorContent
                                editor={editor}
                            />
                        </div>

                    </div>

                </div>


                {/* COMMENTS SIDEBAR */}

                <aside
                    aria-hidden={!showComments}
                    className={`collabdocs-editor-sidepanel ${showComments ? "is-open" : ""}`}
                    data-panel="comments"
                    style={{
                        opacity: showComments ? 1 : 0,
                        visibility: showComments ? "visible" : "hidden",
                        pointerEvents: showComments ? "auto" : "none",
                        transform: showComments
                            ? "translate3d(0, 0, 0) scale(1)"
                            : "translate3d(26px, 0, 0) scale(.985)",
                        transition: "opacity 300ms ease, transform 440ms cubic-bezier(.22, 1, .36, 1), visibility 0s linear 440ms",
                        width: "320px",
                        flexShrink: 0,
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        padding: "18px",
                        boxShadow:
                            "0 8px 30px rgba(0,0,0,0.05)",
                        position: "sticky",
                        top: "20px",
                        maxHeight:
                            "calc(100vh - 40px)",
                        overflowY: "auto",
                        boxSizing: "border-box",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                        }}
                    >

                        <div>
                            <strong
                                style={{
                                    fontSize: "16px",
                                }}
                            >
                                Comments
                            </strong>

                            <div
                                style={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    marginTop: "3px",
                                }}
                            >
                                {comments.length} comment
                                {comments.length === 1
                                    ? ""
                                    : "s"}
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                setShowComments(false)
                            }
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "20px",
                                color: "#6b7280",
                                lineHeight: 1,
                            }}
                            title="Close comments"
                        >
                            ×
                        </button>

                    </div>


                    {/* NEW COMMENT */}

                    {permission !== "viewer" &&
                        selectedText && (

                            <div
                                style={{
                                    marginBottom: "18px",
                                    paddingBottom: "18px",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <div
                                    style={{
                                        background: "#f3f4f6",
                                        borderLeft:
                                            "3px solid #3b82f6",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        marginBottom: "10px",
                                        fontSize: "13px",
                                        color: "#4b5563",
                                        lineHeight: 1.5,
                                        maxHeight: "100px",
                                        overflowY: "auto",
                                    }}
                                >
                                    &quot;{selectedText}&quot;
                                </div>

                                <textarea
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Write a comment..."
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        resize: "vertical",
                                        border:
                                            "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        fontFamily: "Arial, sans-serif",
                                        fontSize: "13px",
                                    }}
                                />

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginTop: "8px",
                                    }}
                                >

                                    <button
                                        onClick={
                                            handleCreateComment
                                        }
                                        disabled={
                                            commentLoading ||
                                            !commentText.trim()
                                        }
                                        style={{
                                            flex: 1,
                                            padding: "9px 12px",
                                            border: "none",
                                            borderRadius: "7px",
                                            background:
                                                commentLoading ||
                                                    !commentText.trim()
                                                    ? "#9ca3af"
                                                    : "#111827",
                                            color: "white",
                                            fontWeight: "600",
                                            cursor:
                                                commentLoading ||
                                                    !commentText.trim()
                                                    ? "not-allowed"
                                                    : "pointer",
                                        }}
                                    >
                                        {commentLoading
                                            ? "Adding..."
                                            : "Add comment"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedText("");
                                            setCommentText("");
                                        }}
                                        style={{
                                            padding: "9px 12px",
                                            border:
                                                "1px solid #d1d5db",
                                            borderRadius: "7px",
                                            background: "white",
                                            cursor: "pointer",
                                            color: "#374151",
                                        }}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        )}


                    {/* COMMENTS LIST */}

                    {comments.length === 0 ? (

                        <div
                            style={{
                                textAlign: "center",
                                padding: "30px 10px",
                                color: "#6b7280",
                                fontSize: "13px",
                            }}
                        >
                            <MessageSquare
                                size={28}
                                style={{
                                    marginBottom: "8px",
                                    opacity: 0.5,
                                }}
                            />

                            <div>
                                No comments yet.
                            </div>

                            {permission !== "viewer" && (
                                <div
                                    style={{
                                        marginTop: "5px",
                                        fontSize: "11px",
                                    }}
                                >
                                    Select text and click Comment.
                                </div>
                            )}
                        </div>

                    ) : (

                        comments.map((comment) => {
                            const isReply =
                                Boolean(comment.parentComment);

                            if (isReply) {
                                return null;
                            }

                            const replies =
                                comments.filter(
                                    (reply) =>
                                        String(
                                            reply.parentComment?._id ||
                                            reply.parentComment
                                        ) === String(comment._id)
                                );

                            return (
                                <div
                                    key={comment._id}
                                    style={{
                                        padding: "13px 0",
                                        borderBottom:
                                            "1px solid #e5e7eb",
                                        opacity:
                                            comment.resolved
                                                ? 0.55
                                                : 1,
                                    }}
                                >
                                    {comment.selectedText && (
                                        <div
                                            style={{
                                                background: "#f9fafb",
                                                borderLeft:
                                                    "3px solid #d1d5db",
                                                padding: "7px 9px",
                                                borderRadius: "4px",
                                                fontSize: "11px",
                                                color: "#6b7280",
                                                marginBottom: "9px",
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            &quot;{comment.selectedText}&quot;
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "50%",
                                                background: "#dbeafe",
                                                color: "#1d4ed8",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {comment.author?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "U"}
                                        </div>

                                        <div
                                            style={{
                                                minWidth: 0,
                                                flex: 1,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    fontWeight: "700",
                                                    color: "#111827",
                                                }}
                                            >
                                                {comment.author?.name ||
                                                    comment.author?.email ||
                                                    "Unknown user"}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: "10px",
                                                    color: "#9ca3af",
                                                }}
                                            >
                                                {comment.createdAt
                                                    ? new Date(
                                                        comment.createdAt
                                                    ).toLocaleString()
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: "13px",
                                            margin: "9px 0 10px",
                                            lineHeight: 1.5,
                                            color: "#374151",
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {comment.text}
                                    </p>

                                    {!comment.resolved &&
                                        permission !== "viewer" && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setReplyingTo(
                                                            replyingTo ===
                                                                comment._id
                                                                ? null
                                                                : comment._id
                                                        );
                                                        setReplyText("");
                                                    }}
                                                    style={{
                                                        border: "none",
                                                        background:
                                                            "transparent",
                                                        cursor: "pointer",
                                                        fontSize: "11px",
                                                        color: "#2563eb",
                                                        padding: 0,
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Reply
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleResolveComment(
                                                            comment._id
                                                        )
                                                    }
                                                    style={{
                                                        display:
                                                            "inline-flex",
                                                        alignItems:
                                                            "center",
                                                        gap: "4px",
                                                        border: "none",
                                                        background:
                                                            "transparent",
                                                        cursor: "pointer",
                                                        fontSize: "11px",
                                                        color: "#4b5563",
                                                        padding: 0,
                                                    }}
                                                >
                                                    <Check size={13} />
                                                    Resolve
                                                </button>
                                            </div>
                                        )}

                                    {comment.resolved && (
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                fontSize: "11px",
                                                color: "#16a34a",
                                                fontWeight: "600",
                                            }}
                                        >
                                            <Check size={13} />
                                            Resolved
                                        </span>
                                    )}

                                    {replyingTo === comment._id &&
                                        permission !== "viewer" &&
                                        !comment.resolved && (
                                            <div
                                                style={{
                                                    marginTop: "12px",
                                                    paddingLeft: "12px",
                                                    borderLeft:
                                                        "2px solid #e5e7eb",
                                                }}
                                            >
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) =>
                                                        setReplyText(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Write a reply..."
                                                    rows={3}
                                                    style={{
                                                        width: "100%",
                                                        resize: "vertical",
                                                        border:
                                                            "1px solid #d1d5db",
                                                        borderRadius: "7px",
                                                        padding: "9px",
                                                        outline: "none",
                                                        boxSizing:
                                                            "border-box",
                                                        fontFamily:
                                                            "Arial, sans-serif",
                                                        fontSize: "12px",
                                                    }}
                                                />

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "7px",
                                                        marginTop: "7px",
                                                    }}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            handleReplyToComment(
                                                                comment._id
                                                            )
                                                        }
                                                        disabled={
                                                            replyLoading ||
                                                            !replyText.trim()
                                                        }
                                                        style={{
                                                            padding:
                                                                "7px 10px",
                                                            border: "none",
                                                            borderRadius:
                                                                "6px",
                                                            background:
                                                                replyLoading ||
                                                                    !replyText.trim()
                                                                    ? "#9ca3af"
                                                                    : "#2563eb",
                                                            color: "white",
                                                            fontSize: "11px",
                                                            fontWeight:
                                                                "600",
                                                            cursor:
                                                                replyLoading ||
                                                                    !replyText.trim()
                                                                    ? "not-allowed"
                                                                    : "pointer",
                                                        }}
                                                    >
                                                        {replyLoading
                                                            ? "Replying..."
                                                            : "Reply"}
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setReplyingTo(
                                                                null
                                                            );
                                                            setReplyText("");
                                                        }}
                                                        style={{
                                                            padding:
                                                                "7px 10px",
                                                            border:
                                                                "1px solid #d1d5db",
                                                            borderRadius:
                                                                "6px",
                                                            background:
                                                                "white",
                                                            color: "#374151",
                                                            fontSize: "11px",
                                                            cursor:
                                                                "pointer",
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    {replies.length > 0 && (
                                        <div
                                            style={{
                                                marginTop: "12px",
                                                marginLeft: "12px",
                                                paddingLeft: "12px",
                                                borderLeft:
                                                    "2px solid #e5e7eb",
                                            }}
                                        >
                                            {replies.map((reply) => (
                                                <div
                                                    key={reply._id}
                                                    style={{
                                                        padding:
                                                            "8px 0 8px 0",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "7px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: "24px",
                                                                height: "24px",
                                                                borderRadius:
                                                                    "50%",
                                                                background:
                                                                    "#f3e8ff",
                                                                color: "#7e22ce",
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                fontSize:
                                                                    "10px",
                                                                fontWeight:
                                                                    "700",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {reply.author?.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase() ||
                                                                "U"}
                                                        </div>

                                                        <div
                                                            style={{
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                    fontWeight:
                                                                        "700",
                                                                    color: "#111827",
                                                                }}
                                                            >
                                                                {reply.author
                                                                    ?.name ||
                                                                    reply.author
                                                                        ?.email ||
                                                                    "Unknown user"}
                                                            </div>

                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "9px",
                                                                    color: "#9ca3af",
                                                                }}
                                                            >
                                                                {reply.createdAt
                                                                    ? new Date(
                                                                        reply.createdAt
                                                                    ).toLocaleString()
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p
                                                        style={{
                                                            fontSize:
                                                                "12px",
                                                            margin:
                                                                "7px 0 0 31px",
                                                            lineHeight: 1.5,
                                                            color: "#374151",
                                                            whiteSpace:
                                                                "pre-wrap",
                                                            wordBreak:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {reply.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })

                    )}

                </aside>

                {/* VERSION HISTORY SIDEBAR */}

                <aside
                    aria-hidden={!showVersionHistory}
                    className={`collabdocs-editor-sidepanel ${showVersionHistory ? "is-open" : ""}`}
                    data-panel="history"
                    style={{
                        opacity: showVersionHistory ? 1 : 0,
                        visibility: showVersionHistory ? "visible" : "hidden",
                        pointerEvents: showVersionHistory ? "auto" : "none",
                        transform: showVersionHistory
                            ? "translate3d(0, 0, 0) scale(1)"
                            : "translate3d(26px, 0, 0) scale(.985)",
                        transition: "opacity 300ms ease, transform 440ms cubic-bezier(.22, 1, .36, 1), visibility 0s linear 440ms",
                        width: "320px",
                        flexShrink: 0,
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        padding: "18px",
                        boxShadow:
                            "0 8px 30px rgba(0,0,0,0.05)",
                        position: "sticky",
                        top: "20px",
                        maxHeight:
                            "calc(100vh - 40px)",
                        overflowY: "auto",
                        boxSizing: "border-box",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                        }}
                    >
                        <div>
                            <strong
                                style={{
                                    fontSize: "16px",
                                }}
                            >
                                Version history
                            </strong>

                            <div
                                style={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    marginTop: "3px",
                                }}
                            >
                                {versions.length} saved version
                                {versions.length === 1 ? "" : "s"}
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                setShowVersionHistory(false)
                            }
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "20px",
                                color: "#6b7280",
                                lineHeight: 1,
                            }}
                            title="Close version history"
                        >
                            ×
                        </button>
                    </div>

                    {versionsLoading ? (
                        <div
                            style={{
                                padding: "30px 10px",
                                textAlign: "center",
                                color: "#6b7280",
                                fontSize: "13px",
                            }}
                        >
                            Loading history...
                        </div>
                    ) : versions.length === 0 ? (
                        <div
                            style={{
                                padding: "30px 10px",
                                textAlign: "center",
                                color: "#6b7280",
                                fontSize: "13px",
                            }}
                        >
                            No saved versions yet.
                        </div>
                    ) : (
                        versions.map((version, index) => (
                            <div
                                key={version._id}
                                style={{
                                    padding: "14px 0",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            minWidth: 0,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                color: "#111827",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {version.title ||
                                                "Untitled document"}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "10px",
                                                color: "#6b7280",
                                                marginTop: "4px",
                                            }}
                                        >
                                            {version.createdAt
                                                ? new Date(
                                                    version.createdAt
                                                ).toLocaleString()
                                                : "Unknown time"}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "10px",
                                                color: "#6b7280",
                                                marginTop: "3px",
                                            }}
                                        >
                                            By {version.createdBy?.name ||
                                                version.createdBy?.email ||
                                                "Unknown user"}
                                        </div>
                                    </div>

                                    {index === 0 && (
                                        <span
                                            style={{
                                                flexShrink: 0,
                                                padding: "3px 7px",
                                                borderRadius: "999px",
                                                background: "#dcfce7",
                                                color: "#166534",
                                                fontSize: "9px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            Latest
                                        </span>
                                    )}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "7px",
                                        marginTop: "10px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const preview = window.open(
                                                "",
                                                "_blank",
                                                "width=900,height=700"
                                            );

                                            if (!preview) {
                                                alert(
                                                    "Please allow pop-ups to preview this version."
                                                );
                                                return;
                                            }

                                            preview.document.title =
                                                version.title ||
                                                "Version preview";

                                            preview.globalThis.document.body.innerHTML =
                                                version.content ||
                                                "<p>Empty document</p>";

                                            preview.globalThis.document.body.style.cssText =
                                                "font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #111827;";
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: "7px 9px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "6px",
                                            background: "white",
                                            color: "#374151",
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Preview
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            permission === "viewer" ||
                                            restoringVersion
                                        }
                                        onClick={() =>
                                            handleRestoreVersion(version)
                                        }
                                        style={{
                                            flex: 1,
                                            padding: "7px 9px",
                                            border: "none",
                                            borderRadius: "6px",
                                            background:
                                                permission === "viewer" ||
                                                    restoringVersion
                                                    ? "#9ca3af"
                                                    : "#2563eb",
                                            color: "white",
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            cursor:
                                                permission === "viewer" ||
                                                    restoringVersion
                                                    ? "not-allowed"
                                                    : "pointer",
                                        }}
                                    >
                                        {restoringVersion
                                            ? "Restoring..."
                                            : "Restore"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </aside>

                {/* ACTIVITY HISTORY SIDEBAR */}

                <aside
                    aria-hidden={!showActivityHistory}
                    className={`collabdocs-editor-sidepanel ${showActivityHistory ? "is-open" : ""}`}
                    data-panel="activity"
                    style={{
                        opacity: showActivityHistory ? 1 : 0,
                        visibility: showActivityHistory ? "visible" : "hidden",
                        pointerEvents: showActivityHistory ? "auto" : "none",
                        transform: showActivityHistory
                            ? "translate3d(0, 0, 0) scale(1)"
                            : "translate3d(26px, 0, 0) scale(.985)",
                        transition: "opacity 300ms ease, transform 440ms cubic-bezier(.22, 1, .36, 1), visibility 0s linear 440ms",
                        width: "320px",
                        flexShrink: 0,
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        padding: "18px",
                        boxShadow:
                            "0 8px 30px rgba(0,0,0,0.05)",
                        position: "sticky",
                        top: "20px",
                        maxHeight:
                            "calc(100vh - 40px)",
                        overflowY: "auto",
                        boxSizing: "border-box",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px",
                        }}
                    >
                        <div>
                            <strong
                                style={{
                                    fontSize: "16px",
                                }}
                            >
                                Activity history
                            </strong>

                            <div
                                style={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    marginTop: "3px",
                                }}
                            >
                                {activities.length} event
                                {activities.length === 1 ? "" : "s"}
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                setShowActivityHistory(false)
                            }
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "20px",
                                color: "#6b7280",
                                lineHeight: 1,
                            }}
                            title="Close activity history"
                        >
                            ×
                        </button>
                    </div>

                    {activitiesLoading ? (
                        <div
                            style={{
                                padding: "30px 10px",
                                textAlign: "center",
                                color: "#6b7280",
                                fontSize: "13px",
                            }}
                        >
                            Loading activity...
                        </div>
                    ) : activities.length === 0 ? (
                        <div
                            style={{
                                padding: "30px 10px",
                                textAlign: "center",
                                color: "#6b7280",
                                fontSize: "13px",
                            }}
                        >
                            No activity yet.
                        </div>
                    ) : (
                        activities.map((activity) => {
                            const actionLabels = {
                                created: "created this document",
                                edited: "edited this document",
                                collaborator_added: "added a collaborator",
                                collaborator_removed: "removed a collaborator",
                                role_changed: "changed a collaborator role",
                                share_link_created: "created a share link",
                                share_link_disabled: "disabled the share link",
                                share_link_role_changed: "changed the share link role",
                                starred: "starred this document",
                                unstarred: "removed the star",
                                trashed: "moved this document to trash",
                                restored: "restored this document",
                                permanently_deleted: "permanently deleted this document",
                            };

                            const userName =
                                activity.user?.name ||
                                activity.user?.email ||
                                "Unknown user";

                            const initial =
                                userName.charAt(0).toUpperCase();

                            return (
                                <div
                                    key={activity._id}
                                    style={{
                                        padding: "13px 0",
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "50%",
                                                background: "#ede9fe",
                                                color: "#6d28d9",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {initial}
                                        </div>

                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: "13px",
                                                    color: "#111827",
                                                    lineHeight: 1.45,
                                                }}
                                            >
                                                <strong>{userName}</strong>{" "}
                                                {actionLabels[activity.action] ||
                                                    activity.action}
                                            </div>

                                            {activity.metadata?.email && (
                                                <div
                                                    style={{
                                                        marginTop: "4px",
                                                        fontSize: "11px",
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    {activity.metadata.email}
                                                </div>
                                            )}

                                            {activity.metadata?.role && (
                                                <div
                                                    style={{
                                                        marginTop: "4px",
                                                        fontSize: "11px",
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Role: {activity.metadata.role}
                                                </div>
                                            )}

                                            {activity.metadata?.title && (
                                                <div
                                                    style={{
                                                        marginTop: "4px",
                                                        fontSize: "11px",
                                                        color: "#6b7280",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {activity.metadata.title}
                                                </div>
                                            )}

                                            <div
                                                style={{
                                                    marginTop: "5px",
                                                    fontSize: "10px",
                                                    color: "#9ca3af",
                                                }}
                                            >
                                                {activity.createdAt
                                                    ? new Date(activity.createdAt).toLocaleString()
                                                    : "Unknown time"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </aside>

            </main>

        </div>
    );
}


export default DocumentEditor;
