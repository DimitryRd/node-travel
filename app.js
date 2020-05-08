const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError.js');

const userRoutes = require('./routers/userRoutes');
const tourRoutes = require('./routers/tourRoutes');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/tours', userRoutes);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Cant find ${req.originalUrl} on this server`
  // });

  // const err = new Error('Fucking error!');
  // err.status = 'Fail';
  // err.statusCode = 404;

  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
