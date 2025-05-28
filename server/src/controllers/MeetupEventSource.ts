import { DefaultEventSource } from "./DefaultEventSource.js";
// import * as pe from "../models/Event.js";
import { EventType } from "../models/Event.js"

class MeetupEventSource extends DefaultEventSource {

    id = "meetup";

    public getId(): string {
        return this.id
    };

  async searchEvent(query: string): Promise<Array<EventType>> {
    let events = new Array();

    events.push("MEETUP event test 1")
    events.push("MEETUP event test 2")
    return new Promise((resolve, reject) => resolve(events))
  }
}

export { MeetupEventSource }