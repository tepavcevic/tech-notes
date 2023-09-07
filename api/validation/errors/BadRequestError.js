const { statusCodes } = require('../../constants/responses');

class BadRequestError extends Error {
  constructor(errorMessage) {
    super();
    this.name = 'BadRequestError';
    this.status = statusCodes.BAD_REQUEST;
    this.message = errorMessage;
    this.isError = true;
  }
}

module.exports = BadRequestError;
