import Hero from "../components/Hero";
import EventSection from "../components/EventSection";
import EventFilters from "../components/EventFilters";
import { useState } from "react";

export default function Home() {
  const [displayHero, setDisplayHero] = useState(true);

  return (
    <>
      {displayHero && <Hero />}
      <div className="w-full flex flex-col items-center px-2 py-8">
        <div className="w-full max-w-3xl mb-6">
          <EventFilters setDisplayHero={setDisplayHero} />
        </div>
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Events</h2>
          <EventSection />
        </div>
      </div>
    </>
  );
}
