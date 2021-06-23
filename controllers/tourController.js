const Tour = require('../models/toursModel');

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });
    // Build Query
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, req.query);
    const query = Tour.find(queryObj);
    // Execute Query
    const tours = await query;
    // Response Query
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
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: false,
    });
    res.status(200).json({
      status: 'success',
      tour: tour,
    });
  } catch (err) {
    res.status(400).json({
      message: 'fail',
      error: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      message: 'fail',
      error: err,
    });
  }
};
