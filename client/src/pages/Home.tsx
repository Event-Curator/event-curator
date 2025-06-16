import Hero from "../components/Hero";
import EventSection from "../components/EventSection";
import EventFilters from "../components/EventFilters";
import UpcomingEventsCarousel from "../components/UpcomingEventsCarousel";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import type { FullEventType } from "../types";

export default function Home() {
  const [displayHero, setDisplayHero] = useState(true);
  const [carouselEvents, setCarouselEvents] = useState<FullEventType[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Always fetch 30 most upcoming events in Japan (used ONLY for carousel)
  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const api = import.meta.env.VITE_API;
        // Change the endpoint as needed to always return the 30 soonest events in Japan
        const res = await fetch(`${api}/events?country=Japan&limit=30&sort=datetimeFrom`);
        const data = await res.json();
        setCarouselEvents(data);
      } catch {
        setCarouselEvents([]);
      }
    }
    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    if (location.state && typeof location.state === "object" && "hideHero" in location.state) {
      setDisplayHero(false);
      // Remove state so it doesn't persist on next navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
