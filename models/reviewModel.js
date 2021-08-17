const mongoose = require('mongoose');

//- review- rating, createAt , ref to user, ref to tour

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must than 1'],
      max: [5, 'Rating must less 5 '],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a tour'],
    },
    tours: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must have a user'],
    },
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);
const Review = mongoose.Model('Review', reviewSchema);
module.exports = Review;
