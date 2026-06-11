import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// If the build was produced without the Firebase env vars (e.g. missing CI
// secrets), `getAuth()` throws `auth/invalid-api-key` at module load and the
// whole app white-screens. Guard it: skip init and let the app run in
// local/guest mode (auth & cloud sync disabled) instead of crashing.
export const firebaseReady = Boolean(firebaseConfig.apiKey);

let app = null;
let db = null;
let storage = null;
let auth = null;

if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} else if (typeof console !== 'undefined') {
  console.warn(
    '[Firebase] Configuration absente (VITE_FIREBASE_* manquantes) — ' +
    'mode local/invité actif : connexion et synchronisation désactivées.'
  );
}

export { db, storage, auth };
