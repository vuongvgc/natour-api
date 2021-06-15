const fs = require('fs');
const express = require('express');
const app = express();
var morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const { get } = require('http');
//  1) MIDDLEWARE
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello . This is messenger from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan('dev'));

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// MOUNTING MULTIPLE ROUTERS
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

// 3) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
