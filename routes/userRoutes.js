const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../controllers/authController');
const {
  signup,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

// ROUTES
const router = express.Router();
// Auth

router.patch('/updateMyPassword', protect, updatePassword);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.post('/signup', signup);
router.post('/login', logIn);

// USER
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
