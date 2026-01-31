const tr = (fr, en, es, nl) => ({ fr, en, es, nl });
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
            instruction: tr(
                'Classe chaque objet dans le panier de la bonne couleur.',
                'Sort each object into the basket with the right color.',
                'Clasifica cada objeto en la cesta del color correcto.',
                'Sorteer elk voorwerp in het mandje met de juiste kleur.'
            ),
            categories: [
                { id: 'red', label: tr('Rouge 🔴', 'Red 🔴', 'Rojo 🔴', 'Rood 🔴') },
                { id: 'blue', label: tr('Bleu 🔵', 'Blue 🔵', 'Azul 🔵', 'Blauw 🔵') }
            ],
            items: [
                { id: 'apple', emoji: '🍎', label: tr('Pomme', 'Apple', 'Manzana', 'Appel'), target: 'red' },
                { id: 'ball', emoji: '🔵', label: tr('Balle', 'Ball', 'Pelota', 'Bal'), target: 'blue' },
                { id: 'car', emoji: '🚗', label: tr('Voiture', 'Car', 'Coche', 'Auto'), target: 'red' }
            ]
        },
        {
            level: 2,
            type: 'color',
            instruction: tr(
                'Rouge, bleu ou vert ? Trie les objets !',
                'Red, blue or green? Sort the objects!',
                '¿Rojo, azul o verde? ¡Clasifica los objetos!',
                'Rood, blauw of groen? Sorteer de voorwerpen!'
            ),
            categories: [
                { id: 'red', label: tr('Rouge 🔴', 'Red 🔴', 'Rojo 🔴', 'Rood 🔴') },
                { id: 'blue', label: tr('Bleu 🔵', 'Blue 🔵', 'Azul 🔵', 'Blauw 🔵') },
                { id: 'green', label: tr('Vert 🟢', 'Green 🟢', 'Verde 🟢', 'Groen 🟢') }
            ],
            items: [
                { id: 'leaf', emoji: '🍃', label: tr('Feuille', 'Leaf', 'Hoja', 'Blad'), target: 'green' },
                { id: 'strawberry', emoji: '🍓', label: tr('Fraise', 'Strawberry', 'Fresa', 'Aardbei'), target: 'red' },
                { id: 'hat', emoji: '🧢', label: tr('Casquette', 'Cap', 'Gorra', 'Pet'), target: 'blue' },
                { id: 'frog', emoji: '🐸', label: tr('Grenouille', 'Frog', 'Rana', 'Kikker'), target: 'green' }
            ]
        },
        {
            level: 3,
            type: 'color',
            instruction: tr(
                'Observe bien les couleurs pour tout classer.',
                'Look carefully at the colors to sort everything.',
                'Observa bien los colores para clasificar todo.',
                'Kijk goed naar de kleuren om alles te sorteren.'
            ),
            categories: [
                { id: 'red', label: tr('Rouge 🔴', 'Red 🔴', 'Rojo 🔴', 'Rood 🔴') },
                { id: 'blue', label: tr('Bleu 🔵', 'Blue 🔵', 'Azul 🔵', 'Blauw 🔵') },
                { id: 'green', label: tr('Vert 🟢', 'Green 🟢', 'Verde 🟢', 'Groen 🟢') }
            ],
            items: [
                { id: 'flower', emoji: '🌹', label: tr('Fleur', 'Flower', 'Flor', 'Bloem'), target: 'red' },
                { id: 'balloon', emoji: '🎈', label: tr('Ballon', 'Balloon', 'Globo', 'Ballon'), target: 'red' },
                { id: 'whale', emoji: '🐋', label: tr('Baleine', 'Whale', 'Ballena', 'Walvis'), target: 'blue' },
                { id: 'gift', emoji: '🎁', label: tr('Cadeau', 'Gift', 'Regalo', 'Cadeau'), target: 'blue' }
            ]
        },
        {
            level: 4,
            type: 'shape',
            instruction: tr(
                'Carré, rond ou triangle ? Classe selon la forme.',
                'Square, circle or triangle? Sort by shape.',
                '¿Cuadrado, círculo o triángulo? Clasifica por forma.',
                'Vierkant, rond of driehoek? Sorteer op vorm.'
            ),
            categories: [
                { id: 'square', label: tr('Carré ⬜', 'Square ⬜', 'Cuadrado ⬜', 'Vierkant ⬜') },
                { id: 'circle', label: tr('Rond ⚫', 'Circle ⚫', 'Círculo ⚫', 'Rond ⚫') },
                { id: 'triangle', label: tr('Triangle 🔺', 'Triangle 🔺', 'Triángulo 🔺', 'Driehoek 🔺') }
            ],
            items: [
                { id: 'frame', emoji: '🖼️', label: tr('Cadre', 'Frame', 'Marco', 'Lijst'), target: 'square' },
                { id: 'clock', emoji: '🕒', label: tr('Horloge', 'Clock', 'Reloj', 'Klok'), target: 'circle' },
                { id: 'slice', emoji: '🍕', label: tr('Pizza', 'Pizza', 'Pizza', 'Pizza'), target: 'triangle' },
                { id: 'giftbox', emoji: '🎁', label: tr('Cadeau', 'Gift', 'Regalo', 'Cadeau'), target: 'square' }
            ]
        },
        {
            level: 5,
            type: 'shape',
            instruction: tr(
                'Nouveau défi de formes, regarde bien !',
                'New shape challenge, look carefully!',
                'Nuevo reto de formas, ¡mira bien!',
                'Nieuwe vormuitdaging, kijk goed!'
            ),
            categories: [
                { id: 'square', label: tr('Carré ⬜', 'Square ⬜', 'Cuadrado ⬜', 'Vierkant ⬜') },
                { id: 'circle', label: tr('Rond ⚫', 'Circle ⚫', 'Círculo ⚫', 'Rond ⚫') },
                { id: 'triangle', label: tr('Triangle 🔺', 'Triangle 🔺', 'Triángulo 🔺', 'Driehoek 🔺') }
            ],
            items: [
                { id: 'chocolate', emoji: '🍫', label: tr('Chocolat', 'Chocolate', 'Chocolate', 'Chocolade'), target: 'square' },
                { id: 'basketball', emoji: '🏀', label: tr('Ballon', 'Ball', 'Pelota', 'Bal'), target: 'circle' },
                { id: 'cone', emoji: '🍦', label: tr('Glace', 'Ice cream', 'Helado', 'IJs'), target: 'triangle' },
                { id: 'dice', emoji: '🎲', label: tr('Dé', 'Die', 'Dado', 'Dobbelsteen'), target: 'square' }
            ]
        },
        {
            level: 6,
            type: 'shape',
            instruction: tr(
                'Encore plus de formes magiques à classer.',
                'Even more magical shapes to sort.',
                'Aún más formas mágicas para clasificar.',
                'Nog meer magische vormen om te sorteren.'
            ),
            categories: [
                { id: 'square', label: tr('Carré ⬜', 'Square ⬜', 'Cuadrado ⬜', 'Vierkant ⬜') },
                { id: 'circle', label: tr('Rond ⚫', 'Circle ⚫', 'Círculo ⚫', 'Rond ⚫') },
                { id: 'triangle', label: tr('Triangle 🔺', 'Triangle 🔺', 'Triángulo 🔺', 'Driehoek 🔺') }
            ],
            items: [
                { id: 'giftbag', emoji: '🛍️', label: tr('Sac', 'Bag', 'Bolsa', 'Tas'), target: 'square' },
                { id: 'cookie', emoji: '🍪', label: tr('Cookie', 'Cookie', 'Galleta', 'Koekje'), target: 'circle' },
                { id: 'cheese', emoji: '🧀', label: tr('Fromage', 'Cheese', 'Queso', 'Kaas'), target: 'triangle' },
                { id: 'present', emoji: '🎁', label: tr('Surprise', 'Surprise', 'Sorpresa', 'Verrassing'), target: 'square' }
            ]
        },
        {
            level: 7,
            type: 'size',
            instruction: tr(
                'Classe les objets selon leur taille.',
                'Sort the objects by their size.',
                'Clasifica los objetos por su tamaño.',
                'Sorteer de voorwerpen op grootte.'
            ),
            categories: [
                { id: 'big', label: tr('Grand 🐘', 'Big 🐘', 'Grande 🐘', 'Groot 🐘') },
                { id: 'small', label: tr('Petit 🐭', 'Small 🐭', 'Pequeño 🐭', 'Klein 🐭') }
            ],
            items: [
                { id: 'elephant', emoji: '🐘', label: tr('Éléphant', 'Elephant', 'Elefante', 'Olifant'), target: 'big' },
                { id: 'mouse', emoji: '🐭', label: tr('Souris', 'Mouse', 'Ratón', 'Muis'), target: 'small' },
                { id: 'mountain', emoji: '⛰️', label: tr('Montagne', 'Mountain', 'Montaña', 'Berg'), target: 'big' },
                { id: 'ladybug', emoji: '🐞', label: tr('Coccinelle', 'Ladybug', 'Mariquita', 'Lieveheersbeestje'), target: 'small' }
            ]
        },
        {
            level: 8,
            type: 'size',
            instruction: tr(
                'Grand ou petit ? Fais-les sauter dans le bon panier.',
                'Big or small? Drop them into the right basket.',
                '¿Grande o pequeño? Lánzalos a la cesta correcta.',
                'Groot of klein? Gooi ze in het juiste mandje.'
            ),
            categories: [
                { id: 'big', label: tr('Grand 🦒', 'Big 🦒', 'Grande 🦒', 'Groot 🦒') },
                { id: 'small', label: tr('Petit 🐥', 'Small 🐥', 'Pequeño 🐥', 'Klein 🐥') }
            ],
            items: [
                { id: 'giraffe', emoji: '🦒', label: tr('Girafe', 'Giraffe', 'Jirafa', 'Giraffe'), target: 'big' },
                { id: 'chick', emoji: '🐥', label: tr('Poussin', 'Chick', 'Pollito', 'Kuiken'), target: 'small' },
                { id: 'bus', emoji: '🚌', label: tr('Bus', 'Bus', 'Autobús', 'Bus'), target: 'big' },
                { id: 'pencil', emoji: '✏️', label: tr('Crayon', 'Pencil', 'Lápiz', 'Potlood'), target: 'small' }
            ]
        },
        {
            level: 9,
            type: 'mixed',
            instruction: tr(
                'Associe la bonne couleur et la bonne forme.',
                'Match the right color and the right shape.',
                'Asocia el color y la forma correctos.',
                'Combineer de juiste kleur en vorm.'
            ),
            categories: [
                { id: 'red-circle', label: tr('Rond Rouge 🔴', 'Red Circle 🔴', 'Círculo rojo 🔴', 'Rode cirkel 🔴') },
                { id: 'blue-square', label: tr('Carré Bleu 🟦', 'Blue Square 🟦', 'Cuadrado azul 🟦', 'Blauw vierkant 🟦') },
                { id: 'green-triangle', label: tr('Triangle Vert 🟢🔺', 'Green Triangle 🟢🔺', 'Triángulo verde 🟢🔺', 'Groene driehoek 🟢🔺') }
            ],
            items: [
                { id: 'lollipop', emoji: '🍭', label: tr('Sucette', 'Lollipop', 'Chupetín', 'Lolly'), target: 'red-circle' },
                { id: 'giftblue', emoji: '🎁', label: tr('Paquet', 'Gift', 'Paquete', 'Pakket'), target: 'blue-square' },
                { id: 'treeTriangle', emoji: '🎄', label: tr('Sapin', 'Tree', 'Árbol', 'Boom'), target: 'green-triangle' },
                { id: 'shield', emoji: '🛡️', label: tr('Bouclier', 'Shield', 'Escudo', 'Schild'), target: 'blue-square' }
            ]
        },
        {
            level: 10,
            type: 'mixed',
            instruction: tr(
                'Dernier défi ! Combine couleur et forme correctement.',
                'Final challenge! Match color and shape correctly.',
                '¡Último reto! Combina color y forma correctamente.',
                'Laatste uitdaging! Combineer kleur en vorm goed.'
            ),
            categories: [
                { id: 'yellow-circle', label: tr('Rond Jaune 🟡', 'Yellow Circle 🟡', 'Círculo amarillo 🟡', 'Gele cirkel 🟡') },
                { id: 'purple-square', label: tr('Carré Violet 🟪', 'Purple Square 🟪', 'Cuadrado morado 🟪', 'Paarse vierkant 🟪') },
                { id: 'orange-triangle', label: tr('Triangle Orange 🟠', 'Orange Triangle 🟠', 'Triángulo naranja 🟠', 'Oranje driehoek 🟠') }
            ],
            items: [
                { id: 'sun', emoji: '☀️', label: tr('Soleil', 'Sun', 'Sol', 'Zon'), target: 'yellow-circle' },
                { id: 'cheeseTriangle', emoji: '🧀', label: tr('Fromage', 'Cheese', 'Queso', 'Kaas'), target: 'orange-triangle' },
                { id: 'magicBox', emoji: '🎁', label: tr('Boîte magique', 'Magic box', 'Caja mágica', 'Magische doos'), target: 'purple-square' },
                { id: 'flowerYellow', emoji: '🌼', label: tr('Fleur', 'Flower', 'Flor', 'Bloem'), target: 'yellow-circle' }
            ]
        },
        {
            level: 11,
            type: 'category',
            instruction: tr(
                'Trie les animaux : ceux de la ferme et ceux de la savane.',
                'Sort the animals: farm or savanna.',
                'Clasifica los animales: granja o sabana.',
                'Sorteer de dieren: boerderij of savanne.'
            ),
            categories: [
                { id: 'farm', label: tr('Ferme 🐔', 'Farm 🐔', 'Granja 🐔', 'Boerderij 🐔') },
                { id: 'savanna', label: tr('Savane 🦁', 'Savanna 🦁', 'Sabana 🦁', 'Savanne 🦁') }
            ],
            items: [
                { id: 'cow', emoji: '🐮', label: tr('Vache', 'Cow', 'Vaca', 'Koe'), target: 'farm' },
                { id: 'lion', emoji: '🦁', label: tr('Lion', 'Lion', 'León', 'Leeuw'), target: 'savanna' },
                { id: 'pig', emoji: '🐷', label: tr('Cochon', 'Pig', 'Cerdo', 'Varken'), target: 'farm' },
                { id: 'zebra', emoji: '🦓', label: tr('Zèbre', 'Zebra', 'Cebra', 'Zebra'), target: 'savanna' },
                { id: 'chicken', emoji: '🐔', label: tr('Poule', 'Hen', 'Gallina', 'Kip'), target: 'farm' }
            ]
        },
        {
            level: 12,
            type: 'category',
            instruction: tr(
                'Classe les aliments : fruits ou légumes ?',
                'Sort the foods: fruits or vegetables?',
                'Clasifica los alimentos: ¿frutas o verduras?',
                'Sorteer het eten: fruit of groenten?'
            ),
            categories: [
                { id: 'fruit', label: tr('Fruits 🍓', 'Fruits 🍓', 'Frutas 🍓', 'Fruit 🍓') },
                { id: 'vegetable', label: tr('Légumes 🥕', 'Vegetables 🥕', 'Verduras 🥕', 'Groenten 🥕') }
            ],
            items: [
                { id: 'banana', emoji: '🍌', label: tr('Banane', 'Banana', 'Banana', 'Banaan'), target: 'fruit' },
                { id: 'carrot', emoji: '🥕', label: tr('Carotte', 'Carrot', 'Zanahoria', 'Wortel'), target: 'vegetable' },
                { id: 'grapes', emoji: '🍇', label: tr('Raisin', 'Grapes', 'Uvas', 'Druiven'), target: 'fruit' },
                { id: 'broccoli', emoji: '🥦', label: tr('Brocoli', 'Broccoli', 'Brócoli', 'Broccoli'), target: 'vegetable' },
                { id: 'orange', emoji: '🍊', label: tr('Orange', 'Orange', 'Naranja', 'Sinaasappel'), target: 'fruit' }
            ]
        },
        {
            level: 13,
            type: 'transport',
            instruction: tr(
                'Trie les moyens de transport.',
                'Sort the means of transport.',
                'Clasifica los medios de transporte.',
                'Sorteer de vervoermiddelen.'
            ),
            categories: [
                { id: 'land', label: tr('Sur Terre 🚗', 'On land 🚗', 'En tierra 🚗', 'Op land 🚗') },
                { id: 'air', label: tr('Dans les Airs ✈️', 'In the air ✈️', 'En el aire ✈️', 'In de lucht ✈️') },
                { id: 'water', label: tr('Sur l\'Eau ⛵', 'On water ⛵', 'En el agua ⛵', 'Op het water ⛵') }
            ],
            items: [
                { id: 'car', emoji: '🚗', label: tr('Voiture', 'Car', 'Coche', 'Auto'), target: 'land' },
                { id: 'airplane', emoji: '✈️', label: tr('Avion', 'Airplane', 'Avión', 'Vliegtuig'), target: 'air' },
                { id: 'boat', emoji: '⛵', label: tr('Bateau', 'Boat', 'Barco', 'Boot'), target: 'water' },
                { id: 'bicycle', emoji: '🚲', label: tr('Vélo', 'Bicycle', 'Bicicleta', 'Fiets'), target: 'land' },
                { id: 'helicopter', emoji: '🚁', label: tr('Hélicoptère', 'Helicopter', 'Helicóptero', 'Helikopter'), target: 'air' }
            ]
        },
        {
            level: 14,
            type: 'category',
            instruction: tr(
                'Range les objets : jouets ou fournitures scolaires ?',
                'Sort the objects: toys or school supplies?',
                'Ordena los objetos: ¿juguetes o material escolar?',
                'Sorteer de spullen: speelgoed of schoolspullen?'
            ),
            categories: [
                { id: 'toy', label: tr('Jouets 🧸', 'Toys 🧸', 'Juguetes 🧸', 'Speelgoed 🧸') },
                { id: 'school', label: tr('École ✏️', 'School ✏️', 'Escuela ✏️', 'School ✏️') }
            ],
            items: [
                { id: 'teddy', emoji: '🧸', label: tr('Nounours', 'Teddy bear', 'Osito', 'Knuffelbeer'), target: 'toy' },
                { id: 'pencil', emoji: '✏️', label: tr('Crayon', 'Pencil', 'Lápiz', 'Potlood'), target: 'school' },
                { id: 'ball', emoji: '⚽', label: tr('Ballon', 'Ball', 'Pelota', 'Bal'), target: 'toy' },
                { id: 'book', emoji: '📖', label: tr('Livre', 'Book', 'Libro', 'Boek'), target: 'school' },
                { id: 'doll', emoji: '🎎', label: tr('Poupée', 'Doll', 'Muñeca', 'Pop'), target: 'toy' }
            ]
        },
        {
            level: 15,
            type: 'weather',
            instruction: tr(
                'Quel temps fait-il ?',
                'What is the weather like?',
                '¿Qué tiempo hace?',
                'Wat voor weer is het?'
            ),
            categories: [
                { id: 'sunny', label: tr('Soleil ☀️', 'Sunny ☀️', 'Soleado ☀️', 'Zonnig ☀️') },
                { id: 'rainy', label: tr('Pluie 🌧️', 'Rainy 🌧️', 'Lluvioso 🌧️', 'Regenachtig 🌧️') }
            ],
            items: [
                { id: 'sun', emoji: '☀️', label: tr('Soleil', 'Sun', 'Sol', 'Zon'), target: 'sunny' },
                { id: 'umbrella', emoji: '☔', label: tr('Parapluie', 'Umbrella', 'Paraguas', 'Paraplu'), target: 'rainy' },
                { id: 'sunglasses', emoji: '😎', label: tr('Lunettes', 'Sunglasses', 'Gafas', 'Zonnebril'), target: 'sunny' },
                { id: 'cloud', emoji: '🌧️', label: tr('Nuage', 'Cloud', 'Nube', 'Wolk'), target: 'rainy' }
            ]
        }
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
        {
            level: 1,
            masked: 'ch_t',
            answer: 'a',
            options: ['a', 'e', 'i'],
            hint: tr('Un animal qui ronronne.', 'An animal that purrs.', 'Un animal que ronronea.', 'Een dier dat spint.')
        }
    ],
    sequenceLevels: [
        { level: 1, sequence: ['1', '2', '3', '?'], options: ['4', '5', '6'], answer: '4', type: 'number' }
    ], options: ['4', '5', '6'], answer: '4', type: 'number' }
    ]
    ,
        COLOR_MIX_LIBRARY: [
        {
            id: 'mix-blue-yellow',
            inputs: [tr('🔵 Bleu', '🔵 Blue', '🔵 Azul', '🔵 Blauw'), tr('🟡 Jaune', '🟡 Yellow', '🟡 Amarillo', '🟡 Geel')],
            result: tr('🟢 Vert', '🟢 Green', '🟢 Verde', '🟢 Groen'),
            explanation: tr('Le bleu et le jaune deviennent un joli vert.', 'Blue and yellow become a nice green.', 'El azul y el amarillo se vuelven un bonito verde.', 'Blauw en geel worden samen een mooie groen.'),
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-red-yellow',
            inputs: [tr('🔴 Rouge', '🔴 Red', '🔴 Rojo', '🔴 Rood'), tr('🟡 Jaune', '🟡 Yellow', '🟡 Amarillo', '🟡 Geel')],
            result: tr('🟠 Orange', '🟠 Orange', '🟠 Naranja', '🟠 Oranje'),
            explanation: tr('Le rouge et le jaune donnent de l orange.', 'Red and yellow make orange.', 'El rojo y el amarillo hacen naranja.', 'Rood en geel maken oranje.'),
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-red-blue',
            inputs: [tr('🔴 Rouge', '🔴 Red', '🔴 Rojo', '🔴 Rood'), tr('🔵 Bleu', '🔵 Blue', '🔵 Azul', '🔵 Blauw')],
            result: tr('🟣 Violet', '🟣 Purple', '🟣 Morado', '🟣 Paars'),
            explanation: tr('Le rouge et le bleu donnent du violet.', 'Red and blue make purple.', 'El rojo y el azul hacen morado.', 'Rood en blauw maken paars.'),
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-blue-white',
            inputs: [tr('🔵 Bleu', '🔵 Blue', '🔵 Azul', '🔵 Blauw'), tr('⚪ Blanc', '⚪ White', '⚪ Blanco', '⚪ Wit')],
            result: tr('🩵 Bleu clair', '🩵 Light blue', '🩵 Azul claro', '🩵 Lichtblauw'),
            explanation: tr('Le bleu avec du blanc devient plus clair.', 'Blue mixed with white becomes lighter.', 'El azul con blanco se vuelve más claro.', 'Blauw met wit wordt lichter.'),
            minLevel: 3,
            maxLevel: 12
        },
        {
            id: 'mix-red-white',
            inputs: [tr('🔴 Rouge', '🔴 Red', '🔴 Rojo', '🔴 Rood'), tr('⚪ Blanc', '⚪ White', '⚪ Blanco', '⚪ Wit')],
            result: tr('💗 Rose', '💗 Pink', '💗 Rosa', '💗 Roze'),
            explanation: tr('Le rouge avec du blanc devient rose.', 'Red mixed with white becomes pink.', 'El rojo con blanco se vuelve rosa.', 'Rood met wit wordt roze.'),
            minLevel: 3,
            maxLevel: 12
        },
        {
            id: 'mix-yellow-white',
            inputs: [tr('🟡 Jaune', '🟡 Yellow', '🟡 Amarillo', '🟡 Geel'), tr('⚪ Blanc', '⚪ White', '⚪ Blanco', '⚪ Wit')],
            result: tr('🌼 Jaune clair', '🌼 Light yellow', '🌼 Amarillo claro', '🌼 Lichtgeel'),
            explanation: tr('Le jaune avec du blanc devient jaune clair.', 'Yellow mixed with white becomes light yellow.', 'El amarillo con blanco se vuelve amarillo claro.', 'Geel met wit wordt lichtgeel.'),
            minLevel: 3,
            maxLevel: 12
        },
        {
            id: 'mix-green-white',
            inputs: [tr('🟢 Vert', '🟢 Green', '🟢 Verde', '🟢 Groen'), tr('⚪ Blanc', '⚪ White', '⚪ Blanco', '⚪ Wit')],
            result: tr('🍃 Vert clair', '🍃 Light green', '🍃 Verde claro', '🍃 Lichtgroen'),
            explanation: tr('Le vert avec du blanc devient vert clair.', 'Green mixed with white becomes light green.', 'El verde con blanco se vuelve verde claro.', 'Groen met wit wordt lichtgroen.'),
            minLevel: 4,
            maxLevel: 12
        }
    ]
            result: 'ðŸŸ¢ Vert',
            explanation: 'Le bleu et le jaune deviennent un joli vert.',
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-red-yellow',
            inputs: ['ðŸ”´ Rouge', 'ðŸŸ¡ Jaune'],
            result: 'ðŸŸ  Orange',
            explanation: 'Jaune et rouge crÃ©ent un orange lumineux.',
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-blue-red',
            inputs: ['ðŸ”µ Bleu', 'ðŸ”´ Rouge'],
            result: 'ðŸŸ£ Violet',
            explanation: 'MÃ©langer du bleu et du rouge donne du violet.',
            minLevel: 1,
            maxLevel: 12
        },
        {
            id: 'mix-red-white',
            inputs: ['ðŸ”´ Rouge', 'âšª Blanc'],
            result: 'ðŸ’— Rose',
            explanation: 'Un peu de blanc adoucit le rouge en rose.',
            minLevel: 4,
            maxLevel: 12
        },
        {
            id: 'mix-blue-white',
            inputs: ['ðŸ”µ Bleu', 'âšª Blanc'],
            result: 'ðŸ’§ Bleu Clair',
            explanation: 'Le bleu devient plus lÃ©ger avec du blanc.',
            minLevel: 4,
            maxLevel: 12
        },
        {
            id: 'mix-green-white',
            inputs: ['ðŸŸ¢ Vert', 'âšª Blanc'],
            result: 'ðŸƒ Vert Clair',
            explanation: 'Du blanc rend le vert trÃ¨s doux.',
            minLevel: 5,
            maxLevel: 12
        },
        {
            id: 'mix-red-black',
            inputs: ['ðŸ”´ Rouge', 'âš« Noir'],
            result: 'ðŸ· Bordeaux',
            explanation: 'Noir et rouge foncent la couleur en bordeaux.',
            minLevel: 7,
            maxLevel: 12
        }
    ]
};

