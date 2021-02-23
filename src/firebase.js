import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
     apiKey: "AIzaSyARbDUgvKD1wOouy78tmCAUMl8XwDHgV3Q",
     authDomain: "instagram-clone-react-53220.firebaseapp.com",
     databaseURL: "https://instagram-clone-react-53220.firebaseio.com",
     projectId: "instagram-clone-react-53220",
     storageBucket: "instagram-clone-react-53220.appspot.com",
     messagingSenderId: "699382306804",
     appId: "1:699382306804:web:809087329bbed912ab0ba1",
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
export { db, auth, storage };
