import React, { useState, useEffect } from "react";
import Head from "next/head";

import { postNewEntry } from "../lib/api";

import Entry from "../components/entry";

const Home = ({ entries }) => {
  const [allEntries, setEntries] = useState(entries);
  const [filteredList, setFilter] = useState(allEntries);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);

  useEffect(() => {
    setFilter(allEntries);
  }, [allEntries]);

  const handleOnSearch = keyword => {
    console.log(keyword);
    let list;

    if (!Boolean(keyword.length)) {
      list = [...allEntries];
    } else {
      try {
        list = allEntries.filter(entry => {
          return (
            entry.content.toLowerCase().search(keyword.trim().toLowerCase()) !==
            -1
          );
        });
      } catch (err) {
        console.log(err);
        console.log(`Not a valid search term ${keyword}`);
        list = [...allEntries];
      }
    }
    setFilter(list);
  };

  const removeEntry = entryId => {
    console.log(allEntries.length);
    const updatedList = allEntries.filter(entry => entry.id !== entryId);
    console.log(updatedList.length);
    setTimeout(() => {
      setEntries(updatedList);
    }, 1000);
  };

  const handleOnSubmit = async ev => {
    ev.persist();
    ev.preventDefault();
    if (!content.length) return;

    const body = {
      content,
      description,
      link
    };

    try {
      const resp = await postNewEntry({ body });
      const { id } = await resp.json();

      setEntries([{ ...body, created_at: Date.now(), id }, ...allEntries]);
      ev.target.reset();
    } catch {
      console.log(`There's been an error saving ${content}`);
    }
  };

  return (
    <div
      className={`bg-gray-200 min-h-screen h-full ${
        panelVisible ? "is-visible" : ""
      }`}
    >
      <Head>
        <title>🍝</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="panel">
        <div className="w-full flex flex-col p-5">
          <header className="header text-center">
            COPY<span>PASTA</span>
          </header>
          <section className="mt-5">
            {['github', 'stripe', 'emojis', 'docker', 'react'].map(tag => {
              return (
              <span className="mr-2 mb-2 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-600">#{tag}</span>
              )
            })}

          </section>
        </div>
      </nav>

      <div className="push-container">
        <div className="flex p-5 justify-center">
          <button onClick={() => setPanelVisible(!panelVisible)}>✂️🍝</button>
        </div>

        <div className="container mx-auto w-full max-w-lg flex flex-col pb-8 px-4">
          <input
            onChange={ev => handleOnSearch(ev.target.value)}
            autoFocus
            placeholder="Search here"
            type="text"
            className="bg-gray-300 mb-5 appearance-none border-2 border-gray-300 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />

          {formVisible ? (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6 w-full">
              <label
                htmlFor="text"
                className="block text-center text-gray-700 text-sm font-bold mb-2"
              >
                All Carbs, No Cardio
              </label>
              <form onSubmit={handleOnSubmit} id="form">
                <textarea
                  autoFocus={formVisible}
                  onChange={ev => setContent(ev.target.value)}
                  placeholder="Say something interesting..."
                  type="text"
                  className="shadow appearance-none border-rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
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
                <button
                  type="submit"
                  className="mt-5 w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
                <div className="m5-5 w-full text-center">
                  <button
                    type="button"
                    className="mt-5 text-small text-gray-600 focus:outline-none focus:shadow-outline"
                    onClick={() => setFormVisible(false)}
                  >
                    Hide
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setFormVisible(true)}
                className="mb-5 w-full text-white bg-teal-600 hover:bg-teal-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add a new dish
              </button>
            </div>
          )}
          <div className="bg-white mt-9 mb-9 w-full rounded p-6 shadow-md">
            <ul>
              {filteredList.map(entry => (
                <Entry
                  entry={entry}
                  key={entry.id}
                  removeEntryFromList={removeEntry}
                />
              ))}
            </ul>
            {!Boolean(filteredList.length) && (
              <p className="italic text-center text-gray-400">
                Mamma mia! Basta pasta!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Home.getInitialProps = async ({ req }) => {
  let baseUrl = "/";

  if (req && typeof window === "undefined") {
    // this is running server-side, so we need an absolute URL
    const host = req.headers.host;
    if (host && host.startsWith("localhost")) {
      baseUrl = `http://localhost:3000/`;
    } else {
      baseUrl = `https://${host}/`;
    }
  }

  const response = await fetch(`${baseUrl}api/entries`);
  const entries = await response.json();
  return { entries };
};

export default Home;
