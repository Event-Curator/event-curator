import { Request, Response, NextFunction } from 'express';
import knex from '../knex.js';
import { log } from '../utils/logger.js';

interface FriendRequestBody {
  user_uid: string;
  friend_uid: string;
}

// Create bidirectional friendship
const befriendUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_uid, friend_uid } = req.body as FriendRequestBody;

    if (!user_uid || !friend_uid || user_uid === friend_uid) {
      res.status(400).json({ error: 'Invalid user_uid or friend_uid' });
      return;
    }

    log.info(`Creating friendship between ${user_uid} and ${friend_uid}`);

    await knex('friend').insert([
      { user_uid, friend_uid },
      { user_uid: friend_uid, friend_uid: user_uid }
    ]).onConflict(['user_uid', 'friend_uid']).ignore();

     res.status(201).json({ message: 'Friendship established' });
  } catch (error) {
    log.error('Error creating friendship:', error);
    res.status(500).json({ error: 'Failed to create friendship' });
  }
};

// Get all friends of a user
const getFriendsForUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user_uid } = req.params;

  if (!user_uid) {
    res.status(400).json({ error: 'Missing user_uid in URL params' });
    return;
  }

  try {
    log.info(`Fetching friends for user: ${user_uid}`);

    const friends = await knex('friend')
      .join('users', 'friend.friend_uid', '=', 'users.uid')
      .select('users.uid', 'users.email', 'users.display_name', 'users.photo_url', 'users.created_at')
      .where('friend.user_uid', user_uid);

    res.status(200).json({ user_uid, friends });
  } catch (error) {
    log.error(`Error fetching friends for user ${user_uid}:`, error);
    res.status(500).json({ error: 'Failed to retrieve friends' });
  }
};

export { befriendUser, getFriendsForUser };
