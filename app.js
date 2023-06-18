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
const PORT = 8080;

// Console color formatting
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const RED = '\x1b[31m';

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
      console.error('Unable to connect/auth to database: ', err.message);
    });

// Sequelize Sync
sequelize.sync()
    .then(() => {
      console.log('Database initialized successfully');
    })
    .catch((err) => {
      console.error('Error initializing database: ', err.message);
    });

// Clean revoked tokens table for every 10 minutes
let intervalId;
cleanRevokedTokens()
    .then(() => {
      intervalId = setInterval(cleanRevokedTokens, 600000);
    })
    .catch((err) => {
      console.error('An error occured: ', err.message);
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

// Show note message
console.log(YELLOW, `
---------------------------------------------------
Please note: You may see error messages during the initial connection process. Don't worry! Sequelize is designed to handle such situations.
If you encounter errors during the database connection, it could be because the database is currently booting up. In this case, Sequelize will automatically attempt to reconnect in the background.
Once the database finishes booting up, Sequelize will establish a successful connection and any errors you see now should resolve themselves.
So, please be patient and let Sequelize work its magic behind the scenes. If there are any persistent connection issues, we'll notify you.
`);
console.log(RED, `
If you continue to experience issues and the website shows a database connection error after some time, there might be an error in the database connection setup.

Please ensure that the necessary database credentials (database name, username, password, host, and port) are correctly configured. Double-check that the database server is running and accessible.

If you are running the web app locally, make sure your local development environment is properly configured and the database server is up and running.

Thank you for your patience, and we apologize for any inconvenience caused.
---------------------------------------------------
`);
console.log(RESET);
