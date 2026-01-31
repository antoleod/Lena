const storyTr = (fr, en, es, nl) => ({ fr, en, es, nl });

window.storySetOne = [
  {
    id: 'foret-etoilee',
    title: storyTr('La Forêt Étoilée', 'The Starry Forest', 'El Bosque Estrellado', 'Het Sterrenbos'),
    theme: storyTr('Aventure', 'Adventure', 'Aventura', 'Avontuur'),
    duration: 2,
    icon: '🌌',
    image: null,
    text: [
      storyTr("Léna marche dans une forêt douce et lumineuse.", 'Lena walks in a gentle, glowing forest.', 'Lena camina por un bosque suave y luminoso.', 'Lena loopt door een zachte, lichtgevende bos.'),
      storyTr('Des lucioles dessinent des étoiles tout autour d’elle.', 'Fireflies draw stars all around her.', 'Las luciérnagas dibujan estrellas a su alrededor.', 'Vuurvliegjes tekenen sterren om haar heen.'),
      storyTr("Au loin, une chouette lui murmure : « Suis la lumière la plus brillante. »", 'Far away, an owl whispers: “Follow the brightest light.”', 'A lo lejos, un búho susurra: «Sigue la luz más brillante».', 'In de verte fluistert een uil: “Volg het helderste licht.”')
    ],
    quiz: [
      {
        question: storyTr('Que voit Léna autour d’elle ?', 'What does Lena see around her?', '¿Qué ve Lena a su alrededor?', 'Wat ziet Lena om haar heen?'),
        options: [
          storyTr('Des lucioles', 'Fireflies', 'Luciérnagas', 'Vuurvliegjes'),
          storyTr('Des pingouins', 'Penguins', 'Pingüinos', 'Pinguïns'),
          storyTr('Des dinosaures', 'Dinosaurs', 'Dinosaurios', 'Dinosaurussen')
        ],
        correct: 0
      },
      {
        question: storyTr('Qui lui murmure un secret ?', 'Who whispers a secret to her?', '¿Quién le susurra un secreto?', 'Wie fluistert haar een geheim?'),
        options: [
          storyTr('Un renard', 'A fox', 'Un zorro', 'Een vos'),
          storyTr('Une chouette', 'An owl', 'Un búho', 'Een uil'),
          storyTr('Une licorne', 'A unicorn', 'Un unicornio', 'Een eenhoorn')
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'pont-arc-en-ciel',
    title: storyTr('Le Pont Arc-en-ciel', 'The Rainbow Bridge', 'El Puente Arcoíris', 'De Regenboogbrug'),
    theme: storyTr('Magie', 'Magic', 'Magia', 'Magie'),
    duration: 1,
    icon: '🌈',
    image: null,
    text: [
      storyTr('Un petit pont coloré apparaît au-dessus de la rivière.', 'A small colorful bridge appears over the river.', 'Un pequeño puente colorido aparece sobre el río.', 'Een kleine kleurrijke brug verschijnt boven de rivier.'),
      storyTr('Chaque pas de Léna éclaire une nouvelle couleur.', 'Each step lights up a new color.', 'Cada paso de Lena enciende un nuevo color.', 'Elke stap van Lena laat een nieuwe kleur oplichten.'),
      storyTr('Tout au bout, une cloche sonne doucement: ding… ding…', 'At the end, a bell rings softly: ding… ding…', 'Al final, una campana suena suavemente: ding… ding…', 'Helemaal aan het einde klinkt zacht een bel: ding… ding…')
    ],
    quiz: [
      {
        question: storyTr('Qu’est-ce qui apparaît au-dessus de la rivière ?', 'What appears above the river?', '¿Qué aparece sobre el río?', 'Wat verschijnt er boven de rivier?'),
        options: [
          storyTr('Un pont arc-en-ciel', 'A rainbow bridge', 'Un puente arcoíris', 'Een regenboogbrug'),
          storyTr('Un château', 'A castle', 'Un castillo', 'Een kasteel'),
          storyTr('Un nuage', 'A cloud', 'Una nube', 'Een wolk')
        ],
        correct: 0
      }
    ]
  },
  {
    id: 'grenier-secret',
    title: storyTr('Le Secret du Grenier', "The Attic's Secret", 'El Secreto del Ático', 'Het Geheim van de Zolder'),
    theme: storyTr('Mystère', 'Mystery', 'Misterio', 'Mysterie'),
    duration: 3,
    icon: '📦',
    image: null,
    text: [
      storyTr('Un jour de pluie, Léna et son chat Yaya montent au grenier.', 'On a rainy day, Lena and her cat Yaya go up to the attic.', 'Un día de lluvia, Lena y su gato Yaya suben al ático.', 'Op een regenachtige dag gaan Lena en haar kat Yaya naar de zolder.'),
      storyTr('Yaya fait tomber une vieille boîte. Dedans, une carte mystérieuse !', 'Yaya knocks down an old box. Inside, a mysterious map!', 'Yaya tira una caja vieja. ¡Dentro, un mapa misterioso!', 'Yaya stoot een oude doos om. Binnenin zit een mysterieuze kaart!'),
      storyTr('La carte montre une croix derrière une armoire. Ils trouvent un petit coffre de jouets anciens.', 'The map shows a cross behind a cabinet. They find a small chest of old toys.', 'El mapa muestra una cruz detrás de un armario. Encuentran un pequeño cofre de juguetes antiguos.', 'De kaart toont een kruis achter een kast. Ze vinden een kleine kist met oud speelgoed.')
    ],
    quiz: [
      {
        question: storyTr('Où trouvent-ils la carte ?', 'Where do they find the map?', '¿Dónde encuentran el mapa?', 'Waar vinden ze de kaart?'),
        options: [
          storyTr('Dans le jardin', 'In the garden', 'En el jardín', 'In de tuin'),
          storyTr('Dans le grenier', 'In the attic', 'En el ático', 'Op de zolder'),
          storyTr('Dans la cuisine', 'In the kitchen', 'En la cocina', 'In de keuken')
        ],
        correct: 1
      }
    ]
  }
];

window.storySetTwo = [
  {
    id: 'train-des-reves',
    title: storyTr('Le Train des Rêves', 'The Dream Train', 'El Tren de los Sueños', 'De Dromentrein'),
    theme: storyTr('Aventure', 'Adventure', 'Aventura', 'Avontuur'),
    duration: 2,
    icon: '🚂',
    image: null,
    text: [
      storyTr('Un train tout doux arrive sans bruit.', 'A soft train arrives without a sound.', 'Un tren suave llega sin hacer ruido.', 'Een zachte trein arriveert zonder geluid.'),
      storyTr('Ses wagons sont remplis de couvertures moelleuses et de livres.', 'Its cars are filled with soft blankets and books.', 'Sus vagones están llenos de mantas suaves y libros.', 'De wagons zitten vol zachte dekens en boeken.'),
      storyTr('Léna s’assoit près de la fenêtre et lit en souriant.', 'Lena sits by the window and reads with a smile.', 'Lena se sienta junto a la ventana y lee sonriendo.', 'Lena gaat bij het raam zitten en leest glimlachend.')
    ],
    quiz: [
      {
        question: storyTr('Que transportent les wagons ?', 'What do the cars carry?', '¿Qué transportan los vagones?', 'Wat vervoeren de wagons?'),
        options: [
          storyTr('Des couvertures et des livres', 'Blankets and books', 'Mantas y libros', 'Dekens en boeken'),
          storyTr('Des fleurs', 'Flowers', 'Flores', 'Bloemen'),
          storyTr('Des coquillages', 'Seashells', 'Conchas', 'Schelpen')
        ],
        correct: 0
      }
    ]
  },
  {
    id: 'potion-de-rire',
    title: storyTr('La Potion de Rire', 'The Laughter Potion', 'La Poción de la Risa', 'Het Lachdrankje'),
    theme: storyTr('Humour', 'Humor', 'Humor', 'Humor'),
    duration: 2,
    icon: '🧪',
    image: null,
    text: [
      storyTr('Léna et Yaya décident de faire une potion magique.', 'Lena and Yaya decide to make a magic potion.', 'Lena y Yaya deciden hacer una poción mágica.', 'Lena en Yaya besluiten een magisch drankje te maken.'),
      storyTr('Elle mélange du jus de pomme, de l’eau pétillante et un pétale de rose.', 'She mixes apple juice, sparkling water, and a rose petal.', 'Mezcla jugo de manzana, agua con gas y un pétalo de rosa.', 'Ze mengt appelsap, bruiswater en een rozenblaadje.'),
      storyTr('La potion est délicieuse et tout le monde rit.', 'The potion is delicious and everyone laughs.', 'La poción es deliciosa y todos se ríen.', 'Het drankje is heerlijk en iedereen lacht.')
    ],
    quiz: [
      {
        question: storyTr('Quels ingrédients utilise-t-elle ?', 'Which ingredients does she use?', '¿Qué ingredientes usa?', 'Welke ingrediënten gebruikt ze?'),
        options: [
          storyTr('Jus de pomme, eau pétillante et rose', 'Apple juice, sparkling water and rose', 'Jugo de manzana, agua con gas y rosa', 'Appelsap, bruiswater en roos'),
          storyTr('Lait et chocolat', 'Milk and chocolate', 'Leche y chocolate', 'Melk en chocolade'),
          storyTr('Jus d’orange et carottes', 'Orange juice and carrots', 'Jugo de naranja y zanahorias', 'Sinaasappelsap en wortels')
        ],
        correct: 0
      }
    ]
  },
  {
    id: 'bibliotheque-etoiles',
    title: storyTr('La Bibliothèque sous les Étoiles', 'The Library Under the Stars', 'La Biblioteca bajo las Estrellas', 'De Bibliotheek onder de Sterren'),
    theme: storyTr('Magie', 'Magic', 'Magia', 'Magie'),
    duration: 2,
    icon: '📚',
    image: null,
    text: [
      storyTr('Une nuit, Léna découvre une bibliothèque en plein air.', 'One night, Lena discovers an open-air library.', 'Una noche, Lena descubre una biblioteca al aire libre.', 'Op een nacht ontdekt Lena een bibliotheek in de open lucht.'),
      storyTr('Les livres scintillent comme des étoiles.', 'The books sparkle like stars.', 'Los libros brillan como estrellas.', 'De boeken fonkelen als sterren.'),
      storyTr('Chaque livre raconte l’histoire d’une constellation.', 'Each book tells the story of a constellation.', 'Cada libro cuenta la historia de una constelación.', 'Elk boek vertelt het verhaal van een sterrenbeeld.')
    ],
    quiz: [
      {
        question: storyTr('De quoi parlent les livres ?', 'What are the books about?', '¿De qué tratan los libros?', 'Waar gaan de boeken over?'),
        options: [
          storyTr('Des animaux', 'Animals', 'Animales', 'Dieren'),
          storyTr('Des constellations', 'Constellations', 'Constelaciones', 'Sterrenbeelden'),
          storyTr('Des recettes', 'Recipes', 'Recetas', 'Recepten')
        ],
        correct: 1
      }
    ]
  }
];

window.storySetThree = [
  {
    id: 'renard-peintre',
    title: storyTr('Le Renard Peintre', 'The Painting Fox', 'El Zorro Pintor', 'De Schilderende Vos'),
    theme: storyTr('Créativité', 'Creativity', 'Creatividad', 'Creativiteit'),
    duration: 1,
    icon: '🦊',
    image: null,
    text: [
      storyTr('Un petit renard trouve des pots de peinture dans la forêt.', 'A little fox finds paint jars in the forest.', 'Un zorro pequeño encuentra botes de pintura en el bosque.', 'Een klein vosje vindt verfpotten in het bos.'),
      storyTr('Avec sa queue, il peint un arc-en-ciel sur une pierre.', 'With its tail, it paints a rainbow on a stone.', 'Con su cola, pinta un arcoíris en una piedra.', 'Met zijn staart schildert hij een regenboog op een steen.'),
      storyTr('Tous les animaux viennent admirer son œuvre.', 'All the animals come to admire the artwork.', 'Todos los animales vienen a admirar su obra.', 'Alle dieren komen het kunstwerk bewonderen.')
    ],
    quiz: [
      {
        question: storyTr('Que peint le renard ?', 'What does the fox paint?', '¿Qué pinta el zorro?', 'Wat schildert de vos?'),
        options: [
          storyTr('Un arc-en-ciel', 'A rainbow', 'Un arcoíris', 'Een regenboog'),
          storyTr('Une maison', 'A house', 'Una casa', 'Een huis'),
          storyTr('Un bateau', 'A boat', 'Un barco', 'Een boot')
        ],
        correct: 0
      }
    ]
  },
  {
    id: 'goutte-pluie',
    title: storyTr('La Goutte de Pluie Curieuse', 'The Curious Raindrop', 'La Gota de Lluvia Curiosa', 'De Nieuwsgierige Regendruppel'),
    theme: storyTr('Nature', 'Nature', 'Naturaleza', 'Natuur'),
    duration: 1,
    icon: '💧',
    image: null,
    text: [
      storyTr('Une petite goutte nommée Plume glisse d’un nuage.', 'A little drop named Plume slides from a cloud.', 'Una gotita llamada Pluma se desliza desde una nube.', 'Een druppel genaamd Plume glijdt van een wolk.'),
      storyTr('Elle traverse un arc-en-ciel et devient brillante.', 'It crosses a rainbow and becomes shiny.', 'Cruza un arcoíris y se vuelve brillante.', 'Ze gaat door een regenboog en wordt glanzend.'),
      storyTr('La tulipe la remercie pour sa fraîcheur.', 'The tulip thanks it for its freshness.', 'El tulipán le da las gracias por su frescura.', 'De tulp bedankt haar voor haar frisheid.')
    ],
    quiz: [
      {
        question: storyTr('Par quoi la goutte passe-t-elle ?', 'What does the drop pass through?', '¿Por qué pasa la gota?', 'Waar gaat de druppel doorheen?'),
        options: [
          storyTr('Un arc-en-ciel', 'A rainbow', 'Un arcoíris', 'Een regenboog'),
          storyTr('Une montagne', 'A mountain', 'Una montaña', 'Een berg'),
          storyTr('Un tunnel', 'A tunnel', 'Un túnel', 'Een tunnel')
        ],
        correct: 0
      }
    ]
  },
  {
    id: 'dragon-peureux',
    title: storyTr('Le Dragon qui avait peur des Souris', 'The Dragon Who Was Afraid of Mice', 'El Dragón que tenía miedo de los Ratones', 'De Draak die bang was voor Muizen'),
    theme: storyTr('Humour', 'Humor', 'Humor', 'Humor'),
    duration: 3,
    icon: '🐲',
    image: null,
    text: [
      storyTr('Ignis était un grand dragon rouge qui gardait un trésor.', 'Ignis was a big red dragon guarding a treasure.', 'Ignis era un gran dragón rojo que cuidaba un tesoro.', 'Ignis was een grote rode draak die een schat bewaakte.'),
      storyTr('Il n’avait peur de rien… sauf des souris !', 'He was afraid of nothing… except mice!', 'No tenía miedo de nada… ¡excepto de los ratones!', 'Hij was voor niets bang… behalve voor muizen!'),
      storyTr('Une petite souris lui apprend à rire, et tout va mieux.', 'A little mouse teaches him to laugh, and everything feels better.', 'Un ratoncito le enseña a reír y todo mejora.', 'Een muisje leert hem lachen en dan gaat het beter.')
    ],
    quiz: [
      {
        question: storyTr('De quoi Ignis a-t-il peur ?', 'What is Ignis afraid of?', '¿De qué tiene miedo Ignis?', 'Waar is Ignis bang voor?'),
        options: [
          storyTr('Des souris', 'Mice', 'Ratones', 'Muizen'),
          storyTr('Des chevaliers', 'Knights', 'Caballeros', 'Ridders'),
          storyTr('Du noir', 'The dark', 'La oscuridad', 'Het donker')
        ],
        correct: 0
      }
    ]
  }
];
