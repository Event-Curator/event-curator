import dotenv from 'dotenv'
import { LocalEventSource } from '../controllers/LocalEventSource.js';
import { JapancheapoEventSource } from '../controllers/JapancheapoEventSource.js';
import { DefaultEventSource } from '../controllers/DefaultEventSource.js';
import { AllsportdbEventSource } from '../controllers/AllsportdbEventSource.js';
import { MeetupEventSource } from '../controllers/MeetupEventSource.js';
import { ES_SEARCH_IN_CACHE } from '../models/Event.js';
import { EventSourceConfigType, languageEnum } from '../models/EventSource.js';
import { JapanconcertticketsEventSource } from '../controllers/JapanconcertticketsEventSource.js';
import { geocodingTypeEnum } from '../models/Model.js';

dotenv.config()

interface Config {
    port: number;
    nodeEnv: string;
    backupSchedule: string;
    backupTarget: string;
    mediaStoragePath: string;
    sources: Array<EventSourceConfigType>;
}

let _source: Array<EventSourceConfigType> = [
    {
        id: "default",
        enabled: false,
        endpoint: "https://ceciestundefaut.com/",
        controller: new DefaultEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "allsportdb",
        enabled: true,
        endpoint: "https://api.allsportdb.com/v3",
        controller: new AllsportdbEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "meetup",
        enabled: false,
        endpoint: "https://meetup.brol/xxxx",
        controller: new MeetupEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "local",
        enabled: false,
        endpoint: "file:///data/dummy.json",
        controller: new LocalEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "japancheapo",
        enabled: true,
        endpoint: "https://japancheapo.com/events",
        controller: new JapancheapoEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: 'japan',
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP
    },
    {
        id: "japanconcerttickets",
        enabled: true,
        endpoint: "https://www.japanconcerttickets.com/wp-admin/admin-ajax.php",
        controller: new JapanconcertticketsEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: "japan",
        contentLanguage: languageEnum.EN,
        geocodingLookupType: geocodingTypeEnum.OPENSTREETMAP,
    }
]

// paths are relative to SERVER folder
const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    // FIXME: have a json file instead ?
    sources: _source,
    backupSchedule: "0 22 * * *",
    // sql:table or file:folder
    // in all case, the latest file or record will be restored at startup
    // backupTarget: "file:../backups",
    backupTarget: "sql:backups",
    mediaStoragePath: process.env.MEDIA_STORAGE_PATH || "..\media"
}

// some sanity checks
if (config.backupTarget.endsWith('/')) {
    config.backupTarget = 
        config.backupTarget.substring(0, config.backupTarget.length - 1);
}

export default config;
