import { useState, useContext, useEffect } from "react";
import EventContext from "../context/EventContext";
import type { FullEventType } from "../types";
import { auth } from "../firebase";
import { useIsMobile } from "../utils/useIsMobile";
import { getMonday, getWeekDates } from "../utils/eventUtils";
import TableView from "../components/TableView";
import WeekCalendarView from "../components/WeekCalendarView";
import { useNavigate } from "react-router";



// ShareTimelineButton for timeline (not per event)
function ShareTimelineButton({ timelineId }: { timelineId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/timeline/${timelineId}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm rounded-md"
        title="Share timeline"
        onClick={e => {
          e.stopPropagation();
          setOpen(true);
        }}
        style={{ lineHeight: 0 }}
      >
        Share
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div
            className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 min-w-[260px] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
                setCopied(false);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <button
              className="bg-blue-50 rounded-full p-2 hover:bg-blue-100"
              onClick={handleCopy}
              title="Copy link"
              style={{ lineHeight: 0 }}
            >
              <svg
                width={32}
                height={32}
                fill="none"
                stroke="#2761da"
                strokeWidth={2}
                viewBox="0 0 24 24"
                style={{
                  display: "block",
                  border: "2px solid white",
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  background: "transparent"
                }}
              >
                <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                <path d="M16 6l-4-4-4 4" />
                <path d="M12 2v14" />
              </svg>
            </button>
            <div>
              <div className="font-bold text-blue-700 mb-1">Share your timeline</div>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleCopy}
                style={{ minWidth: 100 }}
              >
                Copy link
              </button>
              {copied && (
                <div className="text-green-600 text-xs mt-2">Link copied!</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function EventTimeline() {
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const { likedEvents, setLikedEvents, setEvents } = useContext(EventContext);
  const [user, setUser] = useState(() => auth.currentUser);
  const navigate = useNavigate();

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

  //Real anonymous ID?
  const timelineId = user?.uid || "demo";

  // Ensure back/forward navigation works from timeline
  const handleRowClick = (eventId: string) => {
    setEvents(sortedEvents); // Set context events to timeline events
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen w-full bg-blue-50">
      <main className="w-full px-0 py-10 min-h-[80vh]">
        {/* Page Header */}
        <div className="flex flex-col items-center mb-6 gap-3 max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 text-center">
            My Event Timeline
          </h1>
          {/* Buttons: Only Share on mobile, all on desktop */}
          <div className="flex gap-2 items-center">
            {isMobile ? (
              <ShareTimelineButton timelineId={timelineId} />
            ) : (
              <>
                <button
                  className={`btn btn-outline btn-sm rounded-md ${viewMode === "table" ? "btn-active btn-primary" : ""}`}
                  onClick={() => setViewMode("table")}
                >
                  Table View
                </button>
                <button
                  className={`btn btn-outline btn-sm rounded-md ${viewMode === "calendar" ? "btn-active btn-primary" : ""}`}
                  onClick={() => setViewMode("calendar")}
                >
                  Week View
                </button>
                <ShareTimelineButton timelineId={timelineId} />
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        {isMobile ? (
          <TableView
            events={sortedEvents}
            isMobile={isMobile}
            handleRemove={handleRemove}
            onRowClick={handleRowClick}
          />
        ) : (
          <>
            {viewMode === "table" ? (
              <TableView
                events={sortedEvents}
                isMobile={isMobile}
                handleRemove={handleRemove}
                onRowClick={handleRowClick}
              />
            ) : (
              <WeekCalendarView
                weekDates={weekDates}
                eventsByDay={eventsByDay}
                weekRangeStr={weekRangeStr}
                isMobile={isMobile}
                setWeekOffset={setWeekOffset}
                handleRemove={handleRemove}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}