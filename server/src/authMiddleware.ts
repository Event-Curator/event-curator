import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import serviceAccountRaw from "./serviceAccountKey.json";
import type { ServiceAccount } from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountRaw as ServiceAccount),
  });
}

// Extend Express Request type to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: admin.auth.DecodedIdToken;
  }
}

// Auth middleware
const authenticateFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

export default authenticateFirebaseToken;
