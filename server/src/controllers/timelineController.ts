import { Request, Response, NextFunction } from 'express';
import * as TimelineModel from '../models/timeline.js';
import { log } from '../utils/logger.js';
import { verifyFriendship } from '../models/friend.js';
import { Event } from '../models/Event.js';
import { getEventById } from '../models/Event.js';
import moment from 'moment';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

interface TimelineRequestBody {
  user_uid: string;
  event_id: string;
  schedule_date: string;
}

/**
 * Controller: create a new timeline entry
 */
export const createTimelineEntry = async (
  // req: Request<{}, {}, {}, TimelineRequestBody>,
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_uid, event_id, created_at } = req.body;
    if (!user_uid || !event_id || !created_at) {
      res.status(400).json({ error: 'Missing user_uid or event_id or created_at' });
      return;
    }

    // we add one day to take into account the TZ while truncating the timepart
    // let ymd = moment(created_at).add(1, 'day').toISOString().slice(0,10);
    
    log.info(`Inserting timeline entry for user: ${user_uid}, event: ${event_id}, date: ${created_at}`);
    const entry = await TimelineModel.addTimelineEntry(user_uid, event_id, created_at);

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
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_uid, event_id, created_at } = req.body;
    if (!user_uid || !event_id || !created_at) {
      res.status(400).json({ error: 'Missing user_uid, event_id or created_at' });
      return;
    }

    log.info(`Removing timeline entry for user: ${user_uid}, event: ${event_id}, date: ${created_at}`);
    const entry = await TimelineModel.deleteTimelineEntry(user_uid, event_id, created_at);

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
    let scheduleDedup: string[] = [];

    for (let event of events) {
      
      // FIXME: we don't care about timezone issue for now, but we should at some point.
      // let datetimeSchedule = moment(event.created_at).format('YYYY-MM-DDT00:00:00.000') + 'Z';
      let datetimeSchedule = moment(event.created_at).toISOString();
      
      // dup checker: avoid the same event more than once for a given day
      if (scheduleDedup.indexOf(datetimeSchedule) < 0) {

        let fullEvent = await getEventById(event.event_external_id);
        scheduleDedup.push(datetimeSchedule);

        // we don't need all the stuff from RxDB
        let ev = {...fullEvent._data};
        ev.datetimeSchedule = datetimeSchedule;
        fullEvents.push(ev);
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
