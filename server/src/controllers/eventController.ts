import { Request, Response, NextFunction } from 'express';
import config from '../utils/config.js'
import { log } from '../utils/logger.js'
import { MeetupEventSource } from './MeetupEventSource.js';
import { EventbriteEventSource } from './EventbriteEventSource.js';

const getEvents = async function (req: Request, res: Response, next: NextFunction) {
    
    let result: Array<string> = [];
    let providers: Array<Promise<Array<string>>> = [];

    let eventbriteES = new EventbriteEventSource();
    let meetupES = new MeetupEventSource();

    // let events = eventbriteES.searchEvent("something_good"

    for (let source of config.sources) {
        
        if (source.enabled) {

            log.info('executing getEvent for source: ' + source.id)
            providers.push(eventbriteES.searchEvent("brol"));
            providers.push(meetupES.searchEvent("brol"));

            let [_result1, _result2] = await Promise.all(providers);

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