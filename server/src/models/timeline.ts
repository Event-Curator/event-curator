import knex from '../knex.js';
import { v4 as uuidv4 } from 'uuid';

export interface TimelineEntry {
  user_uid: string;
  event_external_id: string;
  created_at: Date;
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
  eventExternalId: string,
  createdAt: Date
): Promise<TimelineEntry> {

  const [entry] = await knex('user_events')
    .insert({ user_uid: userUid, event_external_id: eventExternalId, created_at: createdAt })
    .returning([
      'user_uid',
      'event_external_id',
      'created_at'
    ]);
  return entry;
}

/**
 * Fetches all event_external_id values joined by a given user
 */
export async function fetchEventsForUser(
  userUid: string
): Promise<{ event_external_id: string, created_at: Date }[]> {
  return knex('user_events')
    .select(['event_external_id', 'created_at'])
    .where('user_uid', userUid);
}

/**
 * Deletes a timeline entry for a specific user and external event ID.
 */
export async function deleteTimelineEntry(
  userUid: string,
  eventExternalId: string,
  createdAt: Date
): Promise<number> {

  if (!createdAt) {
    // we delete all the events linked to this user/event
    const deletedCount = await knex('user_events')
    .where({
      user_uid: userUid,
      event_external_id: eventExternalId
    })
    .del();
    return deletedCount;
  }

  // we delete only this particular schedule user/event/datetime
  const deletedCount = await knex('user_events')
  .where({
    user_uid: userUid,
    event_external_id: eventExternalId,
    created_at: createdAt
  })
  .del();
  return deletedCount;
}



/**
 * Takes a snapshot of the user's current timeline (event_external_id list),
 * clears any previous share, and writes it into `shared_timeline`.
 * Returns the rows that were inserted.
 */
export async function shareTimeline(
  userUid: string
): Promise<string> {
  // 1. Grab the user's current event list
  const events = await knex('user_events')
    .select('event_external_id')
    .where('user_uid', userUid);

  if (events.length === 0) {
    // No events to snapshot; still generate a signature for consistency
    return uuidv4();
  }

  // 2. Generate a unique signature for this snapshot
  const signature = uuidv4();

  // 3. Prepare payload for shared_events
  const payload = events.map(e => ({
    user_uid: userUid,
    event_external_id: e.event_external_id,
    signature,
    shared_at: knex.fn.now(),
  }));

// 4. Insert snapshot into shared_events
  await knex('shared_timeline')
  .insert(payload);

  // 5. Return the snapshot signature
  return signature;
}

/**
 * Fetches the latest public snapshot for a user.
 */
export async function getSharedTimeline(
  signature: string
): Promise<SharedEntry[]> {
  return knex('shared_timeline')
    .select('user_uid', 'event_external_id', 'shared_at', 'signature')
    .where({signature });
}
