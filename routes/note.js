const route = require("express").Router();
const {
  createNote,
  deleteNote,
  getNotes,
  getNote,
  renameNote,
} = require("../controllers/note");
const checkAuth = require("../middlewares/checkAuth");

route.post("/", checkAuth, createNote);
route.delete("/:id", checkAuth, deleteNote);
route.get("/", checkAuth, getNotes);
route.get("/:id", checkAuth, getNote);
route.patch("/:id", checkAuth, renameNote);

module.exports = route;
