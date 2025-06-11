import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import EventTimeline from "./pages/EventTimeline";
import Profile from "./pages/ProfileSettings";
import EventContext from "./context/EventContext";
import type { FullEventType } from "./types";

export default function App() {
  const [events, setEvents] = useState<FullEventType[]>([]);
  const [likedEvents, setLikedEvents] = useState<FullEventType[]>([]); 

  return (
    <EventContext.Provider value={{ events, setEvents, likedEvents, setLikedEvents }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="event">
              <Route path=":id" element={<EventDetails />} />
            </Route>
            <Route path="timeline" element={<EventTimeline />} />
            <Route path="/profile" element={<Profile />} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </EventContext.Provider>
  );
}
