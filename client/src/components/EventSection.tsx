import EventPreviewCard from "./EventPreviewCard";

export default function EventSection() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 mb-12">
      <div className="w-full max-w-4xl min-h-[200px] bg-base-100 rounded-2xl shadow-lg flex flex-col items-center justify-center border border-dashed border-primary/50">
        {/* Placeholder for future event cards */}
        <EventPreviewCard
          name="Test"
          location="Tokyo"
          date="2025/10/20"
          link="#"
        />
        <span className="text-lg text-primary font-medium opacity-60 p-12">
          Events will appear here soon!
        </span>
      </div>
    </div>
  );
}
