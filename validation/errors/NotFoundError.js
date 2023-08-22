class NotFoundError extends Error {
  constructor(message) {
    super();
    this.name = 'NotFoundError';
    this.status = 404;
    this.message = message;
    this.isError = true;
  }
}

module.exports = NotFoundError;
