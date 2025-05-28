var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import admin from "firebase-admin";
import serviceAccountRaw from "../../../serviceAccountKey.json" with { type: "json" };
const serviceAccount = serviceAccountRaw;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountRaw),
    });
}
const authenticateFirebaseToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    try {
        const decodedToken = yield admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
});
export default authenticateFirebaseToken;
