const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalControlHandler = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limited = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from an IP, please try again an hour',
});

app.use('/api', limited);
app.use(express.json());
app.use(express.static('public'));
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});
app.use(globalControlHandler);

module.exports = app;
