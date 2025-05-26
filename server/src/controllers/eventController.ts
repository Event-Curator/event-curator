import { Request, Response, NextFunction } from 'express';
import { events, Event } from '../models/event'

const getEvents = (req: Request, res: Response, next: NextFunction) => {
    events.push({ id: 1, name: "test"})
    events.push({ id: 2, name: "test2"})
    events.push({ id: 3, name: "test3"})
    try {
        res.json(events);
    } catch (error) {
        next(error);
    }
};

export { getEvents }