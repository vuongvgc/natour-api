const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);
    res.status(200).json({
      status: 'success',
      result: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'You not have permission',
    });
  }
};
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review with ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

// exports.createReview = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tours = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user._id;
//   const newReview = await Review.create(req.body);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });
exports.getUserTourIds = (req, res, next) => {
  if (!req.body.tour) req.body.tours = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
