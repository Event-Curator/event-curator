
import heroImg from "../assets/Matsuri.jpg";

export default function Hero() {
  return (
    <section className="relative w-full h-56 md:h-64 flex items-center justify-center bg-blue-900 mb-6">
      <img
        src={heroImg}
        alt="Events Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        draggable={false}
      />
      <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
      <div className="relative z-10 text-white text-center px-4">
        <h1 className="text-2xl md:text-4xl font-bold drop-shadow mb-2">Events in Japan</h1>
        <p className="text-sm md:text-lg drop-shadow mb-3">
          Discover & Share Festivals, Art, Concerts, Sports, Anime Events & More
        </p>
        <button className="btn btn-primary btn-sm md:btn-md mt-2">Event Calendar</button>
      </div>
    </section>
  );
}
