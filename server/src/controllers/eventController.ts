import { Request, Response, NextFunction } from 'express';
import config from '../utils/config.js'
import { log } from '../utils/logger.js'
import { ES_SEARCH_IN_CACHE, datetimeRangeEnum, EventType, Event, EventCategoryEnum } from "../models/Event.js"
import { LocalEventSource } from './LocalEventSource.js';
import { eaCache } from '../middlewares/apiGateway.js';
import moment from 'moment';
import { geocodeAddress, getDistance, reverseGeocodeAddress } from '../utils/geo.js';
import { isRxDocument, RxDocument } from 'rxdb';
import fs from "fs";
import md5 from 'md5';

const scrapEvent = async function (req: Request, res: Response) {
    
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
        let cachedEvent = await getEvent(event.externalId);
        if (cachedEvent) {
            log.debug(`existing event found, updating data for ${event.externalId}`);

            await geocodeAddress(sourceId, event);
            await reverseGeocodeAddress(sourceId, event);
            await cachedEvent.update({
                $set: {
                    name: event.name,
                    description: event.description,

                    teaserText: event.teaserText,
                    teaserMedia: event.teaserMedia,
                    teaserFreeform: event.teaserFreeform,

                    placeLattitude: event.placeLattitude,
                    placeLongitude: event.placeLongitude,
                    placeFreeform: event.placeFreeform,
                    placeSuburb: event.placeSuburb,
                    placeCity: event.placeCity,
                    placeProvince: event.placeProvince,
                    placeCountry: event.placeCountry,

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
                }
            });

        } else {
            await geocodeAddress(sourceId, event);
            await reverseGeocodeAddress(sourceId, event);

            await eaCache.events.insert({
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
                placeSuburb: event.placeSuburb,
                placeCity: event.placeCity,
                placeProvince: event.placeProvince,
                placeCountry: event.placeCountry,

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

const getEvent = async function (externalId) {
    let result = await eaCache.events.find({
        selector: {
            "externalId": {
                $eq: externalId
            }
        }
    }).exec();
    return result.length > 0 ? result[0] : undefined;
}

const searchEvent = async function (req: Request, res: Response) {
    
    let foundEvents: Array<EventType> = [];
    let providers: Array<Promise<Array<EventType>>> = [];
    let searchTerms: Array<Object> = [];

    const name = req.query.name || '.*';
    const description = req.query.description || '.*';
    const category = req.query.category || '.*';
    const budgetMax = req.query.budgetMax || '999999';
    let datetimeFrom = req.query.datetimeFrom
        || moment().subtract(10, "year").toISOString();
    let datetimeTo = req.query.datetimeTo
        || moment().add(10, "years").toISOString();
    const datetimeRange = req.query.datetimeRange || '.*';
    const placeDistanceRange = Number(req.query.placeDistanceRange) || 0;
    const placeSuburb = req.query.placeSuburb || '.*';
    const placeCity = req.query.placeCity || '.*';
    const placeProvince = req.query.placeProvince || '.*';
    const placeCountry = req.query.placeCountry || '.*';
    const browserLat = Number(req.query.browserLat) || 0;
    const browserLong = Number(req.query.browserLong) || 0;

    // if we provide a datetimeRange, it will takes precedance over From/to
    let _datetimeFrom = moment();
    let _datetimeTo = moment();
    if (datetimeRange === datetimeRangeEnum.NEXT7DAYS) {
        _datetimeFrom.add(1, 'day').startOf('day');
        _datetimeTo.add(1, 'day').startOf('day').add(8, 'days').endOf('day');
        datetimeFrom = _datetimeFrom.toISOString();
        datetimeTo = _datetimeTo.toISOString();

    } else if (datetimeRange === datetimeRangeEnum.NEXTWEEK) {
        _datetimeFrom.add(1, 'weeks').startOf('isoWeek');
        _datetimeTo.add(1, 'weeks').startOf('isoWeek').add(7, 'days').endOf('day');
        datetimeFrom = _datetimeFrom.toISOString();
        datetimeTo = _datetimeTo.toISOString();

    } else if (datetimeRange === datetimeRangeEnum.NEXTMONTH) {
        _datetimeFrom = _datetimeFrom.add(1, 'month').startOf('month');
        _datetimeTo = _datetimeTo.add(1, 'month').endOf('month');
        datetimeFrom = _datetimeFrom.toISOString();
        datetimeTo = _datetimeTo.toISOString();

    } else if (datetimeRange === datetimeRangeEnum.THISMONTH) {
        _datetimeFrom = _datetimeFrom.startOf('month');
        _datetimeTo = _datetimeTo.endOf('month');
        datetimeFrom = _datetimeFrom.toISOString();
        datetimeTo = _datetimeTo.toISOString();
    }

    // save all the terms to delegate them for remote search
    searchTerms.push({"name": name});
    searchTerms.push({"description": description});
    searchTerms.push({"category": category});
    searchTerms.push({"budgetMax": budgetMax});
    searchTerms.push({"datetimeFrom": datetimeFrom});
    searchTerms.push({"datetimeTo": datetimeTo});
    searchTerms.push({"datetimeRange": datetimeRange});
    searchTerms.push({"placeDistanceRange": placeDistanceRange});
    searchTerms.push({"placeSuburb": placeSuburb});
    searchTerms.push({"placeCity": placeCity});
    searchTerms.push({"placeProvince": placeProvince});
    searchTerms.push({"placeCountry": placeCountry});
    searchTerms.push({"browserLat": browserLat});
    searchTerms.push({"browserLong": browserLong});

    for (let term of Object.keys(searchTerms)) {
        log.debug(`searchTerm: ${JSON.stringify(searchTerms[term])}`);
    }

    // first send out the promise to search against the internal cache
    log.info(`searching against internal cache`);
    providers.push(
        eaCache.events.find({
            selector: {
                $and: [
                    { name: { $regex: name, $options: 'i' } },
                    { description: { $regex: description, $options: 'i' } },
                    { category: { $regex: category, $options: 'i' } },

                    { placeSuburb: { $regex: placeSuburb, $options: 'i' } },
                    { placeCity: { $regex: placeCity, $options: 'i' } },
                    { placeProvince: { $regex: placeProvince, $options: 'i' } },
                    { placeCountry: { $regex: placeCountry, $options: 'i' } },
                    
                    { budgetMax: { $lt: Number(budgetMax) } },

                    { datetimeFrom: { $gt: datetimeFrom } },
                    { datetimeFrom: { $lt: datetimeTo } },

                    { placeCountry: { $in: config.includeOnlyCountry } }
                ]
            }
        }).exec().then( (documents : Array<RxDocument>) => {
            let events: Array<any> = [];
            for (let document of documents) {
                events.push(document.toMutableJSON());
            }
            return events;
        })
    );

    // then send out the promise to search directly from remote source
    for (let source of config.sources) {        
        if (source.enabled && source.searchType !== ES_SEARCH_IN_CACHE) {
            log.info(`delegating search for datasource [${source.id}]`);
            providers.push(source.controller.searchEvent(searchTerms));
        }
    }

    // wait for all results and merge them
    for (let providerResult of await Promise.all(providers)) {
        foundEvents = foundEvents.concat(providerResult);
    }

    // calculate the distance from current location for all found events, and filter them
    // if a given radius was provided
    log.debug(`filtering events in the range (meters): ${placeDistanceRange}`);
    let events: Array<EventType> = [];
    for (let foundEvent of foundEvents) {
        if (placeDistanceRange > 0) {
            foundEvent.placeDistance = await getDistance(foundEvent, browserLat, browserLong);
            if (
                foundEvent.placeDistance > 0
                && foundEvent.placeDistance <= placeDistanceRange) {
                events.push(foundEvent);
            }

        } else {
            events.push(foundEvent);
        }
    }
    log.info(`found ${events.length} events`);

    res.status(200)
    res.send(
        events.sort( (a, b) => new Date(a.datetimeFrom).getTime() - new Date(b.datetimeFrom).getTime() )
    );
};

const getEventById = async function (req: Request, res: Response) {
    
    let externalId = req.params.eventId;
    let result = await eaCache.events.find({
        selector: {
            $and: [
                { "externalId": {
                    $eq: externalId,
                } },
                { "placeCountry": { $in: config.includeOnlyCountry } }
            ]
        }
    }).exec();

    if (result.length === 0) {
        res.status(404);
        res.send("the requested ressource is not found");
        return
    }

    res.status(200);
    res.send(result);
    return
};

const getSearchHits = async function (req: Request, resp: Response) {
    let requestedIndex = req.query.key || "";
    let hits: object = {};
    hits[EventCategoryEnum.OTHER] = 0;

    log.debug(`hits for ${requestedIndex}`);

    let result = await eaCache.events.find({
        selector: {
            $and: [
                { name: { $regex: '.*', $options: 'i' } },
                { datetimeFrom: { $gt: moment().startOf('day').toISOString() }},
                { placeCountry: { $in: config.includeOnlyCountry } }
            ]
        }
    }).exec();
    
    if (result.length > 0) {
        for (let event of result) {
            let indexValue = "";
            let eventCategory = event[requestedIndex.toString()];
            let eventCategoryFreeform = event.eventCategoryFreeform;

            if (!eventCategory) {
                hits[EventCategoryEnum.OTHER]++;

            } else {
                if (hits[eventCategory] === undefined) hits[eventCategory] = 0;
                hits[eventCategory]++;
            }
        }

        let hitsList: Array<object> = [] ;
        for (let key of Object.keys(hits)) {
            let count = hits[key];
            hitsList.push({
                "name": key,
                "count": count,
                "label": `${key} (${count})`
            });
        }
        resp.status(200);
        resp.send(hitsList);
    }

    resp.status(404);
    resp.send();
}

// -------------------------- utility functions for website implementations

// wait for x ms and handle 3 fetch retry counts if something fails
// returns the html content as a string
const throtthledFetch = async function (url: string, ms: number ): Promise<string> {
    if (url === '') {
        log.error("Oops, requesting a blank url");
        return "";
    }

    let ok = false;
    let html = "";

    for (let retryCount = 0; retryCount<=3; retryCount++) {
        await sleep(ms);

        const res = await fetch(url);
        html = await res.text();

        ok = (html.indexOf("Error 1015") < 0 && html.length > 0) ? true : false;
        if (ok) break;

        log.warn(`looks we are rate limited from cloudflare, pause for 2 seconds before retrying (#${retryCount})`);
    }
    
    if (!ok) {
        log.error("looks like fetch is still blocked (error 1015) by cloudflare after 3 retry.");
    }

    return html;
}

// await this to block for x milliseconds.
const sleep = async function (s: number) {
    return new Promise( resolve => setTimeout( resolve, s ));
}

// save the media behind a given url locally and return the "local url" (or undefined if error)
// the return path can be used as the new filepath below express static "/media"
const saveMedia = async function (url: string) {
    
    try {
        const mediaResp = await fetch(url);
        
        if (mediaResp.status != 200) {
            log.warn(`unable to fetch media: ${url}`);
            return undefined;
        }
        
        const mediaBlob = await mediaResp.blob();
        const buffer = Buffer.from( await mediaBlob.arrayBuffer() );
        
        let fileExtension = "blob";
        let lastUrlPart = url.split('/').pop() || "";
        if (lastUrlPart.indexOf('.') > 0 && lastUrlPart.indexOf('/') < 0) {
            fileExtension = lastUrlPart.split('.').pop() || "blob";
        }

        const fileName = `${md5(url)}.${fileExtension}`.toLocaleLowerCase();
        const filePath = `${config.mediaStoragePath}/${fileName}`;
        
        // only download if the same path didn't exist locally
        // FIXME: compate last-modified header and local timestamp
        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (err) {
                fs.writeFileSync(`${config.mediaStoragePath}/${fileName}`, buffer)
                log.debug(`media saved: ${url} ${mediaBlob.type} (${mediaBlob.size} bytes)`);
            }
        })
        
        return `/media/${fileName}`;

    } catch (e) {
        log.error(`unable to save the image in [${config.mediaStoragePath}/]`);
        log.error(`current path is: ${process.cwd}`);
        log.error(e);
        // FIXME: put some default here in case the fetch is unable to connect/fails

        return "";
    }
}

const debugHtml = function(t: unknown): undefined | string {
    if (t === undefined) return undefined
    else if (t === null) return 'null'
    else if (typeof t == 'bigint') throw TypeError('stringifyJSON cannot serialize BigInt')
    else if (typeof t == 'number') return String(t)
    else if (typeof t == 'boolean') return t ? 'true' : 'false'
    else if (typeof t == 'string') return '"' + t.replace(/"/g, '\\"') + '"'
    else if (typeof t == 'object') return Array.isArray(t) 
        ? '[' + Array.from(t, v => debugHtml(v) ?? 'null').join(',') + ']'
        : '{' + Object.entries(t)
                .map(([k,v]) => [debugHtml(k), debugHtml(v)])
                .filter(([k,v]) => v !== undefined)
                .map(entry => entry.join(':'))
                .join(',') + '}'
    else return undefined
}

export { 
    scrapEvent,
    searchEvent,
    getEventById,
    getSearchHits,
    throtthledFetch,
    sleep,
    saveMedia,
    debugHtml
}