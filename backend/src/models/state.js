const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const State = sequelize.define('State', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  }
});

module.exports = State;
