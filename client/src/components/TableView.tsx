import React from "react";
import { useNavigate } from "react-router";
import type { FullEventType } from "../types";
import { getTimeRange, getPriceLabel } from "../utils/eventUtils";
import { categoryImages } from "../assets/categoryImages";

const server = import.meta.env.VITE_API;

type TableViewProps = {
  events: FullEventType[];
  isMobile: boolean;
  handleRemove: (e: React.MouseEvent, ev: FullEventType) => void;
  onRowClick?: (eventId: string) => void;
};

export default function TableView({ events, isMobile, handleRemove, onRowClick }: TableViewProps) {
  const navigate = useNavigate();

  let sortedEvents = events.sort((a, b) => new Date(a.datetimeSchedule).getTime() - new Date(b.datetimeSchedule).getTime())

  if (isMobile) {
    // Mobile: stacked card style, no horizontal scroll, all info and delete button visible
    return (
      <div className="w-full flex flex-col gap-3">
        {sortedEvents.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No events in your timeline yet.
          </div>
        )}
        {sortedEvents.map((ev) => {
          const category = ev.category || "Other";
          const fallbackImage = categoryImages[category] || categoryImages["Other"];
          const imageSrc =
            ev.teaserMedia && ev.teaserMedia.trim() !== ""
              ? (server + "/.." + ev.teaserMedia)
              : fallbackImage;
          return (
            <div
              key={ev.externalId + '-' + ev.datetimeSchedule}
              className="flex items-center gap-3 bg-white rounded-xl shadow px-3 py-3"
              onClick={() =>
                onRowClick
                  ? onRowClick(ev.externalId)
                  : navigate(`/event/${ev.externalId}`)
              }
              style={{ minHeight: 90 }}
            >
              <div className="flex-shrink-0">
                <div className="rounded-xl w-20 h-20 relative overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={ev.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-blue-700 text-base truncate">{ev.name}</div>
                <div className="text-sm text-gray-800 truncate">{ev.placeFreeform}</div>
                <div className="font-bold text-gray-700 text-xs">
                  {new Date(ev.datetimeFrom).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">{getTimeRange(ev)}</div>
                <div className="mt-1 font-bold text-xs">{getPriceLabel(ev.budgetMax)}</div>
              </div>
              <div className="flex-shrink-0 pl-2">
                <button
                  className="btn btn-xs btn-circle black hover:bg-red-400 text-white shadow"
                  title="Remove from timeline"
                  tabIndex={-1}
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(e, ev);
                  }}
                >
                  &#10006;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop/tablet: table view
  return (
    <div className="w-full bg-white rounded-2xl shadow px-80 py-6">
      <div className="overflow-x-auto w-full">
        <table className="table table-lg w-full bg-white rounded-2xl shadow">
          <thead>
            <tr>
              <th></th>
              <th className="text-lg text-gray-600">Event</th>
              <th className="text-lg text-gray-600">
                Date / Time
                <span className="block md:hidden">&amp; Price</span>
              </th>
              <th className="text-lg text-gray-600 hidden md:table-cell">Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((ev, idx) => {
              const category = ev.category || "Other";
              const fallbackImage = categoryImages[category] || categoryImages["Other"];
              const imageSrc =
                ev.teaserMedia && ev.teaserMedia.trim() !== ""
                  ? (server + "/.." + ev.teaserMedia)
                  : fallbackImage;
              return (
                <tr
                  key={ev.externalId + '-' + ev.datetimeSchedule}
                  className={`hover:bg-blue-50 transition cursor-pointer ${
                    idx % 2 === 1 ? "bg-blue-100" : "bg-white"
                  }`}
                  onClick={() =>
                    onRowClick
                      ? onRowClick(ev.externalId)
                      : navigate(`/event/${ev.externalId}`)
                  }
                >
                  <td>
                    <div className="avatar relative">
                      <div className="rounded-xl w-24 h-24 md:w-40 md:h-40 relative">
                        <img
                          src={imageSrc}
                          alt={ev.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-blue-700 text-base">{ev.name}</div>
                    <div className="text-m text-gray-800">{ev.placeFreeform}</div>
                  </td>
                  <td>
                    <div className="font-bold text-gray-700">
                      {ev.datetimeSchedule ? new Date(ev.datetimeSchedule).toLocaleDateString() : new Date(ev.datetimeFrom).toLocaleDateString()}
                    </div>
                    <div className="text-m text-gray-500">{getTimeRange(ev)}</div>
                    <div className="mt-1 font-bold block md:hidden">{getPriceLabel(ev.budgetMax)}</div>
                  </td>
                  <td className="font-bold hidden md:table-cell align-middle">{getPriceLabel(ev.budgetMax)}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-circle black hover:bg-red-400 text-white shadow"
                      title="Remove from timeline"
                      tabIndex={-1}
                      onClick={e => {
                        e.stopPropagation();
                        handleRemove(e, ev);
                      }}
                    >
                      &#10006;
                    </button>
                  </td>
                </tr>
              );
            })}
            {sortedEvents.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-10">
                  No events in your timeline yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}