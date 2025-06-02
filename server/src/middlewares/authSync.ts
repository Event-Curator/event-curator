//This controller implements and exports a function,syncFirebaseUsers,to sync users data between local and remote

import type { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import knex from '../knex.js';
import { log } from '../utils/logger.js';
import type { ServiceAccount } from 'firebase-admin';
import serviceAccountRaw from '../../../serviceAccountKey.json' with { type: 'json' };

// Firebase Admin init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountRaw as ServiceAccount),
});

const auth = admin.auth();

// Controller function
export const syncFirebaseUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    log.info('Starting Firebase user sync...');
    const inserted: any[] = [];

    async function listAndInsertUsers(nextPageToken?: string): Promise<void> {
      const result = await auth.listUsers(1000, nextPageToken);

      const usersToInsert = result.users.map((user) => ({
        uid: user.uid,
        email: user.email || '',
        display_name: user.displayName || null,
        email_verified: user.emailVerified,
        photo_url: user.photoURL || null,
        created_at: new Date(user.metadata.creationTime || Date.now())
      }));

      // Insert users into DB (ignore duplicates if already exists)
      for (const userData of usersToInsert) {
        try {
          await knex('users').insert(userData).onConflict('uid').ignore();
          inserted.push(userData.uid);
        } catch (insertError) {
          log.warn(`Failed to insert user ${userData.uid}: ${insertError}`);
        }
      }

      if (result.pageToken) {
        await listAndInsertUsers(result.pageToken);
      }
    }

    await listAndInsertUsers();

    res.status(200).json({ message: 'Sync complete', count: inserted.length, users: inserted });
  } catch (error) {
    log.error('Error syncing Firebase users:', error);
    res.status(500).json({ error: 'Failed to sync users from Firebase' });
  }
};
