import { Request, Response, NextFunction } from 'express';
import config from '../utils/Config.js'
import { log } from '../utils/Logger.js'
import { MeetupEventSource } from './MeetupEventSource.js';
import { EventbriteEventSource } from './EventbriteEventSource.js';
// import * as pe from "../models/Event.js"
import { LocalEventSource } from './LocalEventSource.js';
import { JapancheapoEventSource } from './JapancheapoEventSource.js';
import { EventType } from "../models/Event.js"

const getEvents = async function (req: Request, res: Response, next: NextFunction) {
    
    let result: Array<EventType> = [];
    let providers: Array<Promise<Array<EventType>>> = [];

    let eventbriteES = new EventbriteEventSource();
    let meetupES = new MeetupEventSource();
    let localES = new LocalEventSource();
    let JapancheapoES = new JapancheapoEventSource();

    for (let source of config.sources) {
        
        if (source.enabled) {

            log.info('executing getEvent for source: ' + source.id)
            // FIXME: when they will be ready
            providers.push(localES.searchEvent("test"));
            providers.push(JapancheapoES.searchEvent("test"));

            let [_result1, _result2] = await Promise.all(providers);
            result = _result1.concat(_result2)
        }
    }

    res.status(200)
    res.send(result)
};

export { getEvents }