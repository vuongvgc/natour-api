const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
exports.signup = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'fail',
      error: err,
    });
  }
});

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  // 1 if email & password exist
  if (!email || !password) {
    return next(new AppError('Please provider email or password', 400));
  }
  // 2 if email exist & password not correct

  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3 everything ok
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // console.log(req.headers);
  // 1: Get Token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2: Verification Token
  // jwt.verify(token, process.env.JWT_SECRET);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3: Check if token still exits
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The User belonging to this token does not longer exist',
        401
      )
    );
  }

  // 4: Check user change password after token issue
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    console.log('wrong after pasword');
    return next(
      new AppError('User recently change password please login again', 401)
    );
  }
  req.user = currentUser;
  next();
});
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // console.log(roles, req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not permission to take this action'));
    }
    next();
  };
// exports.signup = async (req, res, next) => {
//   try {
//     const newUser = await User.create(req.body);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         user: newUser,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       message: 'fail',
//       error: err,
//     });
//   }
// };
