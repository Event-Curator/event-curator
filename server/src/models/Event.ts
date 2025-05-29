import md5 from 'md5';

export enum EventSizeEnum {
  "XS", "S", "M", "L", "XL" 
}

export enum EventCategoryEnum {
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
  RELIGION = <any>"Religion & Spirituality",
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

export class Event implements EventType {

  // private properties (setter usage mandatory)
  // #originUrl: string; 

  // public properties
  id: number;
  externalId: string;
  originId: string;
  originUrl: string;
  name: string;
  description: string;
  placeLattitude: number;
  placeLongitude: number;
  entrancePriceMin: number;
  entrancePriceMax: number;
  entranceCurrency: string;
  datetimeStart: Date;
  datetimeEnd: Date;
  category: EventCategoryEnum;
  size: EventSizeEnum;
    
  public constructor (url: string) {
    this.id = 0;
    this.externalId = ""; 
    this.originId = md5(url.toLocaleLowerCase());
    this.originUrl = url;
    this.name = "";
    this.description = "";
    this.placeLattitude = 0;
    this.placeLongitude = 0;
    this.entrancePriceMin = 0;
    this.entrancePriceMax = 0;
    this.entranceCurrency = "USD";
    this.datetimeStart = new Date();
    this.datetimeEnd = new Date();
    this.category = EventCategoryEnum.OTHER;
    this.size = EventSizeEnum.M;
  }
}

export type EventType = {
  id: number;
  externalId: string;
  originId: string;
  originUrl: string;           // this should point to a working page on the source website giving all the event details

  name: string;                // name in one line
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

  // category of this event
  category: EventCategoryEnum;

  // size of the event
  size: EventSizeEnum;

  // getOriginId: () => {};
}
