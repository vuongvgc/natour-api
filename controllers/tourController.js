const Tour = require('../models/toursModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'fail',
      error: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.find({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'fail',
      error: err,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({
  //   ...req.body,
  // });
  // newTour
  //   .save()
  //   .then((doc) => {
  //     res.status(200).json({
  //       status: 'success',
  //       tour: doc,
  //     });
  //   })
  //   .catch((err) => {
  //
  //   });
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Bad Request',
      message: err,
    });
  }
  // Tour.create(req.body, (doc, err) => {
  //   if (err) {
  //     res.status(400).json({
  //       status: 'Bad Request',
  //       message: err,
  //     });
  //   }
  //   res.status(200).json({
  //     status: 'Success',
  //     tour: doc,
  //   });
  // });
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
