import { createTimelineEntry,getEventsForUser,getEventsOfFriend,deleteTimelineEntry} from "../controllers/timelineController.js";
import { befriendUser,deleteFriendship} from "../controllers/socialController.js";
import { Router } from "express";
import  authenticateFirebaseToken  from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/events/users/friend",authenticateFirebaseToken,befriendUser)
router.post("/events/users/timeline", authenticateFirebaseToken,createTimelineEntry);
router.get("/events/users/timeline",authenticateFirebaseToken,getEventsForUser)
router.get("/events/users/timeline/:user_id",authenticateFirebaseToken,getEventsOfFriend)
router.delete("/events/users/timeline",authenticateFirebaseToken,deleteTimelineEntry)
router.delete("/events/users/friend",authenticateFirebaseToken,deleteFriendship)
export default router;