const topEvents = [
  {
    id: 1,
    name: "Beer Night",
    category: "Food & Drink",
    location: "Shibuya",
    date: "2025/5/27",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Karaoke Death Match",
    category: "Performing & Visual Arts",
    location: "Shinjuku",
    date: "2025/5/28",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Bowling",
    category: "Sports & Fitness",
    location: "Yokohama",
    date: "2025/5/29",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Tokyo Jazz Fest",
    category: "Music",
    location: "Minato",
    date: "2025/6/2",
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 5,
    name: "Anime Expo Pop-Up",
    category: "Film, Media & Entertainment",
    location: "Akihabara",
    date: "2025/6/10",
    image: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 6,
    name: "Sakura Picnic",
    category: "Community & Culture",
    location: "Ueno Park",
    date: "2025/6/14",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 7,
    name: "Startup Pitch Night",
    category: "Business & Professional",
    location: "Roppongi",
    date: "2025/6/16",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 8,
    name: "Vegan Food Festival",
    category: "Food & Drink",
    location: "Kichijoji",
    date: "2025/6/20",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 9,
    name: "Harajuku Art Fair",
    category: "Performing & Visual Arts",
    location: "Harajuku",
    date: "2025/6/22",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a46a2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 10,
    name: "Tsukiji Food Walk",
    category: "Food & Drink",
    location: "Tsukiji",
    date: "2025/6/24",
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80",
  },
];


export default function Top10Events() {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-bold mb-3 text-blue-700">Top 10 Events in Tokyo</h3>
      <div className="flex gap-3 mb-4">
        <button className="btn btn-xs btn-primary">Popular</button>
        <button className="btn btn-xs btn-ghost text-blue-700">Latest</button>
        <button className="btn btn-xs btn-ghost text-blue-700">Recommended</button>
      </div>
      <ol className="list-decimal ml-5 space-y-3">
        {topEvents.map((event) => (
          <li key={event.id} className="flex items-center gap-3">
            <img
              src={event.image}
              alt={event.name}
              className="w-12 h-12 rounded object-cover border border-blue-100"
            />
            <div>
              <div className="font-medium">{event.name}</div>
              <div className="text-xs text-gray-500">{event.location}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
