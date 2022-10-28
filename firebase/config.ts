import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';

const firebaseConfig =
  process.env.NODE_ENV === 'development'
    ? {
        apiKey: 'AIzaSyBj2ujk2DshcnvhzaRH-icCsL33uyiGB7k',
        authDomain: 'portfoliowebsite-c0898.firebaseapp.com',
        databaseURL: 'https://portfoliowebsite-c0898.firebaseio.com',
        projectId: 'portfoliowebsite-c0898',
        storageBucket: 'portfoliowebsite-c0898.appspot.com',
        messagingSenderId: '142338650241',
        appId: '1:142338650241:web:518366c16c11985d985d80',
        measurementId: 'G-W3QVQ37E49',
      }
    : {
        apiKey: 'AIzaSyC5JlDMGnBvOWgeOQqVSjkK5zm9QmWBd1E',
        authDomain: 'portfoliowebsiteprod.firebaseapp.com',
        databaseURL: 'https://portfoliowebsiteprod.firebaseio.com',
        projectId: 'portfoliowebsiteprod',
        storageBucket: 'portfoliowebsiteprod.appspot.com',
        messagingSenderId: '998401383563',
        appId: '1:998401383563:web:6b2b4b9b8b903f3aed088e',
        measurementId: 'G-P7QHK2Q8CC',
      };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, storage };
