import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-yjumktozWnHU4bqVuvC0VH9FiIZZK6s",
  authDomain: "event-curator.firebaseapp.com",
  projectId: "event-curator",
  storageBucket: "event-curator.appspot.com", 
  messagingSenderId: "649651377631",
  appId: "1:649651377631:web:ea975465b29dd3a243e06a",
  measurementId: "G-1V2FN8PQB9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

//export const appleProvider = new OAuthProvider('apple.com');
//appleProvider.addScope('profile');
//appleProvider.addScope('email');

//export const facebookProvider = new FacebookAuthProvider();
//facebookProvider.addScope('public_profile');
//facebookProvider.addScope('email');
