// Progress tracking for Lecture & Comprehension stored in localStorage.

const KEY = 'lena:lecture:v1';

import { LECTURE_UI } from './lectureI18n.js';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { read: [], exams: {} };
    return JSON.parse(raw);
  } catch {
    return { read: [], exams: {} };
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — silently ignore
  }
}

export function saveReadStory(storyId) {
  const data = load();
  if (!data.read.includes(storyId)) {
    data.read.push(storyId);
    save(data);
  }
}

export function saveExamResult(storyId, score, total) {
  const data = load();
  data.exams[storyId] = { score, total, date: new Date().toISOString() };
  save(data);
}

export function getProgress() {
  const data = load();
  return {
    read: new Set(data.read),
    exams: new Map(Object.entries(data.exams)),
  };
}

export function getTotalRead() {
  return load().read.length;
}

export function getCurrentBadge() {
  const total = getTotalRead();
  const badges = [...LECTURE_UI.badges].reverse();
  return badges.find((b) => total >= b.threshold) || null;
}
