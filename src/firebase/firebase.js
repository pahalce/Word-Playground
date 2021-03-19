import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// put firebase config here
var firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_APIKEY,
  authDomain: process.env.REACT_APP_FB_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECTID,
  storageBucket: process.env.REACT_APP_FB_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FB_APPID,
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firestore = app.firestore();

export const db = {
  users: firestore.collection("users"),
  rooms: firestore.collection("rooms"),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};

export const auth = app.auth();
export default app;
