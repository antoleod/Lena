const SECTION_ENVIRONMENTS = {
    math: 'forest',
    francais: 'cloud',
    geometrie: 'space',
    problemes: 'mystery',
    entrainement: 'lightning',
    puzzles: 'creative'
};

const SECTION_CATEGORIES = {
    math: [
        { id: 'additions', label: 'Additions', icon: '➕' },
        { id: 'soustractions', label: 'Soustractions', icon: '➖' },
        { id: 'multiplications', label: 'Multiplications', icon: '✖️' },
        { id: 'number-houses', label: 'Maisons des Nombres', icon: '🏠' },
        { id: 'repartis', label: 'Répartis & Multiplie', icon: '🍎' }
    ],
    francais: [
        { id: 'contes-magiques', label: 'Contes Magiques', icon: '📚' },
        { id: 'vowels', label: 'Jeu des Voyelles', icon: '🅰️' },
        { id: 'dictee', label: 'Dictée Magique', icon: '🧚‍♀️' }
    ],
    geometrie: [
        { id: 'puzzle-magique', label: 'Puzzle Magique', icon: '🧩' }
    ],
    problemes: [
        { id: 'enigmes', label: "Jeu d'énigmes", icon: '🤔' },
        { id: 'sequences', label: 'Jeu des Séquences', icon: '➡️' },
        { id: 'tri', label: 'Jeu de Tri', icon: '🗂️' }
    ],
    entrainement: [
        { id: 'colors', label: 'Les Couleurs', icon: '🎨' },
        { id: 'memoire', label: 'Mémoire Magique', icon: '🧠' },
        { id: 'flash', label: 'Entraînement Flash', icon: '⚡' }
    ],
    puzzles: [
        { id: 'puzzlemagique', label: 'Puzzle Magique', icon: '🧩' }
    ]
};

const DEFAULT_REWARD_RULES = {
    starPerCorrect: 3,
    coinPerCorrect: 1,
    perfectBonusStars: 4,
    stickerThreshold: 5,
    penalties: {
        first: 2,
        repeat: 5
    }
};

const PANEL_THEME_FALLBACK = 'foret-aube';

const state = {
    sectionId: null,
    sectionData: null,
    datasets: {},
    profile: null,
    progress: null,
    currentLevelIndex: 0,
    currentCategory: null,
    filteredLevels: [],
    questionQueue: [],
    currentQuestionIndex: 0,
    reviewQueue: [],
    answered: [],
    stats: null,
    isReviewing: false,
    timer: {
        remaining: 0,
        intervalId: null
    },
    questionErrors: new Map(),
    dom: {}
};

document.addEventListener('DOMContentLoaded', () => {
    initializeMission().catch(error => {
        console.error('Mission initialization failed', error);
        displayFatalError("Oups ! Nous n'avons pas réussi à charger cette mission. Reviens au menu pour réessayer.");
    });
});

async function initializeMission() {
    captureDom();
    setupGlobalHandlers();

    state.profile = storage.loadUserProfile();
    if (!state.profile || !state.profile.name) {
        window.location.replace('login.html');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    state.sectionId = params.get('section') || 'math';

    const [sectionData, datasets] = await Promise.all([
        loadSectionData(state.sectionId),
        loadDatasets(state.sectionId)
    ]);

    if (!sectionData) {
        displayFatalError("Mission introuvable. Choisis une autre aventure dans le menu.");
        return;
    }

    state.sectionData = sectionData;
    state.datasets = datasets || {};
    state.progress = storage.loadUserProgress(state.profile.name);

    hydrateHeader();
    prepareRewardSidebar();

    updateScoreBoard();
    renderCategories();
}

function captureDom() {
    state.dom.body = document.body;
    state.dom.backButton = document.getElementById('btnBackMenu');
    state.dom.missionAvatar = document.getElementById('missionAvatar');
    state.dom.missionGreeting = document.getElementById('missionGreeting');
    state.dom.missionSection = document.getElementById('missionSection');
    state.dom.scoreStars = document.getElementById('scoreStars');
    state.dom.scoreCoins = document.getElementById('scoreCoins');
    state.dom.scoreStickers = document.getElementById('scoreStickers');
    state.dom.levelList = document.getElementById('levelList');
    state.dom.categoryList = document.getElementById('categoryList');
    state.dom.categoryBlock = document.getElementById('categoryBlock');
    state.dom.levelBadge = document.getElementById('levelBadge');
    state.dom.selectors = document.querySelector('.mission-card__selectors');
    state.dom.questionProgress = document.getElementById('questionProgress');
    state.dom.questionProgressFill = document.getElementById('questionProgressFill');
    state.dom.questionCard = document.getElementById('questionCard');
    state.dom.questionText = document.getElementById('questionText');
    state.dom.questionIllustration = document.getElementById('questionIllustration');
    state.dom.optionsGrid = document.getElementById('optionsGrid');
    state.dom.feedback = document.getElementById('missionFeedback');
    state.dom.reviewTracker = document.getElementById('reviewTracker');
    state.dom.reviewCount = document.getElementById('reviewCount');
    state.dom.feedbackOverlay = document.getElementById('feedbackOverlay');
    state.dom.feedbackIcon = document.getElementById('feedbackIcon');
    state.dom.feedbackText = document.getElementById('feedbackText');
    state.dom.summaryModal = document.getElementById('levelSummary');
    state.dom.summaryTitle = document.getElementById('summaryTitle');
    state.dom.summaryMessage = document.getElementById('summaryMessage');
    state.dom.summaryStars = document.getElementById('summaryStars');
    state.dom.summaryCoins = document.getElementById('summaryCoins');
    state.dom.summaryStickers = document.getElementById('summaryStickers');
    state.dom.summaryRetry = document.getElementById('summaryRetry');
    state.dom.summaryNext = document.getElementById('summaryNext');
    state.dom.rewardList = document.getElementById('rewardList');
    state.dom.hintBtn = document.getElementById('btnHint');
    state.dom.skipBtn = document.getElementById('btnSkip');
    state.dom.reviewBtn = document.getElementById('btnReview');
    state.dom.timerWrapper = document.getElementById('missionTimer');
    state.dom.timerValue = document.getElementById('timerValue');
    state.dom.panel = document.querySelector('.mission-card');
    state.dom.footer = document.querySelector('.mission-card__footer');
    state.dom.mobileNavButtons = document.querySelectorAll('.mobile-nav__btn');
}

function setupGlobalHandlers() {
    state.dom.backButton?.addEventListener('click', () => {
        window.location.href = 'menu.html';
    });

    state.dom.summaryRetry?.addEventListener('click', () => {
        closeSummary();
        openLevel(state.currentLevelIndex, { retry: true });
    });

    state.dom.summaryNext?.addEventListener('click', () => {
        closeSummary();
        const next = state.currentLevelIndex + 1;
        if (state.sectionData?.pilot?.levels?.[next]) {
            openLevel(next);
        } else {
            showFeedbackOverlay('success', 'Bravo ! Mission terminée ✨');
        }
    });

    state.dom.hintBtn?.addEventListener('click', () => {
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) { return; }
        const hint = currentQuestion.tip || currentQuestion.explanation || "Observe bien les indices de l'énoncé.";
        state.dom.feedback.textContent = `💡 ${hint}`;
    });

    state.dom.skipBtn?.addEventListener('click', () => {
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) { return; }
        enqueueForReview(currentQuestion);
        advanceQuestion();
    });

    state.dom.reviewBtn?.addEventListener('click', () => {
        if (!state.reviewQueue.length) {
            state.dom.feedback.textContent = '👍 Toutes les erreurs ont été révisées.';
            return;
        }
        if (!state.isReviewing) {
            state.isReviewing = true;
            state.dom.feedback.textContent = '🔁 Mode révision activé.';
            state.questionQueue = [...state.reviewQueue];
            state.currentQuestionIndex = 0;
            state.reviewQueue = [];
            updateReviewTracker();
            showQuestion();
        }
    });

    state.dom.mobileNavButtons?.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.nav;
            if (target === 'games') {
                state.dom.selectors?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (target === 'rewards') {
                state.dom.footer?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            } else if (target === 'profile') {
                document.getElementById('missionProfile')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (target === 'help') {
                state.dom.feedback.textContent = 'Tu peux demander un indice avec le bouton 💡 Indice !';
                state.dom.feedback.classList.add('is-highlight');
                setTimeout(() => state.dom.feedback?.classList.remove('is-highlight'), 1600);
            }
        });
    });
}

