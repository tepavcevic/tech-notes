const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Note = require('../models/Note');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();

    if (!users?.length) {
        return res.status(204).json({ message: "No users found." });
    }

    res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req?.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userObject = (!Array.isArray(roles) || roles?.length === 0)
        ? { username, password: hashedPassword }
        : { username, password: hashedPassword, roles}

    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${user.username} created.` });
    } else {
        res.status(400).json({ message: "Invalid user data recieved." });
    }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req?.body;

    if (!id || !username || !Array.isArray(roles) || !roles?.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found." });
    }

    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json(`${updatedUser.username} updated.`);
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req?.body;

    if (!id) {
        return res.status(400).json({ message: "User ID required." });
    }

    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: "User has assigned notes." });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found." });
    }

    const result = await user.deleteOne();

    const reply = `Username ${result.username} with id ${result._id} deleted.`;
    res.json({ message: reply });
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };