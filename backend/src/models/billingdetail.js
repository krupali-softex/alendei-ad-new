const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class BillingDetail extends Model {}
BillingDetail.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Primary key
    gst_no: { type: DataTypes.STRING }, // GST number (optional field)
    registered_name: { type: DataTypes.STRING, allowNull: false }, // Registered name, required field
    city: { type: DataTypes.STRING, allowNull: false }, // City, required field
    state: { type: DataTypes.STRING, allowNull: false }, // State, required field
    id_users: { type: DataTypes.INTEGER }, // Foreign key referencing User table
  },
  { sequelize, modelName: "billing_detail" }
);
module.exports = BillingDetail;

