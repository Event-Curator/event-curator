import EventPreviewCard from "./EventPreviewCard";

const dummyData = [
  {
    id: 1,
    name: "Beer Night",
    location: "Tokyo",
    date: "2025/5/27",
    link: 1,
  },
  {
    id: 2,
    name: "Karaoke Death Match",
    location: "Tokyo",
    date: "2025/5/28",
    link: 2,
  },
  {
    id: 3,
    name: "Bowling",
    location: "Yokohama",
    date: "2025/5/29",
    link: 3,
  },
];

export default function EventSection() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 mb-12">
      <div className="w-full max-w-4xl min-h-[200px] bg-base-100 rounded-2xl shadow-lg flex flex-row gap-2 p-4 items-center justify-center border border-dashed border-primary/50">
        {dummyData.map((event) => (
          <EventPreviewCard
            key={event.id}
            name={event.name}
            location={event.location}
            date={event.date}
            link={"./event/" + event.link}
          />
        ))}
      </div>
    </div>
  );
}
