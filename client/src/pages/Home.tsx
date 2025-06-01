import Hero from "../components/Hero";
import EventSection from "../components/EventSection";
import EventFilters from "../components/EventFilters";
import Top10Events from "../components/Top10Events";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        {/* Left: Upcoming Events */}
        <section>
          <EventSection />
        </section>
        {/* Right: Sidebar */}
        <aside className="space-y-8">
          <EventFilters />
          <Top10Events />
        </aside>
      </div>
    </>
  );
}
