import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import type { FullEventType } from "../types";
import FormattedPrice from "../components/FormattedPrice";
import getDaysInMonth from "../utils/getDaysInMonth";
import Loading from "../components/Loading";
import EventContext from "../context/EventContext";
import { auth } from "../firebase";

// LinkIcon component
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill={"#2761da"}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M9.88 18.36a3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24l2.83-2.83-1.41-1.41-2.83 2.83a5.003 5.003 0 0 0 0 7.07c.98.97 2.25 1.46 3.54 1.46s2.56-.49 3.54-1.46l2.83-2.83-1.41-1.41-2.83 2.83ZM12.71 4.22 9.88 7.05l1.41 1.41 2.83-2.83a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24l-2.83 2.83 1.41 1.41 2.83-2.83a5.003 5.003 0 0 0 0-7.07 5.003 5.003 0 0 0-7.07 0Z"></path>
    <path d="m16.95 8.46-.71-.7-.7-.71-4.25 4.24-4.24 4.25.71.7.7.71 4.25-4.24z"></path>
  </svg>
);

// AddIcon component (small plus icon)
const AddIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill={"#2761da"}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M19 11h-6V5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2z" />
  </svg>
);

// DeleteIcon component
const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="#e53e3e"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

// Arrow icons for calendar navigation
const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} fill="none" stroke="#2761da" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} fill="none" stroke="#2761da" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { likedEvents, setLikedEvents } = useContext(EventContext);
  const [event, setEvent] = useState<FullEventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState<number | null>(null);
  const [calendarYear, setCalendarYear] = useState<number | null>(null);

  const api = import.meta.env.VITE_API;

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${api}/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(Array.isArray(data) && data.length ? data[0] : null);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, api]);

  useEffect(() => {
    if (!event) return;
    const alreadyLiked = likedEvents.some((e) => e.externalId === event.externalId);
    setIsAdded(alreadyLiked);

    // Set calendar to event start month on load
    if (event.datetimeFrom) {
      const start = new Date(event.datetimeFrom);
      setCalendarMonth(start.getMonth());
      setCalendarYear(start.getFullYear());
    }
  }, [event, likedEvents]);

  const handleAdd = async () => {
    if (!event) return;
    const alreadyLiked = likedEvents.some((e) => e.externalId === event.externalId);
    if (alreadyLiked) return;

    // Make sure user is logged in
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to add to timeline.");
      return;
    }

    try {
      // POST to backend
      const api = import.meta.env.VITE_API;
      await fetch(`${api}/events/users/timeline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          user_uid: user.uid,
          event_id: event.externalId,
        }),
      });

      setLikedEvents((prev) => [...prev, event]);
      setIsAdded(true);
    } catch (error) {
      alert("Could not add to timeline.");
      console.error(error);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!event) return;
    const user = auth.currentUser;
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
          event_id: event.externalId,
        }),
      });
      setLikedEvents((prev) => prev.filter((e) => e.externalId !== event.externalId));
      setIsAdded(false);
    } catch (error) {
      alert("Could not remove from timeline.");
      console.error(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Event Not Found</h1>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const startDate = event.datetimeFrom ? new Date(event.datetimeFrom) : null;
  const endDate = event.datetimeTo ? new Date(event.datetimeTo) : null;

  // Calendar month/year state fallback
  const currentMonth = calendarMonth !== null ? calendarMonth : (startDate ? startDate.getMonth() : new Date().getMonth());
  const currentYear = calendarYear !== null ? calendarYear : (startDate ? startDate.getFullYear() : new Date().getFullYear());

  const calendarDays = getDaysInMonth(new Date(currentYear, currentMonth));
  // For multi-month events, highlight days in range
  function isDayInEventRange(day: number) {
    if (!startDate || !endDate) return false;
    const thisDay = new Date(currentYear, currentMonth, day);
    return thisDay >= startDate && thisDay <= endDate;
  }

  function isStartDay(day: number) {
    return startDate && startDate.getFullYear() === currentYear && startDate.getMonth() === currentMonth && startDate.getDate() === day;
  }
  function isEndDay(day: number) {
    return endDate && endDate.getFullYear() === currentYear && endDate.getMonth() === currentMonth && endDate.getDate() === day;
  }

  const monthYear =
    new Date(currentYear, currentMonth).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    });

  // Use ONLY the original event image from backend; fallback to a generic placeholder
  const imageSrc =
    event.teaserMedia && event.teaserMedia.trim() !== ""
      ? event.teaserMedia
      : "https://via.placeholder.com/600x320?text=No+Image";

  // Map setup: use event latitude/longitude if available, else Tokyo (35.6895, 139.6917)
  const lat =
    event.placeLattitude && !isNaN(event.placeLattitude) ? event.placeLattitude : 35.6895;
  const lng =
    event.placeLongitude && !isNaN(event.placeLongitude) ? event.placeLongitude : 139.6917;
  // OSM iframe url
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.02}%2C${lat-0.01}%2C${lng+0.02}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

  // Calendar navigation
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => (prev !== null ? prev - 1 : currentYear - 1));
    } else {
      setCalendarMonth((prev) => (prev !== null ? prev - 1 : currentMonth - 1));
    }
  };
  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => (prev !== null ? prev + 1 : currentYear + 1));
    } else {
      setCalendarMonth((prev) => (prev !== null ? prev + 1 : currentMonth + 1));
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="relative mb-6">
        <img
          src={imageSrc}
          alt={event.name}
          className="w-full h-80 object-cover rounded-xl shadow"
          draggable={false}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
        <section>
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            {event.name || "-"}
          </h1>
          <div className="space-y-2 text-gray-700 text-sm mb-6">
            <p>
              <b>Category:</b> {event.category || "-"}
            </p>
            <p>
              <b>Location:</b> {event.placeFreeform || "-"}
            </p>
            <p>
              <b>Date:&nbsp;</b>
              {startDate ? startDate.toLocaleDateString() : "-"} —{" "}
              {endDate ? endDate.toLocaleDateString() : "-"}
            </p>
            <p>
              <b>Time:&nbsp;</b>
              {startDate
                ? startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "-"}
              {" — "}
              {endDate
                ? endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "-"}
            </p>
            <p>
              <b>Price:</b> <FormattedPrice price={event.budgetMin} />
              {event.budgetMax > 0 && (
                <span> — {<FormattedPrice price={event.budgetMax} />}</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline flex items-center gap-2"
                onClick={handleAdd}
                disabled={isAdded}
              >
                <AddIcon />
                {isAdded ? "Added" : "Add to Timeline"}
              </button>
              {isAdded && (
                <button
                  type="button"
                  className="btn btn-outline flex items-center gap-2"
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                  Remove
                </button>
              )}
              {event.originUrl && (
                <a
                  href={event.originUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline flex items-center gap-2"
                >
                  <LinkIcon />
                  Link to Source
                </a>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow prose max-w-none">
            <h2 className="text-blue-700 font-bold mb-2">Event Description</h2>
            <p>{event.description || "No description available."}</p>
          </div>
        </section>
        <aside className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-blue-700">Location</h2>
              <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm px-4 flex items-center gap-2 shadow font-semibold text-base"
                title="Open map in full screen"
                style={{ minHeight: "2.5rem" }}
              >
                <svg
                  width={18}
                  height={18}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  className="inline-block"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8-18h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3" />
                </svg>
                Open in Fullscreen
              </a>
            </div>
            <div className="mt-4 flex items-center justify-center text-blue-500 text-xs bg-blue-50 border border-blue-100 rounded h-64 overflow-hidden">
              <iframe
                title="Event Location Map"
                src={mapSrc}
                width="100%"
                height="220"
                className="rounded"
                style={{ border: 0, minWidth: "200px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center justify-between mb-1">
              <button
                type="button"
                aria-label="Previous month"
                className="p-1 rounded hover:bg-blue-100"
                onClick={handlePrevMonth}
              >
                <ArrowLeft />
              </button>
              <h3 className="text-lg font-bold text-blue-700">{monthYear}</h3>
              <button
                type="button"
                aria-label="Next month"
                className="p-1 rounded hover:bg-blue-100"
                onClick={handleNextMonth}
              >
                <ArrowRight />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs w-full">
              {["M", "T1", "W", "T2", "F", "S1", "S2"].map((d, idx) => (
                <div key={d + idx} className="font-bold text-gray-500">
                  {d[0]}
                </div>
              ))}
              {Array.from({ length: calendarDays }).map((_, i) => {
                const day = i + 1;
                const start = isStartDay(day);
                const end = isEndDay(day);
                const inRange = isDayInEventRange(day);

                let baseClasses = "rounded py-1 border cursor-default";
                if (start) {
                  baseClasses += " bg-blue-700 text-white font-bold border-green-600 hover:bg-green-600";
                } else if (end) {
                  baseClasses += " bg-blue-700 text-white font-bold border-orange-500 hover:bg-orange-500";
                } else if (inRange) {
                  baseClasses += " bg-blue-700 text-white font-bold border-blue-800 hover:bg-blue-800";
                } else {
                  baseClasses += " bg-blue-50 text-gray-700 border-blue-100";
                }
                return (
                  <div
                    key={day}
                    title={
                      start
                        ? "🎉 Event Start Day!"
                        : end
                        ? "🏁 Event End Day!"
                        : inRange
                        ? "Multi-day Event"
                        : undefined
                    }
                    className={baseClasses}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
