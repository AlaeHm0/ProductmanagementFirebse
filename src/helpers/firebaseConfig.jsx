import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDTxUQGIrpMpJWjVWq3TlhbISFv7PS2e7M",
  authDomain: "e-commerce-82d34.firebaseapp.com",
  databaseURL: "https://e-commerce-82d34-default-rtdb.firebaseio.com",
  projectId: "e-commerce-82d34",
  storageBucket: "e-commerce-82d34.appspot.com",
  messagingSenderId: "773279177981",
  appId: "1:773279177981:web:f262adc358db3fc88cb294",
  measurementId: "G-VNZKEQW9QB"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export const useFirebase = firebase;