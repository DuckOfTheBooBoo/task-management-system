const express = require('express');
const {registerUser} = require('../controllers/signup.controller');
const {loginUser} = require('../controllers/login.controller');
const {
  getTaskForUser,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
} = require('../controllers/task.controller');
const logoutUser = require('../controllers/logout.controller');
const checkToken = require('../middlewares/checkToken.middleware');
const jwtCookieCheck = require('../middlewares/jwtCookie.middleware');
const jwtAuthHeaderCheck = require('../middlewares/jwtAuthHeader.middleware');
const verifyJwt = require('../middlewares/jwtVerify.middleware');
const router = express.Router();

router.post('/auth/signup', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logoutUser);

router.route('/task')
    .all(jwtCookieCheck, jwtAuthHeaderCheck, verifyJwt)
    .get(getTaskForUser)
    .post(createTaskForUser)
    .put(updateTaskForUser)
    .delete(deleteTaskForUser);

module.exports = router;
