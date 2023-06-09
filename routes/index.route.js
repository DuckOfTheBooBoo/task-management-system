const express = require('express');
const router = express.Router();
const path = require('path');
const jwtCookieCheck = require('../middlewares/jwtCookie.middleware');

router.get('/', jwtCookieCheck, (req, res) => {
  if (req.jwtToken) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.get('/login', (req, res) => {
  return res.render('login');
});

router.get('/dashboard', (req, res) => {
  return res.render('dashboard');
});

// Static file
// TODO: Probably unsecure, fix later
router.get('/public/:dir/:file', (req, res) => {
  const {dir, file} = req.params;

  return res.sendFile(path.join(__dirname, '..', 'public', dir, file));
});

module.exports = router;
