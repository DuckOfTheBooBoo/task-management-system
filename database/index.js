const {Sequelize} = require('sequelize');
const config = require('../config/db');

const sequelize = new Sequelize(config.DB_NAME, config.USER, config.PASS, {
  host: config.HOST,
  dialect: config.dialect,
  pool: config.pool,
});

module.exports = sequelize;
