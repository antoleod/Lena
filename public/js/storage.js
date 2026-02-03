const USER_PROFILE_KEY = 'mathsLenaUserProfile';
const SELECTED_AVATAR_KEY = 'mathsLenaSelectedAvatar';
const USER_NAME_DRAFT_KEY = 'mathsLenaNameDraft';
const LANGUAGE_KEY = 'lang';
const LEGACY_LANGUAGE_KEY = 'mathsLenaLanguage';
const LAST_USER_NAME_KEY = 'mathsLenaLastUserName';

const storage = {
    // --- User Profile ---
    saveUserProfile: (profile) => {
        try {
            const normalized = normalizeUserProfile(profile);
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(normalized));
            persistSelectedAvatar(normalized.avatar);
            if (normalized.name) {
                localStorage.setItem(LAST_USER_NAME_KEY, normalized.name);
            }
            clearNameDraft();
        } catch (e) {
            console.error("Error saving user profile", e);
        }
    },
    loadUserProfile: () => {
        try {
            const profile = localStorage.getItem(USER_PROFILE_KEY);
            if (!profile) { return null; }
            const normalized = normalizeUserProfile(JSON.parse(profile));
            if (normalized?.avatar) {
                persistSelectedAvatar(normalized.avatar);
            } else {
                const storedAvatar = loadPersistedAvatar();
                if (storedAvatar) {
                    normalized.avatar = storedAvatar;
                }
            }
            return normalized;
        } catch (e) {
            console.error("Error loading user profile", e);
            return null;
        }
    },
    loadSelectedAvatar: () => loadPersistedAvatar(),
    saveSelectedAvatar: (avatar) => persistSelectedAvatar(avatar),
    loadNameDraft: () => loadNameDraft(),
    saveNameDraft: (name) => persistNameDraft(name),
    clearNameDraft: () => clearNameDraft(),
    getLanguage: () => loadLanguage(),
    setLanguage: (lang) => persistLanguage(lang),
    loadLastUserName: () => {
        try {
            return localStorage.getItem(LAST_USER_NAME_KEY) || '';
        } catch (e) {
            return '';
        }
    },

    // --- User Progress ---
    saveUserProgress: (userName, progressData) => {
        if (!userName) return;
        try {
            localStorage.setItem(`mathsLenaProgress_${userName}`, JSON.stringify(progressData));
        } catch (e) {
            console.error("Error saving progress for user " + userName, e);
        }
    },
    loadUserProgress: (userName) => {
        const defaultProgress = () => ({
            userScore: { stars: 0, coins: 50 },
            answeredQuestions: {},
            currentLevel: 1,
            ownedItems: [],
            activeCosmetics: {}
        });

        if (!userName) {
            return defaultProgress();
        }

        try {
            const progress = localStorage.getItem(`mathsLenaProgress_${userName}`);
            if (!progress) {
                return defaultProgress();
            }

            const parsed = JSON.parse(progress);
            const base = defaultProgress();

            // For existing users, if they don't have coins, give them 50.
            if (parsed.userScore && typeof parsed.userScore.coins === 'undefined') {
                parsed.userScore.coins = 50;
            }

            return {
                ...base,
                ...parsed,
                userScore: { ...base.userScore, ...(parsed.userScore || {}) },
                answeredQuestions: { ...base.answeredQuestions, ...(parsed.answeredQuestions || {}) },
                activeCosmetics: { ...base.activeCosmetics, ...(parsed.activeCosmetics || {}) },
                ownedItems: Array.isArray(parsed.ownedItems) ? parsed.ownedItems : base.ownedItems
            };
        } catch (e) {
            console.error("Error loading progress for user " + userName, e);
            return defaultProgress();
        }
    }
};

const LEGACY_AVATAR_MAP = {
    '🦄': 'licorne',
    '🦁': 'lion',
    '🐧': 'pingouin',
    '🐼': 'panda',
    '🦊': 'renard',
    '🐸': 'grenouille',
    '🍓': 'fraise',
    '🍎': 'pomme',
    '🍌': 'banane',
    '🍍': 'ananas'
};

function persistSelectedAvatar(avatar) {
    try {
        if (!avatar) {
            localStorage.removeItem(SELECTED_AVATAR_KEY);
            return;
        }
        const normalizedAvatar = normalizeAvatar(avatar);
        if (!normalizedAvatar) {
            localStorage.removeItem(SELECTED_AVATAR_KEY);
            return;
        }
        localStorage.setItem(SELECTED_AVATAR_KEY, JSON.stringify(normalizedAvatar));
    } catch (e) {
        console.error('Error saving selected avatar', e);
    }
}

function persistNameDraft(name) {
    try {
        const trimmed = typeof name === 'string' ? name.trim() : '';
        if (!trimmed) {
            localStorage.removeItem(USER_NAME_DRAFT_KEY);
            return;
        }
        localStorage.setItem(USER_NAME_DRAFT_KEY, trimmed);
    } catch (e) {
        console.error('Error saving name draft', e);
    }
}

function loadNameDraft() {
    try {
        return localStorage.getItem(USER_NAME_DRAFT_KEY) || '';
    } catch (e) {
        console.error('Error loading name draft', e);
        return '';
    }
}

