import type { FullEventType } from "../types";

// Returns a string label for price, e.g. "Free" or "¥1,000"
export function getPriceLabel(price: number) {
  if (price === 0) return "Free";
  if (typeof price === "number" && !isNaN(price)) return `¥${price.toLocaleString()}`;
  return "";
}

export function getTimeRange(ev: FullEventType) {
  const from = ev.datetimeFrom
    ? new Date(ev.datetimeFrom).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "-";
  const to = ev.datetimeTo
    ? new Date(ev.datetimeTo).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "-";
  return `${from} — ${to}`;
}

export function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - ((day + 6) % 7);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDates(baseMonday = new Date()) {
  const monday = getMonday(baseMonday);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}