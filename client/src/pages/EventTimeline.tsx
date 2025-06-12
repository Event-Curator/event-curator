import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import EventContext from "../context/EventContext";
import type { FullEventType } from "../types";
import { auth } from "../firebase";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

function getPriceLabel(price: number) {
  return price === 0 ? (
    <span className="text-green-600 font-semibold">Free</span>
  ) : (
    <>
      <span className="text-gray-600">¥</span>
      {price?.toLocaleString()}
    </>
  );
}

// Helper to format time range
function getTimeRange(ev: FullEventType) {
  const from = ev.datetimeFrom
    ? new Date(ev.datetimeFrom).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "-";
  const to = ev.datetimeTo
    ? new Date(ev.datetimeTo).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "-";
  return `${from} — ${to}`;
}

// Helper to get the start of the week (Monday)
function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - ((day + 6) % 7);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get week dates (Monday start)
function getWeekDates(baseMonday = new Date()) {
  const monday = getMonday(baseMonday);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// Arrow SVGs
const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={32} height={32} fill="none" viewBox="0 0 24 24" {...props}>
    <path d="M15 19l-7-7 7-7" stroke="#2761da" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={32} height={32} fill="none" viewBox="0 0 24 24" {...props}>
    <path d="M9 5l7 7-7 7" stroke="#2761da" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function EventTimeline() {
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const navigate = useNavigate();
  const { likedEvents, setLikedEvents } = useContext(EventContext);
  const [user, setUser] = useState(() => auth.currentUser);

  // Week navigation state
  const [weekOffset, setWeekOffset] = useState(0);

  // Listen for auth state changes and update user state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Sync timeline from backend when user is available
  useEffect(() => {
    if (!user) return;
    const fetchTimelineEvents = async () => {
      try {
        const api = import.meta.env.VITE_API;
        const token = await user.getIdToken();
        const res = await fetch(`${api}/events/users/timeline?user_uid=${user.uid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch timeline events");
        const events = await res.json();
        setLikedEvents(events.fullEvents); // events should be an array of FullEventType
      } catch (err) {
        console.error("Error fetching timeline events:", err);
      }
    };
    fetchTimelineEvents();
  }, [user, setLikedEvents]);

  // Handler for removing liked events (calls backend)
  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to remove from timeline.");
      return;
    }
    try {
      const api = import.meta.env.VITE_API;
      await fetch(`${api}/events/users/timeline`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          user_uid: user.uid,
          event_id: id,
        }),
      });
      setLikedEvents((prev) => prev.filter((event) => event.externalId !== id));
    } catch (error) {
      alert("Could not remove from timeline.");
      console.error(error);
    }
  };

  const isMobile = useIsMobile(640);

  // Sort events by date/time ascending
  const sortedEvents = [...likedEvents].sort(
    (a, b) => new Date(a.datetimeFrom).getTime() - new Date(b.datetimeFrom).getTime()
  );

  // Calendar logic
  const today = new Date();
  const baseMonday = getMonday(new Date(today.getFullYear(), today.getMonth(), today.getDate() + weekOffset * 7));
  const weekDates = getWeekDates(baseMonday);

  // Group events by day for week calendar
  const eventsByDay: { [k: string]: FullEventType[] } = {};
  weekDates.forEach((date) => {
    const key = date.toISOString().slice(0, 10);
    eventsByDay[key] = [];
  });
  likedEvents.forEach((ev) => {
    const key = ev.datetimeFrom.toString().slice(0, 10);
    if (eventsByDay[key]) {
      eventsByDay[key].push(ev);
    }
  });

  // Week range string
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const weekRangeStr = `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} - ${weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  // DaisyUI Table View
  function TableView() {
    return (
      <div
        className={`
          w-full
          ${isMobile ? "" : "bg-white rounded-2xl shadow px-100 py-6"} 
        `}
      >
        {/* Week navigation header for Table View */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Previous week"
            onClick={() => setWeekOffset((prev) => prev - 1)}
          >
            <ArrowLeft />
          </button>
          <div className="font-bold text-lg text-blue-700 px-2">
            {weekRangeStr}
          </div>
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Next week"
            onClick={() => setWeekOffset((prev) => prev + 1)}
          >
            <ArrowRight />
          </button>
        </div>
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
                {/* On desktop, price/th is its own column */}
                <th className="text-lg text-gray-600 hidden md:table-cell">Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((ev) => (
                <tr
                  key={ev.externalId}
                  className="hover:bg-blue-50 transition cursor-pointer"
                  onClick={() => navigate(`/event/${ev.externalId}`)}
                >
                  <td>
                    <div className="avatar">
                      <div className="rounded-xl w-40 h-40">
                        <img
                          src={ev.teaserMedia || "https://via.placeholder.com/80x80?text=No+Image"}
                          alt={ev.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-blue-700">{ev.name}</div>
                    <div className="text-xl text-gray-800">{ev.placeFreeform}</div>
                  </td>
                  <td>
                    <div className="font-bold text-gray-700">
                      {new Date(ev.datetimeFrom).toLocaleDateString()}
                    </div>
                    <div className="text-m text-gray-500">{getTimeRange(ev)}</div>
                    {/* On mobile, show price under date/time */}
                    <div className="mt-1 font-bold block md:hidden">{getPriceLabel(ev.budgetMax)}</div>
                  </td>
                  {/* On desktop, price is in its own column */}
                  <td className="font-bold hidden md:table-cell align-middle">{getPriceLabel(ev.budgetMax)}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-circle black hover:bg-red-400 text-white shadow"
                      title="Remove from timeline"
                      tabIndex={-1}
                      onClick={e => {
                        e.stopPropagation();
                        handleRemove(e, ev.externalId);
                      }}
                    >
                      &#10006;
                    </button>
                  </td>
                </tr>
              ))}
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

  // Week Calendar View (toggle)
  function WeekCalendarView() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return (
      <div className="w-full">
        {/* Week navigation header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Previous week"
            onClick={() => setWeekOffset((prev) => prev - 1)}
          >
            <ArrowLeft />
          </button>
          <div className="font-bold text-lg text-blue-700 px-2">
            {weekRangeStr}
          </div>
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Next week"
            onClick={() => setWeekOffset((prev) => prev + 1)}
          >
            <ArrowRight />
          </button>
        </div>
        <div className="bg-blue-50 rounded-2xl px-8 py-6 w-full">
          <div
            className="
              grid grid-cols-7 gap-8
              w-full
              max-w-none
            "
            style={{
              minWidth: 0,
            }}
          >
            {weekDates.map((date) => {
              const key = date.toISOString().slice(0, 10);
              const events = eventsByDay[key] || [];
              return (
                <div key={key} className="flex flex-col items-center w-full">
                  <div className="text-center font-bold text-blue-700 mb-4 text-xl">
                    {date.toLocaleDateString(undefined, { weekday: "short" })}
                    <div className="text-base text-gray-500">{date.getDate()}</div>
                  </div>
                  <div className="flex flex-col gap-4 w-full items-center">
                    {events.length === 0 ? (
                      <div
                        className="
                          bg-gray-100 rounded-xl h-24 text-base text-gray-300
                          flex items-center justify-center border border-dashed border-gray-200
                          w-full
                          min-w-0
                        "
                      >
                        No events
                      </div>
                    ) : (
                      events.map((ev) => {
                        const eventDate = new Date(ev.datetimeFrom);
                        eventDate.setHours(0, 0, 0, 0);
                        const isToday = eventDate.getTime() === now.getTime();
                        return (
                          <div
                            key={ev.externalId}
                            onClick={() => navigate(`/event/${ev.externalId}`)}
                            className={`
                              relative p-6 rounded-xl bg-white flex flex-col gap-2
                              w-full min-w-0
                              shadow transition cursor-pointer border-2
                              ${isToday ? "border-blue-500 shadow-lg" : "border-gray-200"}
                            `}
                          >
                            <div className="font-bold text-blue-800 text-lg">{ev.name}</div>
                            <div className="text-base text-gray-700">{ev.placeFreeform}</div>
                            <div className="text-base text-blue-600 font-bold">
                              {new Date(ev.datetimeFrom).toLocaleDateString()}
                            </div>
                            <div className="text-base">
                              <b>Time:&nbsp;</b>
                              {getTimeRange(ev)}
                            </div>
                            <div className="text-base">{getPriceLabel(ev.budgetMax)}</div>
                            <button
                              className="absolute bottom-3 right-3 btn btn-xs btn-circle black hover:bg-red-400 text-white shadow"
                              title="Remove from timeline"
                              tabIndex={-1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(e, ev.externalId);
                              }}
                            >
                              &#10006;
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-blue-50">
      <main className="w-full px-0 py-10 min-h-[80vh]">
        {/* Page Header */}
        <div className="flex flex-col items-center mb-6 gap-3 max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 text-center">
            My Event Timeline
          </h1>
          {/* Desktop: Toggle button */}
          {!isMobile && (
            <div className="flex gap-2">
              <button
                className={`btn btn-outline btn-sm ${viewMode === "table" ? "btn-active btn-primary" : ""}`}
                onClick={() => setViewMode("table")}
              >
                Table View
              </button>
              <button
                className={`btn btn-outline btn-sm ${viewMode === "calendar" ? "btn-active btn-primary" : ""}`}
                onClick={() => setViewMode("calendar")}
              >
                Week Calendar View
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {isMobile ? (
          // Mobile: Only Table view, responsive
          <TableView />
        ) : (
          // Desktop: Toggle view
          <>
            {viewMode === "table" ? <TableView /> : <WeekCalendarView />}
          </>
        )}
      </main>
    </div>
  );
}