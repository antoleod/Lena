const fs = require('fs');
const path = require('path');
const base = 'src/content/exams';

const EMOJI_MAP = {
  // Calcul mental
  'calcul-mental-01': '➕', 'calcul-mental-02': '🔼', 'calcul-mental-03': '➖',
  'calcul-mental-04': '🔽', 'calcul-mental-05': '⚖️', 'calcul-mental-06': '🎯',
  'calcul-mental-07': '🎪', 'calcul-mental-08': '🔮', 'calcul-mental-09': '🕳️',
  'calcul-mental-10': '🎲', 'calcul-mental-11': '🧮', 'calcul-mental-12': '⚡',
  // Tables de multiplication
  'tables-multiplication-01': '2️⃣', 'tables-multiplication-02': '3️⃣',
  'tables-multiplication-03': '4️⃣', 'tables-multiplication-04': '5️⃣',
  'tables-multiplication-05': '6️⃣', 'tables-multiplication-06': '7️⃣',
  'tables-multiplication-07': '8️⃣', 'tables-multiplication-08': '9️⃣',
  'tables-multiplication-09': '🔟', 'tables-multiplication-11': '🎲',
  'tables-multiplication-12': '🎯', 'tables-multiplication-13': '🎪',
  'tables-multiplication-14': '🏆', 'tables-multiplication-15': '⚡',
  'tables-multiplication-16': '💥', 'tables-multiplication-17': '🌟',
  'tables-multiplication-18': '🚀', 'tables-multiplication-19': '🔥',
  'tables-multiplication-20': '💎', 'tables-multiplication-21': '👑',
  // Conjugaison special
  'conjugaison-21': '📜', 'conjugaison-22': '🚀', 'conjugaison-23': '⚡',
  'conjugaison-24': '🌱', 'conjugaison-25': '🌿',
  // Grammaire special
  'grammaire-21': '✅', 'grammaire-22': '❓', 'grammaire-23': '👤',
  'grammaire-24': '📝', 'grammaire-25': '📋',
  // Orthographe special
  'orthographe-21': '🎓', 'orthographe-22': '🔀',
  'orthographe-ecriture-01': '🖊️', 'orthographe-ecriture-02': '🏠',
  'orthographe-ecriture-03': '🔍',
};

const PALETTES = {
  'conjugaison':    ['📖','📕','📗','📘','📙','📒','📓','📔','📃','📄','📑','🗒️','📜','📋','🗂️','📁','🗄️','📂','🗃️','📎'],
  'grammaire':      ['🖊️','✒️','🖋️','📏','🔤','🔡','🔠','💬','🗯️','💭','🗨️','📢','📣','🔔','🎙️','📻','📡','🔉','🔊','📾'],
  'orthographe':    ['✏️','🖊️','📝','✒️','🖋️','📄','📃','📋','📑','📜','🗒️','📓','📔','📒','📕','📗','📘','📙','📚','🗃️'],
  'dictee':         ['🎧','🎤','🎵','🎶','🎼','🔊','📻','🎙️','🎚️','🎛️','🔉','🔈','📢','📣','🔔','🎺','🥁','🎸','🎷','🎻'],
  'vocabulaire':    ['💬','🗯️','💭','🗨️','📖','📕','📗','📘','📙','📒','📓','📔','📃','📄','📑','🔤','🔡','🔠','🔑','🗝️'],
  'logique':        ['🧠','💡','🔮','🎯','🧩','🗝️','🔑','🧲','⚙️','🔧','🛠️','🔩','🔬','🔭','📡','🛸','🚀','⭐','🌟','💫'],
  'fractions':      ['🍕','🍰','🎂','🥧','🍩','🥐','🍞','🥖','🧁','🎃','🍫','🍬','🍭','🍮','🧆','🧇','🫓','🥨','🍪','🍿'],
  'geometrie':      ['🔺','🔻','🔷','🔶','🔹','🔸','⬛','⬜','🟥','🟧','🟨','🟩','🟦','🟪','🟫','🔲','🔳','▪️','▫️','◾'],
  'mesures':        ['📏','⚖️','🌡️','⏱️','⏲️','🕐','📐','🔧','💧','🪣','🧃','🍶','📦','🗜️','🔩','🪛','🔨','🧲','🔬','🪤'],
  'sciences':       ['🔬','🧪','🧫','🧬','⚗️','🌡️','💊','🩺','🦠','🌱','🌿','🍃','🌊','💧','🔥','❄️','🌪️','⚡','☀️','🌙'],
  'decouverte-monde':['🌍','🌎','🌏','🗺️','🧭','⛰️','🏔️','🌋','🏝️','🌊','🏜️','🌲','🌴','🌾','🏕️','🏙️','🌆','🌇','🌉','🌃'],
  'geographie-belgique':['🏙️','⛪','🏰','🗼','🚂','🌊','🌳','🏟️','🎡','🍺','🍫','💎','🌷','🎠','🚗','✈️','⚽','🎭','🎨','🌁'],
  'calendrier-temps':['📅','🗓️','⏰','⏱️','⌚','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','🌅','🌇','🌃'],
};

// Series that have per-exam topics (already OK) — skip auto-assign
const SKIP_CATS = new Set(['problemes-mathematiques','comprehension-lecture','grand-defi']);

let updated = 0;
const cats = fs.readdirSync(base).filter(d => fs.statSync(path.join(base,d)).isDirectory());

for (const cat of cats) {
  if (SKIP_CATS.has(cat)) continue;
  const dir = path.join(base, cat);
  const files = fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort();

  for (const file of files) {
    const fp = path.join(dir, file);
    let raw = fs.readFileSync(fp, 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    let j;
    try { j = JSON.parse(raw); } catch(e) { console.log('PARSE ERROR:', fp, e.message); continue; }

    const id = j.id;
    let newEmoji = EMOJI_MAP[id] || null;

    if (!newEmoji && PALETTES[cat]) {
      const match = id.match(/-(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        const skipNums = Object.keys(EMOJI_MAP)
          .filter(k => k.startsWith(cat + '-'))
          .map(k => parseInt(k.replace(cat + '-', '')))
          .filter(n => !isNaN(n));
        if (!skipNums.includes(num)) {
          newEmoji = PALETTES[cat][(num - 1) % PALETTES[cat].length];
        }
      }
    }

    if (newEmoji && j.emoji !== newEmoji) {
      j.emoji = newEmoji;
      fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
      updated++;
      console.log('OK', id, '->', newEmoji);
    }
  }
}
console.log('\nTotal updated:', updated);
