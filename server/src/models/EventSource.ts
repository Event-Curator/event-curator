import * as pe from "./Event.js";

/**
 * every event source must implement this interface
 * so their data can be injected into the feed seamlessly
 */
export interface IEventSource {
  getId: () => string; // must return the lowercase key that can be found in the sources.json config file

  searchEvent: (query: Array<object>) => Promise<Array<pe.EventType>>;
  
  // scrap as much as we can from the remote source
  scrapEvent: () => Promise<Array<pe.EventType>>;
}

export type EventSourceConfigType = {
  id: string,
  enabled: boolean,
  endpoint: string
  controller: IEventSource,
  searchType: number,
  homeCountry: string
}
