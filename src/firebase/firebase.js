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

export const auth = app.auth();
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
export { db };
export default app;
