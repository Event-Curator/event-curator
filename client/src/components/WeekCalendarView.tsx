import React from "react";
import type { FullEventType } from "../types";
import { getTimeRange, getPriceLabel } from "../utils/eventUtils";

type WeekCalendarViewProps = {
  weekDates: Date[];
  eventsByDay: { [k: string]: FullEventType[] };
  weekRangeStr: string;
  isMobile: boolean;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  handleRemove: (e: React.MouseEvent, id: string) => void;
};

const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={32} height={32} fill="none" viewBox="0 0 24 24" {...props}>
    <path d="M15 19l-7-7 7-7" stroke="#2761da" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={32} height={32} fill="none" viewBox="0 0 24 24" {...props}>
    <path d="M9 5l7 7-7 7" stroke="#2761da" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function WeekCalendarView({
  weekDates,
  eventsByDay,
  weekRangeStr,
  isMobile,
  setWeekOffset,
  handleRemove,
}: WeekCalendarViewProps) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <div className="w-full">
      {!isMobile && (
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Previous week"
            onClick={() => setWeekOffset((prev) => prev - 1)}
          >
            <ArrowLeft />
          </button>
          <div className="font-bold text-lg text-blue-700 px-2">
            {weekRangeStr}
          </div>
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Next week"
            onClick={() => setWeekOffset((prev) => prev + 1)}
          >
            <ArrowRight />
          </button>
        </div>
      )}
      <div className="bg-blue-50 rounded-2xl px-8 py-6 w-full">
        <div
          className="
            grid grid-cols-7 gap-8
            w-full
            max-w-none
          "
          style={{
            minWidth: 0,
          }}
        >
          {weekDates.map((date) => {
            const key = date.toISOString().slice(0, 10);
            const events = eventsByDay[key] || [];
            return (
              <div key={key} className="flex flex-col items-center w-full">
                <div className="text-center font-bold text-blue-700 mb-4 text-xl">
                  {date.toLocaleDateString(undefined, { weekday: "short" })}
                  <div className="text-base text-gray-500">{date.getDate()}</div>
                </div>
                <div className="flex flex-col gap-4 w-full items-center">
                  {events.length === 0 ? (
                    <div
                      className="
                        bg-gray-100 rounded-xl h-24 text-base text-gray-300
                        flex items-center justify-center border border-dashed border-gray-200
                        w-full
                        min-w-0
                      "
                    >
                      No events
                    </div>
                  ) : (
                    events.map((ev) => {
                      const eventDate = new Date(ev.datetimeFrom);
                      eventDate.setHours(0, 0, 0, 0);
                      const isToday = eventDate.getTime() === now.getTime();
                      return (
                        <div
                          key={ev.externalId}
                          onClick={() => window.location.assign(`/event/${ev.externalId}`)}
                          className={`
                            relative p-6 rounded-xl bg-white flex flex-col gap-2
                            w-full min-w-0
                            shadow transition cursor-pointer border-2
                            ${isToday ? "border-blue-500 shadow-lg" : "border-gray-200"}
                          `}
                        >
                          <div className="font-bold text-blue-800 text-lg">{ev.name}</div>
                          <div className="text-base text-gray-700">{ev.placeFreeform}</div>
                          <div className="text-base text-blue-600 font-bold">
                            {new Date(ev.datetimeFrom).toLocaleDateString()}
                          </div>
                          <div className="text-base">
                            <b>Time:&nbsp;</b>
                            {getTimeRange(ev)}
                          </div>
                          <div className="text-base">{getPriceLabel(ev.budgetMax)}</div>
                          <button
                            className="absolute bottom-3 right-3 btn btn-xs btn-circle black hover:bg-red-400 text-white shadow"
                            title="Remove from timeline"
                            tabIndex={-1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(e, ev.externalId);
                            }}
                          >
                            &#10006;
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}