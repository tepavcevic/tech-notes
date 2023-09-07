const { statusCodes } = require('../../constants/responses');

class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.name = 'UnauthorizedError';
    this.status = statusCodes.UNAUTHORIZED;
    this.message = message;
    this.isError = true;
  }
}

module.exports = UnauthorizedError;
