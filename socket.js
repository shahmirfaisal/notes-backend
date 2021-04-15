let io, socket;
const initSocket = (IO, SOCKET) => {
  io = IO;
  socket = SOCKET;
};

module.exports = { io, socket, initSocket };
