import { createContext } from "react";
import type { FullEventType } from "../types";

const EventContext = createContext<{
  events: FullEventType[];
  setEvents: React.Dispatch<React.SetStateAction<FullEventType[]>>;
}>({
  events: [],
  setEvents: () => {},
});

export default EventContext;
