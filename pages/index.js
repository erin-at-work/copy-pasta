import React, { useState } from 'react'
import Head from 'next/head'

import Nav from '../components/nav'
import Form from '../components/form'
import Entry from '../components/entry'

const Home = ({ entries }) => {
  const [allEntries, setEntries] = useState(entries)

  const updateEntryList = newEntry => {
    setEntries([{ ...newEntry }, ...entries])
  }

  return (
    <div className="bg-gray-200 min-h-screen h-full">
      <Head>
        <title>🍝</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <div className="container mx-auto w-full max-w-lg flex flex-col pb-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6 w-full">
          <label htmlFor="text" className="block text-center text-gray-700 text-sm font-bold mb-2">
            All Carbs, No Cardio
          </label>
          <Form
            onSubmitCallback={entries => updateEntryList(entries)}
            entries={allEntries}
          />
        </div>
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
