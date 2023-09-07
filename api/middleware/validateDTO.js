const ValidationError = require('../validation/errors/ValidationError');

function validateDTO(ajvValidate) {
  return (req, res, next) => {
    const isValid = ajvValidate(req.body);
    if (!isValid) {
      const errors = ajvValidate.errors;
      throw new ValidationError(errors);
    }

    next();
  };
}

module.exports = validateDTO;