async function loadSectionData(sectionId) {
    return fetchGameResource(sectionId, 'levels.json', null);
}

async function loadDatasets(sectionId) {
    return fetchGameResource(sectionId, 'datasets.json', {});
}

function resolveGameAssetPath(sectionId, fileName) {
    return `../games/${sectionId}/${fileName}`;
}

async function fetchGameResource(sectionId, fileName, fallbackValue) {
    const candidates = buildResourceCandidates(sectionId, fileName);
    for (const url of candidates) {
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                console.warn('[Mission] tentative échouée pour', url, response.status);
                continue;
            }
            return await response.json();
        } catch (error) {
            console.warn('[Mission] fetch impossible pour', url, error);
        }
    }
    return fallbackValue;
}

function buildResourceCandidates(sectionId, fileName) {
    try {
        const currentUrl = new URL(window.location.href);
        const fromRoot = new URL(`/games/${sectionId}/${fileName}`, currentUrl.origin).href;
        return [fromRoot];
    } catch (error) {
        return [`../games/${sectionId}/${fileName}`];
    }
}

function hydrateHeader() {
    const environment = SECTION_ENVIRONMENTS[state.sectionId] || 'forest';
    state.dom.body.dataset.environment = environment;

    if (state.dom.missionGreeting) {
        state.dom.missionGreeting.textContent = `Bonjour, ${state.profile.name} !`;
    }
    if (state.dom.missionSection) {
        state.dom.missionSection.textContent = state.sectionData?.title || 'Mission secrète';
    }

    renderMissionAvatar();
}

function renderMissionAvatar() {
    const container = state.dom.missionAvatar;
    if (!container) { return; }
    container.innerHTML = '';
    const avatar = state.profile.avatar || storage.loadSelectedAvatar() || getAvatarMeta('licorne');
    if (avatar?.iconUrl) {
        const img = document.createElement('img');
        img.src = avatar.iconUrl;
        img.alt = avatar.name || 'Avatar';
        img.loading = 'lazy';
        container.appendChild(img);
    } else {
        container.textContent = avatar?.icon || '🦄';
        container.style.fontSize = '2.5rem';
    }
}

function renderCategories() {
    if (!state.dom.categoryList) {
        state.filteredLevels = state.sectionData?.pilot?.levels || [];
        renderLevelList();
        if (state.filteredLevels.length) { openLevel(0); }
        return;
    }

    const categories = SECTION_CATEGORIES[state.sectionId] || [];
    state.dom.categoryList.innerHTML = '';

    if (!categories.length) {
        state.dom.categoryBlock?.classList.add('is-hidden');
        state.currentCategory = null;
        state.filteredLevels = state.sectionData?.pilot?.levels || [];
        renderLevelList();
        if (state.filteredLevels.length) { openLevel(0); }
        return;
    }

    state.dom.categoryBlock?.classList.remove('is-hidden');

    categories.forEach((category, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'category-chip';
        button.dataset.categoryId = category.id;
        button.innerHTML = `<span class="category-chip__icon" aria-hidden="true">${category.icon}</span><span>${category.label}</span>`;
        button.addEventListener('click', () => selectCategory(category.id));
        item.appendChild(button);
        state.dom.categoryList.appendChild(item);

        if (index === 0) {
            button.classList.add('is-active');
            state.currentCategory = category.id;
        }
    });

    selectCategory(state.currentCategory || categories[0]?.id);
}

function selectCategory(categoryId) {
    state.currentCategory = categoryId;
    const buttons = state.dom.categoryList?.querySelectorAll('.category-chip');
    buttons?.forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.categoryId === categoryId);
    });

    state.filteredLevels = filterLevelsByCategory(categoryId);
    renderLevelList();

    if (state.filteredLevels.length) {
        openLevel(0);
    } else if (state.dom.levelList) {
        state.dom.levelList.innerHTML = '<div class="level-empty">Bientôt disponible ✨</div>';
        if (state.dom.levelBadge) {
            state.dom.levelBadge.textContent = 'Mission en préparation';
        }
        state.dom.questionText.textContent = 'Ce jeu est en préparation. Reviens très vite !';
        state.dom.optionsGrid.innerHTML = '';
    }
}

