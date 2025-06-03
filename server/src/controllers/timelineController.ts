import { Request, Response, NextFunction } from 'express';
import knex from '../knex.js';
import { log } from '../utils/logger.js';

interface TimelineRequestBody {
  user_uid: string;
  event_id: string;
}

const createTimelineEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_uid, event_id } = req.body as TimelineRequestBody;

    if (!user_uid || !event_id) {
      res.status(400).json({ error: 'Missing user_uid or event_id' });
      return;
    }

    log.info(`Inserting timeline entry for user: ${user_uid}, event: ${event_id}`);

    const result = await knex('user_events')
      .insert({
        user_uid,
        event_id
      })
      .returning(['user_uid', 'event_id', 'joined_at']);

    res.status(201).json({
      message: 'Timeline entry created',
      data: result[0]
    });

  } catch (error) {
    log.error('Error inserting timeline entry', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get all events for a user
const getEventsForUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user_uid } = req.params;

  if (!user_uid) {
    res.status(400).json({ error: 'Missing user_uid in URL params' });
    return;
  }

  try {
    log.info(`Fetching events for user: ${user_uid}`);

    const events = await knex('user_events')
      .join('events', 'user_events.event_id', '=', 'events.id')
      .select('events.*')
      .where('user_events.user_uid', user_uid);

    res.status(200).json({ user_uid, events });
  } catch (error) {
    log.error(`Error fetching events for user ${user_uid}:`, error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
};
export { createTimelineEntry,getEventsForUser };
