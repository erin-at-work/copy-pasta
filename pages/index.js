import React from 'react'
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
  React.useEffect(() => {
    new ClipboardJS('.btn-copy');
  });

  return (
  <div className="bg-gray-200 h-screen">
    <Head>
      <title>🍝</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />
    <div className="container mx-auto w-full max-w-lg flex flex-col">
      <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
        <div className="mb-4">
          <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">
            Enter Text:
          </label>
          <input placeholder="Say something interesting..." type="text" className="shadow appearance-none border-rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
      </form>
      <div className="bg-white mt-9 w-full rounded p-6 shadow-md">
        <ul>
          {
            entries.map(entry => {
              return (
                <li key={entry.id}>
                  <pre id={entry.id}>
                    {entry.content}
                  </pre>
                  <br />
                  <button className={copyBtn} data-clipboard-target={`#${entry.id}`}>
                    Copy
                  </button>
                  <p>{entry.description}</p>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  </div>
)}

Home.getInitialProps = async () => {
  const response = await fetch('http://localhost:3000/api/entries')
  const entries = await response.json();
  return { entries }
}

export default Home
