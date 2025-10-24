const gameData = {
    MEMORY_GAME_LEVELS: [
        { level: 1, pairs: 2, grid: '2x2', timeLimit: null, traps: 0 },
        { level: 2, pairs: 4, grid: '2x4', timeLimit: null, traps: 0 },
        { level: 3, pairs: 6, grid: '3x4', timeLimit: null, traps: 0 },
        { level: 4, pairs: 8, grid: '4x4', timeLimit: 90, traps: 0 },
        { level: 5, pairs: 10, grid: '4x5', timeLimit: 100, traps: 2 },
        { level: 6, pairs: 12, grid: '4x6', timeLimit: 120, traps: 2 },
        { level: 7, pairs: 14, grid: '4x7', timeLimit: 130, traps: 3 },
        { level: 8, pairs: 16, grid: '4x8', timeLimit: 140, traps: 4 },
        { level: 9, pairs: 18, grid: '5x8', timeLimit: 150, traps: 4 },
        { level: 10, pairs: 20, grid: '5x8', timeLimit: 160, traps: 5 },
        { level: 11, pairs: 22, grid: '4x11', timeLimit: 170, traps: 6 },
        { level: 12, pairs: 24, grid: '6x8', timeLimit: 180, traps: 6 }
    ],
    sortingLevels: [
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
                { id: 'car', emoji: '🚗', label: 'Voiture', target: 'red' }
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
                { id: 'frog', emoji: '🐸', label: 'Grenouille', target: 'green' }
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
                { id: 'gift', emoji: '🎁', label: 'Cadeau', target: 'blue' }
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
                { id: 'giftbox', emoji: '🎁', label: 'Cadeau', target: 'square' }
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
                { id: 'dice', emoji: '🎲', label: 'Dé', target: 'square' }
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
                { id: 'present', emoji: '🎁', label: 'Surprise', target: 'square' }
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
                { id: 'ladybug', emoji: '🐞', label: 'Coccinelle', target: 'small' }
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
                { id: 'pencil', emoji: '✏️', label: 'Crayon', target: 'small' }
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
                { id: 'shield', emoji: '🛡️', label: 'Bouclier', target: 'blue-square' }
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
                { id: 'flowerYellow', emoji: '🌼', label: 'Fleur', target: 'yellow-circle' }
            ]
        },
        {
            level: 11,
            type: 'category',
            instruction: 'Trie les animaux : ceux de la ferme et ceux de la savane.',
            categories: [
                { id: 'farm', label: 'Ferme 🐔' },
                { id: 'savanna', label: 'Savane 🦁' }
            ],
            items: [
                { id: 'cow', emoji: '🐮', label: 'Vache', target: 'farm' },
                { id: 'lion', emoji: '🦁', label: 'Lion', target: 'savanna' },
                { id: 'pig', emoji: '🐷', label: 'Cochon', target: 'farm' },
                { id: 'zebra', emoji: '🦓', label: 'Zèbre', target: 'savanna' },
                { id: 'chicken', emoji: '🐔', label: 'Poule', target: 'farm' }
            ]
        },
        {
            level: 12,
            type: 'category',
            instruction: 'Classe les aliments : fruits ou légumes ?',
            categories: [
                { id: 'fruit', label: 'Fruits 🍓' },
                { id: 'vegetable', label: 'Légumes 🥕' }
            ],
            items: [
                { id: 'banana', emoji: '🍌', label: 'Banane', target: 'fruit' },
                { id: 'carrot', emoji: '🥕', label: 'Carotte', target: 'vegetable' },
                { id: 'grapes', emoji: '🍇', label: 'Raisin', target: 'fruit' },
                { id: 'broccoli', emoji: '🥦', label: 'Brocoli', target: 'vegetable' },
                { id: 'orange', emoji: '🍊', label: 'Orange', target: 'fruit' }
            ]
        },
        {
            level: 13,
            type: 'transport',
            instruction: 'Trie les moyens de transport.',
            categories: [
                { id: 'land', label: 'Sur Terre 🚗' },
                { id: 'air', label: 'Dans les Airs ✈️' },
                { id: 'water', label: 'Sur l\'Eau ⛵' }
            ],
            items: [
                { id: 'car', emoji: '🚗', label: 'Voiture', target: 'land' },
                { id: 'airplane', emoji: '✈️', label: 'Avion', target: 'air' },
                { id: 'boat', emoji: '⛵', label: 'Bateau', target: 'water' },
                { id: 'bicycle', emoji: '🚲', label: 'Vélo', target: 'land' },
                { id: 'helicopter', emoji: '🚁', label: 'Hélicoptère', target: 'air' }
            ]
        },
        {
            level: 14,
            type: 'category',
            instruction: 'Range les objets : jouets ou fournitures scolaires ?',
            categories: [
                { id: 'toy', label: 'Jouets 🧸' },
                { id: 'school', label: 'École ✏️' }
            ],
            items: [
                { id: 'teddy', emoji: '🧸', label: 'Nounours', target: 'toy' },
                { id: 'pencil', emoji: '✏️', label: 'Crayon', target: 'school' },
                { id: 'ball', emoji: '⚽', label: 'Ballon', target: 'toy' },
                { id: 'book', emoji: '📖', label: 'Livre', target: 'school' },
                { id: 'doll', emoji: '🎎', label: 'Poupée', target: 'toy' }
            ]
        },
        {
            level: 15,
            type: 'weather',
            instruction: 'Quel temps fait-il ?',
            categories: [
                { id: 'sunny', label: 'Soleil ☀️' },
                { id: 'rainy', label: 'Pluie 🌧️' }
            ],
            items: [
                { id: 'sun', emoji: '☀️', label: 'Soleil', target: 'sunny' },
                { id: 'umbrella', emoji: '☔', label: 'Parapluie', target: 'rainy' },
                { id: 'sunglasses', emoji: '😎', label: 'Lunettes', target: 'sunny' },
                { id: 'cloud', emoji: '🌧️', label: 'Nuage', target: 'rainy' }
            ]
        },
    ],
    riddleLevels: [
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
        },
        {
            level: 11,
            theme: "Exploradores del espacio",
            completionMessage: "¡Has viajado entre estrellas como un verdadero explorador!",
            questions: [
                {
                    prompt: "Vuelo con traje plateado y recojo muestras en la luna. ¿Quién soy?",
                    options: ["Una astronauta", "Una sirena", "Una hada"],
                    answer: 0,
                    hint: "Pisa la luna con botas especiales.",
                    success: "¡Exacto, la astronauta explora la luna!",
                    reward: { stars: 17, coins: 13 }
                },
                {
                    prompt: "Ilumino el camino de las naves con mi cola brillante. ¿Quién soy?",
                    options: ["Un cometa", "Un perro", "Un coral"],
                    answer: 0,
                    hint: "Cruzo el cielo dejando una estela.",
                    success: "El cometa es una estrella viajera.",
                    reward: { stars: 17, coins: 13 }
                },
                {
                    prompt: "Llevo un telescopio y busco nuevos planetas. ¿Quién soy?",
                    options: ["Un astrónomo", "Un chef", "Un bailarín"],
                    answer: 0,
                    hint: "Mira el cielo toda la noche.",
                    success: "El astrónomo estudia las estrellas.",
                    reward: { stars: 17, coins: 13 }
                },
                {
                    prompt: "Soy un robot simpático que arregla antenas en el espacio. ¿Quién soy?",
                    options: ["Un pulpo", "Un droide mecánico", "Un músico"],
                    answer: 1,
                    hint: "Tiene herramientas en sus brazos metálicos.",
                    success: "¡Sí, el droide mecánico ayuda en las misiones!",
                    reward: { stars: 17, coins: 13 }
                },
                {
                    prompt: "Cuento historias de galaxias y dibujo constelaciones. ¿Quién soy?",
                    options: ["Un mago de hielo", "Una narradora espacial", "Un carpintero"],
                    answer: 1,
                    hint: "Comparte cuentos antes de dormir mirando el cielo.",
                    success: "Una narradora espacial convierte las estrellas en cuentos.",
                    reward: { stars: 17, coins: 13 }
                }
            ]
        },
        {
            level: 12,
            theme: "Profesiones fantásticas",
            completionMessage: "¡Conoces a los mejores trabajadores mágicos!",
            questions: [
                {
                    prompt: "Preparo pociones de colores para curar dragones. ¿Quién soy?",
                    options: ["Una alquimista", "Una piloto", "Una escultora"],
                    answer: 0,
                    hint: "Mezcla ingredientes burbujeantes.",
                    success: "La alquimista cuida de los dragones.",
                    reward: { stars: 18, coins: 14 }
                },
                {
                    prompt: "Construyo guitarras que lanzan chispas de alegría. ¿Quién soy?",
                    options: ["Un jardinero", "Un luthier mágico", "Un bombero"],
                    answer: 1,
                    hint: "Crea instrumentos especiales para conciertos mágicos.",
                    success: "¡Un luthier mágico fabrica música brillante!",
                    reward: { stars: 18, coins: 14 }
                },
                {
                    prompt: "Coso capas invisibles para héroes tímidos. ¿Quién soy?",
                    options: ["Una costurera encantada", "Una granjera", "Una panadera"],
                    answer: 0,
                    hint: "Trabaja con hilos que desaparecen.",
                    success: "La costurera encantada crea capas especiales.",
                    reward: { stars: 18, coins: 14 }
                },
                {
                    prompt: "Pinto murales que cobran vida por la noche. ¿Quién soy?",
                    options: ["Un pintor nocturno", "Un policía", "Un conductor"],
                    answer: 0,
                    hint: "Sus cuadros se mueven cuando todos duermen.",
                    success: "El pintor nocturno llena la ciudad de magia.",
                    reward: { stars: 18, coins: 14 }
                },
                {
                    prompt: "Dirijo un tren que viaja entre sueños y canciones. ¿Quién soy?",
                    options: ["Una maquinista de sueños", "Una astronauta", "Una librera"],
                    answer: 0,
                    hint: "Conduce vagones que suenan como melodías.",
                    success: "La maquinista de sueños lleva música a todos los pasajeros.",
                    reward: { stars: 18, coins: 14 }
                }
            ]
        },
        {
            level: 13,
            theme: "Bosque encantado",
            completionMessage: "¡Has descubierto cada secreto del bosque mágico!",
            questions: [
                {
                    prompt: "Guardo mapas secretos en mi mochila y guío a los aventureros. ¿Quién soy?",
                    options: ["Un guía del bosque", "Un panadero", "Un marinero"],
                    answer: 0,
                    hint: "Sabe cada sendero y cada escondite.",
                    success: "El guía del bosque conoce todos los caminos.",
                    reward: { stars: 19, coins: 15 }
                }
            ]
        }
    ],
    vowelLevels: [
        { level: 1, masked: 'ch_t', answer: 'a', options: ['a', 'e', 'i'], hint: 'Un animal qui ronronne.' }
    ],
    sequenceLevels: [
        { level: 1, sequence: ['1', '2', '3', '?'], options: ['4', '5', '6'], answer: '4', type: 'number' }
    ]
    ,
    COLOR_MIX_LIBRARY: [
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
        }
    ]
};

