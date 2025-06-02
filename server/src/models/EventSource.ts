import * as pe from "./Event.js";

/**
 * every event source must implement this interface
 * so their data can be injected into the feed seamlessly
 */
export interface IEventSource {
  getId: () => string; // must return the lowercase key that can be found in the sources.json config file

  searchEvent: (query: string) => Promise<Array<pe.EventType>>;
}
