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
      
      <div className="relative z-10 text-white text-center px-4">
        <h1 className="text-6xl md:text-6xl font-extrabold drop-shadow mb-3 font-sans tracking-tight text-red-outline">
          Events in Japan
          </h1>
          <p className="text-2xl md:text-2xl drop-shadow mb-3 font-sans tracking-tight text-red-outline">
            Discover & Share Festivals, Art, Concerts, Sports & More!
            </p>
            </div>
    </section>
  );
}