function filterLevelsByCategory(categoryId) {
    const levels = state.sectionData?.pilot?.levels || [];
    if (!categoryId) { return levels; }
    return levels.filter(level => {
        const categories = level.categories || level.category || [];
        const normalized = Array.isArray(categories) ? categories : [categories];
        return normalized.includes(categoryId);
    });
}

function renderLevelList() {
    if (!state.dom.levelList) { return; }
    state.dom.levelList.innerHTML = '';
    const levels = state.filteredLevels.length ? state.filteredLevels : state.sectionData?.pilot?.levels || [];

    levels.forEach((level, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mission-medal';
        button.dataset.levelIndex = index.toString();

        const key = buildProgressKey(level, state.currentCategory);
        const completed = state.progress?.answeredQuestions?.[key] === 'completed';
        if (completed) {
            button.classList.add('is-complete');
        }

        const levelNumber = level.number || index + 1;
        const difficulty = normalizeDifficulty(level.difficulty, levelNumber);
        button.dataset.difficulty = difficulty;
        button.setAttribute('aria-label', `Niveau ${levelNumber} — ${level.name} (${difficultyLabel(difficulty)})`);

        const label = document.createElement('span');
        label.className = 'mission-medal__level';
        label.textContent = `N${levelNumber}`;

        const subtitle = document.createElement('span');
        subtitle.className = 'mission-medal__label';
        subtitle.textContent = difficultyLabel(difficulty);

        button.appendChild(label);
        button.appendChild(subtitle);
        button.addEventListener('click', () => openLevel(index));

        const wrapper = document.createElement('div');
        wrapper.className = 'mission-medals__item';
        wrapper.setAttribute('role', 'listitem');
        wrapper.appendChild(button);
        state.dom.levelList.appendChild(wrapper);
    });
}

function resolveDifficulty(levelNumber) {
    if (levelNumber <= 3) { return 'easy'; }
    if (levelNumber <= 6) { return 'medium'; }
    return 'hard';
}

function difficultyLabel(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 'Facile';
        case 'medium':
            return 'Moyen';
        case 'hard':
        default:
            return 'Difficile';
    }
}

function normalizeDifficulty(value, levelNumber) {
    if (typeof value === 'string') {
        const normalized = value.toLowerCase();
        if (['easy', 'medium', 'hard', 'facile', 'moyen', 'difficile'].includes(normalized)) {
            if (normalized === 'facile') { return 'easy'; }
            if (normalized === 'moyen') { return 'medium'; }
            if (normalized === 'difficile') { return 'hard'; }
            return normalized;
        }
    }
    if (typeof value === 'number') {
        return resolveDifficulty(value);
    }
    return resolveDifficulty(levelNumber);
}

function createQuestionId(level, questionIndex) {
    const baseLevelId = level?.id || `L${level?.number || questionIndex}`;
    return `${state.sectionId || 'section'}:${state.currentCategory || 'general'}:${baseLevelId}:Q${questionIndex}`;
}

function prepareRewardSidebar() {
    if (!state.dom.rewardList) { return; }
    state.dom.rewardList.innerHTML = '';

    const entries = [
        { icon: '🎯', label: "Objectif : réussir 10 niveaux", id: 'rewardGoal' },
        { icon: '⭐', label: "Bonus parfait : +4 étoiles", id: 'rewardBonus' },
        { icon: '🔁', label: "Révision automatique des erreurs", id: 'rewardReview' }
    ];

    entries.forEach(entry => {
        const item = document.createElement('li');
        item.className = 'reward-item';
        item.innerHTML = `<span class="reward-item__icon">${entry.icon}</span><span id="${entry.id}">${entry.label}</span>`;
        state.dom.rewardList.appendChild(item);
    });
}

function openLevel(index, options = {}) {
    const level = state.filteredLevels?.[index];
    if (!level) { return; }

    clearTimer();
    state.currentLevelIndex = index;
    state.isReviewing = false;
    state.reviewQueue = [];
    state.answered = [];
    state.stats = {
        correct: 0,
        incorrect: 0,
        starsEarned: 0,
        coinsEarned: 0,
        stickersEarned: 0,
        perfect: true
    };
    state.questionErrors = new Map();

    if (state.dom.reviewBtn) {
        state.dom.reviewBtn.disabled = true;
    }

    markActiveLevelChip(index);
    updateRewardFocus(level);
    preparePanelTheme(level.background);

    state.questionQueue = generateQuestionsForLevel(level, options.retry === true);
    state.questionQueue.forEach((question, idx) => {
        if (!question) { return; }
        question.uid = question.uid || createQuestionId(level, idx);
        question.levelId = level.id || `L${level.number}`;
        question.levelNumber = level.number;
        question.indexInLevel = idx;
    });
    state.currentQuestionIndex = 0;

    setupTimer(level.timerSeconds);
    showQuestion();
}

function markActiveLevelChip(index) {
    const chips = state.dom.levelList?.querySelectorAll('.mission-medal');
    chips?.forEach((chip, chipIndex) => {
        chip.classList.toggle('is-active', chipIndex === index);
        const level = state.filteredLevels?.[chipIndex];
        const key = buildProgressKey(level, state.currentCategory);
        const completed = level && state.progress?.answeredQuestions?.[key] === 'completed';
        chip.classList.toggle('is-complete', Boolean(completed));
    });
}

function updateRewardFocus(level) {
    const focusItem = document.getElementById('rewardGoal');
    if (focusItem) {
        focusItem.textContent = `🎯 Focus : ${level.focus || 'Entraînement magique'}`;
    }
}

function preparePanelTheme(background) {
    if (!state.dom.panel) { return; }
    state.dom.panel.dataset.theme = background || PANEL_THEME_FALLBACK;
}

function setupTimer(seconds) {
    if (!state.dom.timerWrapper) { return; }
    if (!seconds) {
        state.dom.timerWrapper.hidden = true;
        clearTimer();
        return;
    }
    state.timer.remaining = seconds;
    updateTimerDisplay();
    state.dom.timerWrapper.hidden = false;
    clearTimer();
    state.timer.intervalId = window.setInterval(() => {
        state.timer.remaining -= 1;
        updateTimerDisplay();
        if (state.timer.remaining <= 0) {
            clearTimer();
            handleTimerExpired();
        }
    }, 1000);
}

