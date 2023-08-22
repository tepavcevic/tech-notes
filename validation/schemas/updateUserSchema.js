const ajv = require('../ajvInstance');

const updateUserSchemaAjv = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
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
    },
    active: { type: 'boolean' },
  },
  required: ['id', 'username', 'roles', 'active'],
};

module.exports = ajv.compile(updateUserSchemaAjv);
