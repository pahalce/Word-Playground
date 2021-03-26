const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  socket.on("add-player", (msg) => {
    socket.broadcast.emit("r", msg);
  });
  socket.on("change-state", (state) => {
    socket.broadcast.emit("change-state", state);
  });
});
