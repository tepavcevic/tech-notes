class ConflictError extends Error {
  constructor(message) {
    super();
    this.name = 'ConflictError';
    this.status = 409;
    this.message = message;
  }
}
