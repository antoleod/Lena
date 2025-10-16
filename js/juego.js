console.log("juego.js loaded");

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const userProfile = storage.loadUserProfile();
    console.log("userProfile:", userProfile);

    if (!userProfile) {
        console.log("Redirecting to login.html");
        window.location.href = 'login.html';
        return;
    }

    const persistedAvatar = typeof storage.loadSelectedAvatar === 'function'
        ? storage.loadSelectedAvatar()
        : null;
    if (persistedAvatar?.id) {
        userProfile.avatar = {
            ...(userProfile.avatar || {}),
            ...persistedAvatar
        };
    }

    // --- DOM Elements ---
    const content = document.getElementById('content');
    const btnBack = document.getElementById('btnBack');
    const btnLogros = document.getElementById('btnLogros');
    const btnLogout = document.getElementById('btnLogout');
    const userInfo = document.getElementById('user-info');
    const scoreStars = document.getElementById('scoreStars');
    const scoreCoins = document.getElementById('scoreCoins');
    const levelDisplay = document.getElementById('level');
    const btnReadMode = document.getElementById('btnReadMode');

    // --- Audio Pre-loading ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const soundBuffers = {};

    async function loadSound(name, url) {
        if (!audioContext) return;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            soundBuffers[name] = audioBuffer;
        } catch (error) {
            console.warn(`Could not load sound: ${name}`, error);
        }
    }

    function playBufferedSound(name, volume = 1.0) {
        if (window.audioManager?.isMuted || !soundBuffers[name] || !audioContext) {
            return;
        }
        // Allow playing sounds even if the context was suspended by the browser
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume;

        const source = audioContext.createBufferSource();
        source.buffer = soundBuffers[name];
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(0);
    }

    const stageBottom = document.getElementById('stageBottom');
    const btnPrev = document.getElementById('btnPrev');
    const btnSkip = document.getElementById('btnSkip');
    const btnShop = document.getElementById('btnShop');
    const shopModal = document.getElementById('shopModal');
    const shopList = document.getElementById('shopList');
    const inventoryList = document.getElementById('inventoryList');
    const shopCloseBtn = document.getElementById('shopClose');

    // --- Game Data ---
    const LEVELS_PER_TOPIC = 12;
    const DEFAULT_QUESTIONS_PER_LEVEL = 7;
    const TOPIC_QUESTION_COUNTS = {
        additions: 7,
        soustractions: 7,
        multiplications: 7,
        divisions: 7,
        colors: 7
    };
    const MEMORY_GAME_LEVELS = window.gameData?.MEMORY_GAME_LEVELS || [];
    const emoji = {
        blue: '🔵', yellow: '🟡', red: '🔴', green: '🟢', orange: '🟠', purple: '🟣',
        car: '🚗', bus: '🚌', plane: '✈️', rocket: '🚀', star: '⭐', coin: '💰', sparkle: '✨',
        bear: '🐻', rabbit: '🐰', dog: '🐶', cat: '🐱', fish: '🐠', frog: '🐸', bird: '🐦', panda: '🐼',
        sort: '🗂️', riddle: '🤔', vowel: '🅰️', shape: '🔷', sequence: '➡️',
        sun: '☀️', moon: '🌙', cloud: '☁️', rainbow: '🌈', cupcake: '🧁', icecream: '🍦',
        balloon: '🎈', paint: '🖍️', drum: '🥁', guitar: '🎸', book: '📘', kite: '🪁'
    };
    const positiveMessages = ['🦄 Bravo !', '✨ Super !', '🌈 Génial !', '🌟 Parfait !', '🎉 Formidable !'];
    window.positiveMessages = positiveMessages;
    const MATH_OPERATION_THEMES = {
        additions: {
            id: 'additions',
            label: 'Sommes lumineuses',
            icon: '🧱',
            accent: '#ff9ae1',
            accentSoft: '#ffe6f7',
            optionIcons: ['🧱', '🧊', '🪄', '🔷'],
            stickers: ['🧱', '🧊', '🪄', '🌈'],
            encouragement: '🧱 Essaie encore, tu peux bâtir la tour magique !',
            success: '🧱 Tour lumineuse complétée !',
            storylines: [
                'Empile les briques brillantes pour réveiller le château.',
                'Ajoute les blocs arc-en-ciel pour aider les lutins.',
                'Construis un pont de lumière pour la licorne voyageuse.'
            ]
        },
        soustractions: {
            id: 'soustractions',
            label: 'Récolte fruitée',
            icon: '🍎',
            accent: '#ffb347',
            accentSoft: '#ffe7c7',
            optionIcons: ['🍎', '🍐', '🍑', '🍊'],
            stickers: ['🍓', '🍎', '🍑', '🍐'],
            encouragement: '🍏 Retente ta récolte, tu vas y arriver !',
            success: '🍎 Récolte délicieuse réussie !',
            storylines: [
                'Distribue les fruits magiques aux amis de la forêt.',
                'Cueille les pommes en retirant juste ce qu’il faut.',
                'Aide la fée à partager les fruits du verger doré.'
            ]
        },
        multiplications: {
            id: 'multiplications',
            label: 'Constellations étincelantes',
            icon: '✨',
            accent: '#8c5bff',
            accentSoft: '#e5dcff',
            optionIcons: ['✨', '🌟', '💎', '🪄'],
            stickers: ['🌟', '💫', '✨', '🪐'],
            encouragement: '✨ Respire et multiplie les étoiles une à une !',
            success: '🌟 Constellation complète !',
            storylines: [
                'Relie les étoiles de la table magique.',
                'Illumine le ciel pour le renard cosmique.',
                'Trace de nouvelles constellations scintillantes.'
            ]
        },
        divisions: {
            id: 'divisions',
            label: 'Trésors partagés',
            icon: '🪙',
            accent: '#44c2ff',
            accentSoft: '#d6f4ff',
            optionIcons: ['🪙', '💰', '📦', '💎'],
            stickers: ['🪙', '💰', '🧭', '🪄'],
            encouragement: '🪙 Divise encore, chaque indice compte !',
            success: '🗝️ Coffre ouvert, trésor partagé !',
            storylines: [
                'Partage équitablement les pièces des pirates gentils.',
                'Répartis les trésors entre les explorateurs amis.',
                'Ouvre la porte magique en divisant correctement.'
            ]
        }
    };

    function buildAdditionConfigs(count) {
        return Array.from({ length: count }, (_, index) => {
            const step = index + 1;
            const maxSum = step * 10;
            return {
                maxSum,
                maxAddend: maxSum,
                minAddend: 0,
                description: `Sommes jusqu'à ${maxSum}`,
                storyIndex: index
            };
        });
    }

    function buildSubtractionConfigs(count) {
        return Array.from({ length: count }, (_, index) => {
            const step = index + 1;
            const maxStart = step * 10;
            return {
                maxStart,
                minResult: 0,
                description: `Restes jusqu'à ${maxStart}`,
                storyIndex: index
            };
        });
    }

    function buildMultiplicationConfigs(count) {
        return Array.from({ length: count }, (_, index) => {
            const table = index + 1;
            return {
                tables: [table],
                minFactor: 1,
                maxFactor: 12,
                description: `Table de ${table}`,
                storyIndex: index
            };
        });
    }

    function buildDivisionConfigs(count) {
        return Array.from({ length: count }, (_, index) => {
            const divisor = index + 1;
            return {
                divisor,
                minQuotient: 1,
                maxQuotient: Math.min(12, divisor === 1 ? 12 : 12 - Math.max(0, divisor - 6)),
                description: `Divisions par ${divisor}`,
                storyIndex: index
            };
        });
    }

    const MATH_LEVEL_CONFIG = {
        additions: buildAdditionConfigs(LEVELS_PER_TOPIC),
        soustractions: buildSubtractionConfigs(LEVELS_PER_TOPIC),
        multiplications: buildMultiplicationConfigs(Math.max(LEVELS_PER_TOPIC, 12)),
        divisions: buildDivisionConfigs(Math.max(LEVELS_PER_TOPIC, 12))
    };

    window.LENA_MATH_THEMES = MATH_OPERATION_THEMES;
    window.LENA_MATH_LEVEL_CONFIG = MATH_LEVEL_CONFIG;

    const DEFAULT_INK_COLOR = '#5a5a5a';
    const PAUSE_REMINDER_DELAY = 8 * 60 * 1000;
    const AVATAR_LIBRARY = window.AVATAR_LIBRARY || {};
    const SHOP_BADGES = createBadgeItems();
    const SHOP_CATALOG = buildShopCatalogue();
    const levelDecorIcons = {
        default: ['✨', '🌟', '💫', '🌈'],
        1: ['🦄', '✨', '🌸', '🌈'],
        2: ['☁️', '🌟', '🪁', '✨'],
        3: ['🌿', '🦋', '🍀', '✨'],
        4: ['🍊', '🌞', '🍭', '✨'],
        5: ['🧚‍♀️', '✨', '💜', '🌙'],
        6: ['🐬', '🌊', '🐚', '✨'],
        7: ['🍃', '🐞', '🌻', '✨'],
        8: ['🪁', '☁️', '🛸', '✨'],
        9: ['⭐️', '🍯', '🧸', '✨'],
        10: ['🪐', '🌙', '⭐️', '✨'],
        11: ['🍂', '🔥', '🌟', '✨'],
        12: ['🔮', '💜', '🌙', '✨']
    };
    const TOPIC_SKILL_TAGS = {
        additions: 'math:addition',
        soustractions: 'math:subtraction',
        multiplications: 'math:multiplication',
        divisions: 'math:division',
        colors: 'cognition:colors',
        stories: 'reading:comprehension',
        memory: 'memory:matching',
        sorting: 'logic:sorting',
        riddles: 'language:riddle',
        vowels: 'language:vowel',
        sequences: 'logic:sequence',
        'number-houses': 'math:numberBond',
        'puzzle-magique': 'logic:puzzle',
        repartis: 'math:distribution',
        dictee: 'language:dictation',
        'math-blitz': 'math:blitz',
        'lecture-magique': 'reading:fluency',
        raisonnement: 'logic:reasoning',
        'ecriture-cursive': 'writing:cursive', // Habilitado
        'abaque-magique': 'math:abacus', // Habilitado
        'mots-outils': 'language:grammar' // Habilitado
    };
    
    function svgDataUri(svg) {
        return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}`;
    }

    function generateBadgePreview(spec, size) {
        const radius = size / 2 - size * 0.08;
        const bg = spec.colors?.background || '#FFD93D';
        const accent = spec.colors?.accent || '#FFB037';
        const text = spec.colors?.text || '#4B3200';
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="badgeGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="url(#badgeGlow)"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${radius - size * 0.08}" fill="${bg}" opacity="0.85"/>
  <text x="50%" y="52%" font-family="'Fredoka', 'Nunito', sans-serif" font-weight="700" font-size="${size * 0.45}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${spec.emoji}</text>
</svg>`;
        return svgDataUri(svg);
    }

    function createBadgeItems() {
        const base = [
            {
                id: 'badge-etoile',
                name: 'Badge Super Étoile',
                emoji: '🌟',
                priceCoins: 35,
                description: 'Affiche une médaille étoilée près de ton nom.',
                colors: { background: '#FFD93D', accent: '#FFB037', text: '#4B3200' }
            },
            {
                id: 'badge-arcenciel',
                name: 'Badge Arc-en-ciel',
                emoji: '🌈',
                priceCoins: 45,
                description: 'Ajoute un arc-en-ciel magique à ton profil.',
                colors: { background: '#8AB6FF', accent: '#FF9AE1', text: '#1D2A58' }
            },
            {
                id: 'badge-etoiles-filantes',
                name: 'Badge Étoiles Filantes',
                emoji: '💫',
                priceCoins: 55,
                description: 'Des étoiles filantes pour célébrer tes progrès.',
                colors: { background: '#AC92FF', accent: '#FFD86F', text: '#2E1D52' }
            },
            {
                id: 'badge-licorne-magique',
                name: 'Badge Licorne Magique',
                emoji: '🦄',
                priceCoins: 70,
                description: 'Un badge licorne pour les plus rêveurs.',
                colors: { background: '#E0BBE4', accent: '#957DAD', text: '#574B60' }
            },
            {
                id: 'badge-dragon-feu',
                name: 'Badge Dragon de Feu',
                emoji: '🐉',
                priceCoins: 80,
                description: 'Montre ta force avec ce badge dragon.',
                colors: { background: '#FF6B6B', accent: '#EE4035', text: '#4A0505' }
            },
            {
                id: 'badge-pingouin-glace',
                name: 'Badge Pingouin Glacé',
                emoji: '🐧',
                priceCoins: 40,
                description: 'Un badge givré pour les explorateurs polaires.',
                colors: { background: '#BEE3FF', accent: '#4A90E2', text: '#17426B' }
            },
            {
                id: 'badge-fee-lumineuse',
                name: 'Badge Fée Lumineuse',
                emoji: '🧚‍♀️',
                priceCoins: 65,
                description: 'La poussière de fée te suit dans chaque aventure.',
                colors: { background: '#FFE8F6', accent: '#FF9FF3', text: '#6C1A5F' }
            },
            {
                id: 'badge-robot-genial',
                name: 'Badge Robot Génial',
                emoji: '🤖',
                priceCoins: 50,
                description: 'Pour les inventeurs curieux et malins.',
                colors: { background: '#E0F7FA', accent: '#00BCD4', text: '#004D54' }
            },
            {
                id: 'badge-etoile-nord',
                name: 'Badge Étoile du Nord',
                emoji: '🌌',
                priceCoins: 90,
                description: 'Une étoile brillante qui guide tes missions.',
                colors: { background: '#2E3359', accent: '#6C63FF', text: '#F4F4FF' }
            }
        ];

        return base.map(spec => ({
            ...spec,
            type: 'badge',
            iconUrl: generateBadgePreview(spec, 88),
            previewUrl: generateBadgePreview(spec, 144)
        }));
    }

    function buildShopCatalogue() {
        const catalogue = new Map();
        SHOP_BADGES.forEach(item => catalogue.set(item.id, item));
        Object.values(AVATAR_LIBRARY).forEach(avatar => {
            if (!avatar?.backgrounds) { return; }
            avatar.backgrounds.forEach(bg => {
                const backgroundItem = {
                    id: bg.id,
                    type: 'background',
                    ownerAvatarId: avatar.id,
                    name: bg.name,
                    priceCoins: bg.priceCoins || bg.price || 120,
                    description: bg.description,
                    palette: bg.palette,
                    iconUrl: bg.iconUrl,
                    previewUrl: bg.previewUrl,
                    motif: bg.motif || '✨'
                };
                catalogue.set(backgroundItem.id, backgroundItem);
            });
        });
        return catalogue;
    }

    function getShopItemsForAvatar(avatarId) {
        const items = [];
        if (avatarId && AVATAR_LIBRARY[avatarId]) {
            AVATAR_LIBRARY[avatarId].backgrounds?.forEach(bg => {
                const item = SHOP_CATALOG.get(bg.id);
                if (item) { items.push(item); }
            });
        }
        SHOP_BADGES.forEach(badge => items.push(badge));
        return items;
    }

    function findShopItem(itemId) {
        if (!itemId) { return null; }
        return SHOP_CATALOG.get(itemId) || null;
    }

    function getBoutiqueItem(itemId) {
        return findShopItem(itemId);
    }
    const answerOptionIcons = ['🔹', '🌟', '💡', '🎯', '✨', '🎈', '🧠'];
    const colorOptionIcons = ['🎨', '🖌️', '🧴', '🧑‍🎨', '🌈'];
    
    function withStoryIds(stories, prefix) {
        return stories.map((story, index) => ({
            ...story,
            id: story.id || `${prefix}-${index + 1}`
        }));
    }

    const storyCollections = [
        { id: 'set-1', stories: withStoryIds(window.storySetOne || [], 'set1-story') },
        { id: 'set-2', stories: withStoryIds(window.storySetTwo || [], 'set2-story') },
        { id: 'set-3', stories: withStoryIds(window.storySetThree || [], 'set3-story') }
    ];

    let activeStorySetIndex = 0;
    let magicStories = storyCollections[activeStorySetIndex].stories;

    function getActiveStorySet() {
        return storyCollections[activeStorySetIndex] || storyCollections[0];
    }

    function setActiveStorySet(newIndex) {
        const numericIndex = Number.isFinite(newIndex) ? newIndex : parseInt(newIndex, 10);
        const safeIndex = Number.isNaN(numericIndex)
            ? 0
            : Math.min(Math.max(0, numericIndex), storyCollections.length - 1);
        activeStorySetIndex = safeIndex;
        magicStories = storyCollections[safeIndex]?.stories || [];
        if (userProgress.storyProgress && typeof userProgress.storyProgress === 'object') {
            userProgress.storyProgress.activeSetIndex = safeIndex;
        }
    }

    function ensureStoryProgressInitialized() {
        if (!userProgress.storyProgress || typeof userProgress.storyProgress !== 'object') {
            userProgress.storyProgress = { activeSetIndex: activeStorySetIndex, completed: {} };
        }
        if (!userProgress.storyProgress.completed || typeof userProgress.storyProgress.completed !== 'object') {
            userProgress.storyProgress.completed = {};
        }
        const currentSet = getActiveStorySet();
        if (currentSet && !userProgress.storyProgress.completed[currentSet.id]) {
            userProgress.storyProgress.completed[currentSet.id] = {};
        }
    }

    function getStoryCompletionMap(setId) {
        ensureStoryProgressInitialized();
        const targetSet = setId || getActiveStorySet()?.id;
        if (!targetSet) { return {}; }
        if (!userProgress.storyProgress.completed[targetSet]) {
            userProgress.storyProgress.completed[targetSet] = {};
        }
        return userProgress.storyProgress.completed[targetSet];
    }

    function isStoryMarkedCompleted(storyId, setId) {
        if (!storyId) { return false; }
        const map = getStoryCompletionMap(setId);
        return !!map[storyId];
    }

    function markStoryCompletedById(storyId, setId) {
        if (!storyId) { return; }
        const map = getStoryCompletionMap(setId);
        map[storyId] = true;
    }

    function isActiveStorySetFullyCompleted() {
        if (!magicStories || !magicStories.length) { return false; }
        const currentSet = getActiveStorySet();
        const map = getStoryCompletionMap(currentSet?.id);
        return magicStories.every(story => map[story.id]);
    }

    function advanceStorySetIfNeeded() {
        if (!isActiveStorySetFullyCompleted()) { return false; }
        if (activeStorySetIndex >= storyCollections.length - 1) { return false; }
        setActiveStorySet(activeStorySetIndex + 1);
        ensureStoryProgressInitialized();
        return true;
    }

    function normalizeStoryProgress(rawProgress) {
        const normalized = { activeSetIndex: 0, completed: {} };
        if (rawProgress && typeof rawProgress === 'object') {
            const rawIndex = Number(rawProgress.activeSetIndex);
            if (!Number.isNaN(rawIndex)) {
                normalized.activeSetIndex = Math.min(
                    Math.max(0, rawIndex),
                    storyCollections.length - 1
                );
            }
            if (rawProgress.completed && typeof rawProgress.completed === 'object') {
                Object.keys(rawProgress.completed).forEach(setId => {
                    const setData = rawProgress.completed[setId];
                    if (setData && typeof setData === 'object') {
                        normalized.completed[setId] = { ...setData };
                    }
                });
            }
        }
        return normalized;
    }

    function migrateLegacyStoryKeys(answeredMap) {
        if (!answeredMap || typeof answeredMap !== 'object') { return; }
        const legacyKeys = Object.keys(answeredMap).filter(key => {
            return /^stories-\d+$/.test(key) && answeredMap[key] === 'completed';
        });
        if (!legacyKeys.length) { return; }
        const firstSet = storyCollections[0];
        legacyKeys.forEach(key => {
            const match = key.match(/^stories-(\d+)$/);
            if (!match) { return; }
            const storyIndex = parseInt(match[1], 10) - 1;
            const legacyStory = firstSet?.stories?.[storyIndex];
            if (legacyStory?.id) {
                markStoryCompletedById(legacyStory.id, firstSet.id);
            }
        });
    }

    const colorMap = {
        '🟢 Vert': 'green', '🟠 Orange': 'orange', '🟣 Violet': 'purple',
        '🔵 Bleu': 'blue', '🟡 Jaune': 'yellow', '🔴 Rouge': 'red',
        '⚫ Noir': 'black', '⚪ Blanc': 'white', '💗 Rose': 'pink',
        '💧 Bleu Clair': 'light-blue', '🍃 Vert Clair': 'light-green',
        '🤎 Marron': 'brown', '🍫 Chocolat': 'chocolate', '💜 Lavande': 'lavender', '🍷 Bordeaux': 'bordeaux',
    };

    const COLOR_MIX_LIBRARY = window.gameData?.COLOR_MIX_LIBRARY || [];
    const sortingLevels = window.gameData?.sortingLevels || [];
    const riddleLevels = window.gameData?.riddleLevels || [];
    const vowelLevels = window.gameData?.vowelLevels || [];
    const sequenceLevels = window.gameData?.sequenceLevels || [];

    const allQuestions = {
        additions: [], soustractions: [], multiplications: [], divisions: [], colors: [], stories: [], riddles: [], sorting: [], letters: [], shapes: [], vowels: [], sequences: [],
        'puzzle-magique': [], repartis: [], dictee: [], 'math-blitz': [], 'lecture-magique': [], raisonnement: [], review: []
    };

    // --- Game State & User Progress ---
    let gameState = {
        currentTopic: '',
        currentLevel: null,
        currentQuestionIndex: 0,
        storyQuiz: [],
        currentVowelLevelData: null,
        decorContainer: null,
        lastDecorKey: null,
        lastAppliedTheme: '',
        questionStartTime: null,
        questionSkillTag: null,
        historyTracker: null,
        currentStoryIndex: null,
        activeReviewSkills: [],
        pauseReminderTimeout: null,
        currentRiddleLevelIndex: 0,
    };

    let userProgress = {
        userScore: { stars: 0, coins: 0 },
        answeredQuestions: {},
        storyProgress: { activeSetIndex: 0, completed: {} },
        ownedItems: [],
        activeCosmetics: { background: null, badge: null },
        activeBadgeEmoji: null,
    };

    // --- Initialization ---
    console.log("Initializing game for user:", userProfile.name);
    function init() {
        loadProgress();
        historyTracker = createHistoryTracker(userProfile.name);
        historyTracker.trackAppOpen();
        window.addEventListener('beforeunload', () => historyTracker.trackAppClose());
        schedulePauseReminder();
        initializeQuestions();
        setupUI();
        setupEventListeners();
        showTopicMenu();
        // Pre-load sounds
        loadSound('correct', '../assets/sounds/correct.mp3');
        loadSound('wrong', '../assets/sounds/bling.wav');
        loadSound('coins', '../assets/sounds/bling.wav');
        loadSound('hover', '../assets/sounds/bling.wav');

    }

    function setupUI() {
        renderUserIdentity();
        setPrimaryTheme(userProfile.color);
        updateUI();
        applyActiveCosmetics();
    }

    function resolveAvatarIcon(iconUrl = '') {
        if (!iconUrl || typeof iconUrl !== 'string') {
            return '';
        }
        if (/^(data:|https?:|blob:)/.test(iconUrl)) {
            return iconUrl;
        }
        if (iconUrl.startsWith('../')) {
            return iconUrl;
        }
        if (iconUrl.startsWith('./')) {
            return `../${iconUrl.slice(2)}`;
        }
        const cleaned = iconUrl.replace(/^\/+/, '');
        return `../${cleaned}`;
    }

    function renderUserIdentity(newBadgeEmoji) {
        if (typeof newBadgeEmoji !== 'undefined') {
            userProgress.activeBadgeEmoji = newBadgeEmoji;
        }
        if (!userInfo) { return; }
    
        userInfo.innerHTML = '';
        const avatarMeta = getAvatarMetaLocal(userProfile.avatar?.id);
        const avatarIconUrl = userProfile.avatar?.iconUrl || avatarMeta?.iconUrl;
        const avatarName = userProfile.avatar?.name || avatarMeta?.name || 'Avatar';
        const avatarPalette = avatarMeta?.defaultPalette || null;

        userInfo.dataset.avatarId = userProfile.avatar?.id || '';
        userInfo.dataset.avatarName = avatarName || '';
        if (avatarIconUrl) {
            userInfo.dataset.avatarIcon = avatarIconUrl;
        } else {
            delete userInfo.dataset.avatarIcon;
        }

        if (!userInfo.classList.contains('user-info-home')) {
            userInfo.classList.add('user-info-home');
        }
        const avatarClassPrefix = 'user-info-home--';
        const variantClasses = Array.from(userInfo.classList).filter(cls => cls.startsWith(avatarClassPrefix));
        variantClasses.forEach(cls => userInfo.classList.remove(cls));
        if (avatarMeta?.id) {
            userInfo.classList.add(`${avatarClassPrefix}${avatarMeta.id}`);
        }

        if (avatarPalette) {
            const primaryTone = avatarPalette.accent || avatarPalette.primary || '#f0e6ff';
            const inkTone = avatarPalette.textLight || '#2d1b44';
            userInfo.style.setProperty('--user-info-bg', primaryTone);
            userInfo.style.setProperty('--user-info-ink', inkTone);
            userInfo.style.setProperty('--user-info-name', inkTone);
        } else {
            userInfo.style.removeProperty('--user-info-bg');
            userInfo.style.removeProperty('--user-info-ink');
            userInfo.style.removeProperty('--user-info-name');
        }

        if (avatarIconUrl) {
            const avatarImg = document.createElement('img');
            avatarImg.src = avatarIconUrl;
            avatarImg.alt = avatarName;
            avatarImg.loading = 'lazy';
            avatarImg.className = 'user-info__avatar';
            userInfo.appendChild(avatarImg);
        } else {
            const avatarFallback = document.createElement('span');
            avatarFallback.className = 'user-info__avatar user-info__avatar--fallback';
            avatarFallback.textContent = (userProfile.name || '?').charAt(0).toUpperCase();
            userInfo.appendChild(avatarFallback);
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'user-info__name';
        nameSpan.textContent = userProfile.name || 'Explorateur·rice';
        userInfo.appendChild(nameSpan);

        if (userProgress.activeBadgeEmoji) {
            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'user-info__badge';
            badgeSpan.textContent = userProgress.activeBadgeEmoji;
            badgeSpan.title = 'Badge spécial';
            userInfo.appendChild(badgeSpan);
        }
    }

    function setPrimaryTheme(color) {
        const safeColor = color || userProfile.color || '#a890f0';
        document.documentElement.style.setProperty('--primary', safeColor);
        document.documentElement.style.setProperty('--primary-light', lightenColor(safeColor, 0.22));
        document.documentElement.style.setProperty('--primary-contrast', getReadableTextColor(safeColor));
    }

    const userMenu = document.getElementById('user-menu');
    const menuBack = document.getElementById('menu-back');
    const menuShop = document.getElementById('menu-shop');
    const menuAvatar = document.getElementById('menu-avatar');

    function setupEventListeners() {
        btnLogout.addEventListener('click', () => {
            gameState.historyTracker?.trackAppClose();
            localStorage.removeItem('mathsLenaUserProfile');
            window.location.href = 'login.html';
        });
        btnLogros.addEventListener('click', () => {
            window.location.href = '../logros.html';
        });

        userInfo.setAttribute('role', 'button');
        userInfo.setAttribute('tabindex', '0');
        userInfo.classList.add('user-info-home');

        userInfo.addEventListener('click', () => {
            userMenu.classList.toggle('is-hidden');
        });

        menuBack.addEventListener('click', () => {
            userMenu.classList.add('is-hidden');
            showTopicMenu();
        });

        menuShop.addEventListener('click', () => {
            window.location.href = 'boutique.html';
        });

        menuAvatar.addEventListener('click', () => {
            window.location.href = 'login.html?edit=true';
        });

        if (btnReadMode) {
            btnReadMode.disabled = false;
            btnReadMode.addEventListener('click', () => {
                const isActive = document.body.classList.toggle('read-mode-active');
                btnReadMode.classList.toggle('active', isActive);
                btnReadMode.setAttribute('aria-pressed', isActive);
                showSuccessMessage(isActive ? 'Mode lecture activé' : 'Mode lecture désactivé');
            });
        }

        btnShop.addEventListener('click', () => {
            window.location.href = 'boutique.html'; // Rediriger vers la boutique
        });
        if (shopCloseBtn) {
            shopCloseBtn.addEventListener('click', closeShop);
        }
        if (shopModal) {
            shopModal.addEventListener('click', (event) => {
                if (event.target === shopModal) {
                    closeShop();
                }
            });
        }
        // Global bottom controls
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                // Re-use the configured Back handler if available, otherwise go to topics
                if (btnBack && typeof btnBack.onclick === 'function') {
                    try { btnBack.onclick(); } catch (_) { showTopicMenu(); }
                } else {
                    showTopicMenu();
                }
            });
        }

        if (btnSkip) {
            btnSkip.addEventListener('click', () => {
                try {
                    // Topics with their own loaders
                    if (gameState.currentTopic === 'vowels') {
                        const next = (gameState.currentQuestionIndex || 0) + 1;
                        if (next < vowelLevels.length) { loadVowelQuestion(next); return; }
                        showLevelMenu('vowels'); return;
                    }
                    if (gameState.currentTopic === 'riddles') {
                        const next = (gameState.currentQuestionIndex || 0) + 1;
                        if (next < (riddleLevels[gameState.currentRiddleLevelIndex]?.questions?.length || 0)) { loadRiddleQuestion(next); return; }
                        showLevelMenu('riddles'); return;
                    }
                    if (gameState.currentTopic === 'sequences') {
                        const next = (gameState.currentLevel || 1); // levels are 1-based
                        if (next < sequenceLevels.length) { loadSequenceQuestion(next); return; }
                        showLevelMenu('sequences'); return;
                    }

                    // Generic question-flow topics
                    if (allQuestions && allQuestions[gameState.currentTopic]) {
                        const questionsForLevel = allQuestions[gameState.currentTopic].filter(q => q.difficulty === gameState.currentLevel);
                        const next = (gameState.currentQuestionIndex || 0) + 1;
                        if (next < questionsForLevel.length) { loadQuestion(next); return; }
                        // End of level -> back to levels
                        showLevelMenu(gameState.currentTopic);
                        return;
                    }

                    // Mini-games managed by separate modules: return to their level menus
                    if (
                      gameState.currentTopic === 'memory' ||
                      gameState.currentTopic === 'puzzle-magique' ||
                      gameState.currentTopic === 'repartis' ||
                      gameState.currentTopic === 'dictee' ||
                      gameState.currentTopic === 'math-blitz' ||
                      gameState.currentTopic === 'lecture-magique' ||
                      gameState.currentTopic === 'raisonnement' ||
                      gameState.currentTopic === 'sorting'
                    ) {
                      showLevelMenu(gameState.currentTopic);
                      return;
                    }

                    // For mini-games without question index, just go back to level menu
                    if (gameState.currentTopic) {
                        showLevelMenu(gameState.currentTopic);
                    } else {
                        showTopicMenu();
                    }
                } catch (err) {
                    console.warn('Skip action failed', err);
                    showTopicMenu();
                }
            });
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && shopModal && shopModal.classList.contains('is-open')) {
                closeShop();
            }
        });
    }

    function loadProgress() {
        const loadedProgress = storage.loadUserProgress(userProfile.name);
        userProgress.userScore = loadedProgress.userScore;
        userProgress.answeredQuestions = loadedProgress.answeredQuestions;
        gameState.currentLevel = loadedProgress.currentLevel;
        userProgress.ownedItems = Array.isArray(loadedProgress.ownedItems) ? loadedProgress.ownedItems : [];
        userProgress.activeCosmetics = loadedProgress.activeCosmetics || { background: null, badge: null };
        userProgress.storyProgress = normalizeStoryProgress(loadedProgress.storyProgress);
        setActiveStorySet(userProgress.storyProgress.activeSetIndex || 0);
        ensureStoryProgressInitialized();
        migrateLegacyStoryKeys(userProgress.answeredQuestions);
        ensureStoryProgressInitialized();
        if (advanceStorySetIfNeeded()) {
            // Reset completion map for the newly active set if absent
            ensureStoryProgressInitialized();
        }
    }
    
    function _saveProgressImmediate() {
        const progress = {
            userScore: userProgress.userScore,
            answeredQuestions: userProgress.answeredQuestions,
            currentLevel: gameState.currentLevel,
            ownedItems: userProgress.ownedItems,
            activeCosmetics: userProgress.activeCosmetics,
            storyProgress: userProgress.storyProgress
        };
        storage.saveUserProgress(userProfile.name, progress);
    }
    const saveProgress = debounce(_saveProgressImmediate, 1500);
    
    function configureBackButton(label, handler) {
        btnBack.style.display = 'inline-block';
        btnBack.textContent = label;
        btnBack.onclick = () => {
            saveProgress();
            gameState.historyTracker?.endGame({ status: 'interrompu' });
            if (gameState.currentTopic === 'review') {
                gameState.activeReviewSkills = [];
            }
            handler();
        };
    }

    function markLevelCompleted(topic, level) {
        userProgress.answeredQuestions[`${topic}-${level}`] = 'completed';
        saveProgress();
    }

    function createGameContext(topic, extra = {}) {
        return {
            topic,
            content,
            btnLogros,
            btnLogout,
            get currentLevel() { 
                return gameState.currentLevel;
            },
            setCurrentLevel(level) {
                gameState.currentLevel = level;
                saveProgress();
            },
            userScore: userProgress.userScore,
            awardReward(stars = 0, coins = 0) {
                if (typeof stars === 'number') { userProgress.userScore.stars += stars; }
                if (typeof coins === 'number') { userProgress.userScore.coins += coins; }
                userProgress.userScore.stars = Math.max(0, userProgress.userScore.stars);
                userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins);
                updateUI();
                saveProgress();
            },
            updateUI,
            saveProgress,
            showSuccessMessage,
            showErrorMessage,
            showConfetti,
            speakText,
            playPositiveSound: () => playSound('correct'),
            playNegativeSound: () => playSound('wrong'),
            configureBackButton: (label, handler) => configureBackButton(label, handler),
            markLevelCompleted: () => markLevelCompleted(topic, gameState.currentLevel),
            setAnsweredStatus: (status) => {
                userProgress.answeredQuestions[`${topic}-${gameState.currentLevel}`] = status;
                saveProgress();
            },
            clearGameClasses: (classes) => {
                if (!Array.isArray(classes)) { return; }
                classes.forEach(cls => content.classList.remove(cls));
            },
            showLevelMenu: () => showLevelMenu(topic),
            goToTopics: showTopicMenu,
            ...extra
        };
    }

    function launchPuzzleMagique(level) {
        gameState.currentTopic = 'puzzle-magique';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('puzzle-magique');
        if (window.puzzleMagiqueGame && typeof window.puzzleMagiqueGame.start === 'function') {
            window.puzzleMagiqueGame.start(context);
        } else {
            console.warn('Module Puzzle Magique introuvable');
            showLevelMenu('puzzle-magique');
        }
    }

    function launchRepartisGame(level) {
        gameState.currentTopic = 'repartis';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('repartis');
        if (window.repartisGame && typeof window.repartisGame.start === 'function') {
            window.repartisGame.start(context);
        } else {
            console.warn('Module Répartis introuvable');
            showLevelMenu('repartis');
        }
    }

    function launchDicteeLevel(level) {
        gameState.currentTopic = 'dictee';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('dictee', {
            openLevelSelection: () => showLevelMenu('dictee'),
            openCustomEditor: () => launchCustomDictationManager(),
            startCustomPlay: () => startCustomDictationPlay(),
            restartMenu: () => showDicteeMenu()
        });
        if (window.dicteeGame && typeof window.dicteeGame.startGuided === 'function') {
            window.dicteeGame.startGuided(context, level);
        } else {
            console.warn('Module Dictée Magique introuvable');
            showLevelMenu('dictee');
        }
    }

    function launchMathBlitzLevel(level) {
        gameState.currentTopic = 'math-blitz';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('math-blitz');
        if (window.mathBlitzGame && typeof window.mathBlitzGame.start === 'function') {
            window.mathBlitzGame.start(context);
        } else {
            console.warn('Module Maths Sprint introuvable');
            showLevelMenu('math-blitz');
        }
    }

    function launchLectureMagiqueLevel(level) {
        gameState.currentTopic = 'lecture-magique';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('lecture-magique');
        if (window.lectureMagiqueGame && typeof window.lectureMagiqueGame.start === 'function') {
            window.lectureMagiqueGame.start(context);
        } else {
            console.warn('Module Lecture Magique introuvable');
            showLevelMenu('lecture-magique');
        }
    }

    // --- Nouveaux modules (3e primaire)
    function launchProblemsMagiques(level) {
        gameState.currentTopic = 'problems-magiques';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('problems-magiques');
        if (window.problemsMagiquesGame?.start) {
            window.problemsMagiquesGame.start(context);
        } else {
            showComingSoon('Problèmes Magiques', '💡');
        }
    }

    function launchFractionsFantastiques(level) {
        gameState.currentTopic = 'fractions-fantastiques';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('fractions-fantastiques');
        if (window.fractionsFantastiquesGame?.start) {
            window.fractionsFantastiquesGame.start(context);
        } else {
            showComingSoon('Fractions Fantastiques', '🍰');
        }
    }

    function launchTempsHorloges(level) {
        gameState.currentTopic = 'temps-horloges';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('temps-horloges');
        if (window.tempsHorlogesGame?.start) {
            window.tempsHorlogesGame.start(context);
        } else {
            showComingSoon('Temps & Horloges', '⏰');
        }
    }

    function launchTablesDefi(level) {
        gameState.currentTopic = 'tables-defi';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('tables-defi');
        if (window.tablesDefiGame?.start) {
            window.tablesDefiGame.start(context);
        } else {
            showComingSoon('Tables Défi', '✖️');
        }
    }

    function launchSeriesNumeriques(level) {
        gameState.currentTopic = 'series-numeriques';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('series-numeriques');
        if (window.seriesNumeriquesGame?.start) {
            window.seriesNumeriquesGame.start(context);
        } else {
            showComingSoon('Séries Numériques', '🔢');
        }
    }

    function launchRaisonnementLevel(level) {
        gameState.currentTopic = 'raisonnement';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('raisonnement');
        if (window.raisonnementGame && typeof window.raisonnementGame.start === 'function') {
            window.raisonnementGame.start(context);
        } else {
            console.warn('Module Raisonnement introuvable');
            showLevelMenu('raisonnement');
        }
    }

    function showDicteeMenu() {
        gameState.currentTopic = 'dictee';
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('dictee', {
            openLevelSelection: () => showLevelMenu('dictee'),
            startGuidedLevel: (level) => launchDicteeLevel(level),
            openCustomEditor: () => launchCustomDictationManager(),
            startCustomPlay: () => startCustomDictationPlay(),
            restartMenu: () => showDicteeMenu()
        });
        if (window.dicteeGame && typeof window.dicteeGame.showRoot === 'function') {
            window.dicteeGame.showRoot(context);
        } else {
            showLevelMenu('dictee');
        }
    }

    function launchCustomDictationManager() {
        gameState.currentTopic = 'dictee';
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('dictee', {
            openLevelSelection: () => showLevelMenu('dictee'),
            startGuidedLevel: (level) => launchDicteeLevel(level),
            startCustomPlay: () => startCustomDictationPlay(),
            restartMenu: () => showDicteeMenu()
        });
        if (window.dicteeGame && typeof window.dicteeGame.showParentZone === 'function') {
            window.dicteeGame.showParentZone(context);
        } else {
            console.warn('Zone parent dictée indisponible');
            showDicteeMenu();
        }
    }

    function startCustomDictationPlay() {
        gameState.currentTopic = 'dictee';
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('dictee', {
            openLevelSelection: () => showLevelMenu('dictee'),
            openCustomEditor: () => launchCustomDictationManager(),
            restartMenu: () => showDicteeMenu()
        });
        if (window.dicteeGame && typeof window.dicteeGame.startCustom === 'function') {
            window.dicteeGame.startCustom(context);
        } else {
            console.warn('Dictée personnalisée indisponible');
            showDicteeMenu();
        }
    }

    function showComingSoon(gameTitle, icon) {
        content.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'coming-soon-wrapper fx-bounce-in-down';

        const emoji = document.createElement('div');
        emoji.className = 'coming-soon-emoji';
        emoji.textContent = icon || '✨';
        wrapper.appendChild(emoji);

        const title = document.createElement('h2');
        title.className = 'coming-soon-title';
        title.textContent = `${gameTitle}`;
        wrapper.appendChild(title);

        const message = document.createElement('p');
        message.className = 'coming-soon-message';
        message.textContent = 'Ce jeu magique sera bientôt disponible !';
        wrapper.appendChild(message);

        content.appendChild(wrapper);
        configureBackButton('Retour aux sujets', showTopicMenu);
    }

    function launchEcritureCursive(level) {
        gameState.currentTopic = 'ecriture-cursive';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('ecriture-cursive');
        if (window.ecritureCursiveGame && typeof window.ecritureCursiveGame.start === 'function') {
            window.ecritureCursiveGame.start(context);
        } else {
            showComingSoon('J’écris en cursive', '✍️');
        }
    }
    function launchAbaqueMagique(level) {
        gameState.currentTopic = 'abaque-magique';
        gameState.currentLevel = level || 1; // Toujours commencer au niveau 1
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('abaque-magique');
        if (window.abaqueMagiqueGame && typeof window.abaqueMagiqueGame.start === 'function') {
            window.abaqueMagiqueGame.start(context); // Le module gère maintenant ses propres niveaux
        } else {
            showComingSoon('Abaque Magique', '🔢');
        }
    }
    function launchMotsOutils(level) {
        gameState.currentTopic = 'mots-outils';
        gameState.currentLevel = level;
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        const context = createGameContext('mots-outils');
        if (window.motsOutilsGame && typeof window.motsOutilsGame.start === 'function') {
            window.motsOutilsGame.start(context);
        } else {
            showComingSoon('Mots-Outils Magiques', '💬');
        }
    }
    // --- UI & Helpers ---
    function speakText(text) {
        if (window.speechSynthesis) {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            synth.speak(utterance);
        }
    }

    function playSound(type) {
        if (window.audioManager?.isMuted) {
            return;
        }
        if (type === 'correct' && soundCorrect) {
            playBufferedSound('correct'); // Already using buffered sound, good.
        } else if (type === 'wrong' && soundWrong) {
            playBufferedSound('wrong');
        } else if (type === 'coins' && soundCoins) {
            playBufferedSound('coins'); // Changed from soundCoins.play()
        }
    }

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function randomInt(min, max) {
        const lower = Math.ceil(Math.min(min, max));
        const upper = Math.floor(Math.max(min, max));
        if (upper <= lower) {
            return lower;
        }
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }

    function computeMathReward(type, level) {
        const base = {
            additions: { stars: 8, coins: 4 },
            soustractions: { stars: 8, coins: 4 },
            multiplications: { stars: 11, coins: 6 },
            divisions: { stars: 12, coins: 7 }
        }[type] || { stars: 8, coins: 4 };

        const stars = base.stars + level * 3;
        const coins = base.coins + Math.max(2, Math.floor(level * 1.5));
        return {
            stars,
            coins
        };
    }

    function applyOptionContent(element, value, iconIndex, iconSet = answerOptionIcons) {
        element.innerHTML = '';
        const icons = iconSet.length ? iconSet : answerOptionIcons;
        const iconSpan = document.createElement('span');
        iconSpan.className = 'option-icon';
        iconSpan.textContent = icons[iconIndex % icons.length];

        const textSpan = document.createElement('span');
        textSpan.className = 'option-text';
        textSpan.textContent = String(value);

        element.appendChild(iconSpan);
        element.appendChild(textSpan);
    }

    function updateUI() {
        if (scoreStars) {
            scoreStars.textContent = userProgress.userScore.stars;
        }
        if (scoreCoins) {
            scoreCoins.textContent = userProgress.userScore.coins;
        }
        if (levelDisplay) {
            levelDisplay.textContent = gameState.currentTopic === 'review'
                ? 'Session de repaso'
                : `Niveau ${gameState.currentLevel}`;
        }
        updateBodyLevelClass();
        applyActiveCosmetics();
        renderShopItems();
        renderInventory();
    }

    function updateBodyLevelClass() {
        if (!document.body) { return; }
        const levelClassPrefix = 'body-level-';
        const currentLevelClasses = Array.from(document.body.classList).filter(cls => cls.startsWith(levelClassPrefix));
        currentLevelClasses.forEach(cls => document.body.classList.remove(cls));
        if (typeof gameState.currentLevel === 'number' && gameState.currentLevel > 0) {
            document.body.classList.add(`body-level-${Math.min(gameState.currentLevel, LEVELS_PER_TOPIC)}`);
        }
    }

    function applyActiveCosmetics() {
        const backgroundItem = findShopItem(userProgress.activeCosmetics.background);
        applyBackgroundTheme(backgroundItem);

        const badgeItem = findShopItem(userProgress.activeCosmetics.badge);
        applyBadgeTheme(badgeItem);

        renderFloatingDecor();
    }

    function applyBackgroundTheme(backgroundItem) {
        if (backgroundItem && backgroundItem.type === 'background') {
            const palette = backgroundItem.palette || {};
            const [start, end] = palette.background || [];
            const accent = palette.accent || userProfile.color;
            const textColor = palette.textLight || DEFAULT_INK_COLOR;

            if (gameState.lastAppliedTheme !== backgroundItem.id) {
                gameState.lastAppliedTheme = backgroundItem.id;
                gameState.lastDecorKey = null;
            }

            document.body.classList.add('has-custom-background');
            if (start && end) {
                document.body.style.setProperty('--custom-bg-start', start);
                document.body.style.setProperty('--custom-bg-end', end);
            }
            document.body.style.setProperty('--custom-bg-accent', accent);
            document.body.style.setProperty('--custom-text-color', textColor);
            document.documentElement.style.setProperty('--ink', textColor);
            setPrimaryTheme(accent);
        } else {
            if (gameState.lastAppliedTheme !== '') {
                gameState.lastDecorKey = null;
            }
            gameState.lastAppliedTheme = '';
            document.body.classList.remove('has-custom-background');
            document.body.style.removeProperty('--custom-bg-start');
            document.body.style.removeProperty('--custom-bg-end');
            document.body.style.removeProperty('--custom-bg-accent');
            document.body.style.removeProperty('--custom-text-color');
            document.documentElement.style.setProperty('--ink', DEFAULT_INK_COLOR);
            setPrimaryTheme(userProfile.color);
        }
    }

    function applyBadgeTheme(badgeItem) {
        userProgress.activeBadgeEmoji = badgeItem?.emoji || null;
        renderUserIdentity();
    }

    function ensureDecorContainer() {
        if (gameState.decorContainer && gameState.decorContainer.isConnected) {
            return gameState.decorContainer;
        }
        gameState.decorContainer = document.getElementById('floatingDecor');
        if (!gameState.decorContainer) {
            if (!document.body) { return null; }
            gameState.decorContainer = document.createElement('div');
            gameState.decorContainer.id = 'floatingDecor';
            document.body?.appendChild(gameState.decorContainer);
        }
        return gameState.decorContainer;
    }

    function renderFloatingDecor() {
        const container = ensureDecorContainer();
        if (!container) { return; }
        const safeLevel = Number.isFinite(gameState.currentLevel) ? Math.min(Math.max(gameState.currentLevel, 1), 12) : 1;
        const icons = resolveDecorIcons(safeLevel);
        const decorKey = `${userProfile.avatar?.id || 'default'}-${safeLevel}-${icons.join('')}`;
        if (gameState.lastDecorKey === decorKey && container.childElementCount) {
            return;
        }
        gameState.lastDecorKey = decorKey;
        const totalIcons = Math.max(icons.length * 3, 15);
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < totalIcons; i++) {
            const iconEl = document.createElement('span');
            iconEl.className = 'floating-decor__icon';
            iconEl.textContent = icons[i % icons.length];
            iconEl.style.left = `${Math.random() * 100}%`;
            iconEl.style.setProperty('--delay', `${Math.random() * 6}s`);
            iconEl.style.setProperty('--duration', `${10 + Math.random() * 8}s`);
            iconEl.style.opacity = `${0.25 + Math.random() * 0.35}`;
            iconEl.style.fontSize = `${1.3 + Math.random() * 1.4}rem`;
            fragment.appendChild(iconEl);
        }

        container.appendChild(fragment);
    }

    function resolveDecorIcons(level) {
        const avatarIcons = getDecorIconsForAvatar(userProfile.avatar?.id);
        if (avatarIcons.length >= 3) {
            return avatarIcons;
        }
        const baseIcons = levelDecorIcons[level] || levelDecorIcons.default;
        return [...new Set([...avatarIcons, ...baseIcons])];
    }

    function getDecorIconsForAvatar(avatarId) {
        if (!avatarId) { return []; }
        const avatar = AVATAR_LIBRARY[avatarId];
        if (!avatar?.backgrounds) { return []; }
        const motifs = avatar.backgrounds
            .map(bg => bg.motif)
            .filter(Boolean);
        if (!motifs.length) {
            return [];
        }
        return [...new Set([...motifs, '✨', '🌟'])];
    }

    function getAvatarMetaLocal(avatarId) {
        if (!avatarId) { return null; }
        return AVATAR_LIBRARY[avatarId] || null;
    }

    function resolveSkillTag(topicId) {
        return TOPIC_SKILL_TAGS[topicId] || `general:${topicId || 'exploration'}`;
    }

    function createHistoryTracker(userName) {
        const STORAGE_KEY = `mathsLenaHistory_${userName}`;
        const history = loadHistory();
        let currentSession = null;
        let currentGame = null;

        function loadHistory() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) {
                    return defaultHistory();
                }
                const parsed = JSON.parse(raw);
                return {
                    ...defaultHistory(),
                    ...parsed,
                    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
                    skills: parsed.skills && typeof parsed.skills === 'object' ? parsed.skills : {}
                };
            } catch (error) {
                console.warn('Historique invalide, réinitialisation.', error);
                return defaultHistory();
            }
        }

        function defaultHistory() {
            return {
                appOpens: 0,
                totalPracticeSeconds: 0,
                lastOpenISO: null,
                sessions: [],
                skills: {}
            };
        }

        function persist() {
            const historyCopy = { ...history, sessions: history.sessions.map(normalizeSessionForSave) };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(historyCopy));
        }

        function normalizeSessionForSave(session) {
            const clone = { ...session };
            if (clone.startMs) { delete clone.startMs; }
            if (clone.games) {
                clone.games = clone.games.map(game => {
                    const gameClone = { ...game };
                    if (gameClone.startMs) { delete gameClone.startMs; }
                    return gameClone;
                });
            }
            return clone;
        }

        function ensureSkill(skillTag) {
            if (!history.skills[skillTag]) {
                history.skills[skillTag] = {
                    attempts: 0,
                    errors: 0,
                    weight: 0,
                    totalTimeMs: 0,
                    history: [],
                    lastPracticedISO: null,
                    lastMistakeISO: null
                };
            }
            return history.skills[skillTag];
        }

        function trackAppOpen() {
            const now = new Date();
            history.appOpens += 1;
            history.lastOpenISO = now.toISOString();
            currentSession = {
                start: now.toISOString(),
                startMs: now.getTime(),
                games: []
            };
            history.sessions.push(currentSession);
            if (history.sessions.length > 25) {
                history.sessions.shift();
            }
            persist();
        }

        function trackAppClose() {
            if (currentGame) {
                endGame({ status: 'interrompu' });
            }
            if (!currentSession) { return; }
            const now = new Date();
            const durationSeconds = Math.max(0, Math.round((now.getTime() - currentSession.startMs) / 1000));
            currentSession.end = now.toISOString();
            currentSession.durationSeconds = durationSeconds;
            history.totalPracticeSeconds += durationSeconds;
            delete currentSession.startMs;
            currentSession = null;
            if (gameState.pauseReminderTimeout) {
                clearTimeout(gameState.pauseReminderTimeout);
                gameState.pauseReminderTimeout = null;
            }
            persist();
        }

        function startGame(gameId, level, meta = {}) {
            if (!gameId) { return; }
            if (!currentSession) {
                trackAppOpen();
            }
            if (currentGame) {
                endGame({ status: 'interrompu' });
            }
            const now = new Date();
            currentGame = {
                id: gameId,
                level,
                startedAt: now.toISOString(),
                startMs: now.getTime(),
                events: [],
                meta: meta || {}
            };
            currentSession.games.push(currentGame);
            persist();
        }

        function endGame(result = {}) {
            if (!currentGame) { return; }
            const now = new Date();
            currentGame.endedAt = now.toISOString();
            currentGame.durationSeconds = Math.max(0, Math.round((now.getTime() - currentGame.startMs) / 1000));
            currentGame.result = result;
            delete currentGame.startMs;
            currentGame = null;
            persist();
        }

        function recordQuestion(skillTag, { correct = false, timeMs = 0 } = {}) {
            if (!skillTag) { return; }
            const duration = Math.max(0, Math.round(timeMs));
            const nowISO = new Date().toISOString();
            const skill = ensureSkill(skillTag);
            skill.attempts += 1;
            skill.totalTimeMs += duration;
            skill.lastPracticedISO = nowISO;
            if (!correct) {
                skill.errors += 1;
                skill.lastMistakeISO = nowISO;
            }
            const baseWeight = correct ? -1 : 4;
            const timeWeight = duration > 12000 ? 2 : duration > 8000 ? 1 : 0;
            skill.weight = Math.max(0, (skill.weight || 0) + baseWeight + (!correct ? timeWeight : 0));
            if (correct && duration > 12000) {
                skill.weight = Math.max(0, skill.weight + 1);
            }
            skill.history.push({ correct: !!correct, timeMs: duration, at: nowISO });
            if (skill.history.length > 100) {
                skill.history.shift();
            }

            if (currentGame) {
                currentGame.events.push({
                    type: 'QUESTION',
                    skillTag,
                    correct: !!correct,
                    timeMs: duration,
                    at: nowISO
                });
            }
            schedulePauseReminder();
            persist();
        }

        return {
            trackAppOpen,
            trackAppClose,
            startGame,
            endGame,
            recordQuestion,
            applyReviewSuccess(skillTags = []) {
                (skillTags || []).forEach(tag => {
                    const skill = ensureSkill(tag);
                    skill.weight = Math.max(0, (skill.weight || 0) - 3);
                });
                persist();
            },
            getSkillStats: () => history.skills,
            getHistory: () => history
        };
    }

    function getDifficultSkills(limit = 3) {
        if (!gameState.historyTracker) { return []; }
        const stats = gameState.historyTracker.getSkillStats() || {};
        return Object.entries(stats)
            .map(([tag, data]) => ({ tag, weight: data.weight || 0, attempts: data.attempts || 0, lastMistakeISO: data.lastMistakeISO }))
            .filter(item => item.attempts >= 2 && item.weight >= 4)
            .sort((a, b) => (b.weight - a.weight) || ((b.lastMistakeISO || '').localeCompare(a.lastMistakeISO || '')))
            .slice(0, limit)
            .map(item => item.tag);
    }

    function computeReviewLevel(skillStat) {
        const weight = skillStat?.weight || 0;
        return Math.min(5, Math.max(1, Math.round(weight / 2) + 1));
    }

    const REVIEW_GENERATORS = {
        'math:addition': skill => generateMathQuestion('additions', computeReviewLevel(skill)),
        'math:subtraction': skill => generateMathQuestion('soustractions', computeReviewLevel(skill)),
        'math:multiplication': skill => generateMathQuestion('multiplications', computeReviewLevel(skill)),
        'math:division': skill => generateMathQuestion('divisions', computeReviewLevel(skill)),
        'math:numberBond': skill => createNumberBondReviewQuestion(computeReviewLevel(skill)),
        'cognition:colors': skill => generateColorQuestion(Math.min(6, computeReviewLevel(skill))),
        'language:vowel': () => createVowelReviewQuestion(),
        'logic:sequence': () => createSequenceReviewQuestion(),
        'language:riddle': () => createRiddleReviewQuestion(),
        'reading:comprehension': () => createStoryReviewQuestion()
    };

    function buildReviewQuestions(skillTags, desiredCount = 6) {
        const stats = gameState.historyTracker?.getSkillStats() || {};
        const supportedTags = (skillTags || []).filter(tag => REVIEW_GENERATORS[tag]);
        if (!supportedTags.length) { return []; }
        const questions = [];
        let index = 0;
        const maxIterations = desiredCount * 4;
        while (questions.length < desiredCount && index < maxIterations) {
            const tag = supportedTags[index % supportedTags.length];
            const generator = REVIEW_GENERATORS[tag];
            const question = generator(stats[tag]);
            if (question) {
                const enriched = {
                    ...question,
                    difficulty: 1,
                    metaSkill: tag,
                    reward: question.reward || { stars: 12, coins: 8 }
                };
                if (typeof enriched.explanation !== 'string' && enriched.options && typeof enriched.correct === 'number') {
                    enriched.explanation = `La bonne réponse est <strong>${enriched.options[enriched.correct]}</strong>.`;
                }
                questions.push(enriched);
            }
            index += 1;
        }
        return questions;
    }

    function createNumberBondReviewQuestion(level) {
        const roof = Math.max(10, level * 8 + 10);
        const first = Math.floor(Math.random() * (roof - 4)) + 2;
        const answer = roof - first;
        const choicePool = new Set([answer, Math.max(0, answer - 1), answer + 1, answer + 2]);
        const options = shuffle(Array.from(choicePool)).slice(0, 3);
        if (!options.includes(answer)) {
            options[0] = answer;
        }
        return {
            questionText: `Complète : <strong>${first} + ? = ${roof}</strong>`,
            options,
            correct: options.indexOf(answer),
            explanation: `Parce que ${first} + ${answer} = ${roof}.`
        };
    }

    function createVowelReviewQuestion() {
        const sample = vowelLevels[Math.floor(Math.random() * vowelLevels.length)];
        if (!sample) { return null; }
        const pool = new Set(sample.options);
        pool.add(sample.answer);
        const options = shuffle(Array.from(pool)).slice(0, 3);
        if (!options.includes(sample.answer)) {
            options[0] = sample.answer;
        }
        const correctIndex = options.indexOf(sample.answer);
        const explanation = `On écrit <strong>${sample.masked.replace(/_/g, sample.answer)}</strong>.`;
        return {
            questionText: `Quelle syllabe complète : <strong>${sample.masked}</strong> ?`,
            options,
            correct: correctIndex >= 0 ? correctIndex : 0,
            explanation
        };
    }

    function createSequenceReviewQuestion() {
        const sample = sequenceLevels[Math.floor(Math.random() * sequenceLevels.length)];
        if (!sample) { return null; }
        const text = sample.sequence.join(' ');
        return {
            questionText: `Quel est le prochain élément de la suite : <strong>${text}</strong> ?`,
            options: sample.options,
            correct: sample.options.indexOf(sample.answer),
            explanation: `La logique de la suite mène à <strong>${sample.answer}</strong>.`
        };
    }

    function createRiddleReviewQuestion() {
        const sample = riddleLevels[Math.floor(Math.random() * riddleLevels.length)];
        if (!sample) { return null; }
        return {
            questionText: sample.prompt,
            options: sample.options,
            correct: sample.answer,
            explanation: `La bonne réponse est <strong>${sample.options[sample.answer]}</strong>.`
        };
    }

    function createStoryReviewQuestion() {
        const story = magicStories[Math.floor(Math.random() * magicStories.length)];
        if (!story) { return null; }
        const quiz = story.quiz[Math.floor(Math.random() * story.quiz.length)];
        if (!quiz) { return null; }
        return {
            questionText: `${story.title} — ${quiz.question}`,
            options: quiz.options,
            correct: quiz.correct,
            explanation: `Souviens-toi de l'histoire : ${quiz.options[quiz.correct]}.`
        };
    }

    function maybeSuggestReview(container) {
        if (!container || !gameState.historyTracker) { return; }
        const difficultSkills = getDifficultSkills(3);
        if (!difficultSkills.length) { return; }

        const reviewQuestions = buildReviewQuestions(difficultSkills, Math.min(8, difficultSkills.length * 2));
        if (!reviewQuestions.length) { return; }

        const banner = document.createElement('div');
        banner.className = 'review-banner';

        const title = document.createElement('strong');
        title.textContent = '✨ Session de repaso disponible';
        banner.appendChild(title);

        const detail = document.createElement('p');
        detail.textContent = 'Un petit entraînement ciblé t\'aidera à progresser encore plus vite !';
        banner.appendChild(detail);

        const action = document.createElement('button');
        action.type = 'button';
        action.className = 'review-banner__btn';
        action.textContent = 'Lancer le repaso';
        action.addEventListener('click', () => startReviewSession(difficultSkills));
        banner.appendChild(action);

        container.appendChild(banner);
    }

    function startReviewSession(skillTags) {
        const questions = buildReviewQuestions(skillTags, Math.min(8, Math.max(5, skillTags.length * 2)));
        if (!questions.length) {
            showErrorMessage('Pas encore de questions de repaso disponibles.', '');
            return;
        }
        gameState.activeReviewSkills = [...skillTags];
        allQuestions.review = questions;
        gameState.currentTopic = 'review';
        gameState.currentLevel = 1;
        gameState.currentQuestionIndex = 0;
        gameState.historyTracker?.startGame('review', 1, { skillTags });
        loadQuestion(0);
    }

    function schedulePauseReminder() {
        if (gameState.pauseReminderTimeout) {
            clearTimeout(gameState.pauseReminderTimeout);
        }
        gameState.pauseReminderTimeout = window.setTimeout(() => {
            gameState.pauseReminderTimeout = null;
            showPauseReminder();
        }, PAUSE_REMINDER_DELAY);
    }

    function showPauseReminder() {
        if (!document.body || document.getElementById('pauseReminder')) { return; }
        const banner = document.createElement('div');
        banner.id = 'pauseReminder';
        banner.className = 'pause-banner';

        const title = document.createElement('strong');
        title.textContent = '✨ Pause magique ✨';
        banner.appendChild(title);

        const message = document.createElement('p');
        message.textContent = 'Respire, étire-toi et bois un peu d’eau avant de continuer.';
        banner.appendChild(message);

        const actions = document.createElement('div');
        actions.className = 'pause-banner__actions';

        const dismissBtn = document.createElement('button');
        dismissBtn.type = 'button';
        dismissBtn.className = 'pause-banner__btn';
        dismissBtn.textContent = 'Je fais une pause !';
        dismissBtn.addEventListener('click', () => {
            banner.remove();
            schedulePauseReminder();
        });

        const laterBtn = document.createElement('button');
        laterBtn.type = 'button';
        laterBtn.className = 'pause-banner__link';
        laterBtn.textContent = 'Plus tard';
        laterBtn.addEventListener('click', () => {
            banner.remove();
            schedulePauseReminder();
        });

        actions.appendChild(dismissBtn);
        actions.appendChild(laterBtn);
        banner.appendChild(actions);

        document.body.appendChild(banner);
        speakText('Pausa magique. Prends un petit moment pour te reposer.');
    }

    function openShop() {
        if (!shopModal) { return; }
        shopModal.classList.add('is-open');
        shopModal.setAttribute('aria-hidden', 'false');
        renderShopItems();
        renderInventory();
    }

    function closeShop() {
        if (!shopModal) { return; }
        shopModal.classList.remove('is-open');
        shopModal.setAttribute('aria-hidden', 'true');
    }

    function renderShopItems() {
        if (!shopList) { return; }
        shopList.innerHTML = '';

        const items = getShopItemsForAvatar(userProfile.avatar?.id);
        if (!items.length) {
            const empty = document.createElement('li');
            empty.className = 'shop-inventory__empty';
            empty.textContent = 'Aucune récompense disponible pour cet avatar pour le moment.';
            shopList.appendChild(empty);
            return;
        }

        items.forEach(resolvedItem => {
            if (!resolvedItem) { return; }

            const listItem = document.createElement('li');
            listItem.className = 'shop-item';
            listItem.dataset.type = resolvedItem.type;

            const artworkSrc = resolvedItem.iconUrl || resolvedItem.previewUrl;
            if (artworkSrc) {
                const artwork = document.createElement('img');
                artwork.className = 'shop-item__artwork';
                artwork.src = artworkSrc;
                artwork.alt = resolvedItem.name;
                artwork.loading = 'lazy';
                listItem.appendChild(artwork);
            } else if (resolvedItem.motif) {
                const motif = document.createElement('span');
                motif.className = 'shop-item__emoji';
                motif.textContent = resolvedItem.motif;
                motif.setAttribute('aria-hidden', 'true');
                listItem.appendChild(motif);
            }

            const name = document.createElement('span');
            name.className = 'shop-item__name';
            name.textContent = resolvedItem.name;
            listItem.appendChild(name);

            const price = document.createElement('span');
            price.className = 'shop-item__price';
            price.setAttribute('aria-label', `${resolvedItem.priceCoins} pièces`);
            price.textContent = `${resolvedItem.priceCoins}`;
            const priceIcon = document.createElement('span');
            priceIcon.className = 'shop-item__price-icon';
            priceIcon.textContent = '💰';
            priceIcon.setAttribute('aria-hidden', 'true');
            price.appendChild(priceIcon);
            listItem.appendChild(price);

            const action = document.createElement('button');
            action.type = 'button';
            action.className = 'shop-item__action';

            const isOwned = userProgress.ownedItems.includes(resolvedItem.id);
            const isActive = userProgress.activeCosmetics[resolvedItem.type] === resolvedItem.id;

            if (!isOwned) {
                const canAfford = userProgress.userScore.coins >= resolvedItem.priceCoins;
                action.textContent = canAfford ? 'Acheter' : 'Pièces insuffisantes';
                action.setAttribute('aria-label', canAfford
                    ? `Acheter ${resolvedItem.name} pour ${resolvedItem.priceCoins} pièces`
                    : `${resolvedItem.name} coûte ${resolvedItem.priceCoins} pièces`);
                if (!canAfford) {
                    action.disabled = true;
                    action.classList.add('is-disabled');
                    action.title = 'Gagne plus de pièces pour acheter cette récompense.';
                } else {
                    action.addEventListener('click', () => purchaseItem(resolvedItem.id));
                }
            } else {
                action.textContent = isActive ? 'Équipé' : 'Utiliser';
                action.disabled = isActive;
                action.setAttribute('aria-label', isActive
                    ? `${resolvedItem.name} est déjà équipé`
                    : `Activer ${resolvedItem.name}`);
                if (!isActive) {
                    action.addEventListener('click', () => activateItem(resolvedItem.id));
                }
            }

            listItem.appendChild(action);
            shopList.appendChild(listItem);
        });
    }

    function renderInventory() {
        if (!inventoryList) { return; }
        inventoryList.innerHTML = '';

        if (!userProgress.ownedItems.length) {
            const empty = document.createElement('li');
            empty.className = 'shop-inventory__empty';
            empty.textContent = 'Pas encore de récompense… Continue à jouer ✨';
            inventoryList.appendChild(empty);
            return;
        }
    
        userProgress.ownedItems.forEach(itemId => {
            const item = findShopItem(itemId);
            if (!item) { return; }
            const listItem = document.createElement('li');
            listItem.className = 'shop-inventory__item';
            listItem.dataset.type = item.type;

            const preview = document.createElement('img');
            preview.className = 'shop-inventory__preview';
            preview.src = item.iconUrl || item.previewUrl;
            preview.alt = item.name;
            preview.loading = 'lazy';
            listItem.appendChild(preview);

            const meta = document.createElement('div');
            meta.className = 'shop-inventory__meta';

            const label = document.createElement('span');
            label.className = 'shop-inventory__label';
            label.textContent = item.name;
            meta.appendChild(label);

            if (item.type === 'background' && item.ownerAvatarId) {
                const avatarMeta = getAvatarMetaLocal(item.ownerAvatarId);
                const tag = document.createElement('span');
                tag.className = 'shop-inventory__tag';
                tag.textContent = avatarMeta ? avatarMeta.name : 'Fond spécial';
                meta.appendChild(tag);
            }

            listItem.appendChild(meta);

            const action = document.createElement('button');
            action.type = 'button';
            action.className = 'shop-inventory__action';

            const isActive = userProgress.activeCosmetics[item.type] === item.id;
            const incompatibleBackground = item.type === 'background' && item.ownerAvatarId && item.ownerAvatarId !== userProfile.avatar?.id;

            if (isActive) {
                action.textContent = 'Actif';
                action.disabled = true;
            } else if (incompatibleBackground) {
                action.textContent = 'Avatar requis';
                action.disabled = true;
                action.title = 'Change d\'avatar pour utiliser ce fond.';
                listItem.classList.add('is-locked');
            } else {
                action.textContent = 'Activer';
                action.addEventListener('click', () => activateItem(item.id));
            }

            listItem.appendChild(action);

            const sellBtn = document.createElement('button');
            sellBtn.type = 'button';
            sellBtn.className = 'shop-inventory__action sell-btn';
            sellBtn.textContent = 'Vendre';
            sellBtn.addEventListener('click', () => sellItem(item.id));
            listItem.appendChild(sellBtn);

            inventoryList.appendChild(listItem);
        });
    }

    function triggerShopCelebration(item) {
        if (!shopModal) { return; }
        const dialog = shopModal.querySelector('.shop-modal__dialog');
        if (!dialog) { return; }
        playSound('coins');
        shopModal.classList.add('shop-modal--celebrate');

        const sparkleCount = 12;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('span');
            sparkle.className = 'shop-coin-sparkle';
            sparkle.style.left = `${10 + Math.random() * 80}%`;
            sparkle.style.top = `${40 + Math.random() * 20}%`;
            dialog.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        }

        setTimeout(() => shopModal.classList.remove('shop-modal--celebrate'), 600);
    }

    function purchaseItem(itemId) {
        const item = getBoutiqueItem(itemId);
        if (!item) { return; }
        if (userProgress.ownedItems.includes(item.id)) {
            showSuccessMessage('Tu possèdes déjà cette récompense.');
            return;
        }
        if (userProgress.userScore.coins < item.priceCoins) {
            showErrorMessage('Pas assez de pièces pour cette récompense 💰.', item.priceCoins);
            return;
        }
    
        userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - item.priceCoins);
        userProgress.ownedItems.push(item.id);
        activateItem(item.id, { silent: true });
        showSuccessMessage('Nouvelle récompense débloquée ✨');
        triggerShopCelebration(item);
        updateUI();
        saveProgress();
        renderShopItems();
        renderInventory();
    }

    function activateItem(itemId, { silent = false } = {}) {
        const item = findShopItem(itemId);
        if (!item) { return; }
        if (item.type === 'background' && item.ownerAvatarId && item.ownerAvatarId !== userProfile.avatar?.id) {
            showErrorMessage('Ce fond appartient à un autre avatar.', '');
            return;
        }
        if (!userProgress.ownedItems.includes(item.id)) {
            userProgress.ownedItems.push(item.id);
        }
        userProgress.activeCosmetics[item.type] = item.id;
        applyActiveCosmetics();
        saveProgress();
        renderShopItems();
        renderInventory();
        if (!silent) {
            showSuccessMessage('Récompense activée ✨');
        }
    }

    function sellItem(itemId) {
        const item = findShopItem(itemId);
        if (!item) { return; }

        const sellPrice = Math.round(item.priceCoins * 0.5);
        userProgress.userScore.coins += sellPrice;

        userProgress.ownedItems = userProgress.ownedItems.filter(id => id !== itemId);

        const newPrice = Math.round(item.priceCoins * 1.4);
        const updatedItem = { ...item, priceCoins: newPrice };
        SHOP_CATALOG.set(itemId, updatedItem);

        if (userProgress.activeCosmetics[item.type] === item.id) {
            userProgress.activeCosmetics[item.type] = null;
        }

        showSuccessMessage(`Tu as vendu ${item.name} pour ${sellPrice} pièces.`);
        updateUI();
        saveProgress();
        renderShopItems();
        renderInventory();
    }

    function showSuccessMessage(message = positiveMessages[Math.floor(Math.random() * positiveMessages.length)]) {
        const promptEl = document.createElement('div');
        promptEl.className = 'prompt ok fx-pop';
        promptEl.textContent = message;
        content.appendChild(promptEl);
        // speakText(message); // Comentado para evitar sobrecarga de audio
        playSound('correct');
        setTimeout(() => promptEl.remove(), 1000);
    }

    function showErrorMessage(message, correctValue) {
        const promptEl = document.createElement('div');
        promptEl.className = 'prompt bad fx-shake';
        const extra = (typeof correctValue !== 'undefined' && correctValue !== null && String(correctValue).trim() !== '')
            ? ` La bonne réponse était : ${correctValue}.`
            : '';
        promptEl.textContent = `${message}${extra}`;
        content.appendChild(promptEl);
        speakText(message);
        playBufferedSound('wrong');
        setTimeout(() => promptEl.remove(), 2500);
    }

    function showConfetti() {
        if (typeof confetti !== 'function') return;
        try {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch(e) { console.warn("Confetti effect failed", e); }
    }

    function showFireworks() {
        if (typeof confetti !== 'function') return;
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1001 };

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 } });
        }, 250);
        setTimeout(showConfetti, 500); // Add a small burst of regular confetti
    }

    function ensureSkyElements() {
        if (document.getElementById('sky-elements')) {
            return;
        }
        const sky = document.createElement('div');
        sky.id = 'sky-elements';
        sky.className = 'sky-elements';
        sky.innerHTML = `
            <div class="shooting-star"></div>
            <div class="shooting-star"></div>
            <div class="shooting-star"></div>`;
        document.body.appendChild(sky);
    }

    function showMemoryGameMenu() {
      clearProgressTracker();
      content.innerHTML = '';

      const title = document.createElement('div');
      title.className = 'question-prompt fx-bounce-in-down';
      title.textContent = 'Choisis un niveau de mémoire';
      content.appendChild(title);

      const levelsGrid = document.createElement('div');
      levelsGrid.className = 'options-grid';
      MEMORY_GAME_LEVELS.forEach(levelConfig => {
        const btn = document.createElement('button');
        btn.className = 'topic-btn fx-bounce-in-down';
        btn.innerHTML = `Niveau ${levelConfig.level}<br>${levelConfig.pairs} paires`;
        btn.style.animationDelay = `${Math.random() * 0.5}s`;
        btn.addEventListener('click', () => showMemoryGame(levelConfig));
        levelsGrid.appendChild(btn);
      });
      content.appendChild(levelsGrid);

      btnLogros.style.display = 'inline-block';
      btnLogout.style.display = 'inline-block';
      configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    function showMemoryGame(levelConfig) {
        document.body.classList.add('stage-controls-visible');
        const { pairs: pairsCount, timeLimit, traps: trapCount } = levelConfig;
        let timerId = null;
        let timeLeft = timeLimit;
        content.innerHTML = '';
        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = 'Trouve toutes les paires !';
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: 'Trouve toutes les paires !',
            ariaLabel: 'Écouter les instructions du jeu de mémoire'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        content.appendChild(promptWrapper);
        speakText('Trouve toutes les paires !');
        updateProgressTracker(0, pairsCount);

        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'memory-timer';
        if (timeLimit) {
            content.appendChild(timerDisplay);
        }

        const memoryGrid = document.createElement('div');
        memoryGrid.className = 'memory-grid';
        if (levelConfig.grid) {
          const gridParts = levelConfig.grid.split('x').map(Number);
          const columns = gridParts.length > 1 && !Number.isNaN(gridParts[1]) ? gridParts[1] : Math.sqrt(pairsCount * 2);
          memoryGrid.style.gridTemplateColumns = `repeat(${Math.round(columns)}, 1fr)`;
        }
        content.appendChild(memoryGrid);

        const cardEmojis = Object.values(emoji).slice(6, 6 + pairsCount);
        const trapEmojis = ['💣', '💥', '🔥', '⚡️', '👻', '💀'].slice(0, trapCount);
        const gameCardsData = shuffle([
            ...cardEmojis.map(e => ({ emoji: e, type: 'pair' })),
            ...cardEmojis.map(e => ({ emoji: e, type: 'pair' })),
            ...trapEmojis.map(e => ({ emoji: e, type: 'trap' }))
        ]);

        let flippedCards = [];
        let matchedPairs = 0;
        let lockBoard = false;

        gameCardsData.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card fx-bounce-in-down';
            card.style.animationDelay = `${index * 0.05}s`;
            card.innerHTML = `<span style="opacity:0;">${cardData.emoji}</span>`;
            card.addEventListener('click', () => flipCard(card, cardData, index)); // Corrected to use cardData from the loop
            memoryGrid.appendChild(card);
        });

        if (timeLimit) {
            timerId = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    memoryGrid.classList.add('disabled');
                    showErrorMessage('Temps écoulé ! Essaie encore.', '');
                    setTimeout(() => showLevelMenu('memory'), 2000);
                }
            }, 1000);
        }

        function cleanupGame() {
            if (timerId) {
                clearInterval(timerId);
            }
        }

        function flipCard(card, cardData, index) {
            if (lockBoard) return;
            if (card.classList.contains('flipped')) return;

            card.classList.add('flipped');
            card.querySelector('span').style.opacity = '1';

            if (cardData.type === 'trap') {
                lockBoard = true;
                card.classList.add('matched', 'wrong');
                playBufferedSound('wrong');
                showErrorMessage('Oh non, une carte piège !', '');
                // userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 10); // Penalización desactivada
                if (timeLimit) timeLeft = Math.max(0, timeLeft - 5);
                updateUI();
                setTimeout(() => { lockBoard = false; }, 800);
                return;
            }

            flippedCards.push({ card, emoji: cardData.emoji, index });

            if (flippedCards.length === 2) {
                lockBoard = true;
                const [card1, card2] = flippedCards;
                if (card1.emoji === card2.emoji) {
                    card1.card.classList.add('matched');
                    card2.card.classList.add('matched');
                    matchedPairs++;
                    updateProgressTracker(matchedPairs, pairsCount);
                    userProgress.userScore.stars += 20;
                    userProgress.userScore.coins += 10;
                    playBufferedSound('correct');
                    updateUI(); // Llamada a updateUI()
                    saveProgress();
                    flippedCards = [];
                    lockBoard = false;
                    if (matchedPairs === pairsCount) {
                        cleanupGame();
                        clearProgressTracker();
                        userProgress.answeredQuestions[`memory-${gameState.currentLevel}`] = 'completed';
                        saveProgress();
                        showSuccessMessage('🦄 Toutes les paires trouvées !');
                        showFireworks();
                        setTimeout(() => showLevelMenu('memory'), 2000);
                    }
                } else {
                    setTimeout(() => {
                        card1.card.classList.remove('flipped');
                        card2.card.classList.remove('flipped');
                        card1.card.querySelector('span').style.opacity = '0';
                        card2.card.querySelector('span').style.opacity = '0';
                        flippedCards = [];
                        lockBoard = false;
                        // userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5); // Penalización desactivada
                        playBufferedSound('wrong');
                        updateUI(); // Llamada a updateUI()
                        saveProgress();
                        showErrorMessage('Mauvaise réponse.', `Il fallait trouver une paire de ${card1.emoji}`);
                    }, 1000);
                }
            }
        }
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux de mémoire', () => {
            cleanupGame();
            showMemoryGameMenu();
        });
    }
    
    /**
     * Muestra el juego de ordenar.
     * @param {number} level El nivel de dificultad.
     */
    function showSortingGame(level) {
        document.body.classList.add('stage-controls-visible');
        gameState.currentLevel = level;
        content.innerHTML = '';
        updateUI();

        const levelData = sortingLevels.find(entry => entry.level === level) || sortingLevels[sortingLevels.length - 1];
        const reward = { stars: 12 + level * 2, coins: 8 + Math.max(0, level - 1) * 2 };

        const container = document.createElement('div');
        container.className = 'sorting-container fx-bounce-in-down';

        const instructionWrapper = document.createElement('div');
        instructionWrapper.className = 'prompt-with-audio';

        const instruction = document.createElement('p');
        instruction.className = 'question-prompt';
        instruction.textContent = level === 1
            ? `${levelData.instruction} Glisse-les et lâche-les dans le bon panier.`
            : levelData.instruction;
        instructionWrapper.appendChild(instruction);

        const audioBtn = createAudioButton({
            text: instruction.textContent,
            ariaLabel: 'Écouter les instructions de tri'
        });
        if (audioBtn) {
            instructionWrapper.appendChild(audioBtn);
        }

        container.appendChild(instructionWrapper);
        speakText(instruction.textContent);

        const zonesWrapper = document.createElement('div');
        zonesWrapper.className = 'sorting-zones';

        const feedbackBubble = document.createElement('div');
        feedbackBubble.className = 'sorting-feedback is-hidden';
        feedbackBubble.setAttribute('role', 'status');
        feedbackBubble.setAttribute('aria-live', 'polite');

        const pool = document.createElement('div');
        pool.className = 'sorting-pool';
        pool.dataset.zone = 'pool';

        const dropzones = [];
        levelData.categories.forEach(category => {
            const bin = document.createElement('div');
            bin.className = 'sorting-bin';

            const header = document.createElement('div');
            header.className = 'sorting-bin-header';
            header.textContent = category.label;
            bin.appendChild(header);

            const dropzone = document.createElement('div');
            dropzone.className = 'sorting-dropzone';
            dropzone.dataset.category = category.id;
            bin.appendChild(dropzone);
            zonesWrapper.appendChild(bin);
            dropzones.push(dropzone);
        });

        container.appendChild(zonesWrapper);
        container.appendChild(feedbackBubble);

        const tokens = [];
        const uniqueSuffix = Date.now();
        levelData.items.forEach((item, index) => {
            const token = document.createElement('div');
            token.className = 'sorting-token fx-pop';
            token.textContent = `${item.emoji} ${item.label}`;
            token.draggable = true;
            token.dataset.target = item.target;
            token.dataset.id = `${item.id}-${uniqueSuffix}-${index}`;
            enableSortingToken(token);
            pool.appendChild(token);
            tokens.push(token);
        });

        updateProgressTracker(0, tokens.length);

        container.appendChild(pool);
        content.appendChild(container);

        const allZones = [pool, ...dropzones];
        allZones.forEach(zone => enableSortingDropzone(zone));

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu('sorting'));

        function enableSortingToken(token) {
            token.addEventListener('dragstart', () => {
                token.classList.add('is-dragging');
            });
            token.addEventListener('dragend', () => {
                token.classList.remove('is-dragging');
            });
        }

        function enableSortingDropzone(zone) {
            zone.addEventListener('dragenter', event => {
                event.preventDefault();
                zone.classList.add('is-target');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('is-target');
            });
            zone.addEventListener('dragover', event => {
                event.preventDefault();
            });
            zone.addEventListener('drop', event => {
                event.preventDefault();
                zone.classList.remove('is-target');
                const tokenId = event.dataTransfer ? event.dataTransfer.getData('text/plain') : undefined;
                let token;
                if (tokenId) {
                    token = document.querySelector(`[data-id="${tokenId}"]`);
                }
                if (!token) {
                    token = document.querySelector('.sorting-token.is-dragging');
                }
                if (!token) { return; }

                if (zone.dataset.zone === 'pool') {
                    pool.appendChild(token);
                    token.classList.remove('is-correct');
                    updateCompletionState();
                    return;
                }

                const expected = zone.dataset.category;
                const actual = token.dataset.target;
                if (expected === actual) {
                    zone.appendChild(token);
                    token.classList.add('is-correct', 'sorting-token-pop');
                    playBufferedSound('correct');
                    showSortingFeedback('positive', 'Bravo !');
                    setTimeout(() => token.classList.remove('sorting-token-pop'), 320);
                    updateCompletionState();
                } else {
                    zone.classList.add('sorting-bin-error');
                    playBufferedSound('wrong');
                    showSortingFeedback('negative', "Oups, essaie une autre catégorie.");
                    setTimeout(() => {
                        zone.classList.remove('sorting-bin-error');
                        pool.appendChild(token);
                        token.classList.remove('is-correct');
                        updateCompletionState();
                    }, 420);
                }
            });
        }

        function showSortingFeedback(type, message) {
            clearTimeout(feedbackBubble._timerId);
            feedbackBubble.textContent = message;
            feedbackBubble.classList.remove('is-hidden', 'is-positive', 'is-negative');
            feedbackBubble.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
            feedbackBubble._timerId = setTimeout(() => hideSortingFeedback(), 1800);
        }

        function hideSortingFeedback() {
            feedbackBubble.textContent = '';
            feedbackBubble.classList.add('is-hidden');
            feedbackBubble.classList.remove('is-positive', 'is-negative');
        }

        function updateCompletionState() {
            const correctCount = tokens.filter(token => token.parentElement && token.parentElement.dataset && token.parentElement.dataset.category === token.dataset.target).length;
            updateProgressTracker(correctCount, tokens.length);
            const allPlaced = correctCount === tokens.length;
            if (allPlaced && tokens.every(token => token.classList.contains('is-correct'))) {
                hideSortingFeedback();
                rewardPlayer();
            } else {
                markLevelInProgress();
            }
        }

        function markLevelInProgress() {
            userProgress.answeredQuestions[`sorting-${gameState.currentLevel}`] = 'in-progress';
            saveProgress();
        }

        function rewardPlayer() {
            showSuccessMessage('Classement parfait ! ✨');
            showFireworks();
            const reward = { stars: 10, coins: 5 }; // Default reward
            userProgress.userScore.stars += reward.stars;
            userProgress.userScore.coins += reward.coins;
            userProgress.answeredQuestions[`sorting-${gameState.currentLevel}`] = 'completed';
            saveProgress();
            updateUI();
            clearProgressTracker();
            setTimeout(() => {
                if (gameState.currentLevel < sortingLevels.length) {
                    showSortingGame(gameState.currentLevel + 1);
                } else {
                    showLevelMenu('sorting');
                }
            }, 1600);
        }

        // Préparer les données de transfert pour le glisser-déposer (nécessaire pour certains navigateurs)
        content.addEventListener('dragstart', event => {
            if (event.target && event.target.classList.contains('sorting-token')) {
                event.dataTransfer.setData('text/plain', event.target.dataset.id);
            }
        });
    }
    
    /**
     * Muestra el juego de adivinanzas.
     */
    function showRiddleGame() {
        document.body.classList.remove('stage-controls-visible');
        gameState.currentTopic = 'riddles';
        showLevelMenu(gameState.currentTopic);
    }
    
    function launchRiddleLevel(level) {
        gameState.currentTopic = 'riddles';
        document.body.classList.add('stage-controls-visible');
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        gameState.currentRiddleLevelIndex = Math.max(0, Math.min(riddleLevels.length, level) - 1);
        const levelData = riddleLevels[gameState.currentRiddleLevelIndex];
        gameState.currentLevel = levelData?.level || level;
        gameState.currentQuestionIndex = 0;
        userProgress.answeredQuestions[`riddles-${gameState.currentLevel}`] = 'in-progress';
        saveProgress();
        loadRiddleQuestion(0);
    }

    function loadRiddleQuestion(questionIndex = 0) { // This should use gameState.currentRiddleLevelIndex
        document.body.classList.add('stage-controls-visible');
        const levelData = riddleLevels[gameState.currentRiddleLevelIndex];
        if (!levelData) {
            showLevelMenu('riddles');
            return;
        }

        const questions = levelData.questions || [];
        if (questionIndex >= questions.length) {
            completeRiddleLevel(levelData);
            return;
        }

        gameState.currentQuestionIndex = questionIndex;
        const riddleData = questions[questionIndex];

        content.innerHTML = '';
        updateUI();

        const wrapper = document.createElement('div');
        wrapper.className = 'riddle-wrapper fx-bounce-in-down';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = `Niveau ${levelData.level} — ${levelData.theme}`;
        wrapper.appendChild(title);

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const promptText = document.createElement('p');
        promptText.className = 'riddle-prompt';
        promptText.textContent = riddleData.prompt;
        promptWrapper.appendChild(promptText);

        const audioBtn = createAudioButton({
            text: riddleData.prompt,
            ariaLabel: 'Écouter l\'énigme'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        wrapper.appendChild(promptWrapper);
        speakText(riddleData.prompt);
        updateProgressTracker(gameState.currentQuestionIndex + 1, questions.length);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';

        const shuffledOptions = shuffle([...riddleData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option riddle-option fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.08 + 0.4}s`;
            const originalIndex = riddleData.options.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleRiddleAnswer);
            applyOptionContent(optionEl, opt, i);
            optionsContainer.appendChild(optionEl);
        });

        wrapper.appendChild(optionsContainer);
        content.appendChild(wrapper);

        configureBackButton('Retour aux niveaux', () => showLevelMenu('riddles'));
    }

    function completeRiddleLevel(levelData) {
        userProgress.answeredQuestions[`riddles-${levelData.level}`] = 'completed';
        saveProgress();
        showSuccessMessage(levelData.completionMessage || 'Niveau terminé !');
        showFireworks();
        updateProgressTracker(levelData.questions.length, levelData.questions.length);
        setTimeout(() => {
            clearProgressTracker();
            showLevelMenu('riddles');
        }, 1600);
    }

    function handleRiddleAnswer(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleRiddleAnswer));

        const levelData = riddleLevels[gameState.currentRiddleLevelIndex];
        const questions = levelData.questions || [];
        const riddleData = questions[gameState.currentQuestionIndex];
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = riddleData.answer;
        const correctValue = riddleData.options[correctAnswerIndex];

        if (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex) {
            selectedOption.classList.add('correct');
            selectedOption.classList.add('riddle-correct-glow');
            userProgress.userScore.stars += riddleData.reward?.stars || (10 + levelData.level);
            userProgress.userScore.coins += riddleData.reward?.coins || (6 + Math.floor(levelData.level / 2));
            showSuccessMessage(riddleData.success || 'Bonne réponse !');
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            selectedOption.classList.add('riddle-wrong-glow');
            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
                correctOption.classList.add('riddle-correct-glow');
            }
            const hint = riddleData.hint ? ` Conseil : ${riddleData.hint}` : '';
            showErrorMessage('Mauvaise réponse.', `${correctValue}.${hint}`);
        }

        updateUI();
        saveProgress();

        setTimeout(() => {
            if (gameState.currentQuestionIndex + 1 < questions.length) {
                loadRiddleQuestion(gameState.currentQuestionIndex + 1);
            } else {
                completeRiddleLevel(levelData);
            }
        }, 1600);
    }
    
    // --- NOUVEAUX JEUX ---

    function showVowelGame() {
        document.body.classList.remove('stage-controls-visible');
        gameState.currentTopic = 'vowels';
        showLevelMenu(gameState.currentTopic);
    }
    
    function loadVowelQuestion(index) {
        document.body.classList.add('stage-controls-visible');
        if (index < 0 || index >= vowelLevels.length) {
            win();
            return;
        }

        const levelData = vowelLevels[index];
        gameState.currentLevel = levelData.level;
        gameState.currentQuestionIndex = index;
        gameState.currentVowelLevelData = null;
        gameState.questionSkillTag = resolveSkillTag('vowels');
        gameState.questionStartTime = performance.now();

        content.innerHTML = '';
        updateUI();

        const wrapper = document.createElement('div');
        wrapper.className = 'vowel-wrapper fx-bounce-in-down';

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = 'Quelle voyelle manque ?';
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: `${title.textContent}. ${levelData.hint}`,
            ariaLabel: 'Écouter la consigne des voyelles'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        wrapper.appendChild(promptWrapper);

        const display = document.createElement('div');
        display.className = 'vowel-display';
        const blanksCount = (levelData.masked.match(/_/g) || []).length;
        levelData.masked.split('').forEach(char => {
            const span = document.createElement('span');
            if (char === '_') {
                span.className = 'vowel-blank shimmer';
                span.textContent = '✨';
            } else {
                span.className = 'vowel-char';
                span.textContent = char;
            }
            display.appendChild(span);
        });
        wrapper.appendChild(display);

        const hint = document.createElement('p');
        hint.className = 'vowel-hint';
        hint.textContent = levelData.hint;
        wrapper.appendChild(hint);

        const feedbackBubble = document.createElement('div');
        feedbackBubble.className = 'vowel-feedback is-hidden';
        feedbackBubble.setAttribute('role', 'status');
        feedbackBubble.setAttribute('aria-live', 'polite');
        wrapper.appendChild(feedbackBubble);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'vowel-options';

        const buttons = [];
        const shuffledOptions = shuffle([...levelData.options]);
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'vowel-option fx-bounce-in-down';
            btn.dataset.value = opt;
            btn.textContent = opt.toUpperCase();
            btn.addEventListener('click', handleVowelAnswer);
            optionsContainer.appendChild(btn);
            buttons.push(btn);
        });
        wrapper.appendChild(optionsContainer);

        content.appendChild(wrapper);
        updateProgressTracker(index + 1, vowelLevels.length);
        speakText(`${title.textContent}. ${levelData.hint}`);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu('vowels'));
    
        gameState.currentVowelLevelData = {
            level: levelData.level,
            answer: levelData.answer,
            blanksCount,
            displayEl: display,
            buttons,
            feedbackEl: feedbackBubble
        };
        userProgress.answeredQuestions[`vowels-${gameState.currentLevel}`] = userProgress.answeredQuestions[`vowels-${gameState.currentLevel}`] || 'in-progress';
        saveProgress();
    }

    function handleVowelAnswer(event) {
        if (!gameState.currentVowelLevelData) { return; }

        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.vowel-option'));
        if (!selectedOption) { return; }

        gameState.currentVowelLevelData.buttons.forEach(btn => {
            btn.removeEventListener('click', handleVowelAnswer);
            btn.disabled = true;
        });

        const userAnswer = selectedOption.dataset.value;
        const expected = gameState.currentVowelLevelData.answer;
        const blanks = gameState.currentVowelLevelData.displayEl.querySelectorAll('.vowel-blank');

        const isCorrect = userAnswer && userAnswer.toLowerCase() === expected.toLowerCase();
        const elapsed = gameState.questionStartTime ? performance.now() - gameState.questionStartTime : 0;
        if (isCorrect) {
            fillVowelBlanks(blanks, userAnswer);
            gameState.currentVowelLevelData.displayEl.classList.add('is-complete');
            selectedOption.classList.add('correct', 'vowel-option-correct');
            showVowelFeedback('positive', 'Super !');
            userProgress.userScore.stars += 10 + gameState.currentLevel * 2;
            userProgress.userScore.coins += 10;
            userProgress.answeredQuestions[`vowels-${gameState.currentLevel}`] = 'completed';
            saveProgress();
            updateUI(); // Llamada a updateUI()
            showSuccessMessage('Bravo !');
            showFireworks();
            gameState.historyTracker?.recordQuestion(gameState.questionSkillTag || resolveSkillTag('vowels'), { correct: true, timeMs: elapsed });
            setTimeout(() => {
                gameState.currentVowelLevelData = null;
                if (gameState.currentQuestionIndex + 1 < vowelLevels.length) {
                    loadVowelQuestion(gameState.currentQuestionIndex + 1);
                } else {
                    gameState.historyTracker?.endGame({ status: 'completed', topic: 'vowels', level: gameState.currentLevel });
                    showLevelMenu('vowels');
                }
            }, 1600);
        } else {
            selectedOption.classList.add('wrong', 'vowel-option-wrong');
            gameState.currentVowelLevelData.displayEl.classList.add('is-error');
            showVowelFeedback('negative', 'Essaie encore !');
            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5);
            userProgress.answeredQuestions[`vowels-${gameState.currentLevel}`] = 'in-progress';
            saveProgress();
            updateUI(); // Llamada a updateUI()
            gameState.historyTracker?.recordQuestion(gameState.questionSkillTag || resolveSkillTag('vowels'), { correct: false, timeMs: elapsed });
            showErrorMessage('Regarde bien les lettres.', expected);
            setTimeout(() => {
                gameState.currentVowelLevelData.displayEl.classList.remove('is-error');
                gameState.currentVowelLevelData.buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.addEventListener('click', handleVowelAnswer);
                    btn.classList.remove('vowel-option-wrong');
                });
                hideVowelFeedback();
                gameState.questionStartTime = performance.now();
            }, 1200);
        }
    }

    function isStoryCompletedForDisplay(story) {
        if (!story) { return false; }
        const activeSet = getActiveStorySet();
        return isStoryMarkedCompleted(story.id, activeSet?.id);
    }

    function markStoryAsCompleted(story) {
        if (!story) { return; }
        const activeSet = getActiveStorySet();
        markStoryCompletedById(story.id, activeSet.id);
        userProgress.answeredQuestions[`stories-${story.id}`] = 'completed';
        saveProgress();
    }

    function fillVowelBlanks(blanks, selection) {
        const chars = selection.split('');
        blanks.forEach((blank, index) => {
            const char = chars[index] || chars[chars.length - 1] || '';
            blank.textContent = char;
            blank.classList.add('is-filled');
            blank.classList.remove('shimmer');
        });
    }

    function showVowelFeedback(type, message) {
        if (!gameState.currentVowelLevelData || !gameState.currentVowelLevelData.feedbackEl) { return; }
        const bubble = gameState.currentVowelLevelData.feedbackEl;
        clearTimeout(bubble._timerId);
        bubble.textContent = message;
        bubble.classList.remove('is-hidden', 'is-positive', 'is-negative');
        bubble.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
        bubble._timerId = setTimeout(() => hideVowelFeedback(), 2200);
    }

    function hideVowelFeedback() {
        if (!gameState.currentVowelLevelData || !gameState.currentVowelLevelData.feedbackEl) { return; }
        const bubble = gameState.currentVowelLevelData.feedbackEl;
        clearTimeout(bubble._timerId);
        bubble.textContent = '';
        bubble.classList.add('is-hidden');
        bubble.classList.remove('is-positive', 'is-negative');
    }

    function showSequenceGame() {
        document.body.classList.remove('stage-controls-visible');
        gameState.currentTopic = 'sequences';
        showLevelMenu(gameState.currentTopic);
    }

    function loadSequenceQuestion(index) {
        document.body.classList.add('stage-controls-visible');
        if (index < 0 || index >= sequenceLevels.length) {
            win();
            return;
        }

        gameState.currentLevel = index + 1;
        gameState.currentQuestionIndex = index;
        const levelData = sequenceLevels[index];

        content.innerHTML = '';
        updateUI();

        const container = document.createElement('div');
        container.className = 'sequence-wrapper fx-bounce-in-down';

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = 'Quel est le prochain élément de la séquence ?';
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: title.textContent,
            ariaLabel: 'Écouter la consigne de la séquence'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        container.appendChild(promptWrapper);
        speakText(title.textContent);
        updateProgressTracker(gameState.currentLevel, sequenceLevels.length);

        const sequenceContainer = document.createElement('div');
        sequenceContainer.className = 'sequence-container';

        const blankSlot = document.createElement('div');
        blankSlot.className = 'sequence-slot';
        blankSlot.dataset.answer = levelData.answer;

        levelData.sequence.forEach(item => {
            if (item === '?') {
                const slot = blankSlot.cloneNode(true);
                sequenceContainer.appendChild(slot);
            } else {
                const itemEl = document.createElement('span');
                itemEl.className = 'sequence-item';
                itemEl.textContent = item;
                sequenceContainer.appendChild(itemEl);
            }
        });

        container.appendChild(sequenceContainer);

        const feedbackBubble = document.createElement('div');
        feedbackBubble.className = 'sequence-feedback is-hidden';
        feedbackBubble.setAttribute('role', 'status');
        feedbackBubble.setAttribute('aria-live', 'polite');
        container.appendChild(feedbackBubble);

        const pool = document.createElement('div');
        pool.className = 'sequence-pool';
        pool.dataset.zone = 'pool';

        const uniqueSuffix = Date.now();
        const tokens = levelData.options.map((option, i) => {
            const token = document.createElement('div');
            token.className = 'sequence-token fx-pop';
            token.textContent = option;
            token.draggable = true;
            token.dataset.value = option;
            token.dataset.id = `sequence-${index}-${i}-${uniqueSuffix}`;
            enableSequenceToken(token);
            pool.appendChild(token);
            return token;
        });

        container.appendChild(pool);
        content.appendChild(container);

        const dropzone = sequenceContainer.querySelector('.sequence-slot');
        enableSequenceDropzone(dropzone);
        enableSequenceDropzone(pool);

        // Click-to-place fallback for accessibility (in addition to drag & drop)
        tokens.forEach(token => {
            token.tabIndex = 0;
            token.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); token.click(); }
            });
            token.addEventListener('click', () => {
                // If token is in pool and dropzone empty, attempt placement
                const inPool = !!token.closest('.sequence-pool');
                const expected = dropzone.dataset.answer;
                const actual = token.dataset.value;
                if (inPool) {
                    if (!dropzone.classList.contains('is-filled')) {
                        if (expected === actual) {
                            dropzone.classList.add('is-filled', 'is-correct');
                            dropzone.classList.remove('is-wrong');
                            token.classList.add('is-correct', 'sequence-token-pop');
                            token.setAttribute('draggable', 'false');
                            dropzone.textContent = actual;
                            dropzone.appendChild(token);
                            playBufferedSound('correct');
                            showFeedback('positive', 'Super ! La séquence est complète.');
                            setTimeout(() => token.classList.remove('sequence-token-pop'), 320);
                            rewardSequence();
                        } else {
                            dropzone.classList.add('is-filled', 'is-wrong');
                            dropzone.classList.remove('is-correct');
                            playBufferedSound('wrong');
                            showFeedback('negative', 'Essaie encore !');
                            setTimeout(() => {
                                dropzone.textContent = '';
                                dropzone.classList.remove('is-filled', 'is-wrong');
                            }, 420);
                            markSequenceInProgress();
                        }
                    }
                } else {
                    // If token is already in dropzone, clicking returns it to pool
                    pool.appendChild(token);
                    token.classList.remove('is-correct');
                    token.setAttribute('draggable', 'true');
                    dropzone.classList.remove('is-filled', 'is-correct', 'is-wrong');
                    dropzone.textContent = '';
                    hideFeedback();
                    markSequenceInProgress();
                }
            });
        });

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu('sequences'));

        function enableSequenceToken(token) {
            token.addEventListener('dragstart', () => {
                token.classList.add('is-dragging');
            });
            token.addEventListener('dragend', () => {
                token.classList.remove('is-dragging');
            });
        }

        function enableSequenceDropzone(zone) {
            zone.addEventListener('dragenter', event => {
                event.preventDefault();
                zone.classList.add('is-target');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('is-target');
            });
            zone.addEventListener('dragover', event => {
                event.preventDefault();
            });
            zone.addEventListener('drop', event => {
                event.preventDefault();
                zone.classList.remove('is-target');
                const tokenId = event.dataTransfer ? event.dataTransfer.getData('text/plain') : undefined;
                let token;
                if (tokenId) {
                    token = document.querySelector(`[data-id="${tokenId}"]`);
                }
                if (!token) {
                    token = document.querySelector('.sequence-token.is-dragging');
                }
                if (!token) { return; }

                if (zone.dataset.zone === 'pool') {
                    pool.appendChild(token);
                    token.classList.remove('is-correct');
                    token.setAttribute('draggable', 'true');
                    dropzone.classList.remove('is-filled', 'is-correct', 'is-wrong');
                    dropzone.textContent = '';
                    hideFeedback();
                    markSequenceInProgress();
                    return;
                }

                const expected = zone.dataset.answer;
                const actual = token.dataset.value;
                zone.textContent = actual;

                if (expected === actual) {
                    zone.classList.add('is-filled', 'is-correct');
                    zone.classList.remove('is-wrong');
                    token.classList.add('is-correct', 'sequence-token-pop');
                    token.setAttribute('draggable', 'false');
                    zone.appendChild(token);
                    playBufferedSound('correct');
                    showFeedback('positive', 'Super ! La séquence est complète.');
                    setTimeout(() => token.classList.remove('sequence-token-pop'), 320);
                    rewardSequence();
                } else {
                    zone.classList.add('is-filled', 'is-wrong');
                    zone.classList.remove('is-correct');
                    playBufferedSound('wrong');
                    showFeedback('negative', 'Essaie encore !');
                    setTimeout(() => {
                        zone.textContent = '';
                        zone.classList.remove('is-filled', 'is-wrong');
                        pool.appendChild(token);
                        token.classList.remove('is-correct');
                        token.setAttribute('draggable', 'true');
                    }, 420);
                    markSequenceInProgress();
                }
            });
        }

        function showFeedback(type, message) {
            clearTimeout(feedbackBubble._timerId);
            feedbackBubble.textContent = message;
            feedbackBubble.classList.remove('is-hidden', 'is-positive', 'is-negative');
            feedbackBubble.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
            feedbackBubble._timerId = setTimeout(() => hideFeedback(), 2000);
        }

        function hideFeedback() {
            feedbackBubble.textContent = '';
            feedbackBubble.classList.add('is-hidden');
            feedbackBubble.classList.remove('is-positive', 'is-negative');
        }

        function rewardSequence() {
            hideFeedback();
            userProgress.userScore.stars += 12 + gameState.currentLevel * 2;
            userProgress.userScore.coins += 8 + gameState.currentLevel;
            userProgress.answeredQuestions[`sequences-${gameState.currentLevel}`] = 'completed';
            saveProgress();
            updateUI();
            showFireworks();
            clearProgressTracker();
            setTimeout(() => {
                if (gameState.currentLevel < sequenceLevels.length) {
                    loadSequenceQuestion(gameState.currentLevel);
                } else {
                    showLevelMenu('sequences');
                }
            }, 1400);
        }

        function markSequenceInProgress() {
            userProgress.answeredQuestions[`sequences-${gameState.currentLevel}`] = 'in-progress';
            saveProgress();
        }

        content.addEventListener('dragstart', event => {
            if (event.target && event.target.classList.contains('sequence-token')) {
                event.dataTransfer.setData('text/plain', event.target.dataset.id);
            }
        });
    }

    function win() {
        content.innerHTML = `<div class="question-prompt fx-pop">Tu as complété toutes les questions! 🎉</div>
                            <div class="prompt ok">Ton score final : ${userProgress.userScore.stars} étoiles et ${userProgress.userScore.coins} pièces.</div>`;
        speakText("Tu as complété toutes les questions! Félicitations pour ton score final.");
        clearProgressTracker();
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    

    function ensureProgressTrackerElements() {
        const label = document.getElementById('progress-label');
        let tracker = document.getElementById('progressTracker');

        if (!tracker) {
            if (!stageBottom) return { tracker: null, label, fill: null, bar: null };

            tracker = document.createElement('div');
            tracker.id = 'progressTracker';
            tracker.className = 'progress-tracker';
            tracker.innerHTML = `
                <div class="progress-tracker__label"></div>
                <div class="progress-tracker__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div class="progress-tracker__fill"></div>
                </div>
            `;
            const footer = document.querySelector('.global-footer');
            if (footer) {
                footer.parentNode.insertBefore(tracker, footer);
            } else {
                document.body.appendChild(tracker);
            }
        }
        const bar = tracker.querySelector('.progress-tracker__bar');
        const fill = tracker.querySelector('.progress-tracker__fill');
        return { tracker, label, bar, fill };
    }

    function updateProgressTracker(current, total) {
        const { tracker, label, bar, fill } = ensureProgressTrackerElements();
        if (!tracker || !label || !fill || !bar) { return; }
        const safeTotal = Math.max(1, total);
        const currentQuestion = Math.min(Math.max(current, 0), safeTotal);
        const percent = Math.min(Math.max(Math.round((currentQuestion / safeTotal) * 100), 0), 100);
        if (label) {
            label.textContent = `Question ${currentQuestion} / ${safeTotal}`;
            label.classList.add('is-visible');
        }
        if (fill && bar && tracker) {
            fill.style.width = `${percent}%`;
            bar.setAttribute('aria-valuenow', String(percent));
            tracker.classList.add('is-visible');
        }
    }

    function clearProgressTracker() {
        const tracker = document.getElementById('progressTracker');
        if (!tracker) { return; }
        tracker.classList.remove('is-visible');
        const fill = tracker.querySelector('.progress-tracker__fill');
        if (fill) {
            fill.style.width = '0%';
        }
        const label = document.getElementById('progress-label');
        if (label) {
            label.classList.remove('is-visible');
            label.textContent = '';
        }
    }

    function createAudioButton({ text = '', label = '🔊', ariaLabel = 'Écouter', onClick } = {}) {
        if (!window.speechSynthesis) { return null; }
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'audio-btn';
        button.innerHTML = label;
        button.setAttribute('aria-label', ariaLabel);
        const handler = typeof onClick === 'function' ? onClick : () => speakText(text);
        button.addEventListener('click', handler);
        return button;
    }
    
    function lightenColor(hex, percent = 0.2) {
        if (!hex || typeof hex !== 'string') { return '#ffffff'; }
        let normalized = Number(percent);
        if (!Number.isFinite(normalized)) { normalized = 0.2; }
        if (normalized > 1) { normalized = normalized / 100; }
        normalized = Math.min(Math.max(normalized, 0), 1);

        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const blend = channel => Math.round(channel + (255 - channel) * normalized)
            .toString(16)
            .padStart(2, '0');

        return `#${blend(r)}${blend(g)}${blend(b)}`;
    }

    function getReadableTextColor(hex) {
        if (!hex || typeof hex !== 'string') {
            return '#2f1d4f';
        }
        const normalized = hex.trim().startsWith('#') ? hex.trim() : `#${hex.trim()}`;
        if (normalized.length !== 7) {
            return '#2f1d4f';
        }

        const r = parseInt(normalized.slice(1, 3), 16) / 255;
        const g = parseInt(normalized.slice(3, 5), 16) / 255;
        const b = parseInt(normalized.slice(5, 7), 16) / 255;

        const luminance = 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
        return luminance > 0.65 ? '#2f1d4f' : '#ffffff';
    }

    function linearise(channel) {
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    }

    // --- Content Generation ---
    function questionsPerLevel(topic) {
        return TOPIC_QUESTION_COUNTS[topic] || DEFAULT_QUESTIONS_PER_LEVEL;
    }

    function initializeQuestions() {
        Object.keys(MATH_LEVEL_CONFIG).forEach(type => {
            if (!Array.isArray(allQuestions[type])) {
                allQuestions[type] = [];
            }
            allQuestions[type].length = 0;
            const configs = MATH_LEVEL_CONFIG[type] || [];
            configs.forEach((_, levelIndex) => {
                const perLevel = questionsPerLevel(type);
                for (let i = 0; i < perLevel; i++) {
                    allQuestions[type].push(generateMathQuestion(type, levelIndex + 1));
                }
            });
        });

        if (!Array.isArray(allQuestions.colors)) {
            allQuestions.colors = [];
        }
        allQuestions.colors.length = 0;
        for (let level = 1; level <= LEVELS_PER_TOPIC; level++) {
            const perLevel = questionsPerLevel('colors');
            for (let i = 0; i < perLevel; i++) {
                allQuestions.colors.push(generateColorQuestion(level));
            }
        }
    }

    function generateMathQuestion(type, level) {
        const theme = MATH_OPERATION_THEMES[type] || MATH_OPERATION_THEMES.additions;
        const configs = MATH_LEVEL_CONFIG[type] || MATH_LEVEL_CONFIG.additions;
        const safeIndex = Math.max(0, Math.min(configs.length - 1, level - 1));
        const config = configs[safeIndex] || {};

        let num1;
        let num2;
        let correct;
        let questionText = '';
        let explanation = '';

        if (type === 'soustractions') {
            const maxStart = Math.max(5, config.maxStart || (level * 10));
            const start = randomInt(Math.max(3, Math.floor(maxStart * 0.4)), maxStart);
            const subtrahend = randomInt(config.minResult ?? 0, start);
            num1 = start;
            num2 = subtrahend;
            correct = num1 - num2;
            questionText = `${num1} − ${num2} = ?`;
            explanation = `${num1} − ${num2} = ${correct}`;
        } else if (type === 'multiplications') {
            const tables = Array.isArray(config.tables) && config.tables.length
                ? config.tables
                : [Math.max(1, Math.min(12, level))];
            const baseTable = tables[Math.floor(Math.random() * tables.length)];
            const factor = randomInt(config.minFactor || 1, config.maxFactor || 12);
            if (Math.random() > 0.5) {
                num1 = baseTable;
                num2 = factor;
            } else {
                num1 = factor;
                num2 = baseTable;
            }
            correct = num1 * num2;
            questionText = `${num1} × ${num2} = ?`;
            explanation = `${num1} × ${num2} = ${correct}`;
        } else if (type === 'divisions') {
            const divisor = Math.max(1, config.divisor || level);
            const quotient = randomInt(config.minQuotient || 1, Math.max(config.minQuotient || 1, config.maxQuotient || 12));
            num1 = divisor * quotient;
            num2 = divisor;
            correct = quotient;
            questionText = `${num1} ÷ ${num2} = ?`;
            explanation = `${num1} ÷ ${num2} = ${correct} car ${num2} × ${correct} = ${num1}`;
        } else {
            const maxSum = Math.max(10, config.maxSum || (level * 10));
            const minAddend = Math.max(0, config.minAddend ?? 0);
            const first = randomInt(minAddend, Math.max(minAddend, Math.floor(maxSum * 0.8)));
            const secondMax = Math.max(minAddend, maxSum - first);
            const second = randomInt(minAddend, secondMax);
            num1 = first;
            num2 = second;
            correct = num1 + num2;
            questionText = `${num1} + ${num2} = ?`;
            explanation = `${num1} + ${num2} = ${correct}`;
        }

        const optionsSet = new Set([correct]);
        const spread = Math.max(3, Math.round(Math.abs(correct) * 0.25) + 2 + safeIndex);
        while (optionsSet.size < 3) {
            const offset = randomInt(-spread, spread);
            const candidate = correct + offset;
            if (candidate >= 0 && !optionsSet.has(candidate)) {
                optionsSet.add(candidate);
            }
        }

        const options = shuffle(Array.from(optionsSet));
        const answerIndex = options.indexOf(correct);

        const storyline = theme.storylines
            ? theme.storylines[safeIndex % theme.storylines.length]
            : '';
        const sticker = theme.stickers
            ? theme.stickers[safeIndex % theme.stickers.length]
            : null;

        const operationMeta = {
            id: theme.id,
            icon: theme.icon,
            label: theme.label,
            accent: theme.accent,
            accentSoft: theme.accentSoft,
            className: `math-theme-${theme.id}`,
            levelLabel: config.description || `Défi niveau ${level}`,
            sticker,
            storyline: storyline || ''
        };

        return {
            questionText: questionText,
            detail: storyline || null,
            options,
            correct: answerIndex,
            difficulty: level,
            reward: computeMathReward(type, level),
            explanation,
            successMessage: theme.success,
            encouragement: theme.encouragement,
            operationMeta,
            optionIcons: Array.isArray(theme.optionIcons) && theme.optionIcons.length ? theme.optionIcons : undefined
        };
    }
    
    function generateColorQuestion(level) {
        const availableMixes = COLOR_MIX_LIBRARY.filter(mix => level >= (mix.minLevel || 1) && level <= (mix.maxLevel || LEVELS_PER_TOPIC));
        const fallbackMixes = availableMixes.length ? availableMixes : COLOR_MIX_LIBRARY;
        const selectedMix = shuffle([...fallbackMixes])[0];

        const questionText = `Quelle couleur apparaît quand on mélange ${selectedMix.inputs[0]} + ${selectedMix.inputs[1]} ?`;
        const optionsSet = new Set([selectedMix.result]);

        const distractorPool = shuffle(fallbackMixes.filter(mix => mix.result !== selectedMix.result).map(mix => mix.result));
        while (optionsSet.size < 3 && distractorPool.length) {
            optionsSet.add(distractorPool.pop());
        }

        if (optionsSet.size < 3) {
            const extraColors = shuffle(Object.keys(colorMap).filter(color => !optionsSet.has(color)));
            while (optionsSet.size < 3 && extraColors.length) {
                optionsSet.add(extraColors.pop());
            }
        }

        const options = shuffle(Array.from(optionsSet));
        const correctIndex = options.indexOf(selectedMix.result);

        return {
            questionText,
            options,
            correct: correctIndex,
            difficulty: level,
            explanation: selectedMix.explanation,
            metaSkill: 'cognition:colors',
            reward: {
                stars: 12 + level * 2,
                coins: 8 + Math.floor(level * 1.5)
            }
        };
    }

    // --- Screen Management ---
    function showTopicMenu() {
        document.body.classList.remove('stage-controls-visible');
        clearProgressTracker();
        content.innerHTML = '';
        const prompt = document.createElement('div');
        prompt.className = 'question-prompt fx-bounce-in-down';
        prompt.textContent = 'Sélectionne un sujet pour commencer.';
        content.appendChild(prompt);
        speakText('Sélectionne un sujet pour commencer.');

        maybeSuggestReview(content);

        const topicsContainer = document.createElement('div');
        topicsContainer.className = 'options-grid';
        
        const allTopics = [
            { id: 'math-blitz', icon: '⚡', text: 'Maths Sprint' },
            { id: 'lecture-magique', icon: '📖', text: 'Lecture Magique' },
            { id: 'raisonnement', icon: '🧠', text: 'Raisonnement' },
            { id: 'mots-outils', icon: '🗣️', text: 'Mots-Outils' },
            { id: 'additions', icon: '➕', text: 'Additions' },
            { id: 'soustractions', icon: '➖', text: 'Soustractions' },
            { id: 'multiplications', icon: '✖️', text: 'Multiplications' },
            { id: 'divisions', icon: '➗', text: 'Divisions' },
            { id: 'sorting', icon: '🗂️', text: 'Jeu de Tri' },
            { id: 'memory', icon: '🤔', text: 'Mémoire Magique' },
            { id: 'abaque-magique', icon: '🔢', text: 'Abaque Magique' },
            { id: 'number-houses', icon: '🏠', text: 'Maisons des Nombres' },
            { id: 'puzzle-magique', icon: '🧩', text: 'Puzzle Magique' },
            { id: 'repartis', icon: '🍎', text: 'Répartis & Multiplie' },
            { id: 'stories', icon: '📚', text: 'Contes Magiques' },
            { id: 'riddles', icon: '❓', text: 'Jeu d\'énigmes' },
            { id: 'vowels', icon: '🅰️', text: 'Jeu des Voyelles' },
            { id: 'sequences', icon: '➡️', text: 'Jeu des Séquences' },
            { id: 'colors', icon: '🎨', text: 'Les Couleurs' },
            { id: 'dictee', icon: '🧚‍♀️', text: 'Dictée Magique' },
            { id: 'ecriture-cursive', icon: '✍️', text: 'J’écris en cursive' },
            { id: 'grande-aventure-mots', icon: '🟣', text: 'La Grande Aventure des Mots', type: 'external', href: 'grande-aventure-mots/index.html' }
        ];

        allTopics.forEach(topic => {
            const btn = document.createElement('button');
            btn.className = 'topic-btn fx-bounce-in-down';
            btn.innerHTML = `<span class="topic-btn__icon">${topic.icon || '✨'}</span><span class="topic-btn__text">${topic.text}</span>`;
            btn.dataset.topic = topic.id;
            btn.style.animationDelay = `${Math.random() * 0.5}s`;
            btn.addEventListener('click', () => {
                if (topic.type === 'external' && topic.href) {
                    window.location.href = topic.href;
                    return;
                }
                    gameState.currentTopic = topic.id;
                if (topic.id === 'dictee') { showDicteeMenu(); return; }
                if (topic.id === 'stories') { showStoryMenu(); return; }
                if (topic.id === 'memory') { showMemoryGameMenu(); return; }
                if (topic.id === 'ecriture-cursive') { launchEcritureCursive(1); return; }
                if (topic.id === 'abaque-magique') { launchAbaqueMagique(1); return; }
                if (topic.id === 'repartis') { showLevelMenu('repartis'); return; }
                if (topic.id === 'mots-outils') { launchMotsOutils(1); return; }
                showLevelMenu(topic.id);
            });
            topicsContainer.appendChild(btn);
            btn.addEventListener('mouseenter', () => {
                playBufferedSound('hover', 0.2);
            });
        });
        content.appendChild(topicsContainer);

        // Section: Nouveaux Jeux Logiques et Avancés (3e Primaire)
        if (window.logicGames && typeof window.logicGames.renderSection === 'function') {
            window.logicGames.renderSection(content, (game) => {
                const ctx = createGameContext(game.id, {});
                if (typeof window.logicGames.start === 'function') {
                    window.logicGames.start(game.id, ctx);
                }
            });
        }

        // Ajout d'une rangée supplémentaire de nouveaux modules (3e primaire)
        const newTopics = [
            { id: 'problems-magiques', icon: '💡', text: 'Problèmes Magiques' },
            { id: 'fractions-fantastiques', icon: '🍰', text: 'Fractions Fantastiques' },
            { id: 'temps-horloges', icon: '⏰', text: 'Temps & Horloges' },
            { id: 'tables-defi', icon: '✖️', text: 'Tables Défi' },
            { id: 'series-numeriques', icon: '🔢', text: 'Séries Numériques' },
            // Placeholders (affichent bientôt)
            { id: 'mesures-magiques', icon: '⚖️', text: 'Mesures Magiques' },
            { id: 'labyrinthe-logique', icon: '🧭', text: 'Labyrinthe Logique' },
            { id: 'sudoku-junior', icon: '🔳', text: 'Sudoku Junior' },
            { id: 'grammaire-magique', icon: '📝', text: 'Grammaire Magique' },
            { id: 'conjugaison-magique', icon: '✍️', text: 'Conjugaison Magique' },
            { id: 'genres-accords', icon: '👥', text: 'Genres & Accords' },
            { id: 'lecture-voix-haute', icon: '🎙️', text: 'Lecture à Voix Haute' },
            { id: 'vocabulaire-thematique', icon: '🌿', text: 'Vocabulaire Thématique' },
            { id: 'atelier-art', icon: '🎨', text: 'Atelier d’Art' },
            { id: 'decouvre-nature', icon: '🌦️', text: 'Découvre la Nature' },
            { id: 'carte-monde', icon: '🌍', text: 'Carte du Monde' },
            { id: 'emotions-magiques', icon: '😊', text: 'Émotions Magiques' },
            { id: 'missions-jour', icon: '✅', text: 'Missions du Jour' }
        ];
        const extraContainer = document.createElement('div');
        extraContainer.className = 'options-grid';
        newTopics.forEach(topic => {
            const btn = document.createElement('button');
            btn.className = 'topic-btn fx-bounce-in-down';
            btn.innerHTML = `<span class="topic-btn__icon">${topic.icon}</span><span class="topic-btn__text">${topic.text}</span>`;
            btn.dataset.topic = topic.id;
            btn.addEventListener('click', () => {
                gameState.currentTopic = topic.id;
                showLevelMenu(topic.id);
            });
            btn.addEventListener('mouseenter', () => {
                playBufferedSound('hover', 0.2);
            });
            extraContainer.appendChild(btn);
        });
        content.appendChild(extraContainer);

        btnBack.style.display = 'none';
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
    }

    function showLevelMenu(topic) {
        document.body.classList.remove('stage-controls-visible');
        gameState.currentTopic = topic;
        clearProgressTracker();
        content.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = `Choisis un niveau pour ${topic}`;
        content.appendChild(title);
        speakText(`Choisis un niveau pour ${topic}`);

        const levelsContainer = document.createElement('div');
        levelsContainer.className = 'level-container';

        const maxLevels = {
            'additions': MATH_LEVEL_CONFIG.additions.length,
            'soustractions': MATH_LEVEL_CONFIG.soustractions.length,
            'multiplications': MATH_LEVEL_CONFIG.multiplications.length,
            'divisions': MATH_LEVEL_CONFIG.divisions.length,
            'number-houses': LEVELS_PER_TOPIC,
            'colors': LEVELS_PER_TOPIC,
            'memory': (window.gameData?.MEMORY_GAME_LEVELS || []).length,
            'sorting': sortingLevels.length,
            'riddles': riddleLevels.length,
            'vowels': vowelLevels.length,
            'sequences': sequenceLevels.length,
            'stories': magicStories.length,
            'puzzle-magique': (window.puzzleMagiqueGame?.getLevelCount?.() || 10),
            'repartis': (window.repartisGame?.getLevelCount?.() || 15),
            'dictee': 10,
            'math-blitz': (window.mathBlitzGame?.getLevelCount?.() || 10),
            'lecture-magique': 10,
            'raisonnement': 10,
            'ecriture-cursive': 3,
            'abaque-magique': (window.abaqueMagiqueGame?.getLevelCount?.() || 10),
            'mots-outils': (window.motsOutilsGame?.getLevelCount?.() || 15),
            // Nouveaux modules (3e primaire)
            'problems-magiques': (window.problemsMagiquesGame?.getLevelCount?.() || 10),
            'fractions-fantastiques': (window.fractionsFantastiquesGame?.getLevelCount?.() || 10),
            'temps-horloges': (window.tempsHorlogesGame?.getLevelCount?.() || 10),
            'tables-defi': (window.tablesDefiGame?.getLevelCount?.() || 10),
            'series-numeriques': (window.seriesNumeriquesGame?.getLevelCount?.() || 10),
            // Placeholders (affichent bientôt)
            'mesures-magiques': 10,
            'labyrinthe-logique': (window.logicGames?.getLevelCount?.() || 12),
            'sudoku-junior': (window.logicGames?.getLevelCount?.() || 12),
            'grammaire-magique': 10,
            'conjugaison-magique': 10,
            'genres-accords': 10,
            'lecture-voix-haute': 10,
            'vocabulaire-thematique': 10,
            'atelier-art': 10,
            'decouvre-nature': 10,
            'carte-monde': 10,
            'emotions-magiques': 10,
            'missions-jour': 10
        };
        const totalLevels = maxLevels[gameState.currentTopic] || LEVELS_PER_TOPIC;
        
        for (let i = 1; i <= totalLevels; i++) {
            const levelBtn = document.createElement('button');
            levelBtn.className = 'level-button fx-bounce-in-down';
            levelBtn.type = 'button';
            levelBtn.textContent = `Niveau ${i}`;
            levelBtn.style.animationDelay = `${Math.random() * 0.5}s`;
            levelBtn.setAttribute('aria-label', `Niveau ${i}`);
            levelBtn.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    levelBtn.click();
                }
            });
            levelBtn.addEventListener('mouseenter', () => {
                playBufferedSound('hover', 0.2);
            });
            const levelKey = `${gameState.currentTopic}-${i}`;
            if (userProgress.answeredQuestions[levelKey] === 'completed') {
                levelBtn.classList.add('correct', 'is-completed');
                levelBtn.dataset.status = 'completed';
            } else if (userProgress.answeredQuestions[levelKey] === 'in-progress') {
                levelBtn.classList.add('is-in-progress');
                levelBtn.dataset.status = 'in-progress';
            }
            levelBtn.addEventListener('click', () => {
                gameState.currentLevel = i;
                const skillTag = resolveSkillTag(gameState.currentTopic);
                gameState.historyTracker?.startGame(gameState.currentTopic, gameState.currentLevel, { skillTag });
                if (gameState.currentTopic === 'number-houses') { showNumberHousesGame(gameState.currentLevel); }
                else if (gameState.currentTopic === 'colors') { showColorGame(gameState.currentLevel); }
                else if (gameState.currentTopic === 'sorting') { showSortingGame(gameState.currentLevel); }
                else if (gameState.currentTopic === 'vowels') { loadVowelQuestion(gameState.currentLevel - 1); }
                else if (gameState.currentTopic === 'riddles') { launchRiddleLevel(gameState.currentLevel); }
                else if (gameState.currentTopic === 'sequences') { loadSequenceQuestion(gameState.currentLevel - 1); }
                else if (gameState.currentTopic === 'puzzle-magique') { launchPuzzleMagique(gameState.currentLevel); }
                else if (gameState.currentTopic === 'repartis') { launchRepartisGame(gameState.currentLevel); }
                else if (gameState.currentTopic === 'dictee') { launchDicteeLevel(gameState.currentLevel); }
                else if (gameState.currentTopic === 'math-blitz') { launchMathBlitzLevel(gameState.currentLevel); }
                else if (gameState.currentTopic === 'lecture-magique') { launchLectureMagiqueLevel(gameState.currentLevel); }
                else if (gameState.currentTopic === 'raisonnement') { launchRaisonnementLevel(gameState.currentLevel); }
                else if (gameState.currentTopic === 'ecriture-cursive') { launchEcritureCursive(gameState.currentLevel); }
                else if (gameState.currentTopic === 'abaque-magique') { launchAbaqueMagique(gameState.currentLevel); }
                else if (gameState.currentTopic === 'mots-outils') { launchMotsOutils(gameState.currentLevel); }
                // Nouveaux modules jouables
                else if (gameState.currentTopic === 'problems-magiques') { launchProblemsMagiques(gameState.currentLevel); }
                else if (gameState.currentTopic === 'fractions-fantastiques') { launchFractionsFantastiques(gameState.currentLevel); }
                else if (gameState.currentTopic === 'temps-horloges') { launchTempsHorloges(gameState.currentLevel); }
                else if (gameState.currentTopic === 'tables-defi') { launchTablesDefi(gameState.currentLevel); }
                else if (gameState.currentTopic === 'series-numeriques') { launchSeriesNumeriques(gameState.currentLevel); }
                // Placeholders
                else if ([
                  'mesures-magiques','labyrinthe-logique','sudoku-junior','grammaire-magique','conjugaison-magique',
                  'genres-accords','lecture-voix-haute','vocabulaire-thematique','atelier-art','decouvre-nature',
                  'carte-monde','emotions-magiques','missions-jour'
                ].includes(gameState.currentTopic)) { showComingSoon(gameState.currentTopic, '✨'); }
                else if (gameState.currentTopic === 'memory') { showMemoryGame(MEMORY_GAME_LEVELS[gameState.currentLevel - 1]); }
                else { gameState.currentQuestionIndex = 0; loadQuestion(0); }
            });
            levelsContainer.appendChild(levelBtn);
        }
        content.appendChild(levelsContainer);
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux sujets', showTopicMenu);
    }

    function handleOptionClick(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleOptionClick));
    
        const questionsForLevel = allQuestions[gameState.currentTopic].filter(q => q.difficulty === gameState.currentLevel);
        const questionData = questionsForLevel[gameState.currentQuestionIndex];
        const correctAnswerIndex = questionData.correct;
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctValue = questionData.options[correctAnswerIndex];
        const userAnswerLabel = selectedOption.querySelector('.option-text')
            ? selectedOption.querySelector('.option-text').textContent.trim()
            : selectedOption.textContent.trim();
        const isCorrect = (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex)
            || userAnswerLabel === String(correctValue);

        if (isCorrect) {
            selectedOption.classList.add('correct', 'fx-pulse');
            userProgress.userScore.stars += questionData.reward.stars;
            userProgress.userScore.coins += questionData.reward.coins;
            const sticker = questionData.operationMeta?.sticker ? ` ${questionData.operationMeta.sticker}` : '';
            const successMessage = questionData.successMessage
                ? `${questionData.successMessage}${sticker}` // Mensaje de éxito
                : `${positiveMessages[Math.floor(Math.random() * positiveMessages.length)]}${sticker}`;
            showSuccessMessage(successMessage);
            showConfetti();
        } else {
            selectedOption.classList.add('wrong', 'fx-shake');
            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            const encouragement = questionData.encouragement || 'Courage, essaie encore !';
            const explanation = questionData.explanation
                ? `${encouragement} ${questionData.explanation}`
                : encouragement;
            showErrorMessage(explanation, correctValue);
            setTimeout(() => selectedOption.classList.remove('fx-shake'), 800);
        }
        const elapsed = gameState.questionStartTime ? performance.now() - gameState.questionStartTime : 0;
        gameState.historyTracker?.recordQuestion(gameState.questionSkillTag, { correct: isCorrect, timeMs: elapsed });
        updateUI();
        saveProgress();

        setTimeout(() => {
            gameState.currentQuestionIndex++;
            if (gameState.currentQuestionIndex < questionsForLevel.length) {
                loadQuestion(gameState.currentQuestionIndex);
            } else {
                if (gameState.currentTopic !== 'review') {
                    userProgress.answeredQuestions[`${gameState.currentTopic}-${gameState.currentLevel}`] = 'completed';
                } else {
                    gameState.historyTracker?.applyReviewSuccess(gameState.activeReviewSkills);
                }
                saveProgress();
                clearProgressTracker();
                const winPrompt = document.createElement('div');
                winPrompt.className = 'prompt ok fx-pop';
                winPrompt.textContent = `Bravo, tu as complété le Niveau ${gameState.currentLevel} !`;
                content.appendChild(winPrompt);
                speakText(`Bravo, tu as complété le Niveau ${gameState.currentLevel} !`);
                const endStatus = gameState.currentTopic === 'review' ? 'review-completed' : 'completed';
                gameState.historyTracker?.endGame({ status: endStatus, topic: gameState.currentTopic, level: gameState.currentLevel, skills: gameState.activeReviewSkills });
                if (gameState.currentTopic === 'review') {
                    gameState.activeReviewSkills = [];
                }
                setTimeout(() => showLevelMenu(gameState.currentTopic), 2000);
            }
        }, 2500);
    }
    
    function loadQuestion(index) {
        document.body.classList.add('stage-controls-visible');
        gameState.currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();

        const questionsForLevel = allQuestions[gameState.currentTopic].filter(q => q.difficulty === gameState.currentLevel);
        if (!questionsForLevel.length) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'question-prompt';
            emptyMessage.textContent = 'Aucune question disponible pour ce niveau pour le moment.';
            content.appendChild(emptyMessage);
            clearProgressTracker();
            return;
        }
        gameState.questionSkillTag = resolveSkillTag(gameState.currentTopic);
        const questionData = questionsForLevel[index];
        const operationMeta = questionData?.operationMeta || null;
        if (questionData?.metaSkill) {
            gameState.questionSkillTag = questionData.metaSkill;
        }
        gameState.questionStartTime = performance.now();
        if (operationMeta?.id) {
            content.dataset.operationTheme = operationMeta.id;
        } else {
            delete content.dataset.operationTheme;
        }

        if (operationMeta?.accent) {
            content.style.setProperty('--operation-accent', operationMeta.accent);
            content.style.setProperty('--operation-accent-soft', operationMeta.accentSoft || operationMeta.accent);
        } else {
            content.style.removeProperty('--operation-accent');
            content.style.removeProperty('--operation-accent-soft');
        }

        const fragment = document.createDocumentFragment();

        if (operationMeta) {
            const banner = document.createElement('div');
            banner.className = `operation-banner fx-bounce-in-down ${operationMeta.className || ''}`.trim();

            const iconSpan = document.createElement('span');
            iconSpan.className = 'operation-banner__icon';
            iconSpan.textContent = operationMeta.icon || '✨';

            const textBox = document.createElement('div');
            textBox.className = 'operation-banner__text';

            const labelSpan = document.createElement('span');
            labelSpan.className = 'operation-banner__label';
            labelSpan.textContent = operationMeta.label || 'Défi magique';
            textBox.appendChild(labelSpan);

            const levelSpan = document.createElement('span');
            levelSpan.className = 'operation-banner__level';
            levelSpan.textContent = operationMeta.levelLabel || `Niveau ${gameState.currentLevel}`;
            textBox.appendChild(levelSpan);

            if (operationMeta.storyline) {
                const storySpan = document.createElement('span');
                storySpan.className = 'operation-banner__story';
                storySpan.textContent = operationMeta.storyline;
                textBox.appendChild(storySpan);
            }

            banner.appendChild(iconSpan);
            banner.appendChild(textBox);

            if (operationMeta.sticker) {
                const stickerSpan = document.createElement('span');
                stickerSpan.className = 'operation-banner__sticker';
                stickerSpan.textContent = operationMeta.sticker;
                banner.appendChild(stickerSpan);
            }

            fragment.appendChild(banner);
        }

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = questionData.questionText;
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: questionData.questionText,
            ariaLabel: 'Écouter la question'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        if (questionData.detail && !operationMeta) {
            const detail = document.createElement('p');
            detail.className = 'question-detail';
            detail.textContent = questionData.detail;
            promptWrapper.appendChild(detail);
        }

        fragment.appendChild(promptWrapper);
        speakText(questionData.questionText);
        updateProgressTracker(index + 1, questionsForLevel.length);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        if (operationMeta) {
            optionsContainer.classList.add('options-grid--math', `options-grid--${operationMeta.id}`);
        }
        
        const shuffledOptions = shuffle([...questionData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option fx-bounce-in-down';
            if (operationMeta) {
                optionEl.classList.add('math-option', `math-option--${operationMeta.id}`);
            }
            optionEl.style.animationDelay = `${i * 0.1 + 0.5}s`;
            const originalIndex = questionData.options.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleOptionClick);
            const iconSet = Array.isArray(questionData.optionIcons) && questionData.optionIcons.length
                ? questionData.optionIcons
                : answerOptionIcons;
            applyOptionContent(optionEl, opt, i, iconSet);
            optionsContainer.appendChild(optionEl);
        });
        fragment.appendChild(optionsContainer);
        content.appendChild(fragment);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        if (gameState.currentTopic === 'review') {
            configureBackButton('Terminer le repaso', showTopicMenu);
        } else {
            configureBackButton('Retour aux niveaux', () => showLevelMenu(gameState.currentTopic));
        }
    }
    /* === Juegos Específicos === */
    /**
 * Muestra el juego de las Casas de los Números.
 * @param {number} level El nivel actual del juego.
 */
