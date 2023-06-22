/* eslint-disable valid-jsdoc */
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const registerUser = async (req, res, next) => {

  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'username or password cannot be empty',
    });
  }

  try {

    const users = await User.findAll({
      attributes: ['username'],
    });

    for (const user of users) {
      const data = user.dataValues;
      if (data.username === username) {
        return res.status(400).json({
          status: 'fail',
          message: 'Username has been taken.',
        });
      }
    }

    const hashedPass = await bcrypt.hash(
        password,
        10,
    );
    await User.create({
      username: username,
      password: hashedPass,
    });

    return res.status(200).json({
      status: 'success',
      message: 'User successfully created.',
    });
  } catch (err) {

    console.error(err);

    return res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }

};

module.exports = {
  registerUser,
};
