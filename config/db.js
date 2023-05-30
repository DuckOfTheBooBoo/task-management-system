require('dotenv').config();
module.exports = {
  HOST: process.env.HOST,
  USER: process.env.DB_USER,
  PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
