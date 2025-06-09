import { EventSourceConfigType } from "../models/EventSource.js";
import config from "./config.js";

// await on this for a given milliseconds
async function sleep(s: number) {
    return new Promise( resolve => setTimeout( resolve, s ));
}

// return the config object for a given eventsource id
function getConfig(id: string): EventSourceConfigType {
    let [aConfig]: Array<EventSourceConfigType> = config.sources.filter( c => c.id === id );
    return aConfig;
}

export { sleep, getConfig };