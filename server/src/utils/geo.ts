import md5 from "md5";
import { eaCache } from "../middlewares/apiGateway.js";
import { Event } from "../models/Event.js";
import { log } from "./logger.js";
import { getConfig, sleep } from "./util.js";
import * as geolib from 'geolib';
import { geocodingTypeEnum } from "../models/Model.js";
import { endWith } from "rxjs";

const OSM_GEOCODING_URL="https://nominatim.openstreetmap.org/search"
const OSM_REVERSE_GEOCODING_URL="https://nominatim.openstreetmap.org/reverse"

async function getDistance(event: Event, lat: number, long: number): Promise<number> {
    if (lat === 0 || long === 0) return 0;
    if (event.placeLattitude === 0 || event.placeLongitude === 0) return 0;

    let distance = geolib.getDistance(
        {
            latitude: event.placeLattitude, 
            longitude: event.placeLongitude
        }, {
            latitude: lat, 
            longitude: long
        }
    );

    return distance;
}

/* from human readable to lat/long
 * we provide the whole event in case we need some other information to pin point the exact place
 * will return the same Event, but with place placeLattitude/placeLongitude/placeFormatted set
 * placeFormatted will be the reverse geocoding operation, formatted by OSM
 * !!
 * - the result is cached inside RxDB in the geocoding index
 * - there is no expiration for this 
 * ds: datasource id (ex: "japancheapo")
 * event: event to enrich
 */
async function geocodeAddress(eventsourceId: string, event: Event): Promise<Event> {

    const cacheKey = md5(event.placeFreeform.toLocaleLowerCase());
    let cachedContent = await eaCache.geocoding.find({
        selector: {
            "id": {
                $eq: md5(event.placeFreeform.toLocaleLowerCase())
            }
        }
    }).exec();

    if (cachedContent.length > 0 &&
        cachedContent[0]._data.long !== 0 &&
        cachedContent[0]._data.lat !== 0
     ) {
        log.debug(`cache hit for location: ${event.placeFreeform.toLocaleLowerCase()}`);
        event.placeLongitude = cachedContent[0]._data.long;
        event.placeLattitude = cachedContent[0]._data.lat;
        return new Promise((resolve) => resolve(event))
    }
    log.warn(`cache miss for location: ${event.placeFreeform.toLocaleLowerCase()}. querying OSM`);

    const myConfig = getConfig(eventsourceId);
    let placeToLookup = `${event.placeFreeform}`.toLowerCase();

    if (myConfig.geocodingLookupType === geocodingTypeEnum.STATICMAP) {
        let map =  myConfig.geocodingStaticMap || [];
        for (let key of Object.keys(map)) {
            if (placeToLookup.startsWith(key.toLocaleLowerCase()) 
                || placeToLookup.endsWith(key.toLocaleLowerCase())) {
                event.placeLattitude = map[key][0];
                event.placeLongitude = map[key][1];

                return event
            }
        }

        // fallback to unknow place
        event.placeLattitude = 0;
        event.placeLongitude = 0;

        return event
    }

    if (myConfig.homeCountry) {
        // remove other reference of the country in case of
        placeToLookup = `${placeToLookup.replace(myConfig.homeCountry, '')}, ${myConfig.homeCountry.toLowerCase()}`;
    }

    // we must normalize the string
    let placeToLookupN = placeToLookup.normalize('NFD').split('').filter( e => e.charCodeAt(0) < 128).join('');
    log.debug(`normalizing from ${placeToLookup} to ${placeToLookupN}`);

    let url = `${OSM_GEOCODING_URL}?format=jsonv2&q=${placeToLookupN}`;
    log.debug(`geocoding call is: ${url}`);
    let resp = await fetch(url, {
        method: "GET",
        headers: {
            "Accept-Language": "en"
        }
    });

    if (resp.status === 200) {
        let osmReplies = await resp.json();
        // there is no way to filter the address type in the query for the geocoding service
        // we can get duplicates (province and city with same name for example).
        // filter by ourself and take only city name
        // MAYBE: save other details in an adress structud field ? like display_name ?
        for (let city of  osmReplies.filter( osmReply => osmReply.addresstype === 'city')) {
            event.placeLattitude = parseFloat(city.lat);
            event.placeLongitude = parseFloat(city.lon);
        }

        // fallback on province of no city found
        if (event.placeLattitude === 0 && event.placeLongitude === 0) {
            for (let city of  osmReplies.filter( osmReply => osmReply.addresstype === 'province')) {
                event.placeLattitude = parseInt(city.lat, 10);
                event.placeLongitude = parseInt(city.lon, 10);
            }
        }

        // fallback on what's left. it can be a railway or bus stop, for example.
        // what does matter is to get the prefecture at the end. so it's ok.
        if (event.placeLattitude === 0 && event.placeLongitude === 0) {
            for (let city of osmReplies) {
                event.placeLattitude = parseInt(city.lat, 10);
                event.placeLongitude = parseInt(city.lon, 10);
                break;
            }
        }

        // cache if something was found. we can get conflict we the coordinates are too loose.
        // FIXME: like 123/43 (no decimal numbers)
        try {
            if (event.placeLattitude !== 0 && event.placeLongitude !== 0) {
                await eaCache.geocoding.insert({
                    id: md5(event.placeFreeform.toLocaleLowerCase()),
                    long: event.placeLongitude,
                    lat: event.placeLattitude,
                });
            }
        } catch (e) {
            log.error(`conflict while saving the geo cache: ` + e);
        }
    }

    await sleep(2*1000);

    return event;
}

