class PermissionDeniedError extends Error {
  constructor(message) {
    super();
    this.name = 'PermissionDeniedError';
    this.status = 403;
    this.message = message;
    this.isError = true;
  }
}

module.exports = PermissionDeniedError;
