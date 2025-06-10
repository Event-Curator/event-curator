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
    .insert({ user_uid: userUid, event_external_id: eventId })
    .returning(['user_uid', 'event_external_id', 'created_at']);
  return entry;
}

/**
 * Fetches all events joined by a given user, returning full event records
 */
export async function fetchEventsForUser(
  userUid: string
): Promise<any[]> {
  return knex('user_events')
    .select('user_events.event_external_id')
    .where('user_events.user_uid', userUid);
}
/**
 * Deletes a timeline entry for a specific user and event.
 */
export async function deleteTimelineEntry(
  userUid: string,
  eventExternalId: string
): Promise<number> {
  const deletedCount = await knex('user_events')
    .where({
      user_uid: userUid,
      event_external_id: eventExternalId
    })
    .del();
  return deletedCount;
}