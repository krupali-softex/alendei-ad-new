const { WorkspaceMember, RolePermission } = require("../models");

const checkPermission = (permissionKey) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const workspaceId = req.user.currentWorkspaceId;

    try {
      const member = await WorkspaceMember.findOne({
        where: { userId, workspaceId }
      });

      if (!member) return res.status(403).json({ message: "Not a workspace member" });

      const permission = await RolePermission.findOne({
        where: {
          roleName: member.roleName,
          permissionKey: permissionKey
        }
      });
      

      if (!permission) {
        return res.status(403).json({ message: "Access denied" });
      }
     // console.log("working")
      next();
    } catch (err) {
      console.error("Permission check error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = { checkPermission };

