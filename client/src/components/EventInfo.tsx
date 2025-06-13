import FormattedPrice from "../components/FormattedPrice";
import type { FullEventType } from "../types";

export default function EventInfo({
  event,
}: {
  event: FullEventType;
}) {
  const startDate = event.datetimeFrom ? new Date(event.datetimeFrom) : null;
  const endDate = event.datetimeTo ? new Date(event.datetimeTo) : null;

  return (
    <div className="space-y-2 text-gray-700 text-sm mb-6">
      <p>
        <b>Category:</b> {event.category || "-"}
      </p>
      <p>
        <b>Location:</b> {event.placeFreeform || "-"}
      </p>
      <p>
        <b>Date:&nbsp;</b>
        {startDate ? startDate.toLocaleDateString() : "-"} —{" "}
        {endDate ? endDate.toLocaleDateString() : "-"}
      </p>
      <p>
        <b>Time:&nbsp;</b>
        {startDate
          ? startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "-"}
        {" — "}
        {endDate
          ? endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "-"}
      </p>
      <p>
        <b>Price:</b> <FormattedPrice price={event.budgetMin} />
        {event.budgetMax > 0 && (
          <span> — {<FormattedPrice price={event.budgetMax} />}</span>
        )}
      </p>
      {event.organizer && (
        <p>
          <b>Organizer:</b> {event.organizer}
        </p>
      )}
      {event.website && (
        <p>
          <b>Website:</b>{" "}
          <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
            {event.website}
          </a>
        </p>
      )}
    </div>
  );
}