const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalControlHandler = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
// set Security http Header
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limitedRequestFromAnAPI = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from an IP, please try again an hour',
});
app.use('/api', limitedRequestFromAnAPI);

// Body parse ,reading data from body into res.body
app.use(express.json({ limit: '10kb' }));
// Data sanitize against NoSQL query injection
app.use(mongoSanitize());
// Data sanitize against XSS
app.use(xss());
// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
// Serve satic file
app.use(express.static('public'));
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});
app.use(globalControlHandler);

module.exports = app;
