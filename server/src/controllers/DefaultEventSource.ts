import { IEventSource } from "../models/event"

class DefaultEventSource implements IEventSource {

  id = "default-event-source";

  public getId(): string {
    return this.id
  };

  searchEvent(query: string): Promise<Array<string>>  {
    let events = new Array()
    events.push("event test 1")
    events.push("event test 2")

    return new Promise( () => events )
  }
}

export { DefaultEventSource }
