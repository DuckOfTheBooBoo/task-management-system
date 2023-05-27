function logActivity(req, res, next) {
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = (...args) => {
    console.log('Response:', {
      source: req.ip,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
    });

    originalSend.apply(res, args);
  };

  res.json = (...args) => {
    console.log('Response:', {
      source: req.ip,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
    });

    originalJson.apply(res, args);
  };

  next();
};

module.exports = logActivity;
