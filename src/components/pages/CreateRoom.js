import { useRef, useState } from "react";
import Input from "../reusables/form/Input";
import Submit from "../reusables/form/Submit";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/firebase";
import Alert from "../reusables/Alert";
import { Link, useHistory } from "react-router-dom";

const CreateRoom = () => {
  const roomNameRef = useRef("");
  const maxPlayersRef = useRef("");
  const { username } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const docRef = await db.rooms.add({
        roomName: roomNameRef.current.value,
        owner: username,
        maxPlayers: maxPlayersRef.current.value,
        players: [username],
        status: "WAITING",
        createdAt: db.getCurrentTimestamp(),
      });
      setLoading(false);
      history.push("/gamepage/" + docRef.id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="create-room">
      <h1 className="text-title">ルーム作成</h1>
      <form onSubmit={handleSubmit}>
        <Alert msg={error} />
        <Input
          id="room-name"
          type="text"
          required
          label="ルーム名"
          inputRef={roomNameRef}
          placeholder="記入してください"
        />
        <Input
          id="max-players"
          type="number"
          min="2"
          max="8"
          label="最大人数"
          required
          inputRef={maxPlayersRef}
          defaultValue={8}
          placeholder="8"
          style={{ width: "4em" }}
        />
        <Submit disabled={loading} />
      </form>
      <div className="form-bottom-text">
        <Link to="/create-room" className="link link-text">
          ルーム一覧へ
        </Link>
      </div>
    </div>
  );
};

export default CreateRoom;
