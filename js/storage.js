const USER_PROFILE_KEY = 'mathsLenaUserProfile';
const SELECTED_AVATAR_KEY = 'mathsLenaSelectedAvatar';

const storage = {
    // --- User Profile ---
    saveUserProfile: (profile) => {
        try {
            const normalized = normalizeUserProfile(profile);
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(normalized));
            persistSelectedAvatar(normalized.avatar);
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
            userScore: { stars: 0, coins: 0, stickers: 0 },
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

            const mergedUserScore = {
                ...base.userScore,
                ...(parsed.userScore || {})
            };

            return {
                ...base,
                ...parsed,
                userScore: mergedUserScore,
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
    '🐸': 'grenouille'
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
        iconUrl: '../assets/avatars/licorne.svg'
    };
}
