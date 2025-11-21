const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class AdDetail extends Model {}

AdDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Required: Foreign key to User
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Required: Foreign key to Workspace (UUID)
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    campaignName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Meta Ad objects (usually string IDs)
    adCampaignId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    adSetId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    adCreativeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    adId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leadFormId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    imageHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    sequelize,
    modelName: "ad_detail",
    timestamps: true,
  }
);

module.exports = AdDetail;
