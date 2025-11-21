const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Profile extends Model {}

Profile.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    profile_pic: { type: DataTypes.STRING, allowNull: false },
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Ensures one-to-one relationship
    },
  },
  {
    sequelize,
    modelName: "profile",
  }
);

module.exports = Profile;

