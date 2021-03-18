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

  useEffect(() => {
    // for getting updates only while user is in the Rooms page
    let unsubscribe;
    if (location.pathname === "/rooms") {
      unsubscribe = db.collection("rooms").onSnapshot(
        (docs) => {
          console.log("changed room");
          const roomsArr = [];
          docs.forEach((doc) => {
            roomsArr.push(doc.data());
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
  };
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
