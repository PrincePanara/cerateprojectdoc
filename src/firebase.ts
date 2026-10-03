import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBCu57U_pj9knJDewgwKU9BgtaFnt5R-RM",
  authDomain: "sitemind-ai-54a09.firebaseapp.com",
  databaseURL: "https://sitemind-ai-54a09-default-rtdb.firebaseio.com",
  projectId: "sitemind-ai-54a09",
  storageBucket: "sitemind-ai-54a09.firebasestorage.app",
  messagingSenderId: "1066272972792",
  appId: "1:1066272972792:web:80c5bece77cc5c080e400d",
  measurementId: "G-D59MBQZN1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
// const analytics = getAnalytics(app); // Analytics only works in browser

export { app, auth, database };
