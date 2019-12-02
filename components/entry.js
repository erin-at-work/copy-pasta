import React, { useEffect, useState } from 'react'
import ClipboardJS from 'clipboard'
import { deleteEntry } from '../lib/api'
import Form from './entryForm'

const copyBtn = `
  bg-transparent hover:bg-blue-500
  text-blue-700 font-semibold hover:text-white py-2 px-4
  border border-blue-500 hover:border-transparent rounded
  mb-5 text-xs btn-copy
`;

const Entry = ({ entry, removeEntryFromList }) => {
  const [currentEntry, setEntry] = useState(entry)
  const [isDeleted, setDelete] = useState(false)
  const [showForm, setForm] = useState(false)

  useEffect(() => {
    if (isDeleted) {
      removeEntryFromList(entry.id)
    } else {
      new ClipboardJS('.btn-copy');
    }
  }, [isDeleted])

  const dateOpts = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const createdDate = entryDate => {
    return new Date(entryDate).toLocaleDateString('en-US', dateOpts);
  };

  const onDeleteClick = async () => {
    try {
      const resp = await deleteEntry(entry.id)
      const data = await resp.text()
      console.log(data)
      setDelete(true)
    } catch (err) {
      console.log(err)
    }
  }

  const onEditEntry = resp => {
    setEntry(resp)
    setForm(false)
  }

  if (isDeleted) {
    return (
      <li className="border-b border-b-2 border-white p-4 mb-4 text-teal-700 text-xs bg-teal-100 rounded-lg">
        <div>
          Deleted!
        </div>
      </li>
    )
  }

  return (
    <li className="mb-5 border-b border-b-2 border-teal-200 pb-4">
      {showForm ? (
        <>
        <Form
          descriptionEntry={currentEntry.description}
          linkEntry={currentEntry.link}
          contentEntry={currentEntry.content}
          entryId={entry.id}
          onSubmitCallback={resp => onEditEntry(resp)}
        />
        <button
          className="text-gray-300 mb-5 mt-3"
          onClick={() => setForm(false)}
        >
          Cancel
        </button>
        </>
      ) : (
        <>
        <pre id={`id-${entry.id}`} className="truncate">
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
        <button
          data-entry-id={entry.id}
          onClick={() => onDeleteClick()}
          type="button"
          className="ml-5 text-blue-500 text-xs"
        >
          Delete
        </button>
        <p className="text-gray-500">{currentEntry.description}</p>
        {currentEntry.link && (
          <a className="text-gray-400 text-xs hover:text-red-500" href={currentEntry.link}>{currentEntry.link}</a>
        )}
        </>
      )}
      <div className="text-teal-600 text-xs mt-5">
        {createdDate(entry.created_at)}
      </div>
    </li>
  )
}

export default Entry