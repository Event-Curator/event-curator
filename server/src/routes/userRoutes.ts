import { createTimelineEntry,getEventsForUser } from "../controllers/timelineController.js";
import { befriendUser } from "../controllers/socialController.js";
import { Router } from "express";
const router = Router();
router.post("/users/addToUserTimeline", createTimelineEntry);
router.post("/users/befriendUsers",befriendUser)
router.get("/users/getAllEvents",getEventsForUser)
export default router;