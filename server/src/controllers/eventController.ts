import { Request, Response, NextFunction } from 'express';
import config from '../config/config'
import { log } from '../utils/logger'
import { MeetupEventSource } from './MeetupEventSource';
import { EventbriteEventSource } from './EventbriteEventSource';

const getEvents = function (req: Request, res: Response, next: NextFunction) {

    let result: Array<string> = [];

    let eventbriteES = new EventbriteEventSource();
    let meetupES = new MeetupEventSource();

    // let events = eventbriteES.searchEvent("something_good"

    for (let source of config.sources) {
        
        if (source.enabled) {

            log.info('executing getEvent for source: ' + source.id)
            // for (let e of await eventbriteES.searchEvent("brol")) {
            //     result.push(e)
            // }
        }
    }

    // try {
    //     res.json());

    // } catch (error) {
    //     next(error);
    // }
    res.status(200)
    res.send(result)
};

export { getEvents }