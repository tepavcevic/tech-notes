const { logEvents } = require('./logger');
const {
  ValidationError,
  BadRequestError,
  NotFoundError,
  PermissionDeniedError,
  UnauthorizedError,
  ConflictError,
} = require('../validation/errors');
const { statusCodes, messageResponses } = require('../constants/responses');

const errorHandler = (error, req, res, next) => {
  logEvents(
    `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errorLog.log'
  );

  if (process.env.NODE_ENV === 'development') console.log(error.stack);

  if (error instanceof ValidationError || error instanceof BadRequestError) {
    res.status(statusCodes.BAD_REQUEST).json(error);
  } else if (
    error instanceof UnauthorizedError ||
    error.name === 'UnauthorizedError' ||
    error.statusCode === statusCodes.UNAUTHORIZED
  ) {
    res.status(statusCodes.UNAUTHORIZED).json(error);
  } else if (
    error instanceof ConflictError ||
    error.name === 'ConflictError' ||
    error.statusCode === statusCodes.CONFLICT
  ) {
    res.status(statusCodes.CONFLICT).json(error);
  } else if (
    error instanceof NotFoundError ||
    error.name === 'NotFoundError' ||
    error.statusCode === statusCodes.NOT_FOUND
  ) {
    res.status(statusCodes.NOT_FOUND).json(error);
  } else if (
    error instanceof PermissionDeniedError ||
    error.name === 'PermissionDeniedError' ||
    error.statusCode === statusCodes.FORBIDDEN
  ) {
    res.status(statusCodes.FORBIDDEN).json(error);
  } else {
    res.status(statusCodes.SERVER_ERROR).send(messageResponses.SERVER_ERROR);
  }
};

module.exports = errorHandler;
