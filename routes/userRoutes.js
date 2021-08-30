const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
} = require('../controllers/userController');

const {
  signup,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
  protect,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', logIn);
router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);

router.delete('/deleteMe', protect, deleteMe);
router.get('/me', protect, getMe, getUser);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
