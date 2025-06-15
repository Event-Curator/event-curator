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
  currentMonth: number;
  currentYear: number;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function EventCalendar({
  monthYear,
  calendarDays,
  isStartDay,
  isEndDay,
  isDayInEventRange,
  handlePrevMonth,
  handleNextMonth,
  currentMonth,
  currentYear,
}: Props) {
  // Calculate the first day of the week (0=Sunday)
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Previous month info
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

  // Build the calendar grid (6 rows of 7 days)
  const days: { day: number; outside: boolean }[] = [];

  // Days from previous month (faded)
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ day: prevMonthDays - firstDayOfWeek + 1 + i, outside: true });
  }
  // Days in current month
  for (let i = 1; i <= calendarDays; i++) {
    days.push({ day: i, outside: false });
  }
  // Days from next month (faded)
  let nextMonthDay = 1;
  while (days.length % 7 !== 0) {
    days.push({ day: nextMonthDay++, outside: true });
  }
  // Ensure 6 rows (42 days)
  while (days.length < 42) {
    days.push({ day: nextMonthDay++, outside: true });
  }

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
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, idx) => (
          <div key={d + idx} className="font-bold text-gray-500">
            {d}
          </div>
        ))}
        {days.map((d, idx) => {
          const isCurrentMonth = !d.outside;
          const start = isCurrentMonth && isStartDay(d.day);
          const end = isCurrentMonth && isEndDay(d.day);
          const inRange = isCurrentMonth && isDayInEventRange(d.day);

          let baseClasses = "rounded py-1 border cursor-default";
          if (start) {
            baseClasses += " bg-blue-700 text-white font-bold border-blue-700 hover:bg-blue-800";
          } else if (end) {
            baseClasses += " bg-blue-700 text-white font-bold border-blue-700 hover:bg-blue-800";
          } else if (inRange) {
            baseClasses += " bg-blue-700 text-white font-bold border-blue-700 hover:bg-blue-800";
          } else if (isCurrentMonth) {
            baseClasses += " bg-blue-50 text-gray-700 border-blue-100";
          } else {
            baseClasses += " text-gray-300 bg-white border-blue-50";
          }
          return (
            <div
              key={idx}
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
              {d.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}