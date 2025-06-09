import knex from '../knex.js';

export interface FriendRow {
  user_uid: string;
  friend_uid: string;
}

export interface UserSummary {
  uid: string;
  email: string;
  display_name: string;
  photo_url: string;
  created_at: Date;
}

/**
 * Insert a bidirectional friendship into the `friend` table.
 * Will ignore if the pair already exists.
 */
export async function addFriendship(userUid: string, friendUid: string): Promise<void> {
  await knex<FriendRow>('friend')
    .insert([
      { user_uid: userUid,   friend_uid: friendUid },
      { user_uid: friendUid, friend_uid: userUid   }
    ])
    .onConflict(['user_uid', 'friend_uid'])
    .ignore();
}

/**
 * Fetch all friends for a given user, joining on the users table
 * to return basic profile info.
 */
export async function fetchFriendsForUser(userUid: string): Promise<UserSummary[]> {
  return knex<FriendRow>('friend')
    .join('users', 'friend.friend_uid', '=', 'users.uid')
    .select(
      'users.uid as uid',
      'users.email as email',
      'users.display_name as display_name',
      'users.photo_url as photo_url',
      'users.created_at as created_at'
    )
    .where('friend.user_uid', userUid);
}

/**
 * Verify if two users are friends.
 * Returns true if a friendship row exists for the given pair.
 */
export async function verifyFriendship(userUid: string, friendUid: string): Promise<boolean> {
  const row = await knex<FriendRow>('friend')
    .first()
    .where({ user_uid: userUid, friend_uid: friendUid });
  return !!row;
}
