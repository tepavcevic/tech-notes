const ajv = require('../ajvInstance');

const updateNoteAjv = {
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
    },
    user: {
      type: 'string',
    },
    client: {
      type: 'string',
    },
  },
  required: ['title', 'text', 'completed', 'user', 'client'],
};
module.exports = ajv.compile(updateNoteAjv);
