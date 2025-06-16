import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router";
import type { FullEventType } from "../types";
import getDaysInMonth from "../utils/getDaysInMonth";
import Loading from "../components/Loading";
import EventContext from "../context/EventContext";
import { auth } from "../firebase";
import EventInfo from "../components/EventInfo";
import EventActions from "../components/EventActions";
import EventDescriptionBox from "../components/EventDescriptionBox";
import EventLocationMap from "../components/EventLocationMap";
import EventCalendar from "../components/EventCalendar";
import { categoryImages } from "../assets/categoryImages";
import { FaHome } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

const server = import.meta.env.VITE_API;

import React from "react";
export default function EventDetails(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, likedEvents, setLikedEvents } = useContext(EventContext);
  const [event, setEvent] = useState<FullEventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState<number | null>(null);
  const [calendarYear, setCalendarYear] = useState<number | null>(null);

  // OSM address state
  const [osmAddress, setOsmAddress] = useState<string | null>(null);

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

  // Fetch OSM address
  useEffect(() => {
    let ignore = false;
    const lat =
      event?.placeLattitude && !isNaN(event.placeLattitude) ? event.placeLattitude : null;
    const lng =
      event?.placeLongitude && !isNaN(event.placeLongitude) ? event.placeLongitude : null;
    if (!lat || !lng) {
      setOsmAddress(null);
      return;
    }
    async function fetchAddress() {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        if (!res.ok) throw new Error("Failed to fetch address");
        const data = await res.json();
        if (!ignore) setOsmAddress(data.display_name || null);
      } catch {
        if (!ignore) setOsmAddress(null);
      }
    }
    fetchAddress();
    return () => {
      ignore = true;
    };
  }, [event?.placeLattitude, event?.placeLongitude]);

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
          created_at: event.datetimeFrom
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
      console.log(event);
      await fetch(`${api}/events/users/timeline`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          user_uid: user.uid,
          event_id: event.externalId,
          created_at: null                      // null means for the backend to remove all entries for this event/user
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

  // Find previous and next event IDs from the events context (sorted by datetimeFrom)
  let prevEventId: string | null = null;
  let nextEventId: string | null = null;
  if (Array.isArray(events) && events.length > 0) {
    const sorted = [...events].sort(
      (a, b) => new Date(a.datetimeFrom).getTime() - new Date(b.datetimeFrom).getTime()
    );
    const idx = sorted.findIndex(e => e.externalId === event.externalId);
    if (idx > 0) prevEventId = sorted[idx - 1].externalId;
    if (idx !== -1 && idx < sorted.length - 1) nextEventId = sorted[idx + 1].externalId;
  }

  const startDate = event.datetimeFrom ? new Date(event.datetimeFrom) : null;
  const endDate = event.datetimeTo ? new Date(event.datetimeTo) : null;

  // Calendar month/year state fallback
  const currentMonth = calendarMonth !== null ? calendarMonth : (startDate ? startDate.getMonth() : new Date().getMonth());
  const currentYear = calendarYear !== null ? calendarYear : (startDate ? startDate.getFullYear() : new Date().getFullYear());

  const calendarDays = getDaysInMonth(new Date(currentYear, currentMonth));
  // For multi-month events, highlight days in blue
  function isDayInEventRange(day: number) {
    if (!startDate || !endDate) return false;
    const thisDay = new Date(currentYear, currentMonth, day);
    return thisDay >= startDate && thisDay <= endDate;
  }

  function isStartDay(day: number) {
    return !!(startDate && startDate.getFullYear() === currentYear && startDate.getMonth() === currentMonth && startDate.getDate() === day);
  }
  function isEndDay(day: number) {
    return !!(endDate && endDate.getFullYear() === currentYear && endDate.getMonth() === currentMonth && endDate.getDate() === day);
  }

  const monthYear =
    new Date(currentYear, currentMonth).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    });

  // Use categoryImages for fallback
  const category = event.category || "Other";
  const categoryFreeform = event.categoryFreeform;
  const displayCategory = category === "Other" && categoryFreeform ? categoryFreeform : category;
  const fallbackImage = categoryImages[category];
  const imageSrc =
    event.teaserMedia && event.teaserMedia.trim() !== ""
      ? (server + "/.." + event.teaserMedia)
      : fallbackImage;

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

  // SVG icons
  const BackIcon = () => (
    <button
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-100 transition"
      onClick={() => prevEventId && navigate(`/event/${prevEventId}`)}
      aria-label="Previous event"
      style={{ visibility: prevEventId ? "visible" : "hidden" }}
    >
      <svg width={28} height={28} fill="none" stroke="#2761da" strokeWidth={2.5} viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
  const ForwardIcon = () => (
    <button
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-100 transition"
      onClick={() => nextEventId && navigate(`/event/${nextEventId}`)}
      aria-label="Next event"
      style={{ visibility: nextEventId ? "visible" : "hidden" }}
    >
      <svg width={28} height={28} fill="none" stroke="#2761da" strokeWidth={2.5} viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  // Breadcrumbs logic
  // Show Home > Category (with icons)
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="mb-2 flex items-center space-x-2 text-gray-500 text-sm">
        <Link to="/" className="flex items-center hover:text-blue-700">
          <FaHome className="mr-1" />
          Home
        </Link>
        <span>/</span>
        <span className="flex items-center">
          <MdCategory className="mr-1" />
          {displayCategory}
        </span>
      </nav>
      <div className="relative mb-6">
        <img
          src={imageSrc}
          alt={event.name}
          className="w-full h-80 object-cover rounded-xl shadow"
          draggable={false}
        />
      </div>
      {/* Navigation icons row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          {prevEventId && <BackIcon />}
        </div>
        <div />
        <div>
          {nextEventId && <ForwardIcon />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
        <section>
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            {event.name || "-"}
          </h1>
          <EventInfo event={event} />
          <EventActions
            isAdded={isAdded}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            originUrl={event.originUrl}
          />
          <EventDescriptionBox event={event} osmAddress={osmAddress} />
        </section>
        <aside className="space-y-6">
          <EventLocationMap lat={lat} lng={lng} mapSrc={mapSrc} />
          <EventCalendar
            monthYear={monthYear}
            calendarDays={calendarDays}
            isStartDay={isStartDay}
            isEndDay={isEndDay}
            isDayInEventRange={isDayInEventRange}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </aside>
      </div>
    </main>
  );
}