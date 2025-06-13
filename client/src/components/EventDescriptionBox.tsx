import type { FullEventType } from "../types";

export default function EventDescriptionBox({
  event,
  osmAddress,
}: {
  event: FullEventType;
  osmAddress: string | null;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow prose max-w-none mb-6">
      <h2 className="text-blue-700 font-bold mb-2">Event Description</h2>
      <p>{event.description || "No description available."}</p>
      {event.details && (
        <p>
          <b>Details:</b> {event.details}
        </p>
      )}
      {event.notes && (
        <p>
          <b>Notes:</b> {event.notes}
        </p>
      )}
      <div className="mt-4 bg-white p-4 rounded-xl shadow">
        <h3 className="text-blue-700 font-bold mb-2">Event Address</h3>
        <p className="text-gray-700 text-sm">
          {osmAddress
            ? osmAddress
            : event.placeFreeform
            ? event.placeFreeform
            : "Address not available."}
        </p>
      </div>
    </div>
  );
}