const express = require('express');
const router = express.Router();

const clientsController = require('../controllers/clientsController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const { ROLE_ADMIN_MANAGER } = require('../config/accessRoles');
const validateDTO = require('../middleware/validateDTO');
const clientSchema = require('../validation/schemas/clientSchema');

router.use(verifyJWT);

router
  .route('/')
  .get(clientsController.getAllClients)
  .post(
    verifyRoles(ROLE_ADMIN_MANAGER),
    validateDTO(clientSchema),
    clientsController.createNewClient
  )
  .patch(verifyRoles(ROLE_ADMIN_MANAGER), clientsController.updateClient)
  .delete(verifyRoles(ROLE_ADMIN_MANAGER), clientsController.deleteClient);

module.exports = router;
