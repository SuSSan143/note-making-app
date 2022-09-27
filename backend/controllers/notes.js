const Notes = require("../models/notes");

exports.getAllNotes = async (req, res, next) => {
  const { notesId } = req.params;
  const data = await Notes.findById(notesId);
  res.status(200).json(data);
};

exports.getIndividualNotes = async (req, res, next) => {
  const { noteId, notesId } = req.params;

  const retrivedData = await Notes.findById(notesId);

  const filteredNote = retrivedData?.notes.filter(
    // @ts-ignore
    (item) => String(item._id) === noteId
  )[0];

  res.status(200).json(filteredNote);
};

exports.addNewNotes = async (req, res, next) => {
  const {
    data: { title, description },
    notesId,
  } = req.body;

  const retrivedData = await Notes.findById(notesId);

  const filteredArray = retrivedData?.notes.filter(
    (item) => item.title === title
  );

  // @ts-ignore
  if (filteredArray?.length > 0)
    return res.status(400).json({ error: "Duplicate Titles are not allowed" });

  retrivedData?.notes.push({ title, description });
  const data = await retrivedData?.save();
  res.status(200).json(data);
};

exports.deleteNote = async (req, res, next) => {
  const { noteId, notesId } = req.params;
  const retrivedData = await Notes.findById(notesId);

  // @ts-ignore
  retrivedData?.notes.pull({ _id: noteId });
  const data = await retrivedData?.save();
  res.status(200).json(data);
};

exports.editNotes = async (req, res, next) => {
  const { title, description, notesId, noteId } = req.body;

  const retrivedData = await Notes.findOneAndUpdate(
    {
      _id: notesId.toString(),
      "notes._id": noteId,
    },
    { $set: { "notes.$.title": title, "notes.$.description": description } }
  );

  await retrivedData?.save();

  const updatedData = await Notes.findById(notesId);
  res.status(200).json(updatedData);
};
