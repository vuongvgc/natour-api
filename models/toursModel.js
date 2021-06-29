const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
      minLength: [10, 'Tour must have than or equal then 10 characters'],
      maxLength: [40, 'Tour must have less or equal then 40 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have difficulty'],
      enum: {
        values: ['medium', 'difficulty', ' easy'],
        message: 'Tour must have difficulty either: medium difficulty easy ',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Tour have rating than or equal 1 point'],
      max: [5, 'Tour have rating less or equal 5 point'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour must have a Summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have a image cover'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: Boolean,
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);
tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});
// DOCUMENT MIDDLEWARE: run before.save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// // DOCUMENT MIDDLEWARE: WILL SAVE DOCUMENT
// tourSchema.pre('save', (next) => {
//   console.log('Will save Documnet');
//   next();
// });
// // DOCUMENT MIDDLEWARE: run after save or create done
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
//Run before find query
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
// Run after find query
tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `time execution query find ${Date.now() - this.start} millisecond`
  );
  // console.log(docs);
  next();
});
// AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
// tourSchema.post('aggregate', function (docs, next) {
//   console.log(docs);
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
