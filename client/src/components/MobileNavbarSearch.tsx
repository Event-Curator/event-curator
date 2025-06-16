//import React from "react";

type MobileNavbarSearchProps = {
  show: boolean;
  setShow: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  onSearch: () => void;
  searchLoading: boolean;
};

export default function MobileNavbarSearch({
  show,
  setShow,
  search,
  setSearch,
  onSearch,
  searchLoading,
}: MobileNavbarSearchProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShow(false)}>
      <div
        className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-xs w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={() => setShow(false)}
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-2">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Search events by name or tag"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            onKeyDown={e => {
              if (e.key === "Enter") onSearch();
            }}
            disabled={searchLoading}
          />
        </div>
        <button
          className="btn btn-primary w-full mb-2"
          onClick={onSearch}
          disabled={searchLoading}
        >
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
