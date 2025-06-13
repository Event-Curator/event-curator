//import { useLocation } from "react-router";
import EventSection from "../components/EventSection";
import EventFilters from "../components/EventFilters";

export default function SearchResults() {
  //const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Search and filter box at the top */}
      <div className="mb-8">
        <EventFilters />
      </div>
      <h2 className="text-2xl font-bold mb-6">Search Results for "{query}"</h2>
      <EventSection searchQuery={query} />
    </main>
  );
}