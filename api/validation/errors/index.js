const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const PermissionDeniedError = require('./PermissionDeniedError');
const UnauthorizedError = require('./UnauthorizedError');
const ValidationError = require('./ValidationError');
const ConflictError = require('./ConflictError');

module.exports = {
  BadRequestError,
  NotFoundError,
  PermissionDeniedError,
  UnauthorizedError,
  ValidationError,
  ConflictError,
};
