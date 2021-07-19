const jwt = require('jsonwebtoken');
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
