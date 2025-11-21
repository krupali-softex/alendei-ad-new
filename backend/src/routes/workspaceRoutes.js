const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { checkPermission } = require("../middlewares/checkPermission");

router.post(
  "/invite-member",
  authenticateToken,
  workspaceController.inviteMember
);

router.post(
  "/create",
  authenticateToken,
  checkPermission("create_workspace"),
  workspaceController.createWorkspace
);

router.post(
  "/leave",
  authenticateToken,
  workspaceController.leaveWorkspace
);

router.delete(
  "/members/:memberId",
  authenticateToken,
  workspaceController.removeMember
);

router.delete(
  "/:workspaceId",
  authenticateToken,
  workspaceController.deleteWorkspace
);


router.get(
  "/my-workspaces",
  authenticateToken,
  workspaceController.getUserWorkspaces
);


router.patch(
  "/update-workspace",
   authenticateToken, 
   workspaceController.updateWorkspace);


router.patch(
  "/update-role/:targetUserId",
  authenticateToken,
  workspaceController.updateMemberRole);


router.post("/settings",
  authenticateToken, 
  workspaceController.saveWorkspaceSettings);





module.exports = router;

