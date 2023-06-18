const express = require('express');
const router = express.Router();
const path = require('path');
const jwtCookieCheck = require('../middlewares/jwtCookie.middleware');
const verifyJwt = require('../middlewares/jwtVerify.middleware');
const checkDatabaseConnection = require('../middlewares/checkDatabaseConnection.middleware');

router.get('/', checkDatabaseConnection, jwtCookieCheck, verifyJwt);

router.get('/signup', checkDatabaseConnection, (req, res) => {
  return res.render('signup');
});

router.get('/login', checkDatabaseConnection, jwtCookieCheck, verifyJwt, (req, res) => {
  return res.render('login');
});

router.get('/dashboard', checkDatabaseConnection, jwtCookieCheck, verifyJwt, (req, res) => {
  return res.render('dashboard', {
    username: req.user.username,
  });
});


module.exports = router;
