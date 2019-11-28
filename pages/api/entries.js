// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app"

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
  const {
    body: { content, description, link },
    method
  } = req;

  switch(method) {
    case 'GET':
      db.collection("entries")
        .orderBy('created_at', 'desc')
        .get()
        .then(querySnapshot => {
          const entries = querySnapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data(),
              created_at: doc.data().created_at.toDate()
            }
          });
          res.status(200).json(entries)
        })
        .catch((error) => res.json({ error }));
      break
    case 'POST':
      db.collection("entries")
        .add({
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          content,
          description,
          link,
        })
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
          res.status(201).send({ id: docRef.id })
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}