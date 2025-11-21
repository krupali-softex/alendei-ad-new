const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class WorkspaceMember extends Model {}

WorkspaceMember.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  roleName: { type: DataTypes.ENUM('owner', 'admin', 'member'), allowNull: false },
  invitedBy: { type: DataTypes.INTEGER },
  joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'WorkspaceMember',
  tableName: 'workspace_members'
});

module.exports = WorkspaceMember;

