const Note = require('../models/Note');

const noteServices = () => {
  return {
    getNotes: async () => {
      const notes = await Note.find().lean();

      if (!notes?.length) throw new NotFoundError('No notes found.');

      return notes;
    },
    createNote: async (data) => {
      const note = await Note.create(data);

      return note;
    },
    findNoteById: async (id) => {
      const note = await Note.findById(id).lean();

      if (!note) throw new NotFoundError('Note not found.');

      return note;
    },
    updateNote: async (id, data) => {
      const updatedNote = await Note.findByIdAndUpdate(id, data, {
        new: true,
      }).lean();

      if (!updatedNote) throw new NotFoundError('Note not found.');

      return updatedNote;
    },
    deleteNote: async (id) => {
      const deletedNote = await Note.findByIdAndDelete(id).lean();

      if (!deletedNote) throw new NotFoundError('Note not found.');

      return deletedNote;
    },
    findNotesByUserId: async (userId) => {
      const notes = await Note.find({ user: userId }).lean();

      return notes;
    },
  };
};

module.exports = noteServices;
