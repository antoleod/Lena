/**
 * playedEventsStore — local-first queue of "exercises the child actually played".
 *
 * Track 1, pillar 1 of the Mission Impossible contract (docs/MISSION-IMPOSSIBLE-CONTRACT.md).
 *
 * Design rules (from the contract):
 *   - Local-first: events are queued in localStorage and work fully offline.
 *   - Only real played events land here — never generated-but-unplayed questions.
 *   - Every event is tagged with `childId` (multi-child) and `sessionId`.
 *   - The Firebase sync layer (Track 1.7) drains this queue; this store knows nothing
 *     about Firebase, so it stays testable and offline-safe.
 */

const QUEUE_KEY   = 'lena:playedEvents:v1';   // [event, …] pending upload
const SESSION_KEY = 'lena:playedSession:v1';  // { id, startedAt, lastEventAt }

// A session ends after this much inactivity; the next event opens a fresh one.
const SESSION_IDLE_MS = 30 * 60 * 1000; // 30 min
const MAX_QUEUE = 500; // safety cap — drop oldest beyond this to bound storage

// ── Queue ───────────────────────────────────────────────────────────────────

function readQueue() {
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  try {
    const bounded = queue.length > MAX_QUEUE ? queue.slice(queue.length - MAX_QUEUE) : queue;
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(bounded));
    window.dispatchEvent(new Event('lena-played-events-change'));
  } catch {
    // ignore quota / persistence failures — local-first must never throw
  }
}

/** Append one played event to the pending queue. Returns the stored event. */
export function enqueuePlayedEvent(event) {
  const queue = readQueue();
  queue.push(event);
  writeQueue(queue);
  return event;
}

/** All events not yet confirmed synced to Firebase. */
export function getPendingEvents() {
  return readQueue();
}

/** Remove the given event ids from the queue once Firebase confirms the write. */
export function markEventsSynced(ids) {
  if (!ids || ids.length === 0) return;
  const remove = new Set(ids);
  writeQueue(readQueue().filter((e) => !remove.has(e.eventId)));
}

export function getPendingCount() {
  return readQueue().length;
}

// ── Session ───────────────────────────────────────────────────────────────────

function readSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

function newSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Returns the current session id, opening a new one if none exists or the previous
 * one went idle past SESSION_IDLE_MS. Also stamps activity so the idle window slides.
 */
export function currentSessionId() {
  const now = Date.now();
  const session = readSession();
  if (!session || now - (session.lastEventAt || session.startedAt) > SESSION_IDLE_MS) {
    const fresh = { id: newSessionId(), startedAt: now, lastEventAt: now };
    writeSession(fresh);
    return fresh.id;
  }
  writeSession({ ...session, lastEventAt: now });
  return session.id;
}
