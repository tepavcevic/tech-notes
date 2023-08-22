const asyncHandler = require('express-async-handler');

const userServices = require('../services/userServices');
const noteServices = require('../services/noteServices');
const { BadRequestError } = require('../validation/errors');

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

  const duplicate = await user.checkDuplicateUsername(username);

  if (duplicate) throw new ConflictError('Username already exists.');

  const hashedPassword = await user.hashPassword(password);

  const createdUser = await user.createUser(username, hashedPassword, roles);

  if (createdUser) {
    res
      .status(201)
      .json({ message: `New user ${createdUser.username} created.` });
  } else {
    res.status(400).json({ message: 'Invalid user data recieved.' });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req?.body;

  const userToUpdate = await user.findUserById(id);

  const duplicate = await user.checkDuplicateUsername(username);

  if (duplicate) throw new ConflictError('Username already exists.');

  userToUpdate.username = username;
  userToUpdate.roles = roles;
  userToUpdate.active = active;

  if (password) userToUpdate.password = await user.hashPassword(password);

  const updatedUser = await user.save(userToUpdate);

  res.json(`${updatedUser.username} updated.`);
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req?.body;

  if (!id) throw new BadRequestError('User ID required.');

  const notes = await note.findNotesByUserId(id);
  if (notes?.length > 0) throw new BadRequestError('User has assigned notes.');

  const userToDelete = await user.findUserById(id);

  await user.delete(userToDelete);

  const reply = `Username successfully deleted.`;
  res.json({ message: reply });
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
