// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOLFPrFKzyPwg6u8IgFIxSjymkXZEj8YU",
  authDomain: "flashcard-bd45b.firebaseapp.com",
  projectId: "flashcard-bd45b",
  storageBucket: "flashcard-bd45b.appspot.com",
  messagingSenderId: "581193542121",
  appId: "1:581193542121:web:af7044ff6b8de41b3f4378",
  measurementId: "G-4CMF32G4HJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
