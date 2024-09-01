const errorHandler = (err, req, res, next) => {
  const { status = 500, message = 'Internal server error' } = err;
  res.status(status).json({ message });
};

export default errorHandler;
