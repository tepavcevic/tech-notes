class BadRequestError extends Error {
  constructor(errorMessage) {
    super();
    this.name = 'BadRequestError';
    this.status = 400;
    this.message = errorMessage;
  }
}

module.exports = BadRequestError;
