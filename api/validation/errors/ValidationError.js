const { statusCodes } = require('../../constants/responses');

class ValidationError extends Error {
  constructor(errors) {
    super();
    this.name = 'ValidationError';
    this.status = statusCodes.BAD_REQUEST;
    this.message = errors.map((error) => error.message).join(', ');
    this.isError = true;
  }
}

module.exports = ValidationError;
