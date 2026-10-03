const Comment = require("../models/Comment");
const Document = require("../models/Document");

const canAccessDocument = async (documentId, userId) => {
    const document = await Document.findById(documentId);

    if (!document) {
        return null;
    }

    const isOwner =
        document.owner.toString() === userId.toString();

    const collaborator = document.collaborators.find(
        (item) =>
            item.user.toString() === userId.toString()
    );

    if (isOwner) {
        return "owner";
    }

    return collaborator?.role || null;
};


// GET COMMENTS
const getComments = async (req, res) => {
    try {
        const { documentId } = req.params;

        const permission = await canAccessDocument(
            documentId,
            req.userId
        );

        if (!permission) {
            return res.status(403).json({
                message: "You do not have access to this document",
            });
        }

        const comments = await Comment.find({
            document: documentId,
        })
            .populate("author", "name email avatar")
            .sort({ createdAt: 1 });

        res.json({
            comments,
        });
    } catch (error) {
        console.error("Get comments error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// CREATE COMMENT
const createComment = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { text, selectedText } = req.body;

        if (!text?.trim()) {
            return res.status(400).json({
                message: "Comment text is required",
            });
        }

        const permission = await canAccessDocument(
            documentId,
            req.userId
        );

        if (!permission) {
            return res.status(403).json({
                message: "You do not have access to this document",
            });
        }

        if (permission === "viewer") {
            return res.status(403).json({
                message: "Viewers cannot create comments",
            });
        }

        const comment = await Comment.create({
            document: documentId,
            author: req.userId,
            text: text.trim(),
            selectedText: selectedText || "",
        });

        await comment.populate(
            "author",
            "name email avatar"
        );

        res.status(201).json({
            message: "Comment created",
            comment,
        });
    } catch (error) {
        console.error("Create comment error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// REPLY TO COMMENT
const replyToComment = async (req, res) => {
    try {
        const { documentId, commentId } = req.params;
        const { text } = req.body;

        if (!text?.trim()) {
            return res.status(400).json({
                message: "Reply text is required",
            });
        }

        const permission = await canAccessDocument(
            documentId,
            req.userId
        );

        if (!permission) {
            return res.status(403).json({
                message: "You do not have access to this document",
            });
        }

        if (permission === "viewer") {
            return res.status(403).json({
                message: "Viewers cannot reply to comments",
            });
        }

        const parent = await Comment.findOne({
            _id: commentId,
            document: documentId,
        });

        if (!parent) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        const reply = await Comment.create({
            document: documentId,
            author: req.userId,
            text: text.trim(),
            parentComment: commentId,
        });

        await reply.populate(
            "author",
            "name email avatar"
        );

        res.status(201).json({
            message: "Reply created",
            comment: reply,
        });
    } catch (error) {
        console.error("Reply comment error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// RESOLVE COMMENT
const resolveComment = async (req, res) => {
    try {
        const { documentId, commentId } = req.params;

        const permission = await canAccessDocument(
            documentId,
            req.userId
        );

        if (!permission) {
            return res.status(403).json({
                message: "You do not have access to this document",
            });
        }

        if (permission === "viewer") {
            return res.status(403).json({
                message: "Viewers cannot resolve comments",
            });
        }

        const comment = await Comment.findOne({
            _id: commentId,
            document: documentId,
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        comment.resolved = !comment.resolved;

        await comment.save();

        await comment.populate(
            "author",
            "name email avatar"
        );

        res.json({
            message: comment.resolved
                ? "Comment resolved"
                : "Comment reopened",
            comment,
        });
    } catch (error) {
        console.error("Resolve comment error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


module.exports = {
    getComments,
    createComment,
    replyToComment,
    resolveComment,
};