const ajv = require('../ajvInstance');

const noteSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 4,
      maxLength: 100,
    },
    text: {
      type: 'string',
      minLength: 4,
      maxLength: 1000,
    },
    completed: {
      type: 'boolean',
      default: false,
    },
    user: {
      type: 'string',
    },
    client: {
      type: 'string',
    },
  },
  required: ['title', 'text', 'user', 'client'],
};

module.exports = ajv.compile(noteSchema);
