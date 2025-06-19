export interface FullEventType {
  isPinned: any;
  externalId: string;
  originId: string;
  originUrl: string; // this should point to a working page on the source website giving all the event details
  name: string; // name in one line
  description: string; // multi line html content

  teaserText: string;
  teaserMedia: string;
  teaserFreeform: string;
  // location stuff
  // detail will be fetched at run time, asynchronously
  // https://support.google.com/maps/answer/18539?hl=en&co=GENIE.Platform%3DDesktop
  // for the search feature: https://npm.io/package/map-nearest-location
  placeLattitude: number;
  placeLongitude: number;
  placeFreeform: string;

  organizer?: string;
  website?: string;
  details?: string; // additional details?
  notes?: string; // additional notes?

  // princing stuff
  // all is in Yen. o means free
  budgetMin: number;
  budgetMax: number;
  budgetCurrency: string; // USD, EUR, ...
  budgetFreeform: string;

  // schedule stuff
  // GMT
  datetimeFrom: Date;
  datetimeTo: Date;
  datetimeFreeform: string;
  datetimeSchedule: Date;
  datetimeOptionalSchedule: Date;

  // category of this event
  category: string;
  categoryFreeform: string;

  // size of the event
  size: string;
  sizeFreeform: string;
}

export interface EventsByDateGroup {
  date: string;
  events: FullEventType[];
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  userRefused: boolean;
}

export interface MetaData {
  name: string;
  count: number;
  label: string;
}

export interface StartEndInfo {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export type LocationSearchType = "latLong" | "prefecture";
