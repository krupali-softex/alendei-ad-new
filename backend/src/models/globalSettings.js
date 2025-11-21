const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class GlobalSettings extends Model {}

GlobalSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    globalYield: {
      type: DataTypes.FLOAT(5, 2), 
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    globalMaxUsersPerWorkspace: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 1,
      },
    },
   
  },
  {
    sequelize,
    modelName: 'GlobalSettings',
    tableName: 'global_settings',
    timestamps: true,
  }
);

module.exports = GlobalSettings;