import * as pe from '../models/event.js';

export interface IEventSource {

  // must return the lowercase key that can be found in the sources.json config file
  getId: () => string

  searchEvent: (query: string) => Promise<Array<pe.EventType>>
}

export class Event {
  event: EventType | null = null

  public constructor () {
    this.event = {
      id: 0,
      externalId: "", 
      originId: "", 
      originUrl: "", 
      name: "",
      description: "",
      placeLattitude: 0,
      placeLongitude: 0,
      entrancePriceMin: 0,
      entrancePriceMax: 0,
      entranceCurrency: "USD",
      datetimeStart: new Date(),
      datetimeEnd: new Date(),
      // category: CategoryEnum.OTHER,
      // size: SizeEnum.M
     }
  }

  // ----------------
  public get id(): number {
    return this.event ? this.event.id : 0;
  }

  public set id(value: number) {
    if (this.event != null) this.event.id = value;
  }

  // ----------------
  public get externalId(): string {
    return this.event ? this.event.externalId : "";
  }

  public set externalId(value: number) {
    if (this.event != null) this.event.id = value;
  }

  // ----------------
  public get originId(): string {
    return this.event ? this.event.externalId : "";
  }

  public set originId(value: string) {
    if (this.event != null) this.event.originId = value;
  }

  // ----------------
  public get originUrl(): string {
    return this.event ? this.event.originUrl : "";
  }

  public set originUrl(value: string) {
    if (this.event != null) this.event.originUrl = value;
  }

  // ----------------
  public get name(): string {
    return this.event ? this.event.name : "";
  }

  public set name(value: string) {
    if (this.event != null) this.event.name = value;
  }

  // ----------------
  public get description(): string {
    return this.event ? this.event.description : "";
  }

  public set description(value: string) {
    if (this.event != null) this.event.description = value;
  }

  // ----------------
  public get placeLattitude(): number {
    return this.event ? this.event.placeLattitude : 0;
  }

  public set placeLattitude(value: number) {
    if (this.event != null) this.event.placeLattitude = value;
  }

  // ----------------
  public get placeLongitude(): number {
    return this.event ? this.event.placeLattitude : 0;
  }

  public set placeLongitude(value: number) {
    if (this.event != null) this.event.placeLongitude = value;
  }

  // ----------------
  public get entrancePriceMin(): number {
    return this.event ? this.event.entrancePriceMin : 0;
  }

  public set entrancePriceMin(value: number) {
    if (this.event != null) this.event.entrancePriceMin = value;
  }

  // ----------------
  public get entrancePriceMax(): number {
    return this.event ? this.event.entrancePriceMax : 0;
  }

  public set entrancePriceMax(value: number) {
    if (this.event != null) this.event.entrancePriceMax = value;
  }

  // ----------------
  public get entranceCurrency(): string {
    return this.event ? this.event.entranceCurrency : "";
  }

  public set entranceCurrency(value: string) {
    if (this.event != null) this.event.entranceCurrency = value;
  }

  // ----------------
  public get datetimeStart(): Date {
    return this.event ? this.event.datetimeStart : new Date();
  }

  public set datetimeStart(value: Date) {
    if (this.event != null) this.event.datetimeStart = value;
  }

  // ----------------
  public get datetimeEnd(): Date {
    return this.event ? this.event.datetimeEnd : new Date();
  }

  public set datetimeEnd(value: Date) {
    if (this.event != null) this.event.datetimeEnd = value;
  }
}

let _event = new Event()

export type EventType = {
  id: number;
  externalId: string;
  originId: string;
  originUrl: string;           // this should point to a working page on the source website giving all the event details

  name: string;           // name in one line
  description: string;         // multi line html content

  // location stuff
  // detail will be fetched at run time, asynchronously
  // https://support.google.com/maps/answer/18539?hl=en&co=GENIE.Platform%3DDesktop
  // for the search feature: https://npm.io/package/map-nearest-location
  placeLattitude: number;
  placeLongitude: number;

  // princing stuff
  // all is in Yen. o means free
  entrancePriceMin: number;
  entrancePriceMax: number;
  entranceCurrency: string;    // USD, EUR, ...

  // schedule stuff
  // GMT
  datetimeStart: Date;
  datetimeEnd: Date;

  // // category of this event
  // category: CategoryEnum;

  // // size of the event
  // size: SizeEnum;
}

export enum SizeEnum {
  "XS", "S", "M", "L", "XL" 
}

export enum CategoryEnum {
  MUSIC = <any>"Music",
  BUSINESS = <any>"Business & Professional",
  FOOD = <any>"Food & Drink",
  COMMUNITY = <any>"Community & Culture",
  PERFORMANCE = <any>"Performing & Visual Arts",
  MEDIA = <any>"Film, Media & Entertainment",
  SPORT = <any>"Sports & Fitness",
  HEALTH = <any>"Health & Wellness",
  SCIENCE = <any>"Science & Technology",
  TRAVEL = <any>"Travel & Outdoor",
  CHARITY = <any>"Charity & Causes",
  RELIGIN = <any>"Religion & Spirituality",
  FAMILY = <any>"Family & Education",
  SEASONAL = <any>"Seasonal & Holiday",
  GOV = <any>"Government & Politics",
  FASHION = <any>"Fashion & Beauty",
  HOME = <any>"Home & Lifestyle",
  AUTO = <any>"Auto, Boat & Air",
  HOBBIES = <any>"Hobbies & Special Interest",
  SCHOOL = <any>"School Activities",
  OTHER = <any>"Other",
}
