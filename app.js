const express = require('express');

const app = express();

const morgan = require('morgan');

const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

//  1) MIDDLEWARE
app.use(express.json());

app.use((req, res, next) => {
  // console.log('Hello . This is messenger from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static('public'));
// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// MOUNTING MULTIPLE ROUTERS
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.all('*', (req, res, next) => {
  const err = new Error(`Can not find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  err.status = 'fail';
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  err.message = err.message || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
module.exports = app;
