import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyC7qc9dgF_4Dx6shopPkaaZMAwXtEHCX2Q",
	authDomain: "shakeys-sample-crud-menu.firebaseapp.com",
	databaseURL: "https://shakeys-sample-crud-menu-default-rtdb.firebaseio.com",
	projectId: "shakeys-sample-crud-menu",
	storageBucket: "shakeys-sample-crud-menu.appspot.com",
	messagingSenderId: "290879890258",
	appId: "1:290879890258:web:181d855a56fc66f94bd08b",
	measurementId: "G-5122CGC55G",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
