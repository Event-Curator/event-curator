import { DefaultEventSource } from "./DefaultEventSource.js";
import { EventType } from "../models/Event.js";
import makeRandomEventsArr from "../models/dummyData.model.js";

class DummyDataSource extends DefaultEventSource {
  id = "dummydata";

  async provideEvents(numberOfEvents: number): Promise<EventType[]> {
    console.log("number of events (in DummyDataSource:", numberOfEvents);

    const dummyEvents = makeRandomEventsArr(numberOfEvents);
    console.log("length of dummy data array:", dummyEvents.length);
    console.log("preview in DummyDataSource:", dummyEvents.slice(0, 3));

    return new Promise((resolve) => resolve(dummyEvents));
  }
}

export default DummyDataSource;
