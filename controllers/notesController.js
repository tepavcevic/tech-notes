const asyncHandler = require('express-async-handler');

const User = require('../models/User');
const Client = require('../models/Client');
const Note = require('../models/Note');

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();

    if (!notes?.length) {
        return res.status(204).json({ message: "No notes found." });
    }

    const notesWithUser = await Promise.all(notes.map(async note => {
        const user = await User.findById(note.user).lean().exec();
        const client = await Client.findById(note.client).lean().exec();
        return { ...note, username: user.username, client };
    }))

    res.json(notesWithUser);
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text, client } = req?.body;

    if (!user || !title || !text || !client) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' });
    }

    const note = await Note.create({ user, title, text, client });

    if (note) {
        return res.status(201).json({ message: 'New note created' });
    } else {
        return res.status(400).json({ message: 'Invalid note data received' });
    }

});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req?.body;

    if (!id || !user || !title || !text) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: "Note not found." });
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate note title" });
    }

    note.user = user;
    note.title = title;
    note.text = text;

    if (typeof completed === 'boolean') {
        note.completed = completed;
    }

    const updatedNote = await note.save();

    res.json(`${updatedNote.title} updated.`);
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req?.body;

    if (!id) {
        return res.status(400).json({ message: "Note ID required." });
    }

    const note = await Note.findById(id).lean().exec();
    if (!note) {
        return res.status(400).json({ message: "Note not found." });
    }

    if (!note.completed) {
        return res.status(400).json({ message: "This note has not been completed." });
    }

    const result = await Note.findByIdAndDelete(id);

    const reply = `Username ${result.title} with id ${result._id} deleted.`;
    res.json({ message: reply });
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };