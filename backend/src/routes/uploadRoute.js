const express = require('express');
const router = express.Router();

const createUploader = require('../utils/fileUpload');

const {
  uploadProfilePic,
  uploadWorkspacePic
} = require("../controllers/uploadController");

const { authenticateToken } = require("../middlewares/authMiddleware");
router.use(authenticateToken);

// Create uploader for profile
const profileUploader = createUploader("uploads/profile");
router.post("/upload-profile-pic", profileUploader.single("image"), uploadProfilePic);

//  Create uploader for workspace
const workspaceUploader = createUploader("uploads/workspaces");
router.post("/upload-workspace-pic", workspaceUploader.single("image"), uploadWorkspacePic);

//  Export the router
module.exports = router;
