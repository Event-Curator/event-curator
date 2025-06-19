import type { FullEventType } from "../types";
import moment from "moment";

export default function getUniqueDates(events: FullEventType[]): string[] {
  const allDates = events.map((event) => {
    const formattedDate = moment(event.datetimeFrom).subtract(9, "hours");
    return formattedDate.format("LL");
  });
  const uniqueDates = new Set(allDates);
  return Array.from(uniqueDates);
}
