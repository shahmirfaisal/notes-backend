const Note = require("../models/note");
const { errorHandler } = require("../utils");
const { io, socket } = require("../socket");

const handleSocket = () => {
  socket?.on("save updated note", async ({ id, content }) => {
    const note = await Note.findById(id);
    note.content = content;
    note.updatedAt = Date.now();
    await note.save();
    socket.emit("get updated note", note);
  });
};

exports.createNote = async (req, res, next) => {
  const note = new Note({ content: "", user: req.userId });
  await note.save();
  // handleSocket();
  res.json({ note });
};

exports.deleteNote = async (req, res, next) => {
  const { id } = req.params;
  const note = await Note.findOneAndDelete({ _id: id });
  res.json({ note });
};

exports.getNotes = async (req, res, next) => {
  const notes = await Note.find({ user: req.userId });
  res.json({ notes });
};

exports.getNote = async (req, res, next) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  res.json({ note });
};

exports.renameNote = async (req, res, next) => {
  const { id } = req.params;
  let { name } = req.body;
  name = name.trim();

  if (!name.length) {
    return errorHandler(next, "Enter the name!", 422);
  }

  const note = await Note.findById(id);
  note.name = name;
  await note.save();
  res.json({ note });
};
