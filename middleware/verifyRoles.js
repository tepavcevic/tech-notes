const PermissionDeniedError = require('../validation/errors/PermissionDeniedError');

const userDoesntHaveRole = (username) => {
  console.log(JSON.stringify(`USER_DOESNT_HAVE_ACCESS_ROLE  ${username}`));
  throw new PermissionDeniedError("User doesn't have access role.");
};

const checkUserRole = (allowedRoles, tokenRoles, username) => {
  const role = tokenRoles?.filter((r) => allowedRoles.includes(r));

  if (role.length === 0) return userDoesntHaveRole(username);

  return true;
};

module.exports = (allowedRoles) =>
  async function (req, res, next) {
    try {
      req.assertUserRole = (allowedRoles) => {
        return checkUserRole(allowedRoles, req.roles, req.user);
      };

      if (allowedRoles) req.assertUserRole(allowedRoles);

      next();
    } catch (error) {
      next(error);
    }
  };
