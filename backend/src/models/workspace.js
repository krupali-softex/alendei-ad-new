const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Workspace extends Model {}

Workspace.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  workspacePic: { type: DataTypes.TEXT, allowNull: true },
  yield: { type: DataTypes.FLOAT, allowNull: true },
  maxUsersPerWorkspace: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
  createdBy: { type: DataTypes.INTEGER, allowNull: false }
}, {
  sequelize,
  modelName: 'Workspace',
  tableName: 'workspaces'
});

module.exports = Workspace;

