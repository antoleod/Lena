// Resolves a thematic glyph for a progression-path node so nodes stop looking
// identical. Priority: explicit node kind/type → domain keyword → subject pool
// (deterministic by index). Same domain always resolves to the same glyph.

// Node kind/type (WorldDetailPage missions, module phases) — content-agnostic.
const KIND_GLYPH = {
  boss: '👹',
  exam: '🏆',
  challenge: '⚡',
  miniChallenge: '⚡',
  review: '🔄',
  revision: '🔄',
  reward: '🎁',
  checkpoint: '🚩',
};

// Domain keyword → glyph. First matching keyword (substring, case-insensitive)
// against the node's domainId + domainLabel wins. Order matters: more specific
// keywords first.
const DOMAIN_RULES = [
  // ── Mathematics ──
  [['multiplic', 'table'], '✖️'],
  [['divis'], '➗'],
  [['fraction'], '🍕'],
  [['decimal', 'décim'], '💯'],
  [['addition', 'somme', 'optel'], '➕'],
  [['soustrac', 'subtract', 'aftrek'], '➖'],
  [['geometr', 'géométr', 'forme', 'shape', 'figure'], '📐'],
  [['measur', 'mesure', 'metri', 'grandeur'], '📏'],
  [['mixed', 'operation', 'opération', 'calcul'], '🧮'],
  [['number', 'nombre', 'numera', 'getal', 'chiffre'], '🔢'],
  // ── Languages (fr / nl / en / es) ──
  [['reading', 'lecture', 'lees', 'read', 'leesbegrip', 'comprehens'], '📖'],
  [['grammar', 'grammaire', 'grammat'], '✍️'],
  [['spelling', 'orthograph', 'spell'], '🔡'],
  [['conjug', 'verb', 'verbe', 'werkwoord'], '🔠'],
  [['sentence', 'phrase', 'zin', 'frase'], '📝'],
  [['vocab', 'word', 'woord', 'palabra', 'mot'], '🔤'],
  [['listening', 'écoute', 'luister'], '👂'],
  [['language', 'langue', 'taal', 'idioma'], '💬'],
  [['story', 'conte', 'récit', 'recit', 'verhaal', 'historia'], '📜'],
  // ── Sciences ──
  [['animal', 'dier', 'faune'], '🐾'],
  [['body', 'corps', 'lichaam', 'humain'], '🫀'],
  [['plant', 'plante', 'nature', 'vegetal', 'jardin'], '🌱'],
  [['water', 'eau', 'liquid', 'liquide'], '💧'],
  [['energy', 'énergie', 'force', 'electric'], '⚡'],
  [['space', 'espace', 'planet', 'astro', 'observ'], '🪐'],
  [['volcano', 'volcan', 'earth', 'terre', 'roche'], '🌋'],
  [['experiment', 'labo', 'science', 'état', 'etat', 'matière'], '🔬'],
  // ── Computer science ──
  [['internet', 'réseau', 'reseau', 'network'], '🌐'],
  [['code', 'algorith', 'programm', 'robot'], '🤖'],
  [['file', 'fichier', 'dossier'], '📁'],
  [['computer', 'ordinateur', 'informatique', 'machine'], '💻'],
  // ── History ──
  [['castle', 'château', 'chateau', 'medieval', 'médiéval'], '🏰'],
  [['ship', 'bateau', 'caravelle', 'découverte', 'decouverte', 'voyage'], '⛵'],
  [['map', 'carte', 'géo', 'geo', 'europe'], '🗺️'],
  [['history', 'histoire', 'passé', 'passe', 'forum', 'democra'], '🏛️'],
  // ── Reasoning / logic ──
  [['pattern', 'suite', 'séquence', 'sequence', 'serie', 'série'], '🔢'],
  [['deduc', 'énigme', 'enigme', 'puzzle', 'intrus', 'mystèr'], '🔍'],
  [['logic', 'logique', 'strateg', 'stratég', 'pensée'], '🧩'],
  // ── Finance ──
  [['bank', 'banque'], '🏦'],
  [['shop', 'boutique', 'market', 'marché', 'marche', 'achat'], '🛒'],
  [['coin', 'pièce', 'piece', 'billet', 'money', 'argent', 'finance'], '🪙'],
  // ── Time / measure crossovers ──
  [['time', 'temps', 'heure', 'horloge'], '⏰'],
];

// Subject fallback pools — used when no kind/domain matches. Indexed so that
// consecutive nodes in the same region cycle through distinct glyphs.
const SUBJECT_POOLS = {
  mathematics: ['🔢', '✖️', '➕', '📐', '🧮', '💯', '📊', '🎯'],
  french:      ['📖', '✍️', '🔤', '📝', '📜', '🔠', '💬', '🪶'],
  dutch:       ['🗣️', '📖', '🔤', '📝', '💬', '📚', '🔠', '✍️'],
  english:     ['🌍', '📖', '🔤', '📝', '💬', '📚', '🦜', '✍️'],
  spanish:     ['🌞', '📖', '🔤', '📝', '💬', '📚', '🌺', '✍️'],
  reasoning:   ['🧩', '🔍', '🧠', '♟️', '🔮', '🎲', '🪀', '💡'],
  logique:     ['🧩', '🔍', '🧠', '♟️', '🔮', '🎲', '🪀', '💡'],
  sciences:    ['🔬', '🧪', '🌱', '💧', '⚡', '🦠', '🌋', '🔭'],
  histoire:    ['🏛️', '🗺️', '🏰', '⛵', '📜', '⚔️', '👑', '🗿'],
  finance:     ['💰', '🪙', '💵', '🛒', '🏦', '📊', '💳', '🏪'],
  informatique:['💻', '🌐', '🤖', '📁', '⌨️', '🔌', '📡', '💾'],
  stories:     ['📜', '📖', '🌙', '🧚', '🐉', '🏰', '✨', '📚'],
};

const DEFAULT_POOL = ['📘', '⭐', '🎯', '🎲', '🧭', '🏵️', '🎈', '🔮'];

function matchDomain(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  for (const [keywords, glyph] of DOMAIN_RULES) {
    if (keywords.some((kw) => t.includes(kw))) return glyph;
  }
  return null;
}

/**
 * Resolve the glyph for a path node.
 * @param {object} opts
 * @param {string} [opts.subjectId]  Subject universe id (mathematics, french…).
 * @param {string} [opts.domain]     domainId / domainLabel text to keyword-match.
 * @param {string} [opts.kind]       Explicit node kind/type (boss, exam, challenge…).
 * @param {number} [opts.index]      Position in the path (drives fallback variety).
 */
export function resolveNodeGlyph({ subjectId, domain, kind, index = 0 } = {}) {
  if (kind && KIND_GLYPH[kind]) return KIND_GLYPH[kind];

  const byDomain = matchDomain(domain);
  if (byDomain) return byDomain;

  const pool = SUBJECT_POOLS[subjectId] || DEFAULT_POOL;
  return pool[index % pool.length];
}
