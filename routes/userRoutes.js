const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { signup, logIn } = require('../controllers/authController');

// ROUTES
const router = express.Router();
// Auth

router.post('/signup', signup);
router.post('/login', logIn);

// USER
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
