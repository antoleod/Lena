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
        console.log("Redirecting to /login");
        window.location.href = (window.resolveLenaPath ? window.resolveLenaPath('/login') : '/login')
        return;
    }

    const mathEngine = window.mathEngine || null;
    const t = (key, fallback, params) => (window.i18n?.t ? window.i18n.t(key, params) : fallback);
    const getLang = () => (window.i18n?.getLanguage ? window.i18n.getLanguage() : 'fr');
    const resolveText = (value) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const lang = getLang();
            if (value[lang]) return value[lang];
            if (value.fr) return value.fr;
            const fallback = Object.values(value).find(Boolean);
            return fallback || '';
        }
        return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    };
    const resolveArray = (arr) => Array.isArray(arr) ? arr.map(resolveText) : [];
    const COIN_PENALTY_ENABLED = false;
    const labelBackToTopics = () => t('menuBackToTopics', 'Retour aux sujets');
    const labelBackToMenu = () => t('menuBackToMenu', 'Retour au menu principal');
    const labelBackToLevels = () => t('menuBackToLevels', 'Retour aux niveaux');
    const labelBackToStories = () => t('menuBackToStories', 'Retour aux contes');
    const labelBackToMemory = () => t('menuBackToMemoryLevels', 'Retour aux niveaux de mémoire');
    const applyCoinPenalty = () => {
        // Penalizations are disabled (positive reinforcement only).
        return;
    };

    function generateMathQuestion(type, level) {
        if (mathEngine && typeof mathEngine.generateQuestion === 'function') {
            try {
                const generated = mathEngine.generateQuestion(type, level);
                if (generated) {
                    return normalizeMathQuestion(generated, type, level);
                }
            } catch (error) {
                console.warn('[mathEngine] Question generation failed, using legacy generator.', error);
            }
        }
        return legacyGenerateMathQuestion(type, level);
    }

    function normalizeMathQuestion(question, type, level) {
        if (!question || typeof question !== 'object') {
            return legacyGenerateMathQuestion(type, level);
        }
        const theme = MATH_OPERATION_THEMES[type] || MATH_OPERATION_THEMES.additions;
        const meta = Object.assign(
            {
                id: theme.id || type,
                icon: theme.icon,
                label: theme.label,
                accent: theme.accent,
                accentSoft: theme.accentSoft,
                storyline: theme.storylines ? theme.storylines[0] : theme.storyline,
                instruction: theme.instruction,
                optionIcons: theme.optionIcons || answerOptionIcons
            },
            question.operationMeta || {}
        );

        if (!meta.optionIcons || !meta.optionIcons.length) {
            meta.optionIcons = theme.optionIcons || answerOptionIcons;
        }

        const normalizedHints = Array.isArray(question.hints)
            ? question.hints.slice(0, 3)
            : [];

        const normalizedReward = question.reward || computeMathReward(type, level);

        return {
            ...question,
            difficulty: question.difficulty || level,
            metaSkill: question.metaSkill || TOPIC_SKILL_TAGS[type],
            reward: normalizedReward,
            operationMeta: meta,
            optionIcons: question.optionIcons || meta.optionIcons,
            hints: normalizedHints,
            encouragement: question.encouragement || theme.encouragement || 'Courage, essaie encore !'
        };
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
    let navBackBtn = document.getElementById('nav-back');
    let navBackLabel = navBackBtn?.querySelector('.lena-footer-btn__label') || null;
    const navBackDefaults = {
        label: navBackLabel?.textContent?.trim() || 'Retour'
    };
    const btnLogros = document.getElementById('btnLogros');
    const btnLogout = document.getElementById('btnLogout');
    // New header elements
    const userAvatarImg = document.getElementById('user-avatar-img');
    const userNameSpan = document.getElementById('user-name-span');
    const scoreStarsElements = [
        document.getElementById('scoreStars'),
        document.getElementById('stars')
    ].filter(Boolean);
    const scoreCoinsElements = [
        document.getElementById('scoreCoins'),
        document.getElementById('coins')
    ].filter(Boolean);
    const levelDisplay = document.getElementById('level');
    const btnReadMode = document.getElementById('btnReadMode');

    const LIBRARY_HASH = '#library';

    function ensureLibraryHash() {
        if ((window.location.hash || '').toLowerCase() === LIBRARY_HASH) {
            return;
        }
        if (window.history && typeof window.history.replaceState === 'function') {
            const targetUrl = `${window.location.pathname}${window.location.search}${LIBRARY_HASH}`;
            window.history.replaceState(null, '', targetUrl);
        } else {
            window.location.hash = LIBRARY_HASH;
        }
    }

    function clearLibraryHash() {
        if ((window.location.hash || '').toLowerCase() !== LIBRARY_HASH) {
            return;
        }
        if (window.history && typeof window.history.replaceState === 'function') {
            const targetUrl = `${window.location.pathname}${window.location.search}`;
            window.history.replaceState(null, '', targetUrl);
        } else {
            window.location.hash = '';
        }
    }

    function handleLibraryHashNavigation({ isInitial = false } = {}) {
        const hash = (window.location.hash || '').toLowerCase();
        if (hash === LIBRARY_HASH) {
            if (typeof showStoryMenu === 'function') {
                showStoryMenu();
            }
            return true;
        }
        if (!isInitial && document.body.classList.contains('story-menu-active') && typeof showTopicMenu === 'function') {
            clearLibraryHash();
            showTopicMenu();
        }
        return false;
    }

    function setDisplay(target, value) {
        if (target && target.style) {
            target.style.display = value;
        }
    }

    function ensureNavBackRefs() {
        const current = document.getElementById('nav-back');
        if (current && current !== navBackBtn) {
            navBackBtn = current;
            navBackLabel = null;
        } else if (!current) {
            navBackBtn = null;
            navBackLabel = null;
        }

        if (!navBackBtn) { return; }

        if (!navBackLabel || !navBackBtn.contains(navBackLabel)) {
            navBackLabel = navBackBtn.querySelector('.lena-footer-btn__label');
        }

        if (!navBackBtn.__navBackDefaultCaptured && navBackLabel) {
            const labelText = (navBackLabel.textContent || '').trim();
            if (labelText) {
                navBackDefaults.label = labelText;
            }
            navBackBtn.__navBackDefaultCaptured = true;
        }
    }

    // --- Audio Pre-loading ---
    const SOUND_ENABLED = false;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    const audioContext = SOUND_ENABLED && AudioCtor ? new AudioCtor() : null; // Se mantiene desactivado por defecto
    const soundBuffers = {};

    async function loadSound(name, url) {
        if (!SOUND_ENABLED || !audioContext) return;
        try {
            const response = await fetch(url);
            if (!response.ok) { throw new Error(`Failed to fetch ${url}: ${response.statusText}`); }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            soundBuffers[name] = audioBuffer;
        } catch (error) {
            console.warn(`Could not load sound: ${name}`, error);
        }
    }

    function playBufferedSound(name, volume = 1.0) {
        if (!SOUND_ENABLED || window.audioManager?.isMuted || !soundBuffers[name] || !audioContext) { return; }
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
    const LEVELS_PER_TOPIC = 13;
    const DEFAULT_QUESTIONS_PER_LEVEL = 7;
    const TOPIC_QUESTION_COUNTS = {
        additions: 12,
        soustractions: 12,
        multiplications: 12,
        divisions: 12,
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

const LEVEL_THEMES = {
    default: { icon: '✨', accent: '#8364ff', soft: 'rgba(131, 100, 255, 0.18)', strong: '#8364ff' },
    additions: { icon: '➕', accent: '#ff71c2', soft: 'rgba(255, 137, 210, 0.25)', strong: '#ff71c2' },
    soustractions: { icon: '➖', accent: '#ff9f68', soft: 'rgba(255, 175, 104, 0.25)', strong: '#ff9f68', iconColor: '#5b3100' },
    multiplications: { icon: '✖️', accent: '#8c5bff', soft: 'rgba(140, 91, 255, 0.25)', strong: '#8c5bff' },
    divisions: { icon: '➗', accent: '#44c2ff', soft: 'rgba(68, 194, 255, 0.25)', strong: '#44c2ff' },
    'number-houses': { icon: '🏠', accent: '#ffafcc', soft: 'rgba(255, 175, 204, 0.25)', strong: '#ff85b8' },
    colors: { icon: '🎨', accent: '#f6b73c', soft: 'rgba(246, 183, 60, 0.25)', strong: '#f6b73c', iconColor: '#5b3600' },
    sorting: { icon: '🧩', accent: '#9b5de5', soft: 'rgba(155, 93, 229, 0.25)', strong: '#9b5de5' },
    riddles: { icon: '🧠', accent: '#4cc9f0', soft: 'rgba(76, 201, 240, 0.25)', strong: '#4895ef' },
    vowels: { icon: '🔤', accent: '#f72585', soft: 'rgba(247, 37, 133, 0.25)', strong: '#f72585' },
    sequences: { icon: '🔗', accent: '#4895ef', soft: 'rgba(72, 149, 239, 0.25)', strong: '#4895ef' },
    stories: { icon: '📖', accent: '#ffadc6', soft: 'rgba(255, 173, 198, 0.25)', strong: '#ff85b5' },
    'puzzle-magique': { icon: '🧙', accent: '#9d4edd', soft: 'rgba(157, 78, 221, 0.25)', strong: '#7b2cbf' },
    repartis: { icon: '🗂️', accent: '#f8961e', soft: 'rgba(248, 150, 30, 0.25)', strong: '#f8961e', iconColor: '#5a3200' },
    dictee: { icon: '✏️', accent: '#ff6f91', soft: 'rgba(255, 111, 145, 0.25)', strong: '#ff6f91', iconColor: '#ffffff' },
    'math-blitz': { icon: '⚡', accent: '#ffd166', soft: 'rgba(255, 209, 102, 0.25)', strong: '#ffd166', iconColor: '#5f3c00' },
    'lecture-magique': { icon: '📚', accent: '#a29bfe', soft: 'rgba(162, 155, 254, 0.25)', strong: '#8479ff', iconColor: '#ffffff' },
    raisonnement: { icon: '🧠', accent: '#4cc9f0', soft: 'rgba(76, 201, 240, 0.25)', strong: '#4895ef' },
    'ecriture-cursive': { icon: '✍️', accent: '#fabc60', soft: 'rgba(250, 188, 96, 0.25)', strong: '#f77f00', iconColor: '#6b3a00' },
    'abaque-magique': { icon: '🧮', accent: '#3da9fc', soft: 'rgba(61, 169, 252, 0.25)', strong: '#0077b6', iconColor: '#ffffff' },
    'mots-outils': { icon: '🔠', accent: '#ff7aa2', soft: 'rgba(255, 122, 162, 0.25)', strong: '#ff4d8d', iconColor: '#ffffff' },
    'problems-magiques': { icon: '💡', accent: '#6a4c93', soft: 'rgba(106, 76, 147, 0.25)', strong: '#6a4c93', iconColor: '#ffffff' },
    'fractions-fantastiques': { icon: '🧮', accent: '#0fa3b1', soft: 'rgba(15, 163, 177, 0.25)', strong: '#0fa3b1', iconColor: '#ffffff' },
    'temps-horloges': { icon: '⏰', accent: '#ff8c42', soft: 'rgba(255, 140, 66, 0.25)', strong: '#ff8c42', iconColor: '#5f3c00' },
    'tables-defi': { icon: '🏆', accent: '#ffd166', soft: 'rgba(255, 209, 102, 0.25)', strong: '#e9a700', iconColor: '#5c4200' },
    'series-numeriques': { icon: '🔢', accent: '#4361ee', soft: 'rgba(67, 97, 238, 0.25)', strong: '#4361ee', iconColor: '#ffffff' },
    'mesures-magiques': { icon: '📏', accent: '#4cc9f0', soft: 'rgba(76, 201, 240, 0.25)', strong: '#4895ef', iconColor: '#ffffff' },
    'labyrinthe-logique': { icon: '🌀', accent: '#ffd166', soft: 'rgba(255, 209, 102, 0.25)', strong: '#ffb703', iconColor: '#5f4800' },
    'sudoku-junior': { icon: '🔲', accent: '#06d6a0', soft: 'rgba(6, 214, 160, 0.25)', strong: '#06d6a0', iconColor: '#ffffff' },
    'les-sorcieres': { icon: '🧙‍♀️', accent: '#9d4edd', soft: 'rgba(157, 78, 221, 0.25)', strong: '#7b2cbf', iconColor: '#ffffff' },
    'grammaire-magique': { icon: '📘', accent: '#8ecae6', soft: 'rgba(142, 202, 230, 0.25)', strong: '#219ebc', iconColor: '#1b4b63' },
    'conjugaison-magique': { icon: '📝', accent: '#ff9f1c', soft: 'rgba(255, 159, 28, 0.25)', strong: '#ff9f1c', iconColor: '#5f3b00' },
    'genres-accords': { icon: '⚖️', accent: '#ff95c5', soft: 'rgba(255, 149, 197, 0.25)', strong: '#ff6fb5', iconColor: '#ffffff' },
    'lecture-voix-haute': { icon: '🎤', accent: '#6a4c93', soft: 'rgba(106, 76, 147, 0.25)', strong: '#6a4c93', iconColor: '#ffffff' },
    'vocabulaire-thematique': { icon: '🗣️', accent: '#118ab2', soft: 'rgba(17, 138, 178, 0.25)', strong: '#118ab2', iconColor: '#ffffff' },
    'atelier-art': { icon: '🎨', accent: '#ff99c8', soft: 'rgba(255, 153, 200, 0.25)', strong: '#ff6f91', iconColor: '#ffffff' },
    'decouvre-nature': { icon: '🌳', accent: '#80ed99', soft: 'rgba(128, 237, 153, 0.25)', strong: '#57cc99', iconColor: '#1f6f3d' },
    'carte-monde': { icon: '🌍', accent: '#38a3a5', soft: 'rgba(56, 163, 165, 0.25)', strong: '#22577a', iconColor: '#e9f5ff' },
    'emotions-magiques': { icon: '💖', accent: '#ff7096', soft: 'rgba(255, 112, 150, 0.25)', strong: '#ff4d8d', iconColor: '#ffffff' },
    'missions-jour': { icon: '🚀', accent: '#ffd166', soft: 'rgba(255, 209, 102, 0.25)', strong: '#ffb703', iconColor: '#5f4400' },
    'quiz-jour': { icon: '❓', accent: '#8338ec', soft: 'rgba(131, 56, 236, 0.25)', strong: '#5f0fff', iconColor: '#ffffff' },
    'respire-repose': { icon: '🧘', accent: '#06d6a0', soft: 'rgba(6, 214, 160, 0.25)', strong: '#06d6a0', iconColor: '#0c5c3f' },
    'expression-soi': { icon: '🎭', accent: '#f4a261', soft: 'rgba(244, 162, 97, 0.25)', strong: '#f4a261', iconColor: '#5f3b1a' }
};

function resolveLevelTheme(topicId) {
    if (MATH_OPERATION_THEMES?.[topicId]) {
        const theme = MATH_OPERATION_THEMES[topicId];
        return {
            icon: theme.icon || LEVEL_THEMES.default.icon,
            accent: theme.accent || LEVEL_THEMES.default.accent,
            soft: theme.accentSoft || 'rgba(140, 91, 255, 0.22)',
            strong: theme.accent || LEVEL_THEMES.default.strong
        };
    }
    return LEVEL_THEMES[topicId] || LEVEL_THEMES.default;
}

    const completionMessages = [
        "Excellent travail, Léna !", "Tu es une vraie championne ! ✨", "Quelle performance incroyable !",
        "Bravo, tu as tout réussi ! 🦄", "Super, continue comme ça !", "Tu es sur la bonne voie ! 🚀",
        "Fantastique ! Tu as débloqué un nouveau succès.", "Impressionnant ! Rien ne t'arrête.",
        "Tu as un esprit vif comme l'éclair ! ⚡️", "Mission accomplie avec brio !",
        "Ton talent est éblouissant ! 🌟", "Félicitations, tu as maîtrisé ce niveau !",
        "Chaque bonne réponse te rend plus forte !", "Tu es une étoile montante ! 🌠"
    ];
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
            instruction: 'Additionne les deux nombres et choisis la bonne reponse.',
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
            instruction: 'Soustrais pour trouver ce qu il reste puis valide la reponse.',
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
            instruction: 'Multiplie les nombres et tape sur le bon produit.',
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
            instruction: 'Divise le tresor et selectionne le quotient juste.',
            storylines: [
                'Partage équitablement les pièces des pirates gentils.',
                'Répartis les trésors entre les explorateurs amis.',
                'Ouvre la porte magique en divisant correctement.'
            ]
        }
    };

    function buildAdditionConfigsFallback(count) {
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

    function buildSubtractionConfigsFallback(count) {
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

    function buildMultiplicationConfigsFallback(count) {
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

    function buildDivisionConfigsFallback(count) {
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

    const MATH_LEVEL_CONFIG = mathEngine ? {
        additions: mathEngine.getLevelConfig('additions'),
        soustractions: mathEngine.getLevelConfig('soustractions'),
        multiplications: mathEngine.getLevelConfig('multiplications'),
        divisions: mathEngine.getLevelConfig('divisions')
    } : {
        additions: buildAdditionConfigsFallback(LEVELS_PER_TOPIC),
        soustractions: buildSubtractionConfigsFallback(LEVELS_PER_TOPIC),
        multiplications: buildMultiplicationConfigsFallback(Math.max(LEVELS_PER_TOPIC, 12)),
        divisions: buildDivisionConfigsFallback(Math.max(LEVELS_PER_TOPIC, 12))
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
        'base-ten-build': 'math:base-ten-compose',
        'base-ten-subtract': 'math:base-ten-subtract',
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
    window.svgPath = svgDataUri; // Make available globally for other scripts like logicgames.js

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

    const TOPIC_LEVEL_RESOLVERS = {
        additions: () => MATH_LEVEL_CONFIG.additions.length,
        soustractions: () => MATH_LEVEL_CONFIG.soustractions.length,
        multiplications: () => MATH_LEVEL_CONFIG.multiplications.length,
        divisions: () => MATH_LEVEL_CONFIG.divisions.length,
        'base-ten-build': () => (window.baseTenBuildGame?.getLevelCount?.() || 10),
        'base-ten-subtract': () => (window.baseTenSubtractGame?.getLevelCount?.() || 10),
        'number-houses': () => LEVELS_PER_TOPIC,
        colors: () => LEVELS_PER_TOPIC,
        memory: () => (window.gameData?.MEMORY_GAME_LEVELS || []).length,
        sorting: () => sortingLevels.length,
        riddles: () => riddleLevels.length,
        vowels: () => vowelLevels.length,
        sequences: () => sequenceLevels.length,
        stories: () => {
            const active = magicStories?.length || 0;
            if (active > 0) { return active; }
            return storyCollections.reduce((max, set) => Math.max(max, (set?.stories?.length) || 0), 0);
        },
        'puzzle-magique': () => (window.puzzleMagiqueGame?.getLevelCount?.() || 10),
        'repartis': () => (window.repartisGame?.getLevelCount?.() || 15),
        dictee: () => 10,
        'math-blitz': () => (window.mathBlitzGame?.getLevelCount?.() || 10),
        'lecture-magique': () => 10,
        raisonnement: () => 10,
        'ecriture-cursive': () => 3,
        'abaque-magique': () => (window.abaqueMagiqueGame?.getLevelCount?.() || 10),
        'mots-outils': () => (window.motsOutilsGame?.getLevelCount?.() || 15),
        'problems-magiques': () => (window.problemsMagiquesGame?.getLevelCount?.() || 10),
        'fractions-fantastiques': () => (window.fractionsFantastiquesGame?.getLevelCount?.() || 10),
        'temps-horloges': () => (window.tempsHorlogesGame?.getLevelCount?.() || 10),
        'tables-defi': () => (window.tablesDefiGame?.getLevelCount?.() || 10),
        'series-numeriques': () => (window.seriesNumeriquesGame?.getLevelCount?.() || 10),
        'mesures-magiques': () => (window.mesuresMagiquesGame?.getLevelCount?.() || 10),
        'labyrinthe-logique': () => (window.logicGames?.getLevelCount?.('labyrinthe') || window.logicGames?.getLevelCount?.() || 12),
        'sudoku-junior': () => (window.logicGames?.getLevelCount?.('sudoku-junior') || window.logicGames?.getLevelCount?.() || 12),
        'grammaire-magique': () => 10,
        'conjugaison-magique': () => 10,
        'genres-accords': () => 10,
        'lecture-voix-haute': () => 10,
        'vocabulaire-thematique': () => 10,
        'atelier-art': () => 10,
        'decouvre-nature': () => 10,
        'carte-monde': () => 10,
        'emotions-magiques': () => (window.coeurEmotions?.getLevelCount?.() || 12),
        'missions-jour': () => (window.coeurEmotions?.getLevelCount?.() || 12),
        'quiz-jour': () => (window.coeurEmotions?.getLevelCount?.() || 12),
        'respire-repose': () => (window.coeurEmotions?.getLevelCount?.() || 12),
        'expression-soi': () => (window.coeurEmotions?.getLevelCount?.() || 12)
    };

    function getTopicLevelCount(topic) {
        const resolver = TOPIC_LEVEL_RESOLVERS[topic];
        let value;
        if (typeof resolver === 'function') {
            try {
                value = resolver();
            } catch (error) {
                console.warn('[levels] Failed to resolve level count for topic:', topic, error);
                value = LEVELS_PER_TOPIC;
            }
        } else if (typeof resolver === 'number') {
            value = resolver;
        } else {
            value = LEVELS_PER_TOPIC;
        }
        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric <= 0) {
            return LEVELS_PER_TOPIC;
        }
        return Math.max(1, Math.floor(numeric));
    }

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
        levelStartTime: null,
        questionSkillTag: null,
        historyTracker: null,
        currentStoryIndex: null,
        activeReviewSkills: [],
        pauseReminderTimeout: null,
        currentRiddleLevelIndex: 0,
        sessionPhase: 'initial',
        reviewQueue: [],
        reviewCursor: 0,
        reviewAttemptsRemaining: 0,
        initialQuestionCount: 0,
        activeQuestion: null,
    };

    let userProgress = {
        userScore: { stars: 0, coins: 0 },
        answeredQuestions: {},
        storyProgress: { activeSetIndex: 0, completed: {} },
        ownedItems: [],
        activeCosmetics: { background: null, badge: null },
        activeBadgeEmoji: null,
        bestTimes: {},
    };

    const QUESTION_TOPICS = new Set(['additions', 'soustractions', 'multiplications', 'divisions']);

    const autoPlayRuntime = (() => {
        let active = false;
        const waiters = new Map();
        const quizLoops = new Map();

        function keyFor(topic, level) {
            return `${topic}:${level}`;
        }

        function clearQuizLoop(key) {
            const timerId = quizLoops.get(key);
            if (timerId) {
                window.clearTimeout(timerId);
                quizLoops.delete(key);
            }
        }

        function resolveWaiters(key) {
            const resolvers = waiters.get(key);
            if (resolvers) {
                resolvers.forEach(resolve => {
                    try {
                        resolve();
                    } catch (error) {
                        console.warn('[autoplay] resolver failed', error);
                    }
                });
                waiters.delete(key);
            }
        }

        function start() {
            active = true;
            waiters.clear();
            quizLoops.forEach(id => window.clearTimeout(id));
            quizLoops.clear();
        }

        function stop() {
            if (!active) { return; }
            active = false;
            waiters.forEach(resolvers => {
                resolvers.forEach(resolve => {
                    try {
                        resolve();
                    } catch (error) {
                        console.warn('[autoplay] resolver failed on stop', error);
                    }
                });
            });
            waiters.clear();
            quizLoops.forEach(id => window.clearTimeout(id));
            quizLoops.clear();
        }

        function isActive() {
            return active;
        }

        function waitForLevel(topic, level) {
            const key = keyFor(topic, level);
            return new Promise(resolve => {
                if (!waiters.has(key)) {
                    waiters.set(key, new Set());
                }
                waiters.get(key).add(resolve);
            });
        }

        function signalLevelComplete(topic, level) {
            const key = keyFor(topic, level);
            resolveWaiters(key);
            clearQuizLoop(key);
        }

        function getDelay(label, defaultDelay) {
            if (!active) { return defaultDelay; }
            const minDelay = 35;
            return Math.max(minDelay, Math.min(defaultDelay, 140));
        }

        function driveQuiz(topic, level) {
            if (!active) { return; }
            const key = keyFor(topic, level);
            clearQuizLoop(key);
            const tick = () => {
                if (!active) {
                    clearQuizLoop(key);
                    return;
                }
                if (gameState.currentTopic !== topic || gameState.currentLevel !== level) {
                    clearQuizLoop(key);
                    return;
                }
                if (userProgress.answeredQuestions[`${topic}-${level}`] === 'completed') {
                    clearQuizLoop(key);
                    return;
                }
                const question = gameState.activeQuestion;
                if (question && typeof question.correct === 'number') {
                    const target = content.querySelector(`.option[data-index="${question.correct}"]`);
                    if (target && !target.disabled) {
                        target.click();
                    }
                }
                const id = window.setTimeout(tick, getDelay('quizTick', 120));
                quizLoops.set(key, id);
            };
            const id = window.setTimeout(tick, getDelay('quizStart', 80));
            quizLoops.set(key, id);
        }

        return {
            start,
            stop,
            isActive,
            waitForLevel,
            signalLevelComplete,
            getDelay,
            driveQuiz
        };
    })();

    // --- Initialization ---
    console.log("Initializing game for user:", userProfile.name);
    function init() {
        loadProgress();
        historyTracker = createHistoryTracker(userProfile.name);
        historyTracker.trackAppOpen();
        window.addEventListener('beforeunload', () => historyTracker.trackAppClose());
        schedulePauseReminder();
        initializeQuestions();
        setupSpeechSynthesis();
        document.addEventListener('lena:language:change', () => {
            preferredVoice = null;
            setupSpeechSynthesis();
            refreshLanguageView();
        });
        setupUI();
        setupEventListeners();
        showTopicMenu();
        const libraryHandled = handleLibraryHashNavigation({ isInitial: true });
        if (!libraryHandled) {
            setTimeout(() => launchTopicFromQuery(), 0);
        }
        // Pre-load sounds
    if (SOUND_ENABLED) {
        loadSound('correct', '../sonidos/correct.mp3');
        loadSound('wrong', '../sonidos/error.mp3');
        loadSound('coins', '../sonidos/bling.mp3');
        loadSound('hover', 'assets/sounds/bling.wav');
    }

    }

    function setupUI() {
        renderUserIdentity();
        setPrimaryTheme(userProfile.color);
        updateUI();
        applyActiveCosmetics();
    }

    function refreshLanguageView() {
        try {
            window.i18n?.apply?.(document);
        } catch (error) {
            console.warn('[i18n] apply failed', error);
        }

        if (document.body.classList.contains('story-menu-active')) {
            showStoryMenu();
            return;
        }

        if (document.body.classList.contains('stage-controls-visible')) {
            try {
                if (gameState.currentTopic && typeof loadQuestion === 'function' && allQuestions?.[gameState.currentTopic]) {
                    const index = Number.isFinite(gameState.currentQuestionIndex) ? gameState.currentQuestionIndex : 0;
                    loadQuestion(index);
                } else {
                    updateUI();
                }
            } catch (error) {
                console.warn('[i18n] Unable to refresh current question', error);
                updateUI();
            }
            return;
        }

        if (gameState.currentTopic) {
            if (gameState.currentTopic === 'dictee') {
                showDicteeMenu();
                return;
            }
            if (gameState.currentTopic === 'stories') {
                showStoryMenu();
                return;
            }
            if (gameState.currentTopic === 'memory') {
                showMemoryGameMenu();
                return;
            }
            showLevelMenu(gameState.currentTopic);
            return;
        }

        showTopicMenu();
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
        if (!userAvatarImg || !userNameSpan) return;

        const avatarMeta = getAvatarMetaLocal(userProfile.avatar?.id);
        const avatarIconUrl = userProfile.avatar?.iconUrl || avatarMeta?.iconUrl;
        const avatarName = userProfile.avatar?.name || avatarMeta?.name || 'Avatar';

        if (avatarIconUrl) {
            userAvatarImg.src = resolveAvatarIcon(avatarIconUrl);
            userAvatarImg.alt = avatarName;
            userAvatarImg.style.display = 'block';
        } else {
            userAvatarImg.style.display = 'none';
        }

        userNameSpan.textContent = userProfile.name || 'Explorateur';
    }

    function setPrimaryTheme(color) {
        const safeColor = color || userProfile.color || '#a890f0';
        document.documentElement.style.setProperty('--primary', safeColor);
        document.documentElement.style.setProperty('--primary-light', lightenColor(safeColor, 0.22));
        document.documentElement.style.setProperty('--primary-soft', lightenColor(safeColor, 0.4)); // Added this line
        document.documentElement.style.setProperty('--primary-contrast', getReadableTextColor(safeColor));
    }

    const menuBack = document.getElementById('menu-back');

    function setupEventListeners() {
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                gameState.historyTracker?.trackAppClose();
                localStorage.removeItem('mathsLenaUserProfile');
                window.location.href = (window.resolveLenaPath ? window.resolveLenaPath('/login') : '/login')
            });
        }
        if (btnLogros) {
            btnLogros.addEventListener('click', () => {
                window.location.href = (window.resolveLenaPath ? window.resolveLenaPath('/logros') : '/logros')
            });
        }

        if (btnReadMode) {
            btnReadMode.disabled = false;
            btnReadMode.addEventListener('click', () => {
                const isActive = document.body.classList.toggle('read-mode-active');
                btnReadMode.classList.toggle('active', isActive);
                btnReadMode.setAttribute('aria-pressed', isActive);
                showSuccessMessage(isActive ? 'Mode lecture activé' : 'Mode lecture désactivé');
            });
        }

        if (btnShop) {
            btnShop.addEventListener('click', () => {
                window.location.href = (window.resolveLenaPath ? window.resolveLenaPath('/boutique') : '/boutique') // Rediriger vers la boutique
            });
        }
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
                if (!triggerBackNavigation()) {
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
    
    function removeNavBackOverride() {
        ensureNavBackRefs();
        if (navBackBtn?.__customBackListener) {
            navBackBtn.removeEventListener('click', navBackBtn.__customBackListener, true);
            navBackBtn.__customBackListener = null;
        }
        if (navBackBtn) {
            navBackBtn.__customBackHandler = null;
        }
    }

    function clearBackButton() {
        if (btnBack) {
            btnBack.style.display = 'none';
            btnBack.textContent = t('menuBackToTopics', 'Retour');
            btnBack.onclick = null;
        }
        removeNavBackOverride();
        ensureNavBackRefs();
        if (navBackBtn) {
            navBackBtn.removeAttribute('data-back-active');
            if (navBackLabel && navBackDefaults.label) {
                navBackLabel.textContent = navBackDefaults.label;
            }
        }
    }

    function triggerBackNavigation() {
        if (btnBack && typeof btnBack.onclick === 'function') {
            try {
                btnBack.onclick();
                return true;
            } catch (error) {
                console.warn('[BackNavigation] Legacy back handler failed', error);
            }
        }
        ensureNavBackRefs();
        if (navBackBtn && typeof navBackBtn.__customBackHandler === 'function') {
            try {
                navBackBtn.__customBackHandler();
                return true;
            } catch (error) {
                console.warn('[BackNavigation] Footer back handler failed', error);
            }
        }
        return false;
    }
    
    function configureBackButton(label, handler) {
        const clickHandler = () => {
            saveProgress();
            gameState.historyTracker?.endGame({ status: 'interrompu' });
            if (gameState.currentTopic === 'review') {
                gameState.activeReviewSkills = [];
            }
            handler();
        };

        if (btnBack) {
            btnBack.style.display = 'inline-block';
            btnBack.textContent = label;
            btnBack.onclick = clickHandler;
        }

        ensureNavBackRefs();
        if (navBackBtn) {
            removeNavBackOverride();
            const navListener = (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                clickHandler();
            };
            navBackBtn.__customBackListener = navListener;
            navBackBtn.__customBackHandler = clickHandler;
            navBackBtn.addEventListener('click', navListener, true);
            navBackBtn.setAttribute('data-back-active', 'true');
            if (navBackLabel) {
                navBackLabel.textContent = label;
            }
        }
    }

    function markLevelCompleted(topic, level) {
        userProgress.answeredQuestions[`${topic}-${level}`] = 'completed';
        saveProgress();
        autoPlayRuntime.signalLevelComplete(topic, level);
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
            showConfetti: showFireworks, // Corregido para usar la nueva función
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('math-blitz', {
            // Pass the question generator to the game module
            generateMathQuestion: generateMathQuestion 
        });
        if (window.mathBlitzGame && typeof window.mathBlitzGame.start === 'function') {
            window.mathBlitzGame.start(context);
        } else {
            console.warn('Module Maths Sprint introuvable');
            showLevelMenu('math-blitz');
        }
    }

    function launchMesuresMagiques(level) {
        gameState.currentTopic = 'mesures-magiques';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('mesures-magiques');
        if (window.mesuresMagiquesGame?.start) {
            window.mesuresMagiquesGame.start(context);
        } else {
            showComingSoon('Mesures Magiques', '📏');
        }
    }

    function launchLectureMagiqueLevel(level) {
        gameState.currentTopic = 'lecture-magique';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('series-numeriques');
        if (window.seriesNumeriquesGame?.start) {
            window.seriesNumeriquesGame.start(context);
        } else {
            showComingSoon('Séries Numériques', '🔢');
        }
    }

    function launchCoeurEmotionsGame(topicId, level) {
        const titles = {
            'emotions-magiques': { label: 'Émotions Magiques', icon: '😊' },
            'missions-jour': { label: 'Missions du Jour', icon: '✅' },
            'quiz-jour': { label: 'Quiz du Jour', icon: '🌞' },
            'respire-repose': { label: 'Respire & Repose-toi', icon: '🧘' },
            'expression-soi': { label: 'Expression de Soi / Mon Journal', icon: '💬' }
        };
        gameState.currentTopic = topicId;
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext(topicId);
        if (window.coeurEmotions?.start) {
            window.coeurEmotions.start(topicId, context);
        } else {
            const meta = titles[topicId] || { label: 'Atelier bien-être', icon: '✨' };
            showComingSoon(meta.label, meta.icon);
        }
    }

    function launchRaisonnementLevel(level) {
        gameState.currentTopic = 'raisonnement';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        const resolvedTitle = resolveTopicLabel(gameTitle);
        const wrapper = document.createElement('div');
        wrapper.className = 'coming-soon-wrapper fx-bounce-in-down';

        const emoji = document.createElement('div');
        emoji.className = 'coming-soon-emoji';
        emoji.textContent = icon || '✨';
        wrapper.appendChild(emoji);

        const title = document.createElement('h2');
        title.className = 'coming-soon-title';
        title.textContent = resolvedTitle || gameTitle || t('comingSoonTitle', 'Bientôt');
        wrapper.appendChild(title);

        const message = document.createElement('p');
        message.className = 'coming-soon-message';
        message.textContent = t('comingSoonMessage', 'Ce jeu magique sera bientôt disponible !');
        wrapper.appendChild(message);

        content.appendChild(wrapper);
        configureBackButton(labelBackToTopics(), showTopicMenu);
    }

    function launchEcritureCursive(level) {
        gameState.currentTopic = 'ecriture-cursive';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('ecriture-cursive');
        if (window.ecritureCursiveGame && typeof window.ecritureCursiveGame.start === 'function') {
            window.ecritureCursiveGame.start(context);
        } else {
            showComingSoon('J’écris en cursive', '✍️');
        }
    }
    function launchAbaqueMagique(level) {
        gameState.currentTopic = 'abaque-magique';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('abaque-magique');
        if (window.abaqueMagiqueGame && typeof window.abaqueMagiqueGame.start === 'function') {
            window.abaqueMagiqueGame.start(context); // Le module gère maintenant ses propres niveaux
        } else {
            showComingSoon('Abaque Magique', '🔢');
        }
    }
    function launchBaseTenBuild(level) {
        gameState.currentTopic = 'base-ten-build';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('base-ten-build');
        if (window.baseTenBuildGame && typeof window.baseTenBuildGame.start === 'function') {
            window.baseTenBuildGame.start(level, context);
        } else {
            showComingSoon('Construis le nombre', '🧱');
        }
    }

    function launchBaseTenSubtract(level) {
        gameState.currentTopic = 'base-ten-subtract';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('base-ten-subtract');
        if (window.baseTenSubtractGame && typeof window.baseTenSubtractGame.start === 'function') {
            window.baseTenSubtractGame.start(level, context);
        } else {
            showComingSoon('Soustraire, c’est transformer', '🔁');
        }
    }
    function launchMotsOutils(level) {
        gameState.currentTopic = 'mots-outils';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('mots-outils');
        if (window.motsOutilsGame && typeof window.motsOutilsGame.start === 'function') {
            window.motsOutilsGame.start(context);
        } else {
            showComingSoon('Mots-Outils Magiques', '💬');
        }
    }

    function launchLesSorcieres(level) {
        gameState.currentTopic = 'les-sorcieres';
        gameState.currentLevel = level;
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        const context = createGameContext('les-sorcieres');
        if (window.lesSorcieresGame && typeof window.lesSorcieresGame.start === 'function') {
            window.lesSorcieresGame.start(context);
        } else {
            showComingSoon('Les Sorcières', '🧙‍♀️');
        }
    }
    // --- UI & Helpers ---
    let preferredVoice = null;
    const LANGUAGE_LOCALES = { fr: 'fr-FR', nl: 'nl-NL', en: 'en-GB', es: 'es-ES' };

    function resolveSpeechLang() {
        if (window.i18n?.getSpeechLang) {
            return window.i18n.getSpeechLang();
        }
        const lang = typeof window.storage?.getLanguage === 'function'
            ? window.storage.getLanguage()
            : null;
        return LANGUAGE_LOCALES[lang] || 'fr-FR';
    }

    function setupSpeechSynthesis() {
        if (!window.speechSynthesis) {
            return;
        }

        function findPreferredVoice() {
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) {
                console.warn('[Speech] La liste de voix est vide. La sélection est reportée.');
                return;
            }

            const targetLang = resolveSpeechLang();
            const baseLang = targetLang.split('-')[0];
            const voicePriorityByLang = {
                fr: [
                    { name: 'Google français', lang: 'fr-FR' },
                    { name: 'Microsoft Hortense - French (France)', lang: 'fr-FR' },
                    { name: 'Microsoft Julie, Natural - French (France)', lang: 'fr-FR' },
                    { name: 'Amelie', lang: 'fr-CA' },
                    { name: 'Thomas', lang: 'fr-FR' },
                    { name: 'fr-FR-Standard-D', lang: 'fr-FR' },
                    { name: 'fr-FR-Wavenet-A', lang: 'fr-FR' },
                    { name: 'fr-FR-Wavenet-E', lang: 'fr-FR' },
                    { name: 'Aurelie', lang: 'fr-FR' },
                    { name: 'Audrey', lang: 'fr-FR' }
                ]
            };

            const voicePriority = voicePriorityByLang[baseLang] || [];
            for (const priority of voicePriority) {
                const found = voices.find(voice => voice.name === priority.name && voice.lang === priority.lang);
                if (found) {
                    preferredVoice = found;
                    console.log(`[Speech] Voix sélectionnée: ${preferredVoice.name}`);
                    return;
                }
            }

            preferredVoice = voices.find(voice => voice.lang === targetLang)
                || voices.find(voice => voice.lang?.startsWith(baseLang))
                || null;
            if (preferredVoice) {
                console.log(`[Speech] Voix de secours sélectionnée: ${preferredVoice.name}`);
            } else {
                console.warn('[Speech] Aucune voix compatible trouvée.');
            }
        }

        if (speechSynthesis.getVoices().length > 0) {
            findPreferredVoice();
        } else if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = findPreferredVoice;
        } else {
            setTimeout(findPreferredVoice, 250);
        }
    }

    function speakText(text) {
        if (window.speechSynthesis) {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = resolveSpeechLang();
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            synth.speak(utterance);
        }
    }

    function playSound(type) {
        if (window.audioManager?.isMuted) { return; }

        if (SOUND_ENABLED) {
            const volumeMap = { correct: 0.7, wrong: 0.6, coins: 0.5 };
            playBufferedSound(type, volumeMap[type] ?? 0.6);
            return;
        }

        const legacyMap = {
            correct: window.soundCorrect,
            wrong: window.soundWrong,
            coins: window.soundCoins
        };
        const audio = legacyMap[type];
        if (!audio || typeof audio.play !== 'function') { return; }
        try {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            } else {
                audio.currentTime = 0;
            }
            audio.play().catch(() => {});
        } catch (error) {
            console.warn('[audio] playback failed', error);
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

    function limitOptionsToTwo(options, correctIndex) {
        if (!Array.isArray(options)) {
            return { options: [], correct: 0 };
        }
        if (options.length <= 2) {
            const safeIndex = typeof correctIndex === 'number'
                ? Math.max(0, Math.min(correctIndex, options.length - 1))
                : 0;
            return { options: options.slice(), correct: safeIndex };
        }
        const safeIndex = typeof correctIndex === 'number' && correctIndex >= 0 && correctIndex < options.length
            ? correctIndex
            : 0;
        const correctOption = options[safeIndex] ?? options[0];
        const distractors = options
            .map((value, idx) => ({ value, idx }))
            .filter(item => item.idx !== safeIndex);
        let chosenDistractor = distractors.length
            ? distractors[Math.floor(Math.random() * distractors.length)].value
            : null;
        if (chosenDistractor == null && options.length > 1) {
            chosenDistractor = options[safeIndex === 0 ? 1 : 0];
        }
        const limited = chosenDistractor == null ? [correctOption] : [correctOption, chosenDistractor];
        if (limited.length === 2 && Math.random() < 0.5) {
            limited.reverse();
        }
        const newCorrect = limited.indexOf(correctOption);
        return { options: limited, correct: Math.max(0, newCorrect) };
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
        textSpan.textContent = resolveText(value);

        element.appendChild(iconSpan);
        element.appendChild(textSpan);
    }

    function updateUI() {
        if (scoreStarsElements.length) {
            const value = userProgress.userScore.stars;
            scoreStarsElements.forEach(el => { el.textContent = value; });
        }
        if (scoreCoinsElements.length) {
            const value = userProgress.userScore.coins;
            scoreCoinsElements.forEach(el => { el.textContent = value; });
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

    function resolveTopicLabel(topicId) {
        const labelMap = {
            additions: t('itemAdditions', 'Additions'),
            soustractions: t('itemSubtractions', 'Soustractions'),
            multiplications: t('itemMultiplications', 'Multiplications'),
            divisions: t('itemDivisions', 'Divisions'),
            'base-ten-build': t('baseTenBuildTitle', 'Construis le nombre'),
            'base-ten-subtract': t('baseTenSubtractTitle', 'Soustraire, c’est transformer'),
            'math-blitz': t('itemMathSprint', 'Maths Sprint'),
            'lecture-magique': t('itemReading', 'Lecture Magique'),
            'mots-outils': t('itemToolWords', 'Mots-Outils'),
            'number-houses': t('itemNumberHouses', 'Maisons des Nombres'),
            'abaque-magique': t('itemAbacus', 'Abaque Magique'),
            'temps-horloges': t('itemTime', 'Temps & Horloges'),
            'fractions-fantastiques': t('itemFractions', 'Fractions Fantastiques'),
            stories: t('itemTales', 'Contes Magiques'),
            riddles: t('itemRiddles', 'Jeu d\'énigmes'),
            vowels: t('itemVowels', 'Jeu des Voyelles'),
            sequences: t('itemSequences', 'Jeu des Séquences'),
            memory: t('itemMemory', 'Mémoire Magique'),
            colors: t('itemColors', 'Les Couleurs'),
            dictee: t('itemDictation', 'Dictée Magique')
        };
        return labelMap[topicId] || topicId;
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
        const resolvedQuestion = resolveText(quiz.question);
        const resolvedOptions = resolveArray(quiz.options);
        const correctIndex = Number.isInteger(quiz.correct) ? quiz.correct : quiz.answer;
        const correctValue = resolvedOptions[correctIndex];
        return {
            questionText: `${resolveStoryTitle(story)} — ${resolvedQuestion}`,
            options: resolvedOptions,
            correct: correctIndex,
            explanation: t('storyReviewExplain', 'Souviens-toi de l\'histoire : {{answer}}.', { answer: correctValue })
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

    function showSuccessMessage(message) {
        // Si no se proporciona un mensaje, elige uno aleatorio de la lista de finalización.
        message = message || completionMessages[Math.floor(Math.random() * completionMessages.length)];
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
        playSound('wrong');
        setTimeout(() => promptEl.remove(), 2500);
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
        setTimeout(confetti, 500); // Add a small burst of regular confetti
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
      title.textContent = t('menuChooseLevel', 'Choisis un niveau de mémoire', { topic: t('itemMemory', 'Mémoire Magique') });
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

      setDisplay(btnLogros, 'inline-block');
      setDisplay(btnLogout, 'inline-block');
      configureBackButton(labelBackToMenu(), showTopicMenu);
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
                        // applyCoinPenalty(5); // Penalización desactivada
                        playBufferedSound('wrong');
                        updateUI(); // Llamada a updateUI()
                        saveProgress();
                        showErrorMessage('Mauvaise réponse.', `Il fallait trouver une paire de ${card1.emoji}`);
                    }, 1000);
                }
            }
        }
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToMemory(), () => {
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

        const resolvedInstruction = resolveText(levelData.instruction);
        const instruction = document.createElement('p');
        instruction.className = 'question-prompt';
        instruction.textContent = level === 1
            ? `${resolvedInstruction} ${t('sortingDragHint', 'Glisse-les et lâche-les dans le bon panier.')}`
            : resolvedInstruction;
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
            header.textContent = resolveText(category.label);
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
            token.textContent = `${item.emoji} ${resolveText(item.label)}`;
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

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToLevels(), () => showLevelMenu('sorting'));

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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        const resolvedTheme = resolveText(levelData.theme);
        const resolvedPrompt = resolveText(riddleData.prompt);
        const resolvedOptions = resolveArray(riddleData.options);

        content.innerHTML = '';
        updateUI();

        const wrapper = document.createElement('div');
        wrapper.className = 'riddle-wrapper fx-bounce-in-down';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = `Niveau ${levelData.level} — ${resolvedTheme}`;
        wrapper.appendChild(title);

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const promptText = document.createElement('p');
        promptText.className = 'riddle-prompt';
        promptText.textContent = resolvedPrompt;
        promptWrapper.appendChild(promptText);

        const audioBtn = createAudioButton({
            text: resolvedPrompt,
            ariaLabel: 'Écouter l\'énigme'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        wrapper.appendChild(promptWrapper);
        speakText(resolvedPrompt);
        updateProgressTracker(gameState.currentQuestionIndex + 1, questions.length);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';

        const shuffledOptions = shuffle([...resolvedOptions]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option riddle-option fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.08 + 0.4}s`;
            const originalIndex = resolvedOptions.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleRiddleAnswer);
            applyOptionContent(optionEl, opt, i);
            optionsContainer.appendChild(optionEl);
        });

        wrapper.appendChild(optionsContainer);
        content.appendChild(wrapper);

        configureBackButton(labelBackToLevels(), () => showLevelMenu('riddles'));
    }

    function completeRiddleLevel(levelData) {
        userProgress.answeredQuestions[`riddles-${levelData.level}`] = 'completed';
        saveProgress();
        showSuccessMessage(resolveText(levelData.completionMessage) || t('menuReviewDone', 'Niveau terminé !'));
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
        const resolvedOptions = resolveArray(riddleData.options);
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = riddleData.answer;
        const correctValue = resolvedOptions[correctAnswerIndex];

        if (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex) {
            selectedOption.classList.add('correct');
            selectedOption.classList.add('riddle-correct-glow');
            userProgress.userScore.stars += riddleData.reward?.stars || (10 + levelData.level);
            userProgress.userScore.coins += riddleData.reward?.coins || (6 + Math.floor(levelData.level / 2));
            showSuccessMessage(resolveText(riddleData.success) || t('riddleCorrect', 'Bonne réponse !'));
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            selectedOption.classList.add('riddle-wrong-glow');
            applyCoinPenalty(5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
                correctOption.classList.add('riddle-correct-glow');
            }
            const hintText = resolveText(riddleData.hint);
            const hint = hintText ? ` ${t('riddleHintPrefix', 'Conseil :')} ${hintText}` : '';
            showErrorMessage(t('riddleWrong', 'Mauvaise réponse.'), `${correctValue}.${hint}`);
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

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToLevels(), () => showLevelMenu('vowels'));
    
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
            applyCoinPenalty(5);
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

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToLevels(), () => showLevelMenu('sequences'));

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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToMenu(), showTopicMenu);
    }

    

    function ensureProgressTrackerElements() {
        const explicitLabel = document.getElementById('progress-label');
        let tracker = document.getElementById('progressTracker');

        if (!tracker) {
            if (!stageBottom) return { tracker: null, label: explicitLabel, fill: null, bar: null };

            tracker = document.createElement('div');
            tracker.id = 'progressTracker';
            tracker.className = 'progress-tracker';
            tracker.innerHTML = `
                <div class="progress-tracker__label"></div>
                <div class="progress-tracker__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div class="progress-tracker__fill"></div>
                </div>
            `;
            const footer = document.querySelector('[data-lena-footer]');
            if (footer) {
                footer.parentNode.insertBefore(tracker, footer);
            } else {
                document.body.appendChild(tracker);
            }
        }
        const bar = tracker.querySelector('.progress-tracker__bar');
        const fill = tracker.querySelector('.progress-tracker__fill');
        const fallbackLabel = tracker.querySelector('.progress-tracker__label');
        const resolvedLabel = explicitLabel || fallbackLabel;
        return { tracker, label: resolvedLabel, bar, fill };
    }

    function updateProgressTracker(current, total, isReview = false) {
        const { tracker, label, bar, fill } = ensureProgressTrackerElements();
        if (!tracker || !label || !fill || !bar) { return; }
        const safeTotal = Math.max(1, total);
        const currentQuestion = Math.min(Math.max(current, 0), safeTotal);
        const percent = Math.min(Math.max(Math.round((currentQuestion / safeTotal) * 100), 0), 100);
        if (label) {
            label.textContent = isReview
                ? `Repaso ${currentQuestion} / ${safeTotal}`
                : `Question ${currentQuestion} / ${safeTotal}`;
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
            if (mathEngine && typeof mathEngine.resetCache === 'function') {
                mathEngine.resetCache(type);
            }
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

    function legacyGenerateMathQuestion(type, level) {
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

        const inputA = resolveText(selectedMix.inputs[0]);
        const inputB = resolveText(selectedMix.inputs[1]);
        const resultText = resolveText(selectedMix.result);
        const questionText = t(
            'colorMixQuestion',
            `Quelle couleur apparaît quand on mélange ${inputA} + ${inputB} ?`,
            { a: inputA, b: inputB }
        );
        const optionsSet = new Set([resultText]);

        const distractorPool = shuffle(
            fallbackMixes
                .filter(mix => resolveText(mix.result) !== resultText)
                .map(mix => resolveText(mix.result))
        );
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
        const correctIndex = options.indexOf(resultText);

        return {
            questionText,
            options,
            correct: correctIndex,
            difficulty: level,
            explanation: resolveText(selectedMix.explanation),
            metaSkill: 'cognition:colors',
            reward: {
                stars: 12 + level * 2,
                coins: 8 + Math.floor(level * 1.5)
            }
        };
    }

    // --- Screen Management ---
    const CATEGORY_TOPIC_FILTERS = {
        segundo: new Set([
            'additions', 'soustractions', 'multiplications', 'divisions',
            'base-ten-build', 'base-ten-subtract', 'math-blitz',
            'repartis', 'temps-horloges', 'tables-defi',
            'lecture-magique', 'dictee', 'mots-outils', 'stories',
            'grande-aventure-mots', 'ecriture-cursive',
            'raisonnement', 'sorting', 'memory', 'riddles', 'sequences', 'logigrammes',
            'puzzle-magique',
            'decouvre-nature', 'carte-monde',
            'emotions-magiques', 'missions-jour', 'quiz-jour', 'respire-repose', 'expression-soi'
        ]),
        tercero: new Set([
            'multiplications', 'divisions', 'math-blitz',
            'problems-magiques', 'fractions-fantastiques', 'temps-horloges',
            'tables-defi', 'series-numeriques', 'mesures-magiques',
            'repartis',
            'lecture-magique', 'dictee', 'mots-outils', 'stories',
            'grande-aventure-mots',
            'raisonnement', 'riddles', 'sequences', 'logigrammes',
            'puzzle-magique', 'labyrinthe-logique', 'sudoku-junior',
            'decouvre-nature', 'carte-monde',
            'emotions-magiques', 'missions-jour', 'quiz-jour', 'respire-repose', 'expression-soi'
        ]),
        cuarto: new Set([
            'multiplications', 'divisions', 'math-blitz',
            'problems-magiques', 'fractions-fantastiques', 'temps-horloges',
            'tables-defi', 'series-numeriques', 'mesures-magiques',
            'repartis',
            'lecture-magique', 'dictee', 'mots-outils', 'stories',
            'grande-aventure-mots',
            'raisonnement', 'riddles', 'sequences', 'logigrammes',
            'puzzle-magique', 'labyrinthe-logique', 'sudoku-junior',
            'decouvre-nature', 'carte-monde',
            'emotions-magiques', 'missions-jour', 'quiz-jour', 'respire-repose', 'expression-soi'
        ])
    };

    const DEEP_LINK_TOPICS = new Set([
        'math-blitz',
        'lecture-magique',
        'raisonnement',
        'mots-outils',
        'grande-aventure-mots',
        'additions',
        'soustractions',
        'multiplications',
        'divisions',
        'base-ten-build',
        'base-ten-subtract',
        'sorting',
        'memory',
        'repartis',
        'stories',
        'riddles',
        'sequences',
        'dictee',
        'ecriture-cursive',
        'logigrammes',
        'puzzle-magique',
        'problems-magiques',
        'fractions-fantastiques',
        'temps-horloges',
        'tables-defi',
        'series-numeriques',
        'mesures-magiques',
        'labyrinthe-logique',
        'sudoku-junior',
        'grammaire-magique',
        'conjugaison-magique',
        'genres-accords',
        'lecture-voix-haute',
        'vocabulaire-thematique',
        'decouvre-nature',
        'carte-monde',
        'emotions-magiques',
        'missions-jour',
        'quiz-jour',
        'respire-repose',
        'expression-soi'
    ]);

    function getActiveCategory() {
        try {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('cat');
            return CATEGORY_TOPIC_FILTERS[cat] ? cat : null;
        } catch {
            return null;
        }
    }

    function filterTopicsForCategory(topics, category) {
        if (!category) return topics;
        const allowed = CATEGORY_TOPIC_FILTERS[category];
        return topics.filter((topic) => allowed && allowed.has(topic.id));
    }

    function isTopicAllowedForCategory(topicId, category) {
        if (!category) return true;
        const allowed = CATEGORY_TOPIC_FILTERS[category];
        return Boolean(allowed && allowed.has(topicId));
    }

    function launchTopicById(topicId) {
        if (topicId === 'grande-aventure-mots') {
            window.location.href = '/grande-aventure-mots';
            return true;
        }
        if (topicId === 'dictee') { showDicteeMenu(); return true; }
        if (topicId === 'stories') { showStoryMenu(); return true; }
        if (topicId === 'memory') { showMemoryGameMenu(); return true; }
        if (topicId === 'ecriture-cursive') { launchEcritureCursive(1); return true; }
        if (topicId === 'repartis') { showLevelMenu('repartis'); return true; }
        if (topicId === 'mots-outils') { launchMotsOutils(1); return true; }
        showLevelMenu(topicId);
        return true;
    }

    function launchTopicFromQuery() {
        let params;
        try {
            params = new URLSearchParams(window.location.search);
        } catch {
            return false;
        }
        const topicId = params.get('topic');
        if (!topicId || !DEEP_LINK_TOPICS.has(topicId)) {
            return false;
        }
        const category = getActiveCategory();
        if (!isTopicAllowedForCategory(topicId, category)) {
            return false;
        }
        gameState.currentTopic = topicId;
        return launchTopicById(topicId);
    }

    function showTopicMenu() {
        document.body.classList.remove('stage-controls-visible');
        clearProgressTracker();
        content.innerHTML = '';
        const prompt = document.createElement('div');
        prompt.className = 'question-prompt fx-bounce-in-down';
        prompt.textContent = t('menuPrompt', 'Sélectionne un sujet pour commencer.');
        content.appendChild(prompt);

        maybeSuggestReview(content);

        const topicsContainer = document.createElement('div');
        topicsContainer.className = 'options-grid';
        
        const allTopics = [
            { id: 'math-blitz', icon: '⚡', text: t('itemMathSprint', 'Maths Sprint') },
            { id: 'lecture-magique', icon: '📖', text: t('itemReading', 'Lecture Magique') },
            { id: 'raisonnement', icon: '🧠', text: t('sectionLogicTitle', 'Raisonnement') },
            { id: 'mots-outils', icon: '🗣️', text: t('itemToolWords', 'Mots-Outils') },
            { id: 'grande-aventure-mots', icon: '\u{1F524}', text: t('itemBigAdventure', 'La Grande Aventure des Mots'), href: '/grande-aventure-mots', type: 'external' },
            { id: 'additions', icon: '➕', text: t('itemAdditions', 'Additions') },
            { id: 'soustractions', icon: '➖', text: t('itemSubtractions', 'Soustractions') },
            { id: 'multiplications', icon: '✖️', text: t('itemMultiplications', 'Multiplications') },
            { id: 'divisions', icon: '➗', text: t('itemDivisions', 'Divisions') },
            { id: 'base-ten-build', icon: '🧱', text: t('baseTenBuildTitle', 'Construis le nombre') },
            { id: 'base-ten-subtract', icon: '🔁', text: t('baseTenSubtractTitle', 'Soustraire, c’est transformer') },
            { id: 'sorting', icon: '🧩', text: t('itemSorting', 'Tri & Classement') },
            { id: 'memory', icon: '🤔', text: t('itemMemory', 'Mémoire Magique') },
            { id: 'repartis', icon: '🍎', text: t('itemRepartis', 'Répartis & Multiplie') },
            { id: 'stories', icon: '📚', text: t('itemTales', 'Contes Magiques') },
            { id: 'riddles', icon: '❓', text: t('itemRiddles', 'Jeu d\'énigmes') },
            { id: 'sequences', icon: '➡️', text: t('itemSequences', 'Jeu des Séquences') },
            { id: 'dictee', icon: '🧚‍♀️', text: t('itemDictation', 'Dictée Magique') },
            { id: 'ecriture-cursive', icon: '✍️', text: t('itemCursive', 'J’écris en cursive') },
            { id: 'logigrammes', icon: '🧩', text: t('itemLogicgrams', 'Logigrammes') },
            { id: 'puzzle-magique', icon: '🧩', text: t('itemPuzzle', 'Puzzle Magique') },
        ];

        const activeCategory = getActiveCategory();
        const filteredTopics = filterTopicsForCategory(allTopics, activeCategory);

        filteredTopics.forEach(topic => {
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
        if (!activeCategory || ['segundo', 'tercero'].includes(activeCategory)) {
            if (window.logicGames && typeof window.logicGames.renderSection === 'function') {
            window.logicGames.renderSection(content, (game) => {
                const ctx = createGameContext(game.id, {});
                if (typeof window.logicGames.start === 'function') {
                    window.logicGames.start(game.id, ctx);
                }
            });
            }
        }

        // Ajout d'une rangée supplémentaire de nouveaux modules (3e primaire)
        const newTopics = [
            { id: 'problems-magiques', icon: '💡', text: 'Problèmes Magiques' },
            { id: 'fractions-fantastiques', icon: '🍰', text: 'Fractions Fantastiques' },
            { id: 'temps-horloges', icon: '⏰', text: t('itemTime', 'Temps & Horloges') },
            { id: 'tables-defi', icon: '✖️', text: 'Tables Défi' },
            { id: 'series-numeriques', icon: '🔢', text: 'Séries Numériques' },
            { id: 'mesures-magiques', icon: '📏', text: 'Mesures Magiques' },
            { id: 'labyrinthe-logique', icon: '🧭', text: 'Labyrinthe Logique' },
            { id: 'sudoku-junior', icon: '🧮', text: 'Sudoku Junior' },
            { id: 'grammaire-magique', icon: '📝', text: 'Grammaire Magique' },
            { id: 'conjugaison-magique', icon: '🧾', text: 'Conjugaison Magique' },
            { id: 'genres-accords', icon: '🔤', text: 'Genres & Accords' },
            { id: 'lecture-voix-haute', icon: '🎙️', text: 'Lecture à Voix Haute' },
            { id: 'vocabulaire-thematique', icon: '🧠', text: 'Vocabulaire Thématique' },

            { id: 'decouvre-nature', icon: '🌳', text: t('itemNature', 'Découvre la Nature') },
            { id: 'carte-monde', icon: '🌍', text: t('itemWorldMap', 'Carte du Monde Interactive') },
            { id: 'emotions-magiques', icon: '😊', text: t('itemEmotions', 'Émotions Magiques') },
            { id: 'missions-jour', icon: '✅', text: t('itemDailyMissions', 'Missions du Jour') },
            { id: 'quiz-jour', icon: '🌞', text: t('itemDailyQuiz', 'Quiz du Jour') },
            { id: 'respire-repose', icon: '🧘', text: t('itemBreath', 'Respire & Repose-toi') },
            { id: 'expression-soi', icon: '💬', text: t('itemSelfExpression', 'Expression de Soi / Mon Journal') }
        ];
        const extraContainer = document.createElement('div');
        extraContainer.className = 'options-grid';
        const filteredNewTopics = filterTopicsForCategory(newTopics, activeCategory);
        filteredNewTopics.forEach(topic => {
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

        clearBackButton();
        if (btnLogros) {
            setDisplay(btnLogros, 'inline-block');
        }
        if (btnLogout) {
            setDisplay(btnLogout, 'inline-block');
        }
    }

    function showLevelMenu(topic) {
        document.body.classList.remove('stage-controls-visible');
        gameState.currentTopic = topic;
        clearProgressTracker();
        content.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        const topicLabel = resolveTopicLabel(topic);
        title.textContent = t('menuChooseLevel', `Choisis un niveau pour ${topicLabel}`, { topic: topicLabel });
        content.appendChild(title);

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
            'mesures-magiques': (window.mesuresMagiquesGame?.getLevelCount?.() || 10),
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
            'emotions-magiques': (window.coeurEmotions?.getLevelCount?.() || 12),
            'missions-jour': (window.coeurEmotions?.getLevelCount?.() || 12),
            'quiz-jour': (window.coeurEmotions?.getLevelCount?.() || 12),
            'respire-repose': (window.coeurEmotions?.getLevelCount?.() || 12),
            'expression-soi': (window.coeurEmotions?.getLevelCount?.() || 12)
        };
        const totalLevels = getTopicLevelCount(gameState.currentTopic) || maxLevels[gameState.currentTopic] || LEVELS_PER_TOPIC;
        
        if (totalLevels === 0) {
            levelsContainer.innerHTML = `<p class="story-menu__empty">${t('menuNoLevels', 'Aucun niveau disponible pour le moment.')}</p>`;
        } else {
            for (let i = 1; i <= totalLevels; i++) {
                const theme = resolveLevelTheme(gameState.currentTopic);
                const levelBtn = document.createElement('button');
                levelBtn.className = 'level-button fx-bounce-in-down';
                levelBtn.type = 'button';
                levelBtn.dataset.level = String(i);
                levelBtn.style.animationDelay = `${Math.random() * 0.5}s`;
                levelBtn.setAttribute('aria-label', `Niveau ${i}`);
                levelBtn.style.setProperty('--level-accent', theme.accent);
                levelBtn.style.setProperty('--level-accent-soft', theme.soft);
                levelBtn.style.setProperty('--level-accent-strong', theme.strong);
                if (theme.iconColor) {
                    levelBtn.style.setProperty('--level-icon-color', theme.iconColor);
                }

                const levelIcon = document.createElement('span');
                levelIcon.className = 'level-button__icon';
                levelIcon.textContent = theme.icon || '✨';

                const levelNumber = document.createElement('span');
                levelNumber.className = 'level-button__number';
                levelNumber.textContent = String(i);

                const levelLabel = document.createElement('span');
                levelLabel.className = 'level-button__label';
                levelLabel.textContent = `Niveau ${i}`;

                const statusBadge = document.createElement('span');
                statusBadge.className = 'level-button__status';

                const applyStatus = (state) => {
                    const STATUS_COPY = {
                        ready: 'Pr\u00EAt \u00E0 jouer',
                        'in-progress': 'En cours...',
                        completed: 'Niveau termin\u00E9',
                        locked: 'Verrouill\u00E9'
                    };
                    statusBadge.dataset.state = state;
                    statusBadge.textContent = STATUS_COPY[state] || STATUS_COPY.ready;
                    levelBtn.dataset.status = state;
                };

                applyStatus('ready');
                levelBtn.append(levelIcon, levelNumber, levelLabel, statusBadge);

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
                    applyStatus('completed');
                } else if (userProgress.answeredQuestions[levelKey] === 'in-progress') {
                    levelBtn.classList.add('is-in-progress');
                    applyStatus('in-progress');
                }
                levelBtn.addEventListener('click', () => {
                    gameState.levelStartTime = Date.now();
                    if (levelBtn.dataset.status !== 'completed') {
                        levelBtn.classList.add('is-in-progress');
                        applyStatus('in-progress');
                    }
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
                    else if (gameState.currentTopic === 'base-ten-build') { launchBaseTenBuild(gameState.currentLevel); }
                    else if (gameState.currentTopic === 'base-ten-subtract') { launchBaseTenSubtract(gameState.currentLevel); }
                    // Nouveaux modules jouables
                    else if (gameState.currentTopic === 'problems-magiques') { launchProblemsMagiques(gameState.currentLevel); }
                    else if (gameState.currentTopic === 'fractions-fantastiques') { launchFractionsFantastiques(gameState.currentLevel); }
                    else if (gameState.currentTopic === 'temps-horloges') { launchTempsHorloges(gameState.currentLevel); }
                    else if (gameState.currentTopic === 'tables-defi') { launchTablesDefi(gameState.currentLevel); }
                    else if (gameState.currentTopic === 'mesures-magiques') { launchMesuresMagiques(gameState.currentLevel); }
                    else if (gameState.currentTopic === 'series-numeriques') { launchSeriesNumeriques(gameState.currentLevel); }
                    else if (['emotions-magiques','missions-jour','quiz-jour','respire-repose','expression-soi'].includes(gameState.currentTopic)) { launchCoeurEmotionsGame(gameState.currentTopic, gameState.currentLevel); }
                    // Placeholders
                    else if (['labyrinthe-logique','sudoku-junior','grammaire-magique','conjugaison-magique','genres-accords','lecture-voix-haute','vocabulaire-thematique','atelier-art','decouvre-nature','carte-monde'].includes(gameState.currentTopic)) { showComingSoon(gameState.currentTopic, '✨'); }
                    else if (gameState.currentTopic === 'memory') { showMemoryGame(MEMORY_GAME_LEVELS[gameState.currentLevel - 1]); }
                    else { gameState.currentQuestionIndex = 0; loadQuestion(0); }
                });
                levelsContainer.appendChild(levelBtn);
            }
        }
        content.appendChild(levelsContainer);
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToTopics(), showTopicMenu);
    }

    function handleOptionClick(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => {
            opt.removeEventListener('click', handleOptionClick);
            opt.disabled = true;
        });

        const questionsForLevel = allQuestions[gameState.currentTopic].filter(q => q.difficulty === gameState.currentLevel);
        const questionData = gameState.activeQuestion || questionsForLevel[gameState.currentQuestionIndex];
        if (!questionData) { return; }
        const correctAnswerIndex = typeof questionData.correct === 'number' ? questionData.correct : 0;
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctValue = Array.isArray(questionData.options) ? questionData.options[correctAnswerIndex] : null;
        const isCorrect = !Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex;
        const reward = questionData.reward || { stars: 0, coins: 0 };
        const sticker = questionData.operationMeta?.sticker ? ` ${questionData.operationMeta.sticker}` : '';
        const encouragement = questionData.encouragement || 'Courage, essaie encore !';
        const explanation = questionData.explanation
            ? `${encouragement} ${questionData.explanation}`
            : encouragement;
        const isReviewPhase = gameState.sessionPhase === 'review';

        const revealCorrectOption = () => {
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
        };

        const advanceToNext = () => {
            const baseDelay = isReviewPhase ? 1800 : 2500;
            const delay = autoPlayRuntime.getDelay('questionAdvance', baseDelay);
            setTimeout(() => {
                if (gameState.sessionPhase === 'initial') {
                    gameState.currentQuestionIndex += 1;
                    if (gameState.currentQuestionIndex < gameState.initialQuestionCount) {
                        loadQuestion(gameState.currentQuestionIndex);
                    } else if (gameState.reviewQueue.length) {
                        startReviewPhase();
                    } else {
                        completeLevelRun();
                    }
                } else {
                    gameState.reviewCursor += 1;
                    if (gameState.reviewCursor < gameState.reviewQueue.length) {
                        const nextIndex = gameState.reviewQueue[gameState.reviewCursor];
                        loadQuestion(nextIndex, { phase: 'review', reviewCursor: gameState.reviewCursor });
                    } else {
                        completeLevelRun();
                    }
                }
            }, delay);
        };

        const recordAttempt = (success) => {
            const elapsed = gameState.questionStartTime ? performance.now() - gameState.questionStartTime : 0;
            gameState.historyTracker?.recordQuestion(gameState.questionSkillTag, { correct: success, timeMs: elapsed });
            updateUI();
            saveProgress();
        };

        if (isCorrect) {
            selectedOption.classList.add('correct', 'fx-pulse');
            userProgress.userScore.stars += reward.stars || 0;
            userProgress.userScore.coins += reward.coins || 0;
            const successMessage = questionData.successMessage
                ? `${questionData.successMessage}${sticker}`
                : `${positiveMessages[Math.floor(Math.random() * positiveMessages.length)]}${sticker}`;
            showSuccessMessage(successMessage);
            showFireworks();
            recordAttempt(true);
            advanceToNext();
            return;
        }

        // Incorrect answer
        const enqueueForReview = () => {
            if (!gameState.reviewQueue.includes(questionData.originalIndex ?? gameState.currentQuestionIndex)) {
                gameState.reviewQueue.push(questionData.originalIndex ?? gameState.currentQuestionIndex);
            }
        };

        selectedOption.classList.add('wrong', 'fx-shake');
        setTimeout(() => selectedOption.classList.remove('fx-shake'), 700);

        if (!isReviewPhase) {
            enqueueForReview();
            applyCoinPenalty(5);
            revealCorrectOption();
            showErrorMessage(explanation, correctValue);
            recordAttempt(false);
            advanceToNext();
            return;
        }

        // Review phase logic with limited attempts
        gameState.reviewAttemptsRemaining = Math.max(0, gameState.reviewAttemptsRemaining - 1);
        if (gameState.reviewAttemptsRemaining > 0) {
            const retryMessage = questionData.retryMessage || `${encouragement} Tu as une deuxième chance !`;
            showErrorMessage(retryMessage);
            optionNodes.forEach(opt => {
                opt.classList.remove('wrong', 'correct');
                opt.disabled = false;
                opt.addEventListener('click', handleOptionClick);
            });
            return;
        }

        applyCoinPenalty(5);
        revealCorrectOption();
        showErrorMessage(explanation, correctValue);
        recordAttempt(false);
        advanceToNext();
    }
    
    function loadQuestion(index, options = {}) {
        document.body.classList.add('stage-controls-visible');
        const isExplicitReview = options.phase === 'review';
        const isReviewPhase = isExplicitReview || gameState.sessionPhase === 'review';
        gameState.currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();

        const questionsForLevel = allQuestions[gameState.currentTopic].filter(q => q.difficulty === gameState.currentLevel);
        if (!questionsForLevel.length) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'question-prompt';
            emptyMessage.textContent = t('menuNoQuestions', 'Aucune question disponible pour ce niveau pour le moment.');
            content.appendChild(emptyMessage);
            clearProgressTracker();
            return;
        }

        if (!isReviewPhase && index === 0) {
            gameState.sessionPhase = 'initial';
            gameState.reviewQueue = [];
            gameState.reviewCursor = 0;
            gameState.initialQuestionCount = questionsForLevel.length;
        }

        if (isReviewPhase) {
            if (typeof options.reviewCursor === 'number') {
                gameState.reviewCursor = options.reviewCursor;
            }
            gameState.sessionPhase = 'review';
            const reviewTotal = Math.max(1, gameState.reviewQueue.length || questionsForLevel.length || 1);
            updateProgressTracker(gameState.reviewCursor + 1, reviewTotal, true);
        } else {
            updateProgressTracker(index + 1, questionsForLevel.length);
            gameState.sessionPhase = 'initial';
        }

        const originalQuestion = questionsForLevel[index];
        if (!originalQuestion) {
            clearProgressTracker();
            return;
        }

        const trimmed = limitOptionsToTwo(originalQuestion.options, originalQuestion.correct);
        const displayQuestion = {
            ...originalQuestion,
            questionText: resolveText(originalQuestion.questionText),
            detail: resolveText(originalQuestion.detail),
            explanation: resolveText(originalQuestion.explanation),
            options: resolveArray(trimmed.options),
            correct: trimmed.correct,
            originalIndex: index
        };
        gameState.activeQuestion = displayQuestion;
        gameState.questionSkillTag = displayQuestion.metaSkill || resolveSkillTag(gameState.currentTopic);
        gameState.questionStartTime = performance.now();

        const operationMeta = displayQuestion.operationMeta || null;
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

            if (operationMeta.instruction) {
                const instructionSpan = document.createElement('span');
                instructionSpan.className = 'operation-banner__instruction';
                instructionSpan.textContent = operationMeta.instruction;
                textBox.appendChild(instructionSpan);
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
        title.innerHTML = displayQuestion.questionText;
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: displayQuestion.questionText,
            ariaLabel: 'Écouter la question'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        if (displayQuestion.detail && !operationMeta) {
            const detail = document.createElement('p');
            detail.className = 'question-detail';
            detail.textContent = displayQuestion.detail;
            promptWrapper.appendChild(detail);
        }

        fragment.appendChild(promptWrapper);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        if (operationMeta) {
            optionsContainer.classList.add('options-grid--math', `options-grid--${operationMeta.id}`);
        }

        const shuffledOptions = shuffle([...displayQuestion.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option fx-bounce-in-down';
            if (operationMeta) {
                optionEl.classList.add('math-option', `math-option--${operationMeta.id}`);
            }
            optionEl.style.animationDelay = `${i * 0.1 + 0.5}s`;
            const trimmedIndex = displayQuestion.options.indexOf(opt);
            optionEl.dataset.index = trimmedIndex;
            optionEl.addEventListener('click', handleOptionClick);
            const iconSet = Array.isArray(displayQuestion.optionIcons) && displayQuestion.optionIcons.length
                ? displayQuestion.optionIcons
                : answerOptionIcons;
            applyOptionContent(optionEl, opt, i, iconSet);
            optionsContainer.appendChild(optionEl);
        });
        fragment.appendChild(optionsContainer);
        content.appendChild(fragment);

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        if (gameState.currentTopic === 'review' || isReviewPhase) {
            configureBackButton(t('reviewFinish', 'Terminer la révision'), showTopicMenu);
        } else {
            configureBackButton(labelBackToLevels(), () => showLevelMenu(gameState.currentTopic));
        }

        gameState.reviewAttemptsRemaining = isReviewPhase ? 2 : 0;
    }

    function startReviewPhase() {
        if (!gameState.reviewQueue.length) {
            completeLevelRun();
            return;
        }
        gameState.sessionPhase = 'review';
        gameState.reviewCursor = 0;
        speakText('Passons au repaso des questions que tu veux revoir.');
        const firstIndex = gameState.reviewQueue[0];
        loadQuestion(firstIndex, { phase: 'review', reviewCursor: 0 });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function completeLevelRun() {
        if (gameState.currentTopic !== 'review') {
            userProgress.answeredQuestions[`${gameState.currentTopic}-${gameState.currentLevel}`] = 'completed';
        } else {
            gameState.historyTracker?.applyReviewSuccess(gameState.activeReviewSkills);
        }

        const duration = Math.round((Date.now() - gameState.levelStartTime) / 1000);
        const levelKey = `${gameState.currentTopic}-${gameState.currentLevel}`;
        const bestTime = userProgress.bestTimes[levelKey];

        let newBestTime = false;
        if (!bestTime || duration < bestTime) {
            userProgress.bestTimes[levelKey] = duration;
            newBestTime = true;
        }

        saveProgress();
        clearProgressTracker();
        const winPrompt = document.createElement('div');
        winPrompt.className = 'prompt ok fx-pop';

        const timeTaken = formatTime(duration);
        const bestTimeFormatted = formatTime(userProgress.bestTimes[levelKey]);

        winPrompt.innerHTML = `<p>Bravo, tu as complété le Niveau ${gameState.currentLevel} !</p>`;

        content.appendChild(winPrompt);
        const endStatus = gameState.currentTopic === 'review' ? 'review-completed' : 'completed';
        gameState.historyTracker?.endGame({ status: endStatus, topic: gameState.currentTopic, level: gameState.currentLevel, skills: gameState.activeReviewSkills });
        if (gameState.currentTopic === 'review') {
            gameState.activeReviewSkills = [];
        }
        gameState.sessionPhase = 'initial';
        gameState.reviewQueue = [];
        gameState.reviewCursor = 0;
        gameState.reviewAttemptsRemaining = 0;
        gameState.activeQuestion = null;
        gameState.initialQuestionCount = 0;
        gameState.currentQuestionIndex = 0;
        autoPlayRuntime.signalLevelComplete(gameState.currentTopic, gameState.currentLevel);
        if (!autoPlayRuntime.isActive()) {
            const resumeDelay = autoPlayRuntime.getDelay('levelSummary', 4000);
            setTimeout(() => showLevelMenu(gameState.currentTopic), resumeDelay); // Increased timeout to show the message
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

setDisplay(btnLogros, 'inline-block');
setDisplay(btnLogout, 'inline-block');
configureBackButton(labelBackToLevels(), () => showLevelMenu(gameState.currentTopic));

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
        // Validación mejorada: trim() para espacios, Number() para conversión robusta.
        const userValue = input.value.trim();
        const inputValue = userValue === '' ? NaN : Number(userValue);
        const correctValue = Number(input.dataset.correctValue);
        
        input.classList.remove('correct', 'incorrect');

        if (!isNaN(inputValue) && inputValue === correctValue) {
            input.classList.add('correct');
            input.disabled = true;
            correctCount++;
        } else {
            input.classList.add('incorrect', 'fx-shake');
            setTimeout(() => input.classList.remove('fx-shake'), 500);
            applyCoinPenalty(5);
            incorrectValues.push(`Réponse attendue : ${correctValue}`);
        }
    });

    updateUI();
    const elapsed = gameState.questionStartTime ? performance.now() - gameState.questionStartTime : 0;
    allCorrect = incorrectValues.length === 0;
    gameState.historyTracker?.recordQuestion(gameState.questionSkillTag || resolveSkillTag('number-houses'), { correct: allCorrect, timeMs: elapsed });

    if (allCorrect) {
        userProgress.userScore.stars += 50;
        userProgress.userScore.coins += 50;
        userProgress.answeredQuestions[`${gameState.currentTopic}-${gameState.currentLevel}`] = 'completed';
        window.ui.toast('Bravo ! Toutes les maisons sont correctes. 🦄✨', 'success');
        showFireworks();
        
        // Avance automático al siguiente nivel después de una breve celebración.
        setTimeout(() => {
            if (gameState.currentLevel < LEVELS_PER_TOPIC) {
                showNumberHousesGame(gameState.currentLevel + 1);
            } else {
                win();
            }
        }, 2200);

        gameState.historyTracker?.endGame({ status: 'completed', topic: 'number-houses', level: gameState.currentLevel });
    } else {
        window.ui.toast(`Presque ! ${allInputs.length - correctCount} erreur(s). Essaie encore !`, 'error');
        setTimeout(() => {
            checkBtn.disabled = false;
            gameState.questionStartTime = performance.now();
        }, 500); 
    }

    saveProgress();
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
            empty.textContent = t('menuNoQuestions', 'Aucune question disponible pour ce niveau pour le moment.');
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

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        if (gameState.currentTopic === 'review') {
            configureBackButton(t('reviewFinish', 'Terminer la révision'), showTopicMenu);
        } else {
            configureBackButton(labelBackToLevels(), () => showLevelMenu(gameState.currentTopic));
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
            applyCoinPenalty(5);
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

    function resolveStoryTitle(story) {
        if (!story) { return ''; }
        if (story.title) { return resolveText(story.title); }
        const lang = getLang();
        return story?.bilingualTitle?.[lang] || story?.bilingualTitle?.fr || '';
    }

    function resolveStoryTheme(story) {
        if (!story) { return ''; }
        if (story.theme) { return resolveText(story.theme); }
        const lang = getLang();
        return story?.bilingualTheme?.[lang] || '';
    }

    function showStoryMenu() {
        document.body.classList.add('story-menu-active', 'in-story-mode');
        document.body.classList.remove('story-quiz-active');
        clearProgressTracker();
        ensureSkyElements(); // Assure que le fond étoilé est présent
        ensureLibraryHash();

        setActiveStorySet(userProgress.storyProgress?.activeSetIndex || activeStorySetIndex);
        ensureStoryProgressInitialized();
        content.innerHTML = '';

        const activeSet = getActiveStorySet();
        if (!activeSet || !magicStories.length) {
            showComingSoon('Contes Magiques', '📖');
            return;

        }
        const completionMap = getStoryCompletionMap(activeSet?.id);
        const completedCount = magicStories.reduce((total, story) => {
            return total + (completionMap[story.id] ? 1 : 0);
        }, 0);

        const storyHeader = document.createElement('div');
        storyHeader.className = 'question-prompt story-menu-title fx-bounce-in-down';
        storyHeader.textContent = t('storyLibraryTitle', 'Bibliothèque des Contes Magiques');
        content.appendChild(storyHeader);

        // --- Filtres et recherche ---
        const controls = document.createElement('div');
        controls.className = 'story-controls fx-bounce-in-down';
        controls.style.animationDelay = '0.1s';

        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'story-search-wrapper';
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = t('storySearchPlaceholder', 'Rechercher un conte...');
        searchInput.className = 'story-search-input';
        searchWrapper.appendChild(searchInput);
        controls.appendChild(searchWrapper);

        const allThemes = [
            t('filterAll', 'Tous'),
            ...new Set(magicStories.map(story => resolveStoryTheme(story)).filter(Boolean))
        ];
        const themeFilter = document.createElement('select');
        themeFilter.className = 'btn';
        allThemes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme;
            option.textContent = theme;
            themeFilter.appendChild(option);
        });
        controls.appendChild(themeFilter);

        content.appendChild(controls);

        const storyGrid = document.createElement('div');
        storyGrid.className = 'story-grid-magic';

        const renderCards = (filterText = '', filterTheme = 'Tous') => {
            storyGrid.innerHTML = '';
            const filteredStories = magicStories.filter(story => {
                const resolvedTitle = resolveStoryTitle(story);
                const matchesText = !filterText || resolvedTitle.toLowerCase().includes(filterText.toLowerCase());
                const matchesTheme = filterTheme === t('filterAll', 'Tous') || story.theme === filterTheme;
                return matchesText && matchesTheme;
            });

            if (filteredStories.length === 0) {
                const noResult = document.createElement('p');
                noResult.textContent = t('storyNoResults', 'Aucun conte ne correspond à ta recherche.');
                noResult.className = 'story-menu__empty';
                storyGrid.appendChild(noResult);
                return;
            }

            filteredStories.forEach((story, index) => {
                const originalIndex = magicStories.findIndex(s => s.id === story.id);
                if (originalIndex === -1) return;

            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'story-card-magic';
            card.style.setProperty('--delay', `${index * 0.08 + 0.2}s`);
            card.dataset.storyIndex = String(index);

            const isCompleted = isStoryCompletedForDisplay(story);
            if (isCompleted) {
                card.classList.add('is-completed');
            }

            const header = document.createElement('div');
            header.className = 'story-card-magic__header';
            const icon = document.createElement('div');
            icon.className = 'story-card-magic__icon';
            icon.textContent = story.icon || '✨';
            const status = document.createElement('div');
            status.className = 'story-card-magic__status';
            status.textContent = isCompleted ? 'Lu' : 'Nouveau';
            header.append(icon, status);

            const cardContent = document.createElement('div');
            cardContent.className = 'story-card-magic__content';
            const cardTitle = document.createElement('h3');
            cardTitle.className = 'story-card-magic__title';
            cardTitle.textContent = resolveStoryTitle(story);
            const teaser = document.createElement('p');
            teaser.className = 'story-card-magic__teaser';
            teaser.innerHTML = `
                ${resolveStoryTheme(story) ? `<span class="story-tag">${resolveStoryTheme(story)}</span>` : ''}
                ${story.duration ? `<span class="story-tag">· ${story.duration} min</span>` : ''}
            `;
            cardContent.append(cardTitle, teaser);

            card.append(header, cardContent);
            card.addEventListener('click', (e) => showStoryReadModeSelection(originalIndex));
            storyGrid.appendChild(card);
            });
        };

        searchInput.addEventListener('input', () => {
            renderCards(searchInput.value, themeFilter.value);
        });
        themeFilter.addEventListener('change', () => {
            renderCards(searchInput.value, themeFilter.value);
        });

        renderCards();
        content.appendChild(storyGrid);

        const navContainer = document.createElement('div');
        navContainer.className = 'story-library-nav';

        if (activeStorySetIndex > 0) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn';
            prevBtn.innerHTML = `<span>&larr;</span> ${t('storyPrevCollection', 'Collection Précédente')}`;
            prevBtn.onclick = () => showStoryMenu(setActiveStorySet(activeStorySetIndex - 1));
            navContainer.appendChild(prevBtn);
        }

        if (activeStorySetIndex < storyCollections.length - 1) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn';
            nextBtn.innerHTML = `${t('storyNextCollection', 'Collection Suivante')} <span>&rarr;</span>`;
            nextBtn.onclick = () => showStoryMenu(setActiveStorySet(activeStorySetIndex + 1));
            navContainer.appendChild(nextBtn);
        }
        content.appendChild(navContainer);

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToTopics(), () => {
            clearLibraryHash();
            showTopicMenu();
        });
    }

    function showStoryReadModeSelection(storyIndex) {
        const story = magicStories[storyIndex];
        content.innerHTML = '';
        document.body.classList.add('in-story-mode'); // Ensure in-story-mode is present
        document.body.classList.remove('story-menu-active');

        const title = document.createElement('div');
        title.className = 'question-prompt story-menu-title fx-bounce-in-down';
        title.textContent = resolveStoryTitle(story);
        content.appendChild(title);

        const selectionBox = document.createElement('div');
        selectionBox.className = 'story-mode-selection fx-bounce-in-down';
        selectionBox.style.animationDelay = '0.1s';

        const readToMeBtn = document.createElement('button');
        readToMeBtn.className = 'btn story-mode-btn';
        readToMeBtn.innerHTML = `<span>📖</span> ${t('storyReadToMe', 'Lis-moi l\'histoire')}`;
        readToMeBtn.onclick = () => showMagicStory(storyIndex);
        selectionBox.appendChild(readToMeBtn);

        const readMyselfBtn = document.createElement('button');
        readMyselfBtn.className = 'btn story-mode-btn';
        readMyselfBtn.innerHTML = `<span>🙋‍♀️</span> ${t('storyReadMyself', 'Je lis toute seule')}`;
        readMyselfBtn.onclick = () => showMagicStory(storyIndex);
        selectionBox.appendChild(readMyselfBtn);

        content.appendChild(selectionBox);
        configureBackButton(labelBackToStories(), showStoryMenu);
    }

    function showMagicStory(storyIndex, event) {
        const bookElement = event?.currentTarget;
        if (bookElement) {
            const rect = bookElement.getBoundingClientRect();
            const bookClone = bookElement.cloneNode(true);
            bookClone.classList.add('story-book--transition');
            bookClone.style.setProperty('--book-top', `${rect.top}px`);
            bookClone.style.setProperty('--book-left', `${rect.left}px`);
            bookClone.style.setProperty('--book-width', `${rect.width}px`);
            bookClone.style.setProperty('--book-height', `${rect.height}px`);
            document.body.appendChild(bookClone);

            requestAnimationFrame(() => {
                bookClone.classList.add('is-opening');
            });

            setTimeout(() => {
                loadStoryContent(storyIndex);
                bookClone.remove();
            }, 600); // Match CSS transition duration
        } else {
            loadStoryContent(storyIndex);
        }
    }

    function loadStoryContent(storyIndex) {
        document.body.classList.remove('story-menu-active');
        document.body.classList.add('in-story-mode');
        content.innerHTML = '';
        const story = magicStories[storyIndex];
        gameState.currentStoryIndex = storyIndex;

        const storyContainer = document.createElement('div');
        storyContainer.className = 'story-container fx-bounce-in-down';

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'story-title-wrapper';

        const titleEl = document.createElement('h2');
        titleEl.className = 'story-title';
        titleEl.textContent = resolveStoryTitle(story);
        titleWrapper.appendChild(titleEl);

        const storyText = resolveArray(story.text);
        const fullStoryText = storyText.join(' ');
        const listenBtn = createAudioButton({
            label: '▶️',
            ariaLabel: t('storyListenAria', 'Lire le conte en voix haute'),
            onClick: () => speakText(`${resolveStoryTitle(story)}. ${fullStoryText}`)
        });
        listenBtn.classList.add('story-title-play-btn');
        titleWrapper.appendChild(listenBtn);

        storyContainer.appendChild(titleWrapper);

        if (story.image) {
            const img = document.createElement('img');
            img.className = 'story-image';
            img.src = story.image;
            img.alt = resolveStoryTitle(story);
            storyContainer.appendChild(img);
        }

        storyText.forEach((paragraph, pIndex) => {
            const p = document.createElement('p');
            p.className = 'story-paragraph';
            p.style.animationDelay = `${pIndex * 0.2 + 0.5}s`;
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
        startQuizBtn.className = 'submit-btn fx-bounce-in-down';
        startQuizBtn.textContent = t('storyQuizStart', 'Commencer le quiz');
        startQuizBtn.style.marginTop = '2rem';
        startQuizBtn.addEventListener('click', () => startStoryQuiz(storyIndex));

        content.appendChild(storyContainer);
        content.appendChild(startQuizBtn);
        setupFairyDustEffect(storyContainer);

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToStories(), showStoryMenu);
    }
    
    function startStoryQuiz(storyIndex) {
        const story = magicStories[storyIndex];
        document.body.classList.remove('story-menu-active');
        document.body.classList.add('in-story-mode'); // Ensure in-story-mode is present
        document.body.classList.add('story-quiz-active');
        gameState.storyQuiz = story.quiz;
        gameState.currentQuestionIndex = 0;
        gameState.questionSkillTag = resolveSkillTag('stories');
        gameState.questionStartTime = performance.now();
        gameState.historyTracker?.startGame('stories', storyIndex + 1, {
            skillTag: gameState.questionSkillTag,
            storyTitle: resolveStoryTitle(story)
        });
        loadQuizQuestion();
    }
    
    function loadQuizQuestion() {
        document.body.classList.add('in-story-mode');
        if (gameState.currentQuestionIndex >= gameState.storyQuiz.length) {
            showQuizResults();
            return;
        }
        
        content.innerHTML = '';
        const questionData = gameState.storyQuiz[gameState.currentQuestionIndex];
        const resolvedQuestion = resolveText(questionData.question);
        const resolvedOptions = resolveArray(questionData.options);
        const resolvedExplanation = resolveText(questionData.explanation);
        gameState.questionSkillTag = questionData?.metaSkill || gameState.questionSkillTag || resolveSkillTag('stories');
        gameState.questionStartTime = performance.now();
        const fragment = document.createDocumentFragment();
        
        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        const questionLabel = t('storyQuizQuestion', 'Question {{current}} / {{total}}', {
            current: gameState.currentQuestionIndex + 1,
            total: gameState.storyQuiz.length
        });
        title.innerHTML = `${questionLabel}<br>${resolvedQuestion}`;
        promptWrapper.appendChild(title);

        const audioBtn = createAudioButton({
            text: resolvedQuestion,
            ariaLabel: 'Écouter la question du conte'
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        fragment.appendChild(promptWrapper);
        speakText(resolvedQuestion);
        updateProgressTracker(gameState.currentQuestionIndex + 1, gameState.storyQuiz.length);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        
        const shuffledOptions = shuffle([...resolvedOptions]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.1 + 0.5}s`;
            const originalIndex = resolvedOptions.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleStoryQuizAnswer);
            applyOptionContent(optionEl, opt, i);
            optionsContainer.appendChild(optionEl);
        });
        fragment.appendChild(optionsContainer);
        content.appendChild(fragment);

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToStories(), showStoryMenu);
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
        const resolvedOptions = resolveArray(questionData.options);
        const resolvedExplanation = resolveText(questionData.explanation);
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = questionData.correct;
        const correctValue = resolvedOptions[correctAnswerIndex];

        const isCorrect = !Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex;

        if (isCorrect) {
            selectedOption.classList.add('correct');
            userProgress.userScore.stars += 15;
            userProgress.userScore.coins += 10;
            showSuccessMessage('Bonne réponse !');
            showFireworks();
        } else {
            selectedOption.classList.add('wrong');
            applyCoinPenalty(5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            const explanation = resolvedExplanation || 'Mauvaise réponse.';
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
        document.body.classList.add('in-story-mode'); // Ensure in-story-mode is present
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
        let promptMessage = '<h2>Quiz terminé ! 🎉</h2><p>Tu as gagné des étoiles et des pièces !</p>';
        if (unlockedNewSet) {
            promptMessage += '<p class="new-collection-unlock">Nouvelle collection de contes débloquée ! ✨</p>';
            showFireworks();
        }
        prompt.innerHTML = promptMessage;

        content.appendChild(prompt);

        gameState.historyTracker?.endGame({
            status: 'completed',
            topic: 'stories',
            storyIndex: gameState.currentStoryIndex
        });

        const backBtn = document.createElement('button');
        backBtn.className = 'submit-btn fx-bounce-in-down';
        backBtn.textContent = labelBackToStories();
        backBtn.addEventListener('click', showStoryMenu);
        content.appendChild(backBtn);

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToMenu(), showTopicMenu);
    }

    function showMemoryGameMenu() {
      document.body.classList.remove('in-story-mode'); // Exit story mode
      clearProgressTracker();
      content.innerHTML = '';

      const title = document.createElement('div');
      title.className = 'question-prompt fx-bounce-in-down';
      title.textContent = t('menuChooseLevel', 'Choisis un niveau de mémoire', { topic: t('itemMemory', 'Mémoire Magique') });
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

      setDisplay(btnLogros, 'inline-block');
      setDisplay(btnLogout, 'inline-block');
      configureBackButton(labelBackToMenu(), showTopicMenu);
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
                        // applyCoinPenalty(5); // Penalización desactivada
                        playSound('wrong');
                        updateUI(); // Llamada a updateUI()
                        saveProgress();
                        showErrorMessage('Mauvaise réponse.', `Il fallait trouver une paire de ${card1.emoji}`);
                    }, 1000);
                }
            }
        }
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToMemory(), () => {
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

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToLevels(), () => showLevelMenu('sorting'));

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
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
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
        title.textContent = `${t('levelLabel', 'Niveau')} ${levelData.level} — ${resolvedTheme}`;
        wrapper.appendChild(title);

        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const promptText = document.createElement('p');
        promptText.className = 'riddle-prompt';
        promptText.textContent = resolvedPrompt;
        promptWrapper.appendChild(promptText);

        const audioBtn = createAudioButton({
            text: resolvedPrompt,
            ariaLabel: t('riddleListenAria', 'Écouter l\'énigme')
        });
        if (audioBtn) {
            promptWrapper.appendChild(audioBtn);
        }

        wrapper.appendChild(promptWrapper);
        updateProgressTracker(gameState.currentQuestionIndex + 1, questions.length);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';

        const shuffledOptions = shuffle([...resolvedOptions]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option riddle-option fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.08 + 0.4}s`;
            const originalIndex = resolvedOptions.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleRiddleAnswer);
            applyOptionContent(optionEl, opt, i);
            optionsContainer.appendChild(optionEl);
        });

        wrapper.appendChild(optionsContainer);
        content.appendChild(wrapper);

        configureBackButton(labelBackToLevels(), () => showLevelMenu('riddles'));
    }

    function completeRiddleLevel(levelData) {
        userProgress.answeredQuestions[`riddles-${levelData.level}`] = 'completed';
        saveProgress();
        showSuccessMessage(resolveText(levelData.completionMessage) || t('menuReviewDone', 'Niveau terminé !'));
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
        const resolvedOptions = resolveArray(riddleData.options);
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = riddleData.answer;
        const correctValue = resolvedOptions[correctAnswerIndex];

        if (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex) {
            selectedOption.classList.add('correct');
            selectedOption.classList.add('riddle-correct-glow');
            userProgress.userScore.stars += riddleData.reward?.stars || (10 + levelData.level);
            userProgress.userScore.coins += riddleData.reward?.coins || (6 + Math.floor(levelData.level / 2));
            showSuccessMessage(resolveText(riddleData.success) || t('riddleCorrect', 'Bonne réponse !'));
            showConfetti();
        } else { // Respuesta incorrecta
            selectedOption.classList.add('wrong');
            selectedOption.classList.add('riddle-wrong-glow');
            applyCoinPenalty(5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
                correctOption.classList.add('riddle-correct-glow');
            }
            const hintText = resolveText(riddleData.hint);
            const hint = hintText ? ` ${t('riddleHintPrefix', 'Conseil :')} ${hintText}` : '';
            showErrorMessage(t('riddleWrong', 'Mauvaise réponse.'), `${correctValue}.${hint}`);
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

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToLevels(), () => showLevelMenu('vowels'));
    
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
            applyCoinPenalty(5);
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

        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToLevels(), () => showLevelMenu('sequences'));

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
        clearProgressTracker();
        setDisplay(btnLogros, 'inline-block');
        setDisplay(btnLogout, 'inline-block');
        configureBackButton(labelBackToMenu(), showTopicMenu);
    }

    const AUTOPLAY_TOPIC_SEQUENCE = [
        'additions', 'soustractions', 'multiplications', 'divisions',
        'number-houses', 'colors', 'memory', 'sorting', 'vowels', 'riddles', 'sequences',
        'puzzle-magique', 'repartis', 'dictee', 'math-blitz', 'lecture-magique',
        'raisonnement', 'ecriture-cursive', 'abaque-magique', 'mots-outils',
        'problems-magiques', 'fractions-fantastiques', 'temps-horloges',
        'tables-defi', 'series-numeriques', 'mesures-magiques',
        'labyrinthe-logique', 'sudoku-junior', 'emotions-magiques',
        'missions-jour', 'quiz-jour', 'respire-repose', 'expression-soi',
        'stories'
    ];
    const STORY_TOPICS = new Set(['stories']);
    const AUTOPLAY_SKIPPED_TOPICS = new Set(['les-sorcieres', 'review']);
    let autoPlayAbort = false;
    let autoPlayPromise = null;
    const autoPlayStatus = { running: false, topic: null, level: null };

    function autoSetStatus(running, topic = null, level = null) {
        autoPlayStatus.running = running;
        autoPlayStatus.topic = topic;
        autoPlayStatus.level = level;
    }

    async function autoPlayQuestionTopic(topic, totalLevels) {
        const cappedLevels = Math.max(0, Number(totalLevels) || 0);
        for (let level = 1; level <= cappedLevels; level++) {
            if (autoPlayAbort) { break; }
            autoPlayStatus.level = level;
            const wait = autoPlayRuntime.waitForLevel(topic, level);
            try {
                gameState.currentTopic = topic;
                gameState.currentLevel = level;
                gameState.levelStartTime = Date.now();
                loadQuestion(0);
                autoPlayRuntime.driveQuiz(topic, level);
                await wait;
            } catch (error) {
                console.warn('[autoplay] Failed to auto-play question topic', topic, level, error);
                markLevelCompleted(topic, level);
                await wait;
            }
        }
        autoPlayStatus.level = null;
    }

    async function autoPlayModuleTopic(topic, totalLevels) {
        const cappedLevels = Math.max(0, Number(totalLevels) || 0);
        const launcher = TOPIC_LAUNCHERS[topic];
        for (let level = 1; level <= cappedLevels; level++) {
            if (autoPlayAbort) { break; }
            autoPlayStatus.level = level;
            const wait = autoPlayRuntime.waitForLevel(topic, level);
            if (launcher) {
                try {
                    launcher(level);
                } catch (e) {
                    console.warn(`[autoplay] Failed to launch ${topic} level ${level}`, e);
                }
            } else {
                markLevelCompleted(topic, level);
            }
            await wait;
        }
        autoPlayStatus.level = null;
    }

    function autoCompleteStories() {
        try {
            storyCollections.forEach(set => {
                if (!set || !Array.isArray(set.stories)) { return; }
                set.stories.forEach(story => {
                    if (story?.id) {
                        markStoryCompletedById(story.id, set.id);
                    }
                });
            });
            ensureStoryProgressInitialized();
            saveProgress();
        } catch (error) {
            console.warn('[autoplay] Failed to complete stories automatically', error);
        }
    }

    function autoCompleteLogicGames() {
        if (!window.logicGames || !Array.isArray(window.logicGames.LOGIC_GAMES)) {
            return;
        }
        const storageKey = 'logicGamesProgress_v2';
        const progress = {};
        window.logicGames.LOGIC_GAMES.forEach(game => {
            if (!game?.id) { return; }
            let total = 0;
            if (typeof window.logicGames.getLevelCount === 'function') {
                try {
                    total = window.logicGames.getLevelCount(game.id) || 0;
                } catch (error) {
                    console.warn('[autoplay] Unable to determine level count for logic game', game.id, error);
                    total = 0;
                }
            }
            progress[game.id] = { completed: Math.max(0, total) };
        });
        try {
            localStorage.setItem(storageKey, JSON.stringify(progress));
        } catch (error) {
            console.warn('[autoplay] Failed to persist logic games progress', error);
        }
    }

    async function autoPlayTopicSequence(sequence) {
        autoPlayAbort = false;
        autoSetStatus(true, null, null);
        autoPlayRuntime.start();
        try {
            for (const topic of sequence) {
                if (autoPlayAbort) { break; }
                if (!topic || AUTOPLAY_SKIPPED_TOPICS.has(topic)) { continue; }
                autoSetStatus(true, topic, null);
                if (STORY_TOPICS.has(topic)) {
                    autoCompleteStories();
                    continue;
                }
                const totalLevels = getTopicLevelCount(topic);
                if (!Number.isFinite(totalLevels) || totalLevels <= 0) { continue; }
                if (QUESTION_TOPICS.has(topic)) {
                    await autoPlayQuestionTopic(topic, totalLevels);
                } else {
                    await autoPlayModuleTopic(topic, totalLevels);
                }
            }
            if (!autoPlayAbort) {
                autoCompleteStories();
                autoCompleteLogicGames();
            }
        } finally {
            autoPlayRuntime.stop();
            autoSetStatus(false, null, null);
            autoPlayAbort = false;
            saveProgress();
            updateUI();
            if (typeof showTopicMenu === 'function') {
                try {
                    showTopicMenu();
                } catch (error) {
                    console.warn('[autoplay] Unable to refresh topic menu after autoplay', error);
                }
            }
        }
    }

    window.LenaAutoPlayer = {
        isRunning: () => autoPlayRuntime.isActive(),
        status: () => ({
            running: autoPlayStatus.running,
            topic: autoPlayStatus.topic,
            level: autoPlayStatus.level
        }),
        stop() {
            if (!autoPlayRuntime.isActive()) { return; }
            autoPlayAbort = true;
            autoPlayRuntime.stop();
        },
        async playAll() {
            if (autoPlayRuntime.isActive()) {
                return autoPlayPromise ?? Promise.resolve();
            }
            autoPlayPromise = autoPlayTopicSequence(AUTOPLAY_TOPIC_SEQUENCE);
            try {
                await autoPlayPromise;
            } finally {
                autoPlayPromise = null;
            }
        },
        async playTopic(topic) {
            if (!topic) { return; }
            if (autoPlayRuntime.isActive()) {
                throw new Error('Autoplay already running');
            }
            autoPlayPromise = autoPlayTopicSequence([topic]);
            try {
                await autoPlayPromise;
            } finally {
                autoPlayPromise = null;
            }
        }
    };

    // --- Start Game ---
    window.addEventListener('hashchange', () => {
        handleLibraryHashNavigation();
    });

    init();
    setupSpeechSynthesis();
});






