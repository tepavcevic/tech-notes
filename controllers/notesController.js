const asyncHandler = require('express-async-handler');

const noteServices = require('../services/noteServices');
const userServices = require('../services/userServices');
const clientServices = require('../services/clientServices');
const { ConflictError, BadRequestError } = require('../validation/errors');

const note = noteServices();
const user = userServices();
const client = clientServices();

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await note.getNotes();

  const notesWithUserAndClient = await Promise.all(
    notes?.map(async (note) => {
      const noteUser = await user.findUserById(note.user);
      const noteClient = await client.findClientById(note.client);
      return {
        ...note,
        username: noteUser.username,
        clientMetadata: noteClient,
      };
    })
  );

  res.json(notesWithUserAndClient);
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text, client } = req?.body;

  const duplicate = await note.checkDuplicateNoteTitle(title);

  if (duplicate) throw new ConflictError('Duplicate note title');

  const createdNote = await note.createNote(user, title, text, client);

  if (createdNote) {
    return res.status(201).json({ message: 'New note created' });
  } else {
    throw new BadRequestError('Invalid note data received');
  }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const receivedNote = req?.body;

  await note.findNoteById(receivedNote.id);

  const duplicate = await note.checkDuplicateNoteTitle(receivedNote.title);
  if (duplicate && duplicate?._id.toString() !== receivedNote.id)
    throw new ConflictError('Duplicate note title');

  await user.findUserById(receivedNote.user);
  await client.findClientById(receivedNote.client);

  const updatedNote = await note.save(receivedNote);

  res.json(`${updatedNote.title} updated.`);
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req?.body;

  if (!id) throw new BadRequestError('Note id is required.');

  const noteToDelete = await note.findNoteById(id);

  if (!noteToDelete.completed)
    throw new BadRequestError('Note is not completed.');

  await note.deleteNote(id);

  res.json(`${noteToDelete.title} deleted.`);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
