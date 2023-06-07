const jwtAuthHeaderCheck = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    // If token is true (has a value)
    if (token) {
      req.jwtToken = token;
      return next();
    }

    return res.status(400).json({
      status: 'fail',
      message: 'No token provided',
    });
  }

  return res.status(400).json({
    status: 'fail',
    message: 'Invalid bearer token',
  });

};

module.exports = jwtAuthHeaderCheck;
