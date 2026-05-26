export const FORBIDDEN_WORDS = ['incorrect', 'faux', 'erreur', 'raté'];

const BANK = Object.freeze({
  success: [
    'Bravo 🌟',
    'Super {prenom} !',
    'Tu progresses 🌱',
    'Bien joue !'
  ],
  retry: [
    'Très bien essayé',
    'On regarde encore ensemble',
    'Tu y es presque',
    'Encore une, en douceur'
  ],
  transition: [
    'On continue ensemble',
    'Encore une, en douceur',
    'Tu es en bonne voie',
    'On passe a l etape suivante'
  ]
});

function removeForbiddenWords(text) {
  // Keep the output safe even if new bank messages are added by mistake.
  return String(text || '').split('').map((ch) => ch).join('')
    .replace(new RegExp(FORBIDDEN_WORDS.join('|'), 'gi'), '');
}

export function encourage({ outcome = 'retry', prenom = '', streak = 0 } = {}) {
  const kind = outcome === 'success' ? 'success' : outcome === 'transition' ? 'transition' : 'retry';
  const list = BANK[kind] || BANK.retry;
  const pick = list[Math.floor(Math.random() * list.length)] || list[0] || '';
  const message = prenom ? pick.replace('{prenom}', prenom) : pick.replace('{prenom}', '');
  return removeForbiddenWords(message).trim() || 'On regarde encore ensemble';
}

