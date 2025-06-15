import knex from '../knex.js';

export interface TimelineEntry {
  user_uid: string;
  event_external_id: string;
  joined_at: Date;
}

export interface SharedEntry {
  user_uid: string;
  event_external_id: string;
  shared_at: Date;
}

/**
 * Inserts a new timeline entry for a user and returns the created record
 */
export async function addTimelineEntry(
  userUid: string,
  eventExternalId: string
): Promise<TimelineEntry> {
  const [entry] = await knex('user_events')
    .insert({ user_uid: userUid, event_external_id: eventExternalId })
    .returning([
      'user_uid',
      'event_external_id',
      { column: 'created_at' }
    ]);
  return entry;
}

/**
 * Fetches all event_external_id values joined by a given user
 */
export async function fetchEventsForUser(
  userUid: string
): Promise<{ event_external_id: string }[]> {
  return knex('user_events')
    .select('event_external_id')
    .where('user_uid', userUid);
}

/**
 * Deletes a timeline entry for a specific user and external event ID.
 */
export async function deleteTimelineEntry(
  userUid: string,
  eventExternalId: string
): Promise<number> {
  return knex('user_events')
    .where({ user_uid: userUid, event_external_id: eventExternalId })
    .del();
}

/**
 * Takes a snapshot of the user's current timeline (event_external_id list),
 * clears any previous share, and writes it into `shared_timeline`.
 * Returns the rows that were inserted.
 */
export async function shareTimeline(
  userUid: string
): Promise<SharedEntry[]> {
  // Grab the user's current event_external_id list
  const events = await knex('user_events')
    .select('event_external_id')
    .where('user_uid', userUid);

  // Prepare payload for shared_timeline
  const payload = events.map(e => ({
    user_uid: userUid,
    event_external_id: e.event_external_id,
  }));

  // Clear old snapshot
  await knex('shared_timeline')
    .where('user_uid', userUid)
    .del();

  // Insert new snapshot and return it
  const inserted = await knex('shared_timeline')
    .insert(payload)
    .returning([
      'user_uid',
      'event_external_id',
      'shared_at'
    ]);

  return inserted as SharedEntry[];
}

/**
 * Fetches the latest public snapshot for a user.
 */
export async function getSharedTimeline(
  userUid: string
): Promise<SharedEntry[]> {
  return knex('shared_timeline')
    .select('user_uid', 'event_external_id', 'shared_at')
    .where('user_uid', userUid);
}
