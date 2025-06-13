// src/controllers/timelineController.ts

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
import { getEventById, Event } from '../models/Event.js';
import { log } from '../utils/logger.js';

interface CreateBody   { event_external_id: string }
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
  const { event_external_id } = req.body;
  if (!event_external_id) {
    res.status(400).json({ error: 'Missing event_external_id' });
    return;
  }

  try {
    log.info(`Inserting timeline entry for ${userUid} → ${event_external_id}`);
    const entry = await addTimelineEntry(userUid, event_external_id);
    res.status(201).json({ message: 'Created', data: entry });
  } catch (err) {
    log.error('createTimelineEntry error:', err);
    next(err);
  }
};

// ── Delete a timeline entry ──────────────────────────────────────
export const deleteTimelineEntryCtrl: RequestHandler<{}, any, CreateBody> =
async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userUid = req.user.uid;
  const { event_external_id } = req.body;
  if (!event_external_id) {
    res.status(400).json({ error: 'Missing event_external_id' });
    return;
  }

  try {
    log.info(`Deleting timeline entry for ${userUid} → ${event_external_id}`);
    const count = await deleteTimelineEntry(userUid, event_external_id);
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
    log.info(`Fetching timeline for ${userUid}`);
    const rows = await fetchEventsForUser(userUid);

    const seen: string[] = [];
    const fullEvents: Event[] = [];
    for (const { event_external_id } of rows) {
      if (!seen.includes(event_external_id)) {
        seen.push(event_external_id);
        const ev = await getEventById(event_external_id);
        fullEvents.push(ev._data);
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

// ── Fetch the latest public snapshot for a user ─────────────────
export const getSharedTimelineCtrl: RequestHandler<FriendParams> =
async (req, res, next) => {
  const userUid = req.params.friendUid;
  try {
    log.info(`Fetching shared timeline for ${userUid}`);
    const shared: SharedEntry[] = await getSharedTimeline(userUid);
    res.status(200).json({ user_uid: userUid, shared });
  } catch (err) {
    log.error(`getSharedTimeline error for ${userUid}:`, err);
    next(err);
  }
};
