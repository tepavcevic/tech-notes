const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const cryptography = require('../common/cryptography');
const { messageResponses } = require('../constants/responses');
const {
  UnauthorizedError,
  PermissionDeniedError,
} = require('../validation/errors');
const { signAccessToken, signRefreshToken } = require('../common/jwtTokens');

function authServices() {
  return {
    login: async (username, password) => {
      if (!username || !password) {
        throw new BadRequestError(messageResponses.ALL_FIELDS_REQUIRED);
      }
      const user = await User.findOne({ username }).exec();

      if (!user || !user.active)
        throw new UnauthorizedError(messageResponses.UNAUTHORIZED);

      const isPasswordValid = await cryptography.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordValid)
        throw new UnauthorizedError(messageResponses.UNAUTHORIZED);

      const accessToken = signAccessToken(user);

      const refreshToken = signRefreshToken(user);

      return { accessToken, refreshToken };
    },
    refreshToken: (refreshToken) =>
      new Promise((resolve, reject) => {
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          asyncHandler(async (error, decoded) => {
            if (error || !decoded?.username)
              return reject(
                new PermissionDeniedError(messageResponses.FORBIDDEN)
              );

            const user = await User.findOne({
              username: decoded?.username,
            }).exec();

            if (!user)
              return reject(
                new UnauthorizedError(messageResponses.UNAUTHORIZED)
              );

            const accessToken = signAccessToken(user);

            return resolve(accessToken);
          })
        );
      }),
  };
}

module.exports = authServices;
