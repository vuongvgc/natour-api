const express = require('express');
// ) ROUTER HANDLE

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route is not defined',
  });
};

// ROUTES
const router = express.Router();

// USER
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
