import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import serviceAccountRaw from "../../../serviceAccountKey.json" with { type: "json" };
import type { ServiceAccount } from "firebase-admin";
import knex from "../knex.js"; // Adjust the path to your knex instance

const serviceAccount = serviceAccountRaw as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

declare module "express-serve-static-core" {
  interface Request {
    user?: admin.auth.DecodedIdToken & { uid?: string };
  }
}

const authenticateFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    if (!email) {
      res.status(400).json({ error: "No email found in token" });
      return;
    }

    const userRecord = await knex("users")
      .select("uid")
      .where({ email })
      .first();

    if (!userRecord) {
      res.status(404).json({ error: "User not found in database" });
      return;
    }

    req.user = { ...decodedToken, uid: userRecord.uid };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

export default authenticateFirebaseToken;
