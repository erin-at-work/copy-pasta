import React, { useEffect, useState } from 'react'
import ClipboardJS from 'clipboard'
import Form from './form'

const copyBtn = `
  bg-transparent hover:bg-blue-500
  text-blue-700 font-semibold hover:text-white py-2 px-4
  border border-blue-500 hover:border-transparent rounded
  mb-5 text-xs btn-copy
`;

const Entry = ({ entry }) => {
  const [currentEntry, setEntry] = useState(entry)
  const [showForm, setForm] = useState(false)

  useEffect(() => {
    new ClipboardJS('.btn-copy');
  })

  const dateOpts = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const createdDate = entryDate => {
    return new Date(entryDate).toLocaleDateString('en-US', dateOpts);
  };

  return (
    <li className="mb-5 border-b border-b-2 border-teal-200 pb-4">
      {showForm ? (
        <>
        <Form
          descriptionEntry={currentEntry.description}
          linkEntry={currentEntry.link}
          contentEntry={currentEntry.content}
          entryId={entry.id}
          onSubmitCallback={resp => setEntry(resp)}
        />
        <button
          className="text-gray-300 mb-5"
          onClick={() => setForm(false)}
        >
          Cancel
        </button>
        </>
      ) : (
        <>
        <pre id={`id-${entry.id}`}>
          {currentEntry.content}
        </pre>
        <br />
        <button className={copyBtn} data-clipboard-target={`#id-${entry.id}`}>
          Copy
        </button>
        <button
          data-entry-id={entry.id}
          onClick={() => setForm(true)}
          type="button"
          className="ml-5 text-blue-600 text-xs"
        >
          Edit
        </button>
        <p className="text-gray-500">{currentEntry.description}</p>
        {currentEntry.link && (
          <a className="text-gray-400 text-xs hover:text-red-500" href={currentEntry.link}>{currentEntry.link}</a>
        )}
        </>
      )}
      <div>
        {createdDate(entry.created_at)}
      </div>
    </li>
  )
}

export default Entry