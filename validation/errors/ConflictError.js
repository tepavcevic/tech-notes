class ConflictError extends Error {
  constructor(errorMessage) {
    super();
    this.name = 'ConflictError';
    this.status = 409;
    this.message = errorMessage;
    this.isError = true;
  }
}

module.exports = ConflictError;
