var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Event_originUrl;
import md5 from 'md5';
export var EventSizeEnum;
(function (EventSizeEnum) {
    EventSizeEnum[EventSizeEnum["XS"] = 0] = "XS";
    EventSizeEnum[EventSizeEnum["S"] = 1] = "S";
    EventSizeEnum[EventSizeEnum["M"] = 2] = "M";
    EventSizeEnum[EventSizeEnum["L"] = 3] = "L";
    EventSizeEnum[EventSizeEnum["XL"] = 4] = "XL";
})(EventSizeEnum || (EventSizeEnum = {}));
export var EventCategoryEnum;
(function (EventCategoryEnum) {
    EventCategoryEnum[EventCategoryEnum["MUSIC"] = "Music"] = "MUSIC";
    EventCategoryEnum[EventCategoryEnum["BUSINESS"] = "Business & Professional"] = "BUSINESS";
    EventCategoryEnum[EventCategoryEnum["FOOD"] = "Food & Drink"] = "FOOD";
    EventCategoryEnum[EventCategoryEnum["COMMUNITY"] = "Community & Culture"] = "COMMUNITY";
    EventCategoryEnum[EventCategoryEnum["PERFORMANCE"] = "Performing & Visual Arts"] = "PERFORMANCE";
    EventCategoryEnum[EventCategoryEnum["MEDIA"] = "Film, Media & Entertainment"] = "MEDIA";
    EventCategoryEnum[EventCategoryEnum["SPORT"] = "Sports & Fitness"] = "SPORT";
    EventCategoryEnum[EventCategoryEnum["HEALTH"] = "Health & Wellness"] = "HEALTH";
    EventCategoryEnum[EventCategoryEnum["SCIENCE"] = "Science & Technology"] = "SCIENCE";
    EventCategoryEnum[EventCategoryEnum["TRAVEL"] = "Travel & Outdoor"] = "TRAVEL";
    EventCategoryEnum[EventCategoryEnum["CHARITY"] = "Charity & Causes"] = "CHARITY";
    EventCategoryEnum[EventCategoryEnum["RELIGION"] = "Religion & Spirituality"] = "RELIGION";
    EventCategoryEnum[EventCategoryEnum["FAMILY"] = "Family & Education"] = "FAMILY";
    EventCategoryEnum[EventCategoryEnum["SEASONAL"] = "Seasonal & Holiday"] = "SEASONAL";
    EventCategoryEnum[EventCategoryEnum["GOV"] = "Government & Politics"] = "GOV";
    EventCategoryEnum[EventCategoryEnum["FASHION"] = "Fashion & Beauty"] = "FASHION";
    EventCategoryEnum[EventCategoryEnum["HOME"] = "Home & Lifestyle"] = "HOME";
    EventCategoryEnum[EventCategoryEnum["AUTO"] = "Auto, Boat & Air"] = "AUTO";
    EventCategoryEnum[EventCategoryEnum["HOBBIES"] = "Hobbies & Special Interest"] = "HOBBIES";
    EventCategoryEnum[EventCategoryEnum["SCHOOL"] = "School Activities"] = "SCHOOL";
    EventCategoryEnum[EventCategoryEnum["OTHER"] = "Other"] = "OTHER";
})(EventCategoryEnum || (EventCategoryEnum = {}));
export class Event {
    constructor() {
        // private properties (setter usage mandatory)
        _Event_originUrl.set(this, void 0);
        this.id = 0;
        this.externalId = "";
        this.originId = "";
        __classPrivateFieldSet(this, _Event_originUrl, "", "f");
        this.name = "";
        this.description = "";
        this.placeLattitude = 0;
        this.placeLongitude = 0;
        this.entrancePriceMin = 0;
        this.entrancePriceMax = 0;
        this.entranceCurrency = "USD";
        this.datetimeStart = new Date();
        this.datetimeEnd = new Date();
        this.category = EventCategoryEnum.OTHER;
        this.size = EventSizeEnum.M;
    }
    set originUrl(value) {
        __classPrivateFieldSet(this, _Event_originUrl, value, "f");
        this.originId = md5(__classPrivateFieldGet(this, _Event_originUrl, "f").toLocaleLowerCase());
    }
}
_Event_originUrl = new WeakMap();
