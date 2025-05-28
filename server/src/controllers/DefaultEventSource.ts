// import { EventType } from "../models/event.js";
import { IEventSource } from "../models/EventSource.js"
// import * as pe from "../models/Event.js"
import { EventType } from "../models/event.js"

class DefaultEventSource implements IEventSource {
  id = "default-event-source";

  constructor () {
    // empty for now
  }
  
  public getId(): string {
    return this.id
  };

  searchEvent(query: string): Promise<Array<EventType>>  {
    let events = new Array()
    events.push("event test 1")
    events.push("event test 2")

    return new Promise( () => events )
  }
}

export { DefaultEventSource }
