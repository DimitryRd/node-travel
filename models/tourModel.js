const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maxGroupSize']
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
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
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
