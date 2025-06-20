import { IEventSource } from "../models/EventSource.js"
import * as pe from "../models/Event.js"


class DefaultEventSource implements IEventSource {
  id = "default-event-source";

  constructor () {
    // empty for now
  }
  
  public getId(): string {
    return this.id
  };

  scrapEvent(): Promise<Array<pe.EventType>>  {
    // FIXME: set a default implementation here ?
    let events = new Array()
    return new Promise( () => events )
  }

  searchEvent(query: Object[]): Promise<Array<pe.EventType>>  {
    let events = new Array()
    events.push("event test 1")
    events.push("event test 2")

    return new Promise( () => events )
  }
}

export { DefaultEventSource }
