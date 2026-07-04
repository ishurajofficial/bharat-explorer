import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCj2iXePs-h22zJSEkY8tHSYAK_LH7_JZo",
  authDomain: "studio-4612501149-5c473.firebaseapp.com",
  projectId: "studio-4612501149-5c473",
  storageBucket: "studio-4612501149-5c473.firebasestorage.app",
  messagingSenderId: "394680695359",
  appId: "1:394680695359:web:834bee360626873832568a"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
