
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { FullEventType } from "../types";
import { categoryImages } from "../assets/categoryImages";
import { getDefaultImg } from "../utils/getDefaultImg";

interface UpcomingEventsCarouselProps {
  events?: FullEventType[];
}

type TooltipData = {
  x: number;
  y: number;
  visible: boolean;
  name: string;
  location: string;
  key: string; // externalId + i
};

export default function UpcomingEventsCarousel({ events: propEvents }: UpcomingEventsCarouselProps) {
  const navigate = useNavigate();
  const [events, setEvents] = useState<FullEventType[]>(propEvents || []);
  const carouselEvents = [...events, ...events];

  // Fetch 30 most upcoming events in Japan for the carousel if no propEvents
  useEffect(() => {
    if (propEvents && propEvents.length > 0) return;
    async function fetchUpcomingEvents() {
      try {
        const api = import.meta.env.VITE_API;
        const today = new Date().toISOString();
        const res = await fetch(
          `${api}/events?country=Japan&limit=30&sort=datetimeFrom&datetimeFrom=${encodeURIComponent(today)}`
        );
        const data = await res.json();
        setEvents(data);
      } catch {
        setEvents([]);
      }
    }
    fetchUpcomingEvents();
  }, [propEvents]);
  // Animation
  const [scroll, setScroll] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0, y: 0, visible: false, name: "", location: "", key: ""
  });

  useEffect(() => {
    if (carouselEvents.length === 0) return;
    if (paused) return;
    const interval = setInterval(() => {
      setScroll(prev => {
        if (!scrollRef.current) return prev;
        const scrollWidth = scrollRef.current.scrollWidth / 2;
        if (prev + 1 >= scrollWidth) return 0;
        return prev + 1;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [carouselEvents.length, paused]);

  // Manual arrows (move 1 event)
  const scrollByBox = (dir: -1 | 1) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[0] as HTMLDivElement;
    if (!child) return;
    const boxWidth = child.offsetWidth;
    setScroll(prev => {
      const scrollWidth = scrollRef.current!.scrollWidth / 2;
      let next = prev + dir * boxWidth;
      if (next < 0) next += scrollWidth;
      if (next >= scrollWidth) next -= scrollWidth;
      return next;
    });
  };

  // Tooltip
  const showTooltip = (
    e: React.MouseEvent | React.TouchEvent,
    name: string,
    location: string,
    key: string
  ) => {
    let x = 0, y = 0;
    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else if ("clientX" in e) {
      x = e.clientX;
      y = e.clientY;
    }
    setTooltip({ x, y, visible: true, name, location, key });
    setPaused(true);
  };

  const hideTooltip = () => {
    setTooltip((t) => ({ ...t, visible: false }));
    setPaused(false);
  };

  return (
    <div className="relative w-full" style={{ overflow: "hidden", padding: "0 1vw" }}>
      {/* Arrows */}
      <button
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow p-1"
        aria-label="Left"
        style={{ border: "1px solid #eee" }}
        onClick={() => scrollByBox(-1)}
      >
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="#2761da" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow p-1"
        aria-label="Right"
        style={{ border: "1px solid #eee" }}
        onClick={() => scrollByBox(1)}
      >
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
          <path d="M9 5l7 7-7 7" stroke="#2761da" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center"
        style={{
          gap: "6px",
          transform: `translateX(-${scroll}px)`,
          transition: "transform 0.15s linear",
          width: "9999px",
        }}
      >
        {carouselEvents.map((ev, i) => {
          const fallbackImage = categoryImages[ev.category] || categoryImages["Other"];
          const imageSrc =
            ev.teaserMedia && ev.teaserMedia.trim() !== ""
              ? import.meta.env.VITE_API + "/.." + ev.teaserMedia
              : fallbackImage;
          return (
            <div
              key={ev.externalId + "-" + i}
              style={{
                minWidth: 180,
                width: 180,
                height: 120,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 10px #1e40af11",
                cursor: "pointer",
                border: "1px solid #e0e7ff",
                background: "#fff",
                flex: "0 0 auto",
                display: "flex",
                position: "relative",
              }}
              onClick={() => navigate(`/event/${ev.externalId}`)}
              onMouseEnter={e =>
                showTooltip(
                  e,
                  ev.name,
                  ev.placeFreeform || "",
                  ev.externalId + "-" + i
                )
              }
              onMouseMove={e =>
                tooltip.visible &&
                tooltip.key === ev.externalId + "-" + i &&
                showTooltip(
                  e,
                  ev.name,
                  ev.placeFreeform || "",
                  ev.externalId + "-" + i
                )
              }
              onMouseLeave={hideTooltip}
              onTouchStart={e =>
                showTooltip(
                  e,
                  ev.name,
                  ev.placeFreeform || "",
                  ev.externalId + "-" + i
                )
              }
              onTouchEnd={hideTooltip}
              title=""
            >
              <img
                src={imageSrc}
                onError={e => getDefaultImg(e, fallbackImage)}
                alt={ev.name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div
          className="pointer-events-none z-50"
          style={{
            position: "fixed",
            top: tooltip.y - 80, // show above cursor/touch
            left: tooltip.x,
            transform: "translate(-50%, -12px)",
            minWidth: 190,
            maxWidth: 260,
            background: "white",
            borderRadius: 10,
            boxShadow: "0 4px 32px #1e3a8a22",
            border: "1px solid #dbeafe",
            padding: "12px 18px",
            color: "#1e3a8a",
            fontWeight: 600,
            fontSize: "1rem",
            opacity: 1,
            transition: "opacity 0.15s",
            pointerEvents: "none",
            whiteSpace: "pre-line",
          }}
        >
          <div className="font-bold text-blue-800 mb-1 truncate">
            {tooltip.name}
          </div>
          <div className="text-blue-600 text-sm font-normal">
            {tooltip.location}
          </div>
        </div>
      )}
    </div>
  );
}

