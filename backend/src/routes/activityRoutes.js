const express = require("express");

const {
    getDocumentActivity,
} = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * Get activity history for a document
 */
router.get(
    "/document/:id",
    authMiddleware,
    getDocumentActivity
);

module.exports = router;