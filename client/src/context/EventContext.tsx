import { createContext } from "react";
import type { FullEventType } from "../types";

const EventContext = createContext<{
  events: FullEventType[];
  setEvents: React.Dispatch<React.SetStateAction<FullEventType[]>>;
  likedEvents: FullEventType[]; 
  setLikedEvents: React.Dispatch<React.SetStateAction<FullEventType[]>>; 
  isSharedTimeline: boolean;
  setIsSharedTimeline: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  events: [],
  setEvents: () => {},
  likedEvents: [],          
  setLikedEvents: () => {},  
  isSharedTimeline: false,
  setIsSharedTimeline: () => {}
});

export default EventContext;
