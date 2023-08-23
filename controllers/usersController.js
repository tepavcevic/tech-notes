const asyncHandler = require('express-async-handler');

const userServices = require('../services/userServices');
const noteServices = require('../services/noteServices');
const { BadRequestError, ConflictError } = require('../validation/errors');
const { statusCodes, messageResponses } = require('../constants/responses');

const user = userServices();
const note = noteServices();

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
  const { username, password, roles } = req?.body;

  const createdUser = await user.createUser(username, password, roles);

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
  const { id, username, roles, active, password } = req?.body;

  const updatedUser = await user.updateUser(
    id,
    username,
    roles,
    active,
    password
  );

  res.json(`${updatedUser.username} ${messageResponses.UPDATED}`);
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req?.body;

  if (!id) throw new BadRequestError(messageResponses.IDENTIFIER_REQUIRED);

  const notes = await note.findNotesByUserId(id);
  if (notes?.length > 0)
    throw new BadRequestError(messageResponses.USER_HAS_ASSIGNED_NOTES);

  await user.findUserById(id);

  await user.deleteUser(id);

  res.json({ message: `${user.username} ${messageResponses.DELETED}` });
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
