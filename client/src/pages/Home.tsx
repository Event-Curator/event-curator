import Hero from "../components/Hero";
import EventSection from "../components/EventSection";
import EventFilters from "../components/EventFilters";
import UpcomingEventsCarousel from "../components/UpcomingEventsCarousel";
import { useState } from "react";

export default function Home() {
  const [displayHero, setDisplayHero] = useState(true);

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