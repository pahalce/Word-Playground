const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log("connected:", socket.id);
  console.log("room:", id);

  socket.on("add-player", (msg) => {
    socket.to(id).emit("r", msg);
  });
  socket.on("change-state", (state) => {
    socket.to(id).emit("change-state", state);
  });
  socket.on("disconnecting", (reason) => {
    socket.to(id).emit("user-left", socket.id);
  });
  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
    console.log("room:", id);
  });
});
