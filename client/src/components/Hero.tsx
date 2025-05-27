import heroImg from "../assets/Matsuri.jpg";

export default function Hero() {
  return (
    <div
      className="relative flex items-center justify-center h-[40vh] md:h-[50vh] mb-8"
      style={{
        backgroundImage: `url('${heroImg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Discover & Share Events in Japan</h1>
        <p className="mt-3 text-lg md:text-2xl font-light drop-shadow-lg">
          Anime, Matsuri, Art, Concerts & More
        </p>
        <button className="btn btn-secondary mt-6">Explore Upcoming Events</button>
      </div>
    </div>
  );
}
