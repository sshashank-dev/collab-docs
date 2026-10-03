const mongoose = require("mongoose");

const Document = require("../models/Document");
const Version = require("../models/Version");


// =========================================================
// GET USER PERMISSION
// =========================================================

async function getPermission(documentId, userId) {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
        return null;
    }

    const document = await Document.findById(documentId)
        .select("owner collaborators");

    if (!document) {
        return null;
    }

    // Owner
    if (document.owner.toString() === userId.toString()) {
        return "owner";
    }

    // Collaborator
    const collaborator = document.collaborators.find(
        (item) =>
            item.user.toString() === userId.toString()
    );

    return collaborator?.role || null;
}


// =========================================================
// GET VERSION HISTORY
// =========================================================

const getVersions = async (req, res) => {
    try {
        const permission = await getPermission(
            req.params.documentId,
            req.userId
        );

        if (!permission) {
            return res.status(403).json({
                message:
                    "You don't have access to this document.",
            });
        }

        const versions = await Version.find({
            document: req.params.documentId,
        })
            .populate(
                "createdBy",
                "name email avatar"
            )
            .sort({
                createdAt: -1,
            })
            .limit(50);

        return res.json({
            versions,
        });

    } catch (error) {
        console.error(
            "Get versions error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to load version history.",
        });
    }
};


// =========================================================
// CREATE VERSION
// =========================================================

const createVersion = async (req, res) => {
    try {
        const permission = await getPermission(
            req.params.documentId,
            req.userId
        );

        // Only owner/editor can create versions
        if (
            permission !== "owner" &&
            permission !== "editor"
        ) {
            return res.status(403).json({
                message:
                    "You don't have permission to create a version.",
            });
        }

        const {
            title = "Untitled document",
            content = "",
        } = req.body;


        // Prevent duplicate snapshots
        const latest = await Version.findOne({
            document: req.params.documentId,
        }).sort({
            createdAt: -1,
        });


        if (
            latest &&
            latest.title === title &&
            latest.content === content
        ) {
            await latest.populate(
                "createdBy",
                "name email avatar"
            );

            return res.json({
                version: latest,
                duplicate: true,
            });
        }


        // Create new version
        const version = await Version.create({
            document: req.params.documentId,

            createdBy: req.userId,

            title,

            content,
        });


        await version.populate(
            "createdBy",
            "name email avatar"
        );


        return res.status(201).json({
            version,
        });

    } catch (error) {
        console.error(
            "Create version error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to create version.",
        });
    }
};


module.exports = {
    getVersions,
    createVersion,
};