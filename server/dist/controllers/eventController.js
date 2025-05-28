var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import config from '../utils/config.js';
import { log } from '../utils/logger.js';
import { MeetupEventSource } from './MeetupEventSource.js';
import { EventbriteEventSource } from './EventbriteEventSource.js';
import { LocalEventSource } from './LocalEventSource.js';
const getEvents = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = [];
        let providers = [];
        let eventbriteES = new EventbriteEventSource();
        let meetupES = new MeetupEventSource();
        let localES = new LocalEventSource();
        for (let source of config.sources) {
            if (source.enabled) {
                log.info('executing getEvent for source: ' + source.id);
                // FIXME: when they will be ready
                // providers.push(eventbriteES.searchEvent("test"));
                // providers.push(meetupES.searchEvent("test"));
                // let [_result1, _result2] = await Promise.all(providers);
                // result = _result1.concat(_result2)
                providers.push(localES.searchEvent("test"));
                [result] = yield Promise.all(providers);
                console.log("====result>", result[0]);
            }
        }
        res.status(200);
        res.send(result);
    });
};
export { getEvents };
