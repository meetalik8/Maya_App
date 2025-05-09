import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdABIqWtCgV9v_0xp1o4IlQ3A6KgYhWHk",
  authDomain: "maya-a93da.firebaseapp.com",
  projectId: "maya-a93da",
  storageBucket: "maya-a93da.appspot.com",
  messagingSenderId: "395501642276",
  appId: "1:395501642276:web:2eead5812ec30491306eb1",
  measurementId: "G-YXFT8CKGSR",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);

export { app, firebaseAuth, firestoreDB };
