import dotenv from 'dotenv';
dotenv.config();
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
    }
];
const config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    // FIXME: have a json file instead ?
    sources: _source
};
export default config;
