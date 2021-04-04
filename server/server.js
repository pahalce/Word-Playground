const themes = require("./theme");

// you need to change globals.js as well
const SOCKET_TYPE = {
  INIT_CONNECTION: "INIT_CONNECTION",
  PLAYERS_CHANGED: "PLAYERS_CHANGED",
  RECONNECT: "RECONNECT",
  CHANGE_STATE: "CHANGE_STATE",
  GET_THEME: "GET_THEME",
  SEND_MESSAGE: "SEND_MESSAGE",
  SEND_ANSWER: "SEND_ANSWER",
  VOTE: "VOTE",
  VOTE_DONE: "VOTE_DONE",
  CALC_POINTS: "CALC_POINTS",
};
const STATE = {
  BEFORE_GAME: "BEFORE_GAME",
  ANSWER: "ANSWER",
  SHOW_ANSWER: "SHOW_ANSWER",
  VOTE: "VOTE",
  VOTE_DONE: "VOTE_DONE",
  SHOW_POINTS: "SHOW_POINTS",
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
      answers: { id:answer, ... },
      votes: {id:id},
      points: {id:0},
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

  // first player to join the room
  if (room_list[id] === undefined) {
    room_list[id] = {
      players: [{ id: userId, username}],
      state: STATE.BEFORE_GAME,
      theme: {},
      answers: {},
      votes: {},
      points: {}
    };
  } else {
    room_list[id].players.push({ id: userId, username });
  }

  if (reconnecting === "true") {
    io.to(socket.id).emit(SOCKET_TYPE.RECONNECT, room_list[id]);
  } else {
    room_list[id].points[userId] = 0;
  }
  io.to(socket.id).emit(SOCKET_TYPE.INIT_CONNECTION, room_list[id]);


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
  socket.on(SOCKET_TYPE.VOTE, ({voteBy, voteTo}) => {
    // user re-clicked voted card
    if (voteTo === null) {
      delete room_list[id].votes[voteBy]
      return
    }
    room_list[id].votes[voteBy] = voteTo;
    // all players voted
    if (Object.keys(room_list[id].votes).length === room_list[id].players.length) {
      io.to(id).emit(SOCKET_TYPE.VOTE_DONE)
    }
  });

  socket.on(SOCKET_TYPE.CALC_POINTS, () => {
    Object.keys(room_list[id].votes).forEach(fromId => {
      const to = room_list[id].votes[fromId];
      room_list[id].points[to] += 1;
    })
    room_list[id].votes = {}
    io.to(id).emit(SOCKET_TYPE.CALC_POINTS, room_list[id].points)
  })

  socket.on("disconnecting", (reason) => {
    room_list[id].players = room_list[id].players.filter((player) => player.id !== userId);
    socket.to(id).emit(SOCKET_TYPE.PLAYERS_CHANGED, room_list[id].players);
    if (room_list[id] && room_list[id].players.length === 0) {
      delete room_list[id];
    }
  });
});
