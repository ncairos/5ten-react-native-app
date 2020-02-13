import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAjnyKxJme9WRWkMnEH-WInGANFIFk-Kxs",
  authDomain: "tenedores-f5f6c.firebaseapp.com",
  databaseURL: "https://tenedores-f5f6c.firebaseio.com",
  projectId: "tenedores-f5f6c",
  storageBucket: "tenedores-f5f6c.appspot.com",
  messagingSenderId: "489262057735",
  appId: "1:489262057735:web:5ba921fb613a544f675da2"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
