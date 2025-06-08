import { createContext } from "react";
import type { FullEventType } from "../types";

const EventContext = createContext<{
  events: FullEventType[];
  setEvents: React.Dispatch<React.SetStateAction<FullEventType[]>>;
  likedEvents: FullEventType[]; // <-- Added
  setLikedEvents: React.Dispatch<React.SetStateAction<FullEventType[]>>; // <-- Added
}>({
  events: [],
  setEvents: () => {},
  likedEvents: [],          // <-- Default empty array
  setLikedEvents: () => {},  // <-- Empty setter
});

export default EventContext;
