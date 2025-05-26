import { DefaultEventSource } from './DefaultEventSource';

class EventbriteEventSource extends DefaultEventSource {

  id = "eventbrite";

  public get Id(): string {
    return this.id
  };

  searchEvent(query: string): Promise<Array<string>> {
    let events = new Array()
    events.push("EVENTBRITE event test 1")
    events.push("EVENTBRITE event test 2")
    return new Promise( () => events )
  }
}

export { EventbriteEventSource }