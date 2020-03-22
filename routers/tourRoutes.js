const express = require('express');

const tourRouter = express.Router();
const {
  // checkBodyParameters,
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour
} = require('../controllers/tourController.js');

// tourRouter.param('id', checkId);

tourRouter
  .route('/')
  .get(getTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = tourRouter;
