import { Router } from "express";
import { scrapEvent, searchEvent, getEvent } from "../controllers/eventController.js";
import apicache from "apicache";

const router = Router();
let cache = apicache.middleware;

// router.get('/event', cache('5 minutes'), searchEvent);
router.get('/event/search/:query', searchEvent);
router.get('/event/:eventId', getEvent);


// ------------ INTERNAL ------------- //
router.get("/internal/scrap/:sourceId", scrapEvent);

// add route to display cache performance
router.get('/cache/performance', (req, res) => {
  res.json(apicache.getPerformance())
})

// add route to display cache index
router.get('/cache/index', (req, res) => {
  res.json(apicache.getIndex())
})

// // add route to manually clear target/group
// router.get('/cache/clear/:target?', (req, res) => {
//   res.json(apicache.clear(req.params.target))
// })
export default router;
