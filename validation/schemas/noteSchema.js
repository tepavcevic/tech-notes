const ajv = require('../ajvInstance');

const noteSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
  },
};
