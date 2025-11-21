const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class PaymentDetail extends Model {}
PaymentDetail.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Primary key
    payment_id: { type: DataTypes.STRING, allowNull: false }, // Payment ID, required field
    status: { type: DataTypes.BOOLEAN, allowNull: false }, // Payment status (true = successful, false = failed)
    id_users: { type: DataTypes.INTEGER }, // Foreign key referencing User table
  },
  { sequelize, modelName: "payment_detail" }
);
module.exports = PaymentDetail;

