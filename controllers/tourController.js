const Tour = require('../models/toursModel');
exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
  });
};

exports.getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.createTour = (req, res) => {
  const newTour = new Tour({
    ...req.body,
  });
  newTour
    .save()
    .then((doc) => {
      res.status(200).json({
        status: 'success',
        tour: doc,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: 'Bad Request',
        err,
      });
    });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      tours: '<update tour here ....',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: {
      tours: null,
    },
  });
};
