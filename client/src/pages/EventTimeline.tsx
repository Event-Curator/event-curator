import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import EventContext from "../context/EventContext";
import type { FullEventType } from "../types";

// Responsive hook
function useIsMobile(breakpoint = 768) {
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

// Get current week dates (Monday start)
function getWeekDates(baseDate = new Date()) {
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((baseDate.getDay() + 6) % 7));
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function EventTimeline() {
  const [weekOffset, setWeekOffset] = useState(0);
  const navigate = useNavigate();
  const { likedEvents, setLikedEvents } = useContext(EventContext);

  const today = new Date();
  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(baseDate);

  // Group events by day
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

  // Handler for removing liked events
  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedEvents((prev) => prev.filter((event) => event.externalId !== id));
  };

  const isMobile = useIsMobile(640);

  // For mobile: sort liked events by date
  const sortedEvents = [...likedEvents].sort(
    (a, b) => new Date(a.datetimeFrom).getTime() - new Date(b.datetimeFrom).getTime()
  );

  // Find last index where event is today or in the past (for blue line)
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to midnight
  let lastBlueIdx = -1;
  sortedEvents.forEach((ev, idx) => {
    const evDate = new Date(ev.datetimeFrom);
    evDate.setHours(0, 0, 0, 0);
    if (evDate.getTime() <= now.getTime()) lastBlueIdx = idx;
  });

  return (
    <div className="min-h-screen w-full bg-blue-50">
      <main className="w-full px-0 py-10 min-h-[80vh]">
        {/* Page Header */}
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 text-center">
            My Event Timeline
          </h1>
        </div>

        {/* Week Navigation */}
        {!isMobile && (
          <div className="flex items-center justify-center mb-3 gap-3">
            <button
              className="btn btn-circle btn-xs md:btn-sm"
              onClick={() => setWeekOffset((w) => w - 1)}
            >
              ←
            </button>
            <span className="font-semibold text-lg md:text-xl text-gray-700">
              {weekDates[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} –{" "}
              {weekDates[6].toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <button
              className="btn btn-circle btn-xs md:btn-sm"
              onClick={() => setWeekOffset((w) => w + 1)}
            >
              →
            </button>
          </div>
        )}

        {/* Desktop Timeline Calendar */}
        {!isMobile && (
          <div className="w-full">
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
                            // Style for today highlight
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
        )}

        {/* Mobile Vertical Timeline */}
        {isMobile && (
          <ul className="timeline timeline-vertical mb-8">
            {sortedEvents.map((ev, idx, arr) => {
              const eventDate = new Date(ev.datetimeFrom);
              eventDate.setHours(0, 0, 0, 0);
              const isToday =
                eventDate.getTime() === now.getTime();
              // line color logic
              let lineColor = "bg-black";
              if (idx <= lastBlueIdx) lineColor = "bg-primary";

              return (
                <li key={ev.externalId}>
                  <div
                    className={`timeline-${idx % 2 === 0 ? "start" : "end"} timeline-box ${
                      isToday ? "border-2 border-blue-500 shadow-lg" : ""
                    } p-5 rounded-xl bg-white flex flex-col gap-2 min-w-[220px] max-w-[96vw] relative`}
                    onClick={() => navigate(`/event/${ev.externalId}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="font-bold text-blue-800 text-lg">{ev.name}</div>
                    <div className="text-base text-gray-700">{ev.placeFreeform}</div>
                    <div className="text-base text-blue-600 font-bold">
                      {new Date(ev.datetimeFrom).toLocaleDateString()}
                    </div>
                    <div className="text-base">{getPriceLabel(ev.budgetMax)}</div>
                    {/* Delete button */}
                    <button
                      className="absolute bottom-2 right-2 btn btn-xs btn-circle black hover:bg-red-400 text-white shadow"
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
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={idx <= lastBlueIdx ? "rgb(37 99 235)" : "#222"}
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {/* timeline line */}
                  {idx < arr.length - 1 && (
                    <hr className={lineColor + " transition-all duration-500"} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
