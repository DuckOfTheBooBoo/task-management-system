const express = require('express');
const {registerUser} = require('../controllers/signup.controller');
const {loginUser} = require('../controllers/login.controller');
const jwtAuthMiddleware = require('../middlewares/jwt.middleware');
const verifyToken = require('../controllers/verifyToken.controller');
const {
  getTaskForUser,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
} = require('../controllers/task.controller');
const logoutUser = require('../controllers/logout.controller');
const router = express.Router();

router.post('/auth/signup', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logoutUser);
router.post('/verifyToken', verifyToken);

router.route('/task')
    .all(jwtAuthMiddleware)
    .get(getTaskForUser)
    .post(createTaskForUser)
    .put(updateTaskForUser)
    .delete(deleteTaskForUser);

module.exports = router;
