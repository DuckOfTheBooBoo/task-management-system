const jwtCookieCheck = (req, res, next) => {
  const cookies = req.signedCookies;

  if (cookies.jwtToken) {
    req.jwtToken = cookies.jwtToken;
    return next();
  }

  return next();
};

module.exports = jwtCookieCheck;
