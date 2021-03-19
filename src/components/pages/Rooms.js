import React from "react";
import { Link } from "react-router-dom";
import { useRoom } from "../../contexts/RoomContext";
import RoomLink from "../reusables/RoomLink";

const Rooms = () => {
  const { rooms } = useRoom();
  const roomItems = rooms.map((room) => <RoomLink key={room.id} room={room} />);
  return (
    <div className="rooms">
      <h1 className="text-title">ルーム一覧</h1>
      <div className="rooms-list flex">{roomItems}</div>
      <div className="form-bottom-text">
        <Link to="/create-room" className="link link-text">
          ルーム作成
        </Link>
      </div>
    </div>
  );
};

export default Rooms;
