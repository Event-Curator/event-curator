import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

import Footer from "./components/Footer";
import EventSection from "./components/EventSection";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <Hero />
      <EventSection />
      <Footer />
    </div>
  );
}
