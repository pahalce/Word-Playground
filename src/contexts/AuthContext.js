import React, { useContext, useState, useEffect } from "react";
import { auth } from "../aaa/firebase";

const AuthContext = React.createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setcurrentUser] = useState();

  const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setcurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
