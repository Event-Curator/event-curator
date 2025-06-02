import { useParams, useNavigate } from "react-router";

const dummyData = [
  {
    id: 1,
    name: "Beer Night",
    category: "Food & Drink",
    location: "Shibuya",
    date: "2025/5/27",
    price: 0,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description:
      "Join Tokyo’s beer lovers in Shibuya for a fun evening with a selection of local brews and music. Whether you’re a beer enthusiast or just want to chill after work, Beer Night is for you! Free entry for all.",
  },
  {
    id: 2,
    name: "Karaoke Death Match",
    category: "Performing & Visual Arts",
    location: "Shinjuku",
    date: "2025/5/28",
    price: 2000,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    description:
      "Take the stage and battle it out in Shinjuku’s wildest karaoke competition! Cash prizes and drinks for participants. Spectators welcome for a night of high-energy performances.",
  },
  {
    id: 3,
    name: "Bowling",
    category: "Sports & Fitness",
    location: "Yokohama",
    date: "2025/5/29",
    price: 1200,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description:
      "Strike up some fun at Yokohama’s favorite bowling alley! Enjoy friendly matches, pizza, and community spirit. Open to all ages and skill levels.",
  },
  {
    id: 4,
    name: "Tokyo Jazz Fest",
    category: "Music",
    location: "Minato",
    date: "2025/6/2",
    price: 3500,
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=400&q=80",
    description:
      "Tokyo’s annual Jazz Fest brings together top musicians from Japan and abroad. Experience live performances, workshops, and the magic of jazz under the city lights.",
  },
  {
    id: 5,
    name: "Anime Expo Pop-Up",
    category: "Film, Media & Entertainment",
    location: "Akihabara",
    date: "2025/6/10",
    price: 1500,
    image: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=80",
    description:
      "Cosplay, merch, and exclusive anime screenings—don’t miss Akihabara’s pop-up expo for otaku and newcomers alike. Prizes for best cosplay!",
  },
  {
    id: 6,
    name: "Sakura Picnic",
    category: "Community & Culture",
    location: "Ueno Park",
    date: "2025/6/14",
    price: 0,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description:
      "Celebrate the beauty of sakura in Ueno Park. Bring your own picnic and enjoy live performances, games, and hanami traditions with friends and family.",
  },
  {
    id: 7,
    name: "Startup Pitch Night",
    category: "Business & Professional",
    location: "Roppongi",
    date: "2025/6/16",
    price: 500,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    description:
      "See the next generation of entrepreneurs pitch their startups in Roppongi. Network with investors and discover innovative new ideas.",
  },
  {
    id: 8,
    name: "Vegan Food Festival",
    category: "Food & Drink",
    location: "Kichijoji",
    date: "2025/6/20",
    price: 800,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    description:
      "Taste the best of plant-based cuisine at Kichijoji’s Vegan Food Festival. Food stalls, workshops, and family-friendly activities all day!",
  },
];

function getPriceLabel(price: number) {
  if (price === 0) return <span className="text-green-600 font-semibold">Free Entry</span>;
  return (
    <>
      <span className="text-gray-600">¥</span>
      {price.toLocaleString()}
    </>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = dummyData.find((ev) => String(ev.id) === String(id));

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
