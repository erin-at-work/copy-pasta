// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app"

// Add the Firebase services that you want to use
import "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: "copypasta-d3ef0"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export default (req, res) => {
  db.collection("entries")
    .get()
    .then((querySnapshot) => {
      const entries = [];
      querySnapshot.forEach(doc => entries.push({
        id: doc.id,
        ...doc.data()
      }));
      res.status(200).json(entries)
    })
    .catch((err) => res.json({ error }));
}