require('dotenv').config();
require('./models/associations');
const express = require('express');
const sequelize = require('./database');
const logActivity = require('./middlewares/log-activity');
const path = require('path');
const indexRoute = require('./routes/index.route');
const apiRoute = require('./routes/api.route');
const RevokedToken = require('./models/revokedTokens.model');
const cleanRevokedTokens = require('./utils/cleanRevokedToken');

const app = express();
const host = process.env.STATUS !== 'prod' ? '127.0.0.1' : '0.0.0.0';
const PORT = 8081;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logActivity);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', indexRoute);
app.use('/api', apiRoute);

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

cleanRevokedTokens()
    .then(() => {
      {}
    })
    .catch((err) => {
      throw err;
    });

app.listen(PORT, host, () => {
  console.log(`Server is running on port ${host}:${PORT}`);
});
