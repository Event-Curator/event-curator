class DefaultEventSource {
    constructor() {
        this.id = "default-event-source";
        // empty for now
    }
    getId() {
        return this.id;
    }
    ;
    searchEvent(query) {
        let events = new Array();
        events.push("event test 1");
        events.push("event test 2");
        return new Promise(() => events);
    }
}
export { DefaultEventSource };
