import * as firebase from "firebase/app";
// import "firebase/storage";
// import "firebase/firestore";
// import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBj2ujk2DshcnvhzaRH-icCsL33uyiGB7k",
  authDomain: "portfoliowebsite-c0898.firebaseapp.com",
  databaseURL: "https://portfoliowebsite-c0898.firebaseio.com",
  projectId: "portfoliowebsite-c0898",
  storageBucket: "portfoliowebsite-c0898.appspot.com",
  messagingSenderId: "142338650241",
  appId: "1:142338650241:web:518366c16c11985d985d80",
  measurementId: "G-W3QVQ37E49",
};

// Initialize Firebase

// class Firebase {
//     constructor() {
//       firebase.initializeApp(config);

//       this.auth = app.auth();
//       this.db = app.database();
//     }
// }

// const projectStorage = firebase.storage();
// const projectFirestore = firebase.firestore();
// const projectAuth = firebase.auth();
// const timestamp = firebase.firestore.FieldValue.serverTimestamp;

// console.log(projectAuth);
// export { projectStorage, projectFirestore, projectAuth, timestamp };
export default firebaseConfig;