var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DefaultEventSource } from "./DefaultEventSource.js";
class MeetupEventSource extends DefaultEventSource {
    constructor() {
        super(...arguments);
        this.id = "meetup";
    }
    getId() {
        return this.id;
    }
    ;
    searchEvent(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let events = new Array();
            events.push("MEETUP event test 1");
            events.push("MEETUP event test 2");
            return new Promise((resolve, reject) => resolve(events));
        });
    }
}
export { MeetupEventSource };
