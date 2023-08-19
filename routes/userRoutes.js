const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const { ROLE_ADMIN_MANAGER } = require('../config/accessRoles');
const validateDTO = require('../middleware/validateDTO');
const userSchema = require('../validation/schemas/userSchema');

router.use(verifyJWT);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(
    verifyRoles(ROLE_ADMIN_MANAGER),
    validateDTO(userSchema),
    usersController.createNewUser
  )
  .patch(verifyRoles(ROLE_ADMIN_MANAGER), usersController.updateUser)
  .delete(verifyRoles(ROLE_ADMIN_MANAGER), usersController.deleteUser);

module.exports = router;
