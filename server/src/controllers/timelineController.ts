// src/controllers/timelineController.ts
import { RequestHandler } from 'express';
import {
  addTimelineEntry,
  deleteTimelineEntry,
  fetchEventsForUser,
  shareTimeline
} from '../models/timeline.js';
import { verifyFriendship } from '../models/friend.js';
import { Event } from '../models/Event.js';
import { getEventById } from '../models/Event.js';
import moment from 'moment';

interface TimelineRequestBody {
  user_uid: string;
  event_id: string;
  schedule_date: string;
}

/**
 * Controller: create a new timeline entry
 */
export const createTimelineEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_uid, event_id, created_at } = req.body;
    if (!user_uid || !event_id || !created_at) {
      res.status(400).json({ error: 'Missing user_uid or event_id or created_at' });
      return;
    }

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
    if (!user_uid || !event_id) {
      res.status(400).json({ error: 'Missing user_uid, event_id' });
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

// ── Fetch all events for the authenticated user ─────────────────
export const getEventsForUserCtrl: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userUid = req.user.uid;
  try {
    log.info(`Fetching timeline for ${userUid}`);
    const rows = await fetchEventsForUser(userUid);

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
    fullEvents.sort((a, b) =>
      new Date(a.datetimeFrom).getTime() - new Date(b.datetimeFrom).getTime()
    );

    res.status(200).json({ user_uid: userUid, events: fullEvents });
  } catch (err) {
    log.error(`getEventsForUser error for ${userUid}:`, err);
    next(err);
  }
};

// ── Fetch all events for a friend ────────────────────────────────
export const getEventsOfFriendCtrl: RequestHandler= 
async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const currentUser = req.user.uid;
  const friendUid   = req.params.friendUid;
  try {
    if (!(await verifyFriendship(currentUser, friendUid))) {
      res.status(403).json({ error: 'Not friends' });
      return;
    }

    log.info(`Fetching timeline for friend ${friendUid}`);
    const rows = await fetchEventsForUser(friendUid);
    res.status(200).json({ user_uid: friendUid, events: rows });
  } catch (err) {
    log.error(`getEventsOfFriend error:`, err);
    next(err);
  }
};

// ── Publish the user’s timeline snapshot ─────────────────────────
export const publishTimelineCtrl: RequestHandler<{}, any, PublishBody> = 
async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userUid  = req.user.uid;
  const { timestamp } = req.body;
  if (!timestamp) {
    res.status(400).json({ error: 'Missing timestamp' });
    return;
  }
  const publishAt = new Date(timestamp);
  if (isNaN(publishAt.getTime())) {
    res.status(400).json({ error: 'Invalid timestamp' });
    return;
  }

  try {
    log.info(`Publishing timeline for ${userUid} at ${publishAt.toISOString()}`);
    const shared = await shareTimeline(userUid);
    res.status(201).json({ shared });
  } catch (err) {
    log.error('publishTimeline error:', err);
    next(err);
  }
};
