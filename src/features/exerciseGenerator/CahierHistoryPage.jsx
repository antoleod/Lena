import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSessions } from './exerciseStorage.js';

const SUBJECT_LABELS = {
  math: 'Mathematiques',
  french: 'Francais',
  sciences: 'Sciences',
  histoire: 'Histoire',
};

const SUBJECT_EMOJIS = {
  math: '🔢',
  french: '📖',
  sciences: '🔬',
  histoire: '🏛️',
};

const TYPE_LABELS = {
  additions: 'Additions',
  soustractions: 'Soustractions',
  multiplications: 'Multiplications',
  divisions: 'Divisions',
  problemes: 'Problemes',
  fractions: 'Fractions',
  geometrie: 'Geometrie',
  grammaire: 'Grammaire',
  conjugaison: 'Conjugaison',
  orthographe: 'Orthographe',
  vocabulaire: 'Vocabulaire',
};

const LEVEL_LABELS = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

function starsFor(correct, total) {
  if (!total) return 0;
  const pct = (correct / total) * 100;
  if (pct >= 95) return 3;
  if (pct >= 70) return 2;
  if (pct >= 60) return 1;
  return 0;
}

function formatDate(ts) {
  const d = new Date(ts);
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['janv', 'fevr', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hh}:${mm}`;
}

export default function CahierHistoryPage() {
  const navigate = useNavigate();
  const [sessions] = useState(() => getSessions());
  const [expanded, setExpanded] = useState(null);

  function toggleExpand(id) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <div className="cahier-page" style={{ paddingBottom: 40 }}>
      <div className="cahier-header">
        <Link className="exam-back-btn" to="/cahier" style={{ textDecoration: 'none' }}>←</Link>
        <div>
          <span className="eyebrow">Mon Cahier</span>
          <h1>Historique du Cahier</h1>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '1rem' }}>Aucune session terminee.</p>
        </div>
      ) : (
        <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sessions.map((session) => {
            const pct = session.total > 0 ? Math.round((session.correct / session.total) * 100) : 0;
            const stars = starsFor(session.correct, session.total);
            const scoreColor = pct >= 60 ? '#4ade80' : '#f87171';
            const isOpen = expanded === session.id;

            return (
              <div
                key={session.id}
                style={{
                  background: 'rgba(255,255,255,.07)',
                  borderRadius: 16,
                  border: '1.5px solid rgba(255,255,255,.12)',
                  overflow: 'hidden',
                }}
              >
                {/* Card header — clickable to expand */}
                <button
                  type="button"
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                  onClick={() => toggleExpand(session.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.3rem' }}>{SUBJECT_EMOJIS[session.subject] || '📚'}</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '.95rem', flex: 1 }}>
                      {SUBJECT_LABELS[session.subject] || session.subject}
                    </span>
                    <span style={{
                      background: 'rgba(99,102,241,.2)',
                      color: '#a5b4fc',
                      borderRadius: 8,
                      padding: '2px 8px',
                      fontSize: '.72rem',
                      fontWeight: 700,
                    }}>
                      {TYPE_LABELS[session.type] || session.type}
                    </span>
                    <span style={{
                      background: 'rgba(255,255,255,.08)',
                      color: 'rgba(255,255,255,.5)',
                      borderRadius: 8,
                      padding: '2px 8px',
                      fontSize: '.72rem',
                      fontWeight: 600,
                    }}>
                      {LEVEL_LABELS[session.level] || session.level}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ color: scoreColor, fontWeight: 800, fontSize: '1.4rem' }}>
                      {session.correct} / {session.total}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.88rem' }}>
                      · {pct}%
                    </span>
                    <span style={{ fontSize: '1rem', letterSpacing: 2 }}>
                      {[1, 2, 3].map((i) => (
                        <span key={i} style={{ opacity: i <= stars ? 1 : 0.2 }}>⭐</span>
                      ))}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '.75rem' }}>
                      {formatDate(session.date)}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '.75rem' }}>
                      {isOpen ? '▲ Masquer' : '▼ Details'}
                    </span>
                  </div>
                </button>

                {/* Expanded questions list */}
                {isOpen && Array.isArray(session.exercises) && session.exercises.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {session.exercises.map((ex, idx) => (
                      <div
                        key={ex.id || idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          padding: '6px 0',
                          borderBottom: idx < session.exercises.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '.95rem', flexShrink: 0 }}>{ex.correct ? '✅' : '❌'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '.82rem', margin: '0 0 2px', wordBreak: 'break-word' }}>
                            {ex.question || '—'}
                          </p>
                          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem', margin: 0 }}>
                            Bonne reponse : <strong style={{ color: '#4ade80' }}>{ex.answer}</strong>
                            {!ex.correct && ex.userAnswer && ex.userAnswer !== '—' && (
                              <> · Ta reponse : <strong style={{ color: '#f87171' }}>{ex.userAnswer}</strong></>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Retenter button */}
                <div style={{ padding: '0 14px 14px', paddingTop: isOpen ? 10 : 0 }}>
                  <button
                    type="button"
                    className="cahier-cta"
                    style={{ width: '100%', padding: '10px', fontSize: '.88rem', margin: 0 }}
                    onClick={() => navigate('/cahier', { state: { retake: session } })}
                  >
                    ▶ Retenter
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
