import { useEffect, useState } from "react";
import type { MetaData } from "../types";
import heroImg from "../assets/Matsuri.jpg";

export default function Hero() {
  const [eventTotal, setEventTotal] = useState("");
  const fallbackTotal = "countless";
  const api = import.meta.env.VITE_API;

  useEffect(() => {
    async function getMetaData() {
      try {
        const response = await fetch(`${api}/meta?key=placeProvince`);
        if (!response.ok) {
          console.error(response);
          setEventTotal(fallbackTotal);
        }
        const data: MetaData[] = await response.json();
        const total = data.reduce((acc, current) => acc + current.count, 0);
        setEventTotal(total.toString());
      } catch (error) {
        console.error(error);
        setEventTotal(fallbackTotal);
      }
    }
    getMetaData();
  }, [api]);

  return (
    <section className="relative w-full h-80 md:h-[20rem] flex items-center justify-center bg-blue-900 mb-6">
      <img
        src={heroImg}
        alt="Events Hero"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      <div className="relative z-10 text-white text-center px-4">
        <h1 className="text-6xl md:text-6xl font-extrabold drop-shadow mb-3 font-sans tracking-tight text-red-outline">
          Events in Japan
        </h1>
        <p className="text-2xl md:text-2xl drop-shadow mb-3 font-sans tracking-tight text-red-outline">
          Search from {eventTotal} Festivals, Art, Concerts, Sports & More!
        </p>
      </div>
    </section>
  );
}