function clearTimer() {
    if (state.timer.intervalId) {
        clearInterval(state.timer.intervalId);
        state.timer.intervalId = null;
    }
}

function updateTimerDisplay() {
    if (!state.dom.timerValue) { return; }
    const minutes = Math.max(0, Math.floor(state.timer.remaining / 60));
    const seconds = Math.max(0, state.timer.remaining % 60);
    state.dom.timerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function handleTimerExpired() {
    state.dom.feedback.textContent = '⏱️ Temps écoulé ! Révision magique en cours.';
    state.stats.perfect = false;
    if (state.reviewQueue.length === 0 && state.questionQueue.length - state.currentQuestionIndex > 0) {
        const remainingQuestions = state.questionQueue.slice(state.currentQuestionIndex);
        remainingQuestions.forEach(q => enqueueForReview(q));
    }
    finishLevel();
}

function generateQuestionsForLevel(level, isRetry) {
    const template = level.template || 'generic';
    const generator = GENERATORS[template];
    if (typeof generator === 'function') {
        return generator(level, state.sectionId, state.datasets, { isRetry });
    }
    return buildQuestionsFromItems(level.items || []);
}

function showQuestion() {
    const question = getCurrentQuestion();
    if (!question) {
        if (state.reviewQueue.length && !state.isReviewing) {
            state.isReviewing = true;
            state.dom.feedback.textContent = '🔁 Passons en mode révision !';
            state.questionQueue = [...state.reviewQueue];
            state.reviewQueue = [];
            state.currentQuestionIndex = 0;
            updateReviewTracker();
            showQuestion();
            return;
        }
        finishLevel();
        return;
    }

    state.dom.levelBadge.textContent = buildLevelBadge();
    state.dom.questionText.textContent = question.text;
    state.dom.questionIllustration.textContent = question.illustration || '';
    state.dom.feedback.textContent = '';
    state.dom.feedback.classList.remove('is-highlight');

    renderOptions(question);
    updateProgressDisplay();
    updateReviewTracker();
}

function renderOptions(question) {
    if (!state.dom.optionsGrid) { return; }
    state.dom.optionsGrid.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-btn';
        button.dataset.index = index.toString();
        button.textContent = option;
        button.addEventListener('click', () => handleAnswer(button, index));
        state.dom.optionsGrid.appendChild(button);
    });
}

function handleAnswer(button, answerIndex) {
    const question = getCurrentQuestion();
    if (!question) { return; }

    lockOptions();

    const isCorrect = answerIndex === question.correctIndex;

    if (isCorrect) {
        button.classList.add('is-correct');
        state.dom.feedback.textContent = randomBravoMessage();
        state.stats.correct += 1;
        state.stats.starsEarned += DEFAULT_REWARD_RULES.starPerCorrect;
        state.stats.coinsEarned += DEFAULT_REWARD_RULES.coinPerCorrect;
        playSound('correct');
        showFeedbackOverlay('success', 'Bravo ! ✨');
        pulseScore('stars');
        pulseScore('coins');
        if (navigator.vibrate) {
            navigator.vibrate(60);
        }
    } else {
        button.classList.add('is-wrong');
        state.stats.incorrect += 1;
        state.stats.perfect = false;
        playSound('wrong');
        showFeedbackOverlay('error', 'Oups !');
        const currentLevel = state.filteredLevels?.[state.currentLevelIndex];
        const questionId = question.uid || createQuestionId(currentLevel, state.currentQuestionIndex);
        const errorCount = incrementQuestionError(questionId);
        const penaltyValue = errorCount === 1
            ? DEFAULT_REWARD_RULES.penalties.first
            : DEFAULT_REWARD_RULES.penalties.repeat;
        applyCoinPenalty(penaltyValue);
        const penaltyMessage = errorCount === 1
            ? 'Oups ! Tu as perdu 2 pièces.'
            : 'Oups ! Deuxième erreur : –5 pièces.';
        const explanation = question.explanation || 'Regarde bien la correction puis réessaie !';
        if (state.dom.feedback) {
            state.dom.feedback.innerHTML = '';
            const penaltySpan = document.createElement('span');
            penaltySpan.className = 'feedback-penalty';
            penaltySpan.textContent = penaltyMessage;
            state.dom.feedback.appendChild(penaltySpan);
            if (explanation) {
                const detailSpan = document.createElement('span');
                detailSpan.textContent = explanation;
                state.dom.feedback.appendChild(detailSpan);
            }
        }
        enqueueForReview(question);
        highlightCorrectOption(question.correctIndex);
        if (navigator.vibrate) {
            navigator.vibrate([80, 40, 60]);
        }
    }

    state.answered.push({ ...question, userAnswer: answerIndex, correct: isCorrect });
    updateScoreBoardPreview();

    window.setTimeout(() => {
        hideFeedbackOverlay();
        advanceQuestion();
    }, isCorrect ? 900 : 1200);
}

function lockOptions() {
    const buttons = state.dom.optionsGrid?.querySelectorAll('.option-btn');
    buttons?.forEach(btn => btn.setAttribute('disabled', 'true'));
}

function highlightCorrectOption(correctIndex) {
    const buttons = state.dom.optionsGrid?.querySelectorAll('.option-btn');
    const correctButton = buttons?.[correctIndex];
    if (correctButton) {
        correctButton.classList.add('is-correct');
    }
}

function advanceQuestion() {
    state.currentQuestionIndex += 1;
    showQuestion();
}

function getCurrentQuestion() {
    return state.questionQueue?.[state.currentQuestionIndex] || null;
}

function enqueueForReview(question) {
    if (!question) { return; }
    const alreadyQueued = state.reviewQueue.some(item => item.uid && question.uid && item.uid === question.uid);
    if (alreadyQueued) { return; }
    state.reviewQueue.push({ ...question, isReview: true });
    updateReviewTracker();
}

function updateReviewTracker() {
    if (!state.dom.reviewTracker) { return; }
    if (state.reviewQueue.length === 0) {
        state.dom.reviewTracker.hidden = true;
        if (state.dom.reviewBtn) {
            state.dom.reviewBtn.disabled = true;
        }
        return;
    }
    state.dom.reviewTracker.hidden = false;
    state.dom.reviewCount.textContent = `${state.reviewQueue.length} question(s) à revoir`;
    if (state.dom.reviewBtn) {
        state.dom.reviewBtn.disabled = false;
    }
}

