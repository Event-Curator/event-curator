import dotenv from 'dotenv'
import { LocalEventSource } from '../controllers/LocalEventSource.js';
import { JapancheapoEventSource } from '../controllers/JapancheapoEventSource.js';
import { DefaultEventSource } from '../controllers/DefaultEventSource.js';
import { AllsportdbEventSource } from '../controllers/AllsportdbEventSource.js';
import { MeetupEventSource } from '../controllers/MeetupEventSource.js';
import { ES_SEARCH_IN_CACHE } from '../models/Event.js';
import { JapantravelEventSource } from '../controllers/JapantravelEventSource.js';

dotenv.config()

interface Config {
    port: number;
    nodeEnv: string;
    sources: Array<any>;
}

let _source = [
    {
        id: "default",
        enabled: false,
        endpoint: "https://ceciestundefaut.com/",
        controller: new DefaultEventSource(),
        searchType: ES_SEARCH_IN_CACHE
    },
    {
        id: "allsportdb",
        enabled: false,
        endpoint: "https://api.allsportdb.com/v3",
        controller: new AllsportdbEventSource(),
        searchType: ES_SEARCH_IN_CACHE
    },
    {
        id: "meetup",
        enabled: false,
        endpoint: "https://meetup.brol/xxxx",
        controller: new MeetupEventSource(),
        searchType: ES_SEARCH_IN_CACHE
    },
    {
        id: "local",
        enabled: false,
        endpoint: "file:///data/dummy.json",
        controller: new LocalEventSource(),
        searchType: ES_SEARCH_IN_CACHE
    },
    {
        id: "japancheapo",
        enabled: false,
        endpoint: "https://japancheapo.com/events",
        controller: new JapancheapoEventSource(),
        searchType: ES_SEARCH_IN_CACHE
    },
    {
        id: "japantravel",
        enabled: true,
        endpoint: "https://fr.japantravel.com/events?type=event",
        controller: new JapantravelEventSource(),
        searchType: ES_SEARCH_IN_CACHE
    }
]

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    // FIXME: have a json file instead ?
    sources: _source
}


export default config;
