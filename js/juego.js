console.log("juego.js loaded");
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
    const audioCorrect = document.getElementById('audioCorrect');
    const audioWrong = document.getElementById('audioWrong');
    const audioCoins = document.getElementById('audioCoins');
    const stageBottom = document.getElementById('stageBottom');
    const btnShop = document.getElementById('btnShop');
    const shopModal = document.getElementById('shopModal');
    const shopList = document.getElementById('shopList');
    const inventoryList = document.getElementById('inventoryList');
    const shopCloseBtn = document.getElementById('shopClose');


    // --- Game State ---
    let currentTopic = '';
    let currentLevel;
    let currentQuestionIndex = 0;
    let userScore;
    let answeredQuestions;
    let storyQuiz = [];
    let currentVowelLevelData = null;
    let ownedItems = [];
    let activeCosmetics = { background: null, badge: null };
    let decorContainer = null;
    let lastDecorKey = null;
    let lastAppliedTheme = '';
    let activeBadgeEmoji = null;
    let questionStartTime = null;
    let questionSkillTag = null;
    let historyTracker = null;
    let currentStoryIndex = null;
    let activeReviewSkills = [];
    let pauseReminderTimeout = null;
    let currentRiddleLevelIndex = 0;

    // --- Game Data ---
    const LEVELS_PER_TOPIC = 12;
    const QUESTIONS_PER_LEVEL = 5;
    const MEMORY_GAME_LEVELS = [
      { level: 1, pairs: 2, grid: '2x2' },
      { level: 2, pairs: 4, grid: '2x4' },
      { level: 3, pairs: 6, grid: '3x4' },
      { level: 4, pairs: 8, grid: '4x4' },
      { level: 5, pairs: 10, grid: '4x5' },
      { level: 6, pairs: 12, grid: '4x6' },
      { level: 7, pairs: 14, grid: '4x7' },
      { level: 8, pairs: 16, grid: '4x8' },
      { level: 9, pairs: 18, grid: '5x8' },
      { level: 10, pairs: 20, grid: '5x8' },
      { level: 11, pairs: 22, grid: '4x11' },
      { level: 12, pairs: 24, grid: '6x8' }
    ];
    const emoji = {
        blue: '🔵', yellow: '🟡', red: '🔴', green: '🟢', orange: '🟠', purple: '🟣',
        car: '🚗', bus: '🚌', plane: '✈️', rocket: '🚀', star: '⭐', coin: '💰', sparkle: '✨',
        bear: '🐻', rabbit: '🐰', dog: '🐶', cat: '🐱', fish: '🐠', frog: '🐸', bird: '🐦', panda: '🐼',
        sort: '🗂️', riddle: '🤔', vowel: '🅰️', shape: '🔷', sequence: '➡️',
        sun: '☀️', moon: '🌙', cloud: '☁️', rainbow: '🌈', cupcake: '🧁', icecream: '🍦',
        balloon: '🎈', paint: '🖍️', drum: '🥁', guitar: '🎸', book: '📘', kite: '🪁'
    };
    const positiveMessages = ['🦄 Bravo !', '✨ Super !', '🌈 Génial !', '🌟 Parfait !', '🎉 Formidable !'];
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
        raisonnement: 'logic:reasoning'
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
    const colorOptionIcons = ['🎨', '🖌️', '🧴', '🧑\u200d🎨', '🌈'];
    const magicStories = [
        {
            "title": "Le Voyage de Léna l\'Étoile ⭐️",
            "image": "https://photos.app.goo.gl/fkh9KiXZNouPpshj7",
            "text": [
              "Léna 👧 était une petite étoile ⭐️ brillante ✨ comme un diamant 💎.",
              "Elle vivait 🏡 sr une montagne ⛰️ magique ✨ avec sa petite sœur Yaya 👧.",
              "Un jour ☀️, Léna ⭐️ décida 🗺️ de faire un grand voyage 🚀 pour trouver 🔍 le plus beau arc-en-ciel 🌈.",
              "Yaya 👧, très curieuse 👀, la rejoignit 🤝.",
              "Elles sautèrent 🤸 de nuage ☁️ en nuage ☁️. C\'était un jeu 🎲 très amusant 😄 !",
              "Finalement 🎉, elles trouvèrent 🔎 un arc-en-ciel 🌈 géant 🏞️. Mission accomplie 🏆 !",
              "Léna ⭐️ et Yaya 👧 avaient fait un voyage 🚀 inoubliable 💖."
            ],
            "quiz": [
              { "question": "Qui est Léna 👧 ?", "options": ["Une princesse 👑", "Une étoile ⭐️", "Un animal 🐾"], "correct": 1 },
              { "question": "Où vivait Léna ⭐️ ?", "options": ["Dans une forêt 🌳", "Sur une montagne magique ⛰️✨", "Dans un château 🏰"], "correct": 1 },
              { "question": "Qu'ont-elles trouvé 🔍 ?", "options": ["Une fleur 🌸", "Un trésor 💰", "Un arc-en-ciel 🌈"], "correct": 2 }
            ]
        },
        {
            "title": "Le Lion au Grand Coeur 🦁💖",
            "image": "https://via.placeholder.com/600x400.png?text=Le+lion+au+grand+coeur",
            "text": [
              "Dans la savane 🌍 vivait un lion 🦁 nommé Léo.",
              "Il n\'était pas le plus fort 💪, mais il était le plus courageux 💖 et le plus gentil 🤗.",
              "Léna 👧 et Yaya 👧 étaient ses meilleures amies 👭.",
              "Un jour ☀️, una pequeña antílope 🦌 se encontró atrapada 😨 en un pantano 🪵.",
              "Léna 👧 y Yaya 👧 estaban preocupadas 😟.",
              "Léo 🦁, sin dudarlo ⚡, saltó 🤾 al barro 🌿 para salvarla 🙌.",
              "Los otros animales 🐒🦓🐘 aplaudieron 👏.",
              "Léo 🦁 había demostrado que el coraje 💖 no se mide por la fuerza 💪, sino por la bondad 🤗.",
              "Léna 👧 y Yaya 👧 estaban tan orgullosas 🌟 de su amigo 🦁."
            ],
            "quiz": [
              { "question": "Comment s\'appelle le lion 🦁 ?", "options": ["Léo 🦁", "Max 🐯", "Simba 🐾"], "correct": 0 },
              { "question": "Qu\'est-ce qui le rendait courageux 💖 ?", "options": ["Sa force 💪", "Sa gentillesse 🤗", "Sa vitesse 🏃‍♂️"], "correct": 1 },
              { "question": "Quel animal 🐾 Léo 🦁 a-t-il sauvé 🙌 ?", "options": ["Un zèbre 🦓", "Une antilope 🦌", "Une girafe 🦒"], "correct": 1 }
            ]
        },
        {
            "title": "Le Roller Fou de Yaya 🛼🐱",
            "image": "https://via.placeholder.com/600x400.png?text=Roller+de+Yaya",
            "text": [
              "Un jour ☀️, Léna 👧 offrit des rollers 🛼 à Yaya 🐱.",
              "Yaya essaya… et BOUM 💥 elle partit comme une fusée 🚀.",
              "Elle glissa sur une flaque d’eau 💦 et fit un tourbillon 🌀.",
              "Léna 👧 riait tellement 😂 qu’elle tomba aussi par terre 🙃.",
              "Finalement, Yaya s’arrêta dans un tas de coussins 🛏️, toute étourdie 🤪."
            ],
            "quiz": [
              { "question": "Qui portait des rollers 🛼 ?", "options": ["Léna 👧", "Yaya 🐱", "Un chien 🐶"], "correct": 1 },
              { "question": "Sur quoi Yaya a-t-elle glissé 💦 ?", "options": ["Une flaque d’eau 💦", "Une banane 🍌", "Un tapis 🧶"], "correct": 0 },
              { "question": "Où s’est-elle arrêtée 🛏️ ?", "options": ["Dans un arbre 🌳", "Dans des coussins 🛏️", "Dans la cuisine 🍴"], "correct": 1 }
            ]
        },
        {
            "title": "La Gâteau Volant 🎂✨",
            "image": "https://via.placeholder.com/600x400.png?text=Gateau+volant",
            "text": [
              "Léna 👧 voulait préparer un gâteau 🎂 magique.",
              "Yaya 🐱 ajouta trop de levure 🧁…",
              "Le gâteau commença à gonfler 🎈… puis POUF 💨 il s’envola !",
              "Les deux coururent derrière 🍰 comme si c’était un ballon 🎈.",
              "Enfin, il retomba sur la table 🍴 et tout le monde goûta, miam 😋."
            ],
            "quiz": [
              { "question": "Qui ajouta trop de levure 🧁 ?", "options": ["Léna 👧", "Yaya 🐱", "Mamie 👵"], "correct": 1 },
              { "question": "Que fit le gâteau 🎂 ?", "options": ["Il s’envola ✨", "Il brûla 🔥", "Il disparut 👻"], "correct": 0 },
              { "question": "Où finit le gâteau 🍰 ?", "options": ["Par terre 🪣", "Dans le ciel 🌈", "Sur la table 🍴"], "correct": 2 }
            ]
        },
        {
            "title": "La Chasse aux Chaussettes 🧦🔍",
            "image": "https://via.placeholder.com/600x400.png?text=Chaussettes",
            "text": [
              "Léna 👧 ne retrouvait jamais ses chaussettes 🧦.",
              "Yaya 🐱 les avait toutes cachées dans sa maison secrète 🏠.",
              "Elles jouaient à cache-cache 🤫 avec les chaussettes colorées 🎨.",
              "Quand Léna ouvrit le panier… PAF 💥 une montagne de chaussettes !",
              "Elles rirent tellement 😂 qu’elles firent un château de chaussettes 👑."
            ],
            "quiz": [
              { "question": "Que cherchait Léna 👧 ?", "options": ["Ses jouets 🧸", "Ses chaussettes 🧦", "Ses livres 📚"], "correct": 1 },
              { "question": "Qui les avait cachées 🐱 ?", "options": ["Papa 👨", "Yaya 🐱", "Un voleur 🕵️"], "correct": 1 },
              { "question": "Que firent-elles à la fin 👑 ?", "options": ["Un château 🏰", "Un château de chaussettes 👑", "Un gâteau 🎂"], "correct": 1 }
            ]
        },
        {
            "title": "Le Bus Magique 🚌✨",
            "image": "https://via.placeholder.com/600x400.png?text=Bus+magique",
            "text": [
              "En allant à l’école 📚, Léna 👧 monta dans un bus étrange 🚌.",
              "Yaya 🐱 conduisait le bus 🚍 ! Quelle folie 🤯 !",
              "Le bus roula sur un arc-en-ciel 🌈 et fit des loopings 🌀.",
              "Tous les enfants criaient de joie 🎉.",
              "À la fin, le bus atterrit devant l’école 🏫, pile à l’heure ⏰."
            ],
            "quiz": [
              { "question": "Qui conduisait le bus 🚌 ?", "options": ["Le chauffeur 👨", "Léna 👧", "Yaya 🐱"], "correct": 2 },
              { "question": "Sur quoi le bus roula 🌈 ?", "options": ["Un arc-en-ciel 🌈", "Une rivière 💧", "Une route normale 🛣️"], "correct": 0 },
              { "question": "Où s’arrêta le bus 🏫 ?", "options": ["À la maison 🏡", "Devant l’école 🏫", "Dans la forêt 🌳"], "correct": 1 }
            ]
        },
        {
            "title": "Le Chien Savant 🐶🎓",
            "image": "https://via.placeholder.com/600x400.png?text=Chien+savant",
            "text": [
              "Un jour, Léna 👧 et Yaya 🐱 rencontrèrent un chien 🐶 qui savait lire 📖.",
              "Il portait des lunettes 🤓 et récitait l’alphabet 🎶.",
              "Yaya 🐱 essaya aussi… mais elle miaula seulement 😹.",
              "Léna 👧 applaudit 👏 le chien professeur.",
              "Ils passèrent la journée à rire et apprendre ensemble 💡."
            ],
            "quiz": [
              { "question": "Que savait faire le chien 🐶 ?", "options": ["Cuisiner 🍳", "Lire 📖", "Voler 🕊️"], "correct": 1 },
              { "question": "Que portait le chien 🤓 ?", "options": ["Un chapeau 🎩", "Des lunettes 🤓", "Un manteau 🧥"], "correct": 1 },
              { "question": "Qui essaya aussi 😹 ?", "options": ["Léna 👧", "Yaya 🐱", "Mamie 👵"], "correct": 1 }
            ]
        },
        {
            "title": "La Forêt qui Rigole 🌳😂",
            "image": "https://via.placeholder.com/600x400.png?text=Foret+rigolote",
            "text": [
              "En se promenant 🌳, Léna 👧 entendit des arbres qui rigolaient 😂.",
              "Yaya 🐱 grimpa et chatouilla les branches 🤭.",
              "Les oiseaux 🐦 se mirent à chanter une chanson rigolote 🎶.",
              "Tout l’endroit résonnait comme un grand concert 🎤.",
              "Léna 👧 et Yaya 🐱 dansaient au milieu de la forêt 💃."
            ],
            "quiz": [
              { "question": "Qui rigolait 😂 ?", "options": ["Les arbres 🌳", "Les fleurs 🌸", "Les nuages ☁️"], "correct": 0 },
              { "question": "Que fit Yaya 🐱 ?", "options": ["Elle grimpa 🌳", "Elle dormit 😴", "Elle mangea 🍽️"], "correct": 0 },
              { "question": "Que firent Léna et Yaya 💃 ?", "options": ["Elles dansèrent 💃", "Elles dormirent 😴", "Elles coururent 🏃‍♀️"], "correct": 0 }
            ]
        },
        {
            "title": "Le Chapeau de Pirate 🏴‍☠️🎩",
            "image": "https://via.placeholder.com/600x400.png?text=Chapeau+pirate",
            "text": [
              "Léna 👧 trouva un chapeau de pirate 🏴‍☠️ dans un coffre.",
              "Yaya 🐱 le porta… et se crut capitaine ⛵.",
              "Elle ordonna : ‘À l’abordage !’ ⚔️",
              "Elles jouèrent à chercher un trésor 💰 dans le jardin.",
              "Le trésor ? Une boîte de biscuits au chocolat 🍪 !"
            ],
            "quiz": [
              { "question": "Quel chapeau trouvèrent-elles 🎩 ?", "options": ["Un chapeau de magicien ✨", "Un chapeau de pirate 🏴‍☠️", "Un chapeau de cowboy 🤠"], "correct": 1 },
              { "question": "Que cria Yaya 🐱 ?", "options": ["Bonjour 👋", "À l’abordage ⚔️", "Bonne nuit 😴"], "correct": 1 },
              { "question": "Quel était le trésor 💰 ?", "options": ["Des bijoux 💎", "Des biscuits 🍪", "Un jouet 🧸"], "correct": 1 }
            ]
        },
        {
            "title": "La Pluie de Bonbons 🍬🌧️",
            "image": "https://via.placeholder.com/600x400.png?text=Pluie+bonbons",
            "text": [
              "Un jour, le ciel devint bizarre 🌥️.",
              "Au lieu de pluie 💧, il tomba des bonbons 🍬 !",
              "Léna 👧 ouvrit son parapluie ☂️ pour les attraper.",
              "Yaya 🐱 courait partout en mangeant 😋.",
              "La rue entière devint une fête de bonbons 🎉."
            ],
            "quiz": [
              { "question": "Qu’est-ce qui tombait du ciel 🌧️ ?", "options": ["Des bonbons 🍬", "Des ballons 🎈", "Des fleurs 🌸"], "correct": 0 },
              { "question": "Que fit Léna 👧 ☂️ ?", "options": ["Elle se cacha 🙈", "Elle attrapa des bonbons 🍬", "Elle dormit 😴"], "correct": 1 },
              { "question": "Qui mangeait partout 😋 ?", "options": ["Léna 👧", "Yaya 🐱", "Un chien 🐶"], "correct": 1 }
            ]
        },
        {
            "title": "La Fusée en Carton 🚀📦",
            "image": "https://via.placeholder.com/600x400.png?text=Fusee+carton",
            "text": [
              "Léna 👧 construisit une fusée 🚀 avec un carton 📦.",
              "Yaya 🐱 monta à bord comme copilote 👩‍🚀.",
              "3…2…1… décollage ✨ !",
              "Elles voyagèrent jusqu’à la lune 🌕 (dans le jardin !).",
              "Puis elles revinrent pour manger des crêpes 🥞."
            ],
            "quiz": [
              { "question": "Avec quoi Léna construisit-elle 🚀 ?", "options": ["Du bois 🪵", "Un carton 📦", "Des briques 🧱"], "correct": 1 },
              { "question": "Qui était copilote 👩‍🚀 ?", "options": ["Un robot 🤖", "Yaya 🐱", "Mamie 👵"], "correct": 1 },
              { "question": "Où allèrent-elles 🌕 ?", "options": ["Sur la lune 🌕", "Sur Mars 🔴", "Dans la mer 🌊"], "correct": 0 }
            ]
        },
        {
            "title": "Le Cirque de Yaya 🎪🐱",
            "image": "https://via.placeholder.com/600x400.png?text=Cirque+Yaya",
            "text": [
              "Yaya 🐱 décida d’ouvrir un cirque 🎪 dans le salon.",
              "Léna 👧 vendait les tickets 🎟️.",
              "Yaya jonglait avec des pelotes de laine 🧶.",
              "Puis elle sauta dans un cerceau en feu imaginaire 🔥 (ouf, en carton 😅).",
              "Le public invisible applaudit 👏 très fort !"
            ],
            "quiz": [
              { "question": "Qui ouvrit un cirque 🎪 ?", "options": ["Léna 👧", "Yaya 🐱", "Papa 👨"], "correct": 1 },
              { "question": "Avec quoi jonglait Yaya 🐱 🧶 ?", "options": ["Des ballons 🎈", "Des pelotes de laine 🧶", "Des pommes 🍏"], "correct": 1 },
              { "question": "Que faisait le public 👏 ?", "options": ["Il riait 😂", "Il applaudissait 👏", "Il dormait 😴"], "correct": 1 }
            ]
        },
        {
            "title": "Le Jardin Arc-en-ciel 🌼🌈",
            "image": "https://via.placeholder.com/600x400.png?text=Jardin+arc-en-ciel",
            "text": [
              "Léna 👧 planta des graines de toutes les couleurs 🎨.",
              "Yaya 🐱 arrosait avec un arrosoir magique ✨.",
              "Chaque fleur sortait dans une couleur de l’arc-en-ciel 🌈.",
              "Les papillons 🦋 faisaient la ronde autour des pétales.",
              "Le soir, le jardin brillait comme des guirlandes lumineuses 💡."
            ],
            "quiz": [
              { "question": "Qui planta les graines 🌼 ?", "options": ["Yaya 🐱", "Léna 👧", "Le vent 🍃"], "correct": 1 },
              { "question": "Avec quoi Yaya arrosait-elle ✨ ?", "options": ["Un arrosoir magique ✨", "Une bouteille 🍼", "Un seau 🪣"], "correct": 0 },
              { "question": "Que firent les papillons 🦋 ?", "options": ["Ils dormaient 😴", "Ils faisaient la ronde 🦋", "Ils s’envolèrent loin 🛫"], "correct": 1 }
            ]
        },
        {
            "title": "Le Robot Rieur 🤖😂",
            "image": "https://via.placeholder.com/600x400.png?text=Robot+Rieur",
            "text": [
              "Léna 👧 construisit un petit robot en carton 🤖.",
              "Yaya 🐱 programma un bouton spécial ▶️.",
              "Chaque fois qu’on appuyait dessus, le robot gloussait 😂.",
              "Il faisait aussi danser ses bras comme un DJ 🎶.",
              "Toute la maison faisait la fête avec lui 🎉."
            ],
            "quiz": [
              { "question": "Avec quoi fut construit le robot 🤖 ?", "options": ["Du carton 📦", "Du métal ⚙️", "Du verre 🪟"], "correct": 0 },
              { "question": "Que faisait le robot en riant 😂 ?", "options": ["Il dormait 😴", "Il dansait 🎶", "Il lisait 📖"], "correct": 1 },
              { "question": "Qui a appuyé sur le bouton ▶️ ?", "options": ["Yaya 🐱", "Le robot 🤖", "Personne"], "correct": 0 }
            ]
        },
        {
            "title": "La Pluie de Bulles 🫧☔",
            "image": "https://via.placeholder.com/600x400.png?text=Pluie+de+bulles",
            "text": [
              "Un nuage passa au-dessus de la maison ☁️.",
              "Au lieu de pluie, il tomba des bulles géantes 🫧.",
              "Léna 👧 et Yaya 🐱 sautaient pour les attraper 🤾‍♀️.",
              "Quand une bulle éclatait, elle sentait la fraise 🍓.",
              "Elles remplirent un panier de parfums sucrés 🍭."
            ],
            "quiz": [
              { "question": "Que tomba du ciel 🫧 ?", "options": ["De la pluie 💧", "Des bulles 🫧", "De la neige ❄️"], "correct": 1 },
              { "question": "Quel parfum avaient les bulles 🍓 ?", "options": ["Vanille 🍦", "Fraise 🍓", "Menthe 🍃"], "correct": 1 },
              { "question": "Que firent Léna et Yaya 🧺 ?", "options": ["Elles regardèrent la télé 📺", "Elles remplissaient un panier 🍭", "Elles firent une sieste 😴"], "correct": 1 }
            ]
        }
    ];
    const colorMap = {
        '🟢 Vert': 'green', '🟠 Orange': 'orange', '🟣 Violet': 'purple',
        '🔵 Bleu': 'blue', '🟡 Jaune': 'yellow', '🔴 Rouge': 'red',
        '⚫ Noir': 'black', '⚪ Blanc': 'white', '💗 Rose': 'pink',
        '💧 Bleu Clair': 'light-blue', '🍃 Vert Clair': 'light-green',
        '🤎 Marron': 'brown', '🍫 Chocolat': 'chocolate', '💜 Lavande': 'lavender', '🍷 Bordeaux': 'bordeaux',
    };

    const COLOR_MIX_LIBRARY = [
        {
            id: 'mix-blue-yellow',
            inputs: ['🔵 Bleu', '🟡 Jaune'],
            result: '🟢 Vert',
            explanation: 'Le bleu et le jaune deviennent un joli vert.',
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-red-yellow',
            inputs: ['🔴 Rouge', '🟡 Jaune'],
            result: '🟠 Orange',
            explanation: 'Jaune et rouge créent un orange lumineux.',
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-blue-red',
            inputs: ['🔵 Bleu', '🔴 Rouge'],
            result: '🟣 Violet',
            explanation: 'Mélanger du bleu et du rouge donne du violet.',
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-red-white',
            inputs: ['🔴 Rouge', '⚪ Blanc'],
            result: '💗 Rose',
            explanation: 'Un peu de blanc adoucit le rouge en rose.',
            minLevel: 4,
            maxLevel: 12
        },
        {
            id: 'mix-blue-white',
            inputs: ['🔵 Bleu', '⚪ Blanc'],
            result: '💧 Bleu Clair',
            explanation: 'Le bleu devient plus léger avec du blanc.',
            minLevel: 4,
            maxLevel: 12
        },
        {
            id: 'mix-green-white',
            inputs: ['🟢 Vert', '⚪ Blanc'],
            result: '🍃 Vert Clair',
            explanation: 'Du blanc rend le vert très doux.',
            minLevel: 5,
            maxLevel: 12
        },
        {
            id: 'mix-red-black',
            inputs: ['🔴 Rouge', '⚫ Noir'],
            result: '🍷 Bordeaux',
            explanation: 'Noir et rouge foncent la couleur en bordeaux.',
            minLevel: 7,
            maxLevel: 12
        },
        {
            id: 'mix-orange-black',
            inputs: ['🟠 Orange', '⚫ Noir'],
            result: '🍫 Chocolat',
            explanation: 'Orange avec un peu de noir crée une teinte chocolat.',
            minLevel: 8,
            maxLevel: 12
        },
        {
            id: 'mix-green-red',
            inputs: ['🟢 Vert', '🔴 Rouge'],
            result: '🤎 Marron',
            explanation: 'Vert et rouge se mélangent pour devenir marron.',
            minLevel: 8,
            maxLevel: 12
        },
        {
            id: 'mix-violet-white',
            inputs: ['🟣 Violet', '⚪ Blanc'],
            result: '💜 Lavande',
            explanation: 'Du blanc dans le violet donne une jolie lavande.',
            minLevel: 9,
            maxLevel: 12
        }
    ];

    const sortingLevels = [
        {
            level: 1,
            type: 'color',
            instruction: 'Classe chaque objet dans le panier de la bonne couleur.',
            categories: [
                { id: 'red', label: 'Rouge 🔴' },
                { id: 'blue', label: 'Bleu 🔵' }
            ],
            items: [
                { id: 'apple', emoji: '🍎', label: 'Pomme', target: 'red' },
                { id: 'ball', emoji: '🔵', label: 'Balle', target: 'blue' },
                { id: 'car', emoji: '🚗', label: 'Voiture', target: 'red' },
                { id: 'fish', emoji: '🐟', label: 'Poisson', target: 'blue' }
            ]
        },
        {
            level: 2,
            type: 'color',
            instruction: 'Rouge, bleu ou vert ? Trie les objets !',
            categories: [
                { id: 'red', label: 'Rouge 🔴' },
                { id: 'blue', label: 'Bleu 🔵' },
                { id: 'green', label: 'Vert 🟢' }
            ],
            items: [
                { id: 'leaf', emoji: '🍃', label: 'Feuille', target: 'green' },
                { id: 'strawberry', emoji: '🍓', label: 'Fraise', target: 'red' },
                { id: 'hat', emoji: '🧢', label: 'Casquette', target: 'blue' },
                { id: 'frog', emoji: '🐸', label: 'Grenouille', target: 'green' },
                { id: 'heart', emoji: '❤️', label: 'Cœur', target: 'red' }
            ]
        },
        {
            level: 3,
            type: 'color',
            instruction: 'Observe bien les couleurs pour tout classer.',
            categories: [
                { id: 'red', label: 'Rouge 🔴' },
                { id: 'blue', label: 'Bleu 🔵' },
                { id: 'green', label: 'Vert 🟢' }
            ],
            items: [
                { id: 'flower', emoji: '🌹', label: 'Fleur', target: 'red' },
                { id: 'balloon', emoji: '🎈', label: 'Ballon', target: 'red' },
                { id: 'whale', emoji: '🐋', label: 'Baleine', target: 'blue' },
                { id: 'gift', emoji: '🎁', label: 'Cadeau', target: 'blue' },
                { id: 'dragon', emoji: '🐉', label: 'Dragon', target: 'green' },
                { id: 'cactus', emoji: '🌵', label: 'Cactus', target: 'green' }
            ]
        },
        {
            level: 4,
            type: 'shape',
            instruction: 'Carré, rond ou triangle ? Classe selon la forme.',
            categories: [
                { id: 'square', label: 'Carré ⬜' },
                { id: 'circle', label: 'Rond ⚪' },
                { id: 'triangle', label: 'Triangle 🔺' }
            ],
            items: [
                { id: 'frame', emoji: '🖼️', label: 'Cadre', target: 'square' },
                { id: 'clock', emoji: '🕒', label: 'Horloge', target: 'circle' },
                { id: 'slice', emoji: '🍕', label: 'Pizza', target: 'triangle' },
                { id: 'giftbox', emoji: '🎁', label: 'Cadeau', target: 'square' },
                { id: 'coin', emoji: '🪙', label: 'Pièce', target: 'circle' }
            ]
        },
        {
            level: 5,
            type: 'shape',
            instruction: 'Nouveau défi de formes, regarde bien !',
            categories: [
                { id: 'square', label: 'Carré ⬜' },
                { id: 'circle', label: 'Rond ⚪' },
                { id: 'triangle', label: 'Triangle 🔺' }
            ],
            items: [
                { id: 'chocolate', emoji: '🍫', label: 'Chocolat', target: 'square' },
                { id: 'basketball', emoji: '🏀', label: 'Ballon', target: 'circle' },
                { id: 'cone', emoji: '🍦', label: 'Glace', target: 'triangle' },
                { id: 'dice', emoji: '🎲', label: 'Dé', target: 'square' },
                { id: 'planet', emoji: '🪐', label: 'Planète', target: 'circle' },
                { id: 'flag', emoji: '🚩', label: 'Drapeau', target: 'triangle' }
            ]
        },
        {
            level: 6,
            type: 'shape',
            instruction: 'Encore plus de formes magiques à classer.',
            categories: [
                { id: 'square', label: 'Carré ⬜' },
                { id: 'circle', label: 'Rond ⚪' },
                { id: 'triangle', label: 'Triangle 🔺' }
            ],
            items: [
                { id: 'giftbag', emoji: '🛍️', label: 'Sac', target: 'square' },
                { id: 'cookie', emoji: '🍪', label: 'Cookie', target: 'circle' },
                { id: 'cheese', emoji: '🧀', label: 'Fromage', target: 'triangle' },
                { id: 'present', emoji: '🎁', label: 'Surprise', target: 'square' },
                { id: 'coin2', emoji: '💿', label: 'Disque', target: 'circle' },
                { id: 'warning', emoji: '⚠️', label: 'Panneau', target: 'triangle' }
            ]
        },
        {
            level: 7,
            type: 'size',
            instruction: 'Classe les objets selon leur taille.',
            categories: [
                { id: 'big', label: 'Grand 🐘' },
                { id: 'small', label: 'Petit 🐭' }
            ],
            items: [
                { id: 'elephant', emoji: '🐘', label: 'Éléphant', target: 'big' },
                { id: 'mouse', emoji: '🐭', label: 'Souris', target: 'small' },
                { id: 'mountain', emoji: '⛰️', label: 'Montagne', target: 'big' },
                { id: 'ladybug', emoji: '🐞', label: 'Coccinelle', target: 'small' },
                { id: 'whale2', emoji: '🐳', label: 'Baleine', target: 'big' }
            ]
        },
        {
            level: 8,
            type: 'size',
            instruction: 'Grand ou petit ? Fais-les sauter dans le bon panier.',
            categories: [
                { id: 'big', label: 'Grand 🦒' },
                { id: 'small', label: 'Petit 🐣' }
            ],
            items: [
                { id: 'giraffe', emoji: '🦒', label: 'Girafe', target: 'big' },
                { id: 'chick', emoji: '🐥', label: 'Poussin', target: 'small' },
                { id: 'bus', emoji: '🚌', label: 'Bus', target: 'big' },
                { id: 'pencil', emoji: '✏️', label: 'Crayon', target: 'small' },
                { id: 'tree', emoji: '🌳', label: 'Arbre', target: 'big' },
                { id: 'acorn', emoji: '🌰', label: 'Gland', target: 'small' }
            ]
        },
        {
            level: 9,
            type: 'mixed',
            instruction: 'Associe la bonne couleur et la bonne forme.',
            categories: [
                { id: 'red-circle', label: 'Rond Rouge 🔴' },
                { id: 'blue-square', label: 'Carré Bleu 🔷' },
                { id: 'green-triangle', label: 'Triangle Vert 🟢🔺' }
            ],
            items: [
                { id: 'lollipop', emoji: '🍭', label: 'Sucette', target: 'red-circle' },
                { id: 'giftblue', emoji: '🎁', label: 'Paquet', target: 'blue-square' },
                { id: 'treeTriangle', emoji: '🎄', label: 'Sapin', target: 'green-triangle' },
                { id: 'shield', emoji: '🛡️', label: 'Bouclier', target: 'blue-square' },
                { id: 'badge', emoji: '🔴', label: 'Jeton', target: 'red-circle' },
                { id: 'pennant', emoji: '🚩', label: 'Fanion', target: 'green-triangle' }
            ]
        },
        {
            level: 10,
            type: 'mixed',
            instruction: 'Dernier défi ! Combine couleur et forme correctement.',
            categories: [
                { id: 'yellow-circle', label: 'Rond Jaune 🟡' },
                { id: 'purple-square', label: 'Carré Violet 🟪' },
                { id: 'orange-triangle', label: 'Triangle Orange 🟠' }
            ],
            items: [
                { id: 'sun', emoji: '☀️', label: 'Soleil', target: 'yellow-circle' },
                { id: 'cheeseTriangle', emoji: '🧀', label: 'Fromage', target: 'orange-triangle' },
                { id: 'magicBox', emoji: '🎆', label: 'Boîte magique', target: 'purple-square' },
                { id: 'flowerYellow', emoji: '🌼', label: 'Fleur', target: 'yellow-circle' },
                { id: 'giftPurple', emoji: '🎁', label: 'Cadeau violet', target: 'purple-square' },
                { id: 'coneOrange', emoji: '🎃', label: 'Lantern', target: 'orange-triangle' }
            ]
        }
    ];

    const riddleLevels = [
        {
            level: 1,
            theme: "Animaux câlins",
            completionMessage: "Tu connais les animaux câlins !",
            questions: [
                {
                    prompt: "Je suis petit, je miaule doucement et j'adore les câlins. Qui suis-je ?",
                    options: ["Un chaton", "Un lion", "Un hibou"],
                    answer: 0,
                    hint: "Je vis souvent dans la maison.",
                    success: "Oui, le chaton adore les câlins !",
                    reward: { stars: 6, coins: 4 }
                },
                {
                    prompt: "Je saute dans la prairie et je grignote des carottes. Qui suis-je ?",
                    options: ["Un lapin", "Un cheval", "Un poisson"],
                    answer: 0,
                    hint: "Mes oreilles sont très longues.",
                    success: "Le lapin adore bondir !",
                    reward: { stars: 6, coins: 4 }
                },
                {
                    prompt: "Je porte une carapace et je marche très lentement. Qui suis-je ?",
                    options: ["Une tortue", "Une souris", "Un chien"],
                    answer: 0,
                    hint: "On me voit souvent au soleil.",
                    success: "Oui, la tortue avance lentement !",
                    reward: { stars: 6, coins: 4 }
                },
                {
                    prompt: "Je suis rayé et je ronronne comme un grand chat. Qui suis-je ?",
                    options: ["Un tigre", "Un panda", "Un pingouin"],
                    answer: 0,
                    hint: "Je vis dans la jungle.",
                    success: "Le tigre est un grand chat rayé !",
                    reward: { stars: 6, coins: 4 }
                },
                {
                    prompt: "Je dors accroché la tête en bas dans une grotte. Qui suis-je ?",
                    options: ["Une chauve-souris", "Un renard", "Un mouton"],
                    answer: 0,
                    hint: "Je suis un animal de la nuit.",
                    success: "La chauve-souris dort à l'envers !",
                    reward: { stars: 6, coins: 4 }
                }
            ]
        },
        {
            level: 2,
            theme: "Fruits colorés",
            completionMessage: "Tu reconnais les fruits colorés !",
            questions: [
                {
                    prompt: "Je suis jaune et on me pèle avant de me manger. Qui suis-je ?",
                    options: ["Une banane", "Un kiwi", "Une prune"],
                    answer: 0,
                    hint: "On me tient par ma queue.",
                    success: "La banane est délicieuse !",
                    reward: { stars: 7, coins: 5 }
                },
                {
                    prompt: "Je suis verte ou rouge et je croque sous la dent. Qui suis-je ?",
                    options: ["Une pomme", "Une tomate", "Une cerise"],
                    answer: 0,
                    hint: "On me trouve souvent dans les paniers de pique-nique.",
                    success: "Bravo, la pomme croque !",
                    reward: { stars: 7, coins: 5 }
                },
                {
                    prompt: "Je suis orange et j'offre un jus plein de vitamine C. Qui suis-je ?",
                    options: ["Une orange", "Un citron", "Une fraise"],
                    answer: 0,
                    hint: "Mon jus te réveille le matin.",
                    success: "L'orange est pleine d'énergie !",
                    reward: { stars: 7, coins: 5 }
                },
                {
                    prompt: "Je suis petite, rouge et j'ai des grains sur ma peau. Qui suis-je ?",
                    options: ["Une fraise", "Une prune", "Une poire"],
                    answer: 0,
                    hint: "Je pousse dans le jardin au printemps.",
                    success: "La fraise est toute rouge !",
                    reward: { stars: 7, coins: 5 }
                },
                {
                    prompt: "J'ai une couronne piquante mais un cœur doré. Qui suis-je ?",
                    options: ["Un ananas", "Une mangue", "Une banane"],
                    answer: 0,
                    hint: "Je viens souvent des îles.",
                    success: "L'ananas est royal !",
                    reward: { stars: 7, coins: 5 }
                }
            ]
        },
        {
            level: 3,
            theme: "Amis de la ferme",
            completionMessage: "Tu as reconnu tous les animaux de la ferme !",
            questions: [
                {
                    prompt: "Je me réveille très tôt et je crie cocorico. Qui suis-je ?",
                    options: ["Un coq", "Un canard", "Un hibou"],
                    answer: 0,
                    hint: "Je réveille toute la ferme.",
                    success: "Cocorico, bien joué !",
                    reward: { stars: 8, coins: 5 }
                },
                {
                    prompt: "Je donne du lait blanc et j'aime manger de l'herbe. Qui suis-je ?",
                    options: ["Une vache", "Une chèvre", "Une poule"],
                    answer: 0,
                    hint: "Je me fais traire chaque matin.",
                    success: "La vache fournit du lait !",
                    reward: { stars: 8, coins: 5 }
                },
                {
                    prompt: "Je donne de la laine douce pour fabriquer des pulls. Qui suis-je ?",
                    options: ["Un mouton", "Un cheval", "Un lapin"],
                    answer: 0,
                    hint: "On me tond au printemps.",
                    success: "La laine vient du mouton !",
                    reward: { stars: 8, coins: 5 }
                },
                {
                    prompt: "J'adore me rouler dans la boue pour me rafraîchir. Qui suis-je ?",
                    options: ["Un cochon", "Un chien", "Un lama"],
                    answer: 0,
                    hint: "Je fais groin groin.",
                    success: "Le cochon adore la boue !",
                    reward: { stars: 8, coins: 5 }
                },
                {
                    prompt: "Je porte parfois un jockey pour courir très vite. Qui suis-je ?",
                    options: ["Un cheval", "Une vache", "Un lapin"],
                    answer: 0,
                    hint: "Je galope au haras.",
                    success: "Le cheval est un champion !",
                    reward: { stars: 8, coins: 5 }
                }
            ]
        },
        {
            level: 4,
            theme: "Fruits tropicaux",
            completionMessage: "Tes papilles adorent les fruits tropicaux !",
            questions: [
                {
                    prompt: "Ma chair est orange, douce et juteuse. Je tombe parfois des arbres en martinique. Qui suis-je ?",
                    options: ["Une mangue", "Une prune", "Une pêche"],
                    answer: 0,
                    hint: "Je suis un fruit tropical qui commence par la lettre M.",
                    success: "La mangue est un soleil sucré !",
                    reward: { stars: 9, coins: 6 }
                },
                {
                    prompt: "Je suis verte à l'extérieur, rouge à l'intérieur et je rafraîchis tout l'été. Qui suis-je ?",
                    options: ["Une pastèque", "Une prune", "Un citron"],
                    answer: 0,
                    hint: "Je suis très lourde et pleine de graines.",
                    success: "La pastèque désaltère tout le monde !",
                    reward: { stars: 9, coins: 6 }
                },
                {
                    prompt: "Je suis petit, brun dehors et vert brillant dedans. Qui suis-je ?",
                    options: ["Un kiwi", "Une figue", "Une prune"],
                    answer: 0,
                    hint: "Je me mange à la cuillère.",
                    success: "Le kiwi est plein de vitamines !",
                    reward: { stars: 9, coins: 6 }
                },
                {
                    prompt: "On me casse pour boire mon eau sucrée au bord de la plage. Qui suis-je ?",
                    options: ["Une noix de coco", "Un melon", "Une mandarine"],
                    answer: 0,
                    hint: "Ma coque est très dure.",
                    success: "La noix de coco rafraîchit !",
                    reward: { stars: 9, coins: 6 }
                },
                {
                    prompt: "Je ressemble à une grosse baie violette et on me croque grain par grain. Qui suis-je ?",
                    options: ["Une grappe de raisin", "Une myrtille", "Une mûre"],
                    answer: 0,
                    hint: "Je suis souvent servi avec du fromage.",
                    success: "Les raisins sont délicieux !",
                    reward: { stars: 9, coins: 6 }
                }
            ]
        },
        {
            level: 5,
            theme: "Animaux malins",
            completionMessage: "Tu connais bien les animaux malins !",
            questions: [
                {
                    prompt: "Je hulule la nuit avec mes grands yeux ronds. Qui suis-je ?",
                    options: ["Un hibou", "Un manchot", "Un chien"],
                    answer: 0,
                    hint: "Je surveille la forêt pendant que tu dors.",
                    success: "Le hibou observe dans la nuit !",
                    reward: { stars: 10, coins: 7 }
                },
                {
                    prompt: "Je suis rusé, ma queue est rousse et je vis dans le bois. Qui suis-je ?",
                    options: ["Un renard", "Un ours", "Un loup"],
                    answer: 0,
                    hint: "On me dit parfois voleur de poules.",
                    success: "Quel renard astucieux !",
                    reward: { stars: 10, coins: 7 }
                },
                {
                    prompt: "Je chante coâ coâ près des mares le soir. Qui suis-je ?",
                    options: ["Une grenouille", "Un cygne", "Un crocodile"],
                    answer: 0,
                    hint: "Je saute dans l'eau et j'ai la peau verte.",
                    success: "La grenouille adore chanter !",
                    reward: { stars: 10, coins: 7 }
                },
                {
                    prompt: "Je grimpe aux arbres et je mange des noisettes. Qui suis-je ?",
                    options: ["Un écureuil", "Un blaireau", "Un hérisson"],
                    answer: 0,
                    hint: "Ma queue est en panache.",
                    success: "L'écureuil est très agile !",
                    reward: { stars: 10, coins: 7 }
                },
                {
                    prompt: "Quand je suis surpris, je roule sur moi-même en boule piquante. Qui suis-je ?",
                    options: ["Un hérisson", "Un castor", "Un lapin"],
                    answer: 0,
                    hint: "On me trouve parfois dans le jardin.",
                    success: "Le hérisson se protège bien !",
                    reward: { stars: 10, coins: 7 }
                }
            ]
        },
        {
            level: 6,
            theme: "Salade de fruits",
            completionMessage: "Tu as préparé une salade de fruits magique !",
            questions: [
                {
                    prompt: "Je suis violet et je laisse parfois une moustache colorée sur ta bouche. Qui suis-je ?",
                    options: ["Une myrtille", "Un citron", "Une poire"],
                    answer: 0,
                    hint: "Je suis tout petit et je pousse sur des buissons.",
                    success: "La myrtille colore la langue !",
                    reward: { stars: 11, coins: 8 }
                },
                {
                    prompt: "Je suis rose à l'extérieur et j'ai un gros noyau. Qui suis-je ?",
                    options: ["Une pêche", "Une pomme", "Une poire"],
                    answer: 0,
                    hint: "Ma peau est toute douce.",
                    success: "La pêche est veloutée !",
                    reward: { stars: 11, coins: 8 }
                },
                {
                    prompt: "Je suis jaune, très acide et on m'utilise pour faire de la limonade. Qui suis-je ?",
                    options: ["Un citron", "Une banane", "Un abricot"],
                    answer: 0,
                    hint: "On fait une grimace en me goûtant.",
                    success: "Le citron pique la langue !",
                    reward: { stars: 11, coins: 8 }
                },
                {
                    prompt: "Je suis allongée, verte à l'extérieur et rose avec des pépins noirs à l'intérieur. Qui suis-je ?",
                    options: ["Une pastèque", "Une papaye", "Une figue"],
                    answer: 0,
                    hint: "On me partage en grosses tranches l'été.",
                    success: "La pastèque rafraîchit !",
                    reward: { stars: 11, coins: 8 }
                },
                {
                    prompt: "Je suis petite, jaune et on me trouve souvent en grappe avec mes amis. Qui suis-je ?",
                    options: ["Un grain de raisin", "Un pois", "Une prune"],
                    answer: 0,
                    hint: "On me cueille par grappes.",
                    success: "Les raisins dorés sont délicieux !",
                    reward: { stars: 11, coins: 8 }
                }
            ]
        },
        {
            level: 7,
            theme: "Voyage sous la mer",
            completionMessage: "Tu as exploré l'océan !",
            questions: [
                {
                    prompt: "Je suis un mammifère qui saute hors de l'eau et j'adore jouer. Qui suis-je ?",
                    options: ["Un dauphin", "Une baleine", "Un requin"],
                    answer: 0,
                    hint: "Je siffle pour parler avec mes amis.",
                    success: "Le dauphin est très joueur !",
                    reward: { stars: 12, coins: 9 }
                },
                {
                    prompt: "J'ai huit bras et je peux changer de couleur. Qui suis-je ?",
                    options: ["Une pieuvre", "Une sardine", "Une tortue"],
                    answer: 0,
                    hint: "Je me cache dans les rochers.",
                    success: "La pieuvre est caméléon !",
                    reward: { stars: 12, coins: 9 }
                },
                {
                    prompt: "Je marche sur le sable de côté avec mes pinces. Qui suis-je ?",
                    options: ["Un crabe", "Un ours polaire", "Un phoque"],
                    answer: 0,
                    hint: "Je laisse des traces en zigzag.",
                    success: "Le crabe marche de travers !",
                    reward: { stars: 12, coins: 9 }
                },
                {
                    prompt: "Je suis géante, j'ai un jet d'eau sur ma tête et je chante sous l'eau. Qui suis-je ?",
                    options: ["Une baleine", "Une raie", "Une otarie"],
                    answer: 0,
                    hint: "Je suis l'un des plus grands animaux du monde.",
                    success: "La baleine chante fort !",
                    reward: { stars: 12, coins: 9 }
                },
                {
                    prompt: "Je porte une carapace et je nage longtemps sans me fatiguer. Qui suis-je ?",
                    options: ["Une tortue de mer", "Un hippopotame", "Une grenouille"],
                    answer: 0,
                    hint: "Je pond mes œufs sur le sable.",
                    success: "La tortue de mer voyage loin !",
                    reward: { stars: 12, coins: 9 }
                }
            ]
        },
        {
            level: 8,
            theme: "Desserts fruités",
            completionMessage: "Tes desserts fruités sont prêts !",
            questions: [
                {
                    prompt: "Je suis petite, rouge foncé et je repose souvent sur un gâteau. Qui suis-je ?",
                    options: ["Une cerise", "Une framboise", "Une prune"],
                    answer: 0,
                    hint: "On me met aussi sur les glaces.",
                    success: "La cerise embellit les desserts !",
                    reward: { stars: 13, coins: 10 }
                },
                {
                    prompt: "Je suis rose, pleine de graines et parfaite en sorbet. Qui suis-je ?",
                    options: ["Une framboise", "Une figue", "Une groseille"],
                    answer: 0,
                    hint: "Je pousse en petits buissons.",
                    success: "La framboise est sucrée !",
                    reward: { stars: 13, coins: 10 }
                },
                {
                    prompt: "Je suis longue, jaune clair et pleine de petites graines noires à l'intérieur. Qui suis-je ?",
                    options: ["Une vanille", "Une banane", "Une mangue"],
                    answer: 0,
                    hint: "On m'utilise pour parfumer les crèmes.",
                    success: "La gousse de vanille sent bon !",
                    reward: { stars: 13, coins: 10 }
                },
                {
                    prompt: "Je suis verte claire, toute douce et je deviens orange quand je suis cuite dans une tarte. Qui suis-je ?",
                    options: ["La rhubarbe", "La poire", "Le raisin"],
                    answer: 0,
                    hint: "Je suis souvent mélangée avec des fraises.",
                    success: "La rhubarbe prépare de bonnes tartes !",
                    reward: { stars: 13, coins: 10 }
                },
                {
                    prompt: "Je suis jaune, sucré et je brille dans les salades de fruits exotiques. Qui suis-je ?",
                    options: ["Une mangue", "Une poire", "Une papaye"],
                    answer: 0,
                    hint: "Je suis très parfumée et juteuse.",
                    success: "La mangue est un dessert merveilleux !",
                    reward: { stars: 13, coins: 10 }
                }
            ]
        },
        {
            level: 9,
            theme: "Animaux fantastiques",
            completionMessage: "Ton encyclopédie magique est remplie d'animaux fantastiques !",
            questions: [
                {
                    prompt: "Je suis un cheval blanc avec une corne scintillante. Qui suis-je ?",
                    options: ["Une licorne", "Un poney", "Un zèbre"],
                    answer: 0,
                    hint: "Je vis dans les contes de fées.",
                    success: "La licorne est légendaire !",
                    reward: { stars: 15, coins: 11 }
                },
                {
                    prompt: "Je crache du feu et je protège des trésors. Qui suis-je ?",
                    options: ["Un dragon", "Un dinosaure", "Un griffon"],
                    answer: 0,
                    hint: "On me voit dans les histoires de chevaliers.",
                    success: "Le dragon garde ses trésors !",
                    reward: { stars: 15, coins: 11 }
                },
                {
                    prompt: "J'ai le corps d'un lion et des ailes d'aigle. Qui suis-je ?",
                    options: ["Un griffon", "Un phénix", "Un minotaure"],
                    answer: 0,
                    hint: "Je suis un mélange majestueux.",
                    success: "Le griffon surveille les royaumes !",
                    reward: { stars: 15, coins: 11 }
                },
                {
                    prompt: "Je renais de mes cendres dans un éclat de lumière. Qui suis-je ?",
                    options: ["Un phénix", "Un hibou", "Un serpent"],
                    answer: 0,
                    hint: "Je suis un oiseau de feu.",
                    success: "Le phénix renaît toujours !",
                    reward: { stars: 15, coins: 11 }
                },
                {
                    prompt: "Je nage comme un poisson mais je chante comme une humaine. Qui suis-je ?",
                    options: ["Une sirène", "Une baleine", "Un dauphin"],
                    answer: 0,
                    hint: "Je vis sous la mer dans les chansons.",
                    success: "Les sirènes savent chanter !",
                    reward: { stars: 15, coins: 11 }
                }
            ]
        },
        {
            level: 10,
            theme: "Panier surprise",
            completionMessage: "Tu as résolu toutes les énigmes du panier surprise !",
            questions: [
                {
                    prompt: "Je suis un fruit vert dehors, rouge dedans, et je porte une petite couronne. Qui suis-je ?",
                    options: ["Une fraise", "Un kiwi", "Une pastèque"],
                    answer: 0,
                    hint: "Je suis petite et je pousse près du sol.",
                    success: "La fraise royale est choisie !",
                    reward: { stars: 16, coins: 12 }
                },
                {
                    prompt: "Je suis un animal noir et blanc qui mange du bambou. Qui suis-je ?",
                    options: ["Un panda", "Un zèbre", "Un lynx"],
                    answer: 0,
                    hint: "Je vis en Chine et je grimpe dans les arbres.",
                    success: "Le panda est le roi du bambou !",
                    reward: { stars: 16, coins: 12 }
                },
                {
                    prompt: "Je suis orange, j'ai des crocs et je vis dans la savane. Qui suis-je ?",
                    options: ["Un lion", "Un renard", "Un tigre"],
                    answer: 0,
                    hint: "Je suis surnommé le roi des animaux.",
                    success: "Le lion règne sur la savane !",
                    reward: { stars: 16, coins: 12 }
                },
                {
                    prompt: "Je suis un fruit violet, j'ai des graines et je deviens confiture. Qui suis-je ?",
                    options: ["Une figue", "Une prune", "Une myrtille"],
                    answer: 0,
                    hint: "On m'ouvre pour voir plein de graines.",
                    success: "La figue régale les gourmands !",
                    reward: { stars: 16, coins: 12 }
                },
                {
                    prompt: "Je suis minuscule, j'avance vite en groupe et j'aime le sucre. Qui suis-je ?",
                    options: ["Une fourmi", "Une abeille", "Un papillon"],
                    answer: 0,
                    hint: "On me voit souvent sur les pique-niques.",
                    success: "Les fourmis sont très organisées !",
                    reward: { stars: 16, coins: 12 }
                }
            ]
        }
    ];

    const vowelLevels = [
        { level: 1, masked: 'ch_t', answer: 'a', options: ['a', 'e', 'i'], hint: 'Un animal qui ronronne.' },
        { level: 2, masked: 'l_ne', answer: 'u', options: ['u', 'o', 'a'], hint: 'Elle brille la nuit.' },
        { level: 3, masked: 'b_bé', answer: 'é', options: ['é', 'a', 'i'], hint: 'Il rit aux éclats.' },
        { level: 4, masked: 'cl__n', answer: 'ow', options: ['ow', 'oi', 'ou'], hint: 'Il fait rire au cirque.' },
        { level: 5, masked: 'p_tt__ m__s', answer: 'eeai', options: ['eeai', 'aaee', 'ieea'], hint: 'De petites maisons adorables.' },
        { level: 6, masked: 'm__on', answer: 'ai', options: ['ai', 'ei', 'oi'], hint: 'Elle aime le fromage !' },
        { level: 7, masked: 'La f__ danse.', answer: 'ée', options: ['ée', 'ai', 'ou'], hint: 'Une petite créature magique.' },
        { level: 8, masked: 'Il pl__t tr_s beau.', answer: 'euè', options: ['euè', 'eau', 'aie'], hint: 'On parle du temps.' },
        { level: 9, masked: 'Nous aim__ chanter.', answer: 'er', options: ['er', 'ai', 'ou'], hint: 'Une chorale amusante.' },
        { level: 10, masked: 'Les él_ves écrivent en s__r.', answer: 'èoi', options: ['èoi', 'eau', 'aio'], hint: 'Une phrase scolaire.' }
    ];

    const sequenceLevels = [
        { level: 1, sequence: ['1', '2', '3', '?'], options: ['4', '5', '6'], answer: '4', type: 'number' },
        { level: 2, sequence: ['2', '4', '6', '?'], options: ['7', '8', '9'], answer: '8', type: 'number' },
        { level: 3, sequence: ['5', '4', '3', '?'], options: ['2', '1', '6'], answer: '2', type: 'number' },
        { level: 4, sequence: ['🔴', '🔵', '🟢', '?'], options: ['🟡', '🔵', '🔴'], answer: '🟡', type: 'color' },
        { level: 5, sequence: ['🔴', '🟡', '🔴', '?'], options: ['🟢', '🔴', '🟡'], answer: '🟡', type: 'color' },
        { level: 6, sequence: ['🟢', '🟢', '🔵', '?'], options: ['🔵', '🟢', '🔴'], answer: '🔵', type: 'color' },
        { level: 7, sequence: ['⚫', '🔺', '⚫', '?'], options: ['🔺', '⚫', '⚪'], answer: '🔺', type: 'shape' },
        { level: 8, sequence: ['🔺', '⚪', '🔺', '?'], options: ['⚫', '🔺', '🔵'], answer: '⚪', type: 'shape' },
        { level: 9, sequence: ['1', '🔴', '2', '🔵', '?'], options: ['3', '🟢', '🔴'], answer: '3', type: 'mixed' },
        { level: 10, sequence: ['🔺', '1', '🔺', '2', '?'], options: ['🔺', '3', '🔵'], answer: '3', type: 'mixed' }
    ];
    const allQuestions = {
        additions: [], soustractions: [], multiplications: [], colors: [], stories: [], riddles: [], sorting: [], letters: [], shapes: [], vowels: [], sequences: [],
        'puzzle-magique': [], repartis: [], dictee: [], 'math-blitz': [], 'lecture-magique': [], raisonnement: [], review: []
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
    }

    function setupUI() {
        renderUserIdentity();
        setPrimaryTheme(userProfile.color);
        updateUI();
        applyActiveCosmetics();
    }

    function renderUserIdentity(newBadgeEmoji) {
        if (typeof newBadgeEmoji !== 'undefined') {
            activeBadgeEmoji = newBadgeEmoji;
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

        if (activeBadgeEmoji) {
            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'user-info__badge';
            badgeSpan.textContent = activeBadgeEmoji;
            badgeSpan.title = 'Badge spécial';
            userInfo.appendChild(badgeSpan);
        }
    }

    function setPrimaryTheme(color) {
        const safeColor = color || userProfile.color || '#a890f0';
        document.documentElement.style.setProperty('--primary', safeColor);
        document.documentElement.style.setProperty('--primary-light', lightenColor(safeColor, 0.22));
    }

    function setupEventListeners() {
        btnLogout.addEventListener('click', () => {
            historyTracker?.trackAppClose();
            localStorage.removeItem('mathsLenaUserProfile');
            window.location.href = 'login.html';
        });
        btnLogros.addEventListener('click', () => {
            window.location.href = 'logros.html';
        });

        userInfo.setAttribute('role', 'button');
        userInfo.setAttribute('tabindex', '0');
        userInfo.classList.add('user-info-home');

        const goHome = () => {
            saveProgress();
            showTopicMenu();
        };

        userInfo.addEventListener('click', goHome);
        userInfo.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goHome();
            }
        });

        if (btnShop) {
            btnShop.addEventListener('click', () => {
                openShop();
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
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && shopModal && shopModal.classList.contains('is-open')) {
                closeShop();
            }
        });
    }

    function loadProgress() {
        const progress = storage.loadUserProgress(userProfile.name);
        userScore = progress.userScore;
        answeredQuestions = progress.answeredQuestions;
        currentLevel = progress.currentLevel;
        ownedItems = Array.isArray(progress.ownedItems) ? progress.ownedItems : [];
        activeCosmetics = progress.activeCosmetics || { background: null, badge: null };
    }

    function saveProgress() {
        const progress = {
            userScore: userScore,
            answeredQuestions: answeredQuestions,
            currentLevel: currentLevel,
            ownedItems,
            activeCosmetics
        };
        storage.saveUserProgress(userProfile.name, progress);
    }

    function configureBackButton(label, handler) {
        btnBack.style.display = 'inline-block';
        btnBack.textContent = label;
        btnBack.onclick = () => {
            saveProgress();
            historyTracker?.endGame({ status: 'interrompu' });
            if (currentTopic === 'review') {
                activeReviewSkills = [];
            }
            handler();
        };
    }

    function markLevelCompleted(topic, level) {
        answeredQuestions[`${topic}-${level}`] = 'completed';
        saveProgress();
    }

    function createGameContext(topic, extra = {}) {
        return {
            topic,
            content,
            btnLogros,
            btnLogout,
            get currentLevel() {
                return currentLevel;
            },
            setCurrentLevel(level) {
                currentLevel = level;
                saveProgress();
            },
            userScore,
            awardReward(stars = 0, coins = 0) {
                if (typeof stars === 'number') { userScore.stars += stars; }
                if (typeof coins === 'number') { userScore.coins += coins; }
                userScore.stars = Math.max(0, userScore.stars);
                userScore.coins = Math.max(0, userScore.coins);
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
            markLevelCompleted: () => markLevelCompleted(topic, currentLevel),
            setAnsweredStatus: (status) => {
                answeredQuestions[`${topic}-${currentLevel}`] = status;
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
        currentTopic = 'puzzle-magique';
        currentLevel = level;
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
        currentTopic = 'repartis';
        currentLevel = level;
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
        currentTopic = 'dictee';
        currentLevel = level;
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
        currentTopic = 'math-blitz';
        currentLevel = level;
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
        currentTopic = 'lecture-magique';
        currentLevel = level;
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

    function launchRaisonnementLevel(level) {
        currentTopic = 'raisonnement';
        currentLevel = level;
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
        currentTopic = 'dictee';
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
        currentTopic = 'dictee';
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
        currentTopic = 'dictee';
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
        if (type === 'correct') {
            audioCorrect.currentTime = 0;
            audioCorrect.play();
        } else if (type === 'wrong') {
            audioWrong.currentTime = 0;
            audioWrong.play();
        } else if (type === 'coins' && audioCoins) {
            audioCoins.currentTime = 0;
            audioCoins.play();
        }
    }

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
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
            scoreStars.textContent = userScore.stars;
        }
        if (scoreCoins) {
            scoreCoins.textContent = userScore.coins;
        }
        if (levelDisplay) {
            levelDisplay.textContent = currentTopic === 'review'
                ? 'Session de repaso'
                : `Niveau ${currentLevel}`;
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
        if (typeof currentLevel === 'number' && currentLevel > 0) {
            document.body.classList.add(`body-level-${Math.min(currentLevel, LEVELS_PER_TOPIC)}`);
        }
    }

    function applyActiveCosmetics() {
        const backgroundItem = findShopItem(activeCosmetics.background);
        applyBackgroundTheme(backgroundItem);

        const badgeItem = findShopItem(activeCosmetics.badge);
        applyBadgeTheme(badgeItem);

        renderFloatingDecor();
    }

    function applyBackgroundTheme(backgroundItem) {
        if (backgroundItem && backgroundItem.type === 'background') {
            const palette = backgroundItem.palette || {};
            const [start, end] = palette.background || [];
            const accent = palette.accent || userProfile.color;
            const textColor = palette.textLight || DEFAULT_INK_COLOR;

            if (lastAppliedTheme !== backgroundItem.id) {
                lastAppliedTheme = backgroundItem.id;
                lastDecorKey = null;
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
            if (lastAppliedTheme !== '') {
                lastDecorKey = null;
            }
            lastAppliedTheme = '';
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
        activeBadgeEmoji = badgeItem?.emoji || null;
        renderUserIdentity();
    }

    function ensureDecorContainer() {
        if (decorContainer && decorContainer.isConnected) {
            return decorContainer;
        }
        decorContainer = document.getElementById('floatingDecor');
        if (!decorContainer) {
            if (!document.body) { return null; }
            decorContainer = document.createElement('div');
            decorContainer.id = 'floatingDecor';
            document.body?.appendChild(decorContainer);
        }
        return decorContainer;
    }

    function renderFloatingDecor() {
        const container = ensureDecorContainer();
        if (!container) { return; }
        const safeLevel = Number.isFinite(currentLevel) ? Math.min(Math.max(currentLevel, 1), 12) : 1;
        const icons = resolveDecorIcons(safeLevel);
        const decorKey = `${userProfile.avatar?.id || 'default'}-${safeLevel}-${icons.join('')}`;
        if (lastDecorKey === decorKey && container.childElementCount) {
            return;
        }
        lastDecorKey = decorKey;
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
            if (pauseReminderTimeout) {
                clearTimeout(pauseReminderTimeout);
                pauseReminderTimeout = null;
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
        if (!historyTracker) { return []; }
        const stats = historyTracker.getSkillStats() || {};
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
        'math:numberBond': skill => createNumberBondReviewQuestion(computeReviewLevel(skill)),
        'cognition:colors': skill => generateColorQuestion(Math.min(6, computeReviewLevel(skill))),
        'language:vowel': () => createVowelReviewQuestion(),
        'logic:sequence': () => createSequenceReviewQuestion(),
        'language:riddle': () => createRiddleReviewQuestion(),
        'reading:comprehension': () => createStoryReviewQuestion()
    };

    function buildReviewQuestions(skillTags, desiredCount = 6) {
        const stats = historyTracker?.getSkillStats() || {};
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
        if (!container || !historyTracker) { return; }
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
        activeReviewSkills = [...skillTags];
        allQuestions.review = questions;
        currentTopic = 'review';
        currentLevel = 1;
        currentQuestionIndex = 0;
        historyTracker?.startGame('review', 1, { skillTags });
        loadQuestion(0);
    }

    function schedulePauseReminder() {
        if (pauseReminderTimeout) {
            clearTimeout(pauseReminderTimeout);
        }
        pauseReminderTimeout = window.setTimeout(() => {
            pauseReminderTimeout = null;
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

        items.forEach(item => {
            const resolvedItem = findShopItem(item.id);
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

            const owned = ownedItems.includes(resolvedItem.id);
            const isActive = activeCosmetics[resolvedItem.type] === resolvedItem.id;

            if (!owned) {
                const canAfford = userScore.coins >= resolvedItem.priceCoins;
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

        if (!ownedItems.length) {
            const empty = document.createElement('li');
            empty.className = 'shop-inventory__empty';
            empty.textContent = 'Pas encore de récompense… Continue à jouer ✨';
            inventoryList.appendChild(empty);
            return;
        }

        ownedItems.forEach(itemId => {
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

            const isActive = activeCosmetics[item.type] === item.id;
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
        if (ownedItems.includes(item.id)) {
            showSuccessMessage('Tu possèdes déjà cette récompense.');
            return;
        }
        if (userScore.coins < item.priceCoins) {
            showErrorMessage('Pas assez de pièces pour cette récompense 💰.', item.priceCoins);
            return;
        }

        userScore.coins = Math.max(0, userScore.coins - item.priceCoins);
        ownedItems.push(item.id);
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
        if (!ownedItems.includes(item.id)) {
            ownedItems.push(item.id);
        }
        activeCosmetics[item.type] = item.id;
        applyActiveCosmetics();
        saveProgress();
        renderShopItems();
        renderInventory();
        if (!silent) {
            showSuccessMessage('Récompense activée ✨');
        }
    }

    function showSuccessMessage(message = positiveMessages[Math.floor(Math.random() * positiveMessages.length)]) {
        const promptEl = document.createElement('div');
        promptEl.className = 'prompt ok fx-pop';
        promptEl.textContent = message;
        content.appendChild(promptEl);
        speakText(message);
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
        playSound('wrong');
        setTimeout(() => promptEl.remove(), 2500);
    }

    function showConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    function ensureProgressTrackerElements() {
        if (!stageBottom) {
            return { tracker: null, label: null, fill: null, bar: null };
        }
        let tracker = document.getElementById('progressTracker');
        if (!tracker) {
            tracker = document.createElement('div');
            tracker.id = 'progressTracker';
            tracker.className = 'progress-tracker';
            tracker.innerHTML = `
                <div class="progress-tracker__label"></div>
                <div class="progress-tracker__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div class="progress-tracker__fill"></div>
                </div>
            `;
            stageBottom.prepend(tracker);
        }
        const label = tracker.querySelector('.progress-tracker__label');
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
        label.textContent = `Question ${currentQuestion} / ${safeTotal}`;
        fill.style.width = `${percent}%`;
        bar.setAttribute('aria-valuenow', String(percent));
        tracker.classList.add('is-visible');
    }

    function clearProgressTracker() {
        const tracker = document.getElementById('progressTracker');
        if (!tracker) { return; }
        tracker.classList.remove('is-visible');
        const fill = tracker.querySelector('.progress-tracker__fill');
        if (fill) {
            fill.style.width = '0%';
        }
        const label = tracker.querySelector('.progress-tracker__label');
        if (label) {
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

    // --- Content Generation ---
    function initializeQuestions() {
        for (let level = 1; level <= LEVELS_PER_TOPIC; level++) {
            for (let i = 0; i < QUESTIONS_PER_LEVEL; i++) {
                allQuestions.additions.push(generateMathQuestion('additions', level));
                allQuestions.soustractions.push(generateMathQuestion('soustractions', level));
                allQuestions.multiplications.push(generateMathQuestion('multiplications', level));
                allQuestions.colors.push(generateColorQuestion(level));
            }
        }
    }

    function generateMathQuestion(type, level) {
        let num1, num2, correct, max;
        const rewards = { additions: 10, soustractions: 10, multiplications: 15 };

        if (level <= 3) max = 10;
        else if (level <= 6) max = 50;
        else if (level <= 9) max = 100;
        else max = 200;

        switch(type) {
            case 'additions':
                num1 = Math.floor(Math.random() * (max - 1)) + 1;
                num2 = Math.floor(Math.random() * (max - num1)) + 1;
                correct = num1 + num2;
                break;
            case 'soustractions':
                num1 = Math.floor(Math.random() * (max - 1)) + 10;
                num2 = Math.floor(Math.random() * num1);
                correct = num1 - num2;
                break;
            case 'multiplications':
                if (level <= 5) {
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                } else if (level <= 9) {
                    num1 = Math.floor(Math.random() * 15) + 1;
                    num2 = Math.floor(Math.random() * 15) + 1;
                } else {
                    num1 = Math.floor(Math.random() * 20) + 1;
                    num2 = Math.floor(Math.random() * 20) + 1;
                }
                correct = num1 * num2;
                break;
        }

        const offsets = [-3, -2, -1, 1, 2, 3, 4, -4, 5, -5];
        const distractors = [];
        for (const offset of offsets) {
            if (distractors.length >= 2) { break; }
            const candidate = correct + offset;
            if (candidate >= 0 && candidate !== correct && !distractors.includes(candidate)) {
                distractors.push(candidate);
            }
        }
        while (distractors.length < 2) {
            const candidate = Math.floor(Math.random() * (max + level * 5));
            if (candidate !== correct && !distractors.includes(candidate)) {
                distractors.push(candidate);
            }
        }
        const options = shuffle([correct, ...distractors]);
        return {
            questionText: `Combien font ${num1} ${type === 'additions' ? '+' : type === 'soustractions' ? '-' : 'x'} ${num2}?`,
            options: options,
            correct: options.indexOf(correct),
            difficulty: level,
            reward: { stars: level * rewards[type], coins: level * (rewards[type] / 2) }
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
            { id: 'additions', text: '➕ Additions' },
            { id: 'soustractions', text: '➖ Soustractions' },
            { id: 'multiplications', text: '✖️ Multiplications' },
            { id: 'math-blitz', text: '⚡ Maths Sprint' },
            { id: 'number-houses', text: '🏠 Maisons des Nombres' },
            { id: 'colors', text: '🎨 Les Couleurs' },
            { id: 'stories', text: '📚Contes Magiques' },
            { id: 'lecture-magique', text: '📖 Lecture Magique' },
            { id: 'memory', text: '🧠 Mémoire Magique' },
            { id: 'sorting', text: '🗂️ Jeu de Tri' },
            { id: 'riddles', text: '🤔 Jeu d\'énigmes' },
            { id: 'vowels', text: '🅰️ Jeu des Voyelles' },
            { id: 'sequences', text: '➡️ Jeu des Séquences' },
            { id: 'puzzle-magique', text: '🧩 Puzzle Magique' },
            { id: 'repartis', text: '🍎 Répartis & Multiplie' },
            { id: 'raisonnement', text: '🧩 Raisonnement Magique' },
            { id: 'dictee', text: '🧚‍♀️ Dictée Magique' }
        ];

        allTopics.forEach(topic => {
            const btn = document.createElement('button');
            btn.className = 'topic-btn fx-bounce-in-down';
            btn.innerHTML = topic.text;
            btn.dataset.topic = topic.id;
            btn.style.animationDelay = `${Math.random() * 0.5}s`;
            btn.addEventListener('click', () => {
                currentTopic = topic.id;
                if (topic.id === 'dictee') { showDicteeMenu(); return; }
                if (topic.id === 'stories') { showStoryMenu(); return; }
                if (topic.id === 'memory') { showMemoryGameMenu(); return; }
                showLevelMenu(topic.id);
            });
            topicsContainer.appendChild(btn);
        });
        content.appendChild(topicsContainer);

        btnBack.style.display = 'none';
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
    }

    function showLevelMenu(topic) {
        currentTopic = topic;
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
            'additions': LEVELS_PER_TOPIC,
            'soustractions': LEVELS_PER_TOPIC,
            'multiplications': LEVELS_PER_TOPIC,
            'number-houses': LEVELS_PER_TOPIC,
            'colors': LEVELS_PER_TOPIC,
            'memory': MEMORY_GAME_LEVELS.length,
            'sorting': sortingLevels.length,
            'riddles': riddleLevels.length,
            'vowels': vowelLevels.length,
            'sequences': sequenceLevels.length,
            'stories': magicStories.length,
            'puzzle-magique': 10,
            'repartis': 10,
            'dictee': 10,
            'math-blitz': 10,
            'lecture-magique': 10,
            'raisonnement': 10
        };
        const totalLevels = maxLevels[currentTopic] || LEVELS_PER_TOPIC;
        
        for (let i = 1; i <= totalLevels; i++) {
            const levelBtn = document.createElement('button');
            levelBtn.className = 'level-button fx-bounce-in-down';
            levelBtn.textContent = `Niveau ${i}`;
            levelBtn.style.animationDelay = `${Math.random() * 0.5}s`;
            if (answeredQuestions[`${currentTopic}-${i}`] === 'completed') {
                levelBtn.classList.add('correct');
            }
            levelBtn.addEventListener('click', () => {
                currentLevel = i;
                const skillTag = resolveSkillTag(currentTopic);
                historyTracker?.startGame(currentTopic, currentLevel, { skillTag });
                if (currentTopic === 'number-houses') { showNumberHousesGame(currentLevel); }
                else if (currentTopic === 'colors') { showColorGame(currentLevel); }
                else if (currentTopic === 'sorting') { showSortingGame(currentLevel); }
                else if (currentTopic === 'vowels') { loadVowelQuestion(currentLevel - 1); }
                else if (currentTopic === 'riddles') { launchRiddleLevel(currentLevel); }
                else if (currentTopic === 'sequences') { loadSequenceQuestion(currentLevel - 1); }
                else if (currentTopic === 'puzzle-magique') { launchPuzzleMagique(currentLevel); }
                else if (currentTopic === 'repartis') { launchRepartisGame(currentLevel); }
                else if (currentTopic === 'dictee') { launchDicteeLevel(currentLevel); }
                else if (currentTopic === 'math-blitz') { launchMathBlitzLevel(currentLevel); }
                else if (currentTopic === 'lecture-magique') { launchLectureMagiqueLevel(currentLevel); }
                else if (currentTopic === 'raisonnement') { launchRaisonnementLevel(currentLevel); }
                else if (currentTopic === 'memory') { showMemoryGame(MEMORY_GAME_LEVELS[currentLevel - 1].pairs); }
                else { currentQuestionIndex = 0; loadQuestion(0); }
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

        const questionsForLevel = allQuestions[currentTopic].filter(q => q.difficulty === currentLevel);
        const questionData = questionsForLevel[currentQuestionIndex];
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
            userScore.stars += questionData.reward.stars;
            userScore.coins += questionData.reward.coins;
            showSuccessMessage();
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            userScore.coins = Math.max(0, userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            const explanation = questionData.explanation
                ? `${questionData.explanation}`
                : '❌ -5 pièces. Essaie encore !';
            showErrorMessage(explanation, correctValue);
        }
        const elapsed = questionStartTime ? performance.now() - questionStartTime : 0;
        historyTracker?.recordQuestion(questionSkillTag, { correct: isCorrect, timeMs: elapsed });
        updateUI();
        saveProgress();

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questionsForLevel.length) {
                loadQuestion(currentQuestionIndex);
            } else {
                if (currentTopic !== 'review') {
                    answeredQuestions[`${currentTopic}-${currentLevel}`] = 'completed';
                } else {
                    historyTracker?.applyReviewSuccess(activeReviewSkills);
                }
                saveProgress();
                clearProgressTracker();
                const winPrompt = document.createElement('div');
                winPrompt.className = 'prompt ok fx-pop';
                winPrompt.textContent = `Bravo, tu as complété le Niveau ${currentLevel} !`;
                content.appendChild(winPrompt);
                speakText(`Bravo, tu as complété le Niveau ${currentLevel} !`);
                const endStatus = currentTopic === 'review' ? 'review-completed' : 'completed';
                historyTracker?.endGame({ status: endStatus, topic: currentTopic, level: currentLevel, skills: activeReviewSkills });
                if (currentTopic === 'review') {
                    activeReviewSkills = [];
                }
                setTimeout(() => showLevelMenu(currentTopic), 2000);
            }
        }, 2500);
    }
    
    function loadQuestion(index) {
        currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();

        const questionsForLevel = allQuestions[currentTopic].filter(q => q.difficulty === currentLevel);
        if (!questionsForLevel.length) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'question-prompt';
            emptyMessage.textContent = 'Aucune question disponible pour ce niveau pour le moment.';
            content.appendChild(emptyMessage);
            clearProgressTracker();
            return;
        }
        questionSkillTag = resolveSkillTag(currentTopic);
        const questionData = questionsForLevel[index];
        if (questionData?.metaSkill) {
            questionSkillTag = questionData.metaSkill;
        }
        questionStartTime = performance.now();
        const fragment = document.createDocumentFragment();

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

        fragment.appendChild(promptWrapper);
        speakText(questionData.questionText);
        updateProgressTracker(index + 1, questionsForLevel.length);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        
        const shuffledOptions = shuffle([...questionData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.1 + 0.5}s`;
            const originalIndex = questionData.options.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleOptionClick);
            applyOptionContent(optionEl, opt, i);
            optionsContainer.appendChild(optionEl);
        });
        fragment.appendChild(optionsContainer);
        content.appendChild(fragment);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        if (currentTopic === 'review') {
            configureBackButton('Terminer le repaso', showTopicMenu);
        } else {
            configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));
        }
    }
    /* === Juegos Específicos === */
    /**
 * Muestra el juego de las Casas de los Números.
 * @param {number} level El nivel actual del juego.
 */
function showNumberHousesGame(level) {
    currentLevel = level;
    const content = document.getElementById('content');
    content.innerHTML = ''; 
    updateUI();
    questionSkillTag = resolveSkillTag('number-houses');
    questionStartTime = performance.now();

    const maxRoofNumber = (level * 5) + 15;
    const roofNumber = Math.floor(Math.random() * (maxRoofNumber - 10)) + 10;
    const pairsCount = Math.min(10, level * 2 + 5); 
    const pairs = generateNumberPairs(roofNumber, pairsCount);

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
    instruction.textContent = `Complète les ${pairsCount} maisons des nombres pour arriver à ${roofNumber}.`;
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

pairs.forEach((pair, index) => {
    const row = document.createElement('div');
    row.className = 'window-row';
    const isFirstHidden = Math.random() < 0.5;
    const firstNum = isFirstHidden ? '' : pair[0];
    const secondNum = isFirstHidden ? pair[1] : '';
    const correctValue = isFirstHidden ? pair[0] : pair[1];

    row.innerHTML = `
        ${isFirstHidden ? `<input type="number" class="window-input" data-correct-value="${correctValue}" />` : `<span class="window-number">${firstNum}</span>`}
        <span class="plus-sign">+</span>
        ${isFirstHidden ? `<span class="window-number">${secondNum}</span>` : `<input type="number" class="window-input" data-correct-value="${correctValue}" />`}
        <span class="equal-sign">=</span>
        <span class="window-number">${roofNumber}</span>
    `;
    windowsContainer.appendChild(row);
});

container.appendChild(windowsContainer);

const checkBtn = document.createElement('button');
checkBtn.id = 'checkHouseBtn';
checkBtn.className = 'submit-btn fx-bounce-in-down';
checkBtn.textContent = 'Vérifier';
checkBtn.setAttribute('aria-label', 'Vérifier les réponses');
checkBtn.style.animationDelay = `${pairs.length * 0.1 + 0.5}s`;
container.appendChild(checkBtn);
content.appendChild(container);

btnLogros.style.display = 'inline-block';
btnLogout.style.display = 'inline-block';
configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));

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
            setTimeout(() => input.classList.remove('fx-shake'), 1000);
            userScore.coins = Math.max(0, userScore.coins - 5);
            allCorrect = false;
            incorrectValues.push(`Réponse attendue : ${correctValue}`);
        }
    });

    updateUI();
    saveProgress();
    const elapsed = questionStartTime ? performance.now() - questionStartTime : 0;
    historyTracker?.recordQuestion(questionSkillTag || resolveSkillTag('number-houses'), { correct: allCorrect, timeMs: elapsed });

    if (allCorrect) {
        userScore.stars += 50;
        userScore.coins += 50;
        answeredQuestions[`${currentTopic}-${currentLevel}`] = 'completed';
        saveProgress();
        showSuccessMessage('Bravo ! Toutes les maisons sont correctes. 🦄✨');
        showConfetti();
        checkBtn.textContent = 'Niveau suivant';
        checkBtn.onclick = () => {
            if (currentLevel < LEVELS_PER_TOPIC) {
                showNumberHousesGame(currentLevel + 1);
            } else {
                win();
            }
        };
        checkBtn.disabled = false;
        historyTracker?.endGame({ status: 'completed', topic: 'number-houses', level: currentLevel });
    } else {
        const message = `${correctCount} réponses correctes. ${allInputs.length - correctCount} incorrectes. -5 pièces.`;
        showErrorMessage(message, incorrectValues.join(', '));
        setTimeout(() => {
            checkBtn.disabled = false;
            questionStartTime = performance.now();
        }, 500); 
    }
}

/**
 * Genera pares de números cuya suma es igual a 'sum'.
 * @param {number} sum El valor del tejado de la casa.
 * @param {number} count La cantidad de pares a generar.
 * @returns {Array<Array<number>>} Un array de pares de números.
 */
function generateNumberPairs(sum, count) {
    const pairs = [];
    const usedPairs = new Set(); 

    while (pairs.length < count) {
        const num1 = Math.floor(Math.random() * (sum + 1)); 
        const num2 = sum - num1;
        
        const pairKey = num1 < num2 ? `${num1}-${num2}` : `${num2}-${num1}`;

        if (!usedPairs.has(pairKey)) {
            pairs.push([num1, num2]);
            usedPairs.add(pairKey);
        }
    }
    return pairs;
}

    function showColorGame(level) {
        currentTopic = 'colors';
        currentLevel = level;
        currentQuestionIndex = 0;
        loadColorQuestion(0);
    }
    
    function loadColorQuestion(index) {
        currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();
        
        const questionsForLevel = allQuestions.colors.filter(q => q.difficulty === currentLevel);
        if (!questionsForLevel.length) {
            const empty = document.createElement('p');
            empty.className = 'question-prompt';
            empty.textContent = 'Aucune question de couleur disponible pour ce niveau.';
            content.appendChild(empty);
            clearProgressTracker();
            return;
        }
        const questionData = questionsForLevel[index];
        questionSkillTag = questionData?.metaSkill || resolveSkillTag('colors');
        questionStartTime = performance.now();
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
        if (currentTopic === 'review') {
            configureBackButton('Terminer le repaso', showTopicMenu);
        } else {
            configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));
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

        const questionsForLevel = allQuestions.colors.filter(q => q.difficulty === currentLevel);
        const questionData = questionsForLevel[currentQuestionIndex];
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
            userScore.stars += questionData.reward.stars;
            userScore.coins += questionData.reward.coins;
            showSuccessMessage();
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            userScore.coins = Math.max(0, userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) { correctOption.classList.add('correct'); }
            const explanation = questionData.explanation
                ? `${questionData.explanation}`
                : '❌ -5 pièces. Essaie encore !';
            showErrorMessage(explanation, correctValue);
        }
        const elapsed = questionStartTime ? performance.now() - questionStartTime : 0;
        historyTracker?.recordQuestion(questionSkillTag, { correct: isCorrect, timeMs: elapsed });
        updateUI();
        saveProgress();
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questionsForLevel.length) {
                loadColorQuestion(currentQuestionIndex);
            } else {
                if (currentTopic !== 'review') {
                    answeredQuestions[`${currentTopic}-${currentLevel}`] = 'completed';
                } else {
                    historyTracker?.applyReviewSuccess(activeReviewSkills);
                }
                saveProgress();
                clearProgressTracker();
                showSuccessMessage(`Bravo, tu as complété le Niveau ${currentLevel} !`);
                const endStatus = currentTopic === 'review' ? 'review-completed' : 'completed';
                historyTracker?.endGame({ status: endStatus, topic: currentTopic, level: currentLevel, skills: activeReviewSkills });
                if (currentTopic === 'review') {
                    activeReviewSkills = [];
                }
                setTimeout(() => showLevelMenu(currentTopic), 2000);
            }
        }, 2500);
    }

    function showStoryMenu() {
        clearProgressTracker();
        content.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = 'Choisis un conte magique ✨';
        content.appendChild(title);
        speakText('Choisis un conte magique');
        
        const storiesContainer = document.createElement('div');
        storiesContainer.className = 'options-grid';
        
        magicStories.forEach((story, index) => {
            const storyBtn = document.createElement('button');
            storyBtn.className = 'topic-btn fx-bounce-in-down';
            storyBtn.style.animationDelay = `${index * 0.1}s`;
            storyBtn.innerHTML = `${story.title}`;
            storyBtn.addEventListener('click', () => showMagicStory(index));
            storiesContainer.appendChild(storyBtn);
        });
        
        content.appendChild(storiesContainer);
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux sujets', showTopicMenu);
    }

    function showMagicStory(storyIndex) {
        content.innerHTML = '';
        const story = magicStories[storyIndex];
        currentStoryIndex = storyIndex;
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
        storyQuiz = story.quiz;
        currentQuestionIndex = 0;
        questionSkillTag = resolveSkillTag('stories');
        questionStartTime = performance.now();
        historyTracker?.startGame('stories', storyIndex + 1, {
            skillTag: questionSkillTag,
            storyTitle: story.title
        });
        loadQuizQuestion();
    }
    
    function loadQuizQuestion() {
        if (currentQuestionIndex >= storyQuiz.length) {
            showQuizResults();
            return;
        }
        
        content.innerHTML = '';
        const questionData = storyQuiz[currentQuestionIndex];
        questionSkillTag = questionData?.metaSkill || questionSkillTag || resolveSkillTag('stories');
        questionStartTime = performance.now();
        const fragment = document.createDocumentFragment();
        
        const promptWrapper = document.createElement('div');
        promptWrapper.className = 'prompt-with-audio';

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = `Question ${currentQuestionIndex + 1} / ${storyQuiz.length}<br>${questionData.question}`;
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
        updateProgressTracker(currentQuestionIndex + 1, storyQuiz.length);
        
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
        
        const questionData = storyQuiz[currentQuestionIndex];
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = questionData.correct;
        const correctValue = questionData.options[correctAnswerIndex];

        const isCorrect = !Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex;

        if (isCorrect) {
            selectedOption.classList.add('correct');
            userScore.stars += 15;
            userScore.coins += 10;
            showSuccessMessage('Bonne réponse !');
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            userScore.coins = Math.max(0, userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            const explanation = questionData.explanation ? questionData.explanation : 'Mauvaise réponse.';
            showErrorMessage(explanation, correctValue);
        }
        const elapsed = questionStartTime ? performance.now() - questionStartTime : 0;
        historyTracker?.recordQuestion(questionSkillTag || resolveSkillTag('stories'), { correct: isCorrect, timeMs: elapsed });
        updateUI();
        saveProgress();
        
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuizQuestion();
        }, 2000);
    }

    function showQuizResults() {
        content.innerHTML = '';
        clearProgressTracker();
        const prompt = document.createElement('div');
        prompt.className = 'prompt ok fx-pop';
        prompt.innerHTML = `Quiz terminé ! 🎉<p>Tu as gagné des étoiles et des pièces !</p>`;
        content.appendChild(prompt);

        historyTracker?.endGame({
            status: 'completed',
            topic: 'stories',
            storyIndex: currentStoryIndex
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
        btn.addEventListener('click', () => showMemoryGame(levelConfig.pairs));
        levelsGrid.appendChild(btn);
      });
      content.appendChild(levelsGrid);

      btnLogros.style.display = 'inline-block';
      btnLogout.style.display = 'inline-block';
      configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    function showMemoryGame(pairsCount) {
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

        const memoryGrid = document.createElement('div');
        memoryGrid.className = 'memory-grid';
        const levelConfig = MEMORY_GAME_LEVELS.find(l => l.pairs === pairsCount);
        if (levelConfig && levelConfig.grid) {
          const gridParts = levelConfig.grid.split('x').map(Number);
          const columns = gridParts.length > 1 && !Number.isNaN(gridParts[1]) ? gridParts[1] : Math.sqrt(pairsCount * 2);
          memoryGrid.style.gridTemplateColumns = `repeat(${Math.round(columns)}, 1fr)`;
        }
        content.appendChild(memoryGrid);

        const cardEmojis = Object.values(emoji).slice(6, 6 + pairsCount);
        const gameCards = shuffle([...cardEmojis, ...cardEmojis]);
        let flippedCards = [];
        let matchedPairs = 0;
        let lockBoard = false;

        gameCards.forEach((cardEmoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card fx-bounce-in-down';
            card.style.animationDelay = `${index * 0.05}s`;
            card.innerHTML = `<span style="opacity:0;">${cardEmoji}</span>`;
            card.addEventListener('click', () => flipCard(card, cardEmoji, index));
            memoryGrid.appendChild(card);
        });

        function flipCard(card, cardEmoji, index) {
            if (lockBoard) return;
            if (card.classList.contains('flipped')) return;

            card.classList.add('flipped');
            card.querySelector('span').style.opacity = '1';
            flippedCards.push({ card, emoji: cardEmoji, index });

            if (flippedCards.length === 2) {
                lockBoard = true;
                const [card1, card2] = flippedCards;
                if (card1.emoji === card2.emoji) {
                    card1.card.classList.add('matched');
                    card2.card.classList.add('matched');
                    matchedPairs++;
                    updateProgressTracker(matchedPairs, pairsCount);
                    userScore.stars += 20;
                    userScore.coins += 10;
                    playSound('correct');
                    updateUI();
                    saveProgress();
                    flippedCards = [];
                    lockBoard = false;
                    if (matchedPairs === pairsCount) {
                        clearProgressTracker();
                        answeredQuestions[`memory-${currentLevel}`] = 'completed';
                        saveProgress();
                        showSuccessMessage('🦄 Toutes les paires trouvées !');
                        showConfetti();
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
                        userScore.coins = Math.max(0, userScore.coins - 5);
                        playSound('wrong');
                        updateUI();
                        saveProgress();
                        showErrorMessage('Mauvaise réponse.', `Il fallait trouver une paire de ${card1.emoji}`);
                    }, 1000);
                }
            }
        }
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux de mémoire', showMemoryGameMenu);
    }
    
    /**
     * Muestra el juego de ordenar.
     * @param {number} level El nivel de dificultad.
     */
    function showSortingGame(level) {
        currentLevel = level;
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
            answeredQuestions[`sorting-${currentLevel}`] = 'in-progress';
            saveProgress();
        }

        function rewardPlayer() {
            showSuccessMessage('Classement parfait ! ✨');
            showConfetti();
            userScore.stars += reward.stars;
            userScore.coins += reward.coins;
            answeredQuestions[`sorting-${currentLevel}`] = 'completed';
            saveProgress();
            updateUI();
            clearProgressTracker();
            setTimeout(() => {
                if (currentLevel < sortingLevels.length) {
                    showSortingGame(currentLevel + 1);
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
        currentTopic = 'riddles';
        showLevelMenu(currentTopic);
    }
    
    function launchRiddleLevel(level) {
        currentTopic = 'riddles';
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        currentRiddleLevelIndex = Math.max(0, Math.min(riddleLevels.length, level) - 1);
        const levelData = riddleLevels[currentRiddleLevelIndex];
        currentLevel = levelData?.level || level;
        currentQuestionIndex = 0;
        answeredQuestions[`riddles-${currentLevel}`] = 'in-progress';
        saveProgress();
        loadRiddleQuestion(0);
    }

    function loadRiddleQuestion(questionIndex = 0) {
        const levelData = riddleLevels[currentRiddleLevelIndex];
        if (!levelData) {
            showLevelMenu('riddles');
            return;
        }

        const questions = levelData.questions || [];
        if (questionIndex >= questions.length) {
            completeRiddleLevel(levelData);
            return;
        }

        currentQuestionIndex = questionIndex;
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
        updateProgressTracker(currentQuestionIndex + 1, questions.length);

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
        answeredQuestions[`riddles-${levelData.level}`] = 'completed';
        saveProgress();
        showSuccessMessage(levelData.completionMessage || 'Niveau terminé !');
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

        const levelData = riddleLevels[currentRiddleLevelIndex];
        const questions = levelData.questions || [];
        const riddleData = questions[currentQuestionIndex];
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = riddleData.answer;
        const correctValue = riddleData.options[correctAnswerIndex];

        if (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex) {
            selectedOption.classList.add('correct');
            selectedOption.classList.add('riddle-correct-glow');
            userScore.stars += riddleData.reward?.stars || (10 + levelData.level);
            userScore.coins += riddleData.reward?.coins || (6 + Math.floor(levelData.level / 2));
            showSuccessMessage(riddleData.success || 'Bonne réponse !');
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            selectedOption.classList.add('riddle-wrong-glow');
            userScore.coins = Math.max(0, userScore.coins - 5);
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
            if (currentQuestionIndex + 1 < questions.length) {
                loadRiddleQuestion(currentQuestionIndex + 1);
            } else {
                completeRiddleLevel(levelData);
            }
        }, 1600);
    }
    
    // --- NOUVEAUX JEUX ---

    function showVowelGame() {
        currentTopic = 'vowels';
        showLevelMenu(currentTopic);
    }
    
    function loadVowelQuestion(index) {
        if (index < 0 || index >= vowelLevels.length) {
            win();
            return;
        }

        const levelData = vowelLevels[index];
        currentLevel = levelData.level;
        currentQuestionIndex = index;
        currentVowelLevelData = null;
        questionSkillTag = resolveSkillTag('vowels');
        questionStartTime = performance.now();

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

        currentVowelLevelData = {
            level: levelData.level,
            answer: levelData.answer,
            blanksCount,
            displayEl: display,
            buttons,
            feedbackEl: feedbackBubble
        };
        answeredQuestions[`vowels-${currentLevel}`] = answeredQuestions[`vowels-${currentLevel}`] || 'in-progress';
        saveProgress();
    }

    function handleVowelAnswer(event) {
        if (!currentVowelLevelData) { return; }

        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.vowel-option'));
        if (!selectedOption) { return; }

        currentVowelLevelData.buttons.forEach(btn => {
            btn.removeEventListener('click', handleVowelAnswer);
            btn.disabled = true;
        });

        const userAnswer = selectedOption.dataset.value;
        const expected = currentVowelLevelData.answer;
        const blanks = currentVowelLevelData.displayEl.querySelectorAll('.vowel-blank');

        const isCorrect = userAnswer && userAnswer.toLowerCase() === expected.toLowerCase();
        const elapsed = questionStartTime ? performance.now() - questionStartTime : 0;
        if (isCorrect) {
            fillVowelBlanks(blanks, userAnswer);
            currentVowelLevelData.displayEl.classList.add('is-complete');
            selectedOption.classList.add('correct', 'vowel-option-correct');
            showVowelFeedback('positive', 'Super !');
            userScore.stars += 10 + currentLevel * 2;
            userScore.coins += 10;
            answeredQuestions[`vowels-${currentLevel}`] = 'completed';
            saveProgress();
            updateUI();
            showSuccessMessage('Bravo !');
            showConfetti();
            historyTracker?.recordQuestion(questionSkillTag || resolveSkillTag('vowels'), { correct: true, timeMs: elapsed });
            setTimeout(() => {
                currentVowelLevelData = null;
                if (currentQuestionIndex + 1 < vowelLevels.length) {
                    loadVowelQuestion(currentQuestionIndex + 1);
                } else {
                    historyTracker?.endGame({ status: 'completed', topic: 'vowels', level: currentLevel });
                    showLevelMenu('vowels');
                }
            }, 1600);
        } else {
            selectedOption.classList.add('wrong', 'vowel-option-wrong');
            currentVowelLevelData.displayEl.classList.add('is-error');
            showVowelFeedback('negative', 'Essaie encore !');
            userScore.coins = Math.max(0, userScore.coins - 5);
            answeredQuestions[`vowels-${currentLevel}`] = 'in-progress';
            saveProgress();
            updateUI();
            historyTracker?.recordQuestion(questionSkillTag || resolveSkillTag('vowels'), { correct: false, timeMs: elapsed });
            showErrorMessage('Regarde bien les lettres.', expected);
            setTimeout(() => {
                currentVowelLevelData.displayEl.classList.remove('is-error');
                currentVowelLevelData.buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.addEventListener('click', handleVowelAnswer);
                    btn.classList.remove('vowel-option-wrong');
                });
                hideVowelFeedback();
                questionStartTime = performance.now();
            }, 1200);
        }
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
        if (!currentVowelLevelData || !currentVowelLevelData.feedbackEl) { return; }
        const bubble = currentVowelLevelData.feedbackEl;
        clearTimeout(bubble._timerId);
        bubble.textContent = message;
        bubble.classList.remove('is-hidden', 'is-positive', 'is-negative');
        bubble.classList.add(type === 'positive' ? 'is-positive' : 'is-negative');
        bubble._timerId = setTimeout(() => hideVowelFeedback(), 2200);
    }

    function hideVowelFeedback() {
        if (!currentVowelLevelData || !currentVowelLevelData.feedbackEl) { return; }
        const bubble = currentVowelLevelData.feedbackEl;
        clearTimeout(bubble._timerId);
        bubble.textContent = '';
        bubble.classList.add('is-hidden');
        bubble.classList.remove('is-positive', 'is-negative');
    }

    function showSequenceGame() {
        currentTopic = 'sequences';
        showLevelMenu(currentTopic);
    }

    function loadSequenceQuestion(index) {
        if (index < 0 || index >= sequenceLevels.length) {
            win();
            return;
        }

        currentLevel = index + 1;
        currentQuestionIndex = index;
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
        updateProgressTracker(currentLevel, sequenceLevels.length);

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
            userScore.stars += 12 + currentLevel * 2;
            userScore.coins += 8 + currentLevel;
            answeredQuestions[`sequences-${currentLevel}`] = 'completed';
            saveProgress();
            updateUI();
            showConfetti();
            clearProgressTracker();
            setTimeout(() => {
                if (currentLevel < sequenceLevels.length) {
                    loadSequenceQuestion(currentLevel);
                } else {
                    showLevelMenu('sequences');
                }
            }, 1400);
        }

        function markSequenceInProgress() {
            answeredQuestions[`sequences-${currentLevel}`] = 'in-progress';
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
                            <div class="prompt ok">Ton score final : ${userScore.stars} étoiles et ${userScore.coins} pièces.</div>`;
        speakText("Tu as complété toutes les questions! Félicitations pour ton score final.");
        clearProgressTracker();
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    // --- Start Game ---
    init();
});
