const express = require('express');
const {registerUser} = require('../controllers/signup.controller');
const {loginUser} = require('../controllers/login.controller');
const jwtAuthMiddleware = require('../utils/jwt.middleware');
const router = express.Router();

router.post('/auth/signup', registerUser);
router.post('/auth/login', loginUser);

router.get('/dashboard', jwtAuthMiddleware, (req, res) => {
  return res.render('dashboard');
});

module.exports = router;
