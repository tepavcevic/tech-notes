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
      let { id, active, password } = payload;

      const [userToUpdate, note] = await Promise.all([
        User.findById(id).lean(),
        Note.findOne({ user: id }).lean(),
      ]);

      console.log(userToUpdate);

      if (!userToUpdate) throw new NotFoundError(messageResponses.NOT_FOUND);

      if (note && !active)
        throw new ConflictError(messageResponses.USER_HAS_ASSIGNED_NOTES);

      if (password) password = await cryptography.hashPassword(password);

      const updatedUser = await User.findByIdAndUpdate(id, payload);

      return updatedUser;
    },
    deleteUser: async (payload) => {
      const { id } = payload;
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