function showNumberHousesGame(level) {
    document.body.classList.add('stage-controls-visible');
    gameState.currentLevel = level;
    const content = document.getElementById('content');
    content.innerHTML = ''; 
    updateUI();
    gameState.questionSkillTag = resolveSkillTag('number-houses');
    gameState.questionStartTime = performance.now();

    const maxRoofNumber = (level * 5) + 15;
    const roofNumber = randomInt(10, maxRoofNumber);
    const pairsCount = 5;
    const problems = generateNumberProblems(roofNumber, pairsCount);

    const container = document.createElement('div');
    container.className = 'number-house-container fx-bounce-in-down';

    const rooftop = document.createElement('div');
    rooftop.className = 'rooftop fx-pulse';
    rooftop.textContent = roofNumber;
    container.appendChild(rooftop);

    const promptWrapper = document.createElement('div');
    promptWrapper.className = 'prompt-with-audio';

    const instruction = document.createElement('p');
    instruction.className = 'question-prompt';
    instruction.textContent = `Complète les ${pairsCount} maisons pour trouver le nombre magique.`;
    promptWrapper.appendChild(instruction);

    const audioBtn = createAudioButton({
        text: instruction.textContent,
        ariaLabel: 'Écouter la consigne des maisons des nombres'
    });
    if (audioBtn) {
        promptWrapper.appendChild(audioBtn);
    }

    container.appendChild(promptWrapper);
    speakText(instruction.textContent);
    updateProgressTracker(1, 1);

    const windowsContainer = document.createElement('div');
    windowsContainer.className = 'windows';

    problems.forEach((problem, index) => {
        const row = document.createElement('div');
        row.className = 'window-row';
        row.style.animationDelay = `${index * 0.08}s`;
        row.classList.add('fx-bounce-in-down');

        const { num1, num2, answer, operation, hiddenIndex } = problem;
        const operatorSymbol = operation === 'subtraction' ? '−' : '+';

        const parts = [
            hiddenIndex === 0 ? `<input type="number" class="window-input" data-correct-value="${answer}" />` : `<span class="window-number">${num1}</span>`,
            `<span class="plus-sign">${operatorSymbol}</span>`,
            hiddenIndex === 1 ? `<input type="number" class="window-input" data-correct-value="${answer}" />` : `<span class="window-number">${num2}</span>`,
            `<span class="equal-sign">=</span>`,
            `<span class="window-number">${roofNumber}</span>`
        ];

        if (operation === 'subtraction' && hiddenIndex === 1) {
            // To make it num1 - ? = roof, we swap the input and the roof
            parts[2] = `<span class="window-number">${roofNumber}</span>`;
            parts[4] = `<input type="number" class="window-input" data-correct-value="${answer}" />`;
        }

        row.innerHTML = parts.join('');
        windowsContainer.appendChild(row);
    });

container.appendChild(windowsContainer);

const checkBtn = document.createElement('button');
checkBtn.id = 'checkHouseBtn';
checkBtn.className = 'submit-btn fx-bounce-in-down';
checkBtn.textContent = 'Vérifier';
checkBtn.setAttribute('aria-label', 'Vérifier les réponses');
checkBtn.style.animationDelay = `${problems.length * 0.1 + 0.5}s`;
container.appendChild(checkBtn);
content.appendChild(container);

btnLogros.style.display = 'inline-block';
btnLogout.style.display = 'inline-block';
configureBackButton('Retour aux niveaux', () => showLevelMenu(gameState.currentTopic));

checkBtn.addEventListener('click', handleCheckHouses);
}

