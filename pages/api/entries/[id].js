import db from "../../../lib/db";

export default (req, res) => {
  const {
    query: { id },
    body,
    method
  } = req;

  switch (method) {
    case "POST":
      db.collection("entries")
        .doc(id)
        .update({ ...body })
        .then(() => {
          console.log("Document successfully updated!");
          res.status(200).json(body);
        })
        .catch(console.log);
      break;
    case "DELETE":
      db.collection("entries")
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
