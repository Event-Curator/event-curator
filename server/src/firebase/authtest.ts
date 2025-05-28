import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// TypeScript + ES Module compatible `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, '../serviceAccountKey.json'), 'utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

async function listAllUsers(nextPageToken?: string): Promise<void> {
  const result = await auth.listUsers(1000, nextPageToken);
  result.users.forEach((user) => {
    console.log({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      createdAt: user.metadata.creationTime,
    });
  });

  if (result.pageToken) {
    await listAllUsers(result.pageToken);
  }
}

// Run on script execution
listAllUsers()
  .then(() => {
    console.log(' Finished fetching Firebase users.');
  })
  .catch((err) => {
    console.error(' Error:', err);
  });
