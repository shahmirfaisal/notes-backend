const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const http = require("http");
const { initSocket } = require("./socket");
require("dotenv").config();

const userRoutes = require("./routes/user");
const noteRoutes = require("./routes/note");
const Note = require("./models/note");

const app = express();
app.use(cors());
const httpServer = http.createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
});

app.use(express.json());

// app.use(passport.initialize());
// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((obj, done) => done(null, obj));
// passport.use(
//   new FacebookStrategy({}, (accessToken, refreshToken, profile, done) => {})
// );

app.use("/user", userRoutes);
app.use("/note", noteRoutes);

app.use((error, req, res, next) => {
  res.status(error.status).json({ message: error.message });
});

io.on("connection", (socket) => {
  console.log("Socket");
  initSocket(io, socket);
  socket.emit("connected");

  socket.on("save updated note", async ({ id, content }) => {
    const note = await Note.findById(id);
    note.content = content;
    note.updatedAt = Date.now();
    await note.save();
    socket.emit("get updated note", note);
  });
});

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  httpServer.listen(process.env.PORT || 3000, () =>
    console.log("Running on 3000!")
  );
})();
