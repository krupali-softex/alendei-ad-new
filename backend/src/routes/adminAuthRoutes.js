const express = require("express");
const { superAdminAuth } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/admin/dashboard",
  superAdminAuth,
  adminController.getAllWorkspaces
);
router.get(
  "/admin/:workspaceId/members",
  superAdminAuth,
  adminController.getWorkspaceMembers
);
router.put(
  "/admin/:workspaceId/yield",
  superAdminAuth,
  adminController.updateWorkspaceSettings
);
router.put(
  "/admin/globalsetting",
  superAdminAuth,
  adminController.updateGlobalSettings
);
router.delete(
  "/admin/:workspaceId",
  superAdminAuth,
  adminController.deleteWorkspace
);
router.post(
  "/admin/change-role",
  superAdminAuth,
  adminController.changeWorkspaceMemberRole
);

router.get(
  "/admin/session",
  superAdminAuth,
  adminController.getSuperAdminSession
);

module.exports = router;
