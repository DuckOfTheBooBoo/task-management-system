const db = require('../database');

module.export = function authenticateWithRetry() {
  return new Promise( async (resolve, reject) => {
    const maxRetries = process.env.DB_CON_MAX_RETRIES || 5;
    const retryDelay = 2000;

    let retries = 0;
    let authenticated = false;

    while (!authenticated && retries < maxRetries) {
      try {
        await db.authenticate();
        authenticated = true;
        console.log('Connection to database has been established');
        resolve();
      } catch (err) {
        retries += 1;
        console.error(`Failed to authenticate: ${err.message}`);
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((innerResolve) => {
          setTimeout(innerResolve, retryDelay);
        });
      }
    }

    if (!authenticated) {
      // eslint-disable-next-line max-len
      console.error('Max retries exceeded. Unable to authenticate to the database');
      reject(new Error('Authentication failed.'));
    }
  });
};
