import { createTimelineEntry,getEventsForUser } from "../controllers/timelineController.js";
import { befriendUser } from "../controllers/socialController.js";
import { Router } from "express";
const router = Router();
router.post("/events/users/friend",befriendUser)
router.post("/events/users/timeline", createTimelineEntry);
router.get("/events/users/timeline",getEventsForUser)
export default router;