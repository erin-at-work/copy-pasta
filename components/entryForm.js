import React, { useState } from "react";
import { postNewEntry } from "../lib/api";

const Form = ({
  onSubmitCallback = {},
  descriptionEntry = "",
  linkEntry = "",
  contentEntry = "",
  entryId = ""
}) => {
  const [content, setContent] = useState(contentEntry);
  const [description, setDescription] = useState(descriptionEntry);
  const [link, setLink] = useState(linkEntry);

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
      const resp = await postNewEntry({ body, id: entryId });
      await resp.json();
      console.log(`Edited ${entryId}`);

      onSubmitCallback(body);
    } catch {
      console.log(`There's been an error saving ${content}`);
    }
  };

  return (
    <form onSubmit={handleOnSubmit} id={`form${entryId}`}>
      <textarea
        onChange={ev => setContent(ev.target.value)}
        placeholder={content}
        type="text"
        value={content}
        className="mb-2 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      />
      <input
        onChange={ev => setDescription(ev.target.value)}
        placeholder={description}
        type="text"
        value={description}
        className="mb-2 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      />
      <input
        onChange={ev => setLink(ev.target.value)}
        placeholder="http://"
        type="text"
        value={link}
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      />
      <button
        type="submit"
        className="mt-5 w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
