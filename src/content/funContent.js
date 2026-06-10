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

  { type: 'fact',    fr: "🐙 Les pieuvres ont trois cœurs et du sang bleu !" },
  { type: 'fact',    fr: "🦷 Les dents de requin repoussent toute leur vie — jusqu'à 50 000 dents !" },
  { type: 'fact',    fr: "🐘 Les éléphants sont les seuls animaux qui ne peuvent pas sauter !" },
  { type: 'fact',    fr: "🦋 Les papillons goûtent avec leurs pieds !" },
  { type: 'fact',    fr: "🌙 Sur la Lune, tes empreintes de pas resteront un million d'années !" },
  { type: 'fact',    fr: "🐝 Une abeille visite 1 500 fleurs pour faire une cuillerée de miel !" },
  { type: 'fact',    fr: "🦒 La langue d'une girafe est violette et mesure 50 cm !" },
  { type: 'fact',    fr: "🍕 La pizza margherita a été inventée en 1889 pour une reine d'Italie !" },
  { type: 'fact',    fr: "🐬 Les dauphins dorment avec un œil ouvert !" },
  { type: 'fact',    fr: "🌳 Un arbre peut vivre des milliers d'années — le plus vieux a 5 000 ans !" },

  { type: 'motivational', fr: "Chaque champion a d'abord été un débutant. Tu es sur la bonne voie ! 🚀" },
  { type: 'motivational', fr: "Les étoiles ne brillent pas sans un peu d'obscurité. Continue ! ⭐" },
  { type: 'motivational', fr: "Ton cerveau vient de grandir un peu. Sérieusement ! 🧠" },
  { type: 'motivational', fr: "Les grandes choses se construisent question par question. 🏗️" },
  { type: 'motivational', fr: "Tu sais des choses aujourd'hui que tu ne savais pas hier. 📚" },
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
