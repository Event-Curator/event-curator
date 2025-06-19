import FormattedPrice from "../components/FormattedPrice";
import type { FullEventType } from "../types";
import fixTimeOffset from "../utils/fixTimeOffSet";

export default function EventInfo({ event }: { event: FullEventType }) {
  const { startDate, endDate, startTime, endTime } = fixTimeOffset(event);

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
        {startDate !== endDate ? `${startDate} — ${endDate}` : startDate}
      </p>
      <p>
        <b>Time:&nbsp;</b>
        {`${startTime} — ${endTime}`}
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
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline"
          >
            {event.website}
          </a>
        </p>
      )}
    </div>
  );
}
