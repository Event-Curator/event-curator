import { useContext } from "react";
import moment from "moment";
import EventContext from "../context/EventContext";
import getUniqueDates from "../utils/getUniqueDates";
import EventDateGroupCard from "./EventDateGroupCard";
import type { EventsByDateGroup } from "../types";

export default function EventSection() {
  const { events } = useContext(EventContext);
  const uniqueDates = getUniqueDates(events);

  const eventGroups: EventsByDateGroup[] = uniqueDates.map((date) => {
    const group: EventsByDateGroup = {
      date: date,
      events: [],
    };
    for (const event of events) {
      const fmtDate = moment(event.datetimeFrom).format("LL");
      if (fmtDate === group.date) {
        group.events.push(event);
      }
    }
    return group;
  });

  return (
    <div className="flex flex-col gap-5">
      {eventGroups.map((eventGrp) => (
        <EventDateGroupCard
          key={eventGrp.date}
          date={eventGrp.date}
          events={eventGrp.events}
        />
      ))}
    </div>
  );
}
