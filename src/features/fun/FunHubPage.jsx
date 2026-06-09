import { Link } from 'react-router-dom';
import { FUN_TYPES, FUN_ITEMS } from '../../content/fun/funData.js';
import FunIllustration from './FunIllustration.jsx';
import './fun.css';

export default function FunHubPage() {
  return (
    <div className="fun-page">
      {/* Hero */}
      <div className="fun-hero">
        <div className="fun-hero__stars">✨ 😂 🌸 🤔 📜 🎭 ✨</div>
        <h1 className="fun-hero__title">Le Coin Amusant</h1>
        <p className="fun-hero__subtitle">
          Blagues, devinettes, proverbes, poèmes et contes pour rire et réfléchir !
        </p>
      </div>

      {/* Category grid */}
      <div className="fun-grid">
        {FUN_TYPES.map((ft) => {
          const count = FUN_ITEMS.filter(i => i.type === ft.id).length;
          return (
            <Link
              key={ft.id}
              to={`/fun/${ft.id}`}
              className={`fun-card fun-card--${ft.id}`}
              style={{ '--card-gradient': ft.gradient, '--card-color': ft.color, '--card-bg': ft.bg }}
            >
              <div className="fun-card__illus">
                <FunIllustration type={ft.id} size="hub" />
              </div>
              <div className="fun-card__body">
                <span className="fun-card__emoji">{ft.emoji}</span>
                <p className="fun-card__name">{ft.label}</p>
                <p className="fun-card__count">{count} {count === 1 ? 'contenu' : 'contenus'}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
