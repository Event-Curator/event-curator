import { useState, useContext, useEffect } from "react";
import Calendar from "./Calendar";
import EventContext from "../context/EventContext";
import useGetPosition from "../hooks/useGetUserLoc";
import usePrefectureList from "../hooks/usePrefectureList";
import addOneDay from "../utils/addOneDay";
import type { LocationSearchType, MetaData } from "../types";

interface EventFiltersProps {
  setDisplayHero: (value: boolean) => void;
}

export default function EventFilters({ setDisplayHero }: EventFiltersProps) {
  const [eventCategories, setEventCategories] = useState<MetaData[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(
    undefined
  );
  const [prefecture, setPrefecture] = useState("");
  const [searchRadius, setSearchRadius] = useState(0);
  const [locSearchType, setLocSearchType] =
    useState<LocationSearchType>("latLong");
  const { latitude, longitude, userRefused } = useGetPosition();
  const { prefectureList, prefectureListError } = usePrefectureList();
  const [error, setError] = useState(false);

  const { setEvents } = useContext(EventContext);
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
          setEventCategories(data);
        }
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
    getEventCategories();
  }, [api, search, category, price, searchRadius]);

  async function getEvents() {
    try {
      // Get to and from dates. This requires a little extra processsing to account for
      // cases where user can enter undefined. If the user only selects on day, the "to"
      // var is set to that day + 24h to create a meaningful range to search.
      const from =
        selectedDates !== undefined ? selectedDates[0].toISOString() : "";
      let to = "";
      if (selectedDates !== undefined && selectedDates[1] !== undefined) {
        to = selectedDates[1].toISOString();
      } else if (
        selectedDates !== undefined &&
        selectedDates[1] === undefined
      ) {
        to = addOneDay(selectedDates[0]).toISOString();
      }

      let query = `${api}/events?name=${search}&category=${category}&budgetMax=${price}&datetimeFrom=${from}&datetimeTo=${to}&`;

      if (locSearchType === "latLong") {
        query += `placeDistanceRange=${searchRadius}&browserLat=${latitude}&browserLong=${longitude}`;
      } else {
        query += `placeProvince=${prefecture}`;
      }
      console.log(query);

      const response = await fetch(query);
      if (!response.ok) {
        console.error(response);
        setError(true);
      }
      const data = await response.json();
      setDisplayHero(false);
      setEvents(data);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  const handleSearch = () => {
    // Allow search if there is text in the search bar, or a category, price, or a location
    if (!search && !category && !location && !price && !selectedDates) {
      alert("Please enter a search term, price, category, dates, or location!");
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

  if (error || prefectureListError) {
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

      {/* Search by dates */}
      <div className="flex flex-row items-center gap-2 mb-2">
        <p>Dates</p>
        <Calendar
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
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
          {prefectureList.map(
            (pref) =>
              pref.name !== "undefined" &&
              pref.name !== "unsorted" && (
                <option key={pref.name} value={pref.name}>
                  {pref.label}
                </option>
              )
          )}
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
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
          />
          <input
            id="search-radius"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="kilometers"
            className="input input-bordered w-full pr-8 text-right flex-1/6"
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
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
