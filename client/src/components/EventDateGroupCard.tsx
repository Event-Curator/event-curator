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
      <h2 className="text-3xl font-bold no-underline">{date}</h2>
      {events.map((event) => (
        <EventPreviewCard
          key={event.externalId}
          id={event.externalId}
          name={event.name}
          category={event.category}
          categoryFreeform={event.categoryFreeform}
          location={event.placeFreeform}
          dateFrom={moment(event.datetimeFrom)
            .subtract(9, "hours")
            .format("LL")}
          dateTo={moment(event.datetimeTo).subtract(9, "hours").format("LL")}
          price={event.budgetMax}
          link={event.originUrl}
          imageUrl={event.teaserMedia}
        />
      ))}
    </>
  );
}
