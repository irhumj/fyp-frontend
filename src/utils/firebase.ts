// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXV_JJziyigwI7hQV6_71yZQ_8bm5NQXA",
  authDomain: "fyp2-81389.firebaseapp.com",
  projectId: "fyp2-81389",
  storageBucket: "fyp2-81389.firebasestorage.app",
  messagingSenderId: "809048408848",
  appId: "1:809048408848:web:622363c838c312ab8c1b95",
  measurementId: "G-HMDBK0JW9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;






