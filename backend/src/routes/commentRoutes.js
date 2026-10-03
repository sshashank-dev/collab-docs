const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getComments,
    createComment,
    replyToComment,
    resolveComment,
} = require("../controllers/commentController");

const router = express.Router();

router.use(authMiddleware);

router.get(
    "/:documentId",
    getComments
);

router.post(
    "/:documentId",
    createComment
);

router.post(
    "/:documentId/:commentId/reply",
    replyToComment
);

router.patch(
    "/:documentId/:commentId/resolve",
    resolveComment
);

module.exports = router;