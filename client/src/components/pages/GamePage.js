import { useEffect, useRef, useState } from "react";
import Card from "../reusables/Card";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import BtnIcon from "../reusables/buttons/BtnIcon";
import { MdInsertEmoticon } from "react-icons/md";
import { useHistory, useLocation } from "react-router";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import io from "socket.io-client";
import { toast } from "react-toastify";
import Button from "../reusables/buttons/Button";
import { STATE, SOCKET_TYPE } from "../../misc/globals";
import ClickableIcon from "../reusables/buttons/ClickableIcon";
import { BsHeart, BsFillHeartFill } from "react-icons/bs";
import EmojiPicker from "../reusables/buttons/EmojiPicker";

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
  const [changeThemeVoteNum, setchangeThemeVoteNum] = useState(0);
  const answerRef = useRef("");
  const [votingTo, setVotingTo] = useState(null); // userId
  const [votedForChangeTheme, setVotedForChangeTheme] = useState(false);
  const [points, setPoints] = useState({});
  const [adviceText, setAdviceText] = useState("ゲーム開始まで待機中...");

  // init connection to room
  useEffect(() => {
    let newSocket;
    const initConnection = async () => {
      try {
        const doc = await db.rooms.doc(roomId).get();
        if (!doc.exists) {
          throw Error("room not found.");
        }
        if (doc.data().isGameStarted === true) {
          // not allowed to enter (game is already started && you are not reconnecting)
          if (!doc.data().startingMember.includes(currentUser.uid)) {
            throw Error("This room is closed.");
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
        toast.error(err.message);
        history.push("/rooms");
      }
    };

    initConnection();
    const unsubscribe = db.rooms.doc(roomId).onSnapshot(
      (snapshot) => {
        const room = db.formatDoc(snapshot);
        setRoom(room);
        if (room.owner === currentUser.uid) {
          setIsOwner(true);
        }
      },
      (err) => {
        toast.error(err.message);
      }
    );

    return () => {
      unsubscribe();
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [
    roomId,
    currentUser,
    username,
    location.pathname,
    currentUser.uid,
    history,
  ]);

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
        setAdviceText("回答を考え中...🤔");
        players.forEach((player) => {
          if (answers[player.id]) {
            boardList[player.id] = "回答済み";
            if (player.id === currentUser.uid) {
              boardList[player.id] += `(${answers[player.id].answer})`;
            }
          } else {
            boardList[player.id] = "回答中...";
          }
        });
        break;

      case STATE.SHOW_ANSWER:
        setAdviceText("回答を見せあおう👀");
        players.forEach((player) => {
          if (answers[player.id]) {
            if (answers[player.id].shown) {
              boardList[player.id] = answers[player.id].answer;
            } else {
              boardList[player.id] = "回答を隠し中";
              if (player.id === currentUser.uid) {
                boardList[player.id] = `回答を隠し中(${
                  answers[player.id].answer
                })`;
              }
            }
          }
        });
        break;

      case STATE.VOTE:
        setAdviceText("✋投票時間✋");
        players.forEach((player) => {
          boardList[player.id] = answers[player.id].answer;
        });
        break;

      case STATE.SHOW_POINTS:
        setAdviceText("投票結果");
        players.forEach((player) => {
          boardList[player.id] = "得点: " + points[player.id];
        });
        break;

      default:
        Object.keys(boardList).forEach((key) => {
          boardList[key] = "待機中...";
        });
        break;
    }
    setBoardMsg(boardList);
  }, [state, players, answers, points, currentUser.uid]);

  const updateAllStates = (data) => {
    // set answer first before state changes (to reset answer before new theme is shown)
    setAnswers(data.answers);
    setLetter(data.theme.startingLetter);
    setTheme(data.theme.theme_content);
    setPoints(data.points);
    setState(data.state);
  };
  const gameStart = () => {
    db.rooms
      .doc(roomId)
      .set(
        {
          isGameStarted: true,
          startingMember: players.map((player) => player.id),
        },
        { merge: true }
      )
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
    answer_list[currentUser.uid] = {
      answer: answerRef.current.value,
      shown: false,
    };
    setAnswers(answer_list);
    socket.emit(SOCKET_TYPE.SEND_ANSWER, {
      userId: currentUser.uid,
      answer: answerRef.current.value,
    });
    answerRef.current.value = "";
  };
  const showAnswer = () => {
    socket.emit(SOCKET_TYPE.SHOW_ANSWER, currentUser.uid);
  };
  const changeTheme = () => {
    setVotedForChangeTheme(true);
    socket.emit(SOCKET_TYPE.GET_THEME);
  };
  const votePlayer = (userId) => {
    if (votingTo !== userId) {
      setVotingTo(userId);
      socket.emit(SOCKET_TYPE.VOTE, {
        voteBy: currentUser.uid,
        voteTo: userId,
      });
    } else {
      // unclick voted card
      socket.emit(SOCKET_TYPE.VOTE, { voteBy: currentUser.uid, voteTo: null });
      setVotingTo(null);
    }
  };
  const getDisplayName = (username, point) => {
    const stringAll = username + ":" + (point ? point : 0);
    const length = stringAll.length;
    const allowLength = 10;
    if (length > allowLength) {
      return (
        username.slice(0, username.length - (length - allowLength - 2)) +
        "... " +
        ":" +
        (point ? point : 0)
      );
    }
    return stringAll;
  };
  const toggleEmojiPicker = () => {
    const emojiPicker = document.querySelector(".emoji-picker");
    emojiPicker.classList.toggle("show");
  };
  const sendEmoji = (emoji) => {
    const emojiPicker = document.querySelector(".emoji-picker");
    const iconBtn = document.querySelector(".btn-icon");
    emojiPicker.classList.remove("show");
    iconBtn.classList.remove("selected");
    socket.emit(SOCKET_TYPE.SEND_EMOJI, currentUser.uid, emoji);
    showEmoji(currentUser.uid, emoji);
  };
  const showEmoji = (userId, emoji) => {
    const bubble = document.getElementById("bubble-" + userId);
    const iconBtn = document.querySelector(".btn-icon");
    if (userId === currentUser.uid) {
      iconBtn.classList.add("disabled");
    }
    bubble.classList.add("show");
    bubble.innerHTML = emoji;
    setTimeout(() => {
      bubble.classList.remove("show");
      if (userId === currentUser.uid) {
        iconBtn.classList.remove("disabled");
      }
    }, 2000);
  };

  // socket events
  useEffect(() => {
    if (socket == null) return;
    socket.on("connect_error", (err) => {
      toast.error(err.message); // not authorized
    });
    socket.on(SOCKET_TYPE.INIT_CONNECTION, (data) => {
      updateAllStates(data);
    });
    socket.on(SOCKET_TYPE.PLAYERS_CHANGED, (newPlayers) => {
      setPlayers(newPlayers);
    });
    socket.on(SOCKET_TYPE.RECONNECT, (data) => {
      updateAllStates(data);
    });
    socket.on(SOCKET_TYPE.CHANGE_STATE, (newState) => {
      setState(newState);
    });
    socket.on(SOCKET_TYPE.GET_THEME, (data) => {
      updateAllStates(data);
      setVotedForChangeTheme(false);
    });
    socket.on(SOCKET_TYPE.CHANGE_THEME_VOTE, (num) => {
      setchangeThemeVoteNum(num);
    });
    socket.on(SOCKET_TYPE.SEND_ANSWER, ({ userId, answer }) => {
      const answers_list = Object.assign({}, answers);
      answers_list[userId] = answer;
      setAnswers(answers_list);
    });
    socket.on(SOCKET_TYPE.SHOW_ANSWER, (playerId) => {
      const answers_list = Object.assign({}, answers);
      answers_list[playerId].shown = true;
      setAnswers(answers_list);
    });
    socket.on(SOCKET_TYPE.SEND_MESSAGE, (msg) => toast.info(msg));
    socket.on(SOCKET_TYPE.VOTE_DONE, () => {
      setState(STATE.SHOW_POINTS);
      setVotingTo(null);
    });
    socket.on(SOCKET_TYPE.CALC_POINTS, (points) => {
      // update points
      setPoints(points);
      setState(STATE.SHOW_POINTS);
    });
    socket.on(SOCKET_TYPE.SEND_EMOJI, ({ userId, emoji }) => {
      showEmoji(userId, emoji);
    });

    return () => {
      Object.keys(SOCKET_TYPE).forEach((type) => {
        socket.off(type);
      });
    };
  }, [socket, answers, showEmoji]);

  // control states
  useEffect(() => {
    if (isOwner) {
      if (state === STATE.ANSWER) {
        // go to show_answer state when all players answered
        const missingAnswer = players.some((player) => {
          return !answers[player.id];
        });
        if (!missingAnswer) {
          socket.emit(SOCKET_TYPE.CHANGE_STATE, SOCKET_TYPE.SHOW_ANSWER);
        }
      }
      if (state === STATE.SHOW_ANSWER) {
        // go to vote state when all answers are shown
        const notShown = players.some(
          (player) => answers[player.id] && answers[player.id].shown === false
        );
        if (!notShown) {
          socket.emit(SOCKET_TYPE.CHANGE_STATE, SOCKET_TYPE.VOTE);
        }
      }
    }
  }, [answers, isOwner, socket, state, players]);

  return (
    <>
      {room && (
        <div className="gamepage">
          <div className="gamepage-room-info">
            <div className="gamepage-room-name">部屋:{room.roomName}</div>
            <div className="gamepage-acitve-players">
              人数：{players.length}/{room.maxPlayers}
            </div>
          </div>
          <div className="gamepage-game-state-buttons">
            {state !== STATE.BEFORE_GAME && (
              <div className="gamepage-theme">
                <span>{letter}</span>
                からはじまる
                <div className="gamepage-theme-content">{theme}</div>
              </div>
            )}
            {state === STATE.BEFORE_GAME && isOwner && (
              <Button text="ゲーム開始" onClick={gameStart} />
            )}
            {state === STATE.ANSWER && (
              <Button
                text={`お題変更(${changeThemeVoteNum}/${players.length})`}
                onClick={changeTheme}
                disabled={votedForChangeTheme}
              />
            )}
            {state === STATE.SHOW_ANSWER && (
              <Button text="回答を見せる" onClick={showAnswer} />
            )}
            {state === STATE.SHOW_POINTS && (
              <Button
                text={`次のお題へ(${changeThemeVoteNum}/${players.length})`}
                onClick={changeTheme}
              />
            )}
            {state === STATE.VOTE && (
              <Button
                text={`次のお題へ(${changeThemeVoteNum}/${players.length})`}
                disabled
              />
            )}
          </div>
          <div className="advice-text">{adviceText}</div>
          <div className="gamepage-board shadow">
            {players.length > 0 &&
              players.map((player) => {
                return (
                  <div className="gamepage-board-card" key={player.id}>
                    <div
                      id={"bubble-" + player.id}
                      className="bubble bubble-bottom-left"
                    ></div>
                    <Card
                      title={getDisplayName(player.username, points[player.id])}
                      content={boardMsg[player.id]}
                      isOwner={room.owner === player.id}
                      selected={votingTo === player.id}
                      showBottom={false} // hide default icon
                    />
                    {/* show icon only when state is VOTE */}
                    {state === STATE.VOTE && player.id !== currentUser.uid && (
                      <div
                        className="gamepage-board-card-icon"
                        onClick={() => {
                          votePlayer(player.id);
                        }}
                      >
                        <div className="vote-text">投票する→</div>
                        <ClickableIcon
                          before={BsHeart}
                          after={BsFillHeartFill}
                          size={"1.4"}
                          selected={votingTo === player.id}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          <div className="gamepage-controller">
            <form onSubmit={sendAnswer}>
              <Input type="txt" placeholder="回答" inputRef={answerRef} />
              <Submit disabled={state !== STATE.ANSWER} />
            </form>
            <EmojiPicker sendEmoji={sendEmoji} />
            <BtnIcon
              icon={MdInsertEmoticon}
              size="2.25em"
              onClick={toggleEmojiPicker}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GamePage;
