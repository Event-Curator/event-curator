import { Request, Response, NextFunction } from 'express';
import config from '../config/config'
import { log } from '../utils/logger'
import { MeetupEventSource } from './MeetupEventSource';
import { EventbriteEventSource } from './EventbriteEventSource';

const getEvents = async function (req: Request, res: Response, next: NextFunction) {

    let result: Array<string> = [];

    let eventbriteES = new EventbriteEventSource();
    let meetupES = new MeetupEventSource();

    // let events = eventbriteES.searchEvent("something_good"

    for (let source of config.sources) {
        
        if (source.enabled) {

            log.info('executing getEvent for source: ' + source.id)
            let _result1 = await eventbriteES.searchEvent("brol");
            let _result2 = await meetupES.searchEvent("brol");

            result = _result1.concat(_result2)
            // result.push('{ id: 1, name: "test"}')

            // for (let e of ) {
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