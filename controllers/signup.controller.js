require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const User = require('../models/user.model');

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const registerUser = async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['username'],
  });

  users.forEach((user) => {
    const data = user.dataValues;
    if (data.username === req.body.username) {
      return res.status(400).json({
        message: 'Username has been taken.',
      });
    }
  });


  const hashedPass = await bcrypt.hash(
      req.body.password,
      10,
  );

  await User.create({
    username: req.body.username,
    password: hashedPass,
  });

  return res.status(200).json({
    message: 'Success',
  });

};

module.exports = {
  registerUser,
};
