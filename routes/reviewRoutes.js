const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
// tours/2bacse4d/reviews
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview);
module.exports = router;