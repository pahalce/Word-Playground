import { useEffect, useState } from "react";
import Card from "../reusables/Card";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import BtnIcon from "../reusables/BtnIcon";
import { MdInsertEmoticon, MdSettings } from "react-icons/md";
import { useLocation } from "react-router";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import io from "socket.io-client";
import { toast } from "react-toastify";

const GamePage = ({ letter, adj }) => {
  const location = useLocation();
  const roomId = location.pathname.split("/").pop();
  const { username } = useAuth();
  const [players, setPlayers] = useState();
  const [socket, setSocket] = useState();

  // watch playerlist
  useEffect(() => {
    db.rooms
      .doc(roomId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const current_players = doc.data().players;
          if (!current_players.includes(username)) {
            const new_players = [...current_players, username];
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
        setPlayers(snapshot.data().players);
      },
      (err) => {
        toast.error(err);
      }
    );

    // for getting updates only while user is in the Rooms page
    if (location.pathname !== "/gamepage/" + roomId) {
      unsubscribe();
    }

    return () => {
      unsubscribe();
      db.rooms
        .doc(roomId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const player_list = doc.data().players.filter((player) => player !== username);
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
          toast.error("Error getting document:", error);
        });
    };
  }, [roomId, username, location.pathname]);

  // init socket server
  useEffect(() => {
    const newSocket = io("http://localhost:5000", { query: { id: roomId } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [roomId]);

  useEffect(() => {
    if (socket == null) return;

    socket.on("r", (msg) => toast.info("received msg:", msg));

    return () => socket.off("r");
  }, [socket]);

  return (
    <div className="gamepage">
      <div className="gamepage-theme">
        <span>{letter}</span>
        からはじまる
        <span>{adj}</span>
        言葉
      </div>
      <div className="gamepage-board shadow">
        {players?.length > 0 &&
          players.map((player, index) => {
            return (
              <Card
                key={index}
                title={player}
                content="待機中..."
                width="24vw"
                height="24vh"
                fontSize="1.4em"
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
  );
};

export default GamePage;
