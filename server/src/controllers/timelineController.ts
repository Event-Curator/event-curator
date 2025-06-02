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

export { createTimelineEntry };