// Contes Magiques — jeux d’histoires (story sets)
// These were missing, causing the Stories menu to be empty/disabled.
// Provide three small story sets with title, text, optional image and a short quiz.
window.storySetOne = [
  {
    id: 'foret-etoilee',
    title: 'La Forêt Étoilée',
    bilingualTitle: { en: 'The Starry Forest' },
    theme: 'Aventure',
    duration: 2,
    icon: '🌌',
    image: null,
    text: [
      "Léna marche dans une forêt douce et lumineuse.",
      "Des lucioles dessinent des étoiles tout autour d’elle.",
      "Au loin, une chouette lui murmure un secret: ‘Suis la lumière la plus brillante’."
    ],
    quiz: [
      {
        question: "Que voit Léna autour d’elle ?",
        options: ["Des lucioles", "Des pingouins", "Des dinosaures"],
        answer: 0
      },
      {
        question: "Qui lui murmure un secret ?",
        options: ["Un renard", "Une chouette", "Une licorne"],
        answer: 1
      }
    ]
  },
  {
    id: 'pont-arc-en-ciel',
    title: 'Le Pont Arc‑en‑ciel',
    bilingualTitle: { en: 'The Rainbow Bridge' },
    theme: 'Magie',
    duration: 1,
    icon: '🌈',
    image: null,
    text: [
      "Un petit pont coloré apparaît au-dessus de la rivière.",
      "Chaque pas de Léna éclaire une nouvelle couleur.",
      "Tout au bout, une cloche sonne doucement: ding… ding…"
    ],
    quiz: [
      {
        question: "Qu’est‑ce qui apparaît au-dessus de la rivière ?",
        options: ["Un pont arc‑en‑ciel", "Un château", "Un nuage"],
        answer: 0
      }
    ]
  },
  {
    id: 'grenier-secret',
    title: 'Le Secret du Grenier',
    bilingualTitle: { en: 'The Attic\'s Secret' },
    theme: 'Mystère',
    duration: 3,
    icon: '📦',
    image: null,
    text: [
      "Un jour de pluie, Léna et son chat Yaya montent au grenier.",
      "Yaya, en explorant, fait tomber une vieille boîte. Dedans, une carte mystérieuse !",
      "La carte montre une croix dessinée derrière une armoire. \"Allons voir, Yaya !\", dit Léna.",
      "Derrière l'armoire, ils trouvent un petit coffre rempli de jouets anciens. Le plus beau des trésors !"
    ],
    quiz: [
      {
        question: "Où Léna et Yaya trouvent-ils la carte ?",
        options: ["Dans le jardin", "Dans le grenier", "Dans la cuisine"],
        answer: 1
      },
      {
        question: "Que découvrent-ils grâce à la carte ?",
        options: ["Un coffre au trésor", "Un passage secret", "Un gâteau au chocolat"],
        answer: 0
      }
    ]
  },
  {
    id: 'jardin-murmures',
    title: 'Le Jardin des Murmures',
    bilingualTitle: { en: 'The Whispering Garden' },
    theme: 'Nature',
    duration: 2,
    icon: '🌸',
    image: null,
    text: [
      "Dans le jardin de Léna, les fleurs ne font pas que sentir bon, elles murmurent des secrets.",
      "Une rose lui chuchote : \"Le plus grand trésor est l'amitié.\"",
      "Un tournesol ajoute : \"Et le soleil est son plus grand sourire.\"",
      "Léna sourit, heureuse de connaître le langage des fleurs."
    ],
    quiz: [
      {
        question: "Que font les fleurs dans le jardin de Léna ?",
        options: ["Elles chantent", "Elles murmurent des secrets", "Elles dansent"],
        answer: 1
      }
    ]
  },
  {
    id: 'peintre-renard',
    title: 'Le Renard Peintre',
    bilingualTitle: { en: 'The Painting Fox' },
    theme: 'Créativité',
    duration: 1,
    icon: '🦊',
    image: null,
    text: [
      "Un petit renard trouve des pots de peinture abandonnés dans la forêt.",
      "Avec sa queue, il dessine un arc-en-ciel sur une grande pierre.",
      "Tous les animaux viennent admirer son œuvre d'art colorée."
    ]
  },
  {
    id: 'nuage-sculpteur',
    title: 'Le Nuage Sculpteur',
    bilingualTitle: { en: 'The Cloud Sculptor' },
    theme: 'Créativité',
    duration: 2,
    icon: '☁️',
    text: [
      "Dans le ciel, un petit nuage s'ennuie.",
      "Il décide de se transformer en mouton, puis en dragon, puis en bateau.",
      "Léna, depuis son jardin, applaudit à chaque nouvelle sculpture."
    ],
    quiz: [{
      question: "En quoi le nuage ne se transforme-t-il PAS ?",
      options: ["Mouton", "Maison", "Dragon"],
      answer: 1
    }]
  },
  {
    id: 'cle-chansons',
    title: 'La Clé des Chansons',
    bilingualTitle: { en: 'The Key of Songs' },
    theme: 'Magie',
    duration: 2,
    icon: '🔑',
    text: [
      "Léna trouve une clé en or qui ne semble ouvrir aucune porte.",
      "En la posant sur une fleur, la fleur se met à chanter une douce mélodie.",
      "La clé magique peut faire chanter n'importe quel objet !"
    ]
  },
  {
    id: 'gnome-grincheux',
    title: 'Le Grincheux du Potager',
    bilingualTitle: { en: 'The Grumpy Gardener' },
    theme: 'Humour',
    duration: 2,
    icon: '😠',
    text: [
      "Gnorman le gnome avait un potager. Mais Gnorman était toujours grincheux.",
      "Ses carottes poussaient avec des visages fâchés. Ses tomates boudaient sur la vigne.",
      "Un jour, une coccinelle lui raconta une blague. Gnorman éclata de rire !",
      "Soudain, tous ses légumes se mirent à sourire. Un potager heureux, c'est bien meilleur !"
    ],
    quiz: [{
      question: "Pourquoi les légumes de Gnorman étaient-ils fâchés ?",
      options: ["Parce qu'il ne pleuvait pas", "Parce que Gnorman était grincheux", "Parce qu'ils n'aimaient pas le soleil"],
      answer: 1
    }]
  },
  {
    id: 'chaussette-voleuse',
    title: 'La Chaussette Voleuse',
    bilingualTitle: { en: 'The Sock Thief' },
    theme: 'Humour',
    duration: 2,
    icon: '🧦',
    text: [
      "Dans la machine à laver de Léna, vivait une chaussette magique nommée Socquette.",
      "Socquette n'aimait pas être seule. Son jeu préféré ? Manger les autres chaussettes pour leur faire des câlins.",
      "C'est pour ça qu'il manque toujours une chaussette après la lessive !",
      "Mais ne t'inquiète pas, elle les relâche quand elles ont eu assez de câlins."
    ],
    quiz: [{
      question: "Quel est le jeu préféré de Socquette ?",
      options: ["Faire des bulles", "Manger les autres chaussettes", "Se cacher dans les pantalons"],
      answer: 1
    }]
  },
  {
    id: 'dragon-peureux',
    title: 'Le Dragon qui avait peur des Souris',
    bilingualTitle: { en: 'The Dragon Who Was Afraid of Mice' },
    theme: 'Humour',
    duration: 3,
    icon: '🐲',
    text: [
      "Ignis était un grand dragon rouge qui gardait un trésor immense.",
      "Il n'avait peur de rien... sauf des souris !",
      "Un jour, une petite souris nommée Pipa entra dans sa grotte. Ignis sauta sur une pile d'or en criant.",
      "Pipa, voyant le dragon terrifié, lui promit de ne plus entrer s'il partageait une pièce d'or. Ignis accepta aussitôt !"
    ],
    quiz: [{
      question: "De quoi le dragon Ignis a-t-il peur ?",
      options: ["Des chevaliers", "Des souris", "Du noir"],
      answer: 1
    }]
  },
  {
    id: 'mystere-fil-scintillant',
    title: 'Le Mystère du Fil Scintillant',
    bilingualTitle: { en: 'The Mystery of the Glimmering Thread' },
    theme: 'Mystère',
    duration: 5,
    icon: '🧵',
    text: [
      "Un matin, Yaya le chat découvrit un fil scintillant dans le jardin. Il brillait de mille feux sous le soleil.",
      "Intrigué, il donna un petit coup de patte. Le fil se déroula, menant vers la maison. Léna, voyant le manège de Yaya, décida de le suivre.",
      "Le fil les guida sous le canapé, derrière la bibliothèque, puis monta à l'étage. \"Où nous mènes-tu, petit fil ?\" murmura Léna.",
      "Le fil s'arrêtait devant une petite porte oubliée : celle du grenier. Ensemble, ils montèrent les marches poussiéreuses.",
      "Là, dans un coin sombre, le fil était attaché à une vieille boîte à musique. Léna l'ouvrit doucement.",
      "Une douce mélodie s'éleva, remplissant le grenier de magie. Le fil n'était qu'une toile d'araignée capturant la lumière, mais il les avait menés à un véritable trésor de souvenirs."
    ],
    quiz: [{
      question: "Qu'est-ce que Yaya a trouvé dans le jardin ?",
      options: ["Un os", "Un fil scintillant", "Une fleur magique"],
      answer: 1
    }, {
      question: "Où le fil les a-t-il conduits ?",
      options: ["À la cuisine", "Au grenier", "Dans la chambre de Léna"],
      answer: 1
    }]
  },
  {
    id: 'course-feuilles-automne',
    title: 'La Course des Feuilles d\'Automne',
    bilingualTitle: { en: 'The Autumn Leaf Race' },
    theme: 'Aventure',
    duration: 6,
    icon: '🍂',
    text: [
      "C'était un jour d'automne venteux. Les feuilles dansaient dans les airs. \"Et si on faisait une course, Yaya ?\" proposa Léna.",
      "Léna choisit une grande feuille rouge et Yaya une petite feuille jaune. Au signal, ils les lâchèrent.",
      "Le vent emporta les feuilles à travers le parc. Elles tourbillonnaient, passaient au-dessus des flaques d'eau et se faufilaient entre les arbres.",
      "La feuille de Léna prit de l'avance, mais celle de Yaya, plus légère, la rattrapa. Le chat miaulait d'excitation en la poursuivant.",
      "Soudain, la feuille de Yaya se coinça dans une branche basse. Le chat, déçu, s'assit en la regardant.",
      "Léna, voyant son ami triste, abandonna sa propre course. Elle grimpa sur le banc, libéra la feuille jaune et la rendit à Yaya.",
      "\"Peu importe qui gagne,\" dit-elle en caressant son chat. \"L'important, c'est de s'amuser ensemble.\" Ils regardèrent les deux feuilles s'envoler, côte à côte, vers le ciel."
    ],
    quiz: [{
      question: "Quelle couleur était la feuille de Léna ?",
      options: ["Jaune", "Rouge", "Verte"],
      answer: 1
    }, {
      question: "Pourquoi la feuille de Yaya s'est-elle arrêtée ?",
      options: ["Elle est tombée dans l'eau", "Elle s'est coincée dans une branche", "Le vent s'est arrêté"],
      answer: 1
    }]
  }
];