/**
 * Maneja la lógica de verificación del juego.
 */
function handleCheckHouses() {
    const allInputs = document.querySelectorAll('.window-input');
    let allCorrect = true;
    let correctCount = 0;
    const checkBtn = document.getElementById('checkHouseBtn');

    checkBtn.disabled = true;

    let incorrectValues = [];
    allInputs.forEach(input => {
        const inputValue = parseInt(input.value, 10);
        const correctValue = parseInt(input.dataset.correctValue, 10);
        
        input.classList.remove('correct', 'incorrect', 'fx-shake');

        if (inputValue === correctValue) {
            input.classList.add('correct');
            input.disabled = true;
            correctCount++;
        } else {
            input.classList.add('incorrect', 'fx-shake');
            setTimeout(() => input.classList.remove('fx-shake'), 1000); // This should be userProgress.userScore.coins
            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5);
            allCorrect = false;
            incorrectValues.push(`Réponse attendue : ${correctValue}`);
        }
    });

    updateUI();
    saveProgress();
    const elapsed = gameState.questionStartTime ? performance.now() - gameState.questionStartTime : 0;
    gameState.historyTracker?.recordQuestion(gameState.questionSkillTag || resolveSkillTag('number-houses'), { correct: allCorrect, timeMs: elapsed });

    if (allCorrect) {
        userProgress.userScore.stars += 50;
        userProgress.userScore.coins += 50;
        userProgress.answeredQuestions[`${gameState.currentTopic}-${gameState.currentLevel}`] = 'completed';
        saveProgress();
        showSuccessMessage('Bravo ! Toutes les maisons sont correctes. 🦄✨'); // Mensaje de éxito
        showConfetti();
        checkBtn.textContent = 'Niveau suivant';
        checkBtn.onclick = () => {
            if (gameState.currentLevel < LEVELS_PER_TOPIC) {
                showNumberHousesGame(gameState.currentLevel + 1);
            } else {
                win();
            }
        };
        checkBtn.disabled = false;
        gameState.historyTracker?.endGame({ status: 'completed', topic: 'number-houses', level: gameState.currentLevel });
    } else {
        const message = `${correctCount} réponses correctes. ${allInputs.length - correctCount} incorrectes. -5 pièces.`;
        showErrorMessage(message, incorrectValues.join(', '));
        setTimeout(() => {
            checkBtn.disabled = false;
            gameState.questionStartTime = performance.now();
        }, 500); 
    }
}

