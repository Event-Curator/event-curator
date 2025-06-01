import dotenv from 'dotenv'
import { LocalEventSource } from '../controllers/LocalEventSource.js';
import { JapancheapoEventSource } from '../controllers/JapancheapoEventSource.js';
import { DefaultEventSource } from '../controllers/DefaultEventSource.js';
import { EventbriteEventSource } from '../controllers/EventbriteEventSource.js';
import { MeetupEventSource } from '../controllers/MeetupEventSource.js';

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
        controller: new DefaultEventSource()

    },
    {
        id: "eventbrite",
        enabled: false,
        endpoint: "https://www.eventbriteapi.com/v3",
        controller: new EventbriteEventSource()
    },
    {
        id: "meetup",
        enabled: false,
        endpoint: "https://meetup.brol/xxxx",
        controller: new MeetupEventSource()

    },
    {
        id: "local",
        enabled: false,
        endpoint: "file:///data/dummy.json",
        controller: new LocalEventSource()
    },
    {
        id: "japancheapo",
        enabled: true,
        endpoint: "https://japancheapo.com/events",
        controller: new JapancheapoEventSource()
    }
]

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    // FIXME: have a json file instead ?
    sources: _source
}


export default config;
