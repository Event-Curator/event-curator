import { Router } from "express";
import { getEvents } from "../controllers/eventController.js";
import dummyDataController from "../controllers/dummyData.controller.js";
import apicache from "apicache";

const router = Router();
let cache = apicache.middleware();

// router.get('/events', cache('5 minutes'), getEvents);
router.get("/events", getEvents);
router.use("/dummy-data", dummyDataController);

export default router;
