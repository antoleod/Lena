import { db, storage } from './firebaseConfig.js';
import {
  collection, doc, setDoc, getDoc, getDocs,
  deleteDoc, query, where, serverTimestamp,
} from 'firebase/firestore';
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage';

const COLLECTION = 'nl_recordings';

// ── Upload a new recording ───────────────────────────────────────────────────
// blob: Blob (audio/webm)
// phrase: { id, text, category }
// recordedBy: string (name/nickname of native speaker)
export async function uploadRecording(blob, phrase, recordedBy = 'Locuteur natif') {
  const storagePath = `recordings/nl/${phrase.id}.webm`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, { contentType: 'audio/webm' });
  const downloadURL = await getDownloadURL(storageRef);

  await setDoc(doc(db, COLLECTION, phrase.id), {
    phraseId:     phrase.id,
    phraseText:   phrase.text,
    phraseTextFr: phrase.fr || '',
    category:     phrase.category || 'général',
    language:     'nl',
    storagePath,
    downloadURL,
    recordedBy,
    recordedAt:   serverTimestamp(),
    duration:     phrase._duration || null,
  });

  return downloadURL;
}

// ── Fetch one recording URL (returns null if not recorded yet) ───────────────
export async function getRecordingURL(phraseId) {
  const snap = await getDoc(doc(db, COLLECTION, phraseId));
  return snap.exists() ? snap.data().downloadURL : null;
}

// ── Fetch all recorded phrase IDs (for Studio status badges) ─────────────────
export async function getAllRecordedIds() {
  const snap = await getDocs(collection(db, COLLECTION));
  const ids = {};
  snap.forEach(d => { ids[d.id] = d.data().downloadURL; });
  return ids;
}

// ── Delete a recording ───────────────────────────────────────────────────────
export async function deleteRecording(phraseId) {
  const snap = await getDoc(doc(db, COLLECTION, phraseId));
  if (!snap.exists()) return;

  const { storagePath } = snap.data();
  try {
    await deleteObject(ref(storage, storagePath));
  } catch {
    // file may already be gone
  }
  await deleteDoc(doc(db, COLLECTION, phraseId));
}

// ── Fetch recordings for a specific category ─────────────────────────────────
export async function getRecordingsByCategory(category) {
  const q = query(collection(db, COLLECTION), where('category', '==', category));
  const snap = await getDocs(q);
  const result = {};
  snap.forEach(d => { result[d.id] = d.data(); });
  return result;
}
