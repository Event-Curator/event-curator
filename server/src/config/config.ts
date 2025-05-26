import dotenv from 'dotenv'

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
        endpoint: "https://ceciestundefaut.com/"
    },
    {
       id: "eventbrite",
        enabled: true,
       endpoint: "https://www.eventbriteapi.com/v3"
    },
    {
       id: "meetup",
        enabled: true,
       endpoint: "https://meetup.brol/xxxx"
    }
]

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    // FIXME: have a json file instead ?
    sources: _source
}


export default config;
