import { useContext } from "react";
import EventContext from "../context/EventContext";
import EventPreviewCard from "./EventPreviewCard";

// type Event = {
//   id: string | number;
//   name: string;
//   category: string;
//   location: string;
//   date: string;
//   price: number;
//   image: string;
// };

// type EventSectionProps = {
//   filters?: {
//     search?: string;
//     category?: string;
//     location?: string;
//     price?: string;
//   };
//   events?: Event[];
// };

export default function EventSection() {
  const { events } = useContext(EventContext);
  console.log(events);

  // Prepare for real server events: always render 9 boxes
  // const displayEvents = events.slice(0, 9);
  // const missing = 9 - displayEvents.length;

  return (
    <div className="flex flex-col gap-5">
      {events.map((event) => (
        <EventPreviewCard
          name={event.name}
          category={event.category}
          categoryFreeform={event.categoryFreeform}
          location={event.placeFreeform}
          date={event.datetimeFrom}
          price={event.budgetMax}
          image={event.teaserMedia}
          link={event.originUrl}
        />
      ))}
    </div>
  );
}
