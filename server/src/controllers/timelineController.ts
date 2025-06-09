import { Request, Response, NextFunction } from 'express';
import * as TimelineModel from '../models/timeline.js';
import { log } from '../utils/logger.js';

interface TimelineRequestBody {
  user_uid: string;
  event_id: string;
}

/**
 * Controller: create a new timeline entry
 */
export const createTimelineEntry = async (
  req: Request<{}, {}, TimelineRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user_uid, event_id } = req.body;
    if (!user_uid || !event_id) {
      res.status(400).json({ error: 'Missing user_uid or event_id' });
      return;
    }

    log.info(`Inserting timeline entry for user: ${user_uid}, event: ${event_id}`);
    const entry = await TimelineModel.addTimelineEntry(user_uid, event_id);

    res.status(201).json({
      message: 'Timeline entry created',
      data: entry
    });
  } catch (error) {
    log.error('Error inserting timeline entry', error);
    next(error);
  }
};

/**
 * Controller: retrieve all events joined by a user
 */
export const getEventsForUser = async (
  req: Request<{ user_uid: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { user_uid } = req.query;

  try {
    if (!user_uid) {
      res.status(400).json({ error: 'Missing user_uid in URL params' });
      return;
    }

    log.info(`Fetching events for user: ${user_uid}`);
    const events = await TimelineModel.fetchEventsForUser(user_uid.toString());

    res.status(200).json({ user_uid, events });

  } catch (error) {
    log.error(`Error fetching events for user ${user_uid}:`, error);
    next(error);
  }
};
