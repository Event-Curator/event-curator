import { log } from '../utils/logger.js';
import { DefaultEventSource } from './DefaultEventSource.js';
import * as pe from '../models/event.js'
import dummyData from '../../data/dummy.js'

class LocalEventSource extends DefaultEventSource {
  id = "local";
  events = new Array();

  constructor() {
    super()
  }

  public get Id(): string {
    return this.id;
  };

  searchEvent(query: string): Promise<Array<pe.EventType>> {
    log.debug("got query: ", query);
    
    let anEvent = new pe.Event()

    // example
    // anEvent.id = 1;
    // anEvent.name = "test";
    // anEvent.description = "this is a description";

    this.events = dummyData;

    log.debug(this.events);

    return new Promise( (resolve, reject) => resolve(this.events) );
  }
}

export { LocalEventSource }
