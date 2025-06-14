// src/controllers/friend.controller.ts

import { Request, Response, NextFunction } from 'express';
import * as FriendModel from '../models/friend.js';
import { log } from '../utils/logger.js';

interface FriendRequestBody {
  user_uid: string;
  friend_uid: string;
}

// Create bidirectional friendship
export const befriendUser = async (
  req: Request<{}, {}, FriendRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const { user_uid, friend_uid } = req.body;

    if (!user_uid || !friend_uid || user_uid === friend_uid) {
      res.status(400).json({ error: 'Invalid user_uid or friend_uid' });
      return;
    }

    log.info(`Creating friendship between ${user_uid} and ${friend_uid}`);
    await FriendModel.addFriendship(user_uid, friend_uid);

    res.status(201).json({ message: 'Friendship established' });
    return;
  } catch (error) {
    log.error('Error creating friendship:', error);
    return;
  }
};

// Get all friends of a user
export const getFriendsForUser = async (
  req: Request<{ user_uid: string }>,
  res: Response,
): Promise<void> => {
  if (!req.user) {
  throw new Error('Auth middleware did not set req.user');
  }
  try {
    const user_uid = req.user.uid;
    if (!user_uid) {
      res.status(400).json({ error: 'Missing user_uid in URL params' });
      return;
    }

    log.info(`Fetching friends for user: ${user_uid}`);
    const friends = await FriendModel.fetchFriendsForUser(user_uid);

    res.status(200).json({ user_uid, friends });
    return;
  } catch (error) {
    log.error(`Error fetching friends for user ${req.params.user_uid}:`, error);
    return;
  }
};
interface DeleteFriendRequestBody {
  user_uid: string;
  friend_uid: string;
}
export const deleteFriendship = async (
  req: Request<{}, {}, DeleteFriendRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Auth middleware must have set req.user
    if (!req.user) {
      throw new Error('Auth middleware did not set req.user');
    }

    const authUid = req.user.uid;
    const { user_uid, friend_uid } = req.body;

    // Validate body
    if (!user_uid || !friend_uid) {
      res.status(400).json({ error: 'Missing user_uid or friend_uid' });
      return;
    }

    // Only allow if the authenticated user matches one side of the friendship
    if (authUid !== user_uid && authUid !== friend_uid) {
      res.status(403).json({ error: 'Not authorized to delete this friendship' });
      return;
    }

    log.info(`Deleting friendship between ${user_uid} and ${friend_uid}`);
    const deletedCount = await FriendModel.deleteFriendship(user_uid, friend_uid);

    if (deletedCount === 0) {
      res.status(404).json({
        message: 'Friendship not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Friendship deleted',
      deletedCount
    });
  } catch (err) {
    log.error('Error deleting friendship:', err);
    next(err);
  }
};