const { statusCodes } = require('../../constants/responses');

class PermissionDeniedError extends Error {
  constructor(message) {
    super();
    this.name = 'PermissionDeniedError';
    this.status = statusCodes.FORBIDDEN;
    this.message = message;
    this.isError = true;
  }
}

module.exports = PermissionDeniedError;
