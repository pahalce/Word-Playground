import { useState } from "react";
import { useHistory } from "react-router";
import Button from "./Button";

const RoomLink = ({ room }) => {
  const [disabled, setDisabled] = useState(false);
  const history = useHistory();
  const handleEnter = (e) => {
    e.preventDefault();
    history.push("/gamepage/" + room.id);
  };
  const handleErase = (e) => {
    e.preventDefault();
    setDisabled(true);
  };
  return (
    <div className="room-link shadow">
      <div className="room-link-name">{room.roomName}</div>
      <div className="room-link-buttons">
        <Button text="入室" onClick={handleEnter} />
        <Button disabled={disabled} text="削除" className="btn-danger" onClick={handleErase} />
      </div>
    </div>
  );
};

export default RoomLink;
