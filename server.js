require('dotenv').config();
const express = require("express")
var admin = require('firebase-admin');
const themes = require("./theme");
const {SOCKET_TYPE, STATE} = require("./globals")


const PORT = process.env.PORT || 5000;
const client_url = process.env.CLIENT_URL;
const server = express().listen(PORT);


admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const io = require("socket.io")(server, {
  cors: {
    origin: client_url,
    methods: ["GET", "POST"],
  },
});

//middlewares
io.use((socket, next) => {
  const idToken = socket.handshake.query.idToken;
  admin.auth().verifyIdToken(idToken).then((decodedToken) => {
    socket.handshake.query.userId = decodedToken.uid
    next()
  }).catch(err => {
    next(new Error(err.message))
  })
});


let room_list = {};
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
