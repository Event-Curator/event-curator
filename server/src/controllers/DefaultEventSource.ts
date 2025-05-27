import { IEventSource } from "../models/event.js"
import * as pe from "../models/event.js"

class DefaultEventSource implements IEventSource {
  id = "default-event-source";

  constructor () {
    // empty for now
  }
  
  public getId(): string {
    return this.id
  };

  searchEvent(query: string): Promise<Array<pe.EventType>>  {
    let events = new Array()
    events.push("event test 1")
    events.push("event test 2")

    return new Promise( () => events )
  }
}

export { DefaultEventSource }