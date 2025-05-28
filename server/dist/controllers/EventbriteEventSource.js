import { log } from '../utils/logger.js';
import { DefaultEventSource } from './DefaultEventSource.js';
class EventbriteEventSource extends DefaultEventSource {
    constructor() {
        super(...arguments);
        this.id = "eventbrite";
    }
    get Id() {
        return this.id;
    }
    ;
    searchEvent(query) {
        log.debug("got query: ", query);
        let events = new Array();
        events.push("EVENTBRITE event test 1");
        events.push("EVENTBRITE event test 2");
        log.debug(events);
        return new Promise((resolve, reject) => resolve(events));
    }
}
export { EventbriteEventSource };
