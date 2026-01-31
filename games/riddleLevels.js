window.riddleLevels = [
  {
    level: 1,
    theme: { fr: 'Animaux câlins', en: 'Cuddly animals', es: 'Animales cariñosos', nl: 'Knuffeldieren' },
    completionMessage: { fr: 'Tu connais tous les animaux câlins !', en: 'You know all the cuddly animals!', es: '¡Conoces a todos los animales cariñosos!', nl: 'Je kent alle knuffeldieren!' },
    questions: [
      {
        prompt: { fr: "Je suis petit, je ronronne et j'aime boire du lait. Qui suis-je ?", en: 'I am small, I purr and I like drinking milk. Who am I?', es: 'Soy pequeño, ronroneo y me gusta beber leche. ¿Quién soy?', nl: 'Ik ben klein, ik spin en ik drink graag melk. Wie ben ik?' },
        options: [
          { fr: 'Un chaton', en: 'A kitten', es: 'Un gatito', nl: 'Een kitten' },
          { fr: 'Un veau', en: 'A calf', es: 'Un ternerito', nl: 'Een kalf' },
          { fr: 'Un poussin', en: 'A chick', es: 'Un pollito', nl: 'Een kuiken' }
        ],
        answer: 0,
        hint: { fr: 'Je dors souvent dans un panier en osier.', en: 'I often sleep in a wicker basket.', es: 'A menudo duermo en una cesta de mimbre.', nl: 'Ik slaap vaak in een rieten mand.' },
        success: { fr: 'Bravo, le chaton adore les caresses !', en: 'Well done, the kitten loves cuddles!', es: '¡Bien hecho, al gatito le encantan las caricias!', nl: 'Goed gedaan, het kitten houdt van knuffels!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je saute dans le jardin et je grignote des carottes. Qui suis-je ?', en: 'I hop in the garden and nibble carrots. Who am I?', es: 'Salto en el jardín y mordisqueo zanahorias. ¿Quién soy?', nl: 'Ik huppel in de tuin en knabbel wortels. Wie ben ik?' },
        options: [
          { fr: 'Un lapin', en: 'A rabbit', es: 'Un conejo', nl: 'Een konijn' },
          { fr: 'Un chiot', en: 'A puppy', es: 'Un cachorro', nl: 'Een puppy' },
          { fr: 'Un hérisson', en: 'A hedgehog', es: 'Un erizo', nl: 'Een egel' }
        ],
        answer: 0,
        hint: { fr: 'Mes oreilles sont très longues.', en: 'My ears are very long.', es: 'Mis orejas son muy largas.', nl: 'Mijn oren zijn heel lang.' },
        success: { fr: 'Oui, le lapin aime bondir partout !', en: 'Yes, the rabbit loves to hop around!', es: 'Sí, el conejo adora brincar por todas partes.', nl: 'Ja, het konijn houdt van rondhuppelen!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je marche lentement en portant ma maison sur mon dos. Qui suis-je ?', en: 'I walk slowly carrying my house on my back. Who am I?', es: 'Camino despacio llevando mi casa en la espalda. ¿Quién soy?', nl: 'Ik loop langzaam en draag mijn huis op mijn rug. Wie ben ik?' },
        options: [
          { fr: 'Une tortue', en: 'A turtle', es: 'Una tortuga', nl: 'Een schildpad' },
          { fr: 'Un hamster', en: 'A hamster', es: 'Un hámster', nl: 'Een hamster' },
          { fr: 'Une coccinelle', en: 'A ladybug', es: 'Una mariquita', nl: 'Een lieveheersbeestje' }
        ],
        answer: 0,
        hint: { fr: "Je peux vivre sur terre et parfois dans l'eau.", en: 'I can live on land and sometimes in water.', es: 'Puedo vivir en tierra y a veces en el agua.', nl: 'Ik kan op het land leven en soms in het water.' },
        success: { fr: 'Exact, la tortue avance à son rythme !', en: 'Exactly, the turtle moves at its own pace!', es: '¡Exacto, la tortuga avanza a su ritmo!', nl: 'Precies, de schildpad gaat in haar eigen tempo!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je suis tout jaune, je gazouille et je nage dans la mare. Qui suis-je ?', en: 'I am all yellow, I chirp and I swim in the pond. Who am I?', es: 'Soy todo amarillo, pío y nado en el estanque. ¿Quién soy?', nl: 'Ik ben helemaal geel, ik piep en ik zwem in de vijver. Wie ben ik?' },
        options: [
          { fr: 'Un caneton', en: 'A duckling', es: 'Un patito', nl: 'Een eendje' },
          { fr: 'Un flamant', en: 'A flamingo', es: 'Un flamenco', nl: 'Een flamingo' },
          { fr: 'Un merle', en: 'A blackbird', es: 'Un mirlo', nl: 'Een merel' }
        ],
        answer: 0,
        hint: { fr: "Je suis le bébé d'une cane.", en: 'I am the baby of a duck.', es: 'Soy el bebé de una pata.', nl: 'Ik ben het jong van een eend.' },
        success: { fr: 'Bien joué, le caneton aime barboter !', en: 'Well done, the duckling loves to paddle!', es: '¡Bien hecho, al patito le encanta chapotear!', nl: 'Goed gedaan, het eendje houdt van spetteren!' },
        reward: { stars: 6, coins: 4 }
      }
    ]
  },
  {
    level: 2,
    theme: { fr: 'Animaux aventuriers', en: 'Adventurous animals', es: 'Animales aventureros', nl: 'Avontuurlijke dieren' },
    completionMessage: { fr: 'Tu as exploré la forêt des animaux aventuriers !', en: 'You explored the forest of adventurous animals!', es: '¡Exploraste el bosque de los animales aventureros!', nl: 'Je hebt het bos van avontuurlijke dieren ontdekt!' },
    questions: [
      {
        prompt: { fr: 'Je suis le roi de la savane et je rugis très fort. Qui suis-je ?', en: 'I am the king of the savanna and I roar very loudly. Who am I?', es: 'Soy el rey de la sabana y rujo muy fuerte. ¿Quién soy?', nl: 'Ik ben de koning van de savanne en ik brul heel hard. Wie ben ik?' },
        options: [
          { fr: 'Un lion', en: 'A lion', es: 'Un león', nl: 'Een leeuw' },
          { fr: 'Un ours', en: 'A bear', es: 'Un oso', nl: 'Een beer' },
          { fr: 'Un zébu', en: 'A zebu', es: 'Un cebú', nl: 'Een zebu' }
        ],
        answer: 0,
        hint: { fr: 'Ma crinière brille au soleil.', en: 'My mane shines in the sun.', es: 'Mi melena brilla al sol.', nl: 'Mijn manen glanzen in de zon.' },
        success: { fr: 'Bravo, le lion protège sa troupe !', en: 'Bravo, the lion protects his pride!', es: '¡Bravo, el león protege a su manada!', nl: 'Bravo, de leeuw beschermt zijn troep!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je suis noir et blanc et je croque du bambou toute la journée. Qui suis-je ?', en: 'I am black and white and I munch bamboo all day. Who am I?', es: 'Soy blanco y negro y mastico bambú todo el día. ¿Quién soy?', nl: 'Ik ben zwart en wit en ik knabbel de hele dag bamboe. Wie ben ik?' },
        options: [
          { fr: 'Un panda', en: 'A panda', es: 'Un panda', nl: 'Een panda' },
          { fr: 'Un koala', en: 'A koala', es: 'Un koala', nl: 'Een koala' },
          { fr: 'Un tapir', en: 'A tapir', es: 'Un tapir', nl: 'Een tapir' }
        ],
        answer: 0,
        hint: { fr: 'Je vis dans une forêt de bambous.', en: 'I live in a bamboo forest.', es: 'Vivo en un bosque de bambú.', nl: 'Ik woon in een bamboebos.' },
        success: { fr: 'Exact, le panda adore les pousses tendres !', en: 'Exactly, the panda loves tender shoots!', es: '¡Exacto, al panda le encantan los brotes tiernos!', nl: 'Precies, de panda houdt van zachte scheuten!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je vole la nuit en utilisant un radar magique. Qui suis-je ?', en: 'I fly at night using a magical radar. Who am I?', es: 'Vuelo de noche usando un radar mágico. ¿Quién soy?', nl: 'Ik vlieg ’s nachts met een magische radar. Wie ben ik?' },
        options: [
          { fr: 'Une chauve-souris', en: 'A bat', es: 'Un murciélago', nl: 'Een vleermuis' },
          { fr: 'Une chouette', en: 'An owl', es: 'Un búho', nl: 'Een uil' },
          { fr: 'Un corbeau', en: 'A crow', es: 'Un cuervo', nl: 'Een kraai' }
        ],
        answer: 0,
        hint: { fr: 'Je dors la tête en bas.', en: 'I sleep upside down.', es: 'Duermo cabeza abajo.', nl: 'Ik slaap ondersteboven.' },
        success: { fr: 'Oui, la chauve-souris glisse dans le noir !', en: 'Yes, the bat glides in the dark!', es: '¡Sí, el murciélago se desliza en la oscuridad!', nl: 'Ja, de vleermuis glijdt in het donker!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: "Je suis très grand, j'ai un long cou pour manger les feuilles. Qui suis-je ?", en: 'I am very tall, I have a long neck to eat leaves. Who am I?', es: 'Soy muy alto, tengo un cuello largo para comer hojas. ¿Quién soy?', nl: 'Ik ben heel groot en ik heb een lange nek om bladeren te eten. Wie ben ik?' },
        options: [
          { fr: 'Une girafe', en: 'A giraffe', es: 'Una jirafa', nl: 'Een giraf' },
          { fr: 'Une autruche', en: 'An ostrich', es: 'Un avestruz', nl: 'Een struisvogel' },
          { fr: 'Un lama', en: 'A llama', es: 'Una llama', nl: 'Een lama' }
        ],
        answer: 0,
        hint: { fr: 'Je vis sur la savane africaine.', en: 'I live on the African savanna.', es: 'Vivo en la sabana africana.', nl: 'Ik leef op de Afrikaanse savanne.' },
        success: { fr: 'Bravo, la girafe atteint les arbres les plus hauts !', en: 'Bravo, the giraffe reaches the tallest trees!', es: '¡Bravo, la jirafa alcanza los árboles más altos!', nl: 'Bravo, de giraf bereikt de hoogste bomen!' },
        reward: { stars: 6, coins: 4 }
      }
    ]
  },
  {
    level: 3,
    theme: { fr: 'Goûter magique', en: 'Magical snack', es: 'Merienda mágica', nl: 'Magische snack' },
    completionMessage: { fr: 'Tu as préparé un goûter enchanté !', en: 'You prepared a magical snack!', es: '¡Preparaste una merienda encantada!', nl: 'Je hebt een magische snack klaargemaakt!' },
    questions: [
      {
        prompt: { fr: 'Je suis moelleux, je suis parfois au chocolat et on me souffle pour un anniversaire. Qui suis-je ?', en: 'I am soft, sometimes chocolate, and you blow on me for a birthday. Who am I?', es: 'Soy esponjoso, a veces de chocolate, y me soplan en un cumpleaños. ¿Quién soy?', nl: 'Ik ben zacht, soms met chocolade, en je blaast me uit op een verjaardag. Wie ben ik?' },
        options: [
          { fr: 'Un gâteau', en: 'A cake', es: 'Un pastel', nl: 'Een taart' },
          { fr: 'Une salade', en: 'A salad', es: 'Una ensalada', nl: 'Een salade' },
          { fr: 'Une soupe', en: 'A soup', es: 'Una sopa', nl: 'Een soep' }
        ],
        answer: 0,
        hint: { fr: 'Je porte des bougies et des décorations.', en: 'I wear candles and decorations.', es: 'Llevo velas y decoraciones.', nl: 'Ik heb kaarsjes en versiering.' },
        success: { fr: 'Miam, le gâteau est prêt à être partagé !', en: 'Yummy, the cake is ready to share!', es: '¡Mmm, el pastel está listo para compartir!', nl: 'Jammie, de taart is klaar om te delen!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je suis un fruit rouge avec des pépins, on me trouve en été. Qui suis-je ?', en: 'I am a red fruit with seeds, found in summer. Who am I?', es: 'Soy una fruta roja con semillas, se encuentra en verano. ¿Quién soy?', nl: 'Ik ben een rode vrucht met pitjes, je vindt me in de zomer. Wie ben ik?' },
        options: [
          { fr: 'Une fraise', en: 'A strawberry', es: 'Una fresa', nl: 'Een aardbei' },
          { fr: 'Une banane', en: 'A banana', es: 'Un plátano', nl: 'Een banaan' },
          { fr: 'Une prune', en: 'A plum', es: 'Una ciruela', nl: 'Een pruim' }
        ],
        answer: 0,
        hint: { fr: 'Je me cache dans un petit panier.', en: 'I hide in a small basket.', es: 'Me escondo en una cestita.', nl: 'Ik verstop me in een klein mandje.' },
        success: { fr: 'Bonne idée, la fraise est bien sucrée !', en: 'Good choice, the strawberry is sweet!', es: '¡Buena idea, la fresa es bien dulce!', nl: 'Goede keuze, de aardbei is lekker zoet!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je suis tout rond, j’ai une peau orange et je laisse le jus dégouliner. Qui suis-je ?', en: 'I am round, I have orange skin, and I drip juice. Who am I?', es: 'Soy redondo, tengo piel naranja y dejo caer jugo. ¿Quién soy?', nl: 'Ik ben rond, ik heb een oranje schil en ik laat sap druipen. Wie ben ik?' },
        options: [
          { fr: 'Une orange', en: 'An orange', es: 'Una naranja', nl: 'Een sinaasappel' },
          { fr: 'Un kiwi', en: 'A kiwi', es: 'Un kiwi', nl: 'Een kiwi' },
          { fr: 'Un abricot', en: 'An apricot', es: 'Un albaricoque', nl: 'Een abrikoos' }
        ],
        answer: 0,
        hint: { fr: 'On me presse pour faire une boisson vitaminée.', en: 'You squeeze me to make a vitamin drink.', es: 'Me exprimen para hacer una bebida vitamínica.', nl: 'Je perst me voor een vitamine drankje.' },
        success: { fr: "Bravo, une orange pleine d'énergie !", en: 'Bravo, an orange full of energy!', es: '¡Bravo, una naranja llena de energía!', nl: 'Bravo, een sinaasappel vol energie!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je suis croquant, je suis fait de pain et de garnitures. Qui suis-je ?', en: 'I am crunchy, made of bread and fillings. Who am I?', es: 'Soy crujiente, estoy hecho de pan y rellenos. ¿Quién soy?', nl: 'Ik ben knapperig, gemaakt van brood en beleg. Wie ben ik?' },
        options: [
          { fr: 'Un sandwich', en: 'A sandwich', es: 'Un sándwich', nl: 'Een sandwich' },
          { fr: 'Un biscuit', en: 'A cookie', es: 'Una galleta', nl: 'Een koekje' },
          { fr: 'Une tarte', en: 'A pie', es: 'Una tarta', nl: 'Een taart' }
        ],
        answer: 0,
        hint: { fr: 'On me glisse dans une boîte à goûter.', en: 'I get packed into a lunchbox.', es: 'Me meten en una lonchera.', nl: 'Ik ga in een broodtrommel.' },
        success: { fr: 'Super, le sandwich est prêt pour le pique-nique !', en: 'Great, the sandwich is ready for the picnic!', es: '¡Genial, el sándwich está listo para el picnic!', nl: 'Top, de sandwich is klaar voor de picknick!' },
        reward: { stars: 6, coins: 4 }
      }
    ]
  },
  {
    level: 4,
    theme: { fr: 'Objets de la classe', en: 'Classroom objects', es: 'Objetos del aula', nl: 'Voorwerpen in de klas' },
    completionMessage: { fr: 'Tu connais chaque outil de la classe magique !', en: 'You know every tool in the magic classroom!', es: '¡Conoces cada herramienta del aula mágica!', nl: 'Je kent elk hulpmiddel in de magische klas!' },
    questions: [
      {
        prompt: { fr: "Je dessine et j'efface, je suis souvent bleu ou noir. Qui suis-je ?", en: 'I draw and erase, I am often blue or black. Who am I?', es: 'Dibujo y borro, a menudo soy azul o negro. ¿Quién soy?', nl: 'Ik teken en wis, ik ben vaak blauw of zwart. Wie ben ik?' },
        options: [
          { fr: 'Un feutre', en: 'A marker', es: 'Un marcador', nl: 'Een stift' },
          { fr: 'Un pinceau', en: 'A paintbrush', es: 'Un pincel', nl: 'Een penseel' },
          { fr: 'Un compas', en: 'A compass', es: 'Un compás', nl: 'Een passer' }
        ],
        answer: 0,
        hint: { fr: 'Je vis sur le tableau blanc.', en: 'I live on the whiteboard.', es: 'Vivo en la pizarra blanca.', nl: 'Ik leef op het whiteboard.' },
        success: { fr: 'Exact, le feutre trace des idées !', en: 'Exactly, the marker draws ideas!', es: '¡Exacto, el marcador dibuja ideas!', nl: 'Precies, de stift tekent ideeën!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je tiens les feuilles sans bouger, je mordille le papier. Qui suis-je ?', en: 'I hold papers without moving, I nibble the paper. Who am I?', es: 'Sujeto las hojas sin moverme, muerdo el papel. ¿Quién soy?', nl: 'Ik houd blaadjes vast en knabbel aan papier. Wie ben ik?' },
        options: [
          { fr: 'Un trombone', en: 'A paperclip', es: 'Un clip', nl: 'Een paperclip' },
          { fr: 'Un cutter', en: 'A cutter', es: 'Un cúter', nl: 'Een snijmes' },
          { fr: 'Une gomme', en: 'An eraser', es: 'Una goma', nl: 'Een gum' }
        ],
        answer: 0,
        hint: { fr: 'Je suis en métal et je me plie facilement.', en: 'I am made of metal and I bend easily.', es: 'Soy de metal y me doblo fácilmente.', nl: 'Ik ben van metaal en buig makkelijk.' },
        success: { fr: 'Bravo, le trombone garde les copies ensemble !', en: 'Bravo, the paperclip keeps papers together!', es: '¡Bravo, el clip mantiene las hojas juntas!', nl: 'Bravo, de paperclip houdt alles bij elkaar!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: 'Je coupe le papier proprement avec mes deux lames. Qui suis-je ?', en: 'I cut paper neatly with my two blades. Who am I?', es: 'Corto el papel limpiamente con mis dos hojas. ¿Quién soy?', nl: 'Ik knip papier netjes met mijn twee bladen. Wie ben ik?' },
        options: [
          { fr: 'Des ciseaux', en: 'Scissors', es: 'Unas tijeras', nl: 'Een schaar' },
          { fr: 'Une règle', en: 'A ruler', es: 'Una regla', nl: 'Een liniaal' },
          { fr: 'Une perforatrice', en: 'A hole punch', es: 'Una perforadora', nl: 'Een perforator' }
        ],
        answer: 0,
        hint: { fr: 'Je suis dangereux sans surveillance.', en: 'I can be dangerous without supervision.', es: 'Puedo ser peligroso sin supervisión.', nl: 'Ik kan gevaarlijk zijn zonder toezicht.' },
        success: { fr: 'Bien joué, les ciseaux découpent avec soin !', en: 'Well done, the scissors cut carefully!', es: '¡Bien hecho, las tijeras cortan con cuidado!', nl: 'Goed gedaan, de schaar knipt netjes!' },
        reward: { stars: 6, coins: 4 }
      },
      {
        prompt: { fr: "Je calcule et j'affiche des chiffres lumineux. Qui suis-je ?", en: 'I calculate and show bright numbers. Who am I?', es: 'Calculo y muestro números luminosos. ¿Quién soy?', nl: 'Ik reken en toon lichtgevende cijfers. Wie ben ik?' },
        options: [
          { fr: 'Une calculatrice', en: 'A calculator', es: 'Una calculadora', nl: 'Een rekenmachine' },
          { fr: 'Un dictionnaire', en: 'A dictionary', es: 'Un diccionario', nl: 'Een woordenboek' },
          { fr: 'Une trousse', en: 'A pencil case', es: 'Un estuche', nl: 'Een etui' }
        ],
        answer: 0,
        hint: { fr: 'Je t\'aide pendant les devoirs de maths.', en: 'I help you with math homework.', es: 'Te ayudo con las tareas de matemáticas.', nl: 'Ik help je bij je rekensommen.' },
        success: { fr: 'Oui, la calculatrice donne les bonnes réponses !', en: 'Yes, the calculator gives the right answers!', es: '¡Sí, la calculadora da las respuestas correctas!', nl: 'Ja, de rekenmachine geeft de juiste antwoorden!' },
        reward: { stars: 6, coins: 4 }
      }
    ]
  },
  {
    level: 5,
    theme: { fr: 'Maison enchantée', en: 'Enchanted house', es: 'Casa encantada', nl: 'Betoverd huis' },
    completionMessage: { fr: 'Tu t’es promené dans toute la maison enchantée !', en: 'You wandered through the entire enchanted house!', es: '¡Recorriste toda la casa encantada!', nl: 'Je wandelde door het hele betoverde huis!' },
    questions: [
      {
        prompt: { fr: 'Je cuis des gâteaux dans ma chaleur douce. Qui suis-je ?', en: 'I bake cakes with my gentle heat. Who am I?', es: 'Cocino pasteles con mi calor suave. ¿Quién soy?', nl: 'Ik bak taarten met mijn zachte warmte. Wie ben ik?' },
        options: [
          { fr: 'Un four', en: 'An oven', es: 'Un horno', nl: 'Een oven' },
          { fr: 'Un frigo', en: 'A fridge', es: 'Un refrigerador', nl: 'Een koelkast' },
          { fr: 'Un évier', en: 'A sink', es: 'Un fregadero', nl: 'Een gootsteen' }
        ],
        answer: 0,
        hint: { fr: 'On m’ouvre avec des gants.', en: 'You open me with oven mitts.', es: 'Me abren con guantes.', nl: 'Je opent me met ovenhandschoenen.' },
        success: { fr: 'Bravo, le four fait lever la pâte !', en: 'Bravo, the oven makes the dough rise!', es: '¡Bravo, el horno hace subir la masa!', nl: 'Bravo, de oven laat het deeg rijzen!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je garde les aliments au frais jour et nuit. Qui suis-je ?', en: 'I keep food cool day and night. Who am I?', es: 'Mantengo los alimentos frescos día y noche. ¿Quién soy?', nl: 'Ik houd eten koel dag en nacht. Wie ben ik?' },
        options: [
          { fr: 'Un frigo', en: 'A fridge', es: 'Un refrigerador', nl: 'Een koelkast' },
          { fr: 'Un four', en: 'An oven', es: 'Un horno', nl: 'Een oven' },
          { fr: 'Un lave-vaisselle', en: 'A dishwasher', es: 'Un lavavajillas', nl: 'Een vaatwasser' }
        ],
        answer: 0,
        hint: { fr: 'Je bourdonne doucement.', en: 'I hum softly.', es: 'Zumbó suavemente.', nl: 'Ik zoem zachtjes.' },
        success: { fr: 'Exact, le frigo conserve les goûts !', en: 'Exactly, the fridge keeps flavors fresh!', es: '¡Exacto, el refrigerador conserva los sabores!', nl: 'Precies, de koelkast houdt smaken fris!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je lave les vêtements avec de la mousse. Qui suis-je ?', en: 'I wash clothes with foam. Who am I?', es: 'Lavo la ropa con espuma. ¿Quién soy?', nl: 'Ik was kleding met schuim. Wie ben ik?' },
        options: [
          { fr: 'Une machine à laver', en: 'A washing machine', es: 'Una lavadora', nl: 'Een wasmachine' },
          { fr: 'Un aspirateur', en: 'A vacuum', es: 'Una aspiradora', nl: 'Een stofzuiger' },
          { fr: 'Une poubelle', en: 'A trash can', es: 'Un basurero', nl: 'Een vuilnisbak' }
        ],
        answer: 0,
        hint: { fr: 'Je tourne très vite en faisant un tourbillon.', en: 'I spin very fast in a whirl.', es: 'Giro muy rápido en un remolino.', nl: 'Ik draai heel snel in een draaikolk.' },
        success: { fr: 'Bien vu, la machine à laver nettoie tout !', en: 'Well spotted, the washing machine cleans everything!', es: '¡Bien visto, la lavadora limpia todo!', nl: 'Goed gezien, de wasmachine maakt alles schoon!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je balaie le tapis avec un grand bruit. Qui suis-je ?', en: 'I clean the carpet with a loud noise. Who am I?', es: 'Aspiro la alfombra con un gran ruido. ¿Quién soy?', nl: 'Ik maak het tapijt schoon met veel geluid. Wie ben ik?' },
        options: [
          { fr: 'Un aspirateur', en: 'A vacuum', es: 'Una aspiradora', nl: 'Een stofzuiger' },
          { fr: 'Un balai', en: 'A broom', es: 'Una escoba', nl: 'Een bezem' },
          { fr: 'Un plumeau', en: 'A duster', es: 'Un plumero', nl: 'Een plumeau' }
        ],
        answer: 0,
        hint: { fr: 'Je suis branché à une prise.', en: 'I plug into a socket.', es: 'Me conecto a un enchufe.', nl: 'Ik zit in het stopcontact.' },
        success: { fr: 'Oui, l’aspirateur avale la poussière !', en: 'Yes, the vacuum swallows dust!', es: '¡Sí, la aspiradora se traga el polvo!', nl: 'Ja, de stofzuiger slurpt stof op!' },
        reward: { stars: 7, coins: 5 }
      }
    ]
  },
  {
    level: 6,
    theme: { fr: 'Nature mystérieuse', en: 'Mysterious nature', es: 'Naturaleza misteriosa', nl: 'Mysterieuse natuur' },
    completionMessage: { fr: 'Tu as décodé tous les secrets de la nature mystérieuse !', en: 'You decoded all the secrets of mysterious nature!', es: '¡Descifraste todos los secretos de la naturaleza misteriosa!', nl: 'Je hebt alle geheimen van de mysterieuze natuur ontrafeld!' },
    questions: [
      {
        prompt: { fr: 'Je tombe du ciel, je suis douce au printemps. Qui suis-je ?', en: 'I fall from the sky, I am gentle in spring. Who am I?', es: 'Caigo del cielo, soy suave en primavera. ¿Quién soy?', nl: 'Ik val uit de lucht en ben zacht in de lente. Wie ben ik?' },
        options: [
          { fr: 'La pluie', en: 'Rain', es: 'La lluvia', nl: 'Regen' },
          { fr: 'La neige', en: 'Snow', es: 'La nieve', nl: 'Sneeuw' },
          { fr: 'Le vent', en: 'Wind', es: 'El viento', nl: 'Wind' }
        ],
        answer: 0,
        hint: { fr: 'Je fais pousser les fleurs.', en: 'I help flowers grow.', es: 'Hago crecer las flores.', nl: 'Ik laat bloemen groeien.' },
        success: { fr: 'Bravo, la pluie arrose la terre !', en: 'Bravo, rain waters the earth!', es: '¡Bravo, la lluvia riega la tierra!', nl: 'Bravo, regen geeft de aarde water!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je brille fort dans le ciel et je réchauffe tout. Qui suis-je ?', en: 'I shine brightly in the sky and warm everything. Who am I?', es: 'Brillo fuerte en el cielo y caliento todo. ¿Quién soy?', nl: 'Ik schijn fel aan de hemel en verwarm alles. Wie ben ik?' },
        options: [
          { fr: 'Le soleil', en: 'The sun', es: 'El sol', nl: 'De zon' },
          { fr: 'La lune', en: 'The moon', es: 'La luna', nl: 'De maan' },
          { fr: 'Une étoile filante', en: 'A shooting star', es: 'Una estrella fugaz', nl: 'Een vallende ster' }
        ],
        answer: 0,
        hint: { fr: 'Je disparais la nuit.', en: 'I disappear at night.', es: 'Desaparezco de noche.', nl: 'Ik verdwijn ’s nachts.' },
        success: { fr: 'Oui, le soleil dore la journée !', en: 'Yes, the sun warms the day!', es: '¡Sí, el sol calienta el día!', nl: 'Ja, de zon verwarmt de dag!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je suis une plante qui grimpe et me couvre de ronces. Qui suis-je ?', en: 'I am a plant that climbs and has thorns. Who am I?', es: 'Soy una planta que trepa y tiene espinas. ¿Quién soy?', nl: 'Ik ben een klimplant met doorns. Wie ben ik?' },
        options: [
          { fr: 'Un rosier', en: 'A rose bush', es: 'Un rosal', nl: 'Een rozenstruik' },
          { fr: 'Un pommier', en: 'An apple tree', es: 'Un manzano', nl: 'Een appelboom' },
          { fr: 'Une herbe', en: 'Grass', es: 'Hierba', nl: 'Gras' }
        ],
        answer: 0,
        hint: { fr: 'Mes fleurs ont des épines.', en: 'My flowers have thorns.', es: 'Mis flores tienen espinas.', nl: 'Mijn bloemen hebben doorns.' },
        success: { fr: 'Bien joué, le rosier porte des roses parfumées !', en: 'Well done, the rose bush carries fragrant roses!', es: '¡Bien hecho, el rosal tiene rosas perfumadas!', nl: 'Goed gedaan, de rozenstruik draagt geurende rozen!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je suis un insecte qui fabrique du miel. Qui suis-je ?', en: 'I am an insect that makes honey. Who am I?', es: 'Soy un insecto que fabrica miel. ¿Quién soy?', nl: 'Ik ben een insect dat honing maakt. Wie ben ik?' },
        options: [
          { fr: 'Une abeille', en: 'A bee', es: 'Una abeja', nl: 'Een bij' },
          { fr: 'Une fourmi', en: 'An ant', es: 'Una hormiga', nl: 'Een mier' },
          { fr: 'Un grillon', en: 'A cricket', es: 'Un grillo', nl: 'Een krekel' }
        ],
        answer: 0,
        hint: { fr: 'Je danse pour avertir mes amies.', en: 'I dance to warn my friends.', es: 'Bailo para avisar a mis amigas.', nl: 'Ik dans om mijn vriendinnen te waarschuwen.' },
        success: { fr: 'Exact, l’abeille butine les fleurs !', en: 'Exactly, the bee collects nectar from flowers!', es: '¡Exacto, la abeja recoge néctar de las flores!', nl: 'Precies, de bij verzamelt nectar van bloemen!' },
        reward: { stars: 7, coins: 5 }
      }
    ]
  },
  {
    level: 7,
    theme: { fr: 'Voyage en ville', en: 'City trip', es: 'Viaje en la ciudad', nl: 'Stadstocht' },
    completionMessage: { fr: 'Tu as visité chaque coin de la ville !', en: 'You visited every corner of the city!', es: '¡Visitaste cada rincón de la ciudad!', nl: 'Je hebt elk hoekje van de stad bezocht!' },
    questions: [
      {
        prompt: { fr: 'Je transporte de nombreux passagers sur des rails. Qui suis-je ?', en: 'I carry many passengers on rails. Who am I?', es: 'Transporto a muchos pasajeros en rieles. ¿Quién soy?', nl: 'Ik vervoer veel passagiers op rails. Wie ben ik?' },
        options: [
          { fr: 'Un tramway', en: 'A tram', es: 'Un tranvía', nl: 'Een tram' },
          { fr: 'Un bus', en: 'A bus', es: 'Un autobús', nl: 'Een bus' },
          { fr: 'Un taxi', en: 'A taxi', es: 'Un taxi', nl: 'Een taxi' }
        ],
        answer: 0,
        hint: { fr: 'Je fais ding ding en tournant.', en: 'I go ding ding when turning.', es: 'Hago ding ding al girar.', nl: 'Ik doe ding ding als ik draai.' },
        success: { fr: 'Bravo, le tramway glisse dans les rues !', en: 'Bravo, the tram glides through the streets!', es: '¡Bravo, el tranvía se desliza por las calles!', nl: 'Bravo, de tram glijdt door de straten!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je distribue des lettres et des colis. Qui suis-je ?', en: 'I deliver letters and packages. Who am I?', es: 'Reparto cartas y paquetes. ¿Quién soy?', nl: 'Ik bezorg brieven en pakketjes. Wie ben ik?' },
        options: [
          { fr: 'Le facteur', en: 'A mail carrier', es: 'El cartero', nl: 'De postbode' },
          { fr: 'Le pompier', en: 'A firefighter', es: 'El bombero', nl: 'De brandweerman' },
          { fr: 'Le jardinier', en: 'A gardener', es: 'El jardinero', nl: 'De tuinier' }
        ],
        answer: 0,
        hint: { fr: 'Je roule avec une sacoche.', en: 'I ride with a satchel.', es: 'Voy con una cartera.', nl: 'Ik rijd rond met een tas.' },
        success: { fr: 'Exact, le facteur apporte des nouvelles !', en: 'Exactly, the mail carrier brings news!', es: '¡Exacto, el cartero trae noticias!', nl: 'Precies, de postbode brengt nieuws!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je vends du pain croustillant très tôt le matin. Qui suis-je ?', en: 'I sell crunchy bread very early in the morning. Who am I?', es: 'Vendo pan crujiente muy temprano en la mañana. ¿Quién soy?', nl: 'Ik verkoop knapperig brood heel vroeg in de ochtend. Wie ben ik?' },
        options: [
          { fr: 'La boulangerie', en: 'The bakery', es: 'La panadería', nl: 'De bakkerij' },
          { fr: 'La banque', en: 'The bank', es: 'El banco', nl: 'De bank' },
          { fr: 'La pharmacie', en: 'The pharmacy', es: 'La farmacia', nl: 'De apotheek' }
        ],
        answer: 0,
        hint: { fr: 'Ça sent bon devant ma vitrine.', en: 'It smells good in front of my window.', es: 'Huele rico frente a mi escaparate.', nl: 'Het ruikt lekker voor mijn etalage.' },
        success: { fr: 'Miam, la boulangerie régale la ville !', en: 'Yum, the bakery delights the city!', es: '¡Mmm, la panadería deleita a la ciudad!', nl: 'Jammie, de bakkerij verwent de stad!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: "Je conduis les gens d'un endroit à un autre sur la route. Qui suis-je ?", en: 'I drive people from one place to another on the road. Who am I?', es: 'Llevo a la gente de un lugar a otro por la carretera. ¿Quién soy?', nl: 'Ik rijd mensen van de ene plek naar de andere. Wie ben ik?' },
        options: [
          { fr: 'Un bus', en: 'A bus', es: 'Un autobús', nl: 'Een bus' },
          { fr: 'Un train', en: 'A train', es: 'Un tren', nl: 'Een trein' },
          { fr: 'Un avion', en: 'A plane', es: 'Un avión', nl: 'Een vliegtuig' }
        ],
        answer: 0,
        hint: { fr: 'Je m’arrête à plusieurs stations.', en: 'I stop at several stations.', es: 'Me detengo en varias paradas.', nl: 'Ik stop bij meerdere haltes.' },
        success: { fr: 'Bien vu, le bus relie les quartiers !', en: 'Well spotted, the bus connects neighborhoods!', es: '¡Bien visto, el autobús conecta los barrios!', nl: 'Goed gezien, de bus verbindt de wijken!' },
        reward: { stars: 7, coins: 5 }
      }
    ]
  },
  {
    level: 8,
    theme: { fr: 'Instruments et sons', en: 'Instruments and sounds', es: 'Instrumentos y sonidos', nl: 'Instrumenten en klanken' },
    completionMessage: { fr: 'Tu as maîtrisé la musique des instruments magiques !', en: 'You mastered the music of the magic instruments!', es: '¡Dominaste la música de los instrumentos mágicos!', nl: 'Je beheerst de muziek van de magische instrumenten!' },
    questions: [
      {
        prompt: { fr: 'Je suis petit, je fais ding ding et j’aide à garder le rythme. Qui suis-je ?', en: 'I am small, I go ding ding and I keep the rhythm. Who am I?', es: 'Soy pequeño, hago ding ding y mantengo el ritmo. ¿Quién soy?', nl: 'Ik ben klein, ik doe ding ding en ik houd het ritme. Wie ben ik?' },
        options: [
          { fr: 'Un triangle', en: 'A triangle', es: 'Un triángulo', nl: 'Een triangel' },
          { fr: 'Un piano', en: 'A piano', es: 'Un piano', nl: 'Een piano' },
          { fr: 'Une flûte', en: 'A flute', es: 'Una flauta', nl: 'Een fluit' }
        ],
        answer: 0,
        hint: { fr: 'On me frappe avec une baguette.', en: 'You hit me with a beater.', es: 'Me golpean con una baqueta.', nl: 'Je slaat me met een stokje.' },
        success: { fr: 'Bravo, le triangle tinte joyeusement !', en: 'Bravo, the triangle rings happily!', es: '¡Bravo, el triángulo suena alegre!', nl: 'Bravo, de triangel klinkt vrolijk!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je possède des cordes et je se joue avec un archet. Qui suis-je ?', en: 'I have strings and I am played with a bow. Who am I?', es: 'Tengo cuerdas y se toca con un arco. ¿Quién soy?', nl: 'Ik heb snaren en ik wordt gespeeld met een strijkstok. Wie ben ik?' },
        options: [
          { fr: 'Un violon', en: 'A violin', es: 'Un violín', nl: 'Een viool' },
          { fr: 'Une guitare', en: 'A guitar', es: 'Una guitarra', nl: 'Een gitaar' },
          { fr: 'Une harpe', en: 'A harp', es: 'Una arpa', nl: 'Een harp' }
        ],
        answer: 0,
        hint: { fr: 'Je chante sous le menton.', en: 'I sing under your chin.', es: 'Canto bajo la barbilla.', nl: 'Ik zing onder je kin.' },
        success: { fr: 'Exact, le violon chante dans l’orchestre !', en: 'Exactly, the violin sings in the orchestra!', es: '¡Exacto, el violín canta en la orquesta!', nl: 'Precies, de viool zingt in het orkest!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je suis un clavier noir et blanc que l’on touche avec les doigts. Qui suis-je ?', en: 'I am a black and white keyboard played with fingers. Who am I?', es: 'Soy un teclado blanco y negro que se toca con los dedos. ¿Quién soy?', nl: 'Ik ben een zwart-wit toetsenbord dat je met je vingers bespeelt. Wie ben ik?' },
        options: [
          { fr: 'Un piano', en: 'A piano', es: 'Un piano', nl: 'Een piano' },
          { fr: 'Un accordéon', en: 'An accordion', es: 'Un acordeón', nl: 'Een accordeon' },
          { fr: 'Un orgue', en: 'An organ', es: 'Un órgano', nl: 'Een orgel' }
        ],
        answer: 0,
        hint: { fr: 'Je peux être droit ou à queue.', en: 'I can be upright or grand.', es: 'Puedo ser vertical o de cola.', nl: 'Ik kan rechtop of vleugel zijn.' },
        success: { fr: 'Oui, le piano remplit la salle de musique !', en: 'Yes, the piano fills the music room!', es: '¡Sí, el piano llena la sala de música!', nl: 'Ja, de piano vult het muzieklokaal!' },
        reward: { stars: 7, coins: 5 }
      },
      {
        prompt: { fr: 'Je suis un instrument à vent doré qui brille. Qui suis-je ?', en: 'I am a shiny golden wind instrument. Who am I?', es: 'Soy un instrumento de viento dorado y brillante. ¿Quién soy?', nl: 'Ik ben een glanzend gouden blaasinstrument. Wie ben ik?' },
        options: [
          { fr: 'Une trompette', en: 'A trumpet', es: 'Una trompeta', nl: 'Een trompet' },
          { fr: 'Un harmonica', en: 'A harmonica', es: 'Una armónica', nl: 'Een mondharmonica' },
          { fr: 'Une clarinette', en: 'A clarinet', es: 'Un clarinete', nl: 'Een klarinet' }
        ],
        answer: 0,
        hint: { fr: 'Je fais un son clair et puissant.', en: 'I make a clear, powerful sound.', es: 'Hago un sonido claro y potente.', nl: 'Ik maak een helder, krachtig geluid.' },
        success: { fr: 'Bien joué, la trompette réveille tout le monde !', en: 'Well done, the trumpet wakes everyone!', es: '¡Bien hecho, la trompeta despierta a todos!', nl: 'Goed gedaan, de trompet wekt iedereen!' },
        reward: { stars: 7, coins: 5 }
      }
    ]
  },
  {
    level: 9,
    theme: { fr: 'Métiers de rêve', en: 'Dream jobs', es: 'Profesiones soñadas', nl: 'Droomberoepen' },
    completionMessage: { fr: 'Tu as rencontré tous les métiers de rêve !', en: 'You met all the dream jobs!', es: '¡Conociste todas las profesiones soñadas!', nl: 'Je hebt alle droomberoepen ontmoet!' },
    questions: [
      {
        prompt: { fr: 'Je soigne les animaux malades et je les rassure. Qui suis-je ?', en: 'I treat sick animals and reassure them. Who am I?', es: 'Cuido animales enfermos y los tranquilizo. ¿Quién soy?', nl: 'Ik verzorg zieke dieren en stel ze gerust. Wie ben ik?' },
        options: [
          { fr: 'Un vétérinaire', en: 'A veterinarian', es: 'Un veterinario', nl: 'Een dierenarts' },
          { fr: 'Un pilote', en: 'A pilot', es: 'Un piloto', nl: 'Een piloot' },
          { fr: 'Un jardinier', en: 'A gardener', es: 'Un jardinero', nl: 'Een tuinier' }
        ],
        answer: 0,
        hint: { fr: 'Je porte parfois une blouse blanche.', en: 'I sometimes wear a white coat.', es: 'A veces uso bata blanca.', nl: 'Ik draag soms een witte jas.' },
        success: { fr: 'Bravo, le vétérinaire protège nos compagnons !', en: 'Bravo, the veterinarian protects our companions!', es: '¡Bravo, el veterinario protege a nuestros compañeros!', nl: 'Bravo, de dierenarts beschermt onze vriendjes!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je dessine des plans et je construis des maisons. Qui suis-je ?', en: 'I draw plans and build houses. Who am I?', es: 'Diseño planos y construyo casas. ¿Quién soy?', nl: 'Ik teken plannen en bouw huizen. Wie ben ik?' },
        options: [
          { fr: 'Un architecte', en: 'An architect', es: 'Un arquitecto', nl: 'Een architect' },
          { fr: 'Un boulanger', en: 'A baker', es: 'Un panadero', nl: 'Een bakker' },
          { fr: 'Un musicien', en: 'A musician', es: 'Un músico', nl: 'Een musicus' }
        ],
        answer: 0,
        hint: { fr: 'Je travaille avec des maquettes.', en: 'I work with models.', es: 'Trabajo con maquetas.', nl: 'Ik werk met maquettes.' },
        success: { fr: 'Exact, l’architecte imagine la ville de demain !', en: 'Exactly, the architect imagines tomorrow’s city!', es: '¡Exacto, el arquitecto imagina la ciudad del mañana!', nl: 'Precies, de architect bedenkt de stad van morgen!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je plante, j’arrose et je fais pousser des légumes. Qui suis-je ?', en: 'I plant, water, and grow vegetables. Who am I?', es: 'Planto, riego y hago crecer verduras. ¿Quién soy?', nl: 'Ik plant, geef water en laat groenten groeien. Wie ben ik?' },
        options: [
          { fr: 'Un maraîcher', en: 'A market gardener', es: 'Un agricultor', nl: 'Een groenteteler' },
          { fr: 'Un médecin', en: 'A doctor', es: 'Un médico', nl: 'Een dokter' },
          { fr: 'Un pilote', en: 'A pilot', es: 'Un piloto', nl: 'Een piloot' }
        ],
        answer: 0,
        hint: { fr: 'Je travaille dans les champs ou les serres.', en: 'I work in fields or greenhouses.', es: 'Trabajo en campos o invernaderos.', nl: 'Ik werk in velden of kassen.' },
        success: { fr: 'Oui, le maraîcher cultive les saveurs !', en: 'Yes, the market gardener grows flavors!', es: '¡Sí, el agricultor cultiva sabores!', nl: 'Ja, de groenteteler kweekt smaken!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je pilote une fusée et j’observe la Terre. Qui suis-je ?', en: 'I pilot a rocket and observe Earth. Who am I?', es: 'Piloto un cohete y observo la Tierra. ¿Quién soy?', nl: 'Ik bestuur een raket en bekijk de aarde. Wie ben ik?' },
        options: [
          { fr: 'Un astronaute', en: 'An astronaut', es: 'Un astronauta', nl: 'Een astronaut' },
          { fr: 'Un marin', en: 'A sailor', es: 'Un marinero', nl: 'Een zeeman' },
          { fr: 'Un explorateur', en: 'An explorer', es: 'Un explorador', nl: 'Een ontdekkingsreiziger' }
        ],
        answer: 0,
        hint: { fr: 'Je flotte sans gravité.', en: 'I float without gravity.', es: 'Floto sin gravedad.', nl: 'Ik zweef zonder zwaartekracht.' },
        success: { fr: 'Quel voyage, l’astronaute voltige dans l’espace !', en: 'What a trip, the astronaut floats in space!', es: '¡Qué viaje, el astronauta flota en el espacio!', nl: 'Wat een reis, de astronaut zweeft in de ruimte!' },
        reward: { stars: 8, coins: 6 }
      }
    ]
  },
  {
    level: 10,
    theme: { fr: 'Explorer le temps', en: 'Exploring time', es: 'Explorar el tiempo', nl: 'Tijd ontdekken' },
    completionMessage: { fr: 'Tu as mis de l’ordre dans toutes les heures magiques !', en: 'You put all the magical times in order!', es: '¡Pusiste en orden todas las horas mágicas!', nl: 'Je hebt alle magische momenten op orde gezet!' },
    questions: [
      {
        prompt: { fr: 'Je sonne le matin pour réveiller tout le monde. Qui suis-je ?', en: 'I ring in the morning to wake everyone up. Who am I?', es: 'Sueno por la mañana para despertar a todos. ¿Quién soy?', nl: 'Ik rinkelen in de ochtend om iedereen wakker te maken. Wie ben ik?' },
        options: [
          { fr: 'Un réveil', en: 'An alarm clock', es: 'Un despertador', nl: 'Een wekker' },
          { fr: 'Une brosse', en: 'A brush', es: 'Un cepillo', nl: 'Een borstel' },
          { fr: 'Un parapluie', en: 'An umbrella', es: 'Un paraguas', nl: 'Een paraplu' }
        ],
        answer: 0,
        hint: { fr: 'Je fais dring dring à l’aube.', en: 'I go ring ring at dawn.', es: 'Hago ring ring al amanecer.', nl: 'Ik maak ring ring bij zonsopgang.' },
        success: { fr: 'Bravo, le réveil annonce le départ de la journée !', en: 'Bravo, the alarm clock starts the day!', es: '¡Bravo, el despertador inicia el día!', nl: 'Bravo, de wekker kondigt de dag aan!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je marque le début de la rentrée scolaire. Quel moment suis-je ?', en: 'I mark the start of the school year. What am I?', es: 'Marco el inicio del curso escolar. ¿Qué soy?', nl: 'Ik markeer het begin van het schooljaar. Wat ben ik?' },
        options: [
          { fr: 'Le mois de septembre', en: 'The month of September', es: 'El mes de septiembre', nl: 'De maand september' },
          { fr: 'Le mois de février', en: 'The month of February', es: 'El mes de febrero', nl: 'De maand februari' },
          { fr: 'Le mois de juin', en: 'The month of June', es: 'El mes de junio', nl: 'De maand juni' }
        ],
        answer: 0,
        hint: { fr: 'Les feuilles commencent à jaunir.', en: 'The leaves start to turn yellow.', es: 'Las hojas empiezan a amarillear.', nl: 'De bladeren beginnen geel te worden.' },
        success: { fr: 'Exact, septembre ouvre les cahiers !', en: 'Exactly, September opens the notebooks!', es: '¡Exacto, septiembre abre los cuadernos!', nl: 'Precies, september opent de schriften!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je suis le moment où l’on déjeune à l’école. Qui suis-je ?', en: 'I am the time when we eat lunch at school. Who am I?', es: 'Soy el momento en el que se almuerza en la escuela. ¿Quién soy?', nl: 'Ik ben het moment waarop je op school luncht. Wie ben ik?' },
        options: [
          { fr: 'Le midi', en: 'Noon', es: 'El mediodía', nl: 'De middag' },
          { fr: 'Le matin', en: 'Morning', es: 'La mañana', nl: 'De ochtend' },
          { fr: 'Le soir', en: 'Evening', es: 'La noche', nl: 'De avond' }
        ],
        answer: 0,
        hint: { fr: 'Le soleil est tout en haut.', en: 'The sun is high in the sky.', es: 'El sol está muy alto.', nl: 'De zon staat hoog.' },
        success: { fr: 'Bon appétit, le midi redonne des forces !', en: 'Enjoy, noon gives you energy!', es: '¡Buen provecho, el mediodía devuelve fuerzas!', nl: 'Eet smakelijk, de middag geeft energie!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je représente sept jours de suite. Qui suis-je ?', en: 'I represent seven days in a row. Who am I?', es: 'Represento siete días seguidos. ¿Quién soy?', nl: 'Ik sta voor zeven dagen achter elkaar. Wie ben ik?' },
        options: [
          { fr: 'Une semaine', en: 'A week', es: 'Una semana', nl: 'Een week' },
          { fr: 'Un trimestre', en: 'A term', es: 'Un trimestre', nl: 'Een trimester' },
          { fr: 'Une année', en: 'A year', es: 'Un año', nl: 'Een jaar' }
        ],
        answer: 0,
        hint: { fr: 'Je commence souvent par lundi.', en: 'I often start on Monday.', es: 'A menudo empiezo el lunes.', nl: 'Ik begin vaak op maandag.' },
        success: { fr: 'Parfait, la semaine organise les activités !', en: 'Perfect, the week organizes activities!', es: '¡Perfecto, la semana organiza las actividades!', nl: 'Perfect, de week organiseert activiteiten!' },
        reward: { stars: 8, coins: 6 }
      }
    ]
  },
  {
    level: 11,
    theme: { fr: 'Sciences lumineuses', en: 'Shining sciences', es: 'Ciencias luminosas', nl: 'Lichtende wetenschap' },
    completionMessage: { fr: 'Tu as éclairé tous les secrets scientifiques !', en: 'You lit up all the scientific secrets!', es: '¡Iluminaste todos los secretos científicos!', nl: 'Je hebt alle wetenschappelijke geheimen verlicht!' },
    questions: [
      {
        prompt: { fr: 'Je fais de la lumière avec une pile et une ampoule. Qui suis-je ?', en: 'I make light with a battery and a bulb. Who am I?', es: 'Hago luz con una pila y una bombilla. ¿Quién soy?', nl: 'Ik maak licht met een batterij en een lampje. Wie ben ik?' },
        options: [
          { fr: 'Une lampe de poche', en: 'A flashlight', es: 'Una linterna', nl: 'Een zaklamp' },
          { fr: 'Un microscope', en: 'A microscope', es: 'Un microscopio', nl: 'Een microscoop' },
          { fr: 'Un téléphone', en: 'A phone', es: 'Un teléfono', nl: 'Een telefoon' }
        ],
        answer: 0,
        hint: { fr: 'Je suis utile dans le noir.', en: 'I am useful in the dark.', es: 'Soy útil en la oscuridad.', nl: 'Ik ben handig in het donker.' },
        success: { fr: 'Bravo, la lampe de poche guide le chemin !', en: 'Bravo, the flashlight guides the way!', es: '¡Bravo, la linterna guía el camino!', nl: 'Bravo, de zaklamp wijst de weg!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je fais tourner les aiguilles d’un aimant. Qui suis-je ?', en: 'I make the needle of a magnet turn. Who am I?', es: 'Hago girar la aguja de un imán. ¿Quién soy?', nl: 'Ik laat de naald van een magneet draaien. Wie ben ik?' },
        options: [
          { fr: 'Une boussole', en: 'A compass', es: 'Una brújula', nl: 'Een kompas' },
          { fr: 'Un ventilateur', en: 'A fan', es: 'Un ventilador', nl: 'Een ventilator' },
          { fr: 'Un casque', en: 'A headset', es: 'Un casco', nl: 'Een headset' }
        ],
        answer: 0,
        hint: { fr: 'Je montre le nord.', en: 'I show north.', es: 'Muestro el norte.', nl: 'Ik wijs het noorden aan.' },
        success: { fr: 'Exact, la boussole indique la direction !', en: 'Exactly, the compass shows direction!', es: '¡Exacto, la brújula indica la dirección!', nl: 'Precies, het kompas wijst de richting!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je mesure la température. Qui suis-je ?', en: 'I measure temperature. Who am I?', es: 'Mido la temperatura. ¿Quién soy?', nl: 'Ik meet de temperatuur. Wie ben ik?' },
        options: [
          { fr: 'Un thermomètre', en: 'A thermometer', es: 'Un termómetro', nl: 'Een thermometer' },
          { fr: 'Un voltmètre', en: 'A voltmeter', es: 'Un voltímetro', nl: 'Een voltmeter' },
          { fr: 'Un télémètre', en: 'A rangefinder', es: 'Un telémetro', nl: 'Een afstandsmeter' }
        ],
        answer: 0,
        hint: { fr: 'Je peux afficher des degrés.', en: 'I can show degrees.', es: 'Puedo mostrar grados.', nl: 'Ik kan graden tonen.' },
        success: { fr: 'Bien vu, le thermomètre surveille la chaleur !', en: 'Well spotted, the thermometer watches the heat!', es: '¡Bien visto, el termómetro vigila el calor!', nl: 'Goed gezien, de thermometer bewaakt de warmte!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je rapproche les choses lointaines avec deux lentilles. Qui suis-je ?', en: 'I bring far things closer with two lenses. Who am I?', es: 'Acerco las cosas lejanas con dos lentes. ¿Quién soy?', nl: 'Ik haal verre dingen dichterbij met twee lenzen. Wie ben ik?' },
        options: [
          { fr: 'Des jumelles', en: 'Binoculars', es: 'Unos binoculares', nl: 'Een verrekijker' },
          { fr: 'Des lunettes', en: 'Glasses', es: 'Unas gafas', nl: 'Een bril' },
          { fr: 'Un périscope', en: 'A periscope', es: 'Un periscopio', nl: 'Een periscoop' }
        ],
        answer: 0,
        hint: { fr: 'On me porte devant les yeux.', en: 'You hold me in front of your eyes.', es: 'Me pones frente a los ojos.', nl: 'Je houdt me voor je ogen.' },
        success: { fr: 'Oui, les jumelles agrandissent le paysage !', en: 'Yes, binoculars enlarge the view!', es: '¡Sí, los binoculares agrandan el paisaje!', nl: 'Ja, de verrekijker maakt het uitzicht groter!' },
        reward: { stars: 8, coins: 6 }
      }
    ]
  },
  {
    level: 12,
    theme: { fr: 'Aventures spatiales', en: 'Space adventures', es: 'Aventuras espaciales', nl: 'Ruimteavonturen' },
    completionMessage: { fr: 'Tu as voyagé jusqu’aux étoiles !', en: 'You traveled all the way to the stars!', es: '¡Viajaste hasta las estrellas!', nl: 'Je bent helemaal tot de sterren gereisd!' },
    questions: [
      {
        prompt: { fr: 'Je suis un satellite naturel qui brille la nuit. Qui suis-je ?', en: 'I am a natural satellite that shines at night. Who am I?', es: 'Soy un satélite natural que brilla de noche. ¿Quién soy?', nl: 'Ik ben een natuurlijke satelliet die ’s nachts schijnt. Wie ben ik?' },
        options: [
          { fr: 'La lune', en: 'The moon', es: 'La luna', nl: 'De maan' },
          { fr: 'Mars', en: 'Mars', es: 'Marte', nl: 'Mars' },
          { fr: 'Vénus', en: 'Venus', es: 'Venus', nl: 'Venus' }
        ],
        answer: 0,
        hint: { fr: 'Je change de forme chaque semaine.', en: 'I change shape each week.', es: 'Cambio de forma cada semana.', nl: 'Ik verander elke week van vorm.' },
        success: { fr: 'Bravo, la lune veille sur la Terre !', en: 'Bravo, the moon watches over Earth!', es: '¡Bravo, la luna cuida la Tierra!', nl: 'Bravo, de maan waakt over de aarde!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je suis une étoile qui chauffe toutes les planètes. Qui suis-je ?', en: 'I am a star that warms all the planets. Who am I?', es: 'Soy una estrella que calienta todos los planetas. ¿Quién soy?', nl: 'Ik ben een ster die alle planeten verwarmt. Wie ben ik?' },
        options: [
          { fr: 'Le soleil', en: 'The sun', es: 'El sol', nl: 'De zon' },
          { fr: 'Jupiter', en: 'Jupiter', es: 'Júpiter', nl: 'Jupiter' },
          { fr: 'Saturne', en: 'Saturn', es: 'Saturno', nl: 'Saturnus' }
        ],
        answer: 0,
        hint: { fr: 'Je suis au centre du système solaire.', en: 'I am at the center of the solar system.', es: 'Estoy en el centro del sistema solar.', nl: 'Ik sta in het midden van het zonnestelsel.' },
        success: { fr: 'Exact, le soleil éclaire l’espace !', en: 'Exactly, the sun lights up space!', es: '¡Exacto, el sol ilumina el espacio!', nl: 'Precies, de zon verlicht de ruimte!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je suis une pluie de roches lumineuses dans le ciel. Qui suis-je ?', en: 'I am a rain of glowing rocks in the sky. Who am I?', es: 'Soy una lluvia de rocas luminosas en el cielo. ¿Quién soy?', nl: 'Ik ben een regen van lichtende stenen in de lucht. Wie ben ik?' },
        options: [
          { fr: 'Une météorite', en: 'A meteor', es: 'Un meteorito', nl: 'Een meteoriet' },
          { fr: 'Un nuage', en: 'A cloud', es: 'Una nube', nl: 'Een wolk' },
          { fr: 'Une étoile fixe', en: 'A fixed star', es: 'Una estrella fija', nl: 'Een vaste ster' }
        ],
        answer: 0,
        hint: { fr: 'On me voit lors des nuits d’été.', en: 'You can see me on summer nights.', es: 'Me ven en las noches de verano.', nl: 'Je kunt me zien in zomernachten.' },
        success: { fr: 'Bien joué, la météorite dessine un trait de feu !', en: 'Well done, the meteor draws a trail of fire!', es: '¡Bien hecho, el meteorito dibuja un rastro de fuego!', nl: 'Goed gedaan, de meteoriet tekent een vuurstreep!' },
        reward: { stars: 8, coins: 6 }
      },
      {
        prompt: { fr: 'Je suis la planète rouge que les robots explorent. Qui suis-je ?', en: 'I am the red planet explored by robots. Who am I?', es: 'Soy el planeta rojo que exploran los robots. ¿Quién soy?', nl: 'Ik ben de rode planeet die robots verkennen. Wie ben ik?' },
        options: [
          { fr: 'Mars', en: 'Mars', es: 'Marte', nl: 'Mars' },
          { fr: 'Mercure', en: 'Mercury', es: 'Mercurio', nl: 'Mercurius' },
          { fr: 'Neptune', en: 'Neptune', es: 'Neptuno', nl: 'Neptunus' }
        ],
        answer: 0,
        hint: { fr: 'On y cherche des traces d’eau.', en: 'We look for traces of water there.', es: 'Allí se buscan rastros de agua.', nl: 'Daar zoekt men naar sporen van water.' },
        success: { fr: 'Oui, Mars cache encore des mystères !', en: 'Yes, Mars still hides mysteries!', es: '¡Sí, Marte aún guarda misterios!', nl: 'Ja, Mars verbergt nog mysteries!' },
        reward: { stars: 8, coins: 6 }
      }
    ]
  }
];

if (window.gameData) {
  window.gameData.riddleLevels = window.riddleLevels;
}
