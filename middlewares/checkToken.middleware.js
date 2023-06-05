const RevokedToken = require('../models/revokedTokens.model');

const checkToken = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const result = await RevokedToken.findOne({
        where: {
          token: token,
        }
      });

      if (!result) {
        return next();
      }

      return res.status(401).json({
        status: 'fail',
        message: 'Token revoked.',
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        status: 'fail',
        message: 'Server error',
      });
    }

  }
};

module.exports = checkToken;
