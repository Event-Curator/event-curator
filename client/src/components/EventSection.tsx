import EventPreviewCard from "./EventPreviewCard";


const dummyData = [
  {
    id: 1,
    name: "Beer Night",
    category: "Food & Drink",
    location: "Shibuya",
    date: "2025/5/27",
    price: 0,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Karaoke Death Match",
    category: "Performing & Visual Arts",
    location: "Shinjuku",
    date: "2025/5/28",
    price: 2000,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Bowling",
    category: "Sports & Fitness",
    location: "Yokohama",
    date: "2025/5/29",
    price: 1200,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Tokyo Jazz Fest",
    category: "Music",
    location: "Minato",
    date: "2025/6/2",
    price: 3500,
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    name: "Anime Expo Pop-Up",
    category: "Film, Media & Entertainment",
    location: "Akihabara",
    date: "2025/6/10",
    price: 1500,
    image: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    name: "Sakura Picnic",
    category: "Community & Culture",
    location: "Ueno Park",
    date: "2025/6/14",
    price: 0,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 7,
    name: "Startup Pitch Night",
    category: "Business & Professional",
    location: "Roppongi",
    date: "2025/6/16",
    price: 500,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 8,
    name: "Vegan Food Festival",
    category: "Food & Drink",
    location: "Kichijoji",
    date: "2025/6/20",
    price: 800,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
];

//const dummyData = [/* ... */];

export default function EventSection() {
  return (
    <div className="flex flex-col gap-5">
      {dummyData.map((event) => (
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
    </div>
  );
}
