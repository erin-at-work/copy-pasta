import db, { firestoreTimestamp } from '../../lib/db'

export default (req, res) => {
  const {
    body: { content, description, link },
    method
  } = req;

  switch(method) {
    case 'GET':
      db.collection('entries')
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
      console.log('DOES IT HIT HERE?')
      db.collection('entries')
        .add({
          created_at: firestoreTimestamp,
          content,
          description,
          link,
        })
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id);
          res.status(201).send({ id: docRef.id })
        })
        .catch(error => {
          console.error('Error adding document: ', error);
        })
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}