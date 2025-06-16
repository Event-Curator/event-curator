import fetch from 'node-fetch';
import knex from './knex.js';

const baseURL = 'http://localhost:3000/api';
const firebaseAuthUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-yjumktozWnHU4bqVuvC0VH9FiIZZK6s';

const fakeUser = {
  email: 'test@example.com',
  password: 'theirPassword',
  returnSecureToken: true
};

const testEventId = 'test-event-id'; // maps to events.external_id
let token = null;
let uid = null;

async function login() {
  console.log('🔍 TEST: Logging in...');
  try {
    const res = await fetch(firebaseAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fakeUser)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    token = data.idToken;
    uid = data.localId;

    console.log('Login successful. UID:', uid, '\n');
  } catch (err) {
    console.error('Login failed:', err, '\n');
  }
}

async function insertTestEvent() {
  console.log('🔧 TEST: Inserting test event into `events` table...');
  try {
    await knex('events').where({ external_id: testEventId }).del();
    await knex('events').insert({
      external_id: testEventId,
      created_at: knex.fn.now()
    });
    console.log('Event inserted.\n');
  } catch (err) {
    console.error('Failed to insert test event:', err, '\n');
  }
}

async function createTimelineEntry() {
  console.log('📝 TEST: Creating timeline entry...');
  try {
    const res = await fetch(`${baseURL}/events/users/timeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event_external_id: testEventId })
    });

    const data = await res.json();
    console.log('Created:', data, '\n');
  } catch (err) {
    console.error('Failed to create timeline entry:', err, '\n');
  }
}

async function getTimeline() {
  console.log('🔎 TEST: Fetching timeline...');
  try {
    const res = await fetch(`${baseURL}/events/users/timeline`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    console.log('Timeline:', data, '\n');
  } catch (err) {
    console.error('Failed to fetch timeline:', err, '\n');
  }
}

async function publishTimeline() {
  console.log('🚀 TEST: Publishing timeline snapshot...');
  try {
    const res = await fetch(`${baseURL}/events/users/timeline/publish`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // timestamp no longer required
    });

    const data = await res.json();
    console.log('Published:', data, '\n');
    return data.signature;
  } catch (err) {
    console.error('Failed to publish timeline:', err, '\n');
  }
}

async function getSharedTimeline(signature) {
  console.log('🔗 TEST: Fetching shared timeline snapshot...');
  try {
    const res = await fetch(
      `${baseURL}/events/users/timeline/shared/${signature}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    console.log('Shared Timeline:', data, '\n');
  } catch (err) {
    console.error('Failed to fetch shared timeline:', err, '\n');
  }
}

async function deleteTimelineEntry() {
  console.log('❌ TEST: Deleting timeline entry...');
  try {
    const res = await fetch(`${baseURL}/events/users/timeline`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event_external_id: testEventId })
    });

    const data = await res.json();
    console.log('Deleted:', data, '\n');
  } catch (err) {
    console.error('Failed to delete timeline entry:', err, '\n');
  }
}

async function runTests() {
  await login();
  if (!token || !uid) {
    console.error('Stopping further tests due to login failure.\n');
    return;
  }

  await insertTestEvent();
  await createTimelineEntry();
  await getTimeline();
  const signature = await publishTimeline();
  if (signature) await getSharedTimeline(signature);
  await deleteTimelineEntry();

  console.log('✅ All test cases executed.');
}

runTests();