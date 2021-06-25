const Tour = require('../models/toursModel');

exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price, duration, ratingsAverage, difficulty';
  next();
};
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
    //1) Build Query
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    // Filter Query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj);

    // *** Advanced Filter****
    // { duration: { gte: '5' }, difficulty: 'easy' }
    // { duration: { $gte: '5' }, difficulty: 'easy' }
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // console.log(JSON.parse(queryString));
    let query = Tour.find(JSON.parse(queryString));

    //****SORT*****
    // console.log(req.query);
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('createAt');
    }
    //****LIMIT*****
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // query = query.select('-__v -createAt');
      query = query.select('-__v');
    }

    // *****PAGINATION*******
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    // page=2 ; limit=10 -> rs =11-20, -> skip = 10;
    // page=3 ; limit=10 -> rs =21-30, -> skip = 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      if (skip >= Tour.countDocuments()) throw new Error('Page not found');
    }
    //2) Execute Query
    const tours = await query;
    //3) Response Query
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
