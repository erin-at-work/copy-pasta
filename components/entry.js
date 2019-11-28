import React, { useEffect } from 'react'
import ClipboardJS from 'clipboard'

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

export default Entry