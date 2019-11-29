import fetch from 'isomorphic-unfetch'

export const postNewEntry = async ({ body, id = '' }) => {
  try {
    const resp = await fetch(`/api/entries/${id}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    })

    return resp.clone()
  } catch (err) {
    console.warn(err)
  }
}