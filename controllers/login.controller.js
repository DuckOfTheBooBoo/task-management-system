require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
  const {username, password} = req.body;

  try {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'No user found',
      });
    }

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect password',
      });
    }

    const token = jwt.sign(
        {id: user.id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: '30m'});

    const cookieOptions = {
      maxAge: 1800000, // 30 Minute
      signed: true,
    };

    res.cookie('jwtToken', token, cookieOptions);
    return res.json({
      status: 'success',
      message: 'Successfully verified the credentials.',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }

};

module.exports = {loginUser};
