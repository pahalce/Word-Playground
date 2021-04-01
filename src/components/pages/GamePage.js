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
import { STATE } from "../../misc/gameState";

const GamePage = ({ letter, adj }) => {
  const history = useHistory();
  const location = useLocation();
  const roomId = location.pathname.split("/").pop();
  const { username, currentUser } = useAuth();
  const [room, setRoom] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [socket, setSocket] = useState();
  const [state, setState] = useState(STATE.BEFORE_GAME);

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
          const current_players = doc.data().players;
          const ids = current_players.map((player) => player.id);
          if (!ids.includes(currentUser.uid)) {
            const new_players = [...current_players, { id: currentUser.uid, username }];
            db.rooms
              .doc(roomId)
              .set({ players: new_players }, { merge: true })
              .catch((err) => {
                toast.error(err);
              });
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
      db.rooms
        .doc(roomId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const player_list = doc.data().players.filter((player) => player.id !== currentUser.uid);
            db.rooms
              .doc(roomId)
              .set({ players: player_list }, { merge: true })
              .catch((err) => {
                toast.error(err);
              });
          } else {
            toast.error("No such document!");
          }
        })
        .catch((error) => {
          toast.error("Error getting document:" + error.message);
        });
    };
  }, [roomId, username, location.pathname]);

  // init socket server
  useEffect(() => {
    const newSocket = io("http://localhost:5000", { query: { id: roomId } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [roomId]);

  // socket events
  useEffect(() => {
    if (socket == null) return;

    socket.on("r", (msg) => toast.info("received msg:" + msg));
    socket.on("change-state", (newState) => {
      setState(newState);
    });
    socket.on("user-left", (user) => {
      toast.info("user left:" + user);
    });

    return () => socket.off("r");
  }, [socket]);

  const handleGameStart = (e) => {
    e.preventDefault();

    db.rooms
      .doc(roomId)
      .set({ isGameStarted: true }, { merge: true })
      .then(() => {
        socket.emit("change-state", STATE.ANSWER);
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
          {room.isGameStarted !== STATE.BEFORE_GAME && (
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
              {room.players?.length}/{room.maxPlayers}
            </div>
          )}
          <div className="gamepage-board shadow">
            {room.players?.length > 0 &&
              room.players.map((player) => {
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
                socket.emit("add-player", username);
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
