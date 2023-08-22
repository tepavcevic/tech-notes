const Client = require('../models/Client');
const { NotFoundError } = require('../validation/errors/index.js');

const clientServices = () => {
  return {
    getClients: async () => {
      const clients = await Client.find();

      if (!clients?.length) throw new NotFoundError('No clients found.');

      return clients;
    },
    findClientById: async (id) => {
      const client = await Client.findById(id);

      //temporarily disabled because some note documents dont have client id
      //   if (!client) throw new NotFoundError('Client not found.');

      return client;
    },
    createClient: async (client) => {
      return await Client.create(client);
    },
    updateClient: async (id, client) => {
      return await Client.findByIdAndUpdate(id, client);
    },
  };
};
module.exports = clientServices;
