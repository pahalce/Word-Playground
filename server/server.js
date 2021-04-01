const SOCKET_TYPE = {
  CHANGE_STATE: "CHANGE_STATE",
  PLAYERS_CHANGED: "PLAYERS_CHANGED",
  SEND_MESSAGE: "SEND_MESSAGE",
  SEND_ANSWER: "SEND_ANSWER",
};

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
/*
  room_list = {
    roomId: {
      players: [ {id,username}, ...],
      answers: [ id:answer, ... ]
    },
    ...
  } 
*/
let room_list = {};

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  const username = socket.handshake.query.username;
  const userId = socket.handshake.query.userId;
  socket.join(id);

  if (room_list[id] === undefined) {
    room_list[id] = { players: [{ id: userId, username }] };
  } else {
    room_list[id].players.push({ id: userId, username });
  }
  io.to(id).emit(SOCKET_TYPE.PLAYERS_CHANGED, room_list[id].players);

  socket.on(SOCKET_TYPE.CHANGE_STATE, (state) => {
    socket.to(id).emit(SOCKET_TYPE.CHANGE_STATE, state);
  });
  socket.on(SOCKET_TYPE.SEND_MESSAGE, (msg) => {
    socket.to(id).emit(SOCKET_TYPE.SEND_MESSAGE, msg);
  });
  socket.on(SOCKET_TYPE.SEND_ANSWER, ({ userId, answer }) => {
    socket.to(id).emit(SOCKET_TYPE.SEND_ANSWER, { userId, answer });
  });

  socket.on("disconnecting", (reason) => {
    room_list[id].players = room_list[id].players.filter((player) => player.id !== userId);
    socket.to(id).emit(SOCKET_TYPE.PLAYERS_CHANGED, room_list[id].players);
    if (room_list[id].players.length === 0) {
      delete room_list[id];
    }
  });
});
