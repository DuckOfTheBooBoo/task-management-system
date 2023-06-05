const {DataTypes, Sequelize} = require('sequelize');
const sequelize = require('../database');
const addMinute = require('../utils/addMinute');

const RevokedTokens = sequelize.define('RevokedToken', {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  retention_timestamp: {
    type: DataTypes.DATE,
    defaultValue: addMinute(new Date(), 30),
  },
});

module.exports = RevokedTokens;
