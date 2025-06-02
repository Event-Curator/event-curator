import { EventCategoryEnum, EventSizeEnum } from "../../models/Event.js";

export interface LocationInterface {
  city: string;
  lat: number;
  long: number;
}

const nameDescriptor: string[] = [
  "Jazz",
  "Karate",
  "Flower",
  "Japanese Calligraphy",
  "Yukata",
  "Kimono",
  "Handicrafts",
  "Japanese Food",
  "Belgian Beer",
  "Classical Music",
  "Independent Film",
  "Race Car",
  "Sakura University",
  "Prefectural",
];
const namePlace: string[] = [
  "Concert",
  "Meeting",
  "Festival",
  "Pavilion",
  "Meet",
  "Market",
  "Competition",
  "Drag Race",
  "Graduation",
  "Election",
];

const descriptions: string[] = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
];

const locations: LocationInterface[] = [
  {
    city: "Sapporo",
    lat: 43.03,
    long: 141.21,
  },
  {
    city: "Tokyo",
    lat: 35.41,
    long: 139.46,
  },
  {
    city: "Nagoya",
    lat: 35.11,
    long: 136.54,
  },
  {
    city: "Osaka",
    lat: 34.41,
    long: 135.3,
  },
  {
    city: "Kyoto",
    lat: 35.04,
    long: 135.47,
  },
  {
    city: "Hiroshima",
    lat: 34.23,
    long: 132.27,
  },
];

const eventEnumTypesArray: string[] = [];
for (const category in EventCategoryEnum) {
  eventEnumTypesArray.push(category);
}

const eventSizeEnumArray: string[] = [];
for (const size in EventSizeEnum) {
  eventSizeEnumArray.push(size);
}

export default {
  nameDescriptor,
  namePlace,
  descriptions,
  locations,
  eventEnumTypesArray,
  eventSizeEnumArray,
};
