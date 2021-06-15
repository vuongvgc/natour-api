const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('./../controllers/userController');
const express = require('express');
// ROUTES
const router = express.Router();
// USER
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
