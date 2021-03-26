import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router";
import { db } from "../firebase/firebase";

const RoomContext = React.createContext();
export const useRoom = () => {
  return useContext(RoomContext);
};

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const location = useLocation();

  const addRoom = (room) => {
    return db.rooms.add(room);
  };
  const deleteRoom = (roomId) => {
    return db.rooms.doc(roomId).delete();
  };

  useEffect(() => {
    // for getting updates only while user is in the Rooms page
    let unsubscribe;
    if (location.pathname === "/rooms") {
      unsubscribe = db.rooms.onSnapshot(
        (docs) => {
          const roomsArr = [];
          docs.forEach((doc) => {
            roomsArr.push(db.formatDoc(doc));
          });
          setRooms(roomsArr);
        },
        (err) => {
          console.log(err);
        }
      );
    }
    return unsubscribe;
  }, [location]);

  const value = {
    rooms,
    addRoom,
    deleteRoom,
  };
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
