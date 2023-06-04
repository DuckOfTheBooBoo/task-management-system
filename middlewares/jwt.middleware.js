/* eslint-disable valid-jsdoc */
const jwt = require('jsonwebtoken');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const jwtAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.username = decodedToken.username;

      return next();
    } catch (err) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid or expired token.',
      });
    }
  } else {
    return res.status(401).json({
      status: 'fail',
      message: 'No token provided.',
    });
  }
  // console.log(req.cookies);
  // const tokenCookie = req.cookies.jwtToken;

  // if (tokenCookie) {
  //   try {
  //     const decodedToken = jwt.verify(tokenCookie, process.env.JWT_SECRET);
  //     req.username = decodedToken.username;
  //     return next();
  //   } catch (err) {
  //     return res.status(401).json({
  //       status: 'fail',
  //       message: 'Invalid or expired token',
  //     });
  //   }
  // } else {
  //   return res.status(401).json({
  //     status: 'fail',
  //     message: 'No token provided.',
  //   });
  // }
};

module.exports = jwtAuthMiddleware;
