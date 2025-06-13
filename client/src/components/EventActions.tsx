import React from "react";

const AddIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#2761da" viewBox="0 0 24 24" {...props}>
    <path d="M19 11h-6V5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2z" />
  </svg>
);

const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#e53e3e" viewBox="0 0 24 24" {...props}>
    <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#2761da" viewBox="0 0 24 24" {...props}>
    <path d="M9.88 18.36a3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24l2.83-2.83-1.41-1.41-2.83 2.83a5.003 5.003 0 0 0 0 7.07c.98.97 2.25 1.46 3.54 1.46s2.56-.49 3.54-1.46l2.83-2.83-1.41-1.41-2.83 2.83ZM12.71 4.22 9.88 7.05l1.41 1.41 2.83-2.83a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24l-2.83 2.83 1.41 1.41 2.83-2.83a5.003 5.003 0 0 0 0-7.07 5.003 5.003 0 0 0-7.07 0Z"></path>
    <path d="m16.95 8.46-.71-.7-.7-.71-4.25 4.24-4.24 4.25.71.7.7.71 4.25-4.24z"></path>
  </svg>
);

type Props = {
  isAdded: boolean;
  handleAdd: () => void;
  handleDelete: () => void;
  originUrl?: string;
};

export default function EventActions({ isAdded, handleAdd, handleDelete, originUrl }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="btn btn-outline flex items-center gap-2"
        onClick={handleAdd}
        disabled={isAdded}
      >
        <AddIcon />
        {isAdded ? "Added" : "Add to Timeline"}
      </button>
      {isAdded && (
        <button
          type="button"
          className="btn btn-outline flex items-center gap-2"
          onClick={handleDelete}
        >
          <DeleteIcon />
          Remove
        </button>
      )}
      {originUrl && (
        <a
          href={originUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline flex items-center gap-2"
        >
          <LinkIcon />
          Link to Source
        </a>
      )}
    </div>
  );
}