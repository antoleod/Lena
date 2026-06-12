import { db } from './firebaseConfig.js';
import { doc, getDoc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { getPendingEvents, markEventsSynced } from '../learning/playedEventsStore.js';
import { updateDNAFromSession } from '../learning/learningDNA.js';

// ── Keys to sync ──────────────────────────────────────────────────────────────
const STORE_KEYS = [
  { field: 'profile',      ls: 'lena:profile:v1' },
  { field: 'progress',     ls: 'lena:migration:progress:v3' },
  { field: 'rewards',      ls: 'lena:rewards:v1' },
  { field: 'errors',       ls: 'lena:errors:v1' },
  { field: 'gameProgress', ls: 'lena:gameProgress' },
  { field: 'appTime',      ls: 'lena:appTime' },
  { field: 'gameErrors',   ls: 'lena:gameErrors' },
  { field: 'pratiquerPrefs', ls: 'lena:pratiquer:prefs:v1' },
  { field: 'iconPin',       ls: 'lena:icon-pin:v2' },
  { field: 'learningDNA',  ls: 'lena:learningDNA:v1' },
];

function userDocRef(uid) {
  return doc(db, 'users', uid);
}

// ── Pull cloud → localStorage ─────────────────────────────────────────────────
export async function pullFromCloud(uid) {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return false;   // new user, nothing to restore

  const data = snap.data();
  STORE_KEYS.forEach(({ field, ls }) => {
    if (data[field] != null) {
      try {
        // iconPin is a bare base64 string (not JSON) — store it raw so the
        // child's saved code round-trips byte-identically (hashPin === loadPin).
        const value = field === 'iconPin' ? String(data[field]) : JSON.stringify(data[field]);
        localStorage.setItem(ls, value);
      } catch { /* quota */ }
    }
  });

  // Notify all stores they changed
  const events = [
    'lena-profile-change', 'lena-rewards-change',
    'lena-progress-change', 'lena-errors-change',
  ];
  events.forEach(e => window.dispatchEvent(new Event(e)));

  return true;
}

// ── Push localStorage → cloud ─────────────────────────────────────────────────
export async function pushToCloud(uid) {
  const payload = { lastSync: serverTimestamp() };

  STORE_KEYS.forEach(({ field, ls }) => {
    try {
      const raw = localStorage.getItem(ls);
      if (!raw) return;
      // iconPin is a bare base64 string, not JSON: JSON.parse would throw and the
      // field would silently never sync. Store it raw so admin recover/reset works.
      payload[field] = field === 'iconPin' ? raw : JSON.parse(raw);
    } catch { /* malformed */ }
  });

  await setDoc(userDocRef(uid), payload, { merge: true });
}

// ── Played-exercise events → per-child subcollection ──────────────────────────
// Track 1.7: drain the local-first queue to users/{uid}/children/{childId}/played_exercises.
// Only real played events live in the queue, so we never upload unplayed questions.
// Idempotent: each event keeps its eventId as the doc id, and we only clear the queue
// after the batch commit succeeds (so a failed/offline sync is retried next tick).
let playedSyncing = false;

export async function syncPlayedEvents(uid) {
  if (!uid || playedSyncing) return 0;
  const pending = getPendingEvents();
  if (pending.length === 0) return 0;

  playedSyncing = true;
  try {
    // Firestore batches cap at 500 writes; our queue is bounded at 500, but chunk to be safe.
    const CHUNK = 400;
    for (let i = 0; i < pending.length; i += CHUNK) {
      const slice = pending.slice(i, i + CHUNK);
      const batch = writeBatch(db);
      slice.forEach((event) => {
        const ref = doc(
          db, 'users', uid, 'children', event.childId || 'default',
          'played_exercises', event.eventId
        );
        batch.set(ref, { ...event, syncedAt: serverTimestamp() });
      });
      await batch.commit();
      markEventsSynced(slice.map((e) => e.eventId)); // clear only what committed
    }
    // Track 2.4: fold the just-synced events into the child's Learning DNA
    // (per-session summary; counts distinct sessionIds, not flushes).
    try { updateDNAFromSession(pending); } catch { /* DNA is best-effort */ }
    return pending.length;
  } catch {
    return 0; // offline / transient — events stay queued and retry next tick
  } finally {
    playedSyncing = false;
  }
}

// ── Auto-sync on store events (debounced) ─────────────────────────────────────
let syncTimer = null;

export function startAutoSync(uid) {
  const SYNC_EVENTS = [
    'lena-profile-change', 'lena-rewards-change',
    'lena-progress-change', 'lena-errors-change',
  ];

  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => pushToCloud(uid).catch(() => {}), 8000);
  }

  // Drain played-exercise events shortly after one is queued (separate from blob sync).
  let playedTimer = null;
  function schedulePlayedSync() {
    clearTimeout(playedTimer);
    playedTimer = setTimeout(() => syncPlayedEvents(uid).catch(() => {}), 5000);
  }

  SYNC_EVENTS.forEach(e => window.addEventListener(e, scheduleSync));
  window.addEventListener('lena-played-events-change', schedulePlayedSync);

  // Periodic sync every 2 minutes (blob + played-event retry for anything still queued).
  const interval = setInterval(() => {
    pushToCloud(uid).catch(() => {});
    syncPlayedEvents(uid).catch(() => {});
  }, 120_000);

  // Flush whatever is already queued from a previous offline session.
  syncPlayedEvents(uid).catch(() => {});

  return () => {
    SYNC_EVENTS.forEach(e => window.removeEventListener(e, scheduleSync));
    window.removeEventListener('lena-played-events-change', schedulePlayedSync);
    clearInterval(interval);
    clearTimeout(syncTimer);
    clearTimeout(playedTimer);
  };
}
