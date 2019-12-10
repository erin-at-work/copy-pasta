import React, { useState, useEffect } from "react";
import Head from "next/head";
import ClipboardJS from "clipboard";

import { postNewEntry } from "../lib/api";

import Entry from "../components/entry";

const Home = ({ entries }) => {
  const [allEntries, setEntries] = useState(entries);
  const [filteredList, setFilter] = useState(allEntries);
  const [topEntries, setTopFive] = useState([]);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [autoFocusSearch, setSearchFocus] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);

  const searchFocusKeyMap = {
    Meta: false,
    "/": false
  };

  useEffect(() => {
    const downhandler = function(ev) {
      if (ev.key in searchFocusKeyMap) {
        searchFocusKeyMap[ev.key] = true;
        if (searchFocusKeyMap["Meta"] && searchFocusKeyMap["/"]) {
          console.log("search visible");
          setSearchFocus(!autoFocusSearch);
        }
      }
    };

    const upHandler = function(ev) {
      for (const prop in searchFocusKeyMap) {
        searchFocusKeyMap[prop] = false;
      }
    };

    window.addEventListener("keydown", downhandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downhandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [autoFocusSearch]);

  const panelKeyMap = {
    Meta: false,
    b: false
  };

  useEffect(() => {
    const downhandler = function(ev) {
      if (ev.key in panelKeyMap) {
        panelKeyMap[ev.key] = true;
        if (panelKeyMap["Meta"] && panelKeyMap["b"]) {
          console.log("visible?");
          setPanelVisible(!panelVisible);
        }
      }
    };

    const upHandler = function(ev) {
      if (ev.key in panelKeyMap) {
        panelKeyMap[ev.key] = false;
      }
    };

    window.addEventListener("keydown", downhandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downhandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [panelVisible]);

  /** Note: Need to press `n` first, then `Alt` */
  const formKeyMap = {
    n: false,
    Alt: false
  };

  useEffect(() => {
    const handler = function(ev) {
      if (ev.key in formKeyMap) {
        formKeyMap[ev.key] = true;
        if (formKeyMap["n"] && formKeyMap["Alt"]) {
          console.log("form visible?");
          setFormVisible(!formVisible);
        }
      }
    };

    const upHandler = function(ev) {
      if (ev.key in formKeyMap) {
        formKeyMap[ev.key] = false;
      }
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [formVisible]);

  useEffect(() => {
    setFilter(allEntries);
  }, [allEntries]);

  useEffect(() => {
    const clipboard = new ClipboardJS(`.js-copy-entry`);

    return function cleanup() {
      clipboard.destroy();
    };
  }, []);

  const calcTopFive = entries =>
    entries.sort((a, b) => (a.counter > b.counter ? -1 : 1)).slice(0, 5);

  useEffect(() => {
    const topEntries = calcTopFive(entries);
    setTopFive(topEntries);
  }, [entries]);

  const handleOnSearch = ev => {
    const keyword = ev.target.value;
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
    return false;
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

  const header = `border-b-2 border-teal-600 pb-2 tracking-wider font-semibold font-color text-teal-700 text-xs`;

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

      <nav className="panel flex flex-col justify-between">
        <div className="w-full flex flex-col p-5">
          <header className="header text-center">
            COPY<span className="copy-pasta-span">PASTA</span>
          </header>
          <aside className="mt-5">
            <section>
              <header className={header}>TAGS</header>
              <div className="pt-4">
                {["github", "stripe", "emojis", "docker", "react", "js"].map(
                  tag => {
                    return (
                      <span className="mr-2 mb-2 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-600">
                        #{tag}
                      </span>
                    );
                  }
                )}
              </div>
              <section className="mt-10">
                <header className={header}>TOP FIVE</header>
                <ul className="pt-4">
                  {topEntries.map(entry => {
                    return (
                      <li
                        key={entry.id}
                        className="top-5 flex flex-row rounded-full transition hover:bg-teal-200 hover:text-teal-700 justify-between tracking-wide mb-2 text-sm text-gray-200 cursor-pointer js-copy-entry"
                        data-clipboard-target={`#id-top-${entry.id}`}
                      >
                        <pre
                          id={`id-top-${entry.id}`}
                          className="truncate w-2/3"
                        >
                          <code>{entry.content}</code>
                        </pre>
                        <div className="w-1/12 opacity-75 text-right">
                          {entry.counter}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
              <section className="mt-10">
                <header className={header}>RECENT COPY COUNTS</header>
                <ul className="pt-4">
                  <li className="flex flex-row tracking-wide justify-between mb-2 text-sm text-gray-200 opacity-75 cursor-pointer">
                    <div className="w-2/3 text-sm">January 5th, 2020</div>
                    <div className="w-1/12 text-right">12</div>
                  </li>
                </ul>
              </section>
            </section>
          </aside>
        </div>
        <div className="flex p-5 bg-teal-700">
          <header className="header text-center">
            KEY<span className="key-notes-span">NOTES</span>
          </header>
        </div>
      </nav>

      <div className="push-container">
        <div className="flex p-5 justify-center">
          <button
            onClick={() => setPanelVisible(!panelVisible)}
            className="p-3"
          >
            ✂️🍝
          </button>
        </div>

        <div className="container mx-auto w-full max-w-lg flex flex-col pb-8 px-4">
          {autoFocusSearch && (
            <input
              onChange={ev => handleOnSearch(ev)}
              autoFocus
              placeholder="Search here"
              type="text"
              className="bg-gray-300 mb-5 appearance-none border-2 border-gray-300 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            />
          )}
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
