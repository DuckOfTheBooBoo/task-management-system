const express = require('express');
const {registerUser} = require('../controllers/signup.controller');
const router = express.Router();

router.post('/auth/signup', registerUser);

module.exports = router;
