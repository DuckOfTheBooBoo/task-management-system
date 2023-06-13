require('dotenv').config();
const RevokedToken = require('../models/revokedTokens.model');
const addMinute = require('../utils/addMinute');

const logoutUser = async (req, res) => {
  const token = req.jwtToken;

  if (!token) {
    return res.status(400).json({
      status: 'fail',
      message: 'No JWT token provided.',
    });
  }

  try {
    await RevokedToken.create({
      token: token,
    });

    return res.json({
      status: 'success',
      message: 'Successfully logged out',
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }
};

module.exports = logoutUser;
