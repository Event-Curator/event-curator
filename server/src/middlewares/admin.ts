import admin from 'firebase-admin';

import serviceAccountRaw from "../../../serviceAccountKey.json" with {type: "json"};
import type { ServiceAccount } from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountRaw as ServiceAccount),
});

export const auth = admin.auth();