function updateProgressDisplay() {
    const total = state.questionQueue.length;
    const current = Math.min(state.currentQuestionIndex + 1, total);
    state.dom.questionProgress.textContent = `Question ${current} / ${total}`;
    const percent = total ? Math.round((current / total) * 100) : 0;
    state.dom.questionProgressFill.style.width = `${percent}%`;
}

function buildLevelBadge() {
    const level = state.filteredLevels?.[state.currentLevelIndex];
    if (!level) { return 'Mission magique'; }
    return `Niveau ${level.number} • ${level.name}`;
}

function randomBravoMessage() {
    const phrases = ['✨ Super !', '🌟 Bravo !', '🎉 Génial !', '🦄 Magnifique !', '🌈 Continue !', 'Tu peux y arriver !'];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function showFeedbackOverlay(type, message) {
    if (!state.dom.feedbackOverlay) { return; }
    state.dom.feedbackOverlay.classList.add('is-visible');
    state.dom.feedbackOverlay.setAttribute('aria-hidden', 'false');
    state.dom.feedbackIcon.textContent = type === 'success' ? '✅' : '❌';
    state.dom.feedbackText.textContent = message;
}

function hideFeedbackOverlay() {
    if (!state.dom.feedbackOverlay) { return; }
    state.dom.feedbackOverlay.classList.remove('is-visible');
    state.dom.feedbackOverlay.setAttribute('aria-hidden', 'true');
}

function finishLevel() {
    clearTimer();
    const level = state.filteredLevels?.[state.currentLevelIndex];
    if (!level) { return; }

    if (state.stats.correct >= DEFAULT_REWARD_RULES.stickerThreshold) {
        state.stats.stickersEarned = 1;
    }
    if (state.stats.perfect) {
        state.stats.starsEarned += DEFAULT_REWARD_RULES.perfectBonusStars;
        pulseScore('stars');
    }

    updateGlobalProgress(level);
    updateScoreBoard();
    if (state.stats.stickersEarned) {
        pulseScore('stickers');
    }
    showSummary(level);
    launchConfetti();
}

function updateGlobalProgress(level) {
    if (!state.progress) { return; }
    const key = buildProgressKey(level, state.currentCategory);
    state.progress.answeredQuestions[key] = 'completed';

    state.progress.sectionProgress = state.progress.sectionProgress || {};
    state.progress.sectionProgress[state.sectionId] = state.progress.sectionProgress[state.sectionId] || {};
    state.progress.sectionProgress[state.sectionId][level.number] = {
        correct: state.stats.correct,
        incorrect: state.stats.incorrect,
        starsEarned: state.stats.starsEarned,
        coinsEarned: state.stats.coinsEarned,
        perfect: state.stats.perfect
    };

    state.progress.userScore.stars = (state.progress.userScore.stars || 0) + state.stats.starsEarned;
    const accumulatedCoins = (state.progress.userScore.coins || 0) + state.stats.coinsEarned;
    state.progress.userScore.coins = Math.max(0, accumulatedCoins);
    state.progress.userScore.stickers = (state.progress.userScore.stickers || 0) + state.stats.stickersEarned;

    storage.saveUserProgress(state.profile.name, state.progress);
    renderLevelList();
    markActiveLevelChip(state.currentLevelIndex);
}

function buildProgressKey(level, categoryId) {
    if (!level) {
        return `${state.sectionId}:general:unknown`;
    }
    const categories = Array.isArray(level.categories)
        ? level.categories
        : level.category
            ? [level.category]
            : ['general'];
    const categoryKey = categoryId || categories[0] || 'general';
    const levelId = level.id || `L${level.number || 0}`;
    return `${state.sectionId}:${categoryKey}:${levelId}`;
}

function updateScoreBoard() {
    const score = state.progress?.userScore || {};
    if (state.dom.scoreStars) {
        state.dom.scoreStars.textContent = score.stars || 0;
    }
    if (state.dom.scoreCoins) {
        state.dom.scoreCoins.textContent = Math.max(0, score.coins || 0);
    }
    if (state.dom.scoreStickers) {
        state.dom.scoreStickers.textContent = score.stickers || 0;
    }
}

function updateScoreBoardPreview() {
    if (!state.progress) { return; }
    const base = state.progress.userScore || {};
    if (state.dom.scoreStars) {
        state.dom.scoreStars.textContent = (base.stars || 0) + state.stats.starsEarned;
    }
    if (state.dom.scoreCoins) {
        const previewCoins = Math.max(0, (base.coins || 0) + state.stats.coinsEarned);
        state.dom.scoreCoins.textContent = previewCoins;
    }
}

function pulseScore(type) {
    let target = null;
    if (type === 'stars') { target = state.dom.scoreStars?.parentElement; }
    if (type === 'coins') { target = state.dom.scoreCoins?.parentElement; }
    if (type === 'stickers') { target = state.dom.scoreStickers?.parentElement; }
    if (!target) { return; }
    target.classList.remove('is-boost');
    void target.offsetWidth;
    target.classList.add('is-boost');
    window.setTimeout(() => target.classList.remove('is-boost'), 600);
}

function incrementQuestionError(questionId) {
    if (!questionId) { return 1; }
    const current = state.questionErrors?.get(questionId) || 0;
    const next = current + 1;
    state.questionErrors?.set(questionId, next);
    return next;
}

function applyCoinPenalty(amount) {
    if (!Number.isFinite(amount) || amount <= 0) { return; }
    state.stats.coinsEarned -= amount;
    state.stats.totalPenalties = (state.stats.totalPenalties || 0) + amount;
    const baseCoins = state.progress?.userScore?.coins || 0;
    const previewCoins = Math.max(0, baseCoins + state.stats.coinsEarned);
    if (state.dom.scoreCoins) {
        state.dom.scoreCoins.textContent = previewCoins;
    }
    triggerCoinPenaltyAnimation(amount);
    pulseScore('coins');
}

function triggerCoinPenaltyAnimation(amount) {
    const host = state.dom.panel;
    if (!host) { return; }
    const container = document.createElement('div');
    container.className = 'coin-penalty';
    const coinCount = Math.min(4, Math.max(2, Math.round(amount / 2)));
    for (let i = 0; i < coinCount; i++) {
        const coin = document.createElement('span');
        coin.className = 'coin-penalty__coin';
        coin.style.setProperty('--delay', `${i * 0.08}s`);
        coin.textContent = '🪙';
        container.appendChild(coin);
    }
    host.appendChild(container);
    window.setTimeout(() => container.remove(), 900);
}

function showSummary(level) {
    if (!state.dom.summaryModal) { return; }
    state.dom.summaryTitle.textContent = `Niveau ${level.number} terminé !`;
    const compliments = state.stats.perfect
        ? 'Bravo ! +4 étoiles'
        : 'Bravo pour tes efforts ! Les questions en révision sont prêtes.';
    state.dom.summaryMessage.textContent = compliments;
    state.dom.summaryStars.textContent = state.stats.starsEarned;
    state.dom.summaryCoins.textContent = state.stats.coinsEarned;
    state.dom.summaryStickers.textContent = state.stats.stickersEarned;

    state.dom.summaryModal.classList.add('is-visible');
    state.dom.summaryModal.setAttribute('aria-hidden', 'false');

    const nextExists = Boolean(state.sectionData?.pilot?.levels?.[state.currentLevelIndex + 1]);
    state.dom.summaryNext.disabled = !nextExists;
    state.dom.summaryNext.textContent = nextExists ? 'Niveau suivant' : 'Revenir au menu';
    if (!nextExists) {
        state.dom.summaryNext.addEventListener('click', () => window.location.href = 'menu.html', { once: true });
    }
}

function closeSummary() {
    if (!state.dom.summaryModal) { return; }
    state.dom.summaryModal.classList.remove('is-visible');
    state.dom.summaryModal.setAttribute('aria-hidden', 'true');
}

function launchConfetti() {
    if (!window.tsParticles || !window.tsParticles.confetti) { return; }
    tsParticles.confetti({
        spread: 65,
        particleCount: 120,
        origin: { y: 0.6 },
        colors: ['#ffd166', '#4ecdc4', '#c4b5fd', '#f78da7', '#f4f1ff']
    });
    playSound('level');
}

function playSound(type) {
    let element = null;
    if (type === 'correct') { element = document.getElementById('soundCorrect'); }
    if (type === 'wrong') { element = document.getElementById('soundWrong'); }
    if (type === 'level') { element = document.getElementById('soundLevel'); }
    if (!element) { return; }
    element.currentTime = 0;
    element.play().catch(() => {});
}

function buildQuestionsFromItems(items) {
    return items.map(item => ({
        text: item.prompt,
        options: item.options,
        correctIndex: item.answer,
        explanation: item.tip,
        illustration: item.illustration || '',
        tip: item.tip
    }));
}

function displayFatalError(message) {
    if (!state.dom.body) { return; }
    state.dom.body.innerHTML = `<main style="margin:auto;text-align:center;font-family:'Fredoka',sans-serif;max-width:520px;padding:2rem;background:rgba(255,255,255,0.9);border-radius:1.5rem;box-shadow:0 18px 36px rgba(0,0,0,0.15);">
        <h1 style="font-size:1.6rem;">😿 Petit souci...</h1>
        <p style="font-size:1rem;line-height:1.6;">${message}</p>
        <button onclick="window.location.href='menu.html'" style="margin-top:1.2rem;padding:0.7rem 1.4rem;border:none;border-radius:999px;background:#7f7bff;color:#fff;font-family:'Fredoka',sans-serif;font-weight:700;cursor:pointer;">Retour au menu</button>
    </main>`;
}

function updateTimerState() {
    if (state.timer.remaining > 0) {
        state.dom.feedback.textContent = `⏳ Plus que ${state.timer.remaining} secondes !`;
    }
}

const GENERATORS = {
    'math:operations': (level, sectionId, datasets) => {
        const settings = level.settings || {};
        const operations = settings.operations || ['add'];
        const min = settings.min ?? 1;
        const max = settings.max ?? 20;
        const allowCarry = settings.allowCarry ?? true;
        const tables = settings.tables || [2, 3, 4, 5, 6, 7, 8, 9];
        const divisors = settings.divisors || tables;
        const exerciseCount = level.exerciseCount || 6;
        const options = settings.options || level.options || 3;
        const questions = [];

        for (let i = 0; i < exerciseCount; i++) {
            const op = operations[Math.floor(Math.random() * operations.length)];
            let a = randomInt(min, max);
            let b = randomInt(min, max);

            if (op === 'sub') {
                if (b > a) { [a, b] = [b, a]; }
            }

            if (op === 'mul') {
                const table = tables[Math.floor(Math.random() * tables.length)];
                const multiplier = randomInt(2, 10);
                a = table;
                b = multiplier;
            }

            if (op === 'div') {
                const divisor = divisors[Math.floor(Math.random() * divisors.length)];
                const quotient = randomInt(2, 10);
                a = divisor * quotient;
                b = divisor;
            }

            if (!allowCarry && op === 'add') {
                const digitLimit = Math.min(9, max);
                a = randomInt(min, digitLimit);
                b = randomInt(min, digitLimit);
                if ((a + b) > max) {
                    const sum = a + b;
                    if (sum > max) { a = Math.floor(sum / 2); b = sum - a; }
                }
            }

            const { result, symbol } = resolveOperation(op, a, b);
            let label = 'Calcul';
            if (op === 'add') { label = 'Addition'; }
            if (op === 'sub') { label = 'Soustraction'; }
            if (op === 'mul') { label = 'Multiplication'; }
            if (op === 'div') { label = 'Division'; }
            const prompt = `Calcule : ${a} ${symbol} ${b}`;
            questions.push(buildNumericQuestion(prompt, result, options, label));
        }
        return questions;
    },
    'math:multi-terms': (level) => {
        const settings = level.settings || {};
        const operations = settings.operations || ['add'];
        const terms = settings.terms || 3;
        const min = settings.min ?? 1;
        const max = settings.max ?? 80;
        const exerciseCount = level.exerciseCount || 6;
        const options = settings.options || level.options || 4;
        const allowCarry = settings.allowCarry ?? true;
        const questions = [];

        for (let i = 0; i < exerciseCount; i++) {
            const numbers = [];
            for (let t = 0; t < terms; t++) {
                numbers.push(randomInt(min, max));
            }

            const op = operations[Math.floor(Math.random() * operations.length)];
            let expression = '';
            let result = numbers[0];

            for (let t = 1; t < numbers.length; t++) {
                if (op === 'add') {
                    if (!allowCarry && result + numbers[t] > max) {
                        numbers[t] = randomInt(min, Math.max(min + 1, max - result));
                    }
                    expression += `${t === 1 ? numbers[0] : ''} + ${numbers[t]}`;
                    result += numbers[t];
                } else {
                    expression += `${t === 1 ? numbers[0] : ''} - ${numbers[t]}`;
                    result -= numbers[t];
                }
            }

            if (!expression) {
                expression = numbers.join(' + ');
                result = numbers.reduce((sum, value) => sum + value, 0);
            }

            const prompt = `Résous : ${expression}`;
            questions.push(buildNumericQuestion(prompt, result, options, 'Calcul multi-termes'));
        }
        return questions;
    },
    'math:multiplication': (level) => {
        const settings = level.settings || {};
        const tables = settings.tables || [2, 3, 4, 5];
        const [min, max] = settings.range || [2, 10];
        const exerciseCount = level.exerciseCount || 6;
        const options = level.options || 3;
        const includeColumn = settings.column || false;
        const questions = [];

        for (let i = 0; i < exerciseCount; i++) {
            const a = tables[Math.floor(Math.random() * tables.length)];
            const b = randomInt(min, max);
            const prompt = includeColumn
                ? `Pose et calcule : ${a} × ${b}`
                : `Calcule : ${a} × ${b}`;
            const result = a * b;
            questions.push(buildNumericQuestion(prompt, result, options, 'Multiplication', '🧮'));
        }
        return questions;
    },
    'math:division': (level) => {
        const settings = level.settings || {};
        const divisors = settings.divisors || [2, 3, 4, 5];
        const maxDividend = settings.maxDividend || 100;
        const exerciseCount = level.exerciseCount || 6;
        const options = level.options || 3;
        const questions = [];

        for (let i = 0; i < exerciseCount; i++) {
            const divisor = divisors[Math.floor(Math.random() * divisors.length)];
            const quotient = randomInt(2, Math.max(5, Math.floor(maxDividend / divisor)));
            const dividend = divisor * quotient;
            const prompt = `Partage ${dividend} en ${divisor} parties égales`;
            questions.push(buildNumericQuestion(prompt, quotient, options, 'Division intuitive', '⚖️'));
        }
        return questions;
    },
    'math:complements': (level) => {
        const targets = level.settings?.targets || [10, 20];
        const exerciseCount = level.exerciseCount || 6;
        const options = level.options || 3;
        const questions = [];

        for (let i = 0; i < exerciseCount; i++) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            const number = randomInt(1, target - 1);
            const result = target - number;
            const prompt = `Quel est le complément pour aller jusqu'à ${target} ? ${number} + ? = ${target}`;
            questions.push(buildNumericQuestion(prompt, result, options, 'Complément', '🌟'));
        }
        return questions;
    },
    'math:jump': (level) => {
        const settings = level.settings || {};
        const multiples = settings.multiples || [10];
        const [min, max] = settings.range || [10, 200];
        const exerciseCount = level.exerciseCount || 6;
        const options = level.options || 4;
        const questions = [];

        for (let i = 0; i < exerciseCount; i++) {
            const base = randomInt(min, max);
            const multiple = multiples[Math.floor(Math.random() * multiples.length)];
            const direction = Math.random() < 0.5 ? 'add' : 'sub';
            const prompt = direction === 'add'
                ? `Ajoute ${multiple} à ${base}`
                : `Enlève ${multiple} à ${base}`;
            const result = direction === 'add' ? base + multiple : base - multiple;
            questions.push(buildNumericQuestion(prompt, result, options, 'Passage dizaines/centaines', '🚀'));
        }
        return questions;
    },
    'math:measure': (level, sectionId, datasets) => {
        const dataset = datasets[level.settings?.dataset] || [];
        return buildQuestionsFromItems(dataset).slice(0, level.exerciseCount || dataset.length);
    },
    'math:prices': (level, sectionId, datasets) => {
        const base = datasets[level.settings?.dataset] || [];
        const questions = buildQuestionsFromItems(base);
        const mixSettings = level.settings?.mixWith;
        if (mixSettings) {
            const mixGenerator = GENERATORS['math:operations'];
            if (mixGenerator) {
                const mixLevel = {
                    settings: {
                        operations: mixSettings.operations || ['add', 'sub'],
                        min: mixSettings.min || 2,
                        max: mixSettings.max || 40
                    },
                    exerciseCount: 2,
                    options: level.options || 3
                };
                questions.push(...mixGenerator(mixLevel));
            }
        }
        return questions.slice(0, level.exerciseCount || questions.length);
    },
    'fr:phonics': level => buildQuestionsFromItems(level.items || []),
    'fr:syllabes': level => buildQuestionsFromItems(level.items || []),
    'fr:phrases': level => buildQuestionsFromItems(level.items || []),
    'fr:grammaire': level => buildQuestionsFromItems(level.items || []),
    'fr:conjugaison': level => buildQuestionsFromItems(level.items || []),
    'fr:accord-verbe': level => buildQuestionsFromItems(level.items || []),
    'fr:dictee': level => buildQuestionsFromItems(level.items || []),
    'geo:identify': level => buildQuestionsFromItems(level.items || []),
    'geo:solids': level => buildQuestionsFromItems(level.items || []),
    'geo:droites': level => buildQuestionsFromItems(level.items || []),
    'geo:aires': level => buildQuestionsFromItems(level.items || []),
    'geo:volume': level => buildQuestionsFromItems(level.items || []),
    'geo:perimetre': level => {
        const settings = level.settings || {};
        const shape = settings.shape || 'carre';
        const [min, max] = settings.sideRange || [2, 12];
        const exerciseCount = level.exerciseCount || 6;
        const options = level.options || 3;
        const questions = [];

        for (let i = 0; i < exerciseCount; i++) {
            if (shape === 'carre') {
                const side = randomInt(min, max);
                const perimeter = side * 4;
                const prompt = `Quel est le périmètre d'un carré de côté ${side} cm ?`;
                questions.push(buildNumericQuestion(prompt, perimeter, options, 'Périmètre du carré', '🟩'));
            } else {
                const length = randomInt(min, max);
                const width = randomInt(min, max);
                const perimeter = 2 * (length + width);
                const prompt = `Quel est le périmètre d'un rectangle ${length} cm × ${width} cm ?`;
                questions.push(buildNumericQuestion(prompt, perimeter, options, 'Périmètre du rectangle', '⬛'));
            }
        }
        return questions;
    },
    'geo:revision': (level, sectionId, datasets, context) => {
        const mix = level.settings?.mix || [];
        const exerciseCount = level.exerciseCount || 6;
        const pool = [];
        const sourceLevels = state.sectionData?.pilot?.levels || [];

        mix.forEach(template => {
            const generator = GENERATORS[template];
            if (!generator) { return; }
            const relatedLevels = sourceLevels.filter(l => l.template === template && Array.isArray(l.items));
            relatedLevels.slice(0, 2).forEach(sampleLevel => {
                pool.push(...generator(sampleLevel, sectionId, datasets, context));
            });
        });

        while (pool.length < exerciseCount && pool.length > 0) {
            pool.push(...pool);
        }

        return pool.slice(0, exerciseCount);
    },
    'logique:mots-cles': level => buildQuestionsFromItems(level.items || []),
    'logique:probleme': level => buildQuestionsFromItems(level.items || []),
    'logique:choix-operation': level => buildQuestionsFromItems(level.items || []),
    'logique:etapes': level => buildQuestionsFromItems(level.items || []),
    'logique:partage': level => buildQuestionsFromItems(level.items || []),
    'logique:suite': level => buildQuestionsFromItems(level.items || []),
    'logique:suite-nombres': level => buildQuestionsFromItems(level.items || []),
    'logique:mesures': level => buildQuestionsFromItems(level.items || []),
    'logique:revision': (level, sectionId, datasets, context) => {
        const mix = level.settings?.mix || [];
        const exerciseCount = level.exerciseCount || 6;
        const pool = [];
        const sourceLevels = state.sectionData?.pilot?.levels || [];

        mix.forEach(template => {
            const generator = GENERATORS[template];
            if (!generator) { return; }
            const relatedLevels = sourceLevels.filter(l => l.template === template && Array.isArray(l.items));
            relatedLevels.slice(0, 2).forEach(sampleLevel => {
                pool.push(...generator(sampleLevel, sectionId, datasets, context));
            });
        });

        while (pool.length < exerciseCount && pool.length > 0) {
            pool.push(...pool);
        }

        return pool.slice(0, exerciseCount);
    },
    'train:math': (level) => GENERATORS['math:operations']({
        settings: {
            operations: level.settings?.operations || ['add', 'sub'],
            tables: level.settings?.tables,
            min: level.settings?.min || 1,
            max: level.settings?.max || 30
        },
        exerciseCount: level.exerciseCount || 6,
        options: level.options || 3
    }),
    'train:problemes': (level, sectionId, datasets) => {
        const dataset = datasets[level.settings?.dataset] || [];
        return buildQuestionsFromItems(dataset).slice(0, level.exerciseCount || dataset.length);
    },
    'train:francais': (level, sectionId, datasets) => {
        const dataset = datasets[level.settings?.dataset] || [];
        return buildQuestionsFromItems(dataset).slice(0, level.exerciseCount || dataset.length);
    },
    'train:audio': (level, sectionId, datasets) => {
        const dataset = datasets[level.settings?.dataset] || [];
        return buildQuestionsFromItems(dataset).slice(0, level.exerciseCount || dataset.length);
    },
    'train:lecture': (level, sectionId, datasets) => {
        const dataset = datasets[level.settings?.dataset] || [];
        return buildQuestionsFromItems(dataset).slice(0, level.exerciseCount || dataset.length);
    },
    'train:mix': (level, sectionId, datasets, context) => {
        const mix = level.settings?.mix || [];
        const exerciseCount = level.exerciseCount || 6;
        const pool = [];
        mix.forEach(template => {
            const generator = GENERATORS[template];
            if (generator) {
                const subset = generator({
                    settings: level.settings,
                    exerciseCount: 3,
                    options: level.options || 4
                }, sectionId, datasets, context);
                pool.push(...subset);
            }
        });
        while (pool.length < exerciseCount) {
            pool.push(...pool);
        }
        return pool.slice(0, exerciseCount);
    },
    'puzzles:puzzlemagique': level => buildQuestionsFromItems(level.items || []),
    'math:repartis': level => buildQuestionsFromItems(level.items || [])
};

