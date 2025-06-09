import dotenv from 'dotenv'
import { LocalEventSource } from '../controllers/LocalEventSource.js';
import { JapancheapoEventSource } from '../controllers/JapancheapoEventSource.js';
import { DefaultEventSource } from '../controllers/DefaultEventSource.js';
import { AllsportdbEventSource } from '../controllers/AllsportdbEventSource.js';
import { MeetupEventSource } from '../controllers/MeetupEventSource.js';
import { ES_SEARCH_IN_CACHE } from '../models/Event.js';
import { EventSourceConfigType } from '../models/EventSource.js';
import { JapanconcertticketsEventSource } from '../controllers/JapanconcertticketsEventSource.js';

dotenv.config()

interface Config {
    port: number;
    nodeEnv: string;
    backupSchedule: string;
    backupTarget: string;
    sources: Array<EventSourceConfigType>;
}

let _source: Array<EventSourceConfigType> = [
    {
        id: "default",
        enabled: false,
        endpoint: "https://ceciestundefaut.com/",
        controller: new DefaultEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: ""
    },
    {
        id: "allsportdb",
        enabled: true,
        endpoint: "https://api.allsportdb.com/v3",
        controller: new AllsportdbEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: ""
    },
    {
        id: "meetup",
        enabled: false,
        endpoint: "https://meetup.brol/xxxx",
        controller: new MeetupEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: ""
    },
    {
        id: "local",
        enabled: false,
        endpoint: "file:///data/dummy.json",
        controller: new LocalEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: ""
    },
    {
        id: "japancheapo",
        enabled: true,
        endpoint: "https://japancheapo.com/events",
        controller: new JapancheapoEventSource(),
        searchType: ES_SEARCH_IN_CACHE,
        homeCountry: 'japan'
    }
]

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    // FIXME: have a json file instead ?
    sources: _source,
    backupSchedule: "0 22 * * *",
    // sql:table or file:folder
    // in all case, the latest file or record will be restored at startup
    backupTarget: "../backups"
}

// some sanity checks
if (config.backupTarget.endsWith('/')) {
    config.backupTarget = 
        config.backupTarget.substring(0, config.backupTarget.length - 1);
}

export default config;
