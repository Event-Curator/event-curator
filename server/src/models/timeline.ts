import knex from '../knex.js';

export interface TimelineEntry {
  user_uid: string;
  event_id: string;
  joined_at: Date;
}

/**
 * Inserts a new timeline entry for a user and returns the created record
 */
export async function addTimelineEntry(
  userUid: string,
  eventId: string
): Promise<TimelineEntry> {
  const [entry] = await knex('user_events')
    .insert({ user_uid: userUid, event_id: eventId })
    .returning(['user_uid', 'event_id', 'joined_at']);
  return entry;
}

/**
 * Fetches all events joined by a given user, returning full event records
 */
export async function fetchEventsForUser(
  userUid: string
): Promise<any[]> {
  return knex('user_events')
    .join('events', 'user_events.event_id', '=', 'events.id')
    .select('events.*')
    .where('user_events.user_uid', userUid);
}
