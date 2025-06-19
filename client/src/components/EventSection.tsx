import { useContext } from "react";
import moment from "moment";
import EventContext from "../context/EventContext";
import getUniqueDates from "../utils/getUniqueDates";
import EventDateGroupCard from "./EventDateGroupCard";
import type { EventsByDateGroup, FullEventType } from "../types";

type Props = {
  searchQuery?: string;
};

export default function EventSection({ searchQuery }: Props) {
  const { events } = useContext(EventContext);

  // Filter events if searchQuery is present
  // TODO: Delete this? I don't see the point of this.
  const filteredEvents = searchQuery
    ? events.filter(
        (event: FullEventType) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description &&
            event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : events;

  const uniqueDates = getUniqueDates(filteredEvents);

  const eventGroups: EventsByDateGroup[] = uniqueDates.map((date) => {
    const group: EventsByDateGroup = {
      date: date,
      events: [],
    };
    for (const event of filteredEvents) {
      const fmtDate = moment(event.datetimeFrom)
        .subtract(9, "hours")
        .format("LL");
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
