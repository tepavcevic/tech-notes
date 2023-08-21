const bcrypt = require('bcrypt');

const User = require('../models/User');
const Note = require('../models/Note');
const {
  NotFoundError,
  ConflictError,
} = require('../validation/errors/index.js');

const userServices = () => {
  return {
    getUsers: async () => {
      const users = await User.find().select('-password').lean();

      if (!users?.length) throw new NotFoundError('No users found.');

      return users;
    },
    checkDuplicateUsername: async (username) => {
      const duplicate = await User.findOne({ username })
        .collation({ locale: 'en', strength: 2 })
        .lean()
        .exec();

      return duplicate;
    },
    hashPassword: async (password) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      return hashedPassword;
    },
    createUser: async (username, password, roles) => {
      const userObject =
        !Array.isArray(roles) || roles?.length === 0
          ? { username, password }
          : { username, password, roles };

      const user = await User.create(userObject);

      return user;
    },
  };
};

module.exports = userServices;
