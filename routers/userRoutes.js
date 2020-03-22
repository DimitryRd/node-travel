const express = require('express');

const usersRouter = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController.js');

usersRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

usersRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = usersRouter;
