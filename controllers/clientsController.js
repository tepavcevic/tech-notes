const asyncHandler = require('express-async-handler');

const { statusCodes, messageResponses } = require('../constants/responses');
const clientService = require('../services/clientServices');

const {
  getClients,
  createClient,
  updateClient: updateClientService,
  deleteClient: deleteClientService,
} = clientService();

// @desc Get all clients
// @route GET /clients
// @access Private
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await getClients();

  res.json(clients);
});

// @desc Create new client
// @route POST /clients
// @access Private
const createNewClient = asyncHandler(async (req, res) => {
  const client = await createClient(req.body);

  if (client) {
    res
      .status(statusCodes.CREATED)
      .json({ message: `${client.firstName} ${messageResponses.CREATED}` });
  } else {
    res
      .status(statusCodes.BAD_REQUEST)
      .json({ message: messageResponses.INVALID_DATA_RECEIVED });
  }
});

// @desc Update a client
// @route PATCH /clients
// @access Private
const updateClient = asyncHandler(async (req, res) => {
  const updatedClient = await updateClientService(req.body);

  res.json(`${updatedClient.email} ${messageResponses.UPDATED}`);
});

// @desc Delete a client
// @route DELETE /clients
// @access Private
const deleteClient = asyncHandler(async (req, res) => {
  const deletedClient = await deleteClientService(req.body);

  res.json({
    message: `${deletedClient.firstName} ${messageResponses.DELETED}`,
  });
});

module.exports = { getAllClients, createNewClient, updateClient, deleteClient };
