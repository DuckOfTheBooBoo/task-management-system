const sequelize = require('../database');
const RevokedToken = require('../models/revokedTokens.model');

const cleanRevokedTokens = async () => {
  try {

    const tokens = await RevokedToken.findAll();
    let affectedRows = 0;
    for (const token of tokens) {
      const id = token.id;
      const data = token.dataValues;
      const retentionTimestamp = new Date(data['retention_timestamp']);
      const now = new Date();
      if (now > retentionTimestamp) {
        // eslint-disable-next-line max-len
        const [_, metadata] = await sequelize.query(`DELETE FROM "RevokedTokens" WHERE id=${id}`);

        affectedRows++;
      }
    };
    console.log(`Deleted ${affectedRows} rows of revoked tokens`);
  } catch (err) {
    return err;
  }
};

module.exports = cleanRevokedTokens;
