const { statusCodes } = require('../../constants/responses');

class ConflictError extends Error {
  constructor(errorMessage) {
    super();
    this.name = 'ConflictError';
    this.status = statusCodes.CONFLICT;
    this.message = errorMessage;
    this.isError = true;
  }
}

module.exports = ConflictError;
