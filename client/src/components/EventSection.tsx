import EventPreviewCard from "./EventPreviewCard";

type Event = {
  id: string | number;
  name: string;
  category: string;
  location: string;
  date: string;
  price: number;
  image: string;
};

type EventSectionProps = {
  filters?: { search?: string; category?: string; location?: string; price?: string };
  events?: Event[];
};

export default function EventSection({ filters, events = [] }: EventSectionProps) {
  // Prepare for real server events: always render 9 boxes
  const displayEvents = events.slice(0, 9);
  const missing = 9 - displayEvents.length;

  return (
    <div className="flex flex-col gap-5">
      {displayEvents.map((event) => (
        <EventPreviewCard
          key={event.id}
          name={event.name}
          category={event.category}
          location={event.location}
          date={event.date}
          price={event.price}
          image={event.image}
          link={`/event/${event.id}`}
        />
      ))}
      {/* Fill remaining slots with placeholders */}
      {Array.from({ length: missing }).map((_, i) => (
        <div
          key={`placeholder-${i}`}
          className="rounded-xl h-24 bg-white border border-dashed border-blue-200 flex items-center justify-center text-gray-300"
        >
          Upcoming event
        </div>
      ))}
    </div>
  );
}

