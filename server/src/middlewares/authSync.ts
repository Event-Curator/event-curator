// server/src/syncFirebaseUsers.ts

import admin from 'firebase-admin';
import knex from '../knex.js';
import { log } from '../utils/logger.js';
import type { ServiceAccount } from 'firebase-admin';
import serviceAccountRaw from '../../../serviceAccountKey.json' with { type: 'json' };

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountRaw as ServiceAccount),
});

const auth = admin.auth();

/**
 * Syncs all Firebase Auth users into the local `users` table.
 * Uses paginated listing and bulk inserts per page.
 * @returns The total number of users processed.
 */
export async function syncFirebaseUsers(): Promise<number> {
  log.info('Starting Firebase user sync…');
  let totalProcessed = 0;
  let nextPageToken: string | undefined = undefined;

  do {
    // List up to 1000 users per page
    const { users, pageToken } = await auth.listUsers(1000, nextPageToken);
    if (users.length === 0) {
      log.info('No more users to process.');
      break;
    }

    // Map Firebase user records to DB rows
    const rows = users.map(user => ({
      uid: user.uid,
      email: user.email || '',
      display_name: user.displayName || null,
      email_verified: user.emailVerified,
      photo_url: user.photoURL || null,
      created_at: new Date(user.metadata.creationTime || Date.now())
    }));
    console.log(rows);
    // Bulk insert with conflict ignore on `uid`
    await knex('users')
      .insert(rows)
      .onConflict('uid')
      .ignore();

    totalProcessed += rows.length;
    log.info(`Processed ${rows.length} users (total: ${totalProcessed})`);

    nextPageToken = pageToken;
  } while (nextPageToken);

  log.info(`Firebase sync complete. Total users processed: ${totalProcessed}`);
  return totalProcessed;
}
syncFirebaseUsers();