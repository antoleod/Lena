;(function attachProgressStorage(windowObject) {
    'use strict';

    const win = windowObject || (typeof window !== 'undefined' ? window : null);
    if (!win) { return; }

    const STORAGE_PREFIX = 'lena:progress:';
    const MASTER_PREFIX = `${STORAGE_PREFIX}mastery:`;

    const DEFAULT_ENTRY = Object.freeze({
        stars: 0,
        bestTimeMs: null,
        lastScore: null,
        lastHelp: 0,
        accuracy: null,
        attempts: 0,
        completed: false,
        updatedAt: null,
        notes: {
            strengths: [],
            focus: []
        }
    });

    function safeGameId(gameId) {
        if (typeof gameId !== 'string' || !gameId.trim()) {
            throw new Error('storage.getProgress: gameId must be a non-empty string');
        }
        return gameId.trim();
    }

    function safeLevel(level) {
        const num = Number(level);
        if (!Number.isFinite(num) || num <= 0) {
            throw new Error('storage.getProgress: level must be a positive number');
        }
        return Math.floor(num);
    }

    function levelKey(gameId, level) {
        return `${STORAGE_PREFIX}${gameId}:${level}`;
    }

    function masteryKey(gameId) {
        return `${MASTER_PREFIX}${safeGameId(gameId)}`;
    }

    function normalizeEntry(raw) {
        if (!raw || typeof raw !== 'object') {
            return { ...DEFAULT_ENTRY };
        }

        const base = { ...DEFAULT_ENTRY };
        const notes = raw.notes && typeof raw.notes === 'object'
            ? {
                strengths: Array.isArray(raw.notes.strengths) ? raw.notes.strengths.slice(0, 6) : [],
                focus: Array.isArray(raw.notes.focus) ? raw.notes.focus.slice(0, 6) : []
            }
            : { ...DEFAULT_ENTRY.notes };

        return {
            stars: clampInt(raw.stars, 0, 3, base.stars),
            bestTimeMs: minTime(raw.bestTimeMs, base.bestTimeMs),
            lastScore: typeof raw.lastScore === 'number' ? raw.lastScore : base.lastScore,
            lastHelp: clampInt(raw.lastHelp, 0, 99, base.lastHelp),
            accuracy: typeof raw.accuracy === 'number' ? clampNumber(raw.accuracy, 0, 1) : base.accuracy,
            attempts: clampInt(raw.attempts, 0, Number.MAX_SAFE_INTEGER, base.attempts),
            completed: Boolean(raw.completed),
            updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : base.updatedAt,
            notes
        };
    }

    function clampInt(value, min, max, fallback) {
        if (!Number.isFinite(value)) {
            return fallback;
        }
        const clamped = Math.max(min, Math.min(max, Math.round(value)));
        return Number.isFinite(clamped) ? clamped : fallback;
    }

    function clampNumber(value, min, max, fallback = null) {
        if (!Number.isFinite(value)) {
            return fallback;
        }
        return Math.max(min, Math.min(max, value));
    }

    function minTime(candidate, fallback) {
        if (!Number.isFinite(candidate) || candidate <= 0) {
            return fallback;
        }
        if (!Number.isFinite(fallback) || fallback <= 0) {
            return Math.round(candidate);
        }
        return Math.round(Math.min(candidate, fallback));
    }

    function readJSON(key) {
        try {
            const raw = win.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.warn('[storage] Failed to parse key', key, error);
            return null;
        }
    }

    function writeJSON(key, value) {
        try {
            win.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('[storage] Failed to persist key', key, error);
        }
    }

    function mergeProgress(existing, incoming) {
        const base = normalizeEntry(existing);
        const update = normalizeMergePayload(incoming);

        const updateTimestamp = Date.now();

        const merged = {
            ...base,
            stars: Math.max(base.stars, update.stars),
            bestTimeMs: bestTime(base.bestTimeMs, update.bestTimeMs),
            lastScore: update.lastScore ?? base.lastScore,
            lastHelp: update.lastHelp ?? base.lastHelp,
            accuracy: update.accuracy ?? base.accuracy,
            attempts: base.attempts + (update.incrementAttempt ? 1 : 0),
            completed: update.completed ?? base.completed,
            updatedAt: update.mergeTimestamp ? updateTimestamp : base.updatedAt,
            notes: {
                strengths: dedupeStrings([...base.notes.strengths, ...update.notes.strengths]),
                focus: dedupeStrings([...base.notes.focus, ...update.notes.focus])
            }
        };

        if (update.forceOverwriteAttempts) {
            merged.attempts = update.forceOverwriteAttempts;
        }

        return merged;
    }

    function normalizeMergePayload(payload) {
        if (!payload || typeof payload !== 'object') {
            return {
                stars: 0,
                bestTimeMs: null,
                lastScore: null,
                lastHelp: null,
                accuracy: null,
                incrementAttempt: true,
                completed: false,
                mergeTimestamp: true,
                notes: { strengths: [], focus: [] }
            };
        }

        const normalizedNotes = {
            strengths: Array.isArray(payload.strengths) ? payload.strengths : payload.notes?.strengths,
            focus: Array.isArray(payload.focus) ? payload.focus : payload.notes?.focus
        };

        return {
            stars: clampInt(payload.stars, 0, 3, 0),
            bestTimeMs: Number.isFinite(payload.bestTimeMs) ? Math.round(payload.bestTimeMs) : null,
            lastScore: typeof payload.lastScore === 'number' ? payload.lastScore : null,
            lastHelp: Number.isFinite(payload.lastHelp) ? clampInt(payload.lastHelp, 0, 99, null) : null,
            accuracy: typeof payload.accuracy === 'number' ? clampNumber(payload.accuracy, 0, 1) : null,
            incrementAttempt: payload.incrementAttempt !== false,
            completed: typeof payload.completed === 'boolean' ? payload.completed : undefined,
            mergeTimestamp: payload.mergeTimestamp !== false,
            forceOverwriteAttempts: Number.isFinite(payload.attempts) ? clampInt(payload.attempts, 0, Number.MAX_SAFE_INTEGER, null) : null,
            notes: {
                strengths: dedupeStrings(toStringArray(normalizedNotes.strengths)),
                focus: dedupeStrings(toStringArray(normalizedNotes.focus))
            },
            mastery: sanitizeMastery(payload.mastery || payload.masteries || {})
        };
    }

    function bestTime(existing, incoming) {
        if (!Number.isFinite(incoming) || incoming <= 0) {
            return existing;
        }
        if (!Number.isFinite(existing) || existing <= 0) {
            return Math.round(incoming);
        }
        return Math.round(Math.min(existing, incoming));
    }

    function toStringArray(list) {
        if (!Array.isArray(list)) { return []; }
        return list
            .map(item => typeof item === 'string' ? item.trim() : '')
            .filter(Boolean)
            .slice(0, 6);
    }

    function dedupeStrings(list) {
        return Array.from(new Set(list)).slice(0, 6);
    }

    function sanitizeMastery(candidate) {
        if (!candidate || typeof candidate !== 'object') {
            return null;
        }
        const entries = Object.entries(candidate).map(([skill, value]) => {
            if (typeof skill !== 'string' || !skill.trim()) {
                return null;
            }
            const payload = typeof value === 'object' && value
                ? value
                : { attempts: value };

            const attempts = clampInt(payload.attempts, 0, Number.MAX_SAFE_INTEGER, 0);
            const success = clampInt(payload.success || payload.correct, 0, attempts, 0);
            const streak = clampInt(payload.streak, 0, Number.MAX_SAFE_INTEGER, 0);
            const bestTimeMs = Number.isFinite(payload.bestTimeMs) ? Math.round(payload.bestTimeMs) : null;
            return [
                skill.trim(),
                {
                    attempts,
                    success,
                    streak,
                    bestTimeMs,
                    lastReviewed: Date.now()
                }
            ];
        }).filter(Boolean);

        if (!entries.length) {
            return null;
        }

        return Object.fromEntries(entries);
    }

    function mergeMastery(gameId, updates) {
        if (!updates) { return; }
        const key = masteryKey(gameId);
        const existing = readJSON(key) || {};
        const merged = { ...existing };

        Object.entries(updates).forEach(([skill, payload]) => {
            const previous = existing[skill];
            if (!previous) {
                merged[skill] = payload;
                return;
            }
            merged[skill] = {
                attempts: clampInt(previous.attempts + payload.attempts, 0, Number.MAX_SAFE_INTEGER, previous.attempts),
                success: clampInt((previous.success || 0) + (payload.success || 0), 0, Number.MAX_SAFE_INTEGER, previous.success || 0),
                streak: payload.streak ?? previous.streak ?? 0,
                bestTimeMs: bestTime(previous.bestTimeMs, payload.bestTimeMs),
                lastReviewed: payload.lastReviewed || Date.now()
            };
        });

        writeJSON(key, merged);
    }

    function getProgress(gameId, level) {
        const safeId = safeGameId(gameId);
        const safeLvl = safeLevel(level);
        const key = levelKey(safeId, safeLvl);
        const stored = readJSON(key);
        return normalizeEntry(stored);
    }

    function setProgress(gameId, level, payload) {
        const safeId = safeGameId(gameId);
        const safeLvl = safeLevel(level);
        const key = levelKey(safeId, safeLvl);
        const current = readJSON(key);
        const merged = mergeProgress(current, payload);
        writeJSON(key, merged);

        const mergePayload = normalizeMergePayload(payload);
        if (mergePayload.mastery) {
            mergeMastery(safeId, mergePayload.mastery);
        }

        return merged;
    }

    function getMastery(gameId) {
        const safeId = safeGameId(gameId);
        return readJSON(masteryKey(safeId)) || {};
    }

    function clearProgress(gameId, level) {
        const safeId = safeGameId(gameId);
        if (typeof level === 'undefined') {
            const prefix = `${STORAGE_PREFIX}${safeId}:`;
            Object.keys(win.localStorage).forEach(key => {
                if (key.startsWith(prefix)) {
                    win.localStorage.removeItem(key);
                }
            });
            win.localStorage.removeItem(masteryKey(safeId));
            return;
        }
        const safeLvl = safeLevel(level);
        win.localStorage.removeItem(levelKey(safeId, safeLvl));
    }

    function listLevels(gameId) {
        const safeId = safeGameId(gameId);
        const prefix = `${STORAGE_PREFIX}${safeId}:`;
        const levels = [];
        Object.keys(win.localStorage).forEach(key => {
            if (key.startsWith(prefix)) {
                const suffix = key.slice(prefix.length);
                const levelNum = Number.parseInt(suffix, 10);
                if (Number.isFinite(levelNum)) {
                    levels.push(levelNum);
                }
            }
        });
        return levels.sort((a, b) => a - b);
    }

    const progressAPI = {
        getProgress,
        setProgress,
        getMastery,
        clearProgress,
        listLevels
    };

    win.progressStore = Object.assign({}, win.progressStore || {}, progressAPI);
    win.storage = Object.assign({}, win.storage || {}, progressAPI);
})(typeof window !== 'undefined' ? window : this);
