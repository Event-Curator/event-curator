import { useParams } from "react-router";
import EventContext from "../context/EventContext";
import { useContext } from "react";
import EventTimeline from "./EventTimeline";
import type { FullEventType } from "../types";

// function SharedTimeline({ timelineId }: { timelineId: string }) {
function SharedEventTimeline() {

    const { likedEvents, setLikedEvents, setEvents, isSharedTimeline, setIsSharedTimeline } = useContext(EventContext);
    const { shareId } = useParams();

    let dummyEvent: FullEventType[] = [{
            "id": "45ad8aefe13de5aa6d11ae87cb497e6c",
            "externalId": "45ad8aefe13de5aa6d11ae87cb497e6c",
            "originId": "45ad8aefe13de5aa6d11ae87cb497e6c",
            "originUrl": "https://tokyocheapo.com/events/sawara-summer-grand-festival/",
            "name": "RANDOM DUMMY SHIT",
            "description": "RANDOM DUMMY SHIT",
            "teaserText": "you name it !",
            "teaserMedia": "/media/b37fb26dace9268f4e5c06ed1cf586bc.jpg",
            "teaserFreeform": "",
            "placeLattitude": 35,
            "placeLongitude": 140,
            "placeFreeform": "SHIT !!",
            "placeSuburb": "",
            "placeCity": "Minamiboso",
            "placeProvince": "Tokyo Prefecture",
            "placeCountry": "Japan",
            "budgetMin": 0,
            "budgetMax": 0,
            "budgetCurrency": "YEN",
            "budgetFreeform": "Free",
            "datetimeFrom": new Date(),
            "datetimeTo": new Date(),
            "datetimeFreeform": "10:00am – 10:00pm",
            "category": "Other",
            "categoryFreeform": "Festival",
            "size": "M",
            "sizeFreeform": "",
        }];

    if (shareId !== undefined) {
        
        setIsSharedTimeline(true);
        // setLikedEvents(dummyEvent);
        console.log("SHARE ID: " + shareId);
    } else {
        setIsSharedTimeline(false);
        console.log("SHARE ID: " + shareId);
    }

    return (
        <>
            <EventTimeline/>
        </>
    )
}

export { SharedEventTimeline }