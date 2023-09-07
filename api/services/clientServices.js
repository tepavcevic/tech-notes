const { messageResponses } = require('../constants/responses');
const Client = require('../models/Client');
const Note = require('../models/Note');
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require('../validation/errors/index.js');

function clientServices() {
  return {
    getClients: async () => {
      const clients = await Client.find().lean();

      if (!clients?.length) throw new NotFoundError(messageResponses.NOT_FOUND);

      return clients;
    },
    findClientById: async (id) => {
      const client = await Client.findById(id);

      //temporarily disabled because some note documents dont have client id
      //   if (!client) throw new NotFoundError('Client not found.');

      return client;
    },
    createClient: async (payload) => {
      const { IDnumber } = payload;

      const duplicate = await Client.findOne({ IDnumber })
        .collation({ locale: 'en', strength: 2 })
        .lean()
        .exec();

      if (duplicate)
        throw new ConflictError(messageResponses.DUPLICATE_IDENTIFIER);

      const client = await Client.create({ ...payload });

      return client;
    },
    updateClient: async (payload) => {
      const { id, IDnumber } = payload;

      const [client, note, duplicateID] = await Promise.all([
        Client.findById(id).exec(),
        Note.findOne({ client: id }).lean(),
        Client.findOne({ IDnumber })
          .collation({ locale: 'en', strength: 2 })
          .lean(),
      ]);

      if (!client) throw new NotFoundError(messageResponses.NOT_FOUND);

      if (note && !client.active)
        throw new ConflictError(messageResponses.CLIENT_HAS_ASSIGNED_NOTES);

      if (duplicateID && duplicateID?._id.toString() !== id)
        throw new ConflictError(messageResponses.DUPLICATE_IDENTIFIER);

      const updatedClient = await Client.findByIdAndUpdate(id, payload).exec();

      return updatedClient;
    },
    deleteClient: async (payload) => {
      const { id } = payload;

      if (!id)
        throw new BadRequestError(messageResponses.INVALID_DATA_RECEIVED);

      const note = await Note.findOne({ client: id }).lean().exec();
      if (note)
        throw new ConflictError(messageResponses.CLIENT_HAS_ASSIGNED_NOTES);

      const client = await Client.findByIdAndDelete(id).lean();
      if (!client) throw new NotFoundError(messageResponses.NOT_FOUND);

      return client;
    },
  };
}
module.exports = clientServices;
