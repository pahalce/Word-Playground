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
import ClickableIcon from "../reusables/ClickableIcon";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";


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
  const [votingTo, setVotingTo] = useState(null); // userId
  const [points, setPoints] = useState({});


  // init connection to room
  useEffect(() => {
    let newSocket;
    const initConnection = async () => {
      try {
        const doc = await db.rooms.doc(roomId).get();
        if (!doc.exists) {
          throw Error("Error getting document");
        }
        if (doc.data().isGameStarted === true) {
          // not allowed to enter (game is already started && you are not reconnecting)
          if (!doc.data().startingMember.includes(currentUser.uid)) {
            toast.error("This room is closed.");
            history.push("/rooms");
            return;
          }
          // reconnect to room
          const idToken = await currentUser.getIdToken(true);
          newSocket = io(process.env.REACT_APP_SERVER_URL, {
            query: { id: roomId, username, reconnecting: true, idToken },
          });
        } else {
          // first time to enter room
          const idToken = await currentUser.getIdToken(true);
          newSocket = io(process.env.REACT_APP_SERVER_URL, {
            query: { id: roomId, username, reconnecting: false, idToken },
          });
        }
        setSocket(newSocket);
        setRoom(db.formatDoc(doc));
        const owner = doc.data().owner;
        if (owner === currentUser.uid) {
          setIsOwner(true);
        }
      } catch (err) {
        toast.error(err.message)
      }
    }

    initConnection();
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
      newSocket.close();
    };
  }, [roomId, currentUser, username, location.pathname, currentUser.uid, history]);

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

      case STATE.VOTE:
        players.forEach((player) => {
          boardList[player.id] = answers[player.id];
        });
        break;
      
      case STATE.VOTE_DONE:
      players.forEach((player) => {
        boardList[player.id] = answers[player.id];
      });
      break;

      default:
        Object.keys(boardList).forEach((key) => {
          boardList[key] = "待機中...";
        });
        break;
    }
    setBoardMsg(boardList);
  }, [state, players, answers, currentUser.uid]);

  // socket events
  useEffect(() => {
    if (socket == null) return;
    socket.on("connect_error", (err) => {
      toast.error(err.message); // not authorized
    });
    socket.on(SOCKET_TYPE.INIT_CONNECTION, (data) => {
      updateAllStates(data)
    });
    socket.on(SOCKET_TYPE.PLAYERS_CHANGED, (newPlayers) => {
      setPlayers(newPlayers);
    });
    socket.on(SOCKET_TYPE.RECONNECT, (data) => {
      updateAllStates(data)
    });
    socket.on(SOCKET_TYPE.CHANGE_STATE, (newState) => {
      setState(newState);
    });
    socket.on(SOCKET_TYPE.GET_THEME, (data) => {
      updateAllStates(data)
    });
    socket.on(SOCKET_TYPE.SEND_ANSWER, ({ userId, answer }) => {
      const answers_list = Object.assign({}, answers);
      answers_list[userId] = answer;
      setAnswers(answers_list);
    });
    socket.on(SOCKET_TYPE.SEND_MESSAGE, (msg) => toast.info(msg));
    socket.on(SOCKET_TYPE.VOTE_DONE, () => {
      setState(STATE.VOTE_DONE)
      setVotingTo(null)
    });
    socket.on(SOCKET_TYPE.CALC_POINTS, (points) => {
      // update points
      setPoints(points)
      setState(STATE.SHOW_POINTS)
    })

    return () => {
      Object.keys(SOCKET_TYPE).forEach((type) => {
        socket.off(type);
      });
    };
  }, [socket, answers]);

  const updateAllStates = (data) => {
    setState(data.state);
    setLetter(data.theme.startingLetter);
    setTheme(data.theme.theme_content);
    setAnswers(data.answers);
    setPoints(data.points);
  }
  const gameStart = () => {
    db.rooms
      .doc(roomId)
      .set({ isGameStarted: true, startingMember: players.map((player) => player.id) }, { merge: true })
      .then(() => {
        socket.emit(SOCKET_TYPE.CHANGE_STATE, STATE.ANSWER);
        socket.emit(SOCKET_TYPE.GET_THEME);
      })
      .catch((err) => {
        toast.log(err.message);
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
  const showAnswer = () => {
    socket.emit(SOCKET_TYPE.CHANGE_STATE, STATE.SHOW_ANSWER);
  };
  const changeTheme = () => {
    socket.emit(SOCKET_TYPE.GET_THEME);
  };
  const startVote = () => {
    socket.emit(SOCKET_TYPE.CHANGE_STATE, STATE.VOTE);
  }
  const votePlayer = (userId) => {
    if (votingTo !== userId) {
      setVotingTo(userId)
      socket.emit(SOCKET_TYPE.VOTE, {voteBy:currentUser.uid, voteTo:userId});
    } else {
      // unclick voted card
      socket.emit(SOCKET_TYPE.VOTE, {voteBy:currentUser.uid, voteTo:null});
      setVotingTo(null)
    }
  }
  const updatePoints = () => {
    socket.emit(SOCKET_TYPE.CALC_POINTS)
  }

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
          {state === STATE.ANSWER && isOwner && <Button text="お題変更" onClick={changeTheme} />}
          {state === STATE.ANSWER && isOwner && Object.keys(answers).length === players.length && (
            <Button text="回答開示" onClick={showAnswer} />
          )}
          {state === STATE.SHOW_ANSWER && isOwner && <Button text="投票へ" onClick={startVote} />}
          {state === STATE.VOTE_DONE && isOwner && <Button text="開票" onClick={updatePoints} />}
          {state === STATE.SHOW_POINTS && isOwner && <Button text="次のお題へ" onClick={changeTheme} />}
          {players.length}/{room.maxPlayers}
          <div className="gamepage-board shadow">
            {players.length > 0 &&
              players.map((player) => {
                return (
                  <div className="gamepage-board-card" key={player.id}>
                    <Card
                      title={player.username + ":" + (points[player.id] ? points[player.id] : 0)}
                      content={boardMsg[player.id]}
                      width="24vw"
                      height="24vh"
                      fontSize="1.4em"
                      isOwner={room.owner === player.id}
                      selected={votingTo === player.id}
                      showBottom={false} // hide default icon
                    />
                    {/* show icon only when state is VOTE */}
                    <div className="gamepage-board-card-icon" style={state === STATE.VOTE && player.id !== currentUser.uid ? {"display": "inline-block"} : {"display": "none"}}
                    onClick={() => {
                        votePlayer(player.id)
                      }}>
                      <ClickableIcon before={BsHeart} after={BsFillHeartFill} size={"1.4"} selected={votingTo === player.id} />
                    </div>
                  </div> 
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
