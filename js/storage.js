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
        if (!userName) return { userScore: { stars: 0, coins: 0 }, answeredQuestions: {}, currentLevel: 1 };
        try {
            const progress = localStorage.getItem(`mathsLenaProgress_${userName}`);
            if (progress) {
                return JSON.parse(progress);
            }
            // Return default structure if no progress is found for this user
            return {
                userScore: { stars: 0, coins: 0 },
                answeredQuestions: {},
                currentLevel: 1
            };
        } catch (e) {
            console.error("Error loading progress for user " + userName, e);
            return { userScore: { stars: 0, coins: 0 }, answeredQuestions: {}, currentLevel: 1 };
        }
    }
};
