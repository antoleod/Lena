import { auth } from './firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  linkWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Thrown by the sign-in helpers when Firebase isn't configured in this build.
function notConfigured() {
  return Object.assign(new Error('Firebase not configured'), { code: 'auth/unconfigured' });
}

export function onAuthChange(callback) {
  // No Firebase → report "guest" immediately so the app renders in local mode.
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth ? auth.currentUser : null;
}

/**
 * "Remember me": local persistence keeps the session across restarts,
 * session persistence forgets it when the tab/app closes.
 */
export async function setAuthPersistence(remember) {
  if (!auth) return;
  try {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  } catch {
    // Non-fatal (e.g. unsupported environment) — fall back to SDK default.
  }
}

export async function signUpEmail(email, password, displayName) {
  if (!auth) throw notConfigured();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export async function signInEmail(email, password) {
  if (!auth) throw notConfigured();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInGoogle() {
  if (!auth) throw notConfigured();
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function signInAnon() {
  if (!auth) throw notConfigured();
  const cred = await signInAnonymously(auth);
  return cred.user;
}

export async function linkAnonWithGoogle() {
  if (!auth) throw notConfigured();
  const cred = await linkWithPopup(auth.currentUser, googleProvider);
  return cred.user;
}

/** True when the signed-in user can change an email/password (not Google-only/anon/guest). */
export function hasEmailPasswordProvider() {
  const u = auth?.currentUser;
  return !!u && u.providerData.some(p => p.providerId === 'password');
}

/**
 * Change the email/password account password. Firebase requires a recent login,
 * so we re-authenticate with the current password first.
 */
export async function changeEmailPassword(currentPassword, newPassword) {
  if (!auth) throw notConfigured();
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw Object.assign(new Error('No password account'), { code: 'auth/no-password-account' });
  }
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
}

export async function signOutUser() {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Send a password-reset email. Callable by anyone holding the address (Firebase
 * never reveals whether it exists), so it works for the admin "a parent forgot
 * their password" flow without any backend. Only email/password accounts have a
 * password to reset — Google/anonymous/guest/child-icon-PIN accounts do not.
 */
export async function sendPasswordReset(email) {
  if (!auth) throw notConfigured();
  await sendPasswordResetEmail(auth, email);
}
