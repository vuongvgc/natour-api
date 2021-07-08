const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(200).json({
      status: 'success',
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
