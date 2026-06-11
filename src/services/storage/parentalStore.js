const STORAGE_KEY = 'lena:parental:v1';

function defaultLearningControls() {
  return {
    allowMultiplication: null, // null = follow adaptive engine; true/false = parent override
    allowDivision: null,
    allowTimedQuizzes: true,
    allowAdvanced: null,       // questions above recommended difficulty
    maxDifficultyGrade: null   // canonical grade key 'P1'..'P6' cap, or null = no cap
  };
}

function defaultState() {
  return {
    pinHash: null,
    blockedWorldIds: [],
    dailyLimitMinutes: null,
    learningControls: defaultLearningControls(),
    setupComplete: false
  };
}

function readState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      ...defaultState(),
      ...parsed,
      learningControls: {
        ...defaultLearningControls(),
        ...(parsed.learningControls || {})
      }
    };
  } catch {
    return defaultState();
  }
}

function writeState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('lena-parental-change'));
  } catch {
    // ignore
  }
}

function hashPin(pin) {
  return btoa(pin.split('').reverse().join('') + ':lena:parental');
}

export function getParentalState() {
  return readState();
}

export function isPinSet() {
  return Boolean(readState().pinHash);
}

export function verifyPin(pin) {
  const state = readState();
  if (!state.pinHash) return true;
  return state.pinHash === hashPin(pin);
}

export function setPin(pin) {
  const state = readState();
  writeState({ ...state, pinHash: hashPin(pin), setupComplete: true });
}

export function removePin() {
  const state = readState();
  writeState({ ...state, pinHash: null, setupComplete: false });
}

export function isWorldBlocked(worldId) {
  return readState().blockedWorldIds.includes(worldId);
}

export function toggleWorldBlock(worldId) {
  const state = readState();
  const blocked = state.blockedWorldIds.includes(worldId)
    ? state.blockedWorldIds.filter((id) => id !== worldId)
    : [...state.blockedWorldIds, worldId];
  writeState({ ...state, blockedWorldIds: blocked });
}

export function setDailyLimit(minutes) {
  const state = readState();
  writeState({ ...state, dailyLimitMinutes: minutes || null });
}

// ── Learning controls (Phase B) ──────────────────────────────────────────────
// Parent overrides consumed later by the adaptive engine (Phase E/G). A value of
// `null` means "defer to the adaptive engine"; true/false is an explicit override.

export function getLearningControls() {
  return readState().learningControls;
}

export function setLearningControl(key, value) {
  const state = readState();
  writeState({
    ...state,
    learningControls: { ...state.learningControls, [key]: value }
  });
}
