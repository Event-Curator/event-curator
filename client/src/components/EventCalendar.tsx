import React from "react";

const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} fill="none" stroke="#2761da" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} fill="none" stroke="#2761da" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type Props = {
  monthYear: string;
  calendarDays: number;
  isStartDay: (day: number) => boolean;
  isEndDay: (day: number) => boolean;
  isDayInEventRange: (day: number) => boolean;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
};

export default function EventCalendar({
  monthYear,
  calendarDays,
  isStartDay,
  isEndDay,
  isDayInEventRange,
  handlePrevMonth,
  handleNextMonth,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-center justify-between mb-1">
        <button
          type="button"
          aria-label="Previous month"
          className="p-1 rounded hover:bg-blue-100"
          onClick={handlePrevMonth}
        >
          <ArrowLeft />
        </button>
        <h3 className="text-lg font-bold text-blue-700">{monthYear}</h3>
        <button
          type="button"
          aria-label="Next month"
          className="p-1 rounded hover:bg-blue-100"
          onClick={handleNextMonth}
        >
          <ArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs w-full">
        {["M", "T1", "W", "T2", "F", "S1", "S2"].map((d, idx) => (
          <div key={d + idx} className="font-bold text-gray-500">
            {d[0]}
          </div>
        ))}
        {Array.from({ length: calendarDays }).map((_, i) => {
          const day = i + 1;
          const start = isStartDay(day);
          const end = isEndDay(day);
          const inRange = isDayInEventRange(day);

          let baseClasses = "rounded py-1 border cursor-default";
          if (start) {
            baseClasses += " bg-blue-700 text-white font-bold border-green-600 hover:bg-green-600";
          } else if (end) {
            baseClasses += " bg-blue-700 text-white font-bold border-orange-500 hover:bg-orange-500";
          } else if (inRange) {
            baseClasses += " bg-blue-700 text-white font-bold border-blue-800 hover:bg-blue-800";
          } else {
            baseClasses += " bg-blue-50 text-gray-700 border-blue-100";
          }
          return (
            <div
              key={day}
              title={
                start
                  ? "🎉 Event Start Day!"
                  : end
                  ? "🏁 Event End Day!"
                  : inRange
                  ? "Multi-day Event"
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
  );
}