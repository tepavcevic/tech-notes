const asyncHandler = require('express-async-handler');

const userServices = require('../services/userServices');
const { BadRequestError } = require('../validation/errors');
const { statusCodes, messageResponses } = require('../constants/responses');

const user = userServices();

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await user.getUsers();

  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const createdUser = await user.createUser(req.body);

  if (createdUser) {
    res
      .status(statusCodes.CREATED)
      .json({ message: `${createdUser.username} ${messageResponses.CREATED}` });
  } else {
    throw new BadRequestError(messageResponses.INVALID_DATA_RECEIVED);
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await user.updateUser(req.body);

  res.json(`${updatedUser.username} ${messageResponses.UPDATED}`);
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await user.deleteUser(id);

  res.json({ message: `${deletedUser.username} ${messageResponses.DELETED}` });
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
