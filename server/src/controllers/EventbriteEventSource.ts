import { log } from '../utils/logger.js';
import { DefaultEventSource } from './DefaultEventSource.js';
import * as pe from "../models/event.js"

class EventbriteEventSource extends DefaultEventSource {

  id = "eventbrite";

  public get Id(): string {
    return this.id;
  };

  searchEvent(query: string): Promise<Array<pe.EventType>> {
    log.debug("got query: ", query);
    let events = new Array();
    events.push("EVENTBRITE event test 1");
    events.push("EVENTBRITE event test 2");
    log.debug(events);

    return new Promise( (resolve, reject) => resolve(events) );
  }
}

export { EventbriteEventSource }
