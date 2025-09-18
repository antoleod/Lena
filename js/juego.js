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
    let currentVowelLevelData = null;

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
        '⚪ Blanc + 🔴 Rouge': 'pink', '🔵 Bleu + 🟡 Jaune': 'green', '🔴 Rouge + 🟡 Jaune': 'orange', '🔵 Bleu + 🔴 Rouge': 'purple',
    };

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
            prompt: "J'ai 4 pattes 🐾 et j'aboie 🐶. Qui suis-je ?",
            options: ['Un chiot', 'Un chat', 'Un oiseau'],
            answer: 0,
            reward: { stars: 12, coins: 8 }
        },
        {
            level: 2,
            prompt: "Je suis jaune 🍌 et très courbé. Qui suis-je ?",
            options: ['Une banane', 'Une carotte', 'Un citron'],
            answer: 0,
            reward: { stars: 12, coins: 8 }
        },
        {
            level: 3,
            prompt: "Je vole 🕊️ et j'ai des ailes. Qui suis-je ?",
            options: ['Un poisson', 'Un oiseau', 'Un chien'],
            answer: 1,
            reward: { stars: 12, coins: 8 }
        },
        {
            level: 4,
            prompt: "Qui brille le jour ?",
            image: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
            options: ['La lune', 'Le soleil', 'Une étoile filante'],
            answer: 1,
            reward: { stars: 15, coins: 10 }
        },
        {
            level: 5,
            prompt: "Qui ronronne à la maison ?",
            image: 'https://cdn-icons-png.flaticon.com/512/3208/3208750.png',
            options: ['Un chien', 'Un chat', 'Un lapin'],
            answer: 1,
            reward: { stars: 15, coins: 10 }
        },
        {
            level: 6,
            prompt: "Qui éclaire la nuit ?",
            image: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
            options: ['La lune', 'Un nuage', 'Un livre'],
            answer: 0,
            reward: { stars: 15, coins: 10 }
        },
        {
            level: 7,
            prompt: "Je suis rond, je brille la nuit. Qui suis-je ?",
            options: ['La lune', 'Un cerf-volant', 'Une balle'],
            answer: 0,
            reward: { stars: 18, coins: 12 }
        },
        {
            level: 8,
            prompt: "Je grandis quand tu m'arroses et je perds mes feuilles en automne. Qui suis-je ?",
            options: ['Une fleur', 'Un arbre', 'Une pierre'],
            answer: 1,
            reward: { stars: 18, coins: 12 }
        },
        {
            level: 9,
            prompt: "Je suis rempli de pages, j'aime qu'on me lise. Qui suis-je ?",
            options: ['Un livre', 'Une boîte', 'Un chapeau'],
            answer: 0,
            reward: { stars: 20, coins: 14 }
        },
        {
            level: 10,
            prompt: "Plus je grandis, plus je deviens léger. Qui suis-je ?",
            options: ['Une bulle', 'Une pierre', 'Un train'],
            answer: 0,
            reward: { stars: 22, coins: 16 }
        }
    ];

    const vowelLevels = [
        { level: 1, masked: 'ch_t', answer: 'a', options: ['a', 'e', 'i', 'o'], hint: 'Un animal qui ronronne.' },
        { level: 2, masked: 'l_ne', answer: 'u', options: ['u', 'o', 'a', 'i'], hint: 'Elle brille la nuit.' },
        { level: 3, masked: 'b_bé', answer: 'é', options: ['é', 'a', 'i', 'o'], hint: 'Il rit aux éclats.' },
        { level: 4, masked: 'cl__n', answer: 'ow', options: ['ow', 'oi', 'ou', 'au'], hint: 'Il fait rire au cirque.' },
        { level: 5, masked: 'p_tt__ m__s', answer: 'eeai', options: ['eeai', 'aaee', 'ieea', 'ouie'], hint: 'De petites maisons adorables.' },
        { level: 6, masked: 'm__on', answer: 'ai', options: ['ai', 'ei', 'oi', 'au'], hint: 'Elle aime le fromage !' },
        { level: 7, masked: 'La f__ danse.', answer: 'ée', options: ['ée', 'ai', 'au', 'ou'], hint: 'Une petite créature magique.' },
        { level: 8, masked: 'Il pl__t tr_s beau.', answer: 'euè', options: ['euè', 'eau', 'aie', 'oui'], hint: 'On parle du temps.' },
        { level: 9, masked: 'Nous aim__ chanter.', answer: 'er', options: ['er', 'ai', 'ou', 'ie'], hint: 'Une chorale amusante.' },
        { level: 10, masked: 'Les él_ves écrivent en s__r.', answer: 'èoi', options: ['èoi', 'eau', 'aio', 'oui'], hint: 'Une phrase scolaire.' }
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
            { id: 'stories', text: '📚Contes Magiques' },
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
            'sorting': sortingLevels.length,
            'riddles': riddleLevels.length,
            'vowels': vowelLevels.length,
            'sequences': sequenceLevels.length,
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

        const levelData = sortingLevels.find(entry => entry.level === level) || sortingLevels[sortingLevels.length - 1];
        const reward = { stars: 12 + level * 2, coins: 8 + Math.max(0, level - 1) * 2 };

        const container = document.createElement('div');
        container.className = 'sorting-container fx-bounce-in-down';

        const instruction = document.createElement('p');
        instruction.className = 'question-prompt';
        instruction.textContent = level === 1
            ? `${levelData.instruction} Glisse-les et lâche-les dans le bon panier.`
            : levelData.instruction;
        container.appendChild(instruction);
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
            const allPlaced = tokens.every(token => token.parentElement && token.parentElement.dataset && token.parentElement.dataset.category === token.dataset.target);
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
    
    function loadRiddleQuestion(index) {
        if (index < 0 || index >= riddleLevels.length) {
            win();
            return;
        }

        currentQuestionIndex = index;
        const riddleData = riddleLevels[index];
        currentLevel = riddleData.level;

        content.innerHTML = '';
        updateUI();

        const wrapper = document.createElement('div');
        wrapper.className = 'riddle-wrapper fx-bounce-in-down';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = riddleData.prompt;
        wrapper.appendChild(title);
        speakText(riddleData.prompt);

        if (riddleData.image) {
            const image = document.createElement('img');
            image.className = 'riddle-image';
            image.src = riddleData.image;
            image.alt = 'Indice visuel';
            wrapper.appendChild(image);
        }

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

        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour aux niveaux', () => showLevelMenu('riddles'));
    }
    
    function handleRiddleAnswer(event) {
        const selectedOption = event.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : (event.target.closest && event.target.closest('.option'));
        if (!selectedOption) { return; }

        const container = selectedOption.closest('.options-grid');
        const optionNodes = container ? container.querySelectorAll('.option') : document.querySelectorAll('.option');
        optionNodes.forEach(opt => opt.removeEventListener('click', handleRiddleAnswer));

        const riddleData = riddleLevels[currentQuestionIndex];
        const userAnswerIndex = parseInt(selectedOption.dataset.index, 10);
        const correctAnswerIndex = riddleData.answer;
        const correctValue = riddleData.options[correctAnswerIndex];

        if (!Number.isNaN(userAnswerIndex) && userAnswerIndex === correctAnswerIndex) {
            selectedOption.classList.add('correct');
            selectedOption.classList.add('riddle-correct-glow');
            userScore.stars += riddleData.reward.stars;
            userScore.coins += riddleData.reward.coins;
            answeredQuestions[`riddles-${currentLevel}`] = 'completed';
            saveProgress();
            showSuccessMessage('Bonne réponse !');
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
            showErrorMessage('Mauvaise réponse.', correctValue);
            answeredQuestions[`riddles-${currentLevel}`] = 'in-progress';
            saveProgress();
        }
        updateUI();
        setTimeout(() => {
            if (currentQuestionIndex + 1 < riddleLevels.length) {
                loadRiddleQuestion(currentQuestionIndex + 1);
            } else {
                showLevelMenu('riddles');
            }
        }, 2000);
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

        content.innerHTML = '';
        updateUI();

        const wrapper = document.createElement('div');
        wrapper.className = 'vowel-wrapper fx-bounce-in-down';

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = 'Quelle voyelle manque ?';
        wrapper.appendChild(title);

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

        if (userAnswer && userAnswer.toLowerCase() === expected.toLowerCase()) {
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
            setTimeout(() => {
                currentVowelLevelData = null;
                if (currentQuestionIndex + 1 < vowelLevels.length) {
                    loadVowelQuestion(currentQuestionIndex + 1);
                } else {
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
            showErrorMessage('Mauvaise réponse.', 'Regarde bien les lettres.');
            setTimeout(() => {
                currentVowelLevelData.displayEl.classList.remove('is-error');
                currentVowelLevelData.buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.addEventListener('click', handleVowelAnswer);
                    btn.classList.remove('vowel-option-wrong');
                });
                hideVowelFeedback();
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

        const title = document.createElement('div');
        title.className = 'question-prompt';
        title.textContent = 'Quel est le prochain élément de la séquence ?';
        container.appendChild(title);
        speakText(title.textContent);

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
        btnLogros.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
        configureBackButton('Retour au Menu Principal', showTopicMenu);
    }

    // --- Start Game ---
    init();
});
