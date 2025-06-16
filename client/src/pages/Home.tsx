import Hero from "../components/Hero";
import EventSection from "../components/EventSection";
import EventFilters from "../components/EventFilters";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import UpcomingEventsCarousel from "../components/UpcomingEventsCarousel";

export default function Home() {
  const [displayHero, setDisplayHero] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
          <UpcomingEventsCarousel />
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