const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routers/userRoutes');
const tourRoutes = require('./routers/tourRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware!  ✋🏻✋🏻✋🏻  ');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/tours', userRoutes);

module.exports = app;
