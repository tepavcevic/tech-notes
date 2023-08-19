const ajv = require('../ajvInstance');

const userSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    password: {
      type: 'string',
      minLength: 4,
      maxLength: 20,
      format: 'password',
    },
    roles: {
      type: 'array',
      items: {
        enum: ['Employee', 'Manager', 'Admin'],
      },
      default: ['Employee'],
      minItems: 1,
      maxItems: 3,
    },
    active: { type: 'boolean' },
  },
  required: ['username', 'password', 'roles'],
  additionalProperties: false,
};

module.exports = ajv.compile(userSchema);
