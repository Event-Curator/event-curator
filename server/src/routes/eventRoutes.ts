import { Router } from "express";
import { getEvents } from "../controllers/eventController.js";
import apicache from "apicache";
import { createTimelineEntry } from "../controllers/timelineController.js";
import { befriendUser } from "../controllers/socialController.js";
const router = Router();
let cache = apicache.middleware();

// router.get('/events', cache('5 minutes'), getEvents);
router.get("/events", getEvents);
router.post("/events/addToUserTimeline", createTimelineEntry);
router.post("/events/befriendUsers",befriendUser)
export default router;
