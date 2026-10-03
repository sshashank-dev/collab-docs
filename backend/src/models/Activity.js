const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        document: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            enum: [
                "created",
                "edited",
                "collaborator_added",
                "collaborator_removed",
                "role_changed",
                "share_link_created",
                "share_link_disabled",
                "share_link_role_changed",
                "starred",
                "unstarred",
                "trashed",
                "restored",
                "permanently_deleted",
            ],
            required: true,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

/*
 * Makes fetching a document's activity history
 * fast and keeps newest activity first.
 */
activitySchema.index({
    document: 1,
    createdAt: -1,
});

module.exports = mongoose.model(
    "Activity",
    activitySchema
);