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
            "level": 1,
            "theme": "Animaux calins",
            "completionMessage": "Tu connais tous les animaux calins !",
            "questions": [
                {
                    "prompt": "Je suis petit, je ronronne et j'aime boire du lait. Qui suis-je ?",
                    "options": [
                        "Un chaton",
                        "Un veau",
                        "Un poussin"
                    ],
                    "answer": 0,
                    "hint": "Je dors souvent dans un panier en osier.",
                    "success": "Bravo, le chaton adore les caresses !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je saute dans le jardin et je grignote des carottes. Qui suis-je ?",
                    "options": [
                        "Un lapin",
                        "Un chiot",
                        "Un herisson"
                    ],
                    "answer": 0,
                    "hint": "Mes oreilles sont tres longues.",
                    "success": "Oui, le lapin aime bondir partout !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je marche lentement en portant ma maison sur mon dos. Qui suis-je ?",
                    "options": [
                        "Une tortue",
                        "Un hamster",
                        "Une coccinelle"
                    ],
                    "answer": 0,
                    "hint": "Je peux vivre sur terre et parfois dans l'eau.",
                    "success": "Exact, la tortue avance a son rythme !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis tout jaune, je gazouille et je nage dans la mare. Qui suis-je ?",
                    "options": [
                        "Un caneton",
                        "Un flamant",
                        "Un merle"
                    ],
                    "answer": 0,
                    "hint": "Je suis le bebe d'une cane.",
                    "success": "Bien joue, le caneton aime barboter !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis tout rond, je dors tout l'hiver et je cherche du miel. Qui suis-je ?",
                    "options": [
                        "Un ourson",
                        "Un pingouin",
                        "Un castor"
                    ],
                    "answer": 0,
                    "hint": "Je suis le bebe d'une ourse.",
                    "success": "Oui, l'ourson reve de miel doux !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis minuscule, je cours dans ma roue et je garde des graines. Qui suis-je ?",
                    "options": [
                        "Un hamster",
                        "Une loutre",
                        "Un toucan"
                    ],
                    "answer": 0,
                    "hint": "Je vis souvent dans une cage avec des tunnels.",
                    "success": "C'est bien le hamster tout rapide !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis gris, j'ai une trompe et je suis tres gentil. Qui suis-je ?",
                    "options": [
                        "Un bebe elephant",
                        "Un rhinoceros",
                        "Un crocodile"
                    ],
                    "answer": 0,
                    "hint": "Je peux arroser avec ma trompe.",
                    "success": "Bravo, le bebe elephant adore l'eau !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis orange, je tourne dans mon bocal et j'aime les bulles. Qui suis-je ?",
                    "options": [
                        "Un poisson rouge",
                        "Un dauphin",
                        "Un hippocampe"
                    ],
                    "answer": 0,
                    "hint": "Je suis un animal de compagnie silencieux.",
                    "success": "Oui, le poisson rouge aime observer tout le monde !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                }
            ]
        },
        {
            "level": 2,
            "theme": "Animaux aventuriers",
            "completionMessage": "Tu as explore la foret des animaux aventuriers !",
            "questions": [
                {
                    "prompt": "Je suis le roi de la savane et je rugis tres fort. Qui suis-je ?",
                    "options": [
                        "Un lion",
                        "Un ours",
                        "Un zebu"
                    ],
                    "answer": 0,
                    "hint": "Ma criniere brille au soleil.",
                    "success": "Bravo, le lion protege sa troupe !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis noir et blanc et je croque du bambou toute la journee. Qui suis-je ?",
                    "options": [
                        "Un panda",
                        "Un koala",
                        "Un tapir"
                    ],
                    "answer": 0,
                    "hint": "Je vis dans une foret de bambous.",
                    "success": "Exact, le panda adore les pousses tendres !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je vole la nuit en utilisant un radar magique. Qui suis-je ?",
                    "options": [
                        "Une chauve-souris",
                        "Une chouette",
                        "Un corbeau"
                    ],
                    "answer": 0,
                    "hint": "Je dors la tete en bas.",
                    "success": "Oui, la chauve-souris glisse dans le noir !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis tres grand, j'ai un long cou pour manger les feuilles. Qui suis-je ?",
                    "options": [
                        "Une girafe",
                        "Un autruche",
                        "Un lama"
                    ],
                    "answer": 0,
                    "hint": "Je vis sur la savane africaine.",
                    "success": "Bravo, la girafe atteint les arbres les plus hauts !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je cours tres vite avec mes taches pour me cacher. Qui suis-je ?",
                    "options": [
                        "Un guepard",
                        "Un zepard",
                        "Un coyote"
                    ],
                    "answer": 0,
                    "hint": "Je suis le grand sprinteur de la savane.",
                    "success": "Quelle vitesse, le guepard file comme le vent !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis noir et blanc, je nage et je glisse sur la banquise. Qui suis-je ?",
                    "options": [
                        "Un pingouin",
                        "Une otarie",
                        "Un morse"
                    ],
                    "answer": 0,
                    "hint": "Je porte un frac pour plonger dans l'eau glacee.",
                    "success": "Bien vu, le pingouin adore les plongeons !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis geant, je chante dans l'ocean et je souffle un jet d'eau. Qui suis-je ?",
                    "options": [
                        "Une baleine",
                        "Un requin",
                        "Un narval"
                    ],
                    "answer": 0,
                    "hint": "Je voyage sur des milliers de kilometres.",
                    "success": "Oui, la baleine chante pour ses amis !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis ruse, j'ai une queue touffue et j'habite la foret. Qui suis-je ?",
                    "options": [
                        "Un renard",
                        "Un blaireau",
                        "Un castor"
                    ],
                    "answer": 0,
                    "hint": "Je suis souvent rouge flamboyant.",
                    "success": "Malin comme un renard, bien joue !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                }
            ]
        },
        {
            "level": 3,
            "theme": "Gouter magique",
            "completionMessage": "Tu as prepare un gouter enchante !",
            "questions": [
                {
                    "prompt": "Je suis moelleux, je suis parfois au chocolat et on me souffle pour un anniversaire. Qui suis-je ?",
                    "options": [
                        "Un gateau",
                        "Une salade",
                        "Une soupe"
                    ],
                    "answer": 0,
                    "hint": "Je porte des bougies et des decorations.",
                    "success": "Miam, le gateau est pret a etre partage !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis un fruit rouge avec des pepins, on me trouve en ete. Qui suis-je ?",
                    "options": [
                        "Une fraise",
                        "Une banane",
                        "Une prune"
                    ],
                    "answer": 0,
                    "hint": "Je me cache dans un petit panier.",
                    "success": "Bonne idee, la fraise est bien sucree !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis tout rond, j'ai une peau orange et je laisse le jus degouliner. Qui suis-je ?",
                    "options": [
                        "Une orange",
                        "Un kiwi",
                        "Un abricot"
                    ],
                    "answer": 0,
                    "hint": "On me presse pour faire une boisson vitaminee.",
                    "success": "Bravo, une orange pleine d'energie !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis croquant, je suis fait de pain et de garnitures. Qui suis-je ?",
                    "options": [
                        "Un sandwich",
                        "Un biscuit",
                        "Une tarte"
                    ],
                    "answer": 0,
                    "hint": "On me glisse dans une boite a gouter.",
                    "success": "Super, le sandwich est pret pour le pique-nique !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis glace, je peux avoir trois boules et je fonds vite. Qui suis-je ?",
                    "options": [
                        "Une glace",
                        "Une confiture",
                        "Un yaourt"
                    ],
                    "answer": 0,
                    "hint": "Je suis delicieuse en plein ete.",
                    "success": "Oui, la glace rafraichit tout le monde !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis un fruit croquant qui peut etre rouge ou vert. Qui suis-je ?",
                    "options": [
                        "Une pomme",
                        "Une figue",
                        "Un citron"
                    ],
                    "answer": 0,
                    "hint": "Un proverbe dit qu'une par jour garde la sante.",
                    "success": "La pomme croque sous la dent, bravo !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis doree, legere et je sors d'un grille-pain. Qui suis-je ?",
                    "options": [
                        "Une gaufre",
                        "Une crepe",
                        "Une tranche de pain"
                    ],
                    "answer": 0,
                    "hint": "On me recouvre parfois de sucre glace.",
                    "success": "Oui, la gaufre croustille comme il faut !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je suis une boisson chaude que l'on boit le matin avec du lait. Qui suis-je ?",
                    "options": [
                        "Un cacao",
                        "Un soda",
                        "Un jus de raisin"
                    ],
                    "answer": 0,
                    "hint": "Je sens bon le chocolat.",
                    "success": "Quel parfum, le cacao rechauffe le gouter !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                }
            ]
        },
        {
            "level": 4,
            "theme": "Objets de la classe",
            "completionMessage": "Tu connais chaque outil de la classe magique !",
            "questions": [
                {
                    "prompt": "Je dessine et j'efface, je suis souvent bleu ou noir. Qui suis-je ?",
                    "options": [
                        "Un feutre",
                        "Un pinceau",
                        "Un compas"
                    ],
                    "answer": 0,
                    "hint": "Je vis sur le tableau blanc.",
                    "success": "Exact, le feutre trace des idees !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je tiens les feuilles sans bouger, je mordille le papier. Qui suis-je ?",
                    "options": [
                        "Un trombone",
                        "Un cutter",
                        "Une gomme"
                    ],
                    "answer": 0,
                    "hint": "Je suis en metal et je me plie facilement.",
                    "success": "Bravo, le trombone garde les copies ensemble !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je coupe le papier proprement avec mes deux lames. Qui suis-je ?",
                    "options": [
                        "Des ciseaux",
                        "Une regle",
                        "Une perforatrice"
                    ],
                    "answer": 0,
                    "hint": "Je suis dangereux sans surveillance.",
                    "success": "Bien joue, les ciseaux decoupent avec soin !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je calcule et j'affiche des chiffres lumineux. Qui suis-je ?",
                    "options": [
                        "Une calculatrice",
                        "Un dictionnaire",
                        "Une trousse"
                    ],
                    "answer": 0,
                    "hint": "Je t'aide pendant les devoirs de maths.",
                    "success": "Oui, la calculatrice donne les bonnes reponses !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je trace des lignes droites et mesure des centimetres. Qui suis-je ?",
                    "options": [
                        "Une regle",
                        "Un pinceau",
                        "Un rapporteur"
                    ],
                    "answer": 0,
                    "hint": "Je suis transparent et gradue.",
                    "success": "Super, la regle aide a tout aligner !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je garde les crayons bien ranges. Qui suis-je ?",
                    "options": [
                        "Une trousse",
                        "Un cartable",
                        "Un sac a dos"
                    ],
                    "answer": 0,
                    "hint": "Je vis souvent dans le cartable.",
                    "success": "Bravo, la trousse protege les tresors de dessin !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je projette une histoire ou une image sur le mur. Qui suis-je ?",
                    "options": [
                        "Un videoprojecteur",
                        "Un microscope",
                        "Un sablier"
                    ],
                    "answer": 0,
                    "hint": "Je fonctionne avec un ordinateur.",
                    "success": "Oui, le videoprojecteur illumine la classe !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                },
                {
                    "prompt": "Je porte les livres et les cahiers sur mon dos. Qui suis-je ?",
                    "options": [
                        "Un cartable",
                        "Une chaise",
                        "Un pupitre"
                    ],
                    "answer": 0,
                    "hint": "Je voyage entre la maison et l'ecole.",
                    "success": "Cartable pret, mission accomplie !",
                    "reward": {
                        "stars": 6,
                        "coins": 4
                    }
                }
            ]
        },
        {
            "level": 5,
            "theme": "Maison enchantee",
            "completionMessage": "Tu t'es promene dans toute la maison enchantee !",
            "questions": [
                {
                    "prompt": "Je cuis des gateaux dans ma chaleur douce. Qui suis-je ?",
                    "options": [
                        "Un four",
                        "Un frigo",
                        "Un evier"
                    ],
                    "answer": 0,
                    "hint": "On m'ouvre avec des gants.",
                    "success": "Bravo, le four fait lever la pate !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je garde les aliments au frais jour et nuit. Qui suis-je ?",
                    "options": [
                        "Un frigo",
                        "Un four",
                        "Un lave-vaisselle"
                    ],
                    "answer": 0,
                    "hint": "Je bourdonne doucement.",
                    "success": "Exact, le frigo conserve les gouts !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je lave les vetements avec de la mousse. Qui suis-je ?",
                    "options": [
                        "Une machine a laver",
                        "Un aspirateur",
                        "Une poubelle"
                    ],
                    "answer": 0,
                    "hint": "Je tourne tres vite en faisant un tourbillon.",
                    "success": "Bien vu, la machine a laver nettoie tout !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je balaye le tapis avec un grand bruit. Qui suis-je ?",
                    "options": [
                        "Un aspirateur",
                        "Un balai",
                        "Un plumeau"
                    ],
                    "answer": 0,
                    "hint": "Je suis branche a une prise.",
                    "success": "Oui, l'aspirateur avale la poussiere !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je brille au plafond et j'eclaire la piece. Qui suis-je ?",
                    "options": [
                        "Une lampe",
                        "Une television",
                        "Une plante"
                    ],
                    "answer": 0,
                    "hint": "Je peux etre suspendue ou posee sur une table.",
                    "success": "Super, la lampe illumine la maison !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis douce et moelleuse, on s'assoit sur moi pour lire. Qui suis-je ?",
                    "options": [
                        "Un canape",
                        "Une table",
                        "Une armoire"
                    ],
                    "answer": 0,
                    "hint": "Je suis souvent dans le salon.",
                    "success": "Parfait, le canape invite a se reposer !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je montre la date et j'entends un tic-tac. Qui suis-je ?",
                    "options": [
                        "Une horloge",
                        "Un miroir",
                        "Une fenetre"
                    ],
                    "answer": 0,
                    "hint": "Je peux sonner toutes les heures.",
                    "success": "Oui, l'horloge aide a ne pas etre en retard !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis pleine de bulles, on me prend pour se laver en riant. Qui suis-je ?",
                    "options": [
                        "Une baignoire",
                        "Un lavabo",
                        "Une douche"
                    ],
                    "answer": 0,
                    "hint": "Je deviens un bateau de jouets.",
                    "success": "Baignoire magique, mission proprete !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                }
            ]
        },
        {
            "level": 6,
            "theme": "Nature mysterieuse",
            "completionMessage": "Tu as decode tous les secrets de la nature mysterieuse !",
            "questions": [
                {
                    "prompt": "Je tombe du ciel, je suis douce au printemps. Qui suis-je ?",
                    "options": [
                        "La pluie",
                        "La neige",
                        "Le vent"
                    ],
                    "answer": 0,
                    "hint": "Je fais pousser les fleurs.",
                    "success": "Bravo, la pluie arrose la terre !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je brille fort dans le ciel et je rechauffe tout. Qui suis-je ?",
                    "options": [
                        "Le soleil",
                        "La lune",
                        "Une etoile filante"
                    ],
                    "answer": 0,
                    "hint": "Je disparais la nuit.",
                    "success": "Oui, le soleil dore la journee !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis une plante qui grimpe et me couvre de ronces. Qui suis-je ?",
                    "options": [
                        "Un rosier",
                        "Un pommier",
                        "Une herbe"
                    ],
                    "answer": 0,
                    "hint": "Mes fleurs ont des epines.",
                    "success": "Bien joue, le rosier porte des roses parfumees !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis un insecte qui fabrique du miel. Qui suis-je ?",
                    "options": [
                        "Une abeille",
                        "Une fourmi",
                        "Un grillon"
                    ],
                    "answer": 0,
                    "hint": "Je danse pour avertir mes amies.",
                    "success": "Exact, l'abeille butine les fleurs !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je souffle tres fort et fais voler les feuilles. Qui suis-je ?",
                    "options": [
                        "Le vent",
                        "Un orage",
                        "Le brouillard"
                    ],
                    "answer": 0,
                    "hint": "Je peux etre doux ou violent.",
                    "success": "Oui, le vent siffle entre les arbres !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis un arbre qui perd ses feuilles en automne. Qui suis-je ?",
                    "options": [
                        "Un chene",
                        "Un sapin",
                        "Un palmier"
                    ],
                    "answer": 0,
                    "hint": "Je produis des glands pour les ecureuils.",
                    "success": "Bravo, le chene est solide et ancien !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis un caillou brillant que l'on trouve dans la montagne. Qui suis-je ?",
                    "options": [
                        "Un cristal",
                        "Un charbon",
                        "Une coquille"
                    ],
                    "answer": 0,
                    "hint": "Je scintille a la lumiere.",
                    "success": "Super, le cristal etincelle comme un tresor !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis un petit cours d'eau qui serpente dans la foret. Qui suis-je ?",
                    "options": [
                        "Un ruisseau",
                        "Une cascade",
                        "Un ocean"
                    ],
                    "answer": 0,
                    "hint": "Je chante en roulant sur les pierres.",
                    "success": "Quel calme, le ruisseau raconte une histoire !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                }
            ]
        },
        {
            "level": 7,
            "theme": "Voyage en ville",
            "completionMessage": "Tu as visite chaque coin de la ville !",
            "questions": [
                {
                    "prompt": "Je transporte de nombreux passagers sur des rails. Qui suis-je ?",
                    "options": [
                        "Un tramway",
                        "Un bus",
                        "Un taxi"
                    ],
                    "answer": 0,
                    "hint": "Je fais ding ding en tournant.",
                    "success": "Bravo, le tramway glisse dans les rues !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je distribue des lettres et des colis. Qui suis-je ?",
                    "options": [
                        "Le facteur",
                        "Le pompier",
                        "Le jardinier"
                    ],
                    "answer": 0,
                    "hint": "Je roule avec une sacoche.",
                    "success": "Exact, le facteur apporte des nouvelles !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je vends du pain croustillant tres tot le matin. Qui suis-je ?",
                    "options": [
                        "La boulangerie",
                        "La banque",
                        "La pharmacie"
                    ],
                    "answer": 0,
                    "hint": "Ca sent bon devant ma vitrine.",
                    "success": "Miam, la boulangerie regale la ville !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je conduis les gens d'un endroit a un autre sur la route. Qui suis-je ?",
                    "options": [
                        "Un bus",
                        "Un train",
                        "Un avion"
                    ],
                    "answer": 0,
                    "hint": "Je m'arrete a plusieurs stations.",
                    "success": "Bien vu, le bus relie les quartiers !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je protege la ville et j'eteins les incendies. Qui suis-je ?",
                    "options": [
                        "La caserne des pompiers",
                        "L'hopital",
                        "Le musee"
                    ],
                    "answer": 0,
                    "hint": "Je sors des camions rouges.",
                    "success": "Oui, la caserne veille sur tout le monde !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je garde les livres et je prete des histoires. Qui suis-je ?",
                    "options": [
                        "Une bibliotheque",
                        "Un cinema",
                        "Un theatre"
                    ],
                    "answer": 0,
                    "hint": "Je suis un endroit silencieux.",
                    "success": "Bravo, la bibliotheque cache mille aventures !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je fais traverser les pietons en toute securite. Qui suis-je ?",
                    "options": [
                        "Un feu tricolore",
                        "Une fontaine",
                        "Un kiosque"
                    ],
                    "answer": 0,
                    "hint": "Je change de couleur pour donner le signal.",
                    "success": "Parfait, le feu tricolore guide les passants !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis un endroit vert pour jouer et pique-niquer. Qui suis-je ?",
                    "options": [
                        "Un parc",
                        "Une gare",
                        "Une usine"
                    ],
                    "answer": 0,
                    "hint": "Je suis rempli d'arbres et de bancs.",
                    "success": "Super, le parc detend toute la ville !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                }
            ]
        },
        {
            "level": 8,
            "theme": "Instruments et sons",
            "completionMessage": "Tu as maitrise la musique des instruments magiques !",
            "questions": [
                {
                    "prompt": "Je suis petit, je fais ding ding et j'aide a garder le rythme. Qui suis-je ?",
                    "options": [
                        "Un triangle",
                        "Un piano",
                        "Une flute"
                    ],
                    "answer": 0,
                    "hint": "On me frappe avec une baguette.",
                    "success": "Bravo, le triangle tinte joyeusement !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je possede des cordes et je se joue avec un archet. Qui suis-je ?",
                    "options": [
                        "Un violon",
                        "Une guitare",
                        "Une harpe"
                    ],
                    "answer": 0,
                    "hint": "Je chante sous le menton.",
                    "success": "Exact, le violon chante dans l'orchestre !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis un clavier noir et blanc que l'on touche avec les doigts. Qui suis-je ?",
                    "options": [
                        "Un piano",
                        "Un accordion",
                        "Un orgue"
                    ],
                    "answer": 0,
                    "hint": "Je peux etre droit ou a queue.",
                    "success": "Oui, le piano remplit la salle de musique !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis un instrument a vent dore qui brille. Qui suis-je ?",
                    "options": [
                        "Une trompette",
                        "Un harmonica",
                        "Une clarinette"
                    ],
                    "answer": 0,
                    "hint": "Je fais un son clair et puissant.",
                    "success": "Bien joue, la trompette reveille tout le monde !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je garde le tempo avec deux baguettes. Qui suis-je ?",
                    "options": [
                        "Une batterie",
                        "Un tambourin",
                        "Un xylophone"
                    ],
                    "answer": 0,
                    "hint": "Je suis compose de plusieurs tambours.",
                    "success": "Super, la batterie lance le rythme !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis en bois ou en metal, on me souffle pour faire une melodie. Qui suis-je ?",
                    "options": [
                        "Une flute",
                        "Un saxophone",
                        "Un hautbois"
                    ],
                    "answer": 0,
                    "hint": "Je peux etre droite ou traversiere.",
                    "success": "Oui, la flute chante comme un oiseau !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis un instrument africain avec des lamelles que l'on pince. Qui suis-je ?",
                    "options": [
                        "Une kalimba",
                        "Un banjo",
                        "Une cornemuse"
                    ],
                    "answer": 0,
                    "hint": "On m'appelle aussi piano a pouce.",
                    "success": "Bravo, la kalimba tinte doucement !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                },
                {
                    "prompt": "Je suis electrique et j'accompagne les concerts rock. Qui suis-je ?",
                    "options": [
                        "Une guitare electrique",
                        "Une mandoline",
                        "Un clavecin"
                    ],
                    "answer": 0,
                    "hint": "Je vibre grace aux amplis.",
                    "success": "Quelle energie, la guitare electrique fait danser !",
                    "reward": {
                        "stars": 7,
                        "coins": 5
                    }
                }
            ]
        },
        {
            "level": 9,
            "theme": "Metiers de reve",
            "completionMessage": "Tu as rencontre tous les metiers de reve !",
            "questions": [
                {
                    "prompt": "Je soigne les animaux malades et je les rassure. Qui suis-je ?",
                    "options": [
                        "Un veterinaire",
                        "Un pilote",
                        "Un jardinier"
                    ],
                    "answer": 0,
                    "hint": "Je porte parfois une blouse blanche.",
                    "success": "Bravo, le veterinaire protege nos compagnons !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je dessine des plans et je construis des maisons. Qui suis-je ?",
                    "options": [
                        "Un architecte",
                        "Un boulanger",
                        "Un musicien"
                    ],
                    "answer": 0,
                    "hint": "Je travaille avec des maquettes.",
                    "success": "Exact, l'architecte imagine la ville de demain !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je plante, j'arrose et je fais pousser des legumes. Qui suis-je ?",
                    "options": [
                        "Un maraicher",
                        "Un medecin",
                        "Un pilote"
                    ],
                    "answer": 0,
                    "hint": "Je travaille dans les champs ou les serres.",
                    "success": "Oui, le maraicher cultive les saveurs !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je pilote une fusee et j'observe la Terre. Qui suis-je ?",
                    "options": [
                        "Un astronaute",
                        "Un marin",
                        "Un explorateur"
                    ],
                    "answer": 0,
                    "hint": "Je flotte sans gravite.",
                    "success": "Quel voyage, l'astronaute voltige dans l'espace !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je raconte des histoires avec ma camera. Qui suis-je ?",
                    "options": [
                        "Un realisateur",
                        "Un chirurgien",
                        "Un pompier"
                    ],
                    "answer": 0,
                    "hint": "Je crie parfois action !",
                    "success": "Super, le realisateur fait vivre les films !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je joue de la musique devant un public. Qui suis-je ?",
                    "options": [
                        "Un musicien",
                        "Un libraire",
                        "Un juge"
                    ],
                    "answer": 0,
                    "hint": "Je repete des heures mon instrument.",
                    "success": "Bravo, le musicien enchante la scene !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je cree des jeux video avec du code. Qui suis-je ?",
                    "options": [
                        "Un developpeur",
                        "Un cuisinier",
                        "Un pilote"
                    ],
                    "answer": 0,
                    "hint": "Je travaille avec un ordinateur.",
                    "success": "Genial, le developpeur invente des mondes !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je dessine des vetements sur mesure. Qui suis-je ?",
                    "options": [
                        "Un styliste",
                        "Un menuisier",
                        "Un coiffeur"
                    ],
                    "answer": 0,
                    "hint": "Je choisis des tissus et des couleurs.",
                    "success": "Tres chic, le styliste imagine la mode !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                }
            ]
        },
        {
            "level": 10,
            "theme": "Explorer le temps",
            "completionMessage": "Tu as mis de l'ordre dans toutes les heures magiques !",
            "questions": [
                {
                    "prompt": "Je sonne le matin pour reveiller tout le monde. Qui suis-je ?",
                    "options": [
                        "Un reveil",
                        "Une brosse",
                        "Un parapluie"
                    ],
                    "answer": 0,
                    "hint": "Je fais dring dring a l'aube.",
                    "success": "Bravo, le reveil annonce le depart de la journee !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je marque le debut de la rentree scolaire. Quel moment suis-je ?",
                    "options": [
                        "Le mois de septembre",
                        "Le mois de fevrier",
                        "Le mois de juin"
                    ],
                    "answer": 0,
                    "hint": "Les feuilles commencent a jaunir.",
                    "success": "Exact, septembre ouvre les cahiers !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis le moment ou l'on dejeune a l'ecole. Qui suis-je ?",
                    "options": [
                        "Le midi",
                        "Le matin",
                        "Le soir"
                    ],
                    "answer": 0,
                    "hint": "Le soleil est tout en haut.",
                    "success": "Bon appetit, le midi redonne des forces !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je represente sept jours de suite. Qui suis-je ?",
                    "options": [
                        "Une semaine",
                        "Un trimestre",
                        "Une annee"
                    ],
                    "answer": 0,
                    "hint": "Je commence souvent par lundi.",
                    "success": "Parfait, la semaine organise les activites !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis la saison ou les fleurs eclatent de couleur. Qui suis-je ?",
                    "options": [
                        "Le printemps",
                        "L'hiver",
                        "L'automne"
                    ],
                    "answer": 0,
                    "hint": "Les oiseaux reviennent chanter.",
                    "success": "Oui, le printemps reveille la nature !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis le petit repos apres le dejeuner. Qui suis-je ?",
                    "options": [
                        "La sieste",
                        "Le gouter",
                        "Le devoir"
                    ],
                    "answer": 0,
                    "hint": "Je dure quelques minutes et detend.",
                    "success": "Quelle douceur, la sieste apaise les aventuriers !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je marque la fin de la journee de classe. Qui suis-je ?",
                    "options": [
                        "La sortie",
                        "Le reveil",
                        "Le petit dejeuner"
                    ],
                    "answer": 0,
                    "hint": "La cloche retentit pour rentrer a la maison.",
                    "success": "Bravo, la sortie annonce le temps libre !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je reviens tous les douze mois avec des cadeaux et des bougies. Qui suis-je ?",
                    "options": [
                        "Un anniversaire",
                        "Un carnaval",
                        "Un bal"
                    ],
                    "answer": 0,
                    "hint": "On souffle pour faire un voeu.",
                    "success": "Joyeux anniversaire, mission souvenir !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                }
            ]
        },
        {
            "level": 11,
            "theme": "Sciences lumineuses",
            "completionMessage": "Tu as eclaire tous les secrets scientifiques !",
            "questions": [
                {
                    "prompt": "Je fais de la lumiere avec une pile et une ampoule. Qui suis-je ?",
                    "options": [
                        "Une lampe de poche",
                        "Un microscope",
                        "Un telephone"
                    ],
                    "answer": 0,
                    "hint": "Je suis utile dans le noir.",
                    "success": "Bravo, la lampe de poche guide le chemin !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je fais tourner les aiguilles d'un aimant. Qui suis-je ?",
                    "options": [
                        "Une boussole",
                        "Un ventilateur",
                        "Un casque"
                    ],
                    "answer": 0,
                    "hint": "Je montre le nord.",
                    "success": "Exact, la boussole indique la direction !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je mesure la temperature. Qui suis-je ?",
                    "options": [
                        "Un thermometre",
                        "Un voltmetre",
                        "Un telemetre"
                    ],
                    "answer": 0,
                    "hint": "Je peux afficher des degres.",
                    "success": "Bien vu, le thermometre surveille la chaleur !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je rapproche les choses lointaines avec deux lentilles. Qui suis-je ?",
                    "options": [
                        "Des jumelles",
                        "Des lunettes",
                        "Un periscope"
                    ],
                    "answer": 0,
                    "hint": "On me porte devant les yeux.",
                    "success": "Oui, les jumelles agrandissent le paysage !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je transforme l'energie du soleil en electricite. Qui suis-je ?",
                    "options": [
                        "Un panneau solaire",
                        "Un radiateur",
                        "Un ventilateur"
                    ],
                    "answer": 0,
                    "hint": "Je suis compose de cellules bleutees.",
                    "success": "Super, le panneau solaire capte la lumiere !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je fais flotter des objets lourds grace a l'air chaud. Qui suis-je ?",
                    "options": [
                        "Une montgolfiere",
                        "Une fusee",
                        "Une trottinette"
                    ],
                    "answer": 0,
                    "hint": "Je ressemble a un grand ballon.",
                    "success": "Bravo, la montgolfiere s'envole doucement !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je melange des liquides dans mon laboratoire. Qui suis-je ?",
                    "options": [
                        "Un scientifique",
                        "Un musicien",
                        "Un marchand"
                    ],
                    "answer": 0,
                    "hint": "Je porte parfois une blouse et des lunettes.",
                    "success": "Exact, le scientifique observe des reactions !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis une machine qui additionne rapidement. Qui suis-je ?",
                    "options": [
                        "Un ordinateur",
                        "Une imprimante",
                        "Un casque audio"
                    ],
                    "answer": 0,
                    "hint": "Je peux aussi jouer de la musique.",
                    "success": "Oui, l'ordinateur calcule a toute vitesse !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                }
            ]
        },
        {
            "level": 12,
            "theme": "Aventures spatiales",
            "completionMessage": "Tu as voyage jusqu'aux etoiles !",
            "questions": [
                {
                    "prompt": "Je suis un satellite naturel qui brille la nuit. Qui suis-je ?",
                    "options": [
                        "La lune",
                        "Mars",
                        "Venus"
                    ],
                    "answer": 0,
                    "hint": "Je change de forme chaque semaine.",
                    "success": "Bravo, la lune veille sur la Terre !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis une etoile qui chauffe toutes les planetes. Qui suis-je ?",
                    "options": [
                        "Le soleil",
                        "Jupiter",
                        "Saturne"
                    ],
                    "answer": 0,
                    "hint": "Je suis au centre du systeme solaire.",
                    "success": "Exact, le soleil eclaire l'espace !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis une pluie de roches lumineuses dans le ciel. Qui suis-je ?",
                    "options": [
                        "Une meteorite",
                        "Un nuage",
                        "Une etoile fixe"
                    ],
                    "answer": 0,
                    "hint": "On me voit lors des nuits d'ete.",
                    "success": "Bien joue, la meteorite dessine un trait de feu !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis la planete rouge que les robots explorent. Qui suis-je ?",
                    "options": [
                        "Mars",
                        "Mercure",
                        "Neptune"
                    ],
                    "answer": 0,
                    "hint": "On y cherche des traces d'eau.",
                    "success": "Oui, Mars cache encore des mysteres !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis un vehicule qui decolle dans un grondement. Qui suis-je ?",
                    "options": [
                        "Une fusee",
                        "Un ballon",
                        "Un sous-marin"
                    ],
                    "answer": 0,
                    "hint": "Je libere une grande flamme.",
                    "success": "Super, la fusee met le cap sur l'espace !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis une combinaison que porte l'astronaute. Qui suis-je ?",
                    "options": [
                        "Une combinaison spatiale",
                        "Un gilet",
                        "Un uniforme"
                    ],
                    "answer": 0,
                    "hint": "Je le protege du froid et du vide.",
                    "success": "Bravo, la combinaison permet de respirer dans l'espace !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis un grand telescope qui tourne autour de la Terre. Qui suis-je ?",
                    "options": [
                        "Un satellite",
                        "Un bateau",
                        "Un dirigeable"
                    ],
                    "answer": 0,
                    "hint": "Je prends des photos des galaxies.",
                    "success": "Exact, le satellite observe les etoiles !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
                },
                {
                    "prompt": "Je suis la maison flottante des astronautes. Qui suis-je ?",
                    "options": [
                        "La station spatiale",
                        "Une cabine",
                        "Un rover"
                    ],
                    "answer": 0,
                    "hint": "Je tourne autour de la Terre en 90 minutes.",
                    "success": "Oui, la station spatiale accueille les explorateurs !",
                    "reward": {
                        "stars": 8,
                        "coins": 6
                    }
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
