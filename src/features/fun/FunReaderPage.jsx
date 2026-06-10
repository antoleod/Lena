import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FUN_ITEMS, FUN_TYPES } from '../../content/fun/funData.js';
import FunIllustration from './FunIllustration.jsx';
import './fun.css';

/* ── card renderers ─────────────────────────────────────── */

function BlagueCard({ item }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <>
      <div className={`flip-card${revealed ? ' flip-card--revealed' : ''}`}>
        <div className="flip-card__inner">
          <div className="flip-card__front">
            <span style={{ fontSize: '3rem' }}>{item.emoji}</span>
            <p className="flip-card__question">{item.content}</p>
            {!revealed && <span className="flip-card__hint">👆 Appuie pour voir la réponse</span>}
          </div>
          <div className="flip-card__back">
            <span className="flip-card__back-emoji">😂</span>
            <p className="flip-card__answer">{item.answer}</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={`fun-reveal-btn${revealed ? ' fun-reveal-btn--revealed' : ''}`}
        onClick={() => setRevealed(v => !v)}
      >
        {revealed ? '🙈 Cacher la réponse' : '😂 Voir la blague !'}
      </button>
    </>
  );
}

function DevinetteCard({ item }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <>
      <div className={`flip-card${revealed ? ' flip-card--revealed' : ''}`}>
        <div className="flip-card__inner">
          <div className="flip-card__front">
            <span style={{ fontSize: '2.5rem' }}>🤔</span>
            <p className="flip-card__question">{item.content}</p>
            {!revealed && <span className="flip-card__hint">💡 Réfléchis bien, puis appuie !</span>}
          </div>
          <div className="flip-card__back">
            <span className="flip-card__back-emoji">🎉</span>
            <p className="flip-card__answer">{item.answer}</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={`fun-reveal-btn${revealed ? ' fun-reveal-btn--revealed' : ''}`}
        onClick={() => setRevealed(v => !v)}
      >
        {revealed ? '🙈 Cacher la réponse' : '💡 Révéler la réponse'}
      </button>
    </>
  );
}

function ProverbeCard({ item }) {
  return (
    <div className="proverb-card">
      <p className="proverb-content">« {item.content} »</p>
      <p className="proverb-meaning-label">💡 Ce que ça veut dire</p>
      <p className="proverb-meaning">{item.meaning}</p>
    </div>
  );
}

function PoemeCard({ item }) {
  return (
    <div className="poem-card">
      <h2 className="poem-title">{item.emoji} {item.title}</h2>
      <p className="poem-text">{item.content}</p>
      {item.author && <p className="poem-author">— {item.author}</p>}
    </div>
  );
}

function ConteCard({ item }) {
  return (
    <div className="conte-card">
      <h2 className="conte-title">{item.emoji} {item.title}</h2>
      <p className="conte-text">{item.content}</p>
      {item.moral && (
        <div className="conte-moral">
          <p className="conte-moral-label">✨ La morale</p>
          <p className="conte-moral-text">{item.moral}</p>
        </div>
      )}
    </div>
  );
}

function FaitCard({ item }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="fait-card">
      <span className="fait-card__emoji">{item.emoji}</span>
      <p className="fait-card__content">{item.content}</p>
      {item.detail && !revealed && (
        <button type="button" className="fun-reveal-btn" onClick={() => setRevealed(true)}>
          🔬 En savoir plus
        </button>
      )}
      {item.detail && revealed && (
        <p className="fait-card__detail">{item.detail}</p>
      )}
    </div>
  );
}

const RENDERERS = {
  blague:    BlagueCard,
  devinette: DevinetteCard,
  proverbe:  ProverbeCard,
  poeme:     PoemeCard,
  conte:     ConteCard,
  fait:      FaitCard,
};

/* ── main page ──────────────────────────────────────────── */
export default function FunReaderPage() {
  const { type } = useParams();
  const [index, setIndex] = useState(0);

  const typeMeta = FUN_TYPES.find(t => t.id === type);
  const items = FUN_ITEMS.filter(i => i.type === type);
  const current = items[index];

  if (!typeMeta || items.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p>Contenu introuvable.</p>
        <Link to="/fun">← Retour</Link>
      </div>
    );
  }

  const CardRenderer = RENDERERS[type] || BlagueCard;
  const cssVars = { '--card-color': typeMeta.color, '--card-bg': typeMeta.bg };

  function goTo(i) {
    setIndex(Math.max(0, Math.min(items.length - 1, i)));
  }

  return (
    <div className="fun-reader" style={{ ...cssVars, '--reader-bg': typeMeta.bg }}>
      {/* header */}
      <div className="fun-reader-header" style={cssVars}>
        <Link to="/fun" className="fun-reader-back" style={cssVars}>←</Link>
        <h1 className="fun-reader-title" style={{ color: typeMeta.color }}>
          {typeMeta.emoji} {typeMeta.label}
        </h1>
        <span className="fun-reader-count">{index + 1} / {items.length}</span>
      </div>

      {/* progress bar */}
      <div className="fun-progress" style={cssVars}>
        <div className="fun-progress__fill" style={{ width: `${((index + 1) / items.length) * 100}%` }} />
      </div>

      {/* content */}
      <div className="fun-item-wrap">
        {/* illustration */}
        <div className="fun-item-illus" style={cssVars}>
          <FunIllustration type={type} theme={current.theme} size="reader" />
        </div>

        {/* item title (for proverbes/poemes/contes) */}
        {(type === 'blague' || type === 'devinette') && (
          <h2 style={{ textAlign: 'center', fontSize: '1.05rem', fontWeight: 700, color: typeMeta.color, margin: 0 }}>
            {current.title}
          </h2>
        )}

        {/* card content */}
        <CardRenderer key={current.id} item={current} typeMeta={typeMeta} />
      </div>

      {/* navigation */}
      <div className="fun-nav" style={cssVars}>
        <button
          type="button"
          className="fun-nav__btn"
          style={cssVars}
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
        >
          ← Précédent
        </button>

        <div className="fun-nav__dots">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`fun-nav__dot${i === index ? ' fun-nav__dot--active' : ''}`}
              style={i === index ? { background: typeMeta.color } : {}}
              onClick={() => goTo(i)}
              aria-label={`Aller au ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="fun-nav__btn"
          style={cssVars}
          onClick={() => goTo(index + 1)}
          disabled={index === items.length - 1}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