/**
 * Genera pares de números cuya suma es igual a 'sum'.
 * @param {number} sum El valor del tejado de la casa.
 * @param {number} count La cantidad de pares a generar.
 * @returns {Array<Array<number>>} Un array de pares de números.
 */
function generateNumberProblems(sum, count) {
    const problems = [];
    const usedPairs = new Set(); 

    while (problems.length < count) {
        const isSubtraction = Math.random() < 0.4; // 40% de probabilidad de resta
        let problem;

        if (isSubtraction) {
            const num1 = randomInt(sum + 1, sum + 15);
            const answer = num1 - sum;
            const pairKey = `${num1}-sub`;
            if (!usedPairs.has(pairKey)) {
                problem = { num1, num2: answer, answer, operation: 'subtraction', hiddenIndex: 1 };
                usedPairs.add(pairKey);
            }
        } else { // Adición
            const num1 = randomInt(0, sum);
            const answer = sum - num1;
            const pairKey = num1 < answer ? `${num1}-${answer}` : `${answer}-${num1}`;
            if (!usedPairs.has(pairKey)) {
                const hiddenIndex = Math.random() < 0.5 ? 0 : 1;
                problem = {
                    num1: hiddenIndex === 0 ? answer : num1,
                    num2: hiddenIndex === 0 ? num1 : answer,
                    answer: hiddenIndex === 0 ? num1 : answer,
                    operation: 'addition',
                    hiddenIndex
                };
                usedPairs.add(pairKey);
            }
        }

        if (problem) {
            problems.push(problem);
        }
    }
    return problems;
}

    function showColorGame(level) {
        document.body.classList.add('stage-controls-visible');
        gameState.currentTopic = 'colors';
        gameState.currentLevel = level;
        gameState.currentQuestionIndex = 0;
        loadColorQuestion(0);
    }
    
    function loadColorQuestion(index) {
        document.body.classList.add('stage-controls-visible');
        gameState.currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();
        
        const questionsForLevel = allQuestions.colors.filter(q => q.difficulty === gameState.currentLevel);
        if (!questionsForLevel.length) {
            const empty = document.createElement('p');
            empty.className = 'question-prompt';
            empty.textContent = 'Aucune question de couleur disponible pour ce niveau.';
            content.appendChild(empty);
            clearProgressTracker();
            return;
        }
        const questionData = questionsForLevel[index];
        gameState.questionSkillTag = questionData?.metaSkill || resolveSkillTag('colors');
        gameState.questionStartTime = performance.now();
        const fragment = document.createDocumentFragment();
        
        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = questionData.questionText;
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: questionData.questionText,
            ariaLabel: 'Écouter la question de couleur'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        fragment.appendChild(promptWrapper);
        speakText(questionData.questionText);
        updateProgressTracker(index + 1, questionsForLevel.length);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        
        const shuffledOptions = shuffle([...questionData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'color-option-button fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.1 + 0.5}s`;
            const colorName = colorMap[opt];
            if (colorName) { optionEl.classList.add(`color-${colorName}`); }
            applyOptionContent(optionEl, opt, i, colorOptionIcons);
            const originalIndex = questionData.options.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleColorOptionClick);
            optionsContainer.appendChild(optionEl);
        });
        fragment.appendChild(optionsContainer);
        content.appendChild(fragment);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        if (gameState.currentTopic === 'review') {
            configureBackButton('Terminer le repaso', showTopicMenu);
        } else {
            configureBackButton('Retour aux niveaux', () => showLevelMenu(gameState.currentTopic));
        }
    }
    
    function handleColorOptionClick(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.color-option-button'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.color-option-button') : document.querySelectorAll('.color-option-button');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleColorOptionClick));

        const questionsForLevel = allQuestions.colors.filter(q => q.difficulty === gameState.currentLevel);
        const questionData = questionsForLevel[gameState.currentQuestionIndex];
        const correctAnswerIndex = questionData.correct;
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctValue = questionData.options[correctAnswerIndex];
        const userAnswerLabel = selectedOption.querySelector('.option-text')
            ? selectedOption.querySelector('.option-text').textContent.trim()
            : selectedOption.textContent.trim();
        const isCorrect = (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex)
            || userAnswerLabel === String(correctValue);

        if (isCorrect) {
            selectedOption.classList.add('correct');
            userProgress.userScore.stars += questionData.reward.stars;
            userProgress.userScore.coins += questionData.reward.coins;
            showSuccessMessage();
            showConfetti();
        } else { // Respuesta incorrecta
            selectedOption.classList.add('wrong');
            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) { correctOption.classList.add('correct'); }
            const explanation = questionData.explanation
                ? `${questionData.explanation}`
                : '❌ -5 pièces. Essaie encore !';
            showErrorMessage(explanation, correctValue);
        }
        const elapsed = gameState.questionStartTime ? performance.now() - gameState.questionStartTime : 0;
        gameState.historyTracker?.recordQuestion(gameState.questionSkillTag, { correct: isCorrect, timeMs: elapsed });
        updateUI();
        saveProgress();
        setTimeout(() => {
            gameState.currentQuestionIndex++;
            if (gameState.currentQuestionIndex < questionsForLevel.length) {
                loadColorQuestion(gameState.currentQuestionIndex);
            } else {
                if (gameState.currentTopic !== 'review') {
                    userProgress.answeredQuestions[`${gameState.currentTopic}-${gameState.currentLevel}`] = 'completed';
                } else {
                    gameState.historyTracker?.applyReviewSuccess(gameState.activeReviewSkills);
                }
                saveProgress();
                clearProgressTracker();
                showSuccessMessage(`Bravo, tu as complété le Niveau ${gameState.currentLevel} !`);
                const endStatus = gameState.currentTopic === 'review' ? 'review-completed' : 'completed';
                gameState.historyTracker?.endGame({ status: endStatus, topic: gameState.currentTopic, level: gameState.currentLevel, skills: gameState.activeReviewSkills });
                if (gameState.currentTopic === 'review') {
                    gameState.activeReviewSkills = [];
                }
                setTimeout(() => showLevelMenu(gameState.currentTopic), 2000);
            }
        }, 2500);
    }

    function showStoryMenu() {
        ensureSkyElements();
        document.body.classList.add('story-menu-active');
        document.body.classList.remove('stage-controls-visible');
        clearProgressTracker();
        setActiveStorySet(userProgress.storyProgress?.activeSetIndex || activeStorySetIndex);
        ensureStoryProgressInitialized();
        content.innerHTML = '';

        const title = document.createElement('div');
        title.className = 'question-prompt story-menu-title fx-bounce-in-down';
        title.textContent = 'Choisis un conte magique ✨';
        content.appendChild(title);
        speakText('Choisis un conte magique');

        const activeSet = getActiveStorySet();
        const completionMap = getStoryCompletionMap(activeSet?.id);
        const completedCount = magicStories.reduce((total, story) => {
            return total + (completionMap[story.id] ? 1 : 0);
        }, 0);

        const subtitle = document.createElement('p');
        subtitle.className = 'story-menu__subtitle fx-bounce-in-down';
        subtitle.style.animationDelay = '0.1s';
        subtitle.textContent = `Collection ${activeStorySetIndex + 1} sur ${storyCollections.length}`;
        content.appendChild(subtitle);

        const progressBadge = document.createElement('div');
        progressBadge.className = 'story-menu__progress fx-bounce-in-down';
        progressBadge.style.animationDelay = '0.15s';
        progressBadge.textContent = `Progrès : ${completedCount} / ${magicStories.length} contes`;
        content.appendChild(progressBadge);

        if (!magicStories.length) {
            const emptyState = document.createElement('p');
            emptyState.className = 'story-menu__empty';
            emptyState.textContent = 'De nouvelles histoires arrivent bientôt !';
            content.appendChild(emptyState);
            return;
        }

        const carousel = document.createElement('div');
        carousel.className = 'story-carousel fx-bounce-in-down';
        carousel.style.animationDelay = '0.2s';

        const viewport = document.createElement('div');
        viewport.className = 'story-carousel__viewport';

        const track = document.createElement('div');
        track.className = 'story-carousel__track';

        magicStories.forEach((story, index) => {
            const slide = document.createElement('div');
            slide.className = 'story-carousel__slide';

            const storyBtn = document.createElement('button');
            storyBtn.type = 'button';
            storyBtn.className = 'story-card fx-bounce-in-down';
            storyBtn.dataset.storyIndex = String(index);
            storyBtn.dataset.storyId = story.id;
            storyBtn.style.animationDelay = `${index * 0.08 + 0.25}s`;

            const isCompleted = isStoryCompletedForDisplay(story);
            if (isCompleted) {
                storyBtn.classList.add('is-completed');
            }
            storyBtn.setAttribute('aria-pressed', isCompleted ? 'true' : 'false');
            storyBtn.setAttribute('aria-label', `${story.title} — ${isCompleted ? 'déjà lu' : 'à lire'}`);

            const cardTitle = document.createElement('span');
            cardTitle.className = 'story-card__title';
            cardTitle.textContent = story.title;
            storyBtn.appendChild(cardTitle);

            const statusBadge = document.createElement('span');
            statusBadge.className = 'story-card__status';
            statusBadge.textContent = isCompleted ? '✔ Terminé' : '📖 À lire';
            storyBtn.appendChild(statusBadge);

            storyBtn.addEventListener('click', () => showMagicStory(index));

            slide.appendChild(storyBtn);
            track.appendChild(slide);
        });

        viewport.appendChild(track);
        carousel.appendChild(viewport);

        const navPrev = document.createElement('button');
        navPrev.type = 'button';
        navPrev.className = 'story-carousel__nav story-carousel__nav--prev';
        navPrev.setAttribute('aria-label', 'Voir les contes précédents');
        navPrev.textContent = '◀';

        const navNext = document.createElement('button');
        navNext.type = 'button';
        navNext.className = 'story-carousel__nav story-carousel__nav--next';
        navNext.setAttribute('aria-label', 'Voir les contes suivants');
        navNext.textContent = '▶';

        const scrollAmount = () => Math.max(carousel.offsetWidth * 0.7, 280);

        navPrev.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        });
        navNext.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        });

        carousel.appendChild(navPrev);
        carousel.appendChild(navNext);

        const updateNavState = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            const epsilon = 4;
            const showNav = maxScroll > epsilon;
            navPrev.style.display = showNav ? 'flex' : 'none';
            navNext.style.display = showNav ? 'flex' : 'none';
            if (!showNav) { return; }
            navPrev.disabled = track.scrollLeft <= epsilon;
            navNext.disabled = track.scrollLeft >= (maxScroll - epsilon);
        };

        track.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateNavState);
        });

        updateNavState();
        setTimeout(updateNavState, 120);

        content.appendChild(carousel);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux sujets', showTopicMenu);
    }

    function showMagicStory(storyIndex) {
        document.body.classList.add('stage-controls-visible');
        content.innerHTML = '';
        const story = magicStories[storyIndex];
        gameState.currentStoryIndex = storyIndex;
        const storyContainer = document.createElement('div');
        storyContainer.className = 'story-container fx-bounce-in-down';
        const titleEl = document.createElement('h2');
        titleEl.textContent = story.title;
        storyContainer.appendChild(titleEl);

        const storyToolbar = document.createElement('div');
        storyToolbar.className = 'story-toolbar';

        const fullStoryText = story.text.join(' ');
        const listenBtn = createAudioButton({
            label: '📖',
            ariaLabel: 'Lire le conte en voix haute',
            onClick: () => speakText(`${story.title}. ${fullStoryText}`)
        });
        if (listenBtn) {
            listenBtn.classList.add('story-listen-btn');
            listenBtn.textContent = '📖 Lire le conte';
            storyToolbar.appendChild(listenBtn);
            storyContainer.appendChild(storyToolbar);
        }

        if (story.image) {
            const img = document.createElement('img');
            img.src = story.image;
            img.alt = story.title;
            storyContainer.appendChild(img);
        }

        story.text.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            storyContainer.appendChild(p);
        });
        
        for(let i = 0; i < 5; i++) {
          const sparkle = document.createElement('span');
          sparkle.className = 'sparkle';
          sparkle.textContent = '✨';
          sparkle.style.top = `${Math.random() * 100}%`;
          sparkle.style.left = `${Math.random() * 100}%`;
          sparkle.style.animationDelay = `${Math.random() * 2}s`;
          storyContainer.appendChild(sparkle);
        }

        const startQuizBtn = document.createElement('button');
        startQuizBtn.className = 'btn submit-btn fx-bounce-in-down';
        startQuizBtn.textContent = 'Commencer le quiz';
        startQuizBtn.style.marginTop = '2rem';
        startQuizBtn.addEventListener('click', () => startStoryQuiz(storyIndex));
        
        content.appendChild(storyContainer);
        content.appendChild(startQuizBtn);
        
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux contes', showStoryMenu);
    }
    
    function startStoryQuiz(storyIndex) {
        const story = magicStories[storyIndex];
        document.body.classList.add('story-quiz-active');
        gameState.storyQuiz = story.quiz;
        gameState.currentQuestionIndex = 0;
        gameState.questionSkillTag = resolveSkillTag('stories');
        gameState.questionStartTime = performance.now();
        gameState.historyTracker?.startGame('stories', storyIndex + 1, {
            skillTag: gameState.questionSkillTag,
            storyTitle: story.title
        });
        loadQuizQuestion();
    }
    
    function loadQuizQuestion() {
        document.body.classList.add('stage-controls-visible');
        if (gameState.currentQuestionIndex >= gameState.storyQuiz.length) {
            showQuizResults();
            return;
        }
        
        content.innerHTML = '';
        const questionData = gameState.storyQuiz[gameState.currentQuestionIndex];
        gameState.questionSkillTag = questionData?.metaSkill || gameState.questionSkillTag || resolveSkillTag('stories');
        gameState.questionStartTime = performance.now();
        const fragment = document.createDocumentFragment();
        
        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = `Question ${gameState.currentQuestionIndex + 1} / ${gameState.storyQuiz.length}<br>${questionData.question}`;
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: questionData.question,
            ariaLabel: 'Écouter la question du conte'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        fragment.appendChild(promptWrapper);
        speakText(questionData.question);
        updateProgressTracker(gameState.currentQuestionIndex + 1, gameState.storyQuiz.length);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        
        const shuffledOptions = shuffle([...questionData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.1 + 0.5}s`;
            const originalIndex = questionData.options.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleStoryQuizAnswer);
            applyOptionContent(optionEl, opt, i);
            optionsContainer.appendChild(optionEl);
        });
        fragment.appendChild(optionsContainer);
        content.appendChild(fragment);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux contes', showStoryMenu);
    }
    
    function handleStoryQuizAnswer(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleStoryQuizAnswer));
        
        const questionData = gameState.storyQuiz[gameState.currentQuestionIndex];
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = questionData.correct;
        const correctValue = questionData.options[correctAnswerIndex];

        const isCorrect = !Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex;

        if (isCorrect) {
            selectedOption.classList.add('correct');
            userProgress.userScore.stars += 15;
            userProgress.userScore.coins += 10;
            showSuccessMessage('Bonne réponse !');
            showFireworks();
        } else {
            selectedOption.classList.add('wrong');
            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            const explanation = questionData.explanation ? questionData.explanation : 'Mauvaise réponse.';
            showErrorMessage(explanation, correctValue);
        }
        const elapsed = gameState.questionStartTime ? performance.now() - gameState.questionStartTime : 0;
        gameState.historyTracker?.recordQuestion(gameState.questionSkillTag || resolveSkillTag('stories'), { correct: isCorrect, timeMs: elapsed });
        updateUI();
        saveProgress();
        
        setTimeout(() => {
            gameState.currentQuestionIndex++;
            loadQuizQuestion();
        }, 2000);
    }

    function showQuizResults() {
        content.innerHTML = '';
        clearProgressTracker();
        const activeSetBefore = getActiveStorySet();
        const completedStory = activeSetBefore?.stories?.[gameState.currentStoryIndex];
        if (completedStory) {
            markStoryAsCompleted(completedStory);
        }
        const unlockedNewSet = advanceStorySetIfNeeded();
        if (unlockedNewSet) {
            gameState.currentStoryIndex = 0;
            saveProgress();
        }
        const prompt = document.createElement('div');
        prompt.className = 'prompt ok fx-pop';
        let promptMessage = 'Quiz terminé ! 🎉<p>Tu as gagné des étoiles et des pièces !</p>';
        if (unlockedNewSet) {
            promptMessage += '<p>Nouvelle série de contes débloquée ✨</p>';
        }
        prompt.innerHTML = promptMessage;
        content.appendChild(prompt);

        gameState.historyTracker?.endGame({
            status: 'completed',
            topic: 'stories',
            storyIndex: gameState.currentStoryIndex
        });

        const backBtn = document.createElement('button');
        backBtn.className = 'btn submit-btn fx-bounce-in-down';
        backBtn.textContent = 'Retourner aux contes';
        backBtn.addEventListener('click', showStoryMenu);
        content.appendChild(backBtn);

        speakText('Quiz terminé ! Bravo !');
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    function ensureSkyElements() {
        if (document.getElementById('sky-elements')) {
            return;
        }
        const sky = document.createElement('div');
        sky.id = 'sky-elements';
        sky.className = 'sky-elements';
        sky.innerHTML = `
            <div class="shooting-star"></div>
            <div class="shooting-star"></div>
            <div class="shooting-star"></div>`;
        document.body.appendChild(sky);
    }

    function showMemoryGameMenu() {
      clearProgressTracker();
      content.innerHTML = '';

      const title = document.createElement('div');
      title.className = 'question-prompt fx-bounce-in-down';
      title.textContent = 'Choisis un niveau de mémoire';
      content.appendChild(title);

      const levelsGrid = document.createElement('div');
      levelsGrid.className = 'options-grid';
      MEMORY_GAME_LEVELS.forEach(levelConfig => {
        const btn = document.createElement('button');
        btn.className = 'topic-btn fx-bounce-in-down';
        btn.innerHTML = `Niveau ${levelConfig.level}<br>${levelConfig.pairs} paires`;
        btn.style.animationDelay = `${Math.random() * 0.5}s`;
        btn.addEventListener('click', () => showMemoryGame(levelConfig));
        levelsGrid.appendChild(btn);
      });
      content.appendChild(levelsGrid);

      btnLogros.style.display = 'inline-block';
      btnLogout.style.display = 'inline-block';
      configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    function showMemoryGame(levelConfig) {
        document.body.classList.add('stage-controls-visible');
        const { pairs: pairsCount, timeLimit, traps: trapCount } = levelConfig;
        let timerId = null;
        let timeLeft = timeLimit;
        content.innerHTML = '';
        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = 'Trouve toutes les paires !';
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: 'Trouve toutes les paires !',
            ariaLabel: 'Écouter les instructions du jeu de mémoire'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        content.appendChild(promptWrapper);
        speakText('Trouve toutes les paires !');
        updateProgressTracker(0, pairsCount);

        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'memory-timer';
        if (timeLimit) {
            content.appendChild(timerDisplay);
        }

        const memoryGrid = document.createElement('div');
        memoryGrid.className = 'memory-grid';
        if (levelConfig.grid) {
          const gridParts = levelConfig.grid.split('x').map(Number);
          const columns = gridParts.length > 1 && !Number.isNaN(gridParts[1]) ? gridParts[1] : Math.sqrt(pairsCount * 2);
          memoryGrid.style.gridTemplateColumns = `repeat(${Math.round(columns)}, 1fr)`;
        }
        content.appendChild(memoryGrid);

        const cardEmojis = Object.values(emoji).slice(6, 6 + pairsCount);
        const trapEmojis = ['💣', '💥', '🔥', '⚡️', '👻', '💀'].slice(0, trapCount);
        const gameCardsData = shuffle([
            ...cardEmojis.map(e => ({ emoji: e, type: 'pair' })),
            ...cardEmojis.map(e => ({ emoji: e, type: 'pair' })),
            ...trapEmojis.map(e => ({ emoji: e, type: 'trap' }))
        ]);

        let flippedCards = [];
        let matchedPairs = 0;
        let lockBoard = false;

        gameCardsData.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card fx-bounce-in-down';
            card.style.animationDelay = `${index * 0.05}s`;
            card.innerHTML = `<span style="opacity:0;">${cardData.emoji}</span>`;
            card.addEventListener('click', () => flipCard(card, cardData, index)); // Corrected to use cardData from the loop
            memoryGrid.appendChild(card);
        });

        if (timeLimit) {
            timerId = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    memoryGrid.classList.add('disabled');
                    showErrorMessage('Temps écoulé ! Essaie encore.', '');
                    setTimeout(() => showLevelMenu('memory'), 2000);
                }
            }, 1000);
        }

        function cleanupGame() {
            if (timerId) {
                clearInterval(timerId);
            }
        }

        function flipCard(card, cardData, index) {
            if (lockBoard) return;
            if (card.classList.contains('flipped')) return;

            card.classList.add('flipped');
            card.querySelector('span').style.opacity = '1';

            if (cardData.type === 'trap') {
                lockBoard = true;
                card.classList.add('matched', 'wrong');
                playSound('wrong');
                showErrorMessage('Oh non, une carte piège !', '');
                // userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 10); // Penalización desactivada
                if (timeLimit) timeLeft = Math.max(0, timeLeft - 5);
                updateUI();
                setTimeout(() => { lockBoard = false; }, 800);
                return;
            }

            flippedCards.push({ card, emoji: cardData.emoji, index });

            if (flippedCards.length === 2) {
                lockBoard = true;
                const [card1, card2] = flippedCards;
                if (card1.emoji === card2.emoji) {
                    card1.card.classList.add('matched');
                    card2.card.classList.add('matched');
                    matchedPairs++;
                    updateProgressTracker(matchedPairs, pairsCount);
                    userProgress.userScore.stars += 20;
                    userProgress.userScore.coins += 10;
                    playSound('correct');
                    updateUI(); // Llamada a updateUI()
                    saveProgress();
                    flippedCards = [];
                    lockBoard = false;
                    if (matchedPairs === pairsCount) {
                        cleanupGame();
                        clearProgressTracker();
                        userProgress.answeredQuestions[`memory-${gameState.currentLevel}`] = 'completed';
                        saveProgress();
                        showSuccessMessage('🦄 Toutes les paires trouvées !');
                        showFireworks();
                        setTimeout(() => showLevelMenu('memory'), 2000);
                    }
                } else {
                    setTimeout(() => {
                        card1.card.classList.remove('flipped');
                        card2.card.classList.remove('flipped');
                        card1.card.querySelector('span').style.opacity = '0';
                        card2.card.querySelector('span').style.opacity = '0';
                        flippedCards = [];
                        lockBoard = false;
                        // userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5); // Penalización desactivada
                        playSound('wrong');
                        updateUI(); // Llamada a updateUI()
                        saveProgress();
                        showErrorMessage('Mauvaise réponse.', `Il fallait trouver une paire de ${card1.emoji}`);
                    }, 1000);
                }
            }
        }
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux de mémoire', () => {
            cleanupGame();
            showMemoryGameMenu();
        });
    }
    
    /**
     * Muestra el juego de ordenar.
     * @param {number} level El nivel de dificultad.
     */
    function showSortingGame(level) {
        document.body.classList.add('stage-controls-visible');
        gameState.currentLevel = level;
        content.innerHTML = '';
        updateUI();

        const levelData = sortingLevels.find(entry => entry.level === level) || sortingLevels[sortingLevels.length - 1];
        const reward = { stars: 12 + level * 2, coins: 8 + Math.max(0, level - 1) * 2 };

        const container = document.createElement('div');
        container.className = 'sorting-container fx-bounce-in-down';

        const instructionWrapper = document.createElement('div');
        instructionWrapper.className = 'prompt-with-audio';

        const instruction = document.createElement('p');
        instruction.className = 'question-prompt';
        instruction.textContent = level === 1
            ? `${levelData.instruction} Glisse-les et lâche-les dans le bon panier.`
            : levelData.instruction;
        instructionWrapper.appendChild(instruction);

        const audioBtn = createAudioButton({
            text: instruction.textContent,
            ariaLabel: 'Écouter les instructions de tri'
        });
        if (audioBtn) {
            instructionWrapper.appendChild(audioBtn);
        }

        container.appendChild(instructionWrapper);
        speakText(instruction.textContent);

        const zonesWrapper = document.createElement('div');
        zonesWrapper.className = 'sorting-zones';

        const feedbackBubble = document.createElement('div');
        feedbackBubble.className = 'sorting-feedback is-hidden';
        feedbackBubble.setAttribute('role', 'status');
        feedbackBubble.setAttribute('aria-live', 'polite');

        const pool = document.createElement('div');
        pool.className = 'sorting-pool';
        pool.dataset.zone = 'pool';

        const dropzones = [];
        levelData.categories.forEach(category => {
            const bin = document.createElement('div');
            bin.className = 'sorting-bin';

            const header = document.createElement('div');
            header.className = 'sorting-bin-header';
            header.textContent = category.label;
            bin.appendChild(header);

            const dropzone = document.createElement('div');
            dropzone.className = 'sorting-dropzone';
            dropzone.dataset.category = category.id;
            bin.appendChild(dropzone);
            zonesWrapper.appendChild(bin);
            dropzones.push(dropzone);
        });

        container.appendChild(zonesWrapper);
        container.appendChild(feedbackBubble);

        const tokens = [];
        const uniqueSuffix = Date.now();
        levelData.items.forEach((item, index) => {
            const token = document.createElement('div');
            token.className = 'sorting-token fx-pop';
            token.textContent = `${item.emoji} ${item.label}`;
            token.draggable = true;
            token.dataset.target = item.target;
            token.dataset.id = `${item.id}-${uniqueSuffix}-${index}`;
            enableSortingToken(token);
            pool.appendChild(token);
            tokens.push(token);
        });

        updateProgressTracker(0, tokens.length);

        container.appendChild(pool);
        content.appendChild(container);

        const allZones = [pool, ...dropzones];
        allZones.forEach(zone => enableSortingDropzone(zone));

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu('sorting'));

        function enableSortingToken(token) {
            token.addEventListener('dragstart', () => {
                token.classList.add('is-dragging');
            });
            token.addEventListener('dragend', () => {
                token.classList.remove('is-dragging');
            });
        }

        function enableSortingDropzone(zone) {
            zone.addEventListener('dragenter', event => {
                event.preventDefault();
                zone.classList.add('is-target');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('is-target');
            });
            zone.addEventListener('dragover', event => {
                event.preventDefault();
            });
            zone.addEventListener('drop', event => {
                event.preventDefault();
                zone.classList.remove('is-target');
                const tokenId = event.dataTransfer ? event.dataTransfer.getData('text/plain') : undefined;
                let token;
                if (tokenId) {
                    token = document.querySelector(`[data-id="${tokenId}"]`);
                }
                if (!token) {
                    token = document.querySelector('.sorting-token.is-dragging');
                }
                if (!token) { return; }

                if (zone.dataset.zone === 'pool') {
                    pool.appendChild(token);
                    token.classList.remove('is-correct');
                    updateCompletionState();
                    return;
                }

                const expected = zone.dataset.category;
                const actual = token.dataset.target;
                if (expected === actual) {
                    zone.appendChild(token);
                    token.classList.add('is-correct', 'sorting-token-pop');
                    playSound('correct');
                    showSortingFeedback('positive', 'Bravo !');
                    setTimeout(() => token.classList.remove('sorting-token-pop'), 320);
                    updateCompletionState();
                } else {
                    zone.classList.add('sorting-bin-error');
                    playSound('wrong');
                    showSortingFeedback('negative', "Oups, essaie une autre catégorie.");
                    setTimeout(() => {
                        zone.classList.remove('sorting-bin-error');
                        pool.appendChild(token);
                        token.classList.remove('is-correct');
                        updateCompletionState();
                    }, 420);
                }
            });
        }

        function showSortingFeedback(type, message) {
            clearTimeout(feedbackBubble._timerId);
            feedbackBubble.textContent = message;
            feedbackBubble.classList.remove('is-hidden', 'is-positive', 'is-negative');
            feedbackBubble.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
            feedbackBubble._timerId = setTimeout(() => hideSortingFeedback(), 1800);
        }

        function hideSortingFeedback() {
            feedbackBubble.textContent = '';
            feedbackBubble.classList.add('is-hidden');
            feedbackBubble.classList.remove('is-positive', 'is-negative');
        }

        function updateCompletionState() {
            const correctCount = tokens.filter(token => token.parentElement && token.parentElement.dataset && token.parentElement.dataset.category === token.dataset.target).length;
            updateProgressTracker(correctCount, tokens.length);
            const allPlaced = correctCount === tokens.length;
            if (allPlaced && tokens.every(token => token.classList.contains('is-correct'))) {
                hideSortingFeedback();
                rewardPlayer();
            } else {
                markLevelInProgress();
            }
        }

        function markLevelInProgress() {
            userProgress.answeredQuestions[`sorting-${gameState.currentLevel}`] = 'in-progress';
            saveProgress();
        }

        function rewardPlayer() {
            showSuccessMessage('Classement parfait ! ✨');
            showFireworks();
            const reward = { stars: 10, coins: 5 }; // Default reward
            userProgress.userScore.stars += reward.stars;
            userProgress.userScore.coins += reward.coins;
            userProgress.answeredQuestions[`sorting-${gameState.currentLevel}`] = 'completed';
            saveProgress();
            updateUI();
            clearProgressTracker();
            setTimeout(() => {
                if (gameState.currentLevel < sortingLevels.length) {
                    showSortingGame(gameState.currentLevel + 1);
                } else {
                    showLevelMenu('sorting');
                }
            }, 1600);
        }

        // Préparer les données de transfert pour le glisser-déposer (nécessaire pour certains navigateurs)
        content.addEventListener('dragstart', event => {
            if (event.target && event.target.classList.contains('sorting-token')) {
                event.dataTransfer.setData('text/plain', event.target.dataset.id);
            }
        });
    }
    
    /**
     * Muestra el juego de adivinanzas.
     */
    function showRiddleGame() {
        document.body.classList.remove('stage-controls-visible');
        gameState.currentTopic = 'riddles';
        showLevelMenu(gameState.currentTopic);
    }
    
    function launchRiddleLevel(level) {
        gameState.currentTopic = 'riddles';
        document.body.classList.add('stage-controls-visible');
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        gameState.currentRiddleLevelIndex = Math.max(0, Math.min(riddleLevels.length, level) - 1);
        const levelData = riddleLevels[gameState.currentRiddleLevelIndex];
        gameState.currentLevel = levelData?.level || level;
        gameState.currentQuestionIndex = 0;
        userProgress.answeredQuestions[`riddles-${gameState.currentLevel}`] = 'in-progress';
        saveProgress();
        loadRiddleQuestion(0);
    }

    function loadRiddleQuestion(questionIndex = 0) { // This should use gameState.currentRiddleLevelIndex
        document.body.classList.add('stage-controls-visible');
        const levelData = riddleLevels[gameState.currentRiddleLevelIndex];
        if (!levelData) {
            showLevelMenu('riddles');
            return;
        }

        const questions = levelData.questions || [];
        if (questionIndex >= questions.length) {
            completeRiddleLevel(levelData);
            return;
        }

        gameState.currentQuestionIndex = questionIndex;
        const riddleData = questions[questionIndex];

        content.innerHTML = '';
        updateUI();

        const wrapper = document.createElement('div');
        wrapper.className = 'riddle-wrapper fx-bounce-in-down';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = `Niveau ${levelData.level} — ${levelData.theme}`;
        wrapper.appendChild(title);

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const promptText = document.createElement('p');
        promptText.className = 'riddle-prompt';
        promptText.textContent = riddleData.prompt;
        promptWrapper.appendChild(promptText);

        const audioBtn = createAudioButton({
            text: riddleData.prompt,
            ariaLabel: 'Écouter l\'énigme'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        wrapper.appendChild(promptWrapper);
        speakText(riddleData.prompt);
        updateProgressTracker(gameState.currentQuestionIndex + 1, questions.length);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';

        const shuffledOptions = shuffle([...riddleData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option riddle-option fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.08 + 0.4}s`;
            const originalIndex = riddleData.options.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleRiddleAnswer);
            applyOptionContent(optionEl, opt, i);
            optionsContainer.appendChild(optionEl);
        });

        wrapper.appendChild(optionsContainer);
        content.appendChild(wrapper);

        configureBackButton('Retour aux niveaux', () => showLevelMenu('riddles'));
    }

    function completeRiddleLevel(levelData) {
        userProgress.answeredQuestions[`riddles-${levelData.level}`] = 'completed';
        saveProgress();
        showSuccessMessage(levelData.completionMessage || 'Niveau terminé !'); // Mensaje de éxito
        showConfetti();
        updateProgressTracker(levelData.questions.length, levelData.questions.length);
        setTimeout(() => {
            clearProgressTracker();
            showLevelMenu('riddles');
        }, 1600);
    }

    function handleRiddleAnswer(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleRiddleAnswer));

        const levelData = riddleLevels[gameState.currentRiddleLevelIndex];
        const questions = levelData.questions || [];
        const riddleData = questions[gameState.currentQuestionIndex];
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = riddleData.answer;
        const correctValue = riddleData.options[correctAnswerIndex];

        if (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex) {
            selectedOption.classList.add('correct');
            selectedOption.classList.add('riddle-correct-glow');
            userProgress.userScore.stars += riddleData.reward?.stars || (10 + levelData.level);
            userProgress.userScore.coins += riddleData.reward?.coins || (6 + Math.floor(levelData.level / 2));
            showSuccessMessage(riddleData.success || 'Bonne réponse !');
            showConfetti();
        } else { // Respuesta incorrecta
            selectedOption.classList.add('wrong');
            selectedOption.classList.add('riddle-wrong-glow');
            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
                correctOption.classList.add('riddle-correct-glow');
            }
            const hint = riddleData.hint ? ` Conseil : ${riddleData.hint}` : '';
            showErrorMessage('Mauvaise réponse.', `${correctValue}. ${hint}`);
        }

        updateUI();
        saveProgress();

        setTimeout(() => {
            if (gameState.currentQuestionIndex + 1 < questions.length) {
                loadRiddleQuestion(gameState.currentQuestionIndex + 1);
            } else {
                completeRiddleLevel(levelData);
            }
        }, 1600);
    }
    
    // --- NOUVEAUX JEUX ---

    function showVowelGame() {
        document.body.classList.remove('stage-controls-visible');
        gameState.currentTopic = 'vowels';
        showLevelMenu(gameState.currentTopic);
    }
    
    function loadVowelQuestion(index) {
        document.body.classList.add('stage-controls-visible');
        if (index < 0 || index >= vowelLevels.length) {
            win();
            return;
        }

        const levelData = vowelLevels[index];
        gameState.currentLevel = levelData.level;
        gameState.currentQuestionIndex = index;
        gameState.currentVowelLevelData = null;
        gameState.questionSkillTag = resolveSkillTag('vowels');
        gameState.questionStartTime = performance.now();

        content.innerHTML = '';
        updateUI();

        const wrapper = document.createElement('div');
        wrapper.className = 'vowel-wrapper fx-bounce-in-down';

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = 'Quelle voyelle manque ?';
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: `${title.textContent}. ${levelData.hint}`,
            ariaLabel: 'Écouter la consigne des voyelles'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        wrapper.appendChild(promptWrapper);

        const display = document.createElement('div');
        display.className = 'vowel-display';
        const blanksCount = (levelData.masked.match(/_/g) || []).length;
        levelData.masked.split('').forEach(char => {
            const span = document.createElement('span');
            if (char === '_') {
                span.className = 'vowel-blank shimmer';
                span.textContent = '✨';
            } else {
                span.className = 'vowel-char';
                span.textContent = char;
            }
            display.appendChild(span);
        });
        wrapper.appendChild(display);

        const hint = document.createElement('p');
        hint.className = 'vowel-hint';
        hint.textContent = levelData.hint;
        wrapper.appendChild(hint);

        const feedbackBubble = document.createElement('div');
        feedbackBubble.className = 'vowel-feedback is-hidden';
        feedbackBubble.setAttribute('role', 'status');
        feedbackBubble.setAttribute('aria-live', 'polite');
        wrapper.appendChild(feedbackBubble);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'vowel-options';

        const buttons = [];
        const shuffledOptions = shuffle([...levelData.options]);
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'vowel-option fx-bounce-in-down';
            btn.dataset.value = opt;
            btn.textContent = opt.toUpperCase();
            btn.addEventListener('click', handleVowelAnswer);
            optionsContainer.appendChild(btn);
            buttons.push(btn);
        });
        wrapper.appendChild(optionsContainer);

        content.appendChild(wrapper);
        updateProgressTracker(index + 1, vowelLevels.length);
        speakText(`${title.textContent}. ${levelData.hint}`);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu('vowels'));
    
        gameState.currentVowelLevelData = {
            level: levelData.level,
            answer: levelData.answer,
            blanksCount,
            displayEl: display,
            buttons,
            feedbackEl: feedbackBubble
        };
        userProgress.answeredQuestions[`vowels-${gameState.currentLevel}`] = userProgress.answeredQuestions[`vowels-${gameState.currentLevel}`] || 'in-progress';
        saveProgress();
    }

    function handleVowelAnswer(event) {
        if (!gameState.currentVowelLevelData) { return; }

        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.vowel-option'));
        if (!selectedOption) { return; }

        gameState.currentVowelLevelData.buttons.forEach(btn => {
            btn.removeEventListener('click', handleVowelAnswer);
            btn.disabled = true;
        });

        const userAnswer = selectedOption.dataset.value;
        const expected = gameState.currentVowelLevelData.answer;
        const blanks = gameState.currentVowelLevelData.displayEl.querySelectorAll('.vowel-blank');

        const isCorrect = userAnswer && userAnswer.toLowerCase() === expected.toLowerCase();
        const elapsed = gameState.questionStartTime ? performance.now() - gameState.questionStartTime : 0;
        if (isCorrect) {
            fillVowelBlanks(blanks, userAnswer);
            gameState.currentVowelLevelData.displayEl.classList.add('is-complete');
            selectedOption.classList.add('correct', 'vowel-option-correct');
            showVowelFeedback('positive', 'Super !');
            userProgress.userScore.stars += 10 + gameState.currentLevel * 2;
            userProgress.userScore.coins += 10;
            userProgress.answeredQuestions[`vowels-${gameState.currentLevel}`] = 'completed';
            saveProgress();
            updateUI(); // Llamada a updateUI()
            showSuccessMessage('Bravo !');
            showConfetti();
            gameState.historyTracker?.recordQuestion(gameState.questionSkillTag || resolveSkillTag('vowels'), { correct: true, timeMs: elapsed });
            setTimeout(() => {
                gameState.currentVowelLevelData = null;
                if (gameState.currentQuestionIndex + 1 < vowelLevels.length) {
                    loadVowelQuestion(gameState.currentQuestionIndex + 1);
                } else {
                    gameState.historyTracker?.endGame({ status: 'completed', topic: 'vowels', level: gameState.currentLevel });
                    showLevelMenu('vowels');
                }
            }, 1600);
        } else {
            selectedOption.classList.add('wrong', 'vowel-option-wrong');
            gameState.currentVowelLevelData.displayEl.classList.add('is-error');
            showVowelFeedback('negative', 'Essaie encore !');
            userProgress.userScore.coins = Math.max(0, userProgress.userScore.coins - 5);
            userProgress.answeredQuestions[`vowels-${gameState.currentLevel}`] = 'in-progress';
            saveProgress();
            updateUI(); // Llamada a updateUI()
            gameState.historyTracker?.recordQuestion(gameState.questionSkillTag || resolveSkillTag('vowels'), { correct: false, timeMs: elapsed });
            showErrorMessage('Regarde bien les lettres.', expected);
            setTimeout(() => {
                gameState.currentVowelLevelData.displayEl.classList.remove('is-error');
                gameState.currentVowelLevelData.buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.addEventListener('click', handleVowelAnswer);
                    btn.classList.remove('vowel-option-wrong');
                });
                hideVowelFeedback();
                gameState.questionStartTime = performance.now();
            }, 1200);
        }
    }

    function isStoryCompletedForDisplay(story) {
        if (!story) { return false; }
        const activeSet = getActiveStorySet();
        return isStoryMarkedCompleted(story.id, activeSet?.id);
    }

    function markStoryAsCompleted(story) {
        if (!story) { return; }
        const activeSet = getActiveStorySet();
        markStoryCompletedById(story.id, activeSet.id);
        userProgress.answeredQuestions[`stories-${story.id}`] = 'completed';
        saveProgress();
    }

    function fillVowelBlanks(blanks, selection) {
        const chars = selection.split('');
        blanks.forEach((blank, index) => {
            const char = chars[index] || chars[chars.length - 1] || '';
            blank.textContent = char;
            blank.classList.add('is-filled');
            blank.classList.remove('shimmer');
        });
    }

    function showVowelFeedback(type, message) {
        if (!gameState.currentVowelLevelData || !gameState.currentVowelLevelData.feedbackEl) { return; }
        const bubble = gameState.currentVowelLevelData.feedbackEl;
        clearTimeout(bubble._timerId);
        bubble.textContent = message;
        bubble.classList.remove('is-hidden', 'is-positive', 'is-negative');
        bubble.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
        bubble._timerId = setTimeout(() => hideVowelFeedback(), 2200);
    }

    function hideVowelFeedback() {
        if (!gameState.currentVowelLevelData || !gameState.currentVowelLevelData.feedbackEl) { return; }
        const bubble = gameState.currentVowelLevelData.feedbackEl;
        clearTimeout(bubble._timerId);
        bubble.textContent = '';
        bubble.classList.add('is-hidden');
        bubble.classList.remove('is-positive', 'is-negative');
    }

    function showSequenceGame() {
        document.body.classList.remove('stage-controls-visible');
        gameState.currentTopic = 'sequences';
        showLevelMenu(gameState.currentTopic);
    }

    function loadSequenceQuestion(index) {
        document.body.classList.add('stage-controls-visible');
        if (index < 0 || index >= sequenceLevels.length) {
            win();
            return;
        }

        gameState.currentLevel = index + 1;
        gameState.currentQuestionIndex = index;
        const levelData = sequenceLevels[index];

        content.innerHTML = '';
        updateUI();

        const container = document.createElement('div');
        container.className = 'sequence-wrapper fx-bounce-in-down';

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = 'Quel est le prochain élément de la séquence ?';
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: title.textContent,
            ariaLabel: 'Écouter la consigne de la séquence'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        container.appendChild(promptWrapper);
        speakText(title.textContent);
        updateProgressTracker(gameState.currentLevel, sequenceLevels.length);

        const sequenceContainer = document.createElement('div');
        sequenceContainer.className = 'sequence-container';

        const blankSlot = document.createElement('div');
        blankSlot.className = 'sequence-slot';
        blankSlot.dataset.answer = levelData.answer;

        levelData.sequence.forEach(item => {
            if (item === '?') {
                const slot = blankSlot.cloneNode(true);
                sequenceContainer.appendChild(slot);
            } else {
                const itemEl = document.createElement('span');
                itemEl.className = 'sequence-item';
                itemEl.textContent = item;
                sequenceContainer.appendChild(itemEl);
            }
        });

        container.appendChild(sequenceContainer);

        const feedbackBubble = document.createElement('div');
        feedbackBubble.className = 'sequence-feedback is-hidden';
        feedbackBubble.setAttribute('role', 'status');
        feedbackBubble.setAttribute('aria-live', 'polite');
        container.appendChild(feedbackBubble);

        const pool = document.createElement('div');
        pool.className = 'sequence-pool';
        pool.dataset.zone = 'pool';

        const uniqueSuffix = Date.now();
        const tokens = levelData.options.map((option, i) => {
            const token = document.createElement('div');
            token.className = 'sequence-token fx-pop';
            token.textContent = option;
            token.draggable = true;
            token.dataset.value = option;
            token.dataset.id = `sequence-${index}-${i}-${uniqueSuffix}`;
            enableSequenceToken(token);
            pool.appendChild(token);
            return token;
        });

        container.appendChild(pool);
        content.appendChild(container);

        const dropzone = sequenceContainer.querySelector('.sequence-slot');
        enableSequenceDropzone(dropzone);
        enableSequenceDropzone(pool);

        // Click-to-place fallback for accessibility (in addition to drag & drop)
        tokens.forEach(token => {
            token.tabIndex = 0;
            token.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); token.click(); }
            });
            token.addEventListener('click', () => {
                // If token is in pool and dropzone empty, attempt placement
                const inPool = !!token.closest('.sequence-pool');
                const expected = dropzone.dataset.answer;
                const actual = token.dataset.value;
                if (inPool) {
                    if (!dropzone.classList.contains('is-filled')) {
                        if (expected === actual) {
                            dropzone.classList.add('is-filled', 'is-correct');
                            dropzone.classList.remove('is-wrong');
                            token.classList.add('is-correct', 'sequence-token-pop');
                            token.setAttribute('draggable', 'false');
                            dropzone.textContent = actual;
                            dropzone.appendChild(token);
                            playSound('correct');
                            showFeedback('positive', 'Super ! La séquence est complète.');
                            setTimeout(() => token.classList.remove('sequence-token-pop'), 320);
                            rewardSequence();
                        } else {
                            dropzone.classList.add('is-filled', 'is-wrong');
                            dropzone.classList.remove('is-correct');
                            playSound('wrong');
                            showFeedback('negative', 'Essaie encore !');
                            setTimeout(() => {
                                dropzone.textContent = '';
                                dropzone.classList.remove('is-filled', 'is-wrong');
                            }, 420);
                            markSequenceInProgress();
                        }
                    }
                } else {
                    // If token is already in dropzone, clicking returns it to pool
                    pool.appendChild(token);
                    token.classList.remove('is-correct');
                    token.setAttribute('draggable', 'true');
                    dropzone.classList.remove('is-filled', 'is-correct', 'is-wrong');
                    dropzone.textContent = '';
                    hideFeedback();
                    markSequenceInProgress();
                }
            });
        });

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu('sequences'));

        function enableSequenceToken(token) {
            token.addEventListener('dragstart', () => {
                token.classList.add('is-dragging');
            });
            token.addEventListener('dragend', () => {
                token.classList.remove('is-dragging');
            });
        }

        function enableSequenceDropzone(zone) {
            zone.addEventListener('dragenter', event => {
                event.preventDefault();
                zone.classList.add('is-target');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('is-target');
            });
            zone.addEventListener('dragover', event => {
                event.preventDefault();
            });
            zone.addEventListener('drop', event => {
                event.preventDefault();
                zone.classList.remove('is-target');
                const tokenId = event.dataTransfer ? event.dataTransfer.getData('text/plain') : undefined;
                let token;
                if (tokenId) {
                    token = document.querySelector(`[data-id="${tokenId}"]`);
                }
                if (!token) {
                    token = document.querySelector('.sequence-token.is-dragging');
                }
                if (!token) { return; }

                if (zone.dataset.zone === 'pool') {
                    pool.appendChild(token);
                    token.classList.remove('is-correct');
                    token.setAttribute('draggable', 'true');
                    dropzone.classList.remove('is-filled', 'is-correct', 'is-wrong');
                    dropzone.textContent = '';
                    hideFeedback();
                    markSequenceInProgress();
                    return;
                }

                const expected = zone.dataset.answer;
                const actual = token.dataset.value;
                zone.textContent = actual;

                if (expected === actual) {
                    zone.classList.add('is-filled', 'is-correct');
                    zone.classList.remove('is-wrong');
                    token.classList.add('is-correct', 'sequence-token-pop');
                    token.setAttribute('draggable', 'false');
                    zone.appendChild(token);
                    playSound('correct');
                    showFeedback('positive', 'Super ! La séquence est complète.');
                    setTimeout(() => token.classList.remove('sequence-token-pop'), 320);
                    rewardSequence();
                } else {
                    zone.classList.add('is-filled', 'is-wrong');
                    zone.classList.remove('is-correct');
                    playSound('wrong');
                    showFeedback('negative', 'Essaie encore !');
                    setTimeout(() => {
                        zone.textContent = '';
                        zone.classList.remove('is-filled', 'is-wrong');
                        pool.appendChild(token);
                        token.classList.remove('is-correct');
                        token.setAttribute('draggable', 'true');
                    }, 420);
                    markSequenceInProgress();
                }
            });
        }

        function showFeedback(type, message) {
            clearTimeout(feedbackBubble._timerId);
            feedbackBubble.textContent = message;
            feedbackBubble.classList.remove('is-hidden', 'is-positive', 'is-negative');
            feedbackBubble.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
            feedbackBubble._timerId = setTimeout(() => hideFeedback(), 2000);
        }

        function hideFeedback() {
            feedbackBubble.textContent = '';
            feedbackBubble.classList.add('is-hidden');
            feedbackBubble.classList.remove('is-positive', 'is-negative');
        }

        function rewardSequence() {
            hideFeedback();
            userProgress.userScore.stars += 12 + gameState.currentLevel * 2;
            userProgress.userScore.coins += 8 + gameState.currentLevel;
            userProgress.answeredQuestions[`sequences-${gameState.currentLevel}`] = 'completed';
            saveProgress();
            updateUI();
            showFireworks();
            clearProgressTracker();
            setTimeout(() => {
                if (gameState.currentLevel < sequenceLevels.length) {
                    loadSequenceQuestion(gameState.currentLevel);
                } else {
                    showLevelMenu('sequences');
                }
            }, 1400);
        }

        function markSequenceInProgress() {
            userProgress.answeredQuestions[`sequences-${gameState.currentLevel}`] = 'in-progress';
            saveProgress();
        }

        content.addEventListener('dragstart', event => {
            if (event.target && event.target.classList.contains('sequence-token')) {
                event.dataTransfer.setData('text/plain', event.target.dataset.id);
            }
        });
    }

    function win() {
        content.innerHTML = `<div class="question-prompt fx-pop">Tu as complété toutes les questions! 🎉</div>
                            <div class="prompt ok">Ton score final : ${userProgress.userScore.stars} étoiles et ${userProgress.userScore.coins} pièces.</div>`;
        speakText("Tu as complété toutes les questions! Félicitations pour ton score final.");
        clearProgressTracker();
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    // --- Start Game ---
    init();
});
