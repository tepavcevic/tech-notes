const asyncHandler = require('express-async-handler');

const noteServices = require('../services/noteServices');
const userServices = require('../services/userServices');
const clientServices = require('../services/clientServices');
const { ConflictError, BadRequestError } = require('../validation/errors');
const { statusCodes, messageResponses } = require('../constants/responses');

const note = noteServices();
const user = userServices();
const client = clientServices();

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await note.getNotes();

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
  const noteToDelete = await note.deleteNote();

  res.json(`${noteToDelete.title} ${messageResponses.DELETED}`);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
