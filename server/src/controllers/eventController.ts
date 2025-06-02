import { Request, Response, NextFunction } from 'express';
import config from '../utils/config.js'
import { log } from '../utils/logger.js'
import { ES_SEARCH_IN_CACHE, EventType } from "../models/Event.js"
import { LocalEventSource } from './LocalEventSource.js';
import { eaCache } from '../middlewares/apiGateway.js';

// FIXME: scrap: find a way to avoid // runs
const scrapEvent = async function (req: Request, res: Response, next: NextFunction) {
    
    let result: Array<EventType> = [];
    let providers: Array<Promise<Array<EventType>>> = [];

    const sourceId = req.params.sourceId || 'default';

    let [controllerConfig] = config.sources.filter( c => c.id === sourceId );

    if (controllerConfig === undefined) {
        res.status(404);
        res.send(`the requested datasource is not found [${sourceId}]`);
        return;
    }
    
    if (!controllerConfig.enabled) {
        res.status(404);
        res.send(`the requested datasource is not enabled [${sourceId}]`);
        return;
    }

    console.log(`scraping of datasource [${sourceId}] started`);

    result = await controllerConfig.controller.scrapEvent();
    
    log.info(`caching objects ...`);
    for (let event of result) {
        if (await findEvent(event.externalId)) {
            log.warn(`Oops: duplicate on ${event.externalId}`);
            // FIXME: do an update
            continue;
        }

        // console.log(event);

        await eaCache.events.insert({
            // FIXME: shoud be something, not 0
            id: event.externalId,
            externalId: event.externalId,
            originId: event.originId,
            originUrl: event.originUrl,
            name: event.name,
            description: event.description,

            teaserText: event.teaserText,
            teaserMedia: event.teaserMedia,
            teaserFreeform: event.teaserFreeform,

            placeLattitude: event.placeLattitude,
            placeLongitude: event.placeLongitude,
            placeFreeform: event.placeFreeform,

            budgetMin: event.budgetMin,
            budgetMax: event.budgetMax,
            budgetCurrency: event.budgetCurrency,
            budgetFreeform: event.budgetFreeform,

            datetimeFrom: event.datetimeFrom.toISOString(),
            datetimeTo: event.datetimeTo.toISOString(),
            datetimeFreeform: event.datetimeFreeform,

            category: event.category,
            categoryFreeform: event.categoryFreeform,

            size: event.size,
            sizeFreeform: event.sizeFreeform,
        });

    }

    res.status(200)
    res.send("scrapping done");
};

const findEvent = async function (externalId) {
    let result = await eaCache.events.find({
        selector: {
            "externalId": {
                $eq: externalId
            }
        }
    }).exec();
    return result.length > 0 ? true : false;
}

const searchEvent = async function (req: Request, res: Response, next: NextFunction) {
    
    let result: Array<EventType> = [];
    let providers: Array<Promise<Array<EventType>>> = [];

    const query = req.query.query || '.*';

    // first send out the promise to search against the internal cach
    log.debug(`query string is: [${query}]`);
    log.info(`searching against internal cache`);
    providers.push(
        eaCache.events.find({
            selector: {
                description: { $regex: query, $options: 'i' } // Case-insensitive regex
            }
        }).exec()
    );

    // then send out the promise to search directly from remote source
    for (let source of config.sources) {        
        if (source.enabled && source.searchType !== ES_SEARCH_IN_CACHE) {
            log.info(`delegating search for datasource [${source.id}]`);
            providers.push(source.controller.searchEvent(query));            
        }
    }

    // wait for all results and merge them
    for (let providerResult of await Promise.all(providers)) {
        result = result.concat(providerResult);
    }
    log.info(`found ${result.length} events`);

    res.status(200)
    res.send(result)
};

const getEventById = async function (req: Request, res: Response, next: NextFunction) {
    
    let externalId = req.params.eventId;
    let result = await eaCache.events.find({
        selector: {
            "externalId": {
                $eq: externalId
            }
        }
    }).exec();

    if (result.length === 0) {
        res.status(404);
        res.send("the requested ressource is not found");
    }
    // return result.length === 1 ? result[0] : undefined;


    // let result: Array<pe.EventType> = [];
    // let providers: Array<Promise<Array<pe.EventType>>> = [];

    // const sourceId = req.params.sourceId || 'default';

    // for (let source of config.sources) {        
    //     if (source.enabled) {

    //         log.info(`delegating search for datasource [${source.id}]`);
            
    //         // push the search Promise into the providers queue
    //         providers.push(source.controller.searchEvent("test"));            
    //     }
        
    //     for (let providerResult of await Promise.all(providers)) {
    //         result = result.concat(providerResult);
    //     }
    //     log.info(`found ${result.length} events`);
    // }
    res.status(200);
    res.send(result);
};

export { scrapEvent, searchEvent, getEventById }