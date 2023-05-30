const {DataTypes} = require('sequelize');
const sequelize = require('../database');
const Task = require('./task.model');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Task);

module.exports = User;
