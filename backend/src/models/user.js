const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class User extends Model {}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  profilePic: { type: DataTypes.TEXT, allowNull: true },
  isSuperAdmin : { type: DataTypes.BOOLEAN, allowNull : false, defaultValue : false}
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users'
});

module.exports = User;

