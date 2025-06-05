import { useState, useEffect } from "react";
import EventPreviewCard from "./EventPreviewCard";

type Event = {
  externalId: string;
  name: string;
  category: string;
  placeFreeform: string;
  datetimeFrom: string;
  budgetMax: number;
  teaserMedia: string;
};

export default function EventSection() {
  const [events, setEvents] = useState<Event[]>([]);

  const api = import.meta.env.VITE_API; // your API like /api/events

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(api);
        if (!response.ok) {
          console.error("Failed to fetch events");
          return;
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents(); // 🚀 Fetch when EventSection mounts
  }, []);

  // Sort events by date (soonest first)
  const sortedEvents = [...events]
    .filter((event) => new Date(event.datetimeFrom) >= new Date()) // only future events
    .sort((a, b) => new Date(a.datetimeFrom).getTime() - new Date(b.datetimeFrom).getTime());

  const displayEvents = sortedEvents.slice(0, 9);
  const missing = 9 - displayEvents.length;

  return (
    <div className="flex flex-col gap-5">
      {displayEvents.map((event) => {
        const formattedDate = new Date(event.datetimeFrom).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <EventPreviewCard
            key={event.externalId}
            name={event.name}
            category={event.category}
            location={event.placeFreeform}
            date={formattedDate}
            price={event.budgetMax}
            image={event.teaserMedia || "https://via.placeholder.com/400x300?text=No+Image"}
            link={`/event/${event.externalId}`}
          />
        );
      })}
      {/* If less than 9 events, fill the rest */}
      {Array.from({ length: missing }).map((_, i) => (
        <div
          key={`placeholder-${i}`}
          className="rounded-xl h-24 bg-white border border-dashed border-blue-200 flex items-center justify-center text-gray-300"
        >
          Upcoming event
        </div>
      ))}
    </div>
  );
}
