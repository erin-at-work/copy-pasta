import fetch from "isomorphic-unfetch";

export const postNewEntry = async ({ body, id }) => {
  const entryIdPath = Boolean(id) ? `/${id}` : "";

  try {
    const resp = await fetch(`/api/entries${entryIdPath}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" }
    });

    return resp.clone();
  } catch (err) {
    console.warn(err);
  }
};

export const deleteEntry = async id => {
  try {
    const resp = await fetch(`/api/entries/${id}`, {
      method: "DELETE"
    });

    return resp;
  } catch (err) {
    console.error(err);
  }
};