function resolveOperation(op, a, b) {
    switch (op) {
        case 'add':
            return { result: a + b, symbol: '+' };
        case 'sub':
            return { result: a - b, symbol: '-' };
        case 'mul':
            return { result: a * b, symbol: '×' };
        case 'div':
            return { result: Math.floor(a / b), symbol: '÷' };
        default:
            return { result: a + b, symbol: '+' };
    }
}

function buildNumericQuestion(prompt, correctValue, optionCount = 3, explanation = '', illustration = '') {
    const options = new Set([correctValue]);
    const variance = Math.max(2, Math.floor(Math.abs(correctValue) * 0.2) + 1);

    while (options.size < optionCount) {
        const delta = randomInt(1, variance + 3);
        const candidate = Math.random() < 0.5 ? correctValue + delta : correctValue - delta;
        if (candidate >= 0) {
            options.add(candidate);
        }
    }

    const shuffled = shuffleArray(Array.from(options));
    return {
        text: prompt,
        options: shuffled.map(value => value.toString()),
        correctIndex: shuffled.indexOf(correctValue),
        explanation,
        illustration,
        tip: explanation
    };
}

function shuffleArray(array) {
    const clone = [...array];
    for (let i = clone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearTimer();
    } else {
        const level = state.sectionData?.pilot?.levels?.[state.currentLevelIndex];
        if (level?.timerSeconds) {
            setupTimer(state.timer.remaining || level.timerSeconds);
        }
    }
});

function getAvatarMeta(avatarId) {
    const library = window.AVATAR_LIBRARY || {};
    return library[avatarId] || null;
}
