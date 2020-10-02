import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { storage, db, auth, timestamp };
