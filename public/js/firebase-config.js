// Firebase initialization
// Uses config provided by the user. Safe to expose in frontend per Firebase docs.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCM9TioDbRYhDBPJMJc3jNA3fk_zTKX06Q",
  authDomain: "oldage-c33cb.firebaseapp.com",
  projectId: "oldage-c33cb",
  storageBucket: "oldage-c33cb.firebasestorage.app",
  messagingSenderId: "430723764554",
  appId: "1:430723764554:web:6ab4c53916ea94603571b3",
  measurementId: "G-KG879GKM9H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { signInWithPopup };
