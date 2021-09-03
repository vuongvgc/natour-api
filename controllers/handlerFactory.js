const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('Not have document with id', 404));
    res.status(201).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body);
    if (!doc) return next(new AppError('Not Document with this ID', 404));
    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let query = Model.findById(req.params.id);
    if (popOption) {
      query = query.populate(popOption);
    }
    const doc = await query;
    if (!doc) return next(new AppError('No Document with Id', 404));
    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const featuresTour = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();
    // const doc = await featuresTour.query.explain();
    const doc = await featuresTour.query;
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });
