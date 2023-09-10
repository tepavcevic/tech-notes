const express = require('express');
const router = express.Router();

const notesController = require('../controllers/notesController');
const verifyJWT = require('../middleware/verifyJWT');
const validateDTO = require('../middleware/validateDTO');
const {
  noteSchemaAjv,
  updateNoteSchemaAjv,
} = require('../validation/schemas/index.js');

router.use(verifyJWT);

router
  .route('/')
  .get(notesController.getAllNotes)
  .post(validateDTO(noteSchemaAjv), notesController.createNewNote)
  .patch(validateDTO(updateNoteSchemaAjv), notesController.updateNote)
  .delete(notesController.deleteNote);

router.route('/:id').get(notesController.getNoteById);

module.exports = router;
