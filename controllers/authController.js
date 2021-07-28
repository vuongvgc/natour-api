const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
exports.forgotPassword = async (req, res, next) => {
  // 1 Get user based on POST email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }
  // 2 Generate random reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3 Send it user's Email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/resetPassword/${resetToken}`;
  const text = `Forgot your password, submit PATCH request with new password and confirm password to: ${resetUrl}\n. If you didn't forgot password. Please ignore this email `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'RESET PASSWORD TOKEN',
      text: text,
    });
    res.status(200).json({
      status: 'Success',
      email: 'Token send it email',
    });
  } catch (error) {
    console.log('email', error);
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending email. Please try later'),
      500
    );
  }
};
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 Get User based on token
  const hashedToken = crypto
    .Hash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user)
    return next(new AppError('The Token invalid or have not expired', 400));
  // 2 If token has expired. There is a user. Set a new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  await user.save();
  // 3 Update passwordChangedAt property  for user

  // 4 Save and send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1 Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2 Check if POSTed current is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(400, 'Your current password is wrong'));
  }
  // 3 If so Update Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4 Logged user in. Send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
  });
});
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
