const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req?.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const found = await User.findOne({ username }).exec();

  if (!found || !found.active) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  const match = await bcrypt.compare(password, found.password);

  if (!match) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: found.username,
        roles: found.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { username: found.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

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

  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      if (error || !decoded?.username) {
        res.status(403).json({ message: 'Forbidden' });
      }

      const foundUser = await User.findOne({
        username: decoded?.username,
      }).exec();

      if (!foundUser) {
        res.status(401).json({ message: 'Unauthorized' });
      }

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

      res.json({ accessToken });
    })
  );
});

// @desc Log out
// @route POST /auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies) {
    res.status(204);
  }

  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: 'Cookie cleared' });
});

module.exports = { login, refresh, logout };
