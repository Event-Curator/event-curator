import React from "react";
import type { FullEventType } from "../types";
import { getTimeRange, getPriceLabel } from "../utils/eventUtils";
import moment from "moment";

type WeekCalendarViewProps = {
  weekDates: Date[];
  eventsByDay: { [k: string]: FullEventType[] };
  weekRangeStr: string;
  isMobile: boolean;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  handleRemove: (e: React.MouseEvent, ev: any) => void;
  handleAdd: (e: React.MouseEvent, ev: any) => void;
  allEvents: FullEventType[];
};

function getBarSpanIndices(ev: FullEventType, weekDates: Date[]) {
  const start = moment(ev.datetimeFrom).startOf('day');
  const end = moment(ev.datetimeTo).endOf('day');
  const indices = weekDates
    .map((d, i) => {
        let currentDate = moment(d);
        return currentDate.startOf('day').isSameOrAfter(start) && currentDate.endOf('day').isSameOrBefore(end) ? i : null
      }
    )
    .filter(i => i !== null) as number[];

    return indices;
}

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
  handleAdd,
  allEvents,
}: WeekCalendarViewProps) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const weekStart = weekDates[0];
  const weekEnd = weekDates[weekDates.length - 1];

  // Remove duplicates in allEvents (keep only 1 per externalId)
  let dedup: string[] = [];
  let allEventsDedup: FullEventType[] = [];
  for (let _e of allEvents) {
    if (dedup.indexOf(_e.externalId) < 0) {
      allEventsDedup.push(_e);
      dedup.push(_e.externalId);
    }
  }

  // Collect multi-day events that overlap this week
 const multiDayEvents: FullEventType[] = allEventsDedup.filter(ev => {
  if (!ev.datetimeTo) return false;
  const start = moment(ev.datetimeFrom).startOf('day');
  const end = moment(ev.datetimeTo).startOf('day');
  // Only include if end is after start (at least 1 day apart)
  return (
    end.diff(start, 'days') >= 1 &&
    end.toDate() >= weekStart &&
    start.toDate() <= weekEnd
  );
});

  // Calculate height for the bars wrapper
  const eventBarHeight = 26;
  const barsTotalHeight = multiDayEvents.length * eventBarHeight;

  return (
    <div className="w-full">
      {/* Week navigation */}
      {!isMobile && (
        <div className="flex items-center justify-center gap-4 mb-2">
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

      {/* Multi-day event bars */}
      {!isMobile && (
        <div
          className="relative w-full"
          style={{
            height: barsTotalHeight,
            marginBottom: barsTotalHeight > 0 ? "8px" : "0",
            transition: "height 0.2s cubic-bezier(.42,0,.58,1)"
          }}
        >
          {multiDayEvents.map((ev, idx) => {
            const barIndices = getBarSpanIndices(ev, weekDates);
            if (!barIndices.length) return null;
            const start = barIndices[0];
            const end = barIndices[barIndices.length - 1];
            return (
              <div
                key={ev.externalId}
                className="absolute flex items-center"
                style={{
                  left: `calc(${(start / 7) * 100}% + 8px)`,
                  width: `calc(${((end - start + 1) / 7) * 100}% - 16px)`,
                  top: `${idx * eventBarHeight}px`,
                  height: "24px",
                  background: "#2761da22",
                  borderRadius: "9999px",
                  border: "2px solid #2761da",
                  color: "#1e3a8a",
                  fontWeight: 600,
                  fontSize: "0.97rem",
                  padding: "0 16px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  boxShadow: "0 1px 4px #a5b4fc33",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  zIndex: 5,
                  transition: "top 0.2s"
                }}
                onClick={() => window.location.assign(`/event/${ev.externalId}`)}
                title={ev.name}
              >
                <span className="truncate">{ev.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Weekday header (always directly below multi-day bars) */}
      <div className="w-full flex flex-row gap-8 px-8" style={{ marginBottom: "0.5rem" }}>
        {weekDates.map(date => (
          <div
            key={date.toISOString()}
            className="flex-1 text-center font-bold text-blue-700 text-xl"
          >
            {date.toLocaleDateString(undefined, { weekday: "short" })}
            <div className="text-base text-gray-500">{date.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Event grid (cards per day) */}
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
            const allEvents = eventsByDay[key] || [];
            const scheduledEvents = allEvents;
            return (
              <div key={key} className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-4 w-full items-center">
                  {scheduledEvents.length === 0 ? (
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
                    scheduledEvents.map((ev) => {
                      const eventDate = new Date(ev.datetimeFrom);
                      eventDate.setHours(0, 0, 0, 0);
                      const isToday = eventDate.getTime() === now.getTime();
                      return (
                        <div
                          key={ev.externalId}
                          className={`
                            relative p-6 rounded-xl bg-white flex flex-col gap-2
                            w-full min-w-0
                            shadow transition cursor-pointer border-2
                            ${isToday ? "border-blue-500 shadow-lg" : "border-gray-200"}
                            ${ev.isPinned ? "border-blue-500" : "bg-gray-100 text-gray-300"}
                          `}
                        >

                        {ev.isPinned ? 
                          (
                            <div
                              onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(e, ev);
                            }}
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
                            </div>

                          ) : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdd(e, ev);
                              }}
                              >
                              { "Click to schedule " + ev.name }
                            </div>
                          )
                        }
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
