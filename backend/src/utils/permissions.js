const { WorkspaceMember, RolePermission } = require("../models");

async function hasPermission(userId, workspaceId, permissionKey) {
  const member = await WorkspaceMember.findOne({ where: { userId, workspaceId } });

  if (!member) return false;

  const rolePermission = await RolePermission.findOne({
    where: { roleName: member.roleName, permissionKey }
  });

  return !!rolePermission;
}
 
module.exports = { hasPermission };
