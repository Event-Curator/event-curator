import { RequestHandler } from 'express';
import {
  addTimelineEntry,
  deleteTimelineEntry,
  fetchEventsForUser,
  shareTimeline,
  getSharedTimeline,
  type SharedEntry
} from '../models/timeline.js';
import { verifyFriendship } from '../models/friend.js';
import { Event } from '../models/Event.js';
import { getEventById } from '../models/Event.js';
import moment from 'moment';
import { log } from '../utils/logger.js';

interface TimelineRequestBody {
  user_uid: string;
  event_id: string;
  schedule_date: string;
}

/**
 * Controller: create a new timeline entry
 */

interface CreateBody   { event_external_id: string, created_at: Date }
interface DeleteBody   { event_external_id: string, created_at: Date }
interface PublishBody  { timestamp: string }
interface FriendParams { friendUid: string }

// ── Create a new timeline entry ─────────────────────────────────
export const createTimelineEntry: RequestHandler<{}, any, CreateBody> =
async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userUid = req.user.uid;
  const { event_external_id, created_at } = req.body;
  if (!event_external_id) {
    res.status(400).json({ error: 'Missing event_external_id' });
    return;
  }

  try {
    log.info(`Inserting timeline entry for ${userUid} → ${event_external_id}`);
    const entry = await addTimelineEntry(userUid, event_external_id, created_at);
    res.status(201).json({ message: 'Created', data: entry });
  } catch (err) {
    log.error('createTimelineEntry error:', err);
    next(err);
  }
};

// ── Delete a timeline entry ──────────────────────────────────────
export const deleteTimelineEntryCtrl: RequestHandler<{}, any, DeleteBody> =
async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userUid = req.user.uid;
  const { event_external_id, created_at } = req.body;
  if (!event_external_id) {
    res.status(400).json({ error: 'Missing event_external_id' });
    return;
  }

  try {
    log.info(`Deleting timeline entry for ${userUid} → ${event_external_id} → ${created_at}`);
    const count = await deleteTimelineEntry(userUid, event_external_id, created_at);
    res.status(200).json({ message: 'Deleted', count });
  } catch (err) {
    log.error('deleteTimelineEntry error:', err);
    next(err);
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
    if (!userUid) {
      res.status(400).json({ error: 'Missing user_uid in URL params' });
      return;
    }
    log.info(`Fetching events for user: ${userUid}`);
    const events = await fetchEventsForUser(userUid.toString());

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

    res.status(200).json({ userUid, fullEvents });

  } catch (err) {
    log.error(`getEventsForUser error for ${userUid}:`, err);
    next(err);
  }
};

// ── Fetch all events for a friend ────────────────────────────────
export const getEventsOfFriendCtrl: RequestHandler =
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

  const userUid = req.user.uid;

  try {
    const signature = await shareTimeline(userUid);
    log.info(`Publishing timeline for ${userUid} at ${signature}`);
    res.status(201).json({ signature });
  } catch (err) {
    log.error('publishTimeline error:', err);
    next(err);
  }
};

// ── Fetch the latest public snapshot for a user ─────────────────
export const getSharedTimelineCtrl: RequestHandler<any> =
async (req, res, next) => {
  const signature = req.params.signature;
  try {
    log.info(`signature ${signature}`);
    const events = await getSharedTimeline(signature);

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

    res.status(200).json( fullEvents );

  } catch (err) {
    next(err);
  }
};
