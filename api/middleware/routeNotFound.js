const { statusCodes, messageResponses } = require('../constants/responses');

const routeNotFound = (req, res, next) => {
  return res.status(statusCodes.NOT_FOUND).json({
    message: `${req.originalUrl} ${messageResponses.NOT_FOUND}`,
  });
};

module.exports = routeNotFound;
