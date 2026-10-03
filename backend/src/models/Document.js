const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        content: {
            type: String,
            default: "",
        },

        starred: {
            type: Boolean,
            default: false,
        },

        // TRASH
        trashed: {
            type: Boolean,
            default: false,
        },

        trashedAt: {
            type: Date,
            default: null,
        },

        // SHAREABLE LINK
        shareLink: {
            enabled: {
                type: Boolean,
                default: false,
            },

            token: {
                type: String,
                default: null,
            },

            role: {
                type: String,
                enum: ["viewer", "editor"],
                default: "viewer",
            },
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        collaborators: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },

                role: {
                    type: String,
                    enum: ["viewer", "editor"],
                    default: "editor",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Document",
    documentSchema
);