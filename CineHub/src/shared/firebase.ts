import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCT2miM_Pl5xXX77ShCgzKZRIn2XwJFaLc",
  authDomain: "cinehub-f7474.firebaseapp.com",
  projectId: "cinehub-f7474",
  storageBucket: "cinehub-f7474.appspot.com",
  messagingSenderId: "253235148141",
  appId: "1:253235148141:web:08239c336e516c606b9664",
  measurementId: "G-ELBNM5P5CZ",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
