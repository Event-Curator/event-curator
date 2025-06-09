import { useState, useContext } from "react";
import { eventCategories, prefectures } from "./constants";
import EventContext from "../context/EventContext";
import useGetPosition from "../hooks/useGetUserLoc";
import type { LocationSearchType } from "../types";

export default function EventFilters() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [price, setPrice] = useState("");
  const [locSearchType, setLocSearchType] =
    useState<LocationSearchType>("latLong");
  const { setEvents } = useContext(EventContext);
  const { latitude, longitude, userRefused } = useGetPosition();
  console.log(latitude, longitude, userRefused);

  const api = import.meta.env.VITE_API;

  async function getEvents() {
    try {
      const response = await fetch(
        `${api}?name=${search}&category=${category}&budgetMax=${price}`
      );
      if (!response.ok) {
        console.error(response);
        return;
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearch = () => {
    // Allow search if there is text in the search bar, or a category, price, or a location
    if (!search && !category && !location && !price) {
      alert("Please enter a search term, price, category, or location!");
      return;
    } else {
      getEvents();
    }
  };

  // Only allow numbers in price
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setPrice(val);
  };

  const toggleSearchLocType = (): void => {
    if (locSearchType === "latLong") {
      setLocSearchType("prefecture");
    } else {
      setLocSearchType("latLong");
    }
  };

  return (
    <aside className="bg-white p-4 rounded shadow-md w-full">
      <div className="mb-4">
        <label className="font-bold text-sm text-gray-700 mb-2 block">
          Search
        </label>
        <div className="flex">
          <input
            type="text"
            placeholder="Search by keyword"
            className="input input-bordered w-full rounded-r-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            className="btn btn-primary rounded-l-none"
            onClick={handleSearch}
          >
            🔍
          </button>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <select
          className="select select-bordered w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Categories</option>
          {eventCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="relative w-full">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Max Price"
            className="input input-bordered w-full pr-8 text-right"
            value={price}
            onChange={handlePriceChange}
            style={{
              MozAppearance: "textfield",
            }}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none select-none"
            style={{ userSelect: "none" }}
          >
            ¥
          </span>
        </div>
      </div>
      <div className="flex flex-row mb-4">
        <label className="label mr-4">
          <input
            type="checkbox"
            defaultChecked
            className="toggle"
            onChange={toggleSearchLocType}
          />
          {locSearchType === "latLong"
            ? "Search near me"
            : "Search by prefecture"}
        </label>
        <select
          className="select select-bordered w-full"
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
        >
          <option value="">All prefectures</option>
          {prefectures.map((pref) => (
            <option key={pref} value={pref}>
              {pref} Prefecture
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary w-full mb-2" onClick={handleSearch}>
        Find Events
      </button>
      <style>
        {`
          input[type="number"]::-webkit-inner-spin-button, 
          input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </aside>
  );
}
