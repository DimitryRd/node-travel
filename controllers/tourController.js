const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures.js');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error: error.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const requestedTour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: requestedTour,
      requestedAt: req.requestTime
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      tour: newTour
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      message: 'Successfully patched',
      data: { tour }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findOneAndDelete(req.params.id);
    res.status(204).json({ status: 'Success', data: null });
  } catch (error) {
    res.status(400).json({ status: 'success', error: error.message });
  }
};
