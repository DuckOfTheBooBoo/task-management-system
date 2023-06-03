const {DataTypes} = require('sequelize');
const sequelize = require('../database');

const Task = sequelize.define('Task', {
  task_desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_created: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    timezone: false,
  },
  date_updated: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Not Completed',
  },
});

module.exports = Task;
