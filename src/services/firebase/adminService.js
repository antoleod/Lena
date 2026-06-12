/**
 * Admin / operator service — dashboard reads + access help.
 *
 * Authorization is enforced by Firestore rules: an account is an admin IFF a
 * doc exists at admins/{uid} (created manually in the Firebase console). These
 * helpers will simply fail/return empty for non-admins; the in-app gate below
 * is only for UX (hide the panel), not security.
 */
import { auth, db, firebaseReady } from './firebaseConfig.js';
import { doc, getDoc, getDocs, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { hashPin } from '../../features/auth/iconPinStore.js';
import { isIconCode } from '../../features/auth/PinIcons.jsx';

/** True if the signed-in user is in the admins allowlist. */
export async function isCurrentUserAdmin() {
  const u = auth?.currentUser;
  if (!firebaseReady || !u) return false;
  try {
    const snap = await getDoc(doc(db, 'admins', u.uid));
    return snap.exists();
  } catch {
    return false; // rules deny / offline → treat as non-admin
  }
}

/**
 * Every user document (admin only — Firestore rules block non-admins).
 * Returns the raw blob plus the uid; callers parse profile/progress fields.
 */
export async function listAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

/**
 * Decode a child's stored secret code back to its icon ids. The stored value is
 * `btoa(encodeURIComponent(ids.join('|')))` (see iconPinStore.hashPin), so it is
 * reversible — an operator can RECOVER a forgotten code, not just reset it.
 * Returns an array of icon ids, or null if absent/undecodable/legacy-emoji.
 */
export function decodeChildCode(iconPinHash) {
  if (!iconPinHash || typeof iconPinHash !== 'string') return null;
  try {
    const ids = decodeURIComponent(escape(atob(iconPinHash))).split('|');
    return isIconCode(ids) ? ids : null;
  } catch {
    return null;
  }
}

/**
 * Reset a child's secret code to a new 4-icon sequence. Writing a NON-null value
 * is deliberate: pullFromCloud skips null fields, so a fresh code propagates to
 * the child's device on their next app open (then they can keep it or change it
 * in Espace parents). Only works for children with a real synced account — guest
 * kids have no cloud doc to reach.
 */
export async function resetChildCode(uid, newIconIds) {
  if (!isIconCode(newIconIds)) {
    throw new Error('Code invalide (4 icônes de l’alphabet attendues).');
  }
  await setDoc(
    doc(db, 'users', uid),
    { iconPin: hashPin(newIconIds), lastSync: serverTimestamp() },
    { merge: true }
  );
}
