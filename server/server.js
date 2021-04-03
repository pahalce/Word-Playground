const themes = require("./theme");

// you need to change globals.js as well
const SOCKET_TYPE = {
  PLAYERS_CHANGED: "PLAYERS_CHANGED",
  RECONNECT: "RECONNECT",
  CHANGE_STATE: "CHANGE_STATE",
  GET_THEME: "GET_THEME",
  SEND_MESSAGE: "SEND_MESSAGE",
  SEND_ANSWER: "SEND_ANSWER",
};
const STATE = {
  BEFORE_GAME: "BEFORE_GAME",
  ANSWER: "ANSWER",
  SHOW_ANSWER: "SHOW_ANSWER",
  VOTE: "VOTE",
};

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/* properties */
/*
  room_list = {
    roomId: {
      players: [ {id,username}, ...],
      state: state,
      theme: {startingLetter, theme_content},
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
  const reconnecting = socket.handshake.query.reconnecting;
  socket.join(id);

  if (room_list[id] === undefined) {
    room_list[id] = {
      players: [{ id: userId, username }],
      state: STATE.BEFORE_GAME,
      theme: {},
      answers: {},
    };
  } else {
    room_list[id].players.push({ id: userId, username });
  }

  if (reconnecting) {
    io.to(socket.id).emit(SOCKET_TYPE.RECONNECT, room_list[id]);
  }

  io.to(id).emit(SOCKET_TYPE.PLAYERS_CHANGED, room_list[id].players);
  socket.on(SOCKET_TYPE.CHANGE_STATE, (state) => {
    room_list[id].state = state;
    io.to(id).emit(SOCKET_TYPE.CHANGE_STATE, state);
  });
  socket.on(SOCKET_TYPE.GET_THEME, () => {
    room_list[id].answers = {};
    room_list[id].state = STATE.ANSWER;
    const newTheme = {
      startingLetter: themes.getRandomLetter(),
      theme_content: themes.getRandomTheme(),
    };
    room_list[id].theme = newTheme;
    io.to(id).emit(SOCKET_TYPE.GET_THEME, room_list[id]);
  });

  socket.on(SOCKET_TYPE.SEND_MESSAGE, (msg) => {
    socket.to(id).emit(SOCKET_TYPE.SEND_MESSAGE, msg);
  });
  socket.on(SOCKET_TYPE.SEND_ANSWER, ({ userId, answer }) => {
    room_list[id].answers[userId] = answer;
    socket.to(id).emit(SOCKET_TYPE.SEND_ANSWER, { userId, answer });
  });

  socket.on("disconnecting", (reason) => {
    room_list[id].players = room_list[id].players.filter((player) => player.id !== userId);
    socket.to(id).emit(SOCKET_TYPE.PLAYERS_CHANGED, room_list[id].players);
    if (room_list[id] && room_list[id].players.length === 0) {
      delete room_list[id];
    }
  });
});
