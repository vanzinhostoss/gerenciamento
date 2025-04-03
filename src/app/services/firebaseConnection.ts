
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDuVXOMi9nW4FPMIGQESk3jbqoZGhhWj0Y",
  authDomain: "gerenciamento-os.firebaseapp.com",
  projectId: "gerenciamento-os",
  storageBucket: "gerenciamento-os.firebasestorage.app",
  messagingSenderId: "1039390575941",
  appId: "1:1039390575941:web:c943972278dd9db7c1422c",
  measurementId: "G-JSMQPPHJ2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage, collection}
