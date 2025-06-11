import { Request, Response, NextFunction } from 'express';
import * as TimelineModel from '../models/timeline.js';
import { log } from '../utils/logger.js';
import { verifyFriendship } from '../models/friend.js';
import { Event } from '../models/Event.js';
import { getDocumentById } from './CacheController.js';

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
  }
};

/**
 * Controller: delete a new timeline entry
 */
export const deleteTimelineEntry = async (
  req: Request<{}, {}, TimelineRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const { user_uid, event_id } = req.body;
    if (!user_uid || !event_id) {
      res.status(400).json({ error: 'Missing user_uid or event_id' });
      return;
    }

    log.info(`Removing timeline entry for user: ${user_uid}, event: ${event_id}`);
    const entry = await TimelineModel.deleteTimelineEntry(user_uid, event_id);

    res.status(201).json({
      message: 'Timeline entry removed',
      data: entry
    });
  } catch (error) {
    log.error('Error inserting timeline entry', error);
  }
};

/**
 * Controller: retrieve all events joined by the authenticated user
 */
export const getEventsForUser = async (
  req: Request<{}, {}, {}, { user_uid: string }>,
  res: Response,
  next:NextFunction
): Promise<void> => {
  const { user_uid } = req.query;

  try {
    if (!user_uid) {
      res.status(400).json({ error: 'Missing user_uid in URL params' });
      return;
    }
    log.info(`Fetching events for user: ${user_uid}`);
    const events = await TimelineModel.fetchEventsForUser(user_uid.toString());

    let fullEvents: Event[] = [];
    let dups: Event[] = [];

    for (let event of events) {
      if (dups.indexOf(event.event_external_id) < 0) {
        let fullEvent = await getDocumentById(event.event_external_id);
        dups.push(event.event_external_id);

        // we don't need all the stuff from RxDB
        // just get the inner data for the event
        fullEvents.push({...fullEvent._data});
      }
    }
    
    fullEvents.sort( (a, b) => new Date(a.datetimeFrom).getTime() - new Date(b.datetimeFrom).getTime() )

    res.status(200).json({ user_uid, fullEvents });

  } catch (error) {
    log.error(`Error fetching events for user ${req.user?.uid}:`, error);
    next(error);
  }
};

/**
 * Controller: retrieve all events for a friend of the authenticated user
 * Verifies the users are friends before fetching
 */
export const getEventsOfFriend = async (
  req: Request<{ user_uid: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    throw new Error('Auth middleware did not set req.user');
  }

  try {
    const currentUserUid = req.user.uid;
    const friendUid = req.params.user_uid;

    // Verify they are friends
    const isFriend = await verifyFriendship(currentUserUid, friendUid);
    if (!isFriend) {
      res.status(403).json({ error: 'Not friends with specified user' });
      return;
    }

    log.info(`Fetching events for friend: ${friendUid}`);
    const events = await TimelineModel.fetchEventsForUser(friendUid);

    res.status(200).json({ user_uid: friendUid, events });
  } catch (error) {
    log.error(`Error fetching events for friend ${req.params.user_uid}:`, error);
    next(error);
  }
};
