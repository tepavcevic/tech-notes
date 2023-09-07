const ajv = require('../ajvInstance');

const updateClientSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    firstName: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: "^[a-zA-Zа-яА-ЯćčđšžĆČĐŠŽ'-]+$|^[p{L}ćčđšžĆČĐŠŽ'-]+$",
    },
    lastName: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: "^[a-zA-Zа-яА-ЯćčđšžĆČĐŠŽ'-]+$|^[p{L}ćčđšžĆČĐŠŽ'-]+$",
    },
    IDnumber: {
      type: 'string',
      minLength: 9,
      maxLength: 9,
    },
    email: {
      type: 'string',
      format: 'email',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
    },
    phone: {
      type: 'string',
      maxLength: 15,
    },
    street: {
      type: 'string',
      maxLength: 64,
    },
    city: {
      type: 'string',
      maxLength: 64,
    },
    position: {
      type: 'object',
      properties: {
        lat: {
          type: 'string',
        },
        lng: {
          type: 'string',
        },
      },
      required: ['lat', 'lng'],
    },
    active: { type: 'boolean' },
  },
  required: [
    'id',
    'firstName',
    'lastName',
    'IDnumber',
    'email',
    'phone',
    'street',
    'city',
    'position',
    'active',
  ],
  additionalProperties: false,
};

module.exports = ajv.compile(updateClientSchema);
