const Note = require('../models/Note');
const User = require('../models/User');
const Client = require('../models/Client');
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require('../validation/errors');
const { messageResponses } = require('../constants/responses');

function noteServices() {
  return {
    getNotes: async () => {
      const notes = await Note.find().lean();
      if (!notes?.length) return res.status(statusCodes.NO_CONTENT).json([]);

      const notesWithUserAndClient = await Promise.all(
        notes.map(async (note) => {
          const noteUser = await User.findById(note.user);
          const noteClient = await Client.findById(note.client);
          return {
            ...note,
            username: noteUser.username,
            clientMetadata: noteClient,
          };
        })
      );

      return notesWithUserAndClient;
    },
    createNote: async (payload) => {
      const { user: userId, title, text, client: clientId } = payload;

      const [duplicate, client, user] = await Promise.all([
        Note.findOne({ title }).lean(),
        Client.findById(clientId).lean(),
        User.findById(userId).lean(),
      ]);

      if (duplicate)
        throw new ConflictError(messageResponses.DUPLICATE_IDENTIFIER);

      console.log(client, '\n\n\n', user);
      if (!client.active || !user.active)
        throw new BadRequestError(messageResponses.USER_CLENT_NOT_ACTIVE);

      const newNote = await Note.create({
        user: userId,
        title,
        text,
        client: clientId,
      });

      return newNote;
    },
    findNoteById: async (id) => {
      const note = await Note.findById(id).lean();

      console.log(note);

      if (!note) throw new NotFoundError(messageResponses.NOT_FOUND);

      return note;
    },
    updateNote: async (payload) => {
      const { id, ...data } = payload;

      const duplicate = await Note.findOne({ title: data.title }).lean();

      if (duplicate && duplicate?._id.toString() !== id)
        throw new ConflictError(messageResponses.DUPLICATE_IDENTIFIER);

      const noteUser = await User.findById(data.user);
      const noteClient = await Client.findById(data.client);

      if (!noteUser || !noteClient)
        throw new BadRequestError(messageResponses.USER_CLIENT_NOT_FOUND);

      const updatedNote = await Note.findByIdAndUpdate(id, data);

      return updatedNote;
    },
    deleteNote: async (payload) => {
      const { id } = payload;

      if (!id) throw new BadRequestError(messageResponses.IDENTIFIER_REQUIRED);

      const noteToDelete = await Note.findById(id);

      if (!noteToDelete.completed)
        throw new BadRequestError(messageResponses.NOTE_NOT_COMPLETED);

      await Note.findByIdAndDelete(id).lean();

      return noteToDelete;
    },
  };
}

module.exports = noteServices;