function clearNameDraft() {
    try {
        localStorage.removeItem(USER_NAME_DRAFT_KEY);
    } catch (e) {
        console.error('Error clearing name draft', e);
    }
}

function loadPersistedAvatar() {
    try {
        const stored = localStorage.getItem(SELECTED_AVATAR_KEY);
        if (!stored) { return null; }
        return normalizeAvatar(JSON.parse(stored));
    } catch (e) {
        console.error('Error loading selected avatar', e);
        return null;
    }
}

function normalizeUserProfile(profile) {
    if (!profile || typeof profile !== 'object') {
        return profile;
    }
    const normalized = { ...profile };
    normalized.avatar = normalizeAvatar(profile.avatar);
    if (!normalized.color) {
        const avatarMeta = getAvatarMeta(normalized.avatar?.id);
        normalized.color = avatarMeta?.defaultPalette?.primary || '#ffb3d3';
    }
    if (!normalized.settings) {
        normalized.settings = {};
    }
    if (!normalized.settings.language) {
        const stored = loadLanguage();
        if (stored) {
            normalized.settings.language = stored;
        }
    }
    return normalized;
}

function normalizeAvatar(rawAvatar) {
    const library = window.AVATAR_LIBRARY || {};
    if (!rawAvatar) {
        return fallbackAvatar(library);
    }

    if (typeof rawAvatar === 'string') {
        const fromEmoji = LEGACY_AVATAR_MAP[rawAvatar];
        const candidateId = fromEmoji || rawAvatar;
        const meta = getAvatarMeta(candidateId);
        return meta ? simplifyAvatar(meta) : fallbackAvatar(library);
    }

    if (typeof rawAvatar === 'object') {
        const candidateId = rawAvatar.id || LEGACY_AVATAR_MAP[rawAvatar.icon] || LEGACY_AVATAR_MAP[rawAvatar.iconUrl];
        const meta = getAvatarMeta(candidateId);
        if (meta) {
            return simplifyAvatar({ ...meta, ...rawAvatar });
        }
        if (rawAvatar.iconUrl && rawAvatar.name) {
            return {
                id: rawAvatar.id || 'custom-avatar',
                name: rawAvatar.name,
                iconUrl: rawAvatar.iconUrl
            };
        }
    }

    return fallbackAvatar(library);
}

function getAvatarMeta(avatarId) {
    if (!avatarId) { return null; }
    const library = window.AVATAR_LIBRARY || {};
    return library[avatarId] || null;
}

function simplifyAvatar(meta) {
    if (!meta) { return null; }
    return {
        id: meta.id,
        name: meta.name,
        iconUrl: meta.iconUrl
    };
}

function fallbackAvatar(library) {
    const first = library && Object.values(library)[0];
    if (first) {
        return simplifyAvatar(first);
    }
    return {
        id: 'licorne',
        name: 'Licorne',
        iconUrl: 'assets/avatars/licorne.svg'
    };
}

function loadLanguage() {
    try {
        const rawProfile = localStorage.getItem(USER_PROFILE_KEY);
        const storedProfile = rawProfile ? JSON.parse(rawProfile) : null;
        const profileLang = storedProfile?.settings?.language;
        if (profileLang) {
            return profileLang;
        }
    } catch (error) {
        console.warn('Error loading language from profile', error);
    }

    try {
        return localStorage.getItem(LANGUAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_KEY) || 'fr';
    } catch (error) {
        console.warn('Error loading language from storage', error);
        return 'fr';
    }
}

function persistLanguage(lang) {
    if (!lang || typeof lang !== 'string') { return; }
    const normalized = lang.trim().toLowerCase();
    if (!normalized) { return; }
    try {
        localStorage.setItem(LANGUAGE_KEY, normalized);
        localStorage.setItem(LEGACY_LANGUAGE_KEY, normalized);
    } catch (error) {
        console.warn('Error saving language', error);
    }

    try {
        const profile = storage?.loadUserProfile ? storage.loadUserProfile() : null;
        if (profile) {
            profile.settings = { ...(profile.settings || {}), language: normalized };
            storage.saveUserProfile(profile);
        }
    } catch (error) {
        console.warn('Error saving language into profile', error);
    }
}

if (typeof window !== 'undefined') {
    const attachProgressAPI = window.progressStore && typeof window.progressStore === 'object'
        ? window.progressStore
        : null;

    if (attachProgressAPI) {
        Object.assign(storage, attachProgressAPI);
    } else if (!storage.getProgress) {
        const fallbackProgress = {
            getProgress() {
                return {
                    stars: 0,
                    bestTimeMs: null,
                    lastScore: null,
                    lastHelp: 0,
                    accuracy: null,
                    attempts: 0,
                    completed: false,
                    notes: {
                        strengths: [],
                        focus: []
                    }
                };
            },
            setProgress() { return fallbackProgress.getProgress(); },
            getMastery() { return {}; },
            clearProgress() { /* noop in fallback */ },
            listLevels() { return []; }
        };
        Object.assign(storage, fallbackProgress);
    }

    window.storage = storage;
    window.progressStore = Object.assign({}, window.progressStore || {}, {
        getProgress: storage.getProgress,
        setProgress: storage.setProgress,
        getMastery: storage.getMastery,
        clearProgress: storage.clearProgress,
        listLevels: storage.listLevels
    });
}
