const jwt = require('jsonwebtoken');

const { messageResponses } = require('../constants/responses');
const {
  UnauthorizedError,
  PermissionDeniedError,
} = require('../validation/errors');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer '))
    throw new UnauthorizedError(messageResponses.UNAUTHORIZED);

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) throw new PermissionDeniedError(messageResponses.FORBIDDEN);

    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;

    next();
  });
};

module.exports = verifyJWT;
