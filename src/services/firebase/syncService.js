import { db } from './firebaseConfig.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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
        localStorage.setItem(ls, JSON.stringify(data[field]));
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
      if (raw) payload[field] = JSON.parse(raw);
    } catch { /* malformed */ }
  });

  await setDoc(userDocRef(uid), payload, { merge: true });
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

  SYNC_EVENTS.forEach(e => window.addEventListener(e, scheduleSync));

  // Periodic sync every 2 minutes
  const interval = setInterval(() => pushToCloud(uid).catch(() => {}), 120_000);

  return () => {
    SYNC_EVENTS.forEach(e => window.removeEventListener(e, scheduleSync));
    clearInterval(interval);
    clearTimeout(syncTimer);
  };
}
