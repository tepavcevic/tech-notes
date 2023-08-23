const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { messageResponses } = require('../constants/responses');
const {
  UnauthorizedError,
  PermissionDeniedError,
} = require('../validation/errors');

function authServices() {
  return {
    login: async (username, password) => {
      if (!username || !password) {
        throw new BadRequestError(messageResponses.ALL_FIELDS_REQUIRED);
      }
      const user = await User.findOne({ username }).exec();

      if (!user || !user.active)
        throw new UnauthorizedError(messageResponses.UNAUTHORIZED);

      const isPasswordValid = await cryptography.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid)
        throw new UnauthorizedError(messageResponses.UNAUTHORIZED);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            roles: user.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return accessToken;
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

            const foundUser = await User.findOne({
              username: decoded?.username,
            }).exec();

            if (!foundUser)
              return reject(
                new UnauthorizedError(messageResponses.UNAUTHORIZED)
              );

            const accessToken = jwt.sign(
              {
                UserInfo: {
                  username: foundUser.username,
                  roles: foundUser.roles,
                },
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '15m' }
            );

            return resolve(accessToken);
          })
        );
      }),
  };
}

module.exports = authServices;
