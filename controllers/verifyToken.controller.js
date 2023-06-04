const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.username = decodedToken.username;

      return res.json({
        status: 'success',
        message: 'Token is valid',
      });
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
};

module.exports = verifyToken;
