import Hero from "../components/Hero";
import EventSection from "../components/EventSection";
import EventFilters from "../components/EventFilters";
import UpcomingEventsCarousel from "../components/UpcomingEventsCarousel";
import { useState, useEffect } from "react";
import type { FullEventType } from "../types";

export default function Home() {
  const [displayHero, setDisplayHero] = useState(true);
  const [carouselEvents, setCarouselEvents] = useState<FullEventType[]>([]);

  function setEvents(data: unknown) {
    if (Array.isArray(data)) {
      setCarouselEvents(data as FullEventType[]);
    } else {
      setCarouselEvents([]);
    }
  }

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const api = import.meta.env.VITE_API;
        const today = new Date().toISOString();
        // Only fetch events from today onwards
        const res = await fetch(
          `${api}/events?country=Japan&limit=30&sort=datetimeFrom&datetimeFrom=${encodeURIComponent(today)}`
        );
        const data = await res.json();
        setEvents(data);
      } catch {
        setEvents([]);
      }
    }
    fetchUpcomingEvents();
  }, []);

  return (
    <>
      {displayHero && <Hero />}
      {displayHero && (
        <div className="w-full" style={{ maxWidth: "100vw", marginBottom: 24 }}>
          <UpcomingEventsCarousel events={carouselEvents} />
        </div>
      )}
      <div className="w-full flex flex-col items-center px-2 py-8">
        <div className="w-full max-w-3xl mb-6">
          <EventFilters setDisplayHero={setDisplayHero} />
        </div>
        <div className="w-full max-w-3xl">
          <EventSection />
        </div>
      </div>
    </>
  );
}