async function reverseGeocodeAddress(eventsourceId: string, event: Event): Promise<Event> {

    const myConfig = getConfig(eventsourceId);

    // return the same event if nothing is available for reverse geocoding
    if (event.placeLongitude === 0 || event.placeLattitude === 0) {
        log.debug(`no lat/long for ${event.externalId}. unable to process reverse geocoding.`);

        if (myConfig.forceProvince) {
            event.placeProvince = myConfig.forceProvince;
            log.debug('forcing province for 0/0 content: ' + event.placeProvince);
        }
        return new Promise((resolve) => resolve(event));
    }

    const cacheKey = md5(`${event.placeLongitude}:${event.placeLattitude}`);
    let cachedContent = await eaCache.reverseGeocoding.find({
        selector: {
            "id": {
                $eq: cacheKey
            }
        }
    }).exec();

    if (cachedContent.length > 0) {
        log.debug(`cache hit for reverse geocoding: ${event.externalId}`);
        event.placeSuburb = cachedContent[0]._data.placeSuburb;
        event.placeCity = cachedContent[0]._data.placeCity;
        event.placeProvince = cachedContent[0]._data.placeProvince;
        event.placeCountry = cachedContent[0]._data.placeCountry;

        if (myConfig.forceProvince && event.placeProvince.length === 0) {
            event.placeProvince = myConfig.forceProvince;
            log.debug('forcing province for cached content: ' + event.placeProvince);
        }

        return new Promise((resolve) => resolve(event))
    }

    log.warn(`cache miss for reverse geocoding of event: ${event.externalId}. querying OSM`);

    let url = `${OSM_REVERSE_GEOCODING_URL}?format=jsonv2&lat=${event.placeLattitude}&lon=${event.placeLongitude}`;
    log.debug(`geocoding call is: ${url}`);
    let resp = await fetch(url, {
        method: "GET",
        headers: {
            "Accept-Language": "en"
        }
    });
    
    if (resp.status === 200) {
        let osmReply = await resp.json();
        
        if (! osmReply.address) {
            log.debug(`OSM was unable to process the request for ${event.externalId}: ${osmReply}`);
            return new Promise((resolve) => resolve(event))
        }

        event.placeSuburb = osmReply.address.suburb;
        event.placeCity = osmReply.address.city;

        if (myConfig.forceProvince && event.placeProvince.length === 0) {
            event.placeProvince = myConfig.forceProvince;
        } else {
            event.placeProvince = osmReply.address.province;
        }

        event.placeCountry = osmReply.address.country

        // cache if something was found
        await eaCache.reverseGeocoding.insert({
            id: cacheKey,
            placeSuburb: event.placeSuburb || "",
            placeCity: event.placeCity || "",
            placeProvince: event.placeProvince || "",
            placeCountry: event.placeCountry || "",
        });
    }

    // OSM mandatory throttling
    await sleep(2*1000);

    log.debug('forcing province for live content: ' + event.placeProvince);

    return event;
}

export { geocodeAddress, reverseGeocodeAddress, getDistance };