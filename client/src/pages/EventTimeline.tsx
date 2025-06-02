import { useState } from "react";
import { useNavigate } from "react-router";


const demoEvents = [
  {
    id: 1,
    name: "Beer Night",
    location: "Shibuya",
    date: "2025-06-03",
    time: "19:00",
    price: 0,
  },
  {
    id: 2,
    name: "Karaoke Death Match",
    location: "Shinjuku",
    date: "2025-06-05",
    time: "20:30",
    price: 2000,
  },
  {
    id: 3,
    name: "Startup Pitch Night",
    location: "Roppongi",
    date: "2025-06-05",
    time: "18:00",
    price: 500,
  },
];

function getPriceLabel(price: number) {
  return price === 0 ? (
    <span className="text-green-600 font-semibold">Free</span>
  ) : (
    <>
      <span className="text-gray-600">¥</span>
      {price.toLocaleString()}
    </>
  );
}

// Helpers
function getWeekDates(baseDate = new Date()) {
  // Find Monday of current week
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((baseDate.getDay() + 6) % 7));
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// Main timeline UI
export default function EventTimeline() {
  const [weekOffset, setWeekOffset] = useState(0);
  const navigate = useNavigate();

  // For demo: calculate current week starting Monday, apply offset
  const today = new Date();
  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(baseDate);

  // Dummy filter for the demo
  const eventsByDay: { [k: string]: typeof demoEvents } = {};
  weekDates.forEach((date) => {
    const key = date.toISOString().slice(0, 10);
    eventsByDay[key] = [];
  });
  demoEvents.forEach((ev) => {
    if (eventsByDay[ev.date]) {
      eventsByDay[ev.date].push(ev);
    }
  });

  return (
    <main className="max-w-5xl mx-auto px-2 py-10 min-h-[80vh]">
      {/* Back button */}
      <button
        className="mb-6 flex items-center gap-2 text-blue-700 hover:underline font-semibold"
        onClick={() => navigate("/")}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Home
      </button>

      {/* Title & Fill Demo */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">My Event Timeline</h1>
        <button
          className="btn btn-outline btn-xs md:btn-sm"
          disabled
          title="Future feature"
        >
          Auto-Fill
        </button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-center mb-3 gap-3">
        <button className="btn btn-circle btn-xs md:btn-sm" onClick={() => setWeekOffset((w) => w - 1)}>
          <span className="material-symbols-outlined">&#8592;</span>
        </button>
        <span className="font-semibold text-lg md:text-xl text-gray-700">
          {weekDates[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} –{" "}
          {weekDates[6].toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <button className="btn btn-circle btn-xs md:btn-sm" onClick={() => setWeekOffset((w) => w + 1)}>
          <span className="material-symbols-outlined">&#8594;</span>
        </button>
      </div>

      {/* Timeline Calendar */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 bg-blue-50 rounded-xl p-4">
          {weekDates.map((date) => {
            const key = date.toISOString().slice(0, 10);
            const events = eventsByDay[key] || [];
            return (
              <div key={key} className="flex flex-col">
                {/* Day Header */}
                <div className="text-center font-bold text-blue-700 mb-2">
                  {date.toLocaleDateString(undefined, { weekday: "short" })}
                  <div className="text-xs text-gray-500">{date.getDate()}</div>
                </div>
                {/* Events */}
                <div className="flex flex-col gap-2">
                  {events.length === 0 && (
                    <div className="bg-gray-100 rounded-md h-14 text-xs text-gray-300 flex items-center justify-center border border-dashed border-gray-200">
                      No events
                    </div>
                  )}
                  {events.map((ev) => (
                    <div key={ev.id} className="relative bg-white border rounded-md shadow-sm p-2 flex flex-col gap-1 pr-8">
                      <div className="font-semibold text-blue-800">{ev.name}</div>
                      <div className="text-xs text-gray-500">
                        {ev.location} ・ {ev.time}
                      </div>
                      <div className="text-xs">{getPriceLabel(ev.price)}</div>
                      <button
                        className="absolute top-1 right-1 btn btn-ghost btn-xs text-red-500"
                        title="Remove from timeline"
                        tabIndex={-1}
                        // onClick={() => ...}
                      >
                        &#10006;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
