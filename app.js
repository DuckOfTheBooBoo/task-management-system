require('dotenv').config();
const express = require('express');
const logActivity = require('./middlewares/log-activity');

const app = express();
const host = process.env.STATUS !== 'prod' ? '127.0.0.1' : '0.0.0.0';
const PORT = 8080;

app.use(logActivity);

app.get('/', (req, res) => {
  res.status(200).send('Hello');
});

app.listen(PORT, host, () => {
  console.log(`Server is running on port ${host}:${PORT}`);
});
