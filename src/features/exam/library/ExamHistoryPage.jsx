import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHistory, clearHistory } from './examHistoryStore.js';

const LEVEL_LABELS = {
  facile: 'Facile',
  moyen: 'Moyen',
  difficile: 'Difficile',
};

function starsFor(pct) {
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

export default function ExamHistoryPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(() => getHistory());
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClear() {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearHistory();
    setEntries([]);
    setConfirmClear(false);
  }

  return (
    <div className="reader-page" style={{ padding: '0 0 40px' }}>
      <div className="reader-header">
        <Link className="exam-back-btn" to="/exam/library" style={{ textDecoration: 'none', fontSize: '1.1rem', color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>←</Link>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>Historique des examens</span>
        <span />
      </div>

      {entries.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '1rem' }}>Aucun examen termine pour l&apos;instant.</p>
        </div>
      ) : (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.map((entry) => {
            const stars = starsFor(entry.pct);
            const scoreColor = entry.pct >= 60 ? '#4ade80' : '#f87171';
            return (
              <div
                key={entry.id}
                style={{
                  background: 'rgba(255,255,255,.07)',
                  borderRadius: 16,
                  padding: '16px',
                  border: '1.5px solid rgba(255,255,255,.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.4rem' }}>{entry.examEmoji || '📝'}</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '.98rem', flex: 1 }}>{entry.examTitle || entry.examId}</span>
                  <span style={{
                    background: 'rgba(99,102,241,.25)',
                    color: '#a5b4fc',
                    borderRadius: 8,
                    padding: '2px 10px',
                    fontSize: '.75rem',
                    fontWeight: 700,
                  }}>
                    {LEVEL_LABELS[entry.levelKey] || entry.levelKey}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ color: scoreColor, fontWeight: 800, fontSize: '1.5rem' }}>
                    {entry.score} / {entry.total}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,.55)', fontSize: '.9rem' }}>
                    {entry.pct}%
                  </span>
                  <span style={{ fontSize: '1.1rem', letterSpacing: 2 }}>
                    {[1, 2, 3].map((i) => (
                      <span key={i} style={{ opacity: i <= stars ? 1 : 0.2 }}>⭐</span>
                    ))}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.78rem' }}>
                    {formatDate(entry.ts)}
                  </span>
                  <button
                    type="button"
                    className="exam-choice"
                    style={{ padding: '6px 14px', fontSize: '.82rem', fontWeight: 700, minWidth: 0 }}
                    onClick={() => navigate(`/exam/library/play?exam=${entry.examId}&level=${entry.levelKey}`)}
                  >
                    ▶ Retenter
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {entries.length > 0 && (
        <div style={{ padding: '8px 16px 0', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="exam-choice"
            style={{
              background: confirmClear ? 'rgba(239,68,68,.25)' : 'rgba(255,255,255,.06)',
              borderColor: confirmClear ? '#ef4444' : 'rgba(255,255,255,.15)',
              color: confirmClear ? '#fca5a5' : 'rgba(255,255,255,.5)',
              fontSize: '.82rem',
              padding: '8px 20px',
            }}
            onClick={handleClear}
          >
            {confirmClear ? 'Confirmer la suppression ?' : 'Effacer l\'historique'}
          </button>
        </div>
      )}
    </div>
  );
}
