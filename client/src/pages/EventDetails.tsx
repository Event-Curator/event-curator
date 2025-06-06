import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { FullEventType } from "../types";
import FormattedPrice from "../components/FormattedPrice";

// LinkIcon component using the provided SVG
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill={"#2761da"}
    viewBox="0 0 24 24"
    {...props}
  >
    {/* Boxicons v3.0 https://boxicons.com | License  https://docs.boxicons.com/free */}
    <path d="M9.88 18.36a3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24l2.83-2.83-1.41-1.41-2.83 2.83a5.003 5.003 0 0 0 0 7.07c.98.97 2.25 1.46 3.54 1.46s2.56-.49 3.54-1.46l2.83-2.83-1.41-1.41-2.83 2.83ZM12.71 4.22 9.88 7.05l1.41 1.41 2.83-2.83a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24l-2.83 2.83 1.41 1.41 2.83-2.83a5.003 5.003 0 0 0 0-7.07 5.003 5.003 0 0 0-7.07 0Z"></path>
    <path d="m16.95 8.46-.71-.7-.7-.71-4.25 4.24-4.24 4.25.71.7.7.71 4.25-4.24z"></path>
  </svg>
);

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<FullEventType | null>(null);
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_API;

  // const formatPrice = (price?: number) => {
  //   if (price === undefined || price === null) return "-";
  //   return price === 0 ? (
  //     <span className="text-green-600 font-semibold">Free Entry</span>
  //   ) : (
  //     <>¥{price.toLocaleString()}</>
  //   );
  // };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`${api}/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(Array.isArray(data) && data.length ? data[0] : null);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, api]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner text-blue-500 loading-lg"></span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Event Not Found
        </h1>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const startDate = event.datetimeFrom ? new Date(event.datetimeFrom) : null;
  const endDate = event.datetimeTo ? new Date(event.datetimeTo) : null;
  const calendarDays = startDate ? getDaysInMonth(startDate) : 31;
  const eventStartDay = startDate ? startDate.getDate() : -1;
  const eventEndDay = endDate ? endDate.getDate() : -1;

  const monthYear =
    startDate?.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    }) || "";

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Flex container for buttons */}
      <div className="flex justify-between items-center mb-4">
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
        {event.originUrl && (
          <a
            href={event.originUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline flex items-center gap-2"
          >
            <LinkIcon />
            Link to Source
          </a>
        )}
      </div>

      {/* Image Section */}
      <div className="relative mb-6">
        <img
          src={
            event.teaserMedia ||
            "https://via.placeholder.com/600x400?text=No+Image"
          }
          alt={event.name}
          className="w-full h-80 object-cover rounded-xl shadow"
          draggable={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
        {/* Left Content */}
        <section>
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            {event.name || "-"}
          </h1>

          <div className="space-y-2 text-gray-700 text-sm mb-8">
            <p>
              <b>Category:</b> {event.category || "-"}
            </p>
            <p>
              <b>Location:</b> {event.placeFreeform || "-"}
            </p>
            <p>
              <b>Date:</b>
              {startDate ? startDate.toLocaleDateString() : "-"} —{" "}
              {endDate ? endDate.toLocaleDateString() : "-"}
            </p>
            <p>
              <b>Price:</b> <FormattedPrice price={event.budgetMin} /> —{" "}
              <FormattedPrice price={event.budgetMax} />
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow prose max-w-none">
            <h2 className="text-blue-700 font-bold mb-2">Event Description</h2>
            <p>{event.description || "No description available."}</p>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-bold text-blue-700 mb-3">
              Information
            </h2>
            <ul className="text-sm space-y-1">
              <li>
                <b>Place:</b> {event.placeFreeform || "-"}
              </li>
              <li>
                <b>Date:</b>
                {startDate ? startDate.toLocaleDateString() : "-"} —{" "}
                {endDate ? endDate.toLocaleDateString() : "-"}
              </li>
              <li>
                <b>Price:</b> <FormattedPrice price={event.budgetMin} /> —{" "}
                <FormattedPrice price={event.budgetMax} />
              </li>
              <li>
                <b>Access:</b> (Map coming soon)
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-center text-blue-500 text-xs bg-blue-50 border border-blue-100 rounded h-24">
              [Map integration coming soon]
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-bold text-blue-700 mb-1">
              {monthYear}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs w-full">
              {["M", "T1", "W", "T2", "F", "S1", "S2"].map((d, idx) => (
                <div key={d + idx} className="font-bold text-gray-500">
                  {d[0]}
                </div>
              ))}
              {Array.from({ length: calendarDays }).map((_, i) => {
                const day = i + 1;
                const isStartDay = day === eventStartDay;
                const isEndDay = day === eventEndDay;
                let baseClasses = "rounded py-1 border cursor-default";

                if (isStartDay) {
                  baseClasses +=
                    " bg-green-500 text-white font-bold border-green-600 hover:bg-green-600";
                } else if (isEndDay) {
                  baseClasses +=
                    " bg-orange-400 text-white font-bold border-orange-500 hover:bg-orange-500";
                } else {
                  baseClasses += " bg-blue-50 text-gray-700 border-blue-100";
                }

                return (
                  <div
                    key={day}
                    title={
                      isStartDay
                        ? "🎉 Event Start Day!"
                        : isEndDay
                        ? "🏁 Event End Day!"
                        : undefined
                    }
                    className={baseClasses}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
