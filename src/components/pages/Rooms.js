import React from "react";
import { Link } from "react-router-dom";
import { useRoom } from "../../contexts/RoomContext";

const Rooms = () => {
  const { rooms } = useRoom();
  const roomItems = rooms.map((room) => (
    <div key={room.roomName} className="flex shadow">
      {room.roomName}
      <button>入室</button>
    </div>
  ));
  return (
    <div className="rooms">
      <h1 className="text-title">ルーム一覧</h1>
      <div className="room-list">{roomItems}</div>
      <div className="form-bottom-text">
        <Link to="/create-room" className="link link-text">
          ルーム作成
        </Link>
      </div>
    </div>
  );
};

export default Rooms;
