const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Role extends Model {}
Role.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Primary key
    role_name: { type: DataTypes.STRING, allowNull: false }, // Role name (e.g., superadmin, agent)
  },
  { sequelize, modelName: "role" }
);
module.exports = Role;

