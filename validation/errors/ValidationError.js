class ValidationError extends Error {
  constructor(errors) {
    super();
    this.name = 'ValidationError';
    this.status = 400;
    this.message = errors.map((error) => error.message).join(', ');
    this.isError = true;
  }
}

module.exports = ValidationError;
