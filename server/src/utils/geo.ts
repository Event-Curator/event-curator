import md5 from "md5";
import { eaCache } from "../middlewares/apiGateway.js";
import { Event } from "../models/Event.js";
import { log } from "./logger.js";
import { getConfig, sleep } from "./util.js";
import * as geolib from 'geolib';

const OSM_GEOCODING_URL="https://nominatim.openstreetmap.org/search"

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

    if (cachedContent.length > 0) {
        log.debug(`cache hit for location: ${event.placeFreeform.toLocaleLowerCase()}`);
        event.placeLongitude = cachedContent[0]._data.long;
        event.placeLattitude = cachedContent[0]._data.lat;
        return new Promise((resolve) => resolve(event))
    }
    log.warn(`cache miss for location: ${event.placeFreeform.toLocaleLowerCase()}. querying OSM`);

    const myConfig = getConfig(eventsourceId);
    let placeToLookup = `${event.placeFreeform}`;

    if (myConfig.homeCountry) {
        // remove other reference of the country in case of
        placeToLookup = `${placeToLookup.replace(myConfig.homeCountry, '')}, ${myConfig.homeCountry.toLowerCase()}`;
    }

    let url = `${OSM_GEOCODING_URL}?format=jsonv2&q=${placeToLookup}`;
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

        // cache if something was found
        await eaCache.geocoding.insert({
            id: md5(event.placeFreeform.toLocaleLowerCase()),
            long: event.placeLongitude,
            lat: event.placeLattitude,
        });
    }

    await sleep(2*1000);

    return event;
}

export { geocodeAddress, getDistance };