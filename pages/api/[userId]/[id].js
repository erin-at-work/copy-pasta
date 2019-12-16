import { db } from "../../../lib/db";

export default (req, res) => {
  const {
    query: { id, userId },
    body,
    method
  } = req;

  switch (method) {
    case "POST":
      db.collection("users")
        .doc(userId)
        .collection("entries")
        .doc(id)
        .update({ ...body })
        .then(() => {
          console.log("Document updated!");
          res.status(200).json(body);
        })
        .catch(console.log);
      break;
    case "DELETE":
        db.collection("users")
        .doc(userId)
        .collection("entries")
        .doc(id)
        .delete()
        .then(() => {
          console.log(`Document ${id} successfully deleted!`);
          res.end(`Post: ${id}`);
        });
      break;
    default:
      break;
  }
};
