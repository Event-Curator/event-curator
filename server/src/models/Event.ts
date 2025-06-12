import md5 from 'md5';
import { eaCache } from '../middlewares/apiGateway.js';
import { blob } from 'stream/consumers';

export const ES_SEARCH_IN_CACHE = 0x1;    // this event source will use the local cache for search query
export const ES_SEARCH_REMOTE = 0x2;      // this event source will make a remote api query for search

export enum EventSizeEnum {
  XS = <any> "XS",
  S = <any> "S",
  M = <any> "M", 
  L = <any> "L", 
  XL = <any> "XL" 
}

export enum datetimeRangeEnum {
  NEXT7DAYS = "NEXT7DAYS",
  NEXTWEEK = "NEXTWEEK",
  THISMONTH = "THISMONTH",
  NEXTMONTH = "NEXTMONTH",
}

export enum EventCategoryEnum {
  MUSIC = "Music",
  BUSINESS = "Business & Professional",
  FOOD = "Food & Drink",
  COMMUNITY = "Community & Culture",
  PERFORMANCE = "Performing & Visual Arts",
  MEDIA = "Film, Media & Entertainment",
  SPORT = "Sports & Fitness",
  HEALTH = "Health & Wellness",
  SCIENCE = "Science & Technology",
  TRAVEL = "Travel & Outdoor",
  CHARITY = "Charity & Causes",
  RELIGION = "Religion & Spirituality",
  FAMILY = "Family & Education",
  SEASONAL = "Seasonal & Holiday",
  GOV = "Government & Politics",
  FASHION = "Fashion & Beauty",
  HOME = "Home & Lifestyle",
  AUTO = "Auto, Boat & Air",
  HOBBIES = "Hobbies & Special Interest",
  SCHOOL = "School Activities",
  OTHER = "Other",
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
  placeDistance: number;
  placeSuburb: string;
  placeCity: string;
  placeProvince: string;
  placeCountry: string;
  budgetMin: number;
  budgetMax: number;
  budgetCurrency: string;
  budgetFreeform: string;
  datetimeFrom: Date;
  datetimeTo: Date;
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
    this.placeDistance = 0;
    this.placeSuburb = "";
    this.placeCity = "";
    this.placeProvince = "";
    this.placeCountry = "";
    this.budgetMin = 0;
    this.budgetMax = 0;
    this.budgetCurrency = "USD";
    this.budgetFreeform = "";
    this.datetimeFrom = new Date();
    this.datetimeTo = new Date();
    this.datetimeFreeform = "";
    this.category = EventCategoryEnum.OTHER;
    this.categoryFreeform = "";
    this.size = EventSizeEnum.M;
    this.sizeFreeform = "";
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
  placeDistance: number;        // #meters between the user location and the event's coordinates
  placeSuburb: string;
  placeCity: string;
  placeProvince: string;
  placeCountry: string;

  // only available in searchResult if includeDistance is set
  
  // princing stuff
  // all is in Yen. o means free
  budgetMin: number;
  budgetMax: number;
  budgetCurrency: string;    // USD, EUR, ...
  budgetFreeform: string;
  
  // schedule stuff
  // GMT
  datetimeFrom: Date;
  datetimeTo: Date;
  datetimeFreeform: string;
  
  // category of this event
  category: EventCategoryEnum;
  categoryFreeform: string;
  
  // size of the event
  size: EventSizeEnum;
  sizeFreeform: string;
  
  // getOriginId: () => {};
}

const getEventById = async function (externalId: string) {
        
    let result = await eaCache.events.find({
        selector: {
            "externalId": {
                $eq: externalId
            }
        }
    }).exec();

    if (result && result.length === 1) {
      return result[0];
    } else {
      return [];
    }

};

export { getEventById }