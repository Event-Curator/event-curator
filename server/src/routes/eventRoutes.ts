import { Router } from 'express';
import { getEvents } from '../controllers/eventController';
import apicache from 'apicache';

const router = Router();
let cache = apicache.middleware();

// router.get('/events', cache('5 minutes'), getEvents);
router.get('/events', getEvents);

export default router;
