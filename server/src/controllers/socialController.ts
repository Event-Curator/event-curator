import { Request, Response, NextFunction } from 'express';
import knex from '../knex.js';
import { log } from '../utils/logger.js';

interface FriendRequestBody {
  user_uid: string;
  friend_uid: string;
}

// Endpoint: POST /social/befriend
const befriendUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user_uid, friend_uid } = req.body as FriendRequestBody;

  if (!user_uid || !friend_uid || user_uid === friend_uid) {
    return res.status(400).json({ error: 'Invalid user_uid or friend_uid' });
  }

  try {
    log.info(`Creating friendship between ${user_uid} and ${friend_uid}`);

    // Insert bidirectional friendship (optional — many systems do this)
    await knex('friend').insert([
      { user_uid, friend_uid },
      { user_uid: friend_uid, friend_uid: user_uid },
    ]).onConflict(['user_uid', 'friend_uid']).ignore();

    res.status(201).json({ message: 'Friendship established' });
  } catch (error) {
    log.error('Error creating friendship:', error);
    res.status(500).json({ error: 'Failed to create friendship' });
  }
};

export { befriendUser };
