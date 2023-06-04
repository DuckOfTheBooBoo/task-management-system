const express = require('express');
const {registerUser} = require('../controllers/signup.controller');
const {loginUser} = require('../controllers/login.controller');
const jwtAuthMiddleware = require('../middlewares/jwt.middleware');
const verifyToken = require('../controllers/verifyToken.controller');
const router = express.Router();

router.post('/auth/signup', registerUser);
router.post('/auth/login', loginUser);
router.post('/verifyToken', verifyToken);

router.route('/task')
    // TODO: Add controller later
    .get(jwtAuthMiddleware)
    .post(jwtAuthMiddleware);

module.exports = router;
