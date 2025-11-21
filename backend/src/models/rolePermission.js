const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class RolePermission extends Model {}

RolePermission.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  roleName: { type: DataTypes.ENUM('owner', 'admin', 'member'), allowNull: false },
  permissionKey: { type: DataTypes.STRING, allowNull: false }
}, {
  sequelize,
  modelName: 'RolePermission',
  tableName: 'role_permissions'
});

module.exports = RolePermission;

