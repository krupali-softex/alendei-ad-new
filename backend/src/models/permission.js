const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Permission extends Model {}

Permission.init({
  key: { type: DataTypes.STRING, primaryKey: true },
  description: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Permission',
  tableName: 'permissions'
});

module.exports = Permission;

