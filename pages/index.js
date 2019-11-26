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

const Home = ({ entries }) => {
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')

  useEffect(() => {
    new ClipboardJS('.btn-copy');
  });

  const handleOnSubmit = ev => {
    if (!content.length) return;

    const body = {
      content,
      description,
      link,
      created_at: Date.now()
    }

    ev.preventDefault();
    ev.target.reset()

    fetch('/api/entries', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    })
  }

  return (
    <div className="bg-gray-200 min-h-screen h-full">
      <Head>
        <title>🍝</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <div className="container mx-auto w-full max-w-lg flex flex-col pb-8">
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
        <div className="bg-white mt-9 mb-9 w-full rounded p-6 shadow-md">
          <ul>
            {
              entries.map(entry => {
                return (
                  <li key={entry.id} className="mb-5 border-b border-b-2 border-teal-200 pb-4">
                    <pre id={`id-${entry.id}`}>
                      {entry.content}
                    </pre>
                    <br />
                    <button className={copyBtn} data-clipboard-target={`#id-${entry.id}`}>
                      Copy
                    </button>
                    <p className="text-gray-500">{entry.description}</p>
                    {entry.link && (
                      <a className="text-gray-400 text-xs hover:text-red-500" href={entry.link}>{entry.link}</a>
                    )}
                  </li>
                )
              })
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
