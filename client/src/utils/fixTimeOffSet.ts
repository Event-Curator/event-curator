import moment from "moment";
import type { StartEndInfo, FullEventType } from "../types";

export default function fixTimeOffset(event: FullEventType): StartEndInfo {
  const startDate = moment(event.datetimeFrom)
    .subtract(9, "hours")
    .format("LL");
  const endDate = moment(event.datetimeTo).subtract(9, "hours").format("LL");
  const startTime = moment(event.datetimeFrom)
    .subtract(9, "hours")
    .format("LT");
  const endTime = moment(event.datetimeTo).subtract(9, "hours").format("LT");

  return { startDate, endDate, startTime, endTime };
}
