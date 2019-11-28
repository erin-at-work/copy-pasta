import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'

const Form = ({ updateEntryList, entries }) => {
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')

  const postNewEntry = async body => {
    try {
      const resp = await fetch('/api/entries', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' }
      })

      return resp.clone()
    } catch (err) {
      console.warn(err)
    }
  }

  const handleOnSubmit = async (ev) => {
    ev.persist();
    ev.preventDefault();
    if (!content.length) return;

    const body = {
      content,
      description,
      link
    }

    try {
      const resp = await postNewEntry(body)
      const { id } = await resp.json();

      updateEntryList([{ ...body, created_at: Date.now(), id }, ...entries])
      ev.target.reset()
    } catch {
      console.log(`There's been an error saving ${content}`)
    }
  }

  return (
    <form onSubmit={handleOnSubmit} id="form" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
      <div className="mb-4">
        <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">
          Snippet:
        </label>
        <textarea
          onChange={ev => setContent(ev.target.value)}
          placeholder="Say something interesting..."
          type="text"
          className="shadow appearance-none border-rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
        <input
          onChange={ev => setDescription(ev.target.value)}
          placeholder="Description"
          type="text"
          className="shadow appearance-none border-rounded mt-5 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <input
          onChange={ev => setLink(ev.target.value)}
          placeholder="http://"
          type="text"
          className="shadow appearance-none border-rounded w-full mt-5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </form>
  )
}

export default Form