import { tokyoWards } from "./constants";

export default function EventFilters() {
  return (
    <aside className="bg-white p-4 rounded shadow-md w-full">
      {/* Search */}
      <div className="mb-4">
        <label className="font-bold text-sm text-gray-700 mb-2 block">Search</label>
        <div className="flex">
          <input
            type="text"
            placeholder="Search by keyword or tag"
            className="input input-bordered w-full rounded-r-none"
          />
          <button className="btn btn-primary rounded-l-none">🔍</button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <button className="btn btn-outline btn-sm text-blue-700 border-blue-200 flex-1">Categories</button>
        <button className="btn btn-outline btn-sm text-blue-700 border-blue-200 flex-1">Location</button>
        <button className="btn btn-outline btn-sm text-blue-700 border-blue-200 flex-1">Price</button>
      </div>
      {/* Date Range */}
      <div className="mb-4 flex items-center gap-2">
        <span className="font-medium">From</span>
        <input type="date" className="input input-bordered input-xs" />
        <span className="font-medium">To</span>
        <input type="date" className="input input-bordered input-xs" />
      </div>
      {/* Ward Select */}
      <div className="mb-4">
        <select className="select select-bordered w-full">
          <option>All wards</option>
          {tokyoWards.map(ward => (
            <option key={ward}>{ward} Ward</option>
          ))}
        </select>
      </div>
      {/* Event Calendar Button */}
      <button className="btn btn-primary w-full mb-2">Event Calendar</button>
    </aside>
  );
}
