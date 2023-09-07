const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const { ROLE_ADMIN_MANAGER } = require('../config/accessRoles');
const validateDTO = require('../middleware/validateDTO');
const {
  userSchemaAjv,
  updateUserSchemaAjv,
} = require('../validation/schemas/index.js');

router.use(verifyJWT);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(
    verifyRoles(ROLE_ADMIN_MANAGER),
    validateDTO(userSchemaAjv),
    usersController.createNewUser
  )
  .patch(
    verifyRoles(ROLE_ADMIN_MANAGER),
    validateDTO(updateUserSchemaAjv),
    usersController.updateUser
  )
  .delete(verifyRoles(ROLE_ADMIN_MANAGER), usersController.deleteUser);

module.exports = router;
