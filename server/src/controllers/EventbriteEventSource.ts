import { log } from '../utils/logger';
import { DefaultEventSource } from './DefaultEventSource';

class EventbriteEventSource extends DefaultEventSource {

  id = "eventbrite";

  public get Id(): string {
    return this.id;
  };

  searchEvent(query: string): Promise<Array<string>> {
    log.debug("got query: ", query);
    let events = new Array();
    events.push("EVENTBRITE event test 1");
    events.push("EVENTBRITE event test 2");
    log.debug(events);

    return new Promise( (resolve, reject) => resolve(events) );
  }
}

export { EventbriteEventSource }