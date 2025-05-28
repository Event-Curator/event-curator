import { log } from '../utils/logger.js';
import { DefaultEventSource } from './DefaultEventSource.js';
import dummyData from '../../data/dummy.js';
class LocalEventSource extends DefaultEventSource {
    constructor() {
        super();
        this.id = "local";
        this.events = new Array();
    }
    get Id() {
        return this.id;
    }
    ;
    searchEvent(query) {
        log.debug("got query: ", query);
        // example
        // let anEvent = new pe.Event()
        // anEvent.id = 1;
        // anEvent.name = "test";
        // anEvent.description = "this is a description";
        // anEvent.originUrl = "http://blah";
        this.events = dummyData;
        // this.events.push(anEvent);
        // console.log(this.events.length);
        // console.log("hello !");
        return new Promise((resolve, reject) => resolve(this.events));
    }
}
export { LocalEventSource };
