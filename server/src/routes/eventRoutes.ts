import { Router } from 'express';
import { getEvents } from '../controllers/eventController'

const router = Router();

router.get('/events', getEvents);

export default router;

