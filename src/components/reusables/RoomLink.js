import { useHistory } from "react-router";
import Button from "./Button";

const RoomLink = ({ room }) => {
  const history = useHistory();
  const handleClick = (e) => {
    e.preventDefault();
    history.push("/gamepage/" + room.id);
  };
  return (
    <div className="room-link shadow">
      <div className="room-link-name">{room.roomName}</div>
      <Button text="入室" onClick={handleClick} />
    </div>
  );
};

export default RoomLink;
