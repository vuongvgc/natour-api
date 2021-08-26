const Tour = require('../models/toursModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price, duration, ratingsAverage, difficulty';
  next();
};

exports.getAllTours = async (req, res, next) => {
  try {
    const featuresTour = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();
    const tours = await featuresTour.query;
    //3) Response Query
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    const error = new Error(err);
    err.status = 'fail';
    err.statusCode = 400;
    next(error);
  }
};

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError(`No tour found with  that ID`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(200).json({
//     status: 'Success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     tour: tour,
//   });
// });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res) => {
//   await Tour.findByIdAndDelete(req.params.id);
//   res.status(200).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          // _id: null,
          // _id: '$difficulty',
          // _id: '$ratingsAverage',
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          aveRating: { $avg: '$ratingsAverage' },
          avePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          // aveRating: 1,
          avePrice: 1,
        },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'fail',
      error: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const { year } = req.params;
    const monthlyPlan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          sumTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          sumTours: -1,
          // month: 1,
        },
      },
      {
        $limit: 6,
      },
    ]);
    res.status(200).json({
      status: 'Success',
      data: {
        monthlyPlan,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'fail',
      error: err,
    });
  }
};
