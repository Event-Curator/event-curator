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
  externalId: string;
  originId: string;
  originUrl: string;
  name: string;
  description: string;
  teaserText: string;
  teaserMedia: string;
  teaserFreeform: string;
  placeLattitude: number;
  placeLongitude: number;
  placeFreeform: string;
  budgetMin: number;
  budgetMax: number;
  budgetCurrency: string;
  budgetFreeform: string;
  datetimeStart: Date;
  datetimeEnd: Date;
  datetimeFreeform
  category: EventCategoryEnum;
  categoryFreeform: string;
  size: EventSizeEnum;
  sizeFreeform: string;
    
  public constructor (url: string) {
    this.externalId = md5(url.toLocaleLowerCase()); 
    this.originId = md5(url.toLocaleLowerCase());
    this.originUrl = url;
    this.name = "";
    this.description = "";
    this.teaserText = "";
    this.teaserMedia = "";
    this.teaserFreeform = "";
    this.placeLattitude = 0;
    this.placeLongitude = 0;
    this.placeFreeform = "";
    this.budgetMin = 0;
    this.budgetMax = 0;
    this.budgetCurrency = "USD";
    this.budgetFreeform = "";
    this.datetimeStart = new Date();
    this.datetimeEnd = new Date();
    this.datetimeFreeform = "";
    this.category = EventCategoryEnum.OTHER;
    this.categoryFreeform = "";
    this.size = EventSizeEnum.M;
    this.sizeFreeform = ""
  }
}

export type EventType = {
  externalId: string;
  originId: string;
  originUrl: string;           // this should point to a working page on the source website giving all the event details

  name: string;                // name in one line
  description: string;         // multi line html content

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

  // princing stuff
  // all is in Yen. o means free
  budgetMin: number;
  budgetMax: number;
  budgetCurrency: string;    // USD, EUR, ...
  budgetFreeform: string;

  // schedule stuff
  // GMT
  datetimeStart: Date;
  datetimeEnd: Date;
  datetimeFreeform: string;
  
  // category of this event
  category: EventCategoryEnum;
  categoryFreeform: string;

  // size of the event
  size: EventSizeEnum;
  sizeFreeform: string;

  // getOriginId: () => {};
}
