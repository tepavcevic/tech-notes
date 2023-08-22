class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.name = 'UnauthorizedError';
    this.status = 401;
    this.message = message;
    this.isError = true;
  }
}

module.exports = UnauthorizedError;
