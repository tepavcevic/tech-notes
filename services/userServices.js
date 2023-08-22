const bcrypt = require('bcrypt');

const User = require('../models/User');
const { NotFoundError } = require('../validation/errors/index.js');

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
    createUser: async (username, password, roles, active = true) => {
      const userObject =
        !Array.isArray(roles) || roles?.length === 0
          ? { username, password, active }
          : { username, password, roles, active };

      const user = await User.create(userObject);

      return user;
    },
    findUserById: async (id) => {
      const user = await User.findById(id).exec();

      if (!user) throw new NotFoundError('User not found.');

      return user;
    },
    save: async (user) => {
      const updatedUser = await user.save();

      return updatedUser;
    },
    delete: async (user) => {
      const deletedUser = await User.deleteOne(user);

      return deletedUser;
    },
  };
};

module.exports = userServices;
