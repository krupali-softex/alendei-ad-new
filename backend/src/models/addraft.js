const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class AdDraft extends Model {}

AdDraft.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ad_draft",
    tableName: "ad_drafts", // optional, if you want to customize table name
    timestamps: true,       // createdAt & updatedAt
  }
);

module.exports = AdDraft;
