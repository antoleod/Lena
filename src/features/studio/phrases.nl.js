// Curated Dutch phrases for native speaker recording
// Each phrase: { id, text, fr, category }

export const PHRASE_CATEGORIES = [
  'Salutations',
  'École',
  'Chiffres',
  'Couleurs',
  'Famille',
  'Animaux',
  'Nourriture',
  'Corps',
  'Nature',
  'Temps & jours',
  'Maison',
  'Actions',
  'Émotions',
  'Questions courantes',
];

export const PHRASES = [
  // ── Salutations ──
  { id: 'nl-sal-01', category: 'Salutations', text: 'Goedemorgen!',                     fr: 'Bonjour ! (le matin)' },
  { id: 'nl-sal-02', category: 'Salutations', text: 'Goedemiddag!',                     fr: 'Bonjour ! (l\'après-midi)' },
  { id: 'nl-sal-03', category: 'Salutations', text: 'Goedenavond!',                     fr: 'Bonsoir !' },
  { id: 'nl-sal-04', category: 'Salutations', text: 'Hoe gaat het met jou?',             fr: 'Comment vas-tu ?' },
  { id: 'nl-sal-05', category: 'Salutations', text: 'Het gaat goed, dank je wel.',       fr: 'Ça va bien, merci.' },
  { id: 'nl-sal-06', category: 'Salutations', text: 'Tot ziens!',                        fr: 'Au revoir !' },
  { id: 'nl-sal-07', category: 'Salutations', text: 'Tot morgen!',                       fr: 'À demain !' },
  { id: 'nl-sal-08', category: 'Salutations', text: 'Welkom!',                           fr: 'Bienvenue !' },
  { id: 'nl-sal-09', category: 'Salutations', text: 'Alsjeblieft.',                      fr: 'S\'il te plaît.' },
  { id: 'nl-sal-10', category: 'Salutations', text: 'Dank je wel!',                      fr: 'Merci beaucoup !' },

  // ── École ──
  { id: 'nl-sch-01', category: 'École', text: 'Ik ga naar school.',                      fr: 'Je vais à l\'école.' },
  { id: 'nl-sch-02', category: 'École', text: 'Ik heb mijn tas ingepakt.',               fr: 'J\'ai préparé mon sac.' },
  { id: 'nl-sch-03', category: 'École', text: 'Mag ik naar het toilet?',                 fr: 'Puis-je aller aux toilettes ?' },
  { id: 'nl-sch-04', category: 'École', text: 'Ik begrijp het niet.',                    fr: 'Je ne comprends pas.' },
  { id: 'nl-sch-05', category: 'École', text: 'Kunt u dat herhalen?',                    fr: 'Pouvez-vous répéter ?' },
  { id: 'nl-sch-06', category: 'École', text: 'Ik weet het antwoord!',                   fr: 'Je connais la réponse !' },
  { id: 'nl-sch-07', category: 'École', text: 'We hebben huiswerk.',                     fr: 'Nous avons des devoirs.' },
  { id: 'nl-sch-08', category: 'École', text: 'De juf legt de les uit.',                 fr: 'La maîtresse explique la leçon.' },
  { id: 'nl-sch-09', category: 'École', text: 'Ik lees een boek.',                       fr: 'Je lis un livre.' },
  { id: 'nl-sch-10', category: 'École', text: 'Schrijf je naam op het blad.',            fr: 'Écris ton nom sur la feuille.' },

  // ── Chiffres ──
  { id: 'nl-num-01', category: 'Chiffres', text: 'Één, twee, drie, vier, vijf.',        fr: 'Un, deux, trois, quatre, cinq.' },
  { id: 'nl-num-02', category: 'Chiffres', text: 'Zes, zeven, acht, negen, tien.',      fr: 'Six, sept, huit, neuf, dix.' },
  { id: 'nl-num-03', category: 'Chiffres', text: 'Hoeveel is twee plus drie?',           fr: 'Combien font deux plus trois ?' },
  { id: 'nl-num-04', category: 'Chiffres', text: 'Dat zijn tien appels.',                fr: 'Ce sont dix pommes.' },
  { id: 'nl-num-05', category: 'Chiffres', text: 'Ik ben zeven jaar oud.',               fr: 'J\'ai sept ans.' },

  // ── Couleurs ──
  { id: 'nl-col-01', category: 'Couleurs', text: 'Rood, blauw en geel zijn kleuren.',   fr: 'Le rouge, le bleu et le jaune sont des couleurs.' },
  { id: 'nl-col-02', category: 'Couleurs', text: 'De lucht is blauw.',                   fr: 'Le ciel est bleu.' },
  { id: 'nl-col-03', category: 'Couleurs', text: 'Het gras is groen.',                   fr: 'L\'herbe est verte.' },
  { id: 'nl-col-04', category: 'Couleurs', text: 'De zon is geel.',                      fr: 'Le soleil est jaune.' },
  { id: 'nl-col-05', category: 'Couleurs', text: 'Wat is jouw lievelingskleur?',         fr: 'Quelle est ta couleur préférée ?' },

  // ── Famille ──
  { id: 'nl-fam-01', category: 'Famille', text: 'Dit is mijn moeder.',                   fr: 'Voici ma maman.' },
  { id: 'nl-fam-02', category: 'Famille', text: 'Mijn vader werkt elke dag.',            fr: 'Mon papa travaille chaque jour.' },
  { id: 'nl-fam-03', category: 'Famille', text: 'Ik heb een oudere broer.',              fr: 'J\'ai un grand frère.' },
  { id: 'nl-fam-04', category: 'Famille', text: 'Mijn zus speelt graag piano.',          fr: 'Ma sœur aime jouer du piano.' },
  { id: 'nl-fam-05', category: 'Famille', text: 'Oma bakt heerlijke koekjes.',           fr: 'Grand-mère fait de délicieux biscuits.' },
  { id: 'nl-fam-06', category: 'Famille', text: 'Opa vertelt altijd mooie verhalen.',    fr: 'Grand-père raconte toujours de belles histoires.' },

  // ── Animaux ──
  { id: 'nl-ani-01', category: 'Animaux', text: 'De hond blaft luid.',                   fr: 'Le chien aboie fort.' },
  { id: 'nl-ani-02', category: 'Animaux', text: 'De kat slaapt op de bank.',             fr: 'Le chat dort sur le canapé.' },
  { id: 'nl-ani-03', category: 'Animaux', text: 'De vogel zingt een mooi lied.',         fr: 'L\'oiseau chante une belle chanson.' },
  { id: 'nl-ani-04', category: 'Animaux', text: 'Het paard rent door het veld.',         fr: 'Le cheval court dans le champ.' },
  { id: 'nl-ani-05', category: 'Animaux', text: 'Ik zie een vlinder in de tuin.',        fr: 'Je vois un papillon dans le jardin.' },
  { id: 'nl-ani-06', category: 'Animaux', text: 'De kikker springt in het water.',       fr: 'La grenouille saute dans l\'eau.' },

  // ── Nourriture ──
  { id: 'nl-foo-01', category: 'Nourriture', text: 'Ik lust graag boterhammen.',         fr: 'J\'aime bien les sandwichs.' },
  { id: 'nl-foo-02', category: 'Nourriture', text: 'De appel is zoet en knapperig.',     fr: 'La pomme est sucrée et croquante.' },
  { id: 'nl-foo-03', category: 'Nourriture', text: 'Wil jij melk of water drinken?',     fr: 'Tu veux boire du lait ou de l\'eau ?' },
  { id: 'nl-foo-04', category: 'Nourriture', text: 'Ik heb honger, mag ik iets eten?',   fr: 'J\'ai faim, puis-je manger quelque chose ?' },
  { id: 'nl-foo-05', category: 'Nourriture', text: 'Soep is lekker op een koude dag.',   fr: 'La soupe est bonne par une journée froide.' },

  // ── Corps ──
  { id: 'nl-bod-01', category: 'Corps', text: 'Ik was mijn handen voor het eten.',       fr: 'Je me lave les mains avant de manger.' },
  { id: 'nl-bod-02', category: 'Corps', text: 'Mijn hoofd doet pijn.',                   fr: 'J\'ai mal à la tête.' },
  { id: 'nl-bod-03', category: 'Corps', text: 'Ik poets elke dag mijn tanden.',          fr: 'Je me brosse les dents chaque jour.' },
  { id: 'nl-bod-04', category: 'Corps', text: 'Met mijn ogen kan ik zien.',              fr: 'Avec mes yeux je peux voir.' },
  { id: 'nl-bod-05', category: 'Corps', text: 'Ik heb twee armen en twee benen.',        fr: 'J\'ai deux bras et deux jambes.' },

  // ── Nature ──
  { id: 'nl-nat-01', category: 'Nature', text: 'De zon schijnt vandaag heel erg.',       fr: 'Le soleil brille beaucoup aujourd\'hui.' },
  { id: 'nl-nat-02', category: 'Nature', text: 'Het regent buiten.',                     fr: 'Il pleut dehors.' },
  { id: 'nl-nat-03', category: 'Nature', text: 'De bladeren vallen in de herfst.',       fr: 'Les feuilles tombent en automne.' },
  { id: 'nl-nat-04', category: 'Nature', text: 'In de winter valt er soms sneeuw.',      fr: 'En hiver il neige parfois.' },
  { id: 'nl-nat-05', category: 'Nature', text: 'De bloemen ruiken heerlijk.',            fr: 'Les fleurs sentent très bon.' },

  // ── Temps & jours ──
  { id: 'nl-tim-01', category: 'Temps & jours', text: 'Vandaag is het maandag.',        fr: 'Aujourd\'hui c\'est lundi.' },
  { id: 'nl-tim-02', category: 'Temps & jours', text: 'Morgen is het dinsdag.',         fr: 'Demain c\'est mardi.' },
  { id: 'nl-tim-03', category: 'Temps & jours', text: 'Het is kwart over drie.',         fr: 'Il est trois heures et quart.' },
  { id: 'nl-tim-04', category: 'Temps & jours', text: 'In de zomer zijn de dagen lang.', fr: 'En été les jours sont longs.' },
  { id: 'nl-tim-05', category: 'Temps & jours', text: 'Gisteren was het heel warm.',     fr: 'Hier il faisait très chaud.' },

  // ── Maison ──
  { id: 'nl-hom-01', category: 'Maison', text: 'Ik doe mijn kamer opruimen.',            fr: 'Je range ma chambre.' },
  { id: 'nl-hom-02', category: 'Maison', text: 'De keuken ruikt naar verse soep.',       fr: 'La cuisine sent la soupe fraîche.' },
  { id: 'nl-hom-03', category: 'Maison', text: 'Ik slaap in mijn eigen bed.',            fr: 'Je dors dans mon propre lit.' },
  { id: 'nl-hom-04', category: 'Maison', text: 'We eten samen aan tafel.',               fr: 'Nous mangeons ensemble à table.' },
  { id: 'nl-hom-05', category: 'Maison', text: 'Na het eten doe ik de afwas.',           fr: 'Après le repas je fais la vaisselle.' },

  // ── Actions ──
  { id: 'nl-act-01', category: 'Actions', text: 'Ik speel buiten met mijn vrienden.',    fr: 'Je joue dehors avec mes amis.' },
  { id: 'nl-act-02', category: 'Actions', text: 'Ik leer iedere dag nieuwe woorden.',    fr: 'J\'apprends chaque jour de nouveaux mots.' },
  { id: 'nl-act-03', category: 'Actions', text: 'Ze zingt een liedje voor de klas.',     fr: 'Elle chante une chanson devant la classe.' },
  { id: 'nl-act-04', category: 'Actions', text: 'Hij tekent een mooie regenboog.',       fr: 'Il dessine un beau arc-en-ciel.' },
  { id: 'nl-act-05', category: 'Actions', text: 'We lopen naar het park.',               fr: 'Nous marchons vers le parc.' },

  // ── Émotions ──
  { id: 'nl-emo-01', category: 'Émotions', text: 'Ik ben heel blij vandaag!',            fr: 'Je suis très content(e) aujourd\'hui !' },
  { id: 'nl-emo-02', category: 'Émotions', text: 'Ik voel me een beetje verdrietig.',    fr: 'Je me sens un peu triste.' },
  { id: 'nl-emo-03', category: 'Émotions', text: 'Ik ben bang voor onweer.',             fr: 'J\'ai peur des orages.' },
  { id: 'nl-emo-04', category: 'Émotions', text: 'Ik ben trots op mezelf!',              fr: 'Je suis fier/fière de moi !' },
  { id: 'nl-emo-05', category: 'Émotions', text: 'Ik hou heel veel van jou.',            fr: 'Je t\'aime très fort.' },

  // ── Questions courantes ──
  { id: 'nl-q-01', category: 'Questions courantes', text: 'Hoe heet jij?',               fr: 'Comment tu t\'appelles ?' },
  { id: 'nl-q-02', category: 'Questions courantes', text: 'Waar woon jij?',              fr: 'Où habites-tu ?' },
  { id: 'nl-q-03', category: 'Questions courantes', text: 'Wat is je lievelingskleur?',  fr: 'Quelle est ta couleur préférée ?' },
  { id: 'nl-q-04', category: 'Questions courantes', text: 'Hoe laat is het?',            fr: 'Quelle heure est-il ?' },
  { id: 'nl-q-05', category: 'Questions courantes', text: 'Waarom huil je?',             fr: 'Pourquoi pleures-tu ?' },
  { id: 'nl-q-06', category: 'Questions courantes', text: 'Mag ik jou iets vragen?',     fr: 'Puis-je te demander quelque chose ?' },
];

export const PHRASES_BY_CATEGORY = PHRASE_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = PHRASES.filter(p => p.category === cat);
  return acc;
}, {});
