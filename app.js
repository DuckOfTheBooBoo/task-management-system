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
const host = '0.0.0.0';
const PORT = 80;

// Check if JWT_SECRET is null
if (!process.env.JWT_SECRET) {
  console.log('No JWT_SECRET env variable provided. Generating a random secret');
  process.env.JWT_SECRET = require('crypto').randomBytes(32).toString('hex');
}

// Check if COOKIE_SECRET is null
if (!process.env.COOKIE_SECRET) {
  console.log('No COOKIE_SECRET env variable provided. Generating a random secret');
  process.env.COOKIE_SECRET = require('crypto').randomBytes(32).toString('hex');
}

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
    });

// Sequelize Sync
sequelize.sync()
    .then(() => {
      console.log('Database initialized successfully');
    })
    .catch((err) => {
      console.error('Error initializing database: ', err.stack);
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
