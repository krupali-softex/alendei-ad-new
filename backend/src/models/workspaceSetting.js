const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class WorkspaceSetting extends Model {}

WorkspaceSetting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true // One setting per workspace
    },
    businessCategory: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    financialYear: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enableNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // optional: defaults to true
    },
  },
  {
    sequelize,
    modelName: 'WorkspaceSetting',
    tableName: 'workspace_settings',
    timestamps: true
  }
);

module.exports = WorkspaceSetting;
