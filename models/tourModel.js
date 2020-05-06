const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [
      //   validator.isAlpha,
      //   'A tour name must have only alphanumeric characters'
      // ]
    },
    slug: { type: String },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be greater or equal to 1'],
      max: [5, 'A rating must be less or equal 5']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'Difficulty is either: easy or difficult or medium'
      }
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize']
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(value) {
          return value < this.price;
        },
        message: 'A tour must have a priceDiscount less then regular price'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 0
    },
    ratingsQuantity: {
      type: Number,
      defaults: 0
    },
    discount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: { type: String, trim: true },
    imageCover: { type: String, required: [true, 'A tour must have an image'] },
    images: [String],
    createdAt: { type: String, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: { type: Boolean, default: false }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create
tourSchema.pre('save', function(next) {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', next => {
  console.log('Will save document');
  next();
});

tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

//QUERY MIDDLEWARES
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: false } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Quest took ${Date.now() - this.start} milliseconds`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log('pipeline: ', this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