window.storySetTwo = [
  {
    id: 'train-des-reves',
    title: 'Le Train des Rêves',
    bilingualTitle: { en: 'The Dream Train' },
    theme: 'Aventure',
    duration: 2,
    icon: '🚂',
    image: null,
    text: [
      "Un train tout doux arrive sans bruit.",
      "Ses wagons sont remplis de couvertures moelleuses et de livres.",
      "Léna s’assoit près d’une fenêtre et lit en souriant."
    ],
    quiz: [
      {
        question: "Que transportent les wagons ?",
        options: ["Des couvertures et des livres", "Des fleurs", "Des coquillages"],
        answer: 0
      }
    ]
  },
  {
    id: 'potion-de-rire',
    title: 'La Potion de Rire',
    bilingualTitle: { en: 'The Laughter Potion' },
    theme: 'Humour',
    duration: 2,
    icon: '🧪',
    image: null,
    text: [
      "Léna et Yaya le chat décident de devenir des magiciens. \"Faisons une potion magique, Yaya !\"",
      "Dans un grand bol, Léna mélange du jus de pomme, de l'eau pétillante et un pétale de rose du jardin.",
      "Yaya observe, le nez froncé. Il trempe une patte et la lèche. Soudain, il se met à ronronner très fort en riant !",
      "Léna goûte aussi. La potion est délicieuse et la fait rire aux éclats avec son ami Yaya."
    ],
    quiz: [
      {
        question: "Quels ingrédients Léna utilise-t-elle ?",
        options: ["Jus de pomme, eau et rose", "Lait et chocolat", "Jus d'orange et carottes"],
        answer: 0
      }
    ]
  },
  {
    id: 'bibliotheque-etoiles',
    title: 'La Bibliothèque sous les Étoiles',
    bilingualTitle: { en: 'The Library Under the Stars' },
    theme: 'Magie',
    duration: 2,
    icon: '📚',
    image: null,
    text: [
      "Une nuit, Léna découvre une bibliothèque en plein air.",
      "Les livres ont des couvertures qui scintillent comme des étoiles.",
      "Chaque livre raconte l'histoire d'une constellation."
    ],
    quiz: [
      {
        question: "De quoi parlent les livres ?",
        options: ["Des animaux", "Des constellations", "Des recettes"],
        answer: 1
      }
    ]
  },
  {
    id: 'chat-explorateur',
    title: 'Le Chat Explorateur',
    bilingualTitle: { en: 'The Explorer Cat' },
    theme: 'Aventure',
    duration: 2,
    icon: '🐾',
    image: null,
    text: [
      "Yaya, le chat de Léna, adore explorer.",
      "Un jour, il grimpe sur le toit et découvre un nid d'oiseaux abandonné.",
      "Dedans, il trouve une plume bleue brillante qu'il rapporte fièrement à Léna."
    ],
    quiz: [
      {
        question: "Que trouve Yaya sur le toit ?",
        options: ["Une plume bleue", "Un trésor", "Un autre chat"],
        answer: 0
      }
    ]
  },
  {
    id: 'crayon-voyageur',
    title: 'Le Crayon Voyageur',
    bilingualTitle: { en: 'The Traveling Pencil' },
    theme: 'Créativité',
    duration: 2,
    icon: '✏️',
    text: [
      "Léna a un crayon magique. Tout ce qu'elle dessine prend vie.",
      "Elle dessine une petite porte sur son mur. La porte s'ouvre sur une plage ensoleillée.",
      "Elle passe la journée à construire des châteaux de sable avant de redessiner la porte pour rentrer."
    ],
    quiz: [{
      question: "Où la porte dessinée mène-t-elle ?",
      options: ["Une forêt", "Une plage", "Une montagne"],
      answer: 1
    }]
  },
  {
    id: 'goutte-pluie',
    title: 'La Goutte de Pluie Curieuse',
    bilingualTitle: { en: 'The Curious Raindrop' },
    theme: 'Nature',
    duration: 1,
    icon: '💧',
    text: [
      "Une petite goutte de pluie nommée Plume glisse d'un nuage.",
      "Elle traverse un arc-en-ciel, se colore de mille feux, puis atterrit sur le pétale d'une tulipe.",
      "La tulipe la remercie pour sa fraîcheur colorée."
    ]
  },
  {
    id: 'echo-montagne',
    title: 'L\'Écho de la Montagne',
    bilingualTitle: { en: 'The Mountain\'s Echo' },
    theme: 'Nature',
    duration: 1,
    icon: '⛰️',
    text: [
        "Léna crie \"Bonjour !\" face à la montagne.",
        "La montagne lui répond \"Bonjour... jour... our...\"",
        "Amusée, Léna lui raconte une blague, et la montagne rit avec elle."
    ]
  },
  {
    id: 'bibliotheque-murmures',
    title: 'La Bibliothèque des Murmures',
    bilingualTitle: { en: 'The Library of Whispers' },
    theme: 'Magie',
    duration: 2,
    icon: '🤫',
    text: [
        "Au fond du jardin se trouve une bibliothèque où les livres chuchotent leurs histoires.",
        "Il ne faut pas lire les mots, mais écouter les pages.",
        "Léna s'assoit et écoute un conte sur un dragon timide."
    ],
    quiz: [{
        question: "Comment faut-il 'lire' les livres dans cette bibliothèque ?",
        options: ["En les secouant", "En écoutant les pages", "En les regardant de loin"],
        answer: 1
    }]
  },
  {
    id: 'fantome-noir',
    title: 'Le Fantôme qui avait peur du Noir',
    bilingualTitle: { en: 'The Ghost Who Was Afraid of the Dark' },
    theme: 'Humour',
    duration: 2,
    icon: '👻',
    text: [
      "Phosfor était un fantôme très gentil, mais il avait un secret : il avait peur du noir.",
      "Dès que la nuit tombait, il allumait toutes les lumières du château.",
      "Les autres fantômes trouvaient ça bizarre, mais au moins, personne ne se cognait dans les couloirs !",
      "Finalement, une petite luciole devint son amie et sa veilleuse personnelle."
    ],
    quiz: [{
      question: "Quelle est la plus grande peur de Phosfor ?",
      options: ["Des chats", "Du noir", "Des araignées"],
      answer: 1
    }]
  },
  {
    id: 'escargot-presse',
    title: 'L\'Escargot Trop Pressé',
    bilingualTitle: { en: 'The Snail in a Hurry' },
    theme: 'Humour',
    duration: 2,
    icon: '🐌',
    text: [
      "Turbo l'escargot voulait être le plus rapide du jardin.",
      "Il essaya de mettre des roulettes à sa coquille, mais il dérapa sur une tomate.",
      "Il tenta de glisser sur une feuille de salade, mais il finit dans l'assiette du pique-nique.",
      "Finalement, il comprit que la lenteur avait du bon : il était le seul à voir les jolies fleurs en chemin."
    ],
    quiz: [{
      question: "Qu'est-ce que Turbo a essayé de mettre sur sa coquille ?",
      options: [
        "Un moteur",
        "Des roulettes",
        "Des ailes"
      ],
      answer: 1
    }]
  },
  {
    id: 'royaume-coussins',
    title: 'Le Royaume des Coussins',
    bilingualTitle: { en: 'The Kingdom of Cushions' },
    theme: 'Créativité',
    duration: 7,
    icon: '🏰',
    text: [
      "Un après-midi pluvieux, Léna décida de construire le plus grand royaume jamais vu. Son matériau de construction ? Des coussins !",
      "Avec Yaya comme fidèle architecte, ils empilèrent les coussins du canapé pour former de hautes murailles. Une couverture devint le toit du grand donjon.",
      "\"Yaya, tu seras le gardien du trésor !\" déclara Léna. Le trésor était une petite balle rebondissante que Yaya adorait.",
      "Le chat se posta fièrement à l'entrée du fort, observant les alentours. Mais un ennemi redoutable approchait : l'aspirateur, piloté par Papa.",
      "\"Oh non, le monstre grondant !\" cria Léna en riant. Yaya se hérissa, prêt à défendre son royaume.",
      "Papa, jouant le jeu, fit semblant d'être effrayé par le courageux gardien. Il éteignit l'aspirateur et s'inclina. \"Pardon, noble sire Yaya. Je ne savais pas que ce château était vôtre.\"",
      "Léna et Yaya avaient sauvé leur royaume. Ils passèrent le reste de l'après-midi à régner sur leur forteresse de douceur, en dégustant un goûter royal."
    ],
    quiz: [{
      question: "Quel était le trésor gardé par Yaya ?",
      options: ["Une couronne", "Une balle rebondissante", "Un poisson en plastique"],
      answer: 1
    }, {
      question: "Quel était l'ennemi du royaume des coussins ?",
      options: ["Un dragon", "L'aspirateur", "Un orage"],
      answer: 1
    }]
  },
  {
    id: 'detectives-ombre-perdue',
    title: 'Les Détectives de l\'Ombre Perdue',
    bilingualTitle: { en: 'The Detectives of the Lost Shadow' },
    theme: 'Mystère',
    duration: 6,
    icon: '🕵️‍♀️',
    text: [
      "Un jour, en jouant dans le jardin, Léna remarqua quelque chose d'étrange. Son ombre avait disparu !",
      "\"Yaya, nous avons une nouvelle mission ! Nous sommes les détectives de l'ombre perdue !\" Yaya, équipé d'une fausse loupe (un anneau de rideau), semblait prêt.",
      "Le premier indice : le soleil était caché derrière un gros nuage. \"Aha ! L'ombre n'aime pas quand le soleil se cache,\" nota Léna dans son carnet imaginaire.",
      "Ils cherchèrent partout. Sous le toboggan ? Non. Derrière le grand chêne ? Toujours pas. Yaya reniflait le sol, cherchant une piste.",
      "Léna eut une idée. Elle prit une lampe de poche. \"Si le soleil ne veut pas nous aider, créons notre propre lumière !\"",
      "Elle alluma la lampe et la pointa vers le sol. Aussitôt, une petite ombre apparut à ses pieds, puis grandit. \"On l'a retrouvée !\" s'exclama-t-elle.",
      "Yaya, fasciné, se mit à pourchasser l'ombre de la lampe, la faisant danser partout. Le mystère était résolu, et un nouveau jeu venait de commencer."
    ],
    quiz: [{
      question: "Pourquoi l'ombre de Léna avait-elle disparu au début ?",
      options: ["Elle était partie en vacances", "Le soleil était caché par un nuage", "Elle jouait à cache-cache"],
      answer: 1
    }, {
      question: "Comment Léna a-t-elle fait réapparaître son ombre ?",
      options: ["En attendant le soleil", "En utilisant une lampe de poche", "En demandant à Yaya"],
      answer: 1
    }]
  }
];

