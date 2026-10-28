exports.notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};
exports.errorHandler = (err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(err.name === 'ValidationError' || err.name === 'CastError' ? 400 : status).json({
    message: err.message || 'Server error',
  });
};
