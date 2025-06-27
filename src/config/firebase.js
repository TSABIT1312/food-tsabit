// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLiJltjXHJLMQQzImeAoww31roh8Fgjww",
  authDomain: "makanbar-58f4b.firebaseapp.com",
  projectId: "makanbar-58f4b",
  storageBucket: "makanbar-58f4b.appspot.com",
  messagingSenderId: "184243489028",
  appId: "1:184243489028:web:d1eab11bcac96d15af6851",
  measurementId: "G-MLX839JZS9"
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  value => typeof value === 'string' && value.length > 0
);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
