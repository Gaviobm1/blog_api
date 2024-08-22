function errorHandler(err, req, res, next) {
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
  });
}

module.exports = errorHandler;
