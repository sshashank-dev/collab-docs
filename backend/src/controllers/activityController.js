const Activity = require("../models/Activity");
const Document = require("../models/Document");

/* =========================================================
   GET DOCUMENT ACTIVITY
========================================================= */

const getDocumentActivity = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id)
            .select("owner collaborators trashed");

        if (!document) {
            return res.status(404).json({
                message: "Document not found",
            });
        }

        /*
         * Only the owner and collaborators can
         * view the activity history.
         */
        const isOwner =
            document.owner.toString() ===
            req.userId.toString();

        const isCollaborator =
            document.collaborators.some(
                (collaborator) =>
                    collaborator.user.toString() ===
                    req.userId.toString()
            );

        if (!isOwner && !isCollaborator) {
            return res.status(403).json({
                message:
                    "You do not have access to this document",
            });
        }

        const activities = await Activity.find({
            document: id,
        })
            .populate(
                "user",
                "name email avatar"
            )
            .sort({
                createdAt: -1,
            })
            .limit(100);

        return res.status(200).json({
            activities,
        });
    } catch (error) {
        console.error(
            "❌ Get activity error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch activity history",
        });
    }
};

/* =========================================================
   CREATE ACTIVITY
========================================================= */

const createActivity = async ({
    documentId,
    userId,
    action,
    metadata = {},
}) => {
    try {
        const activity =
            await Activity.create({
                document: documentId,
                user: userId,
                action,
                metadata,
            });

        return activity;
    } catch (error) {
        /*
         * Activity history should never break
         * the main document operation.
         */
        console.error(
            "❌ Create activity error:",
            error
        );

        return null;
    }
};

module.exports = {
    getDocumentActivity,
    createActivity,
};