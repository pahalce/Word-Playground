import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";

const AuthContext = React.createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setcurrentUser] = useState();
  const [username, setUsername] = useState();
  const [loading, setLoading] = useState(true);

  const signup = (email, password, username) => {
    return auth.createUserWithEmailAndPassword(email, password).then((cred) => {
      db.collection("users")
        .doc(cred.user.uid)
        .set({
          username: username,
        })
        .then(() => {
          setUsername(username);
        });
    });
  };

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  const updateEmail = (email) => {
    return currentUser.updateEmail(email);
  };

  const updatePassword = (password) => {
    return currentUser.updatePassword(password);
  };

  const updateUsername = (username) => {
    return db
      .collection("users")
      .doc(currentUser.uid)
      .set({
        username: username,
      })
      .then(() => {
        setUsername(username);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setcurrentUser(user);
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUsername(doc.data().username);
          }
          setLoading(false);
        })
        .catch(() => {
          window.alert("接続に失敗しました");
        })
        .finally(() => {
          setLoading(false);
        });
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    username,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateUsername,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
