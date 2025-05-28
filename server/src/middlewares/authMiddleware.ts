import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { cert } from "firebase-admin/app";
// import serviceAccountRaw from "../serviceAccountKey.json";
import serviceAccountRaw from "../../../serviceAccountKey.json" with {type: "json"};
import type { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = serviceAccountRaw as ServiceAccount;
// // const serviceAccount: ServiceAccount | undefined = process.env.GOOGLE_APPLICATION_CREDENTIALS;
// const serviceAccount: ServiceAccount | undefined | string = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
// const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // credential: cert(serviceAccount),
});
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountRaw as ServiceAccount),
    // credential: cert(serviceAccount),
  });
}

declare module "express-serve-static-core" {
  interface Request {
    user?: admin.auth.DecodedIdToken;
  }
}

const authenticateFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
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
