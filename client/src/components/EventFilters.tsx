import { useState, useContext, useEffect } from "react";
import { prefectures } from "./constants";
import EventContext from "../context/EventContext";
import useGetPosition from "../hooks/useGetUserLoc";
import type { LocationSearchType, CategoryMetaData } from "../types";

export default function EventFilters() {
  const [eventCategories, setEventCategories] = useState<CategoryMetaData[]>(
    []
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [searchRadius, setSeearchRadius] = useState(0);
  const [price, setPrice] = useState("");
  const [locSearchType, setLocSearchType] =
    useState<LocationSearchType>("latLong");
  const [error, setError] = useState(false);
  const { setEvents } = useContext(EventContext);
  const { latitude, longitude, userRefused } = useGetPosition();

  const api = import.meta.env.VITE_API;

  useEffect(() => {
    async function getEventCategories() {
      try {
        const response = await fetch(`${api}/meta?key=category`);
        const data = await response.json();
        if (!response.ok) {
          console.error(response);
          setError(true);
        } else {
          console.log(data);
          // const categoryLabels = data.map((datum) => datum.label);
          // setEventCategories(categoryLabels);
          setEventCategories(data);
        }
      } catch (error) {
        setError(true);
        console.error(error);
      }
    }
    getEventCategories();
  }, [api, search, category, price, searchRadius]);

  async function getEvents() {
    try {
      const response = await fetch(
        `${api}/events?name=${search}&category=${category}&budgetMax=${price}&placeDistanceRange=${searchRadius}&browserLat=${latitude}&browserLong=${longitude}`
      );
      if (!response.ok) {
        console.error(response);
        return;
      }
      const data = await response.json();
      setEvents(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      setError(true);
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

  if (error) {
    return (
      <h1 className="text-2xl text-red-500">
        We're sorry, something went wrong. Please try again later.
      </h1>
    );
  }

  return (
    <aside className="bg-white p-4 rounded shadow-md w-full">
      {/* Search box */}
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
      {/* Search by category */}
      <div className="flex gap-2 mb-4">
        <select
          className="select select-bordered w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Categories</option>
          {eventCategories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Search by price */}
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

      {/* Search type */}
      <div className="flex flex-row mb-4">
        {/* Toggle search type */}
        <label className="label mr-4">
          <input
            type="checkbox"
            defaultChecked
            className="toggle border-primary text-primary"
            onChange={toggleSearchLocType}
            disabled={userRefused}
          />
          {locSearchType === "latLong"
            ? "Search near me"
            : "Search by prefecture"}
        </label>
        {/* Search by prefecture */}
        <select
          className="select select-bordered w-full"
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          hidden={locSearchType === "latLong"}
        >
          <option value="">All prefectures</option>
          {prefectures.map((pref) => (
            <option key={pref} value={pref}>
              {pref} Prefecture
            </option>
          ))}
        </select>
        {/* Search by radius */}
        <div
          className="relative w-full flex flex-row items-center gap-2"
          hidden={locSearchType === "prefecture"}
        >
          <label htmlFor="search-radius">Km from me</label>
          <input
            type="range"
            min={0}
            max="30"
            value={searchRadius}
            className="range range-primary"
            onChange={(e) => setSeearchRadius(parseInt(e.target.value))}
          />
          <input
            id="search-radius"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="kilometers"
            className="input input-bordered w-full pr-8 text-right flex-1/6"
            value={searchRadius}
            onChange={(e) => setSeearchRadius(parseInt(e.target.value))}
            style={{
              MozAppearance: "textfield",
            }}
          />
        </div>
      </div>
      {/* Search/submit button */}
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
