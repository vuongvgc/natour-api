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
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
