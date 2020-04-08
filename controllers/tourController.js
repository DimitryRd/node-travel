const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`./starter/dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   const id = Number(req.params.id);
//   if (id > tours.length) {
//     return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
//   }
//   next();
// };

// exports.checkBodyParameters = (req, res, next) => {
//   if (!req.body.price || !req.body.name) {
//     return res.status(400).json({
//       status: 'Bad Request',
//       message: 'Request does not contain correct parameters'
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    // CREATING QUERY
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => {
      delete queryObj[field];
    });

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // 3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 4) Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // EXECUTE QUERY
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error
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
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, ...req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `./after-section-06/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   () => {
  //     console.log('List of tours is updated');
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
    res.status(400).json({ status: 'success', error });
  }
};
