import { useParams } from "react-router";
import EventContext from "../context/EventContext";
import { useContext } from "react";
import EventTimeline from "./EventTimeline";

function SharedEventTimeline() {

    const { setIsSharedTimeline, setSharedTimelineId } = useContext(EventContext);
    const { shareId } = useParams();

    if (shareId !== undefined) {        
        setIsSharedTimeline(true);
        setSharedTimelineId(shareId);
        console.log("SHARE ID from anonymous: " + shareId);

    } else {
        setIsSharedTimeline(false);
        setSharedTimelineId('');
        console.log("SHARE ID: " + shareId);
    }

    return (
        <>
            <EventTimeline/>
            {/* TEST */}
        </>
    )
}

export { SharedEventTimeline }