window.storySetThree = [
  {
    id: 'etoile-qui-chante',
    title: 'L’Étoile qui Chante',
    bilingualTitle: { en: 'The Singing Star' },
    theme: 'Magie',
    duration: 2,
    icon: '🎶',
    image: null,
    text: [
      "Dans le ciel, une petite étoile fredonne une chanson.",
      "La mélodie guide Léna jusqu’à un jardin de nuit.",
      "Les fleurs s’ouvrent en rythme et brillent doucement."
    ],
    quiz: [
      {
        question: "Qui fredonne une chanson ?",
        options: ["Une fleur", "Une étoile", "Une goutte de pluie"],
        answer: 1
      }
    ]
  },
  {
    id: 'voyage-nuage',
    title: 'Le Voyage sur un Nuage',
    bilingualTitle: { en: 'The Journey on a Cloud' },
    theme: 'Aventure',
    duration: 2,
    icon: '☁️',
    image: null,
    text: [
      "Léna et Yaya font la sieste sur l'herbe douce du jardin.",
      "Ils rêvent qu'un nuage cotonneux descend du ciel pour les emporter.",
      "Ensemble, ils flottent au-dessus des maisons, saluant les oiseaux et les étoiles.",
      "Le nuage les redépose doucement dans le jardin juste avant le réveil."
    ],
    quiz: [
      {
        question: "Sur quoi Léna et Yaya voyagent-ils dans leur rêve ?",
        options: ["Un tapis volant", "Un nuage", "Un dragon"],
        answer: 1
      }
    ]
  },
  {
    id: 'montagne-chocolat',
    title: 'La Montagne de Chocolat',
    bilingualTitle: { en: 'The Chocolate Mountain' },
    theme: 'Gourmandise',
    duration: 2,
    icon: '🍫',
    image: null,
    text: [
      "Léna rêve qu'elle escalade une montagne entièrement faite de chocolat.",
      "Les rochers sont des pépites de chocolat et les rivières du chocolat fondu.",
      "Au sommet, elle trouve une fontaine de chocolat blanc."
    ],
    quiz: [
      {
        question: "De quoi est faite la montagne ?",
        options: ["De pierre", "De chocolat", "De glace"],
        answer: 1
      }
    ]
  },
  {
    id: 'poisson-volant',
    title: 'Le Poisson Volant',
    bilingualTitle: { en: 'The Flying Fish' },
    theme: 'Aventure',
    duration: 2,
    icon: '🐠',
    image: null,
    text: [
      "Un petit poisson rouge rêve de voler.",
      "Une bulle d'air magique l'emporte hors de l'eau.",
      "Il survole la mer et salue les mouettes avant de replonger doucement."
    ],
    quiz: [
      {
        question: "Comment le poisson fait-il pour voler ?",
        options: ["Avec des ailes", "Grâce à une bulle magique", "En sautant très haut"],
        answer: 1
      }
    ]
  },
  {
    id: 'instrument-magique',
    title: 'L\'Instrument Magique',
    bilingualTitle: { en: 'The Magical Instrument' },
    theme: 'Créativité',
    duration: 2,
    icon: '🎷',
    image: null,
    text: [
      "Dans une boutique, Léna trouve un instrument étrange.",
      "Quand elle en joue, il ne produit pas de son, mais des bulles de savon colorées.",
      "Chaque bulle contient un petit rêve en image."
    ]
  },
  {
    id: 'murmure-vent',
    title: 'Le Murmure du Vent',
    bilingualTitle: { en: 'The Whisper of the Wind' },
    theme: 'Nature',
    duration: 1,
    icon: '🌬️',
    text: [
      "Quand le vent souffle, il ne fait pas que faire danser les feuilles.",
      "Il transporte des messages secrets d'un bout à l'autre du monde.",
      "Léna tend l'oreille et entend un \"je t'aime\" venu de très loin."
    ]
  },
  {
    id: 'pierre-chaude',
    title: 'Le Secret de la Pierre Chaude',
    bilingualTitle: { en: 'The Secret of the Warm Stone' },
    theme: 'Nature',
    duration: 2,
    icon: '💎',
    text: [
      "Sur le chemin, Léna trouve une pierre lisse et chaude, même la nuit.",
      "La pierre a emmagasiné toute la lumière du soleil de la journée.",
      "Elle la met dans sa poche pour avoir un peu de soleil avec elle, même dans le noir."
    ],
    quiz: [{
      question: "Pourquoi la pierre est-elle chaude ?",
      options: ["Elle est magique", "Elle a stocké la lumière du soleil", "Elle sort du feu"],
      answer: 1
    }]
  },
  {
    id: 'constellation-animaux',
    title: 'La Constellation des Animaux',
    bilingualTitle: { en: 'The Animal Constellation' },
    theme: 'Nature',
    duration: 1,
    icon: '🐻',
    text: [
        "La nuit, les étoiles ne forment pas que des figures géométriques.",
        "Si on regarde bien, on peut voir un grand ours, un lion et même un petit lapin.",
        "Ils dansent lentement dans le ciel jusqu'au lever du jour."
    ]
  },
  {
    id: 'bateau-feuille',
    title: 'Le Bateau de Feuille',
    bilingualTitle: { en: 'The Leaf Boat' },
    theme: 'Aventure',
    duration: 1,
    icon: '🍂',
    text: [
        "Léna pose une grande feuille d'automne sur la rivière.",
        "Une coccinelle monte à bord, puis une fourmi.",
        "La feuille devient un bateau de croisière pour les insectes, naviguant vers l'aventure."
    ]
  },
  {
    id: 'mouton-coiffeur',
    title: 'Le Mouton Coiffeur',
    bilingualTitle: { en: 'The Sheep Hairdresser' },
    theme: 'Humour',
    duration: 2,
    icon: '🐑',
    text: [
      "Barnabé le mouton avait la laine la plus douce et la plus longue du pré.",
      "Un jour, il décida d'ouvrir un salon de coiffure pour ses amis.",
      "Il sculpta des coiffures incroyables aux autres moutons avec sa propre laine.",
      "Le mouton punk, le mouton à nuage... tout le monde était très stylé !"
    ],
    quiz: [{
      question: "Qu'est-ce que Barnabé utilise pour coiffer ses amis ?",
      options: ["Des ciseaux", "Sa propre laine", "De la peinture"],
      answer: 1
    }]
  },
  {
    id: 'voyage-sous-canape',
    title: 'Le Voyage sous le Canapé',
    bilingualTitle: { en: 'The Journey Under the Couch' },
    theme: 'Aventure',
    duration: 5,
    icon: '🛋️',
    text: [
      "La petite voiture préférée de Léna avait roulé sous le canapé. \"C'est une mission pour l'exploratrice Léna et son courageux chat Yaya !\" annonça-t-elle.",
      "Armée d'une lampe de poche, Léna s'allongea sur le ventre. Yaya, curieux, la rejoignit. Le monde sous le canapé était un univers étrange et poussiéreux.",
      "Des 'montagnes' de moutons de poussière se dressaient devant eux. Un crayon perdu ressemblait à un tronc d'arbre géant.",
      "\"Regarde, Yaya, une grotte de miettes !\" chuchota Léna. Yaya, lui, avait repéré la voiture, coincée près d'une 'forêt' de pieds de table.",
      "Le chat, plus agile, se faufila et donna un petit coup de patte à la voiture, la faisant rouler vers Léna.",
      "Mission accomplie ! Ils sortirent de sous le canapé, victorieux et un peu sales. Léna serra Yaya dans ses bras. \"Tu es le meilleur co-explorateur du monde !\""
    ],
    quiz: [{
      question: "Quel objet était perdu sous le canapé ?",
      options: ["Une poupée", "Une petite voiture", "Un livre"],
      answer: 1
    }, {
      question: "Qui a récupéré l'objet en premier ?",
      options: ["Léna", "Papa", "Yaya"],
      answer: 2
    }]
  },
  {
    id: 'bain-moussant-magique',
    title: 'Le Bain Moussant Magique',
    bilingualTitle: { en: 'The Magical Bubble Bath' },
    theme: 'Magie',
    duration: 7,
    icon: '🛁',
    text: [
      "C'était l'heure du bain. Léna versa un produit moussant couleur arc-en-ciel dans la baignoire. La mousse monta, monta, jusqu'à former des montagnes et des nuages colorés.",
      "Yaya, qui détestait l'eau, observait depuis le tapis de bain, méfiant. Léna prit un peu de mousse et sculpta un petit bateau.",
      "\"Regarde Yaya, le navire de l'amiral Léna part à l'aventure !\" Le bateau flotta sur l'eau, naviguant entre des icebergs de mousse blanche.",
      "Soudain, une bulle éclata près du nez de Yaya, le surprenant. Il donna un coup de patte maladroit et tomba dans la mousse ! Mais il n'y avait presque pas d'eau, juste une mer de douceur.",
      "Au lieu de paniquer, Yaya se mit à jouer, attrapant les bulles avec ses pattes. Il ressemblait à un petit monstre de mousse.",
      "Léna éclata de rire. Elle sculpta une couronne de mousse sur la tête de Yaya. \"Sire Yaya, le roi du royaume de la Mousse !\"",
      "Pour la première fois, Yaya semblait apprécier l'heure du bain. C'était bien plus amusant d'être un roi de la mousse qu'un chat qui a peur de l'eau."
    ],
    quiz: [{
      question: "Qu'a sculpté Léna avec la mousse en premier ?",
      options: ["Un château", "Un bateau", "Un animal"],
      answer: 1
    }, {
      question: "Comment Yaya a-t-il réagi en tombant dans la mousse ?",
      options: ["Il a eu très peur", "Il s'est mis à jouer", "Il a immédiatement sauté hors du bain"],
      answer: 1
    }]
  },
  {
    id: 'jardinier-lune',
    title: 'Le Jardinier de la Lune',
    bilingualTitle: { en: 'The Moon Gardener' },
    theme: 'Magie',
    duration: 4,
    icon: '👨‍🚀',
    text: [
      "Chaque nuit, un vieil homme nommé Sélénius sort avec son arrosoir d'argent.",
      "Il ne jardine pas sur Terre, mais sur la Lune. Il grimpe sur une échelle de corde invisible.",
      "Là-haut, il arrose les cratères avec de la poussière d'étoile. Au matin, des fleurs de lumière y ont poussé.",
      "Ces fleurs, vues de la Terre, sont les étoiles que nous admirons."
    ],
    quiz: [{
      question: "Avec quoi Sélénius arrose-t-il les cratères ?",
      options: ["De l'eau de pluie", "De la poussière d'étoile", "Du lait"],
      answer: 1
    }]
  },
  {
    id: 'bibliotheque-perdue',
    title: 'La Bibliothèque Perdue',
    bilingualTitle: { en: 'The Lost Library' },
    theme: 'Mystère',
    duration: 8,
    icon: '🏛️',
    text: [
      "Au cœur de la forêt, une légende parle d'une bibliothèque où les livres n'ont pas de fin.",
      "Léna, intriguée, suit une vieille carte trouvée dans un livre. Le chemin est gardé par des énigmes.",
      "Un renard lui demande : 'Qu'est-ce qui a des villes, mais pas de maisons ; des forêts, mais pas d'arbres ; et de l'eau, mais pas de poissons ?'",
      "Léna réfléchit et répond : 'Une carte !'. Le renard, impressionné, lui montre un passage secret derrière une cascade.",
      "Derrière, une immense bibliothèque circulaire apparaît. Les livres flottent dans les airs.",
      "Elle en ouvre un. L'histoire commence, mais à la dernière page, elle est invitée à écrire la suite.",
      "Chaque lecteur devient l'auteur. C'est pour cela que les histoires ne finissent jamais."
    ],
    quiz: [{
      question: "Quelle est la réponse à l'énigme du renard ?",
      options: ["Un globe", "Une carte", "Un miroir"],
      answer: 1
    }, {
      question: "Pourquoi les livres de la bibliothèque n'ont-ils pas de fin ?",
      options: ["Les pages sont infinies", "Les lecteurs écrivent la suite", "Les fins sont effacées"],
      answer: 1
    }]
  },
  {
    id: 'capitaine-nuage',
    title: 'Le Capitaine du Nuage Pirate',
    bilingualTitle: { en: 'The Captain of the Cloud Pirate' },
    theme: 'Aventure',
    duration: 5,
    icon: '🏴‍☠️',
    text: [
      "Le Capitaine Nimbus ne navigue pas sur les mers, mais sur un grand nuage en forme de bateau.",
      "Son trésor n'est pas de l'or, mais des gouttes de pluie de toutes les couleurs.",
      "Un jour, son nuage est attaqué par le terrible Vent du Nord, qui veut voler ses précieuses gouttes.",
      "Nimbus a une idée : il utilise une goutte de pluie rouge pour créer un arc-en-ciel si éblouissant que le Vent du Nord, surpris, s'enfuit.",
      "Le trésor est sauvé, et le ciel est plus beau que jamais."
    ],
    quiz: [{
      question: "Quel est le trésor du Capitaine Nimbus ?",
      options: ["Des pièces d'or", "Des gouttes de pluie colorées", "Des coquillages"],
      answer: 1
    }]
  },
  {
    id: 'detective-gateau',
    title: 'Le Mystère du Gâteau Disparu',
    bilingualTitle: { en: 'The Mystery of the Missing Cake' },
    theme: 'Mystère',
    duration: 6,
    icon: '🕵️',
    text: [
      "Le gâteau au chocolat de Léna a disparu de la cuisine ! Qui est le coupable ?",
      "Léna, en mode détective, cherche des indices. Premier indice : des petites miettes près de la fenêtre.",
      "Deuxième indice : une petite plume rousse accrochée au rideau. Yaya le chat n'a pas de plumes...",
      "Troisième indice : des petites empreintes de pattes dans la farine renversée sur le sol.",
      "Léna suit les empreintes jusqu'au jardin. Derrière un buisson, elle trouve un petit écureuil, le museau couvert de chocolat, qui dort paisiblement.",
      "Le mystère est résolu ! L'écureuil gourmand a fait un festin. Léna ne peut s'empêcher de sourire."
    ],
    quiz: [{
      question: "Quel est le deuxième indice trouvé par Léna ?",
      options: ["Des miettes", "Une plume rousse", "Des empreintes"],
      answer: 1
    }, {
      question: "Qui était le coupable ?",
      options: ["Yaya le chat", "Un oiseau", "Un écureuil"],
      answer: 2
    }]
  }
];


if (typeof window !== 'undefined') {
    window.gameData = gameData;
}
