import dotenv from 'dotenv'
import { log } from '../utils/logger.js';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    sources: Array<any>;
    firebase: any;
}

let _source = [
    {
        id: "default",
        enabled: false,
        endpoint: "https://ceciestundefaut.com/"
    },
    {
       id: "eventbrite",
        enabled: false,
       endpoint: "https://www.eventbriteapi.com/v3"
    },
    {
       id: "meetup",
        enabled: false,
       endpoint: "https://meetup.brol/xxxx"
    },
    {
       id: "local",
        enabled: true,
       endpoint: "file:///data/dummy.json"
    },
    {
       id: "japancheapo",
        enabled: true,
       endpoint: "https://japancheapo.com/events/"
    }
];

let getFirebaseConfig = () => {
    if (!process.env.FIREBASE_CONFIG) {
        log.error("value of FIREBASE_CONFIG value is empty");
        return "{}";
    }
    return process.env.FIREBASE_CONFIG;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    // FIXME: have a json file instead ?
    sources: _source,
    firebase: JSON.parse(getFirebaseConfig().split("'").join('"').split('£').join('\\n'))
}

export default config;
