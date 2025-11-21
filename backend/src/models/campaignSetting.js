const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class CampaignSetting extends Model {}

CampaignSetting.init(
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
    gender: {
      type: DataTypes.ENUM("Male", "Female", "All"),
      allowNull: false,
      defaultValue: "All",
    },
    targetAreas: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("targetAreas must be an array");
          }
        },
      },
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Campaign_Setting",
    tableName: "campaign_settings",
    timestamps: true,
  }
);

module.exports = CampaignSetting;
