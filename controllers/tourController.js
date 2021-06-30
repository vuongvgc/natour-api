const Tour = require('../models/toursModel');
const APIFeatures = require('../utils/apiFeatures');
// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     // eslint-disable-next-line node/no-unsupported-features/es-syntax
//     const queryObj = { ...this.queryString };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);
//     let queryString = JSON.stringify(queryObj);
//     queryString = queryString.replace(
//       /\b(gte|gt|lte|lt)\b/g,
//       (match) => `$${match}`
//     );
//     this.query = Tour.find(JSON.parse(queryString));
//     return this;
//   }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort('createAt');
//     }
//     return this;
//   }

//   limit() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//     } else {
//       // query = query.select('-__v -createAt');
//       this.query = this.query.select('-__v');
//     }
//     return this;
//   }

//   pagination() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 100;
//     // page=2 ; limit=10 -> rs =11-20, -> skip = 10;
//     // page=3 ; limit=10 -> rs =21-30, -> skip = 20;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);
//     return this;
//   }
// }

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price, duration, ratingsAverage, difficulty';
  next();
};
exports.getAllTours = async (req, res, next) => {
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
    //1) Build Query
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    // const queryObj = { ...req.query };
    // Filter Query
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // // console.log(queryObj);

    // // *** Advanced Filter****
    // // { duration: { gte: '5' }, difficulty: 'easy' }
    // // { duration: { $gte: '5' }, difficulty: 'easy' }
    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`
    // );
    // // console.log(JSON.parse(queryString));
    // let query = Tour.find(JSON.parse(queryString));

    // //****SORT*****
    // // console.log(req.query);
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   // console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('createAt');
    // }
    //****LIMIT*****
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   // query = query.select('-__v -createAt');
    //   query = query.select('-__v');
    // }

    // *****PAGINATION*******
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // // page=2 ; limit=10 -> rs =11-20, -> skip = 10;
    // // page=3 ; limit=10 -> rs =21-30, -> skip = 20;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   if (skip >= Tour.countDocuments()) throw new Error('Page not found');
    // }
    //2) Execute Query
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

exports.getTour = async (req, res, next) => {
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
    const error = new Error(err);
    err.status = 'fail';
    err.statusCode = 400;
    next(error);
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
      runValidators: true,
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
