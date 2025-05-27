import { Request, Response, NextFunction } from 'express';
import config from '../utils/config.js'
import { log } from '../utils/logger.js'
import { MeetupEventSource } from './MeetupEventSource.js';
import { EventbriteEventSource } from './EventbriteEventSource.js';
import * as pe from "../models/event.js"
import { LocalEventSource } from './LocalEventSource.js';

const getEvents = async function (req: Request, res: Response, next: NextFunction) {
    
    let result: Array<pe.EventType> = [];
    let providers: Array<Promise<Array<pe.EventType>>> = [];

    let eventbriteES = new EventbriteEventSource();
    let meetupES = new MeetupEventSource();
    let localES = new LocalEventSource();

    for (let source of config.sources) {
        
        if (source.enabled) {

            log.info('executing getEvent for source: ' + source.id)
            // providers.push(eventbriteES.searchEvent("test"));
            // providers.push(meetupES.searchEvent("test"));
            providers.push(localES.searchEvent("test"));
            
            let [_result1, _result2] = await Promise.all(providers);

            result = _result1.concat(_result2)
            // result.push('{ id: 1, name: "test"}')

            // for (let e of ) {
            //     result.push(e)
            // }
        }
    }

    res.status(200)
    res.send(result)
};

export { getEvents }