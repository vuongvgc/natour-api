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
  updateMe,
  deleteMe,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', logIn);
router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);

router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
