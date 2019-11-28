import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import fetch from 'isomorphic-unfetch'
import ClipboardJS from "clipboard"

const copyBtn = `
  bg-transparent hover:bg-blue-500
  text-blue-700 font-semibold hover:text-white py-2 px-4
  border border-blue-500 hover:border-transparent rounded
  mb-5 text-xs btn-copy
`;

const Entry = ({ entry }) => {
  const handleEdit = (content) => {
    const entryId = content.currentTarget.dataset.entryId;
    console.log(entryId)
  }

  useEffect(() => {
    new ClipboardJS('.btn-copy');
  });

  const dateOpts = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const createdDate = entryDate => {
    return new Date(entryDate).toLocaleDateString('en-US', dateOpts);
  };

  return (
    <li className="mb-5 border-b border-b-2 border-teal-200 pb-4">
      <pre id={`id-${entry.id}`}>
        {entry.content}
      </pre>
      <br />
      <button className={copyBtn} data-clipboard-target={`#id-${entry.id}`}>
        Copy
      </button>
      <button
        data-entry-id={entry.id}
        onClick={(entry) => handleEdit(entry)}
        type="button"
        className="ml-5 text-blue-600 text-xs"
      >
        Edit
      </button>
      <p className="text-gray-500">{entry.description}</p>
      {entry.link && (
        <a className="text-gray-400 text-xs hover:text-red-500" href={entry.link}>{entry.link}</a>
      )}
      <div>
        {createdDate(entry.created_at)}
      </div>
    </li>
  )
}

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

const Home = ({ entries }) => {
  const [allEntries, setEntries] = useState(entries)

  return (
    <div className="bg-gray-200 min-h-screen h-full">
      <Head>
        <title>🍝</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <div className="container mx-auto w-full max-w-lg flex flex-col pb-8">
        <Form updateEntryList={entries => setEntries(entries)} entries={allEntries} />
        <div className="bg-white mt-9 mb-9 w-full rounded p-6 shadow-md">
          <ul>
            {
              allEntries.map(entry => <Entry entry={entry} key={entry.id} />)
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
  let baseUrl = '/';

  if (req && typeof window === "undefined") {
    // this is running server-side, so we need an absolute URL
    const host = req.headers.host
    if (host && host.startsWith("localhost")) {
      baseUrl = `http://localhost:3000/`
    } else {
      baseUrl = `https://${host}/`
    }
  }

  const response = await fetch(`${baseUrl}api/entries`)
  const entries = await response.json();
  return { entries }
}

export default Home
