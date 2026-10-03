const express = require("express");

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    getVersions,
    createVersion,
} = require("../controllers/versionController");

const router = express.Router();


// Every version request requires login
router.use(authMiddleware);


// Get version history
router.get(
    "/:documentId",
    getVersions
);


// Create a new version
router.post(
    "/:documentId",
    createVersion
);


module.exports = router;