const express = require("express");
const {
  addNewNotes,
  deleteNote,
  editNotes,
  getAllNotes,
  getIndividualNotes,
} = require("../controllers/notes");
const router = express.Router();

router.get("/get-notes/:notesId", getAllNotes);
router.get("/get-note/:notesId/:noteId", getIndividualNotes);
router.post("/add-note", addNewNotes);
router.delete("/delete-note/:notesId/:noteId", deleteNote);
router.post("/edit-note", editNotes);

exports.notesRoute = router;
