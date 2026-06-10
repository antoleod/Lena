const FUN_ITEMS = [
  { type: 'joke',    fr: "Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tomberaient dans le bateau !" },
  { type: 'joke',    fr: "Qu'est-ce qu'un crocodile qui surveille des enfants ? Un gardi-en !" },
  { type: 'joke',    fr: "Pourquoi les girafes ont-elles un long cou ? Parce que leurs pieds sentent mauvais !" },
  { type: 'joke',    fr: "Comment appelle-t-on un chat tombé dans un pot de peinture ? Un chat-peint !" },
  { type: 'joke',    fr: "Qu'est-ce qu'un canif ? Un petit fien !" },
  { type: 'joke',    fr: "Comment s'appelle le fils de la baleine ? La baleinette !" },
  { type: 'joke',    fr: "Pourquoi les éléphants n'utilisent pas d'ordinateur ? Parce qu'ils ont peur de la souris !" },
  { type: 'joke',    fr: "Quel est le sport préféré des fossiles ? Le dino-rugby !" },
  { type: 'joke',    fr: "Qu'est-ce qu'un vampire qui voyage ? Un comte de fées !" },
  { type: 'joke',    fr: "Pourquoi les sorcières ne portent pas de chapeau en hiver ? Parce qu'elles ont peur que le froid leur gèle le balai !" },

  { type: 'riddle',  fr: "J'ai des dents mais je ne mords pas. Qu'est-ce que je suis ?", answer: "Un peigne !" },
  { type: 'riddle',  fr: "Plus je sèche, plus je mouille. Qu'est-ce que je suis ?", answer: "Une serviette !" },
  { type: 'riddle',  fr: "Je vole sans ailes, je pleure sans yeux. Qu'est-ce que je suis ?", answer: "Un nuage !" },
  { type: 'riddle',  fr: "Plus je grandis, plus je rapetisse. Qu'est-ce que je suis ?", answer: "Une bougie !" },
  { type: 'riddle',  fr: "On me coupe, on me pose, je ne saigne jamais. Qu'est-ce que je suis ?", answer: "Un jeu de cartes !" },
  { type: 'riddle',  fr: "Je cours toujours mais je n'ai pas de jambes. Qu'est-ce que je suis ?", answer: "Une rivière !" },
  { type: 'riddle',  fr: "J'ai un cœur mais jamais de battements. Qu'est-ce que je suis ?", answer: "Un artichaut !" },
  { type: 'riddle',  fr: "Je parle toutes les langues mais ne dis pas un mot. Qu'est-ce que je suis ?", answer: "Un dictionnaire !" },

  // — Animaux —
  { type: 'fact',    fr: "🐙 Les pieuvres ont trois cœurs et du sang bleu !" },
  { type: 'fact',    fr: "🦷 Les dents de requin repoussent toute leur vie — jusqu'à 50 000 dents !" },
  { type: 'fact',    fr: "🐘 Les éléphants sont les seuls animaux qui ne peuvent pas sauter !" },
  { type: 'fact',    fr: "🦋 Les papillons goûtent avec leurs pieds !" },
  { type: 'fact',    fr: "🐝 Une abeille visite 1 500 fleurs pour faire une cuillerée de miel !" },
  { type: 'fact',    fr: "🦒 La langue d'une girafe est violette et mesure 50 cm !" },
  { type: 'fact',    fr: "🐬 Les dauphins dorment avec un œil ouvert !" },
  { type: 'fact',    fr: "🐌 Un escargot peut dormir pendant 3 ans d'affilée !" },
  { type: 'fact',    fr: "🦈 Les requins existent depuis plus longtemps que les arbres — 450 millions d'années !" },
  { type: 'fact',    fr: "🐧 Les manchots se font la cour en offrant un caillou à l'élu de leur cœur !" },
  { type: 'fact',    fr: "🐊 Les crocodiles ne peuvent pas tirer la langue !" },
  { type: 'fact',    fr: "🦜 Les perroquets gris d'Afrique peuvent apprendre plus de 1 000 mots !" },
  { type: 'fact',    fr: "🐘 Les éléphants se souviennent des visages même après 20 ans !" },
  { type: 'fact',    fr: "🐠 Les poissons clowns peuvent changer de sexe au cours de leur vie !" },
  { type: 'fact',    fr: "🦁 Les lions dorment jusqu'à 20 heures par jour !" },
  { type: 'fact',    fr: "🐸 Les grenouilles boivent… avec leur peau !" },
  { type: 'fact',    fr: "🦩 Les flamants roses naissent blancs — c'est la nourriture qui les rend roses !" },
  { type: 'fact',    fr: "🐋 Le cœur d'une baleine bleue est aussi gros qu'une petite voiture !" },
  { type: 'fact',    fr: "🐺 Les loups peuvent sentir une odeur à 3 km de distance !" },
  { type: 'fact',    fr: "🦔 Un hérisson peut faire 10 000 pas en une nuit !" },
  // — Espace & nature —
  { type: 'fact',    fr: "🌙 Sur la Lune, tes empreintes de pas resteront un million d'années !" },
  { type: 'fact',    fr: "🌳 Un arbre peut vivre des milliers d'années — le plus vieux a 5 000 ans !" },
  { type: 'fact',    fr: "☀️ La lumière du Soleil met 8 minutes pour arriver jusqu'à toi !" },
  { type: 'fact',    fr: "🌍 La Terre tourne à 1 670 km/h — même quand tu dors !" },
  { type: 'fact',    fr: "⚡ Un éclair est 5 fois plus chaud que la surface du Soleil !" },
  { type: 'fact',    fr: "🌊 L'océan couvre 71 % de la Terre et on n'en a exploré que 20 % !" },
  { type: 'fact',    fr: "🌋 Il y a plus de 1 500 volcans actifs sur Terre !" },
  { type: 'fact',    fr: "🪐 Saturne est si légère qu'elle flotterait sur l'eau !" },
  { type: 'fact',    fr: "❄️ Chaque flocon de neige est unique — il n'en existe pas deux pareils !" },
  { type: 'fact',    fr: "🍃 Une forêt tropicale produit 28 % de l'oxygène de la Terre !" },
  // — Corps humain —
  { type: 'fact',    fr: "🫀 Ton cœur bat environ 100 000 fois par jour !" },
  { type: 'fact',    fr: "🧠 Ton cerveau génère assez d'électricité pour allumer une petite ampoule !" },
  { type: 'fact',    fr: "😴 Tu passes environ 1/3 de ta vie à dormir !" },
  { type: 'fact',    fr: "👃 Tu peux reconnaître plus de 1 trillion d'odeurs différentes !" },
  { type: 'fact',    fr: "🦴 Tu as 206 os dans le corps — et les bébés en ont 300 à la naissance !" },
  { type: 'fact',    fr: "👁️ Tes yeux peuvent distinguer 10 millions de couleurs différentes !" },
  { type: 'fact',    fr: "😂 Rire 100 fois brûle autant de calories que pédaler 15 minutes !" },
  // — Science & inventions —
  { type: 'fact',    fr: "🍕 La pizza margherita a été inventée en 1889 pour une reine d'Italie !" },
  { type: 'fact',    fr: "🚀 Une fusée doit atteindre 28 000 km/h pour rester en orbite !" },
  { type: 'fact',    fr: "💡 Thomas Edison a fait plus de 1 000 essais avant d'inventer l'ampoule !" },
  { type: 'fact',    fr: "🎮 Le premier jeu vidéo a été inventé en 1958 — c'était une version de ping-pong !" },
  { type: 'fact',    fr: "📱 Il y a plus de téléphones sur Terre que d'êtres humains !" },
  { type: 'fact',    fr: "🌐 Le premier message envoyé sur Internet en 1969 était « lo » — le réseau a planté avant « login » !" },
  { type: 'fact',    fr: "🧲 Si tu coupais un aimant en deux, chaque morceau aurait un pôle nord ET un pôle sud !" },

  // — Motivational —
  { type: 'motivational', fr: "Chaque champion a d'abord été un débutant. Tu es sur la bonne voie ! 🚀" },
  { type: 'motivational', fr: "Les étoiles ne brillent pas sans un peu d'obscurité. Continue ! ⭐" },
  { type: 'motivational', fr: "Ton cerveau vient de grandir un peu. Sérieusement ! 🧠" },
  { type: 'motivational', fr: "Les grandes choses se construisent question par question. 🏗️" },
  { type: 'motivational', fr: "Tu sais des choses aujourd'hui que tu ne savais pas hier. 📚" },
  { type: 'motivational', fr: "Chaque erreur est une leçon déguisée. Tu grandis ! 🌱" },
  { type: 'motivational', fr: "Les super-héros ont aussi appris à lire, à compter et à tomber. 🦸" },
  { type: 'motivational', fr: "Essayer encore c'est déjà gagner la moitié. 💪" },
  { type: 'motivational', fr: "Ton futur toi est fier de l'effort que tu fais maintenant. 🔮" },
  { type: 'motivational', fr: "Même les grands arbres ont commencé par être de petites graines. 🌳" },

  // — Blagues —
  { type: 'joke', fr: "Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tomberaient dans le bateau !" },
  { type: 'joke', fr: "Qu'est-ce qu'un crocodile qui surveille des enfants ? Un gardi-en !" },
  { type: 'joke', fr: "Pourquoi les girafes ont-elles un long cou ? Parce que leurs pieds sentent mauvais !" },
  { type: 'joke', fr: "Comment appelle-t-on un chat tombé dans un pot de peinture ? Un chat-peint !" },
  { type: 'joke', fr: "Qu'est-ce qu'un canif ? Un petit fien !" },
  { type: 'joke', fr: "Comment s'appelle le fils de la baleine ? La baleinette !" },
  { type: 'joke', fr: "Pourquoi les éléphants n'utilisent pas d'ordinateur ? Parce qu'ils ont peur de la souris !" },
  { type: 'joke', fr: "Quel est le sport préféré des fossiles ? Le dino-rugby !" },
  { type: 'joke', fr: "Qu'est-ce qu'un vampire qui voyage ? Un comte de fées !" },
  { type: 'joke', fr: "Qu'est-ce qu'un escargot sur une tortue ? Un snail en turbo !" },
  { type: 'joke', fr: "Pourquoi les fantômes mentent-ils ? Parce qu'on voit à travers eux !" },
  { type: 'joke', fr: "Qu'est-ce qu'un chat qui tombe dans un pot de confiture ? Un miaou-confiture !" },
  { type: 'joke', fr: "Quel est le comble pour un électricien ? De ne pas être au courant !" },
  { type: 'joke', fr: "Qu'est-ce qu'un croissant dans le métro ? Un croissant qui va au boulot !" },
  { type: 'joke', fr: "Pourquoi les plantes ne vont-elles jamais en prison ? Parce qu'elles sont toujours dans le droit chemin (d'eau) !" },

  // — Devinettes —
  { type: 'riddle', fr: "J'ai des dents mais je ne mords pas. Qu'est-ce que je suis ?", answer: "Un peigne !" },
  { type: 'riddle', fr: "Plus je sèche, plus je mouille. Qu'est-ce que je suis ?", answer: "Une serviette !" },
  { type: 'riddle', fr: "Je vole sans ailes, je pleure sans yeux. Qu'est-ce que je suis ?", answer: "Un nuage !" },
  { type: 'riddle', fr: "Plus je grandis, plus je rapetisse. Qu'est-ce que je suis ?", answer: "Une bougie !" },
  { type: 'riddle', fr: "On me coupe, on me pose, je ne saigne jamais. Qu'est-ce que je suis ?", answer: "Un jeu de cartes !" },
  { type: 'riddle', fr: "Je cours toujours mais je n'ai pas de jambes. Qu'est-ce que je suis ?", answer: "Une rivière !" },
  { type: 'riddle', fr: "J'ai un cœur mais jamais de battements. Qu'est-ce que je suis ?", answer: "Un artichaut !" },
  { type: 'riddle', fr: "Je parle toutes les langues mais ne dis pas un mot. Qu'est-ce que je suis ?", answer: "Un dictionnaire !" },
  { type: 'riddle', fr: "Je monte et je descends sans jamais bouger. Qu'est-ce que je suis ?", answer: "Un escalier !" },
  { type: 'riddle', fr: "Plus on m'enlève, plus je suis grand. Qu'est-ce que je suis ?", answer: "Un trou !" },
  { type: 'riddle', fr: "Je suis plein de trous mais je retiens l'eau. Qu'est-ce que je suis ?", answer: "Une éponge !" },
  { type: 'riddle', fr: "Je suis devant toi mais on ne peut pas me voir. Qu'est-ce que je suis ?", answer: "L'avenir !" },
];

const SEEN_KEY = 'lena:fun:seen';

function getSeenIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function markSeen(index) {
  const seen = getSeenIds();
  seen.add(index);
  if (seen.size >= FUN_ITEMS.length) seen.clear();
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen])); } catch {}
}

export function getRandomFunItem() {
  const seen = getSeenIds();
  const unseen = FUN_ITEMS.map((_, i) => i).filter((i) => !seen.has(i));
  const pool = unseen.length > 0 ? unseen : FUN_ITEMS.map((_, i) => i);
  const index = pool[Math.floor(Math.random() * pool.length)];
  markSeen(index);
  return { ...FUN_ITEMS[index], index };
}
