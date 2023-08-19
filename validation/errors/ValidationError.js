class ValidationError extends Error {
  constructor(errors) {
    super();
    this.name = 'ValidationError';
    this.status = 400;
    this.message = errors.map((error) => error.message).join(', ');
  }
}

module.exports = ValidationError;
