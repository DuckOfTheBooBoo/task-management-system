const express = require('express');
const router = express.Router();
const path = require('path');
const jwtCookieCheck = require('../middlewares/jwtCookie.middleware');
const verifyJwt = require('../middlewares/jwtVerify.middleware');

router.get('/', jwtCookieCheck, verifyJwt);

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.get('/login', jwtCookieCheck, verifyJwt, (req, res) => {
  return res.render('login');
});

router.get('/dashboard', jwtCookieCheck, verifyJwt, (req, res) => {
  return res.render('dashboard', {
    username: req.user.username,
  });
});


module.exports = router;
