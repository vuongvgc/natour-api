const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
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
// DOCUMENT MIDDLEWARE: WILL SAVE DOCUMENT
tourSchema.pre('save', (next) => {
  console.log('Will save Documnet');
  next();
});
// DOCUMENT MIDDLEWARE: run after save or create done
tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
