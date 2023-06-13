/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/revokedTokens.model');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyJwt = async (req, res, next) => {
  const jwtToken = req.jwtToken;

  try {
    // Check if the token is revoked
    const result = await RevokedToken.findOne({
      where: {
        token: jwtToken,
      },
    });

    if (result) {
      if (req.headers['user-agent'].includes('Mozilla')) {
        if (req.path !== '/login') {
          return res.redirect('/login');
        }
        return next();
      }

      return res.status(400).json({
        status: 'fail',
        message: 'Token is revoked.',
      });
    }

    // Verify token
    try {
      const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
      req.userId = decodedToken.id;
      return next();

    } catch (err) {
      if (req.headers['user-agent'].includes('Mozilla')) {
        if (req.path !== '/login') {
          return res.redirect('/login');
        }
        return next();
      }

      return res.status(401).json({
        status: 'fail',
        message: 'Invalid or expired token.',
      });
    }
  } catch (err) {
    console.error('Token is undefined');
    if (req.headers['user-agent'].includes('Mozilla')) {
      if (req.path !== '/login') {
        return res.redirect('/login');
      }
      return next();
    }

    return res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }
};

module.exports = verifyJwt;
