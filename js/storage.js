const storage = {
    // --- User Profile ---
    saveUserProfile: (profile) => {
        try {
            localStorage.setItem('mathsLenaUserProfile', JSON.stringify(profile));
        } catch (e) {
            console.error("Error saving user profile", e);
        }
    },
    loadUserProfile: () => {
        try {
            const profile = localStorage.getItem('mathsLenaUserProfile');
            return profile ? JSON.parse(profile) : null;
        } catch (e) {
            console.error("Error loading user profile", e);
            return null;
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
            userScore: { stars: 0, coins: 0 },
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
