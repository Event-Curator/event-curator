import type { FullEventType } from "../types";
import EventPreviewCard from "./EventPreviewCard";
import moment from "moment";

interface EventDateGroupCardProps {
  date: string;
  events: FullEventType[];
}

export default function EventDateGroupCard({
  date,
  events,
}: EventDateGroupCardProps) {
  return (
    <>
      <h2 className="text-2xl font-bold underline">{date}</h2>
      {events.map((event) => (
        // const fmtDate = moment(event.datetimeFrom).format("LL");
        <EventPreviewCard
          name={event.name}
          category={event.category}
          categoryFreeform={event.categoryFreeform}
          location={event.placeFreeform}
          date={moment(event.datetimeFrom).format("LL")}
          price={event.budgetMax}
          link={event.originUrl}
        />
      ))}
    </>
  );
}
