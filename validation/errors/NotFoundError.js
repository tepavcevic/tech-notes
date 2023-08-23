const { statusCodes } = require('../../constants/responses');

class NotFoundError extends Error {
  constructor(message) {
    super();
    this.name = 'NotFoundError';
    this.status = statusCodes.NOT_FOUND;
    this.message = message;
    this.isError = true;
  }
}

module.exports = NotFoundError;
