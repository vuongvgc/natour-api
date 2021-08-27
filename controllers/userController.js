const Users = require('../models/userModel');
const factory = require('./handlerFactory');

// exports.getAllUsers = async (req, res, next) => {
//   const tours = await Users.find();
//   try {
//     res.status(200).json({
//       status: 'success',
//       result: tours.length,
//       data: {
//         tours: tours,
//       },
//     });
//   } catch (err) {
//     const error = new Error(err);
//     err.status = 'fail';
//     err.statusCode = 400;
//     next(error);
//   }
// };

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'The route is not defined',
//   });
// };

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'The route is not defined',
//   });
// };

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'The route is not defined',
//   });
// };

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'The route is not defined',
//   });
// };

exports.getAllUsers = factory.getAll(Users);
exports.getUser = factory.getOne(Users);
exports.updateUser = factory.updateOne(Users);
exports.createUser = factory.createOne(Users);
exports.deleteUser = factory.deleteOne(Users);
