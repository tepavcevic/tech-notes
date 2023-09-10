const asyncHandler = require('express-async-handler');

const noteServices = require('../services/noteServices');
const { BadRequestError } = require('../validation/errors');
const { statusCodes, messageResponses } = require('../constants/responses');

const note = noteServices();

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await note.getNotes(req.query);

  res.json(notes);
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const createdNote = await note.createNote(req.body);

  if (createdNote) {
    return res
      .status(statusCodes.CREATED)
      .json({ message: `${createdNote.title} ${messageResponses.CREATED}` });
  } else {
    throw new BadRequestError(messageResponses.INVALID_DATA_RECEIVED);
  }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const updatedNote = await note.updateNote(req.body);

  res.json(`${updatedNote.title} ${messageResponses.UPDATED}`);
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const noteToDelete = await note.deleteNote(req.body);

  res.json(`${noteToDelete.title} ${messageResponses.DELETED}`);
});

// @desc Get a note
// @route GET /notes/:id
// @access Private
const getNoteById = asyncHandler(async (req, res) => {
  const foundNote = await note.findNoteById(req.params);

  res.json(foundNote);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
  getNoteById,
};
