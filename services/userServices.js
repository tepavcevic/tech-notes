const cryptography = require('../common/cryptography');
const User = require('../models/User');
const Note = require('../models/Note');
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require('../validation/errors/index.js');
const { messageResponses } = require('../constants/responses');

function userServices() {
  return {
    getUsers: async () => {
      const users = await User.find().select('-password').lean();

      if (!users?.length) throw new NotFoundError('No users found.');

      return users;
    },
    getUserById: async (id) => {
      const user = await User.findById(id).select('-password').lean();

      if (!user) throw new NotFoundError(messageResponses.USER_NOT_FOUND);

      return user;
    },
    createUser: async (payload) => {
      const { username, password, roles, active = true } = payload;

      const duplicate = await User.findOne({ username })
        .collation({ locale: 'en', strength: 2 })
        .lean()
        .exec();

      if (duplicate)
        throw new ConflictError(messageResponses.DUPLICATE_IDENTIFIER);

      const hashedPassword = await cryptography.hashPassword(password);

      const userObject =
        !Array.isArray(roles) || roles?.length === 0
          ? { username, password: hashedPassword, active }
          : { username, password: hashedPassword, roles, active };

      const user = await User.create(userObject);

      return user;
    },
    updateUser: async (payload) => {
      const { id, username, roles, active, password } = payload;

      const userToUpdate = await User.findById(id);

      if (!userToUpdate) throw new NotFoundError(messageResponses.NOT_FOUND);

      userToUpdate.username = username;
      userToUpdate.roles = roles;
      userToUpdate.active = active;

      if (password)
        userToUpdate.password = await cryptography.hashPassword(password);

      const updatedUser = await userToUpdate.save();

      return updatedUser;
    },
    deleteUser: async (id) => {
      if (!id) throw new BadRequestError(messageResponses.IDENTIFIER_REQUIRED);

      const notes = await Note.findOne({ user: id }).lean().exec();
      if (notes?.length > 0)
        throw new BadRequestError(messageResponses.USER_HAS_ASSIGNED_NOTES);

      const user = await User.findById(id).lean();
      if (!user) throw new NotFoundError(messageResponses.USER_NOT_FOUND);

      await User.findByIdAndDelete(id);

      return user;
    },
  };
}

module.exports = userServices;
