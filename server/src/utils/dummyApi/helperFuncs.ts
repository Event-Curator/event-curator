import data from "./data.js";
import { LocationInterface } from "./data.js";

const getRandomN = (max: number): number => Math.floor(Math.random() * max);

function getRandomId(order: number): number {
  // "order" meaning 100, 1000, etc.
  return Math.ceil(Math.random() * order);
}

function getRandomName(): string {
  const n = getRandomN(data.nameDescriptor.length);
  const m = getRandomN(data.namePlace.length);
  const descriptor = data.nameDescriptor[n];
  const place = data.namePlace[m];
  return descriptor + " " + place;
}

function getRandomDescription(): string {
  const n = getRandomN(data.descriptions.length);
  return data.descriptions[n];
}

function getRandLocData(): LocationInterface {
  const n = getRandomN(data.locations.length);
  return data.locations[n];
}

function getRandomBudgetMinMax(): number[] {
  const prices = [100, 500, 1000, 2000, 5000];
  const len = prices.length;
  const n = getRandomN(len);
  const m = getRandomN(len);
  const budgetMin = prices[n];
  const budgetMax = budgetMin + prices[m];
  return [budgetMin, budgetMax];
}

function getRandomDates(): Date[] {
  const dateNum = getRandomN(14) + 1;
  const time = getRandomN(23);
  const start = new Date(`June ${dateNum}, 2025 ${time}:00:00`);
  const end = new Date(`June ${dateNum}, 2025 ${time + 4}:00:00`);
  return [start, end];
}

function getRandomEventType(): string {
  const n = getRandomN(data.eventEnumTypesArray.length);
  return data.eventEnumTypesArray[n];
}

function getRandomEventSize(): string {
  const n = getRandomN(data.eventSizeEnumArray.length);
  return data.eventSizeEnumArray[n];
}

export default {
  getRandomId,
  getRandomName,
  getRandomDescription,
  getRandomBudgetMinMax,
  getRandLocData,
  getRandomDates,
  getRandomEventType,
  getRandomEventSize,
};
