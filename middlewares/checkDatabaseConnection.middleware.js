const db = require('../database');

const checkDatabaseConnection = async (req, res, next) => {
  try {
    await db.authenticate();
    return next();
  } catch (err) {
    if (req.headers['user-agent'].includes('Mozilla')) {
      return res.status(500).send(`
      <h1 style="font-weight: bold, border-bottom: 2px solid gray">Error in database connection.</h1>`);
    }

    return res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }
};

module.exports = checkDatabaseConnection;
