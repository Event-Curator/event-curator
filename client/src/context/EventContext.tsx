import { createContext } from "react";
import type { FullEventType } from "../types";

const EventContext = createContext<{
  events: FullEventType[];
  setEvents: React.Dispatch<React.SetStateAction<FullEventType[]>>;
  likedEvents: FullEventType[]; 
  setLikedEvents: React.Dispatch<React.SetStateAction<FullEventType[]>>; 
  isSharedTimeline: boolean;
  setIsSharedTimeline: React.Dispatch<React.SetStateAction<boolean>>;
  sharedTimelineId: string | null;
  setSharedTimelineId: React.Dispatch<React.SetStateAction<string>>;
}>({
  events: [],
  setEvents: () => {},
  likedEvents: [],          
  setLikedEvents: () => {},  
  isSharedTimeline: false,
  setIsSharedTimeline: () => {},
  sharedTimelineId: '',
  setSharedTimelineId: () => {}
});

export default EventContext;
