const express = require("express");

const {
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
} = require("../controllers/documentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================================================
// DOCUMENT ROUTES
// =========================================================

router.post(
    "/",
    authMiddleware,
    createDocument
);

router.get(
    "/",
    authMiddleware,
    getDocuments
);

// =========================================================
// TRASH ROUTES
// =========================================================

// Get trashed documents
router.get(
    "/trash",
    authMiddleware,
    getTrashDocuments
);

// Restore document
router.patch(
    "/:id/restore",
    authMiddleware,
    restoreDocument
);

// Permanently delete document
router.delete(
    "/:id/permanent",
    authMiddleware,
    permanentlyDeleteDocument
);

// =========================================================
// SHAREABLE LINK ROUTES
// =========================================================

// Public share link
//
// IMPORTANT:
// This route does NOT use authMiddleware.
//
// Anyone with a valid share token can access
// the shared document.
router.get(
    "/share/:token",
    getSharedDocument
);

// Save content from an editor share link
//
// This route is intentionally NOT protected by
// the normal authMiddleware.
//
// updateSharedDocument validates the temporary
// share JWT itself and checks that the share link
// is still enabled and has editor permission.
router.put(
    "/share/:id/content",
    updateSharedDocument
);

// Generate / enable shareable link
router.post(
    "/:id/share-link",
    authMiddleware,
    generateShareLink
);

// Change shareable link permission
router.patch(
    "/:id/share-link",
    authMiddleware,
    updateShareLinkRole
);

// Disable / revoke shareable link
router.delete(
    "/:id/share-link",
    authMiddleware,
    disableShareLink
);

// =========================================================
// SINGLE DOCUMENT ROUTES
// =========================================================

router.get(
    "/:id",
    authMiddleware,
    getDocument
);

router.put(
    "/:id",
    authMiddleware,
    updateDocument
);

// Move document to Trash
router.delete(
    "/:id",
    authMiddleware,
    deleteDocument
);

// =========================================================
// COLLABORATOR ROUTES
// =========================================================

// Add/update collaborator
router.post(
    "/:id/collaborators",
    authMiddleware,
    addCollaborator
);

// Remove collaborator
router.delete(
    "/:id/collaborators/:userId",
    authMiddleware,
    removeCollaborator
);

// Change collaborator role
router.patch(
    "/:id/collaborators/:userId",
    authMiddleware,
    updateCollaboratorRole
);

// =========================================================
// STAR ROUTE
// =========================================================

router.patch(
    "/:id/star",
    authMiddleware,
    toggleStarDocument
);

module.exports = router;