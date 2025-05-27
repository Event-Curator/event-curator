import { DefaultEventSource } from "./DefaultEventSource.js";

class MeetupEventSource extends DefaultEventSource {

    id = "meetup";

    public getId(): string {
        return this.id
    };

  async searchEvent(query: string): Promise<Array<string>> {
    let events = new Array()
    events.push("MEETUP event test 1")
    events.push("MEETUP event test 2")
    return new Promise((resolve, reject) => resolve(events))
  }

    // public get name(): string {
    //     return this._name;
    // }

    // public set name(value: string) {
    //     this._name = value;
    // }
}

export { MeetupEventSource }