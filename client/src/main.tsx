import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import EventTimeline from "./pages/EventTimeline";
import { EventProvider } from "./context/EventContext"; // Import EventProvider

createRoot(document.getElementById("root")!).render(
  <EventProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="event">
            <Route path=":id" element={<EventDetails />} />
          </Route>
          <Route path="timeline" element={<EventTimeline />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  </EventProvider>
);
