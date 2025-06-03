import { useParams, useNavigate } from "react-router";


interface Event {
  id: string | number;
  name: string;
  image: string;
  category: string;
  location: string;
  date: string;
  price?: number;
  description: string;
}

export default function EventDetails({ event }: { event?: Event }) {
  const { id } = useParams();
  const navigate = useNavigate();

  function getPriceLabel(price?: number) {
    if (price === 0) return <span className="text-green-600 font-semibold">Free Entry</span>;
    if (!price) return null;
    return (
      <>
        <span className="text-gray-600">¥</span>
        {price.toLocaleString()}
      </>
    );
  }


  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Event not found</h1>
        <p>Sorry, we couldn’t find that event.</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full shadow bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={() => navigate("/")}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 min-h-[70vh]">
        {/* Left: Main Event Content */}
        <section>
          {/* Image */}
          <div className="mb-6">
            <img
              src={event.image}
              alt={event.name}
              className="rounded-xl w-full object-cover h-60 md:h-80 shadow"
              draggable={false}
            />
          </div>
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{event.name}</h1>
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mb-5 text-gray-700 text-base">
            <span>
              <b>Category:</b> {event.category}
            </span>
            <span>
              <b>Location:</b> {event.location}
            </span>
            <span>
              <b>Date:</b> {event.date}
            </span>
            <span>
              <b>Price:</b> {getPriceLabel(event.price)}
            </span>
          </div>
          {/* Share / Favorite */}
          <div className="flex gap-3 mb-7">
            <button className="btn btn-outline btn-sm rounded-full gap-2">
              <span className="material-symbols-outlined">share</span> Share
            </button>
            <button className="btn btn-outline btn-sm rounded-full gap-2">
              <span className="material-symbols-outlined">favorite</span> Add to Favorites
            </button>
          </div>
          {/* Description */}
          <div className="prose max-w-none bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-bold text-blue-700 mb-2">Event Description</h2>
            <p>{event.description}</p>
          </div>
        </section>

        {/* Right: Info + Calendar */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-bold text-blue-700 mb-3 text-lg">Information</h2>
            <ul className="text-sm space-y-1">
              <li>
                <span className="font-medium">Place:</span> {event.location}
              </li>
              <li>
                <span className="font-medium">Date:</span> {event.date}
              </li>
              <li>
                <span className="font-medium">Price:</span> {getPriceLabel(event.price)}
              </li>
              <li>
                <span className="font-medium">Access:</span> (Map coming soon)
              </li>
            </ul>
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded p-3 text-blue-500 flex items-center justify-center text-xs h-24">
              [Map integration coming soon]
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-blue-700 mb-2">Calendar of Events</h3>
            <div className="flex flex-col items-center">
              <div className="text-gray-400 italic text-xs mb-2">[Calendar integration coming soon]</div>
              {/* Simple calendar grid placeholder */}
              <div className="grid grid-cols-7 gap-1 w-full text-center text-xs">
                {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                  <div key={day} className="font-bold text-gray-500">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className="rounded bg-blue-50 border border-blue-100 py-1">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}