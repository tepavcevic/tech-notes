const { logEvents } = require('./logger');
const {
  ValidationError,
  BadRequestError,
  NotFoundError,
  PermissionDeniedError,
  UnauthorizedError,
  ConflictError,
} = require('../validation/errors');

const errorHandler = (error, req, res, next) => {
  logEvents(
    `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errorLog.log'
  );

  if (process.env.NODE_ENV === 'development') console.log(error.stack);

  if (error instanceof ValidationError || error instanceof BadRequestError) {
    res.status(400).json(error);
  } else if (
    error instanceof UnauthorizedError ||
    error.name === 'UnauthorizedError' ||
    error.statusCode === 401
  ) {
    res.status(401).json(error);
  } else if (
    error instanceof ConflictError ||
    error.name === 'ConflictError' ||
    error.statusCode === 409
  ) {
    res.status(409).json(error);
  } else if (
    error instanceof NotFoundError ||
    error.name === 'NotFoundError' ||
    error.statusCode === 404
  ) {
    res.status(404).json(error);
  } else if (
    error instanceof PermissionDeniedError ||
    error.name === 'PermissionDeniedError' ||
    error.statusCode === 403
  ) {
    res.status(403).send(error);
  } else {
    console.error('SERVER Error', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = errorHandler;
