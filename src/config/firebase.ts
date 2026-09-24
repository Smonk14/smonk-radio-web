import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDlLbdPKjbvM_Ay70TLtthRfRjoo5Yhfuc",
  authDomain: "smonk-radio.firebaseapp.com",
  databaseURL:
    "https://smonk-radio-default-rtdb.firebaseio.com",
  projectId: "smonk-radio",
  storageBucket: "smonk-radio.firebasestorage.app",
  messagingSenderId: "299303869677",
  appId: "1:299303869677:web:378ad2112caadaf60080e4",
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);