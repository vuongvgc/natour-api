const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error._id}: ${error.value}`;
  return new AppError(message, 400);
};
const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (res, err) => {
  //Operational, trusted error: send message to client

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programing or other unknown : don't leak error detail
  } else {
    // 1 Log error
    console.log('ERROR', err);
    // 2 send generic message
    res.status(err.statusCode).json({
      status: 404,
      message: 'something very wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(res, err);
  }
};
