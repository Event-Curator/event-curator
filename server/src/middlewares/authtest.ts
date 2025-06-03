import admin from 'firebase-admin';
import serviceAccountRaw from "../../../serviceAccountKey.json" with {type: "json"};
import type { ServiceAccount } from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountRaw as ServiceAccount),
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
