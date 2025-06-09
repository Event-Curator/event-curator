import { createTimelineEntry,getEventsForUser,getEventsOfFriend } from "../controllers/timelineController.js";
import { befriendUser } from "../controllers/socialController.js";
import { Router } from "express";
import  authenticateFirebaseToken  from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/events/users/friend",authenticateFirebaseToken,befriendUser)
router.post("/events/users/timeline", authenticateFirebaseToken,createTimelineEntry);
router.get("/events/users/timeline",authenticateFirebaseToken,getEventsForUser)
router.get("/events/users/timeline/:user_id",authenticateFirebaseToken,getEventsOfFriend)
export default router;