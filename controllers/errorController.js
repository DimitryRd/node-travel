const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} and ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicated name ${value[0]}. Please use a new tour name `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const error = Object.values(err.errors).map(el => el.message);
  console.log('error: ', error);
  const message = `Invalid input data: ${error.join('. ')}`;
  console.log('message: ', message);
  return new AppError(message, 400);
};

const sendErrorDev = (res, err) => {
  res.status(500).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack
  });
};
const sendErrorProd = (res, err) => {
  // Operational, trusted errors send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programming or other unknown error: avoiding data leakage;
  } else {
    console.log('Something really bad happened 🔥');
    res
      .status(500)
      .json({ status: 'error', message: 'Something really wrong happened' });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    console.log('error: ', error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    sendErrorProd(res, error);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
