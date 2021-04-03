import { useEffect, useRef, useState } from "react";
import Card from "../reusables/Card";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import BtnIcon from "../reusables/BtnIcon";
import { MdInsertEmoticon, MdSettings } from "react-icons/md";
import { useHistory, useLocation } from "react-router";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import io from "socket.io-client";
import { toast } from "react-toastify";
import Button from "../reusables/Button";
import { STATE, SOCKET_TYPE } from "../../misc/globals";

const GamePage = () => {
  const history = useHistory();
  const location = useLocation();
  const roomId = location.pathname.split("/").pop();
  const { username, currentUser } = useAuth();
  const [room, setRoom] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [socket, setSocket] = useState();
  const [state, setState] = useState(STATE.BEFORE_GAME);
  const [players, setPlayers] = useState([]); // [{id,username},...]
  const [answers, setAnswers] = useState({});
  const [boardMsg, setBoardMsg] = useState({});
  const [letter, setLetter] = useState("");
  const [theme, setTheme] = useState("");
  const answerRef = useRef("");

  // init connection to room
  useEffect(() => {
    let newSocket;
    db.rooms
      .doc(roomId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().isGameStarted === true) {
            // not allowed to enter (game is already started && you are not reconnecting)
            if (!doc.data().startingMember.includes(currentUser.uid)) {
              toast.error("This room is closed.");
              history.push("/rooms");
              return;
            }
            // reconnect to room
            newSocket = io("http://localhost:5000", {
              query: { id: roomId, userId: currentUser.uid, username, reconnecting: true },
            });
          } else {
            // first time to enter room
            newSocket = io("http://localhost:5000", {
              query: { id: roomId, userId: currentUser.uid, username, reconnecting: false },
            });
          }
          setSocket(newSocket);
          setRoom(db.formatDoc(doc));
          const owner = doc.data().owner;
          if (owner === currentUser.uid) {
            setIsOwner(true);
          }
        } else {
          toast.error("No such document!");
        }
      })
      .catch((error) => {
        toast.error("Error getting document:", error);
      });
    const unsubscribe = db.rooms.doc(roomId).onSnapshot(
      (snapshot) => {
        setRoom(db.formatDoc(snapshot));
      },
      (err) => {
        toast.error(err);
      }
    );

    return () => {
      unsubscribe();
      newSocket?.close();
    };
  }, [roomId, username, location.pathname, currentUser.uid, history]);

  // handle board message
  useEffect(() => {
    const boardList = {};
    players.forEach((player) => {
      boardList[player.id] = "";
    });
    switch (state) {
      case STATE.BEFORE_GAME:
        Object.keys(boardList).forEach((key) => {
          boardList[key] = "待機中...";
        });
        break;

      case STATE.ANSWER:
        players.forEach((player) => {
          if (answers[player.id]) {
            boardList[player.id] = "回答済み";
            if (player.id === currentUser.uid) {
              boardList[player.id] += `(${answers[player.id]})`;
            }
          } else {
            boardList[player.id] = "回答中...";
          }
        });
        break;

      case STATE.SHOW_ANSWER:
        players.forEach((player) => {
          boardList[player.id] = answers[player.id];
        });
        break;

      default:
        toast("indef");
        Object.keys(boardList).forEach((key) => {
          boardList[key] = "待機中...";
        });
        break;
    }
    setBoardMsg(boardList);
  }, [state, players, answers, currentUser.uid]);

  // init socket server
  // useEffect(() => {
  //   const newSocket = io("http://localhost:5000", {
  //     query: { id: roomId, userId: currentUser.uid, username },
  //   });
  //   setSocket(newSocket);

  //   return () => newSocket.close();
  // }, [roomId, currentUser.uid, username]);

  // socket events
  useEffect(() => {
    if (socket == null) return;

    socket.on(SOCKET_TYPE.PLAYERS_CHANGED, (newPlayers) => {
      setPlayers(newPlayers);
    });
    socket.on(SOCKET_TYPE.RECONNECT, (data) => {
      setState(data.state);
      setLetter(data.theme.startingLetter);
      setTheme(data.theme.theme_content);
      setAnswers(data.answers);
    });
    socket.on(SOCKET_TYPE.CHANGE_STATE, (newState) => {
      setState(newState);
    });
    socket.on(SOCKET_TYPE.GET_THEME, ({ startingLetter, theme_content }) => {
      setLetter(startingLetter);
      setTheme(theme_content);
    });
    socket.on(SOCKET_TYPE.SEND_ANSWER, ({ userId, answer }) => {
      const answers_list = Object.assign({}, answers);
      answers_list[userId] = answer;
      setAnswers(answers_list);
    });
    socket.on(SOCKET_TYPE.SEND_MESSAGE, (msg) => toast.info(msg));

    return () => {
      Object.keys(SOCKET_TYPE).forEach((type) => {
        socket.off(type);
      });
    };
  }, [socket, answers]);

  const gameStart = (e) => {
    e.preventDefault();

    db.rooms
      .doc(roomId)
      .set({ isGameStarted: true, startingMember: players.map((player) => player.id) }, { merge: true })
      .then(() => {
        socket.emit(SOCKET_TYPE.CHANGE_STATE, STATE.ANSWER);
        setState(STATE.ANSWER);
        socket.emit(SOCKET_TYPE.GET_THEME);
      })
      .catch((err) => {
        toast.err(err.message);
      });
  };
  const sendAnswer = (e) => {
    e.preventDefault();
    const answer_list = Object.assign({}, answers);
    if (answer_list[currentUser.uid] === answerRef.current.value) {
      answerRef.current.value = "";
      return;
    }
    answer_list[currentUser.uid] = answerRef.current.value;
    setAnswers(answer_list);
    socket.emit(SOCKET_TYPE.SEND_ANSWER, { userId: currentUser.uid, answer: answerRef.current.value });
    answerRef.current.value = "";
  };
  const showAnswer = (e) => {
    e.preventDefault();
    socket.emit(SOCKET_TYPE.CHANGE_STATE, STATE.SHOW_ANSWER);
    setState(STATE.SHOW_ANSWER);
  };
  const changeTheme = (e) => {
    e.preventDefault();
    socket.emit(SOCKET_TYPE.GET_THEME);
  };

  return (
    <>
      {room && (
        <div className="gamepage">
          <h1 className="text-title">部屋:{room.roomName}</h1>
          <p>state:{state.toString()}</p>
          {state !== STATE.BEFORE_GAME && (
            <div className="gamepage-theme">
              <span>{letter}</span>
              からはじまる
              {theme}
            </div>
          )}
          {state === STATE.BEFORE_GAME && isOwner && <Button text="ゲーム開始" onClick={gameStart} />}
          {state === STATE.ANSWER && isOwner && Object.keys(answers).length === players.length && (
            <Button text="回答開示" onClick={showAnswer} />
          )}
          {state === STATE.ANSWER && isOwner && <Button text="お題変更" onClick={changeTheme} />}
          {players.length}/{room.maxPlayers}
          <div className="gamepage-board shadow">
            {players.length > 0 &&
              players.map((player) => {
                return (
                  <Card
                    key={player.id}
                    title={player.username}
                    content={boardMsg[player.id]}
                    width="24vw"
                    height="24vh"
                    fontSize="1.4em"
                    isOwner={room.owner === player.id}
                  />
                );
              })}
          </div>
          <div className="gamepage-controller">
            <form onSubmit={sendAnswer}>
              <Input type="txt" placeholder="回答を記入してください" inputRef={answerRef} />
              <Submit disabled={state !== STATE.ANSWER} />
            </form>
            <BtnIcon icon={MdInsertEmoticon} size="2.25em" />
            <BtnIcon icon={MdSettings} size="2.25em" />
          </div>
        </div>
      )}
    </>
  );
};

export default GamePage;
