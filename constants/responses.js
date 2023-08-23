const statusCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};

const messageResponses = {
  ALL_FIELDS_REQUIRED: 'All fields are required.',
  UNAUTHORIZED: 'Unauthorized.',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found.',
  CREATED: 'Created',
  INVALID_DATA_RECEIVED: 'Invalid data received.',
  DUPLICATE_IDENTIFIER: 'Duplicate identifier.',
  IDENTIFIER_REQUIRED: 'Identifier field is required.',
  NOTE_NOT_COMPLETED: 'Note is not completed.',
  USER_HAS_ASSIGNED_NOTES: 'User has assigned notes.',
  CREATED: 'created.',
  UPDATED: 'updated.',
  DELETED: 'deleted.',
  SERVER_ERROR: 'Internal server error.',
  COOKIE_CLEARED: 'Cookie cleared.',
};

module.exports = { statusCodes, messageResponses };
