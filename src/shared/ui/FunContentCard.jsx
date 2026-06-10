import { useState } from 'react';
import { getRandomFunItem } from '../../content/funContent.js';

export default function FunContentCard() {
  const [item] = useState(() => getRandomFunItem());
  const [revealed, setRevealed] = useState(false);

  if (!item) return null;

  const typeLabel = {
    joke: '😂 Blague',
    riddle: '🤔 Devinette',
    fact: '🌍 Le sais-tu ?',
    motivational: '💪 Citation',
  }[item.type] ?? '✨';

  return (
    <div className="fun-card">
      <span className="fun-card__type">{typeLabel}</span>
      <p className="fun-card__text">{item.fr}</p>
      {item.answer && !revealed && (
        <button type="button" className="fun-card__reveal" onClick={() => setRevealed(true)}>
          Voir la réponse 👇
        </button>
      )}
      {item.answer && revealed && (
        <p className="fun-card__answer">👉 {item.answer}</p>
      )}
    </div>
  );
}
