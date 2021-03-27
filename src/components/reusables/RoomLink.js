import { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { useRoom } from "../../contexts/RoomContext";
import Button from "./Button";

const RoomLink = ({ room, roomId, isOwner }) => {
  const [loading, setLoading] = useState(false);
  const { deleteRoom } = useRoom();
  const history = useHistory();
  const handleEnter = (e) => {
    e.preventDefault();
    history.push("/gamepage/" + room.id);
  };
  const handleDelete = (e) => {
    e.preventDefault();
    setLoading(true);
    deleteRoom(roomId)
      .then(() => {
        // 消えるためsetLoading(false)はいらない
        toast.success("ルームを削除しました");
      })
      .catch((err) => {
        // 再レンダーされるためsetLoading(false)はいらない
        toast.error(err.message);
      });
  };

  return (
    <div className="room-link shadow">
      <div className="room-link-name">{room.roomName}</div>
      <div className="room-link-buttons">
        <Button text="入室" onClick={handleEnter} />
        {isOwner && <Button disabled={loading} text="削除" className="btn-danger" onClick={handleDelete} />}
      </div>
    </div>
  );
};

export default RoomLink;
