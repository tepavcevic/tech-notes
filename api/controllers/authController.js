const asyncHandler = require('express-async-handler');

const authServices = require('../services/authServices');
const { statusCodes, messageResponses } = require('../constants/responses');
const { UnauthorizedError } = require('../validation/errors');

const auth = authServices();

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req?.body;

  const { accessToken, refreshToken } = await auth.login(username, password);

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

// @desc Refresh token
// @route GET /auth/refresh
// @access Public - token expired
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) throw new UnauthorizedError(messageResponses.UNAUTHORIZED);

  const accessToken = await auth.refreshToken(cookies?.jwt);

  res.json({ accessToken });
});

// @desc Log out
// @route POST /auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies) return res.status(statusCodes.NO_CONTENT);

  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: messageResponses.COOKIE_CLEARED });
});

module.exports = { login, refresh, logout };
