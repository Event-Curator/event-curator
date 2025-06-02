import { auth } from './admin.js';

export async function syncFirebaseUsers(nextPageToken) {
  const result = await auth.listUsers(1000, nextPageToken);
  if (result.pageToken) {
    await syncFirebaseUsers(result.pageToken);
  }
}
