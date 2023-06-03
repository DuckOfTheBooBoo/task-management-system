require('dotenv').config();
const express = require('express');
const sequelize = require('./database');
const logActivity = require('./middlewares/log-activity');
require('./models/associations');

const app = express();
const host = process.env.STATUS !== 'prod' ? '127.0.0.1' : '0.0.0.0';
const PORT = 8081;

app.use(logActivity);

sequelize.authenticate()
    .then(() => {
      console.log('Connection to database has ben established.');
    })
    .catch((err) => {
      console.error('Unable to connect/auth to database: ', err.stack);
      throw err;
    });

// Sequelize Sync
sequelize.sync()
    .then(() => {
      console.log('Database initialized successfully');
    })
    .catch((err) => {
      console.error('Error initializing database: ', err.stack);
      throw err;
    });

app.get('/', (req, res) => {
  res.status(200).send('Hello');
});

app.listen(PORT, host, () => {
  console.log(`Server is running on port ${host}:${PORT}`);
});