// Contes Magiques â€” jeux dâ€™histoires (story sets)
// These were missing, causing the Stories menu to be empty/disabled.
// Provide three small story sets with title, text, optional image and a short quiz.
window.storySetOne = [
  {
    id: 'foret-etoilee',
    title: 'La ForÃªt Ã‰toilÃ©e',
    bilingualTitle: { en: 'The Starry Forest' },
    theme: 'Aventure',
    duration: 2,
    icon: 'ðŸŒŒ',
    image: null,
    text: [
      "LÃ©na marche dans une forÃªt douce et lumineuse.",
      "Des lucioles dessinent des Ã©toiles tout autour dâ€™elle.",
      "Au loin, une chouette lui murmure un secret: â€˜Suis la lumiÃ¨re la plus brillanteâ€™."
    ],
    quiz: [
      {
        question: "Que voit LÃ©na autour dâ€™elle ?",
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
    title: 'Le Pont Arcâ€‘enâ€‘ciel',
    bilingualTitle: { en: 'The Rainbow Bridge' },
    theme: 'Magie',
    duration: 1,
    icon: 'ðŸŒˆ',
    image: null,
    text: [
      "Un petit pont colorÃ© apparaÃ®t au-dessus de la riviÃ¨re.",
      "Chaque pas de LÃ©na Ã©claire une nouvelle couleur.",
      "Tout au bout, une cloche sonne doucement: dingâ€¦ dingâ€¦"
    ],
    quiz: [
      {
        question: "Quâ€™estâ€‘ce qui apparaÃ®t au-dessus de la riviÃ¨re ?",
        options: ["Un pont arcâ€‘enâ€‘ciel", "Un chÃ¢teau", "Un nuage"],
        answer: 0
      }
    ]
  },
  {
    id: 'grenier-secret',
    title: 'Le Secret du Grenier',
    bilingualTitle: { en: 'The Attic\'s Secret' },
    theme: 'MystÃ¨re',
    duration: 3,
    icon: 'ðŸ“¦',
    image: null,
    text: [
      "Un jour de pluie, LÃ©na et son chat Yaya montent au grenier.",
      "Yaya, en explorant, fait tomber une vieille boÃ®te. Dedans, une carte mystÃ©rieuse !",
      "La carte montre une croix dessinÃ©e derriÃ¨re une armoire. \"Allons voir, Yaya !\", dit LÃ©na.",
      "DerriÃ¨re l'armoire, ils trouvent un petit coffre rempli de jouets anciens. Le plus beau des trÃ©sors !"
    ],
    quiz: [
      {
        question: "OÃ¹ LÃ©na et Yaya trouvent-ils la carte ?",
        options: ["Dans le jardin", "Dans le grenier", "Dans la cuisine"],
        answer: 1
      },
      {
        question: "Que dÃ©couvrent-ils grÃ¢ce Ã  la carte ?",
        options: ["Un coffre au trÃ©sor", "Un passage secret", "Un gÃ¢teau au chocolat"],
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
    icon: 'ðŸŒ¸',
    image: null,
    text: [
      "Dans le jardin de LÃ©na, les fleurs ne font pas que sentir bon, elles murmurent des secrets.",
      "Une rose lui chuchote : \"Le plus grand trÃ©sor est l'amitiÃ©.\"",
      "Un tournesol ajoute : \"Et le soleil est son plus grand sourire.\"",
      "LÃ©na sourit, heureuse de connaÃ®tre le langage des fleurs."
    ],
    quiz: [
      {
        question: "Que font les fleurs dans le jardin de LÃ©na ?",
        options: ["Elles chantent", "Elles murmurent des secrets", "Elles dansent"],
        answer: 1
      }
    ]
  },
  {
    id: 'peintre-renard',
    title: 'Le Renard Peintre',
    bilingualTitle: { en: 'The Painting Fox' },
    theme: 'CrÃ©ativitÃ©',
    duration: 1,
    icon: 'ðŸ¦Š',
    image: null,
    text: [
      "Un petit renard trouve des pots de peinture abandonnÃ©s dans la forÃªt.",
      "Avec sa queue, il dessine un arc-en-ciel sur une grande pierre.",
      "Tous les animaux viennent admirer son Å“uvre d'art colorÃ©e."
    ]
  },
  {
    id: 'nuage-sculpteur',
    title: 'Le Nuage Sculpteur',
    bilingualTitle: { en: 'The Cloud Sculptor' },
    theme: 'CrÃ©ativitÃ©',
    duration: 2,
    icon: 'â˜ï¸',
    text: [
      "Dans le ciel, un petit nuage s'ennuie.",
      "Il dÃ©cide de se transformer en mouton, puis en dragon, puis en bateau.",
      "LÃ©na, depuis son jardin, applaudit Ã  chaque nouvelle sculpture."
    ],
    quiz: [{
      question: "En quoi le nuage ne se transforme-t-il PAS ?",
      options: ["Mouton", "Maison", "Dragon"],
      answer: 1
    }]
  },
  {
    id: 'cle-chansons',
    title: 'La ClÃ© des Chansons',
    bilingualTitle: { en: 'The Key of Songs' },
    theme: 'Magie',
    duration: 2,
    icon: 'ðŸ”‘',
    text: [
      "LÃ©na trouve une clÃ© en or qui ne semble ouvrir aucune porte.",
      "En la posant sur une fleur, la fleur se met Ã  chanter une douce mÃ©lodie.",
      "La clÃ© magique peut faire chanter n'importe quel objet !"
    ]
  },
  {
    id: 'gnome-grincheux',
    title: 'Le Grincheux du Potager',
    bilingualTitle: { en: 'The Grumpy Gardener' },
    theme: 'Humour',
    duration: 2,
    icon: 'ðŸ˜ ',
    text: [
      "Gnorman le gnome avait un potager. Mais Gnorman Ã©tait toujours grincheux.",
      "Ses carottes poussaient avec des visages fÃ¢chÃ©s. Ses tomates boudaient sur la vigne.",
      "Un jour, une coccinelle lui raconta une blague. Gnorman Ã©clata de rire !",
      "Soudain, tous ses lÃ©gumes se mirent Ã  sourire. Un potager heureux, c'est bien meilleur !"
    ],
    quiz: [{
      question: "Pourquoi les lÃ©gumes de Gnorman Ã©taient-ils fÃ¢chÃ©s ?",
      options: ["Parce qu'il ne pleuvait pas", "Parce que Gnorman Ã©tait grincheux", "Parce qu'ils n'aimaient pas le soleil"],
      answer: 1
    }]
  },
  {
    id: 'chaussette-voleuse',
    title: 'La Chaussette Voleuse',
    bilingualTitle: { en: 'The Sock Thief' },
    theme: 'Humour',
    duration: 2,
    icon: 'ðŸ§¦',
    text: [
      "Dans la machine Ã  laver de LÃ©na, vivait une chaussette magique nommÃ©e Socquette.",
      "Socquette n'aimait pas Ãªtre seule. Son jeu prÃ©fÃ©rÃ© ? Manger les autres chaussettes pour leur faire des cÃ¢lins.",
      "C'est pour Ã§a qu'il manque toujours une chaussette aprÃ¨s la lessive !",
      "Mais ne t'inquiÃ¨te pas, elle les relÃ¢che quand elles ont eu assez de cÃ¢lins."
    ],
    quiz: [{
      question: "Quel est le jeu prÃ©fÃ©rÃ© de Socquette ?",
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
    icon: 'ðŸ²',
    text: [
      "Ignis Ã©tait un grand dragon rouge qui gardait un trÃ©sor immense.",
      "Il n'avait peur de rien... sauf des souris !",
      "Un jour, une petite souris nommÃ©e Pipa entra dans sa grotte. Ignis sauta sur une pile d'or en criant.",
      "Pipa, voyant le dragon terrifiÃ©, lui promit de ne plus entrer s'il partageait une piÃ¨ce d'or. Ignis accepta aussitÃ´t !"
    ],
    quiz: [{
      question: "De quoi le dragon Ignis a-t-il peur ?",
      options: ["Des chevaliers", "Des souris", "Du noir"],
      answer: 1
    }]
  },
  {
    id: 'mystere-fil-scintillant',
    title: 'Le MystÃ¨re du Fil Scintillant',
    bilingualTitle: { en: 'The Mystery of the Glimmering Thread' },
    theme: 'MystÃ¨re',
    duration: 5,
    icon: 'ðŸ§µ',
    text: [
      "Un matin, Yaya le chat dÃ©couvrit un fil scintillant dans le jardin. Il brillait de mille feux sous le soleil.",
      "IntriguÃ©, il donna un petit coup de patte. Le fil se dÃ©roula, menant vers la maison. LÃ©na, voyant le manÃ¨ge de Yaya, dÃ©cida de le suivre.",
      "Le fil les guida sous le canapÃ©, derriÃ¨re la bibliothÃ¨que, puis monta Ã  l'Ã©tage. \"OÃ¹ nous mÃ¨nes-tu, petit fil ?\" murmura LÃ©na.",
      "Le fil s'arrÃªtait devant une petite porte oubliÃ©e : celle du grenier. Ensemble, ils montÃ¨rent les marches poussiÃ©reuses.",
      "LÃ , dans un coin sombre, le fil Ã©tait attachÃ© Ã  une vieille boÃ®te Ã  musique. LÃ©na l'ouvrit doucement.",
      "Une douce mÃ©lodie s'Ã©leva, remplissant le grenier de magie. Le fil n'Ã©tait qu'une toile d'araignÃ©e capturant la lumiÃ¨re, mais il les avait menÃ©s Ã  un vÃ©ritable trÃ©sor de souvenirs."
    ],
    quiz: [{
      question: "Qu'est-ce que Yaya a trouvÃ© dans le jardin ?",
      options: ["Un os", "Un fil scintillant", "Une fleur magique"],
      answer: 1
    }, {
      question: "OÃ¹ le fil les a-t-il conduits ?",
      options: ["Ã€ la cuisine", "Au grenier", "Dans la chambre de LÃ©na"],
      answer: 1
    }]
  },
  {
    id: 'course-feuilles-automne',
    title: 'La Course des Feuilles d\'Automne',
    bilingualTitle: { en: 'The Autumn Leaf Race' },
    theme: 'Aventure',
    duration: 6,
    icon: 'ðŸ‚',
    text: [
      "C'Ã©tait un jour d'automne venteux. Les feuilles dansaient dans les airs. \"Et si on faisait une course, Yaya ?\" proposa LÃ©na.",
      "LÃ©na choisit une grande feuille rouge et Yaya une petite feuille jaune. Au signal, ils les lÃ¢chÃ¨rent.",
      "Le vent emporta les feuilles Ã  travers le parc. Elles tourbillonnaient, passaient au-dessus des flaques d'eau et se faufilaient entre les arbres.",
      "La feuille de LÃ©na prit de l'avance, mais celle de Yaya, plus lÃ©gÃ¨re, la rattrapa. Le chat miaulait d'excitation en la poursuivant.",
      "Soudain, la feuille de Yaya se coinÃ§a dans une branche basse. Le chat, dÃ©Ã§u, s'assit en la regardant.",
      "LÃ©na, voyant son ami triste, abandonna sa propre course. Elle grimpa sur le banc, libÃ©ra la feuille jaune et la rendit Ã  Yaya.",
      "\"Peu importe qui gagne,\" dit-elle en caressant son chat. \"L'important, c'est de s'amuser ensemble.\" Ils regardÃ¨rent les deux feuilles s'envoler, cÃ´te Ã  cÃ´te, vers le ciel."
    ],
    quiz: [{
      question: "Quelle couleur Ã©tait la feuille de LÃ©na ?",
      options: ["Jaune", "Rouge", "Verte"],
      answer: 1
    }, {
      question: "Pourquoi la feuille de Yaya s'est-elle arrÃªtÃ©e ?",
      options: ["Elle est tombÃ©e dans l'eau", "Elle s'est coincÃ©e dans une branche", "Le vent s'est arrÃªtÃ©"],
      answer: 1
    }]
  }
];

window.storySetTwo = [
  {
    id: 'train-des-reves',
    title: 'Le Train des RÃªves',
    bilingualTitle: { en: 'The Dream Train' },
    theme: 'Aventure',
    duration: 2,
    icon: 'ðŸš‚',
    image: null,
    text: [
      "Un train tout doux arrive sans bruit.",
      "Ses wagons sont remplis de couvertures moelleuses et de livres.",
      "LÃ©na sâ€™assoit prÃ¨s dâ€™une fenÃªtre et lit en souriant."
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
    icon: 'ðŸ§ª',
    image: null,
    text: [
      "LÃ©na et Yaya le chat dÃ©cident de devenir des magiciens. \"Faisons une potion magique, Yaya !\"",
      "Dans un grand bol, LÃ©na mÃ©lange du jus de pomme, de l'eau pÃ©tillante et un pÃ©tale de rose du jardin.",
      "Yaya observe, le nez froncÃ©. Il trempe une patte et la lÃ¨che. Soudain, il se met Ã  ronronner trÃ¨s fort en riant !",
      "LÃ©na goÃ»te aussi. La potion est dÃ©licieuse et la fait rire aux Ã©clats avec son ami Yaya."
    ],
    quiz: [
      {
        question: "Quels ingrÃ©dients LÃ©na utilise-t-elle ?",
        options: ["Jus de pomme, eau et rose", "Lait et chocolat", "Jus d'orange et carottes"],
        answer: 0
      }
    ]
  },
  {
    id: 'bibliotheque-etoiles',
    title: 'La BibliothÃ¨que sous les Ã‰toiles',
    bilingualTitle: { en: 'The Library Under the Stars' },
    theme: 'Magie',
    duration: 2,
    icon: 'ðŸ“š',
    image: null,
    text: [
      "Une nuit, LÃ©na dÃ©couvre une bibliothÃ¨que en plein air.",
      "Les livres ont des couvertures qui scintillent comme des Ã©toiles.",
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
    icon: 'ðŸ¾',
    image: null,
    text: [
      "Yaya, le chat de LÃ©na, adore explorer.",
      "Un jour, il grimpe sur le toit et dÃ©couvre un nid d'oiseaux abandonnÃ©.",
      "Dedans, il trouve une plume bleue brillante qu'il rapporte fiÃ¨rement Ã  LÃ©na."
    ],
    quiz: [
      {
        question: "Que trouve Yaya sur le toit ?",
        options: ["Une plume bleue", "Un trÃ©sor", "Un autre chat"],
        answer: 0
      }
    ]
  },
  {
    id: 'crayon-voyageur',
    title: 'Le Crayon Voyageur',
    bilingualTitle: { en: 'The Traveling Pencil' },
    theme: 'CrÃ©ativitÃ©',
    duration: 2,
    icon: 'âœï¸',
    text: [
      "LÃ©na a un crayon magique. Tout ce qu'elle dessine prend vie.",
      "Elle dessine une petite porte sur son mur. La porte s'ouvre sur une plage ensoleillÃ©e.",
      "Elle passe la journÃ©e Ã  construire des chÃ¢teaux de sable avant de redessiner la porte pour rentrer."
    ],
    quiz: [{
      question: "OÃ¹ la porte dessinÃ©e mÃ¨ne-t-elle ?",
      options: ["Une forÃªt", "Une plage", "Une montagne"],
      answer: 1
    }]
  },
  {
    id: 'goutte-pluie',
    title: 'La Goutte de Pluie Curieuse',
    bilingualTitle: { en: 'The Curious Raindrop' },
    theme: 'Nature',
    duration: 1,
    icon: 'ðŸ’§',
    text: [
      "Une petite goutte de pluie nommÃ©e Plume glisse d'un nuage.",
      "Elle traverse un arc-en-ciel, se colore de mille feux, puis atterrit sur le pÃ©tale d'une tulipe.",
      "La tulipe la remercie pour sa fraÃ®cheur colorÃ©e."
    ]
  },
  {
    id: 'echo-montagne',
    title: 'L\'Ã‰cho de la Montagne',
    bilingualTitle: { en: 'The Mountain\'s Echo' },
    theme: 'Nature',
    duration: 1,
    icon: 'â›°ï¸',
    text: [
        "LÃ©na crie \"Bonjour !\" face Ã  la montagne.",
        "La montagne lui rÃ©pond \"Bonjour... jour... our...\"",
        "AmusÃ©e, LÃ©na lui raconte une blague, et la montagne rit avec elle."
    ]
  },
  {
    id: 'bibliotheque-murmures',
    title: 'La BibliothÃ¨que des Murmures',
    bilingualTitle: { en: 'The Library of Whispers' },
    theme: 'Magie',
    duration: 2,
    icon: 'ðŸ¤«',
    text: [
        "Au fond du jardin se trouve une bibliothÃ¨que oÃ¹ les livres chuchotent leurs histoires.",
        "Il ne faut pas lire les mots, mais Ã©couter les pages.",
        "LÃ©na s'assoit et Ã©coute un conte sur un dragon timide."
    ],
    quiz: [{
        question: "Comment faut-il 'lire' les livres dans cette bibliothÃ¨que ?",
        options: ["En les secouant", "En Ã©coutant les pages", "En les regardant de loin"],
        answer: 1
    }]
  },
  {
    id: 'fantome-noir',
    title: 'Le FantÃ´me qui avait peur du Noir',
    bilingualTitle: { en: 'The Ghost Who Was Afraid of the Dark' },
    theme: 'Humour',
    duration: 2,
    icon: 'ðŸ‘»',
    text: [
      "Phosfor Ã©tait un fantÃ´me trÃ¨s gentil, mais il avait un secret : il avait peur du noir.",
      "DÃ¨s que la nuit tombait, il allumait toutes les lumiÃ¨res du chÃ¢teau.",
      "Les autres fantÃ´mes trouvaient Ã§a bizarre, mais au moins, personne ne se cognait dans les couloirs !",
      "Finalement, une petite luciole devint son amie et sa veilleuse personnelle."
    ],
    quiz: [{
      question: "Quelle est la plus grande peur de Phosfor ?",
      options: ["Des chats", "Du noir", "Des araignÃ©es"],
      answer: 1
    }]
  },
  {
    id: 'escargot-presse',
    title: 'L\'Escargot Trop PressÃ©',
    bilingualTitle: { en: 'The Snail in a Hurry' },
    theme: 'Humour',
    duration: 2,
    icon: 'ðŸŒ',
    text: [
      "Turbo l'escargot voulait Ãªtre le plus rapide du jardin.",
      "Il essaya de mettre des roulettes Ã  sa coquille, mais il dÃ©rapa sur une tomate.",
      "Il tenta de glisser sur une feuille de salade, mais il finit dans l'assiette du pique-nique.",
      "Finalement, il comprit que la lenteur avait du bon : il Ã©tait le seul Ã  voir les jolies fleurs en chemin."
    ],
    quiz: [{
      question: "Qu'est-ce que Turbo a essayÃ© de mettre sur sa coquille ?",
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
    theme: 'CrÃ©ativitÃ©',
    duration: 7,
    icon: 'ðŸ°',
    text: [
      "Un aprÃ¨s-midi pluvieux, LÃ©na dÃ©cida de construire le plus grand royaume jamais vu. Son matÃ©riau de construction ? Des coussins !",
      "Avec Yaya comme fidÃ¨le architecte, ils empilÃ¨rent les coussins du canapÃ© pour former de hautes murailles. Une couverture devint le toit du grand donjon.",
      "\"Yaya, tu seras le gardien du trÃ©sor !\" dÃ©clara LÃ©na. Le trÃ©sor Ã©tait une petite balle rebondissante que Yaya adorait.",
      "Le chat se posta fiÃ¨rement Ã  l'entrÃ©e du fort, observant les alentours. Mais un ennemi redoutable approchait : l'aspirateur, pilotÃ© par Papa.",
      "\"Oh non, le monstre grondant !\" cria LÃ©na en riant. Yaya se hÃ©rissa, prÃªt Ã  dÃ©fendre son royaume.",
      "Papa, jouant le jeu, fit semblant d'Ãªtre effrayÃ© par le courageux gardien. Il Ã©teignit l'aspirateur et s'inclina. \"Pardon, noble sire Yaya. Je ne savais pas que ce chÃ¢teau Ã©tait vÃ´tre.\"",
      "LÃ©na et Yaya avaient sauvÃ© leur royaume. Ils passÃ¨rent le reste de l'aprÃ¨s-midi Ã  rÃ©gner sur leur forteresse de douceur, en dÃ©gustant un goÃ»ter royal."
    ],
    quiz: [{
      question: "Quel Ã©tait le trÃ©sor gardÃ© par Yaya ?",
      options: ["Une couronne", "Une balle rebondissante", "Un poisson en plastique"],
      answer: 1
    }, {
      question: "Quel Ã©tait l'ennemi du royaume des coussins ?",
      options: ["Un dragon", "L'aspirateur", "Un orage"],
      answer: 1
    }]
  },
  {
    id: 'detectives-ombre-perdue',
    title: 'Les DÃ©tectives de l\'Ombre Perdue',
    bilingualTitle: { en: 'The Detectives of the Lost Shadow' },
    theme: 'MystÃ¨re',
    duration: 6,
    icon: 'ðŸ•µï¸â€â™€ï¸',
    text: [
      "Un jour, en jouant dans le jardin, LÃ©na remarqua quelque chose d'Ã©trange. Son ombre avait disparu !",
      "\"Yaya, nous avons une nouvelle mission ! Nous sommes les dÃ©tectives de l'ombre perdue !\" Yaya, Ã©quipÃ© d'une fausse loupe (un anneau de rideau), semblait prÃªt.",
      "Le premier indice : le soleil Ã©tait cachÃ© derriÃ¨re un gros nuage. \"Aha ! L'ombre n'aime pas quand le soleil se cache,\" nota LÃ©na dans son carnet imaginaire.",
      "Ils cherchÃ¨rent partout. Sous le toboggan ? Non. DerriÃ¨re le grand chÃªne ? Toujours pas. Yaya reniflait le sol, cherchant une piste.",
      "LÃ©na eut une idÃ©e. Elle prit une lampe de poche. \"Si le soleil ne veut pas nous aider, crÃ©ons notre propre lumiÃ¨re !\"",
      "Elle alluma la lampe et la pointa vers le sol. AussitÃ´t, une petite ombre apparut Ã  ses pieds, puis grandit. \"On l'a retrouvÃ©e !\" s'exclama-t-elle.",
      "Yaya, fascinÃ©, se mit Ã  pourchasser l'ombre de la lampe, la faisant danser partout. Le mystÃ¨re Ã©tait rÃ©solu, et un nouveau jeu venait de commencer."
    ],
    quiz: [{
      question: "Pourquoi l'ombre de LÃ©na avait-elle disparu au dÃ©but ?",
      options: ["Elle Ã©tait partie en vacances", "Le soleil Ã©tait cachÃ© par un nuage", "Elle jouait Ã  cache-cache"],
      answer: 1
    }, {
      question: "Comment LÃ©na a-t-elle fait rÃ©apparaÃ®tre son ombre ?",
      options: ["En attendant le soleil", "En utilisant une lampe de poche", "En demandant Ã  Yaya"],
      answer: 1
    }]
  }
];

window.storySetThree = [
  {
    id: 'etoile-qui-chante',
    title: 'Lâ€™Ã‰toile qui Chante',
    bilingualTitle: { en: 'The Singing Star' },
    theme: 'Magie',
    duration: 2,
    icon: 'ðŸŽ¶',
    image: null,
    text: [
      "Dans le ciel, une petite Ã©toile fredonne une chanson.",
      "La mÃ©lodie guide LÃ©na jusquâ€™Ã  un jardin de nuit.",
      "Les fleurs sâ€™ouvrent en rythme et brillent doucement."
    ],
    quiz: [
      {
        question: "Qui fredonne une chanson ?",
        options: ["Une fleur", "Une Ã©toile", "Une goutte de pluie"],
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
    icon: 'â˜ï¸',
    image: null,
    text: [
      "LÃ©na et Yaya font la sieste sur l'herbe douce du jardin.",
      "Ils rÃªvent qu'un nuage cotonneux descend du ciel pour les emporter.",
      "Ensemble, ils flottent au-dessus des maisons, saluant les oiseaux et les Ã©toiles.",
      "Le nuage les redÃ©pose doucement dans le jardin juste avant le rÃ©veil."
    ],
    quiz: [
      {
        question: "Sur quoi LÃ©na et Yaya voyagent-ils dans leur rÃªve ?",
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
    icon: 'ðŸ«',
    image: null,
    text: [
      "LÃ©na rÃªve qu'elle escalade une montagne entiÃ¨rement faite de chocolat.",
      "Les rochers sont des pÃ©pites de chocolat et les riviÃ¨res du chocolat fondu.",
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
    icon: 'ðŸ ',
    image: null,
    text: [
      "Un petit poisson rouge rÃªve de voler.",
      "Une bulle d'air magique l'emporte hors de l'eau.",
      "Il survole la mer et salue les mouettes avant de replonger doucement."
    ],
    quiz: [
      {
        question: "Comment le poisson fait-il pour voler ?",
        options: ["Avec des ailes", "GrÃ¢ce Ã  une bulle magique", "En sautant trÃ¨s haut"],
        answer: 1
      }
    ]
  },
  {
    id: 'instrument-magique',
    title: 'L\'Instrument Magique',
    bilingualTitle: { en: 'The Magical Instrument' },
    theme: 'CrÃ©ativitÃ©',
    duration: 2,
    icon: 'ðŸŽ·',
    image: null,
    text: [
      "Dans une boutique, LÃ©na trouve un instrument Ã©trange.",
      "Quand elle en joue, il ne produit pas de son, mais des bulles de savon colorÃ©es.",
      "Chaque bulle contient un petit rÃªve en image."
    ]
  },
  {
    id: 'murmure-vent',
    title: 'Le Murmure du Vent',
    bilingualTitle: { en: 'The Whisper of the Wind' },
    theme: 'Nature',
    duration: 1,
    icon: 'ðŸŒ¬ï¸',
    text: [
      "Quand le vent souffle, il ne fait pas que faire danser les feuilles.",
      "Il transporte des messages secrets d'un bout Ã  l'autre du monde.",
      "LÃ©na tend l'oreille et entend un \"je t'aime\" venu de trÃ¨s loin."
    ]
  },
  {
    id: 'pierre-chaude',
    title: 'Le Secret de la Pierre Chaude',
    bilingualTitle: { en: 'The Secret of the Warm Stone' },
    theme: 'Nature',
    duration: 2,
    icon: 'ðŸ’Ž',
    text: [
      "Sur le chemin, LÃ©na trouve une pierre lisse et chaude, mÃªme la nuit.",
      "La pierre a emmagasinÃ© toute la lumiÃ¨re du soleil de la journÃ©e.",
      "Elle la met dans sa poche pour avoir un peu de soleil avec elle, mÃªme dans le noir."
    ],
    quiz: [{
      question: "Pourquoi la pierre est-elle chaude ?",
      options: ["Elle est magique", "Elle a stockÃ© la lumiÃ¨re du soleil", "Elle sort du feu"],
      answer: 1
    }]
  },
  {
    id: 'constellation-animaux',
    title: 'La Constellation des Animaux',
    bilingualTitle: { en: 'The Animal Constellation' },
    theme: 'Nature',
    duration: 1,
    icon: 'ðŸ»',
    text: [
        "La nuit, les Ã©toiles ne forment pas que des figures gÃ©omÃ©triques.",
        "Si on regarde bien, on peut voir un grand ours, un lion et mÃªme un petit lapin.",
        "Ils dansent lentement dans le ciel jusqu'au lever du jour."
    ]
  },
  {
    id: 'bateau-feuille',
    title: 'Le Bateau de Feuille',
    bilingualTitle: { en: 'The Leaf Boat' },
    theme: 'Aventure',
    duration: 1,
    icon: 'ðŸ‚',
    text: [
        "LÃ©na pose une grande feuille d'automne sur la riviÃ¨re.",
        "Une coccinelle monte Ã  bord, puis une fourmi.",
        "La feuille devient un bateau de croisiÃ¨re pour les insectes, naviguant vers l'aventure."
    ]
  },
  {
    id: 'mouton-coiffeur',
    title: 'Le Mouton Coiffeur',
    bilingualTitle: { en: 'The Sheep Hairdresser' },
    theme: 'Humour',
    duration: 2,
    icon: 'ðŸ‘',
    text: [
      "BarnabÃ© le mouton avait la laine la plus douce et la plus longue du prÃ©.",
      "Un jour, il dÃ©cida d'ouvrir un salon de coiffure pour ses amis.",
      "Il sculpta des coiffures incroyables aux autres moutons avec sa propre laine.",
      "Le mouton punk, le mouton Ã  nuage... tout le monde Ã©tait trÃ¨s stylÃ© !"
    ],
    quiz: [{
      question: "Qu'est-ce que BarnabÃ© utilise pour coiffer ses amis ?",
      options: ["Des ciseaux", "Sa propre laine", "De la peinture"],
      answer: 1
    }]
  },
  {
    id: 'voyage-sous-canape',
    title: 'Le Voyage sous le CanapÃ©',
    bilingualTitle: { en: 'The Journey Under the Couch' },
    theme: 'Aventure',
    duration: 5,
    icon: 'ðŸ›‹ï¸',
    text: [
      "La petite voiture prÃ©fÃ©rÃ©e de LÃ©na avait roulÃ© sous le canapÃ©. \"C'est une mission pour l'exploratrice LÃ©na et son courageux chat Yaya !\" annonÃ§a-t-elle.",
      "ArmÃ©e d'une lampe de poche, LÃ©na s'allongea sur le ventre. Yaya, curieux, la rejoignit. Le monde sous le canapÃ© Ã©tait un univers Ã©trange et poussiÃ©reux.",
      "Des 'montagnes' de moutons de poussiÃ¨re se dressaient devant eux. Un crayon perdu ressemblait Ã  un tronc d'arbre gÃ©ant.",
      "\"Regarde, Yaya, une grotte de miettes !\" chuchota LÃ©na. Yaya, lui, avait repÃ©rÃ© la voiture, coincÃ©e prÃ¨s d'une 'forÃªt' de pieds de table.",
      "Le chat, plus agile, se faufila et donna un petit coup de patte Ã  la voiture, la faisant rouler vers LÃ©na.",
      "Mission accomplie ! Ils sortirent de sous le canapÃ©, victorieux et un peu sales. LÃ©na serra Yaya dans ses bras. \"Tu es le meilleur co-explorateur du monde !\""
    ],
    quiz: [{
      question: "Quel objet Ã©tait perdu sous le canapÃ© ?",
      options: ["Une poupÃ©e", "Une petite voiture", "Un livre"],
      answer: 1
    }, {
      question: "Qui a rÃ©cupÃ©rÃ© l'objet en premier ?",
      options: ["LÃ©na", "Papa", "Yaya"],
      answer: 2
    }]
  },
  {
    id: 'bain-moussant-magique',
    title: 'Le Bain Moussant Magique',
    bilingualTitle: { en: 'The Magical Bubble Bath' },
    theme: 'Magie',
    duration: 7,
    icon: 'ðŸ›',
    text: [
      "C'Ã©tait l'heure du bain. LÃ©na versa un produit moussant couleur arc-en-ciel dans la baignoire. La mousse monta, monta, jusqu'Ã  former des montagnes et des nuages colorÃ©s.",
      "Yaya, qui dÃ©testait l'eau, observait depuis le tapis de bain, mÃ©fiant. LÃ©na prit un peu de mousse et sculpta un petit bateau.",
      "\"Regarde Yaya, le navire de l'amiral LÃ©na part Ã  l'aventure !\" Le bateau flotta sur l'eau, naviguant entre des icebergs de mousse blanche.",
      "Soudain, une bulle Ã©clata prÃ¨s du nez de Yaya, le surprenant. Il donna un coup de patte maladroit et tomba dans la mousse ! Mais il n'y avait presque pas d'eau, juste une mer de douceur.",
      "Au lieu de paniquer, Yaya se mit Ã  jouer, attrapant les bulles avec ses pattes. Il ressemblait Ã  un petit monstre de mousse.",
      "LÃ©na Ã©clata de rire. Elle sculpta une couronne de mousse sur la tÃªte de Yaya. \"Sire Yaya, le roi du royaume de la Mousse !\"",
      "Pour la premiÃ¨re fois, Yaya semblait apprÃ©cier l'heure du bain. C'Ã©tait bien plus amusant d'Ãªtre un roi de la mousse qu'un chat qui a peur de l'eau."
    ],
    quiz: [{
      question: "Qu'a sculptÃ© LÃ©na avec la mousse en premier ?",
      options: ["Un chÃ¢teau", "Un bateau", "Un animal"],
      answer: 1
    }, {
      question: "Comment Yaya a-t-il rÃ©agi en tombant dans la mousse ?",
      options: ["Il a eu trÃ¨s peur", "Il s'est mis Ã  jouer", "Il a immÃ©diatement sautÃ© hors du bain"],
      answer: 1
    }]
  },
  {
    id: 'jardinier-lune',
    title: 'Le Jardinier de la Lune',
    bilingualTitle: { en: 'The Moon Gardener' },
    theme: 'Magie',
    duration: 4,
    icon: 'ðŸ‘¨â€ðŸš€',
    text: [
      "Chaque nuit, un vieil homme nommÃ© SÃ©lÃ©nius sort avec son arrosoir d'argent.",
      "Il ne jardine pas sur Terre, mais sur la Lune. Il grimpe sur une Ã©chelle de corde invisible.",
      "LÃ -haut, il arrose les cratÃ¨res avec de la poussiÃ¨re d'Ã©toile. Au matin, des fleurs de lumiÃ¨re y ont poussÃ©.",
      "Ces fleurs, vues de la Terre, sont les Ã©toiles que nous admirons."
    ],
    quiz: [{
      question: "Avec quoi SÃ©lÃ©nius arrose-t-il les cratÃ¨res ?",
      options: ["De l'eau de pluie", "De la poussiÃ¨re d'Ã©toile", "Du lait"],
      answer: 1
    }]
  },
  {
    id: 'bibliotheque-perdue',
    title: 'La BibliothÃ¨que Perdue',
    bilingualTitle: { en: 'The Lost Library' },
    theme: 'MystÃ¨re',
    duration: 8,
    icon: 'ðŸ›ï¸',
    text: [
      "Au cÅ“ur de la forÃªt, une lÃ©gende parle d'une bibliothÃ¨que oÃ¹ les livres n'ont pas de fin.",
      "LÃ©na, intriguÃ©e, suit une vieille carte trouvÃ©e dans un livre. Le chemin est gardÃ© par des Ã©nigmes.",
      "Un renard lui demande : 'Qu'est-ce qui a des villes, mais pas de maisons ; des forÃªts, mais pas d'arbres ; et de l'eau, mais pas de poissons ?'",
      "LÃ©na rÃ©flÃ©chit et rÃ©pond : 'Une carte !'. Le renard, impressionnÃ©, lui montre un passage secret derriÃ¨re une cascade.",
      "DerriÃ¨re, une immense bibliothÃ¨que circulaire apparaÃ®t. Les livres flottent dans les airs.",
      "Elle en ouvre un. L'histoire commence, mais Ã  la derniÃ¨re page, elle est invitÃ©e Ã  Ã©crire la suite.",
      "Chaque lecteur devient l'auteur. C'est pour cela que les histoires ne finissent jamais."
    ],
    quiz: [{
      question: "Quelle est la rÃ©ponse Ã  l'Ã©nigme du renard ?",
      options: ["Un globe", "Une carte", "Un miroir"],
      answer: 1
    }, {
      question: "Pourquoi les livres de la bibliothÃ¨que n'ont-ils pas de fin ?",
      options: ["Les pages sont infinies", "Les lecteurs Ã©crivent la suite", "Les fins sont effacÃ©es"],
      answer: 1
    }]
  },
  {
    id: 'capitaine-nuage',
    title: 'Le Capitaine du Nuage Pirate',
    bilingualTitle: { en: 'The Captain of the Cloud Pirate' },
    theme: 'Aventure',
    duration: 5,
    icon: 'ðŸ´â€â˜ ï¸',
    text: [
      "Le Capitaine Nimbus ne navigue pas sur les mers, mais sur un grand nuage en forme de bateau.",
      "Son trÃ©sor n'est pas de l'or, mais des gouttes de pluie de toutes les couleurs.",
      "Un jour, son nuage est attaquÃ© par le terrible Vent du Nord, qui veut voler ses prÃ©cieuses gouttes.",
      "Nimbus a une idÃ©e : il utilise une goutte de pluie rouge pour crÃ©er un arc-en-ciel si Ã©blouissant que le Vent du Nord, surpris, s'enfuit.",
      "Le trÃ©sor est sauvÃ©, et le ciel est plus beau que jamais."
    ],
    quiz: [{
      question: "Quel est le trÃ©sor du Capitaine Nimbus ?",
      options: ["Des piÃ¨ces d'or", "Des gouttes de pluie colorÃ©es", "Des coquillages"],
      answer: 1
    }]
  },
  {
    id: 'detective-gateau',
    title: 'Le MystÃ¨re du GÃ¢teau Disparu',
    bilingualTitle: { en: 'The Mystery of the Missing Cake' },
    theme: 'MystÃ¨re',
    duration: 6,
    icon: 'ðŸ•µï¸',
    text: [
      "Le gÃ¢teau au chocolat de LÃ©na a disparu de la cuisine ! Qui est le coupable ?",
      "LÃ©na, en mode dÃ©tective, cherche des indices. Premier indice : des petites miettes prÃ¨s de la fenÃªtre.",
      "DeuxiÃ¨me indice : une petite plume rousse accrochÃ©e au rideau. Yaya le chat n'a pas de plumes...",
      "TroisiÃ¨me indice : des petites empreintes de pattes dans la farine renversÃ©e sur le sol.",
      "LÃ©na suit les empreintes jusqu'au jardin. DerriÃ¨re un buisson, elle trouve un petit Ã©cureuil, le museau couvert de chocolat, qui dort paisiblement.",
      "Le mystÃ¨re est rÃ©solu ! L'Ã©cureuil gourmand a fait un festin. LÃ©na ne peut s'empÃªcher de sourire."
    ],
    quiz: [{
      question: "Quel est le deuxiÃ¨me indice trouvÃ© par LÃ©na ?",
      options: ["Des miettes", "Une plume rousse", "Des empreintes"],
      answer: 1
    }, {
      question: "Qui Ã©tait le coupable ?",
      options: ["Yaya le chat", "Un oiseau", "Un Ã©cureuil"],
      answer: 2
    }]
  }
];


if (typeof window !== 'undefined') {
    window.gameData = gameData;
}





