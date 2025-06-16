// src/routes/timeline.routes.ts
import { Router } from "express";
import authenticateFirebaseToken from "../middlewares/authMiddleware.js";

import {
  createTimelineEntry,
  getEventsForUserCtrl,
  getEventsOfFriendCtrl,
  deleteTimelineEntryCtrl,
  publishTimelineCtrl,
  getSharedTimelineCtrl,
} from "../controllers/timelineController.js";

import {
  befriendUser,
  deleteFriendship,
} from "../controllers/socialController.js";
const router = Router();

// ── Social ──────────────────────────────────────────────────────
router.post(
  "/events/users/friend",
  authenticateFirebaseToken,
  befriendUser
);
router.delete(
  "/events/users/friend",
  authenticateFirebaseToken,
  deleteFriendship
);

// ── Timeline (self) ─────────────────────────────────────────────
router.post(
  "/events/users/timeline",
  authenticateFirebaseToken,
  createTimelineEntry
);
router.get(
  "/events/users/timeline",
  authenticateFirebaseToken,
  getEventsForUserCtrl
);
router.delete(
  "/events/users/timeline",
  authenticateFirebaseToken,
  deleteTimelineEntryCtrl
);

// ── Timeline (friend) ────────────────────────────────────────────
router.get(
  "/events/users/timeline/:friendUid",
  authenticateFirebaseToken,
  getEventsOfFriendCtrl
);

// ── Publish snapshot ────────────────────────────────────────────
router.post(
  "/events/users/timeline/publish",
  // authenticateFirebaseToken,
  publishTimelineCtrl
);
// ── Publish snapshot ────────────────────────────────────────────
router.get(
  "/events/users/timeline/shared/:signature",
  getSharedTimelineCtrl
);
export default router;
