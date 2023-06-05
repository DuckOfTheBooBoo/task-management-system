const {DataTypes} = require('sequelize');
const sequelize = require('../database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Not Completed',
  },
  tags: {
    // eslint-disable-next-line new-cap
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
});

module.exports = Task;
