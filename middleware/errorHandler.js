const { logEvents } = require('./logger');
const {
  ValidationError,
  BadRequestError,
  NotFoundError,
  PermissionDeniedError,
  UnauthorizedError,
} = require('../validation/errors');

const errorHandler = (error, req, res, next) => {
  logEvents(
    `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errorLog.log'
  );

  if (process.env.NODE_ENV === 'development') console.log(error.stack);

  if (error instanceof ValidationError || error instanceof BadRequestError) {
    res.status(400).json({ message: error.message, isError: true });
  } else if (error instanceof NotFoundError) {
    res.status(404).send(error);
  } else if (error instanceof PermissionDeniedError) {
    res.status(403).send(error);
  } else if (
    error instanceof UnauthorizedError ||
    error.name === 'UnauthorizedError' ||
    error.statusCode === 401
  ) {
    res.status(401).send('Unauthorized');
  } else if (error.statusCode === 404) {
    res.status(404).send('Not found');
  } else if (error.statusCode === 403 || error.code === 'permission_denied') {
    res.status(403).send('Permission denied');
  } else {
    console.error('SERVER Error', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = errorHandler;
