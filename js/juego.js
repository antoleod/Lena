console.log("juego.js loaded");
document.addEventListener('DOMContentLoaded', () => {
    const userProfile = storage.loadUserProfile();
    console.log("userProfile:", userProfile);

    if (!userProfile) {
        console.log("Redirecting to login.html");
        window.location.href = 'login.html';
        return;
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

    // --- Game State ---
    let currentTopic = '';
    let currentLevel;
    let currentQuestionIndex = 0;
    let userScore;
    let answeredQuestions;
    let storyQuiz = [];

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
    const answerOptionIcons = ['🔹', '🌟', '💡', '🎯', '✨', '🎈', '🧠'];
    const colorOptionIcons = ['🎨', '🖌️', '🧴', '🧑\u200d🎨', '🌈'];
    const magicStories = [
        {
            "title": "Le Voyage de Léna l\'Étoile ⭐️",
            "image": "https://photos.app.goo.gl/fkh9KiXZNouPpshj7",
            "text": [
              "Léna 👧 était une petite étoile ⭐️ brillante ✨ comme un diamant 💎.",
              "Elle vivait 🏡 sur une montagne ⛰️ magique ✨ avec sa petite sœur Yaya 👧.",
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
        '⚪ Blanc + 🔴 Rouge': 'pink', '🔵 Bleu + 🟡 Jaune': 'green', '🔴 Rouge + 🟡 Jaune': 'orange', '🔵 Bleu + 🔴 Rouge': 'purple',
    };
    const riddles = [
        {
            riddle: "Je suis un animal qui vit dans la mer, mais je ne suis pas un poisson. J\'ai huit bras. Qui suis-je?",
            options: ["Une baleine", "Un requin", "Une pieuvre", "Un crabe"],
            correct: 2,
            reward: { stars: 15, coins: 10 }
        },
        {
            riddle: "Je suis grand et vert, et je n\'ai pas de bras. Je peux te donner des fruits ou de l\'ombre. Qui suis-je?",
            options: ["Une fleur", "Un arbre", "Un champignon", "Une carotte"],
            correct: 1,
            reward: { stars: 15, coins: 10 }
        }
    ];
    const words = [
        { word: 'chat', image: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png', hint: 'Un animal qui aime les siestes.' },
        { word: 'soleil', image: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', hint: 'Brille dans le ciel le jour.' }
    ];
    const sequences = [
        { items: ['1', '2', '3', '4', '?'], options: ['5', '6', '8'], correct: '5' },
        { items: ['🔴', '🔵', '🔴', '🔵', '?'], options: ['🔴', '🟢', '🟡'], correct: '🔴' }
    ];
    const allQuestions = {
        additions: [], soustractions: [], multiplications: [], colors: [], stories: [], riddles: [], sorting: [], letters: [], shapes: [], vowels: [], sequences: [],
        'puzzle-magique': [], repartis: [], dictee: []
    };

    // --- Initialization ---
    console.log("Initializing game for user:", userProfile.name);
    function init() {
        loadProgress();
        initializeQuestions();
        setupUI();
        setupEventListeners();
        showTopicMenu();
    }

    function setupUI() {
        userInfo.textContent = userProfile.name;
        userInfo.dataset.avatar = userProfile.avatar;
        document.documentElement.style.setProperty('--primary', userProfile.color);
        document.documentElement.style.setProperty('--primary-light', lightenColor(userProfile.color, 20));
        updateUI();
    }

    function setupEventListeners() {
        btnLogout.addEventListener('click', () => {
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
    }

    function loadProgress() {
        const progress = storage.loadUserProgress(userProfile.name);
        userScore = progress.userScore;
        answeredQuestions = progress.answeredQuestions;
        currentLevel = progress.currentLevel;
    }

    function saveProgress() {
        const progress = {
            userScore: userScore,
            answeredQuestions: answeredQuestions,
            currentLevel: currentLevel
        };
        storage.saveUserProgress(userProfile.name, progress);
    }

    function configureBackButton(label, handler) {
        btnBack.style.display = 'inline-block';
        btnBack.textContent = label;
        btnBack.onclick = () => {
            saveProgress();
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
        scoreStars.textContent = userScore.stars;
        scoreCoins.textContent = userScore.coins;
        levelDisplay.textContent = `Niveau ${currentLevel}`;
        document.body.className = `body-level-${currentLevel}`;
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
        promptEl.textContent = `${message} La bonne réponse était : ${correctValue}.`;
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
    
    function lightenColor(hex, percent) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);

        r = Math.min(255, r + Math.floor(255 * percent));
        g = Math.min(255, g + Math.floor(255 * percent));
        b = Math.min(255, b + Math.floor(255 * percent));

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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

        const options = shuffle([correct, correct + 1, correct - 1, correct + 2].filter(n => n >= 0 && n !== correct).slice(0, 3).concat(correct));
        return {
            questionText: `Combien font ${num1} ${type === 'additions' ? '+' : type === 'soustractions' ? '-' : 'x'} ${num2}?`,
            options: options,
            correct: options.indexOf(correct),
            difficulty: level,
            reward: { stars: level * rewards[type], coins: level * (rewards[type] / 2) }
        };
    }
    
    function generateColorQuestion(level) {
        let questionData = {};
        const allColors = Object.keys(colorMap);
        const primaryColors = ['🔵 Bleu', '🟡 Jaune', '🔴 Rouge'];
        const secondaryColors = ['🟢 Vert', '🟠 Orange', '🟣 Violet'];
        
        if (level <= 4) {
            const color = shuffle(primaryColors)[0];
            questionData = { questionText: `Quelle est la couleur ${color}?`, correct: color };
        } else if (level <= 7) {
            const combinations = shuffle([
                { text: `🔵 Bleu + 🟡 Jaune`, result: '🟢 Vert' },
                { text: `🔴 Rouge + 🟡 Jaune`, result: '🟠 Orange' },
                { text: `🔵 Bleu + 🔴 Rouge`, result: '🟣 Violet' }
            ]);
            const combo = combinations[0];
            questionData = { questionText: `Quelle couleur obtient-on en mélangeant ${combo.text}?`, correct: combo.result };
        } else {
            const color = shuffle(allColors.filter(c => !primaryColors.includes(c) && !secondaryColors.includes(c)))[0];
            questionData = { questionText: `Quelle couleur est ${color}?`, correct: color };
        }

        let options = [questionData.correct];
        while (options.length < 4) {
            const randomColor = shuffle(allColors)[0];
            if (!options.includes(randomColor)) {
                options.push(randomColor);
            }
        }
        questionData.options = shuffle(options);
        questionData.correct = questionData.options.indexOf(questionData.correct);
        return { ...questionData, difficulty: level, reward: { stars: 20, coins: 15 } };
    }

    // --- Screen Management ---
    function showTopicMenu() {
        content.innerHTML = '';
        const prompt = document.createElement('div');
        prompt.className = 'question-prompt fx-bounce-in-down';
        prompt.textContent = 'Sélectionne un sujet pour commencer.';
        content.appendChild(prompt);
        speakText('Sélectionne un sujet pour commencer.');

        const topicsContainer = document.createElement('div');
        topicsContainer.className = 'options-grid';
        
        const allTopics = [
            { id: 'additions', text: '➕ Additions' },
            { id: 'soustractions', text: '➖ Soustractions' },
            { id: 'multiplications', text: '✖️ Multiplications' },
            { id: 'number-houses', text: '🏠 Maisons des Nombres' },
            { id: 'colors', text: '🎨 Les Couleurs' },
            { id: 'stories', text: '📚 Contes Magiques' },
            { id: 'memory', text: '🧠 Mémoire Magique' },
            { id: 'sorting', text: '🗂️ Jeu de Tri' },
            { id: 'riddles', text: '🤔 Jeu d\'énigmes' },
            { id: 'vowels', text: '🅰️ Jeu des Voyelles' },
            { id: 'sequences', text: '➡️ Jeu des Séquences' },
            { id: 'puzzle-magique', text: '🧩 Puzzle Magique' },
            { id: 'repartis', text: '🍎 Répartis & Multiplie' },
            { id: 'dictee', text: '🧚‍♀️ Dictée Magique' },
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
                if (topic.id === 'puzzle-magique' || topic.id === 'repartis') { showLevelMenu(topic.id); return; }
                if (topic.id === 'stories') { showStoryMenu(); }
                else if (topic.id === 'memory') { showMemoryGameMenu(); }
                else if (topic.id === 'sorting') { showSortingGame(1); }
                else if (topic.id === 'riddles') { showRiddleGame(); }
                else if (topic.id === 'vowels') { showVowelGame(); }
                else if (topic.id === 'sequences') { showSequenceGame(); }
                else if (topic.id === 'number-houses') { showNumberHousesGame(1); }
                else { showLevelMenu(topic.id); }
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
        content.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = `Choisis un niveau pour ${topic}`;
        content.appendChild(title);
        speakText(`Choisis un niveau pour ${topic}`);

        const levelsContainer = document.createElement('div');
        levelsContainer.className = 'options-grid';

        const maxLevels = {
            'additions': LEVELS_PER_TOPIC,
            'soustractions': LEVELS_PER_TOPIC,
            'multiplications': LEVELS_PER_TOPIC,
            'number-houses': LEVELS_PER_TOPIC,
            'colors': LEVELS_PER_TOPIC,
            'memory': MEMORY_GAME_LEVELS.length,
            'sorting': 10,
            'riddles': riddles.length,
            'vowels': words.length,
            'sequences': sequences.length,
            'stories': magicStories.length,
            'puzzle-magique': 10,
            'repartis': 10,
            'dictee': 10
        };
        const totalLevels = maxLevels[currentTopic] || LEVELS_PER_TOPIC;
        
        for (let i = 1; i <= totalLevels; i++) {
            const levelBtn = document.createElement('div');
            levelBtn.className = 'option level-btn fx-bounce-in-down';
            levelBtn.textContent = `Niveau ${i}`;
            levelBtn.style.animationDelay = `${Math.random() * 0.5}s`;
            if (answeredQuestions[`${currentTopic}-${i}`] === 'completed') {
                levelBtn.classList.add('correct');
            }
            levelBtn.addEventListener('click', () => {
                currentLevel = i;
                if (currentTopic === 'number-houses') { showNumberHousesGame(currentLevel); }
                else if (currentTopic === 'colors') { showColorGame(currentLevel); }
                else if (currentTopic === 'sorting') { showSortingGame(currentLevel); }
                else if (currentTopic === 'vowels') { loadVowelQuestion(currentLevel - 1); }
                else if (currentTopic === 'riddles') { loadRiddleQuestion(currentLevel - 1); }
                else if (currentTopic === 'sequences') { loadSequenceQuestion(currentLevel - 1); }
                else if (currentTopic === 'puzzle-magique') { launchPuzzleMagique(currentLevel); }
                else if (currentTopic === 'repartis') { launchRepartisGame(currentLevel); }
                else if (currentTopic === 'dictee') { launchDicteeLevel(currentLevel); }
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
            showErrorMessage('❌ -5 pièces.', correctValue);
        }
        updateUI();
        saveProgress();

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < QUESTIONS_PER_LEVEL) {
                loadQuestion(currentQuestionIndex);
            } else {
                answeredQuestions[`${currentTopic}-${currentLevel}`] = 'completed';
                saveProgress();
                const winPrompt = document.createElement('div');
                winPrompt.className = 'prompt ok fx-pop';
                winPrompt.textContent = `Bravo, tu as complété le Niveau ${currentLevel} !`;
                content.appendChild(winPrompt);
                speakText(`Bravo, tu as complété le Niveau ${currentLevel} !`);
                setTimeout(() => showLevelMenu(currentTopic), 2000);
            }
        }, 2500);
    }
    
    function loadQuestion(index) {
        currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();

        const questionsForLevel = allQuestions[currentTopic].filter(q => q.difficulty === currentLevel);
        const questionData = questionsForLevel[index];
        const fragment = document.createDocumentFragment();

        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = questionData.questionText;
        fragment.appendChild(title);
        speakText(questionData.questionText);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        
        const shuffledOptions = shuffle([...questionData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('div');
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
        configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));
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

    const instruction = document.createElement('p');
    instruction.className = 'question-prompt';
    instruction.textContent = `Complète les ${pairsCount} maisons des nombres pour arriver à ${roofNumber}.`;
    container.appendChild(instruction);
speakText(instruction.textContent);

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
    } else {
        const message = `${correctCount} réponses correctes. ${allInputs.length - correctCount} incorrectes. -5 pièces.`;
        showErrorMessage(message, incorrectValues.join(', '));
        setTimeout(() => checkBtn.disabled = false, 500); 
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
        const questionData = questionsForLevel[index];
        const fragment = document.createDocumentFragment();
        
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = questionData.questionText;
        fragment.appendChild(title);
        speakText(questionData.questionText);

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
        configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));
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
            showErrorMessage('❌ -5 pièces.', correctValue);
        }
        updateUI();
        saveProgress();
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < QUESTIONS_PER_LEVEL) {
                loadColorQuestion(currentQuestionIndex);
            } else {
                answeredQuestions[`${currentTopic}-${currentLevel}`] = 'completed';
                saveProgress();
                showSuccessMessage(`Bravo, tu as complété le Niveau ${currentLevel} !`);
                setTimeout(() => showLevelMenu(currentTopic), 2000);
            }
        }, 2500);
    }

    function showStoryMenu() {
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
            storyBtn.innerHTML = `📚 ${story.title}`;
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
        const storyContainer = document.createElement('div');
        storyContainer.className = 'story-container fx-bounce-in-down';
        storyContainer.innerHTML = `<h2>${story.title}</h2><img src="${story.image}" alt="${story.title}" />`;
        
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
        startQuizBtn.addEventListener('click', () => startStoryQuiz(story.quiz));
        
        content.appendChild(storyContainer);
        content.appendChild(startQuizBtn);
        
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux contes', showStoryMenu);
        
        const fullStoryText = story.text.join(' ');
        speakText(story.title + '. ' + fullStoryText);
    }
    
    function startStoryQuiz(quizQuestions) {
        storyQuiz = quizQuestions;
        currentQuestionIndex = 0;
        loadQuizQuestion();
    }
    
    function loadQuizQuestion() {
        if (currentQuestionIndex >= storyQuiz.length) {
            showQuizResults();
            return;
        }
        
        content.innerHTML = '';
        const questionData = storyQuiz[currentQuestionIndex];
        const fragment = document.createDocumentFragment();
        
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = `Question ${currentQuestionIndex + 1}:<br>${questionData.question}`;
        fragment.appendChild(title);
        speakText(questionData.question);
        
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

        if (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex) {
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
            showErrorMessage('Mauvaise réponse.', correctValue);
        }
        updateUI();
        saveProgress();
        
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuizQuestion();
        }, 2000);
    }
    
    function showQuizResults() {
        content.innerHTML = '';
        const prompt = document.createElement('div');
        prompt.className = 'prompt ok fx-pop';
        prompt.innerHTML = `Quiz terminé ! 🎉<p>Tu as gagné des étoiles et des pièces !</p>`;
        content.appendChild(prompt);

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
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = 'Trouve toutes les paires !';
        content.appendChild(title);
        speakText('Trouve toutes les paires !');

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
                    userScore.stars += 20;
                    userScore.coins += 10;
                    playSound('correct');
                    updateUI();
                    saveProgress();
                    flippedCards = [];
                    lockBoard = false;
                    if (matchedPairs === pairsCount) {
                        showSuccessMessage('🦄 Toutes les paires trouvées !');
                        showConfetti();
                        setTimeout(showMemoryGameMenu, 2000);
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

        const container = document.createElement('div');
        container.className = 'sorting-container fx-bounce-in-down';

        const instruction = document.createElement('p');
        instruction.className = 'question-prompt';
        container.appendChild(instruction);
        
        const listContainer = document.createElement('div');
        listContainer.className = 'sorting-list';
        container.appendChild(listContainer);
        
        const checkBtn = document.createElement('button');
        checkBtn.className = 'submit-btn fx-bounce-in-down';
        checkBtn.textContent = 'Vérifier';
        container.appendChild(checkBtn);
        
        content.appendChild(container);
        
        let items, sortedItems;
        if (level === 1) { // Números
            items = shuffle([5, 2, 8, 1, 6]);
            sortedItems = items.slice().sort((a, b) => a - b);
            instruction.textContent = "Trie ces nombres du plus petit au plus grand.";
        } else if (level === 2) { // Colores
            items = shuffle(['🔴', '🔵', '🟢', '🟡', '🟣']);
            sortedItems = ['🔴', '🔵', '🟢', '🟡', '🟣'];
            instruction.textContent = "Trie ces couleurs dans l\'ordre de l\'arc-en-ciel.";
        } else if (level === 3) { // Animales
             items = shuffle(['🐶', '🐱', '🐰', '🐻', '🐼']);
             sortedItems = ['🐶', '🐱', '🐰', '🐻', '🐼'];
             instruction.textContent = "Trie ces animaux.";
        } else if (level === 4) { // Numeros romanos
            items = shuffle(['I', 'V', 'X', 'L', 'C']);
            sortedItems = ['I', 'V', 'X', 'L', 'C'];
            instruction.textContent = "Trie ces nombres romains du plus petit au plus grand.";
        } else if (level === 5) { // Días de la semana
            items = shuffle(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']);
            sortedItems = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
            instruction.textContent = "Trie ces jours de la semaine.";
        } else if (level === 6) { // Meses del año
            items = shuffle(['Janvier', 'Février', 'Mars', 'Avril']);
            sortedItems = ['Janvier', 'Février', 'Mars', 'Avril'];
            instruction.textContent = "Trie ces mois dans l\'ordre de l\'année.";
        } else if (level === 7) { // Letras
            items = shuffle(['d', 'c', 'b', 'a']);
            sortedItems = ['a', 'b', 'c', 'd'];
            instruction.textContent = "Trie ces lettres dans l\'ordre alphabétique.";
        } else if (level === 8) { // Frutas
            items = shuffle(['🍎', '🍌', '🍇', '🍊']);
            sortedItems = ['🍎', '🍌', '🍇', '🍊'];
            instruction.textContent = "Trie ces fruits par ordre de couleur (rouge, jaune, violet, orange).";
        } else if (level === 9) { // Tamano
            items = shuffle(['petit', 'moyen', 'grand', 'énorme']);
            sortedItems = ['petit', 'moyen', 'grand', 'énorme'];
            instruction.textContent = "Trie ces mots du plus petit au plus grand.";
        } else { // Sumas
            items = shuffle(['5+2', '1+3', '4+1', '3+3']);
            sortedItems = ['1+3', '4+1', '3+3', '5+2'];
            instruction.textContent = "Trie ces additions par ordre de résultat croissant.";
        }
        
        speakText(instruction.textContent);

        let draggedItem = null;

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'sortable-item';
            el.textContent = item;
            el.draggable = true;
            listContainer.appendChild(el);
            
            el.addEventListener('dragstart', () => {
                draggedItem = el;
                setTimeout(() => el.classList.add('dragging'), 0);
            });
            
            el.addEventListener('dragend', () => {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
            });
        });

        listContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(listContainer, e.clientX);
            if (afterElement == null) {
                listContainer.appendChild(draggedItem);
            } else {
                listContainer.insertBefore(draggedItem, afterElement);
            }
        });

        function getDragAfterElement(container, x) {
            const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        checkBtn.addEventListener('click', () => {
            const userOrder = [...listContainer.children].map(el => el.textContent);
            const isCorrect = userOrder.every((item, index) => item == sortedItems[index]);
            
            if (isCorrect) {
                userScore.stars += 30;
                userScore.coins += 20;
                showSuccessMessage('C\'est bien trié ! 🎉');
                showConfetti();
                checkBtn.textContent = "Niveau suivant";
                checkBtn.onclick = () => {
                    if (currentLevel < 10) showSortingGame(currentLevel + 1);
                    else showLevelMenu(currentTopic);
                };
            } else {
                userScore.coins = Math.max(0, userScore.coins - 5);
                showErrorMessage('Ce n\'est pas le bon ordre.', `La bonne réponse était: ${sortedItems.join(', ')}`);
            }
            updateUI();
            saveProgress();
        });

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));
    }
    
    /**
     * Muestra el juego de adivinanzas.
     */
    function showRiddleGame() {
        currentTopic = 'riddles';
        showLevelMenu(currentTopic);
    }
    
    function loadRiddleQuestion(index) {
        if (index >= riddles.length) {
            win();
            return;
        }
        
        currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();
        
        const riddleData = riddles[currentQuestionIndex];
        const fragment = document.createDocumentFragment();
        
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = riddleData.riddle;
        fragment.appendChild(title);
        speakText(riddleData.riddle);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        
        const shuffledOptions = shuffle([...riddleData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option fx-bounce-in-down';
            optionEl.style.animationDelay = `${i * 0.1 + 0.5}s`;
            const originalIndex = riddleData.options.indexOf(opt);
            optionEl.dataset.index = originalIndex;
            optionEl.addEventListener('click', handleRiddleAnswer);
            applyOptionContent(optionEl, opt, i);
            optionsContainer.appendChild(optionEl);
        });
        fragment.appendChild(optionsContainer);
        content.appendChild(fragment);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));
    }
    
    function handleRiddleAnswer(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleRiddleAnswer));
        
        const riddleData = riddles[currentQuestionIndex];
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = riddleData.correct;
        const correctValue = riddleData.options[correctAnswerIndex];

        if (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex) {
            selectedOption.classList.add('correct');
            userScore.stars += riddleData.reward.stars;
            userScore.coins += riddleData.reward.coins;
            showSuccessMessage('Bonne réponse !');
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            userScore.coins = Math.max(0, userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => parseInt(opt.dataset.index, 10) === correctAnswerIndex);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            showErrorMessage('Mauvaise réponse.', correctValue);
        }
        updateUI();
        saveProgress();
        setTimeout(() => {
            currentQuestionIndex++;
            loadRiddleQuestion(currentQuestionIndex);
        }, 2000);
    }
    
    // --- NOUVEAUX JEUX ---

    function showVowelGame() {
        currentTopic = 'vowels';
        showLevelMenu(currentTopic);
    }
    
    function loadVowelQuestion(index) {
        if (index >= words.length) {
            win();
            return;
        }

        currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();

        const wordData = words[index];
        const word = wordData.word;
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const correctVowel = vowels.find(v => word.includes(v));
        const blankedWord = word.replace(correctVowel, '<span class="blank"></span>');
        
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.innerHTML = `Quelle voyelle manque ? <div class="word-with-blank">${blankedWord}</div>`;
        content.appendChild(title);
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container fx-bounce-in-down';
        imageContainer.innerHTML = `<img src="${wordData.image}" alt="${word}" />`;
        content.appendChild(imageContainer);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        
        const options = shuffle([...vowels.filter(v => v !== correctVowel).slice(0, 3), correctVowel]);
        options.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option fx-bounce-in-down';
            applyOptionContent(optionEl, opt.toUpperCase(), i);
            optionEl.dataset.vowel = opt;
            optionEl.addEventListener('click', handleVowelAnswer);
            optionsContainer.appendChild(optionEl);
        });
        content.appendChild(optionsContainer);
        speakText(`Quelle voyelle manque ? ${wordData.hint}`);

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));
    }

    function handleVowelAnswer(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleVowelAnswer));

        const wordData = words[currentQuestionIndex];
        const word = wordData.word;
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const correctVowel = vowels.find(v => word.includes(v));
        const userAnswer = selectedOption.dataset.vowel;
        
        if (userAnswer === correctVowel) {
            selectedOption.classList.add('correct');
            userScore.stars += 10;
            userScore.coins += 5;
            showSuccessMessage('C\'est la bonne voyelle !');
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            userScore.coins = Math.max(0, userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => opt.dataset.vowel === correctVowel);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            showErrorMessage('Mauvaise réponse.', correctVowel.toUpperCase());
        }
        updateUI();
        saveProgress();

        setTimeout(() => {
            loadVowelQuestion(currentQuestionIndex + 1);
        }, 2000);
    }

    function showSequenceGame() {
        currentTopic = 'sequences';
        showLevelMenu(currentTopic);
    }

    function loadSequenceQuestion(index) {
        if (index >= sequences.length) {
            win();
            return;
        }

        currentQuestionIndex = index;
        content.innerHTML = '';
        updateUI();

        const questionData = sequences[index];
        const title = document.createElement('div');
        title.className = 'question-prompt fx-bounce-in-down';
        title.textContent = 'Quel est le prochain élément de la séquence ?';
        content.appendChild(title);

        const sequenceContainer = document.createElement('div');
        sequenceContainer.className = 'sequence-container fx-bounce-in-down';
        questionData.items.forEach(item => {
            const itemEl = document.createElement('span');
            itemEl.className = 'sequence-item';
            itemEl.textContent = item;
            sequenceContainer.appendChild(itemEl);
        });
        content.appendChild(sequenceContainer);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-grid';
        
        const shuffledOptions = shuffle([...questionData.options]);
        shuffledOptions.forEach((opt, i) => {
            const optionEl = document.createElement('button');
            optionEl.className = 'option fx-bounce-in-down';
            applyOptionContent(optionEl, opt, i);
            optionEl.dataset.value = opt;
            optionEl.addEventListener('click', handleSequenceAnswer);
            optionsContainer.appendChild(optionEl);
        });
        content.appendChild(optionsContainer);
        speakText('Quel est le prochain élément de la séquence ?');

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu(currentTopic));
    }
    
    function handleSequenceAnswer(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleSequenceAnswer));
        
        const questionData = sequences[currentQuestionIndex];
        const userAnswer = selectedOption.dataset.value;
        const correctValue = questionData.correct;

        if (userAnswer === correctValue) {
            selectedOption.classList.add('correct');
            userScore.stars += 15;
            userScore.coins += 10;
            showSuccessMessage('Tu as trouvé le bon ordre !');
            showConfetti();
        } else {
            selectedOption.classList.add('wrong');
            userScore.coins = Math.max(0, userScore.coins - 5);
            const correctOption = Array.from(optionNodes).find(opt => opt.dataset.value === correctValue);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            showErrorMessage('Mauvaise réponse.', correctValue);
        }
        updateUI();
        saveProgress();

        setTimeout(() => {
            loadSequenceQuestion(currentQuestionIndex + 1);
        }, 2000);
    }

    function win() {
        content.innerHTML = `<div class="question-prompt fx-pop">Tu as complété toutes les questions! 🎉</div>
                            <div class="prompt ok">Ton score final : ${userScore.stars} étoiles et ${userScore.coins} pièces.</div>`;
        speakText("Tu as complété toutes les questions! Félicitations pour ton score final.");
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    // --- Start Game ---
    init();
});
