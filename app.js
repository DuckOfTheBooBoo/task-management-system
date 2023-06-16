require('dotenv').config();
require('./models/associations');
const express = require('express');
const sequelize = require('./database');
const cookieParser = require('cookie-parser');
const logActivity = require('./middlewares/log-activity');
const path = require('path');
const indexRoute = require('./routes/index.route');
const apiRoute = require('./routes/api.route');
const RevokedToken = require('./models/revokedTokens.model');
const cleanRevokedTokens = require('./utils/cleanRevokedToken');

const app = express();
const host = process.env.NODE_ENV !== 'prod' ? '127.0.0.1' : '0.0.0.0';
const PORT = 8081;

app.use('/public', express.static('public'));
app.engine('ejs', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logActivity);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
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
      // throw err;
    });

// Clean revoked tokens table for every 10 minutes
let intervalId;
cleanRevokedTokens()
    .then(() => {
      intervalId = setInterval(cleanRevokedTokens, 600000);
    })
    .catch((err) => {
      console.error('An error occured: ', err);
    });

app.listen(PORT, host, () => {
  console.log(`Server is running on port ${host}:${PORT}`);
});

process.on('SIGINT', async () => {
  try {
    console.log('\nReceived SIGINT signal');

    clearInterval(intervalId);
    console.log('Cleared the intervals');

    await sequelize.close();
    console.log('Sequelize connection closed');

    process.exit(0);
  } catch (err) {
    console.error('An error occured: ', err);
    process.exit(1);
  }
});
