import { useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

type NavbarSearchProps = {
  show: boolean;
  setShow: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  onSearch: () => void;
  searchLoading: boolean;
};

export default function NavbarSearch({
  show,
  setShow,
  search,
  setSearch,
  onSearch,
  searchLoading,
}: NavbarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  return (
    <div className="relative flex items-center">
      <button
        className="btn btn-ghost btn-circle"
        title="Search events"
        onClick={() => setShow(!show)}
        aria-label="Search"
        type="button"
      >
        <FaSearch className="w-5 h-5 text-blue-700" />
      </button>
      <input
        ref={inputRef}
        type="text"
        className={`input input-bordered ml-2 w-56 transition-all duration-200 ${
          show ? "" : "hidden"
        }`}
        placeholder="Search events by name or tag"
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoFocus={show}
        onBlur={() => setShow(false)}
        onKeyDown={e => {
          if (e.key === "Enter") onSearch();
        }}
        style={{
          position: "absolute",
          right: "110%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
        }}
        disabled={searchLoading}
      />
    </div>
  );
}
