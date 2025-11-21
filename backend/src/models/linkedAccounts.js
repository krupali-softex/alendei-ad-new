const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class LinkedAccount extends Model {}

LinkedAccount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    linkedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pageId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
     pageStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
     pageProfilepic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'LinkedAccount',
    tableName: 'linked_accounts',
    timestamps: true, 
     indexes: [
    {
      unique: true,
      fields: ['workspaceId', 'pageId']
    }
  ]
  }
);

module.exports = LinkedAccount;
