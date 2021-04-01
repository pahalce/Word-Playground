import { useEffect, useState } from "react";
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

const GamePage = ({ letter, adj }) => {
  const history = useHistory();
  const location = useLocation();
  const roomId = location.pathname.split("/").pop();
  const { username, currentUser } = useAuth();
  const [room, setRoom] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [socket, setSocket] = useState();
  const [state, setState] = useState(STATE.BEFORE_GAME);
  const [players, setPlayers] = useState([]);

  // watch playerlist
  useEffect(() => {
    db.rooms
      .doc(roomId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().isGameStarted === true) {
            toast.error("This room is closed.");
            history.push("/rooms");
            return;
          }
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

    return unsubscribe;
  }, [roomId, username, location.pathname]);

  // init socket server
  useEffect(() => {
    const newSocket = io("http://localhost:5000", { query: { id: roomId, username } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [roomId]);

  // socket events
  useEffect(() => {
    if (socket == null) return;

    socket.on(SOCKET_TYPE.SEND_MESSAGE, (msg) => toast.info(msg));
    socket.on(SOCKET_TYPE.CHANGE_STATE, (newState) => {
      setState(newState);
    });
    socket.on(SOCKET_TYPE.PLAYERS_CHANGED, (newPlayers) => {
      setPlayers(newPlayers);
    });

    return () => {
      Object.keys(SOCKET_TYPE).forEach((type) => {
        socket.off(type);
      });
    };
  }, [socket]);

  const handleGameStart = (e) => {
    e.preventDefault();

    db.rooms
      .doc(roomId)
      .set({ isGameStarted: true }, { merge: true })
      .then(() => {
        socket.emit(SOCKET_TYPE.CHANGE_STATE, STATE.ANSWER);
        setState(STATE.ANSWER);
      })
      .catch((err) => {
        toast.err(err.message);
      });
  };
  return (
    <>
      {room && (
        <div className="gamepage">
          <h1 className="text-title">部屋:{room.roomName}</h1>
          state:{state.toString()}
          {state !== STATE.BEFORE_GAME && (
            <div className="gamepage-theme">
              <span>{letter}</span>
              からはじまる
              <span>{adj}</span>
              言葉
            </div>
          )}
          {state === STATE.BEFORE_GAME && isOwner && (
            <div>
              <Button text="ゲーム開始" onClick={handleGameStart} />
              {players.length}/{room.maxPlayers}
            </div>
          )}
          <div className="gamepage-board shadow">
            {players.length > 0 &&
              players.map((player) => {
                return (
                  <Card
                    key={player.id}
                    title={player.username}
                    content="待機中..."
                    width="24vw"
                    height="24vh"
                    fontSize="1.4em"
                    isOwner={room.owner === player.id}
                  />
                );
              })}
          </div>
          <div className="gamepage-controller">
            <Input type="txt" placeholder="回答を記入してください" />
            <Submit
              onClick={() => {
                socket.emit(SOCKET_TYPE.SEND_MESSAGE, username);
              }}
            />
            <BtnIcon icon={MdInsertEmoticon} size="2.25em" />
            <BtnIcon icon={MdSettings} size="2.25em" />
          </div>
        </div>
      )}
    </>
  );
};

export default GamePage;
