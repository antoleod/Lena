import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PHRASES, PHRASE_CATEGORIES, PHRASES_BY_CATEGORY } from './phrases.nl.js';
import { uploadRecording, getAllRecordedIds, deleteRecording } from '../../services/firebase/audioService.js';

const STUDIO_PIN = import.meta.env.VITE_STUDIO_PIN || '0000';

// ── Recording states ──────────────────────────────────────────────────────────
const STATE = { IDLE: 'idle', RECORDING: 'recording', PREVIEW: 'preview', UPLOADING: 'uploading', DONE: 'done' };

// ── Tiny waveform animation ───────────────────────────────────────────────────
function Waveform({ active }) {
  return (
    <div className={`studio-wave${active ? ' studio-wave--active' : ''}`} aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => <span key={i} style={{ '--i': i }} />)}
    </div>
  );
}

// ── Audio recorder hook ───────────────────────────────────────────────────────
function useRecorder() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const start = useCallback(async () => {
    chunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current = mr;
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.start();
  }, []);

  const stop = useCallback(() => {
    return new Promise(resolve => {
      const mr = mediaRecorderRef.current;
      if (!mr) return resolve(null);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        streamRef.current?.getTracks().forEach(t => t.stop());
        resolve(blob);
      };
      mr.stop();
    });
  }, []);

  const cancel = useCallback(() => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  return { start, stop, cancel };
}

// ── PIN gate ──────────────────────────────────────────────────────────────────
function PinGate({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === STUDIO_PIN) { onUnlock(); }
    else { setError(true); setPin(''); setTimeout(() => setError(false), 1500); }
  }

  return (
    <div className="studio-pin-gate">
      <div className="studio-pin-card">
        <span className="studio-pin-icon">🎙️</span>
        <h1 className="studio-pin-title">Studio d'enregistrement</h1>
        <p className="studio-pin-sub">Espace réservé aux locuteurs natifs</p>
        <form onSubmit={handleSubmit}>
          <input
            className={`studio-pin-input${error ? ' studio-pin-input--error' : ''}`}
            type="password"
            inputMode="numeric"
            maxLength={8}
            placeholder="Code d'accès"
            value={pin}
            onChange={e => setPin(e.target.value)}
            autoFocus
          />
          {error && <p className="studio-pin-error">Code incorrect</p>}
          <button className="studio-pin-btn" type="submit">Entrer →</button>
        </form>
      </div>
    </div>
  );
}

// ── Recorder panel (for one phrase) ──────────────────────────────────────────
function RecorderPanel({ phrase, existingURL, recordedBy, onClose, onUploaded, onDeleted }) {
  const { start, stop, cancel } = useRecorder();
  const [recState, setRecState] = useState(existingURL ? STATE.DONE : STATE.IDLE);
  const [blob, setBlob] = useState(null);
  const [previewURL, setPreviewURL] = useState(existingURL || null);
  const [countdown, setCountdown] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const audioRef = useRef(null);
  const elapsedRef = useRef(null);

  async function handleRecord() {
    setError('');
    // 3-second countdown
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise(r => setTimeout(r, 1000));
    }
    setCountdown(null);
    setElapsed(0);
    setRecState(STATE.RECORDING);
    elapsedRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    try {
      await start();
    } catch (err) {
      clearInterval(elapsedRef.current);
      setRecState(STATE.IDLE);
      setError('Microphone non disponible. Autorisez l\'accès dans votre navigateur.');
    }
  }

  async function handleStop() {
    clearInterval(elapsedRef.current);
    const recorded = await stop();
    setBlob(recorded);
    const url = URL.createObjectURL(recorded);
    setPreviewURL(url);
    setRecState(STATE.PREVIEW);
  }

  async function handleUpload() {
    if (!blob) return;
    setRecState(STATE.UPLOADING);
    try {
      const url = await uploadRecording(blob, { ...phrase, _duration: elapsed }, recordedBy);
      setPreviewURL(url);
      setRecState(STATE.DONE);
      onUploaded(phrase.id, url);
    } catch (err) {
      setError('Erreur d\'upload. Vérifiez la connexion et les règles Firebase Storage.');
      setRecState(STATE.PREVIEW);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer l'enregistrement de "${phrase.text}" ?`)) return;
    try {
      await deleteRecording(phrase.id);
      setPreviewURL(null);
      setBlob(null);
      setRecState(STATE.IDLE);
      onDeleted(phrase.id);
    } catch {
      setError('Erreur lors de la suppression.');
    }
  }

  function handleReRecord() {
    setBlob(null);
    setPreviewURL(null);
    setRecState(STATE.IDLE);
  }

  return (
    <div className="studio-panel-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="studio-panel">
        <button className="studio-panel__close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="studio-panel__phrase">
          <span className="studio-panel__cat">{phrase.category}</span>
          <p className="studio-panel__nl">{phrase.text}</p>
          <p className="studio-panel__fr">{phrase.fr}</p>
        </div>

        {/* Status */}
        {recState === STATE.DONE && (
          <div className="studio-panel__status studio-panel__status--done">
            ✓ Enregistré
          </div>
        )}

        {/* Waveform */}
        <Waveform active={recState === STATE.RECORDING} />

        {/* Countdown */}
        {countdown !== null && (
          <div className="studio-panel__countdown">{countdown}</div>
        )}

        {/* Elapsed */}
        {recState === STATE.RECORDING && (
          <div className="studio-panel__elapsed">🔴 {elapsed}s en cours…</div>
        )}

        {/* Audio preview */}
        {previewURL && recState !== STATE.RECORDING && (
          <audio
            ref={audioRef}
            className="studio-panel__audio"
            src={previewURL}
            controls
            controlsList="nodownload"
          />
        )}

        {error && <p className="studio-panel__error">{error}</p>}

        {/* Action buttons */}
        <div className="studio-panel__actions">
          {recState === STATE.IDLE && (
            <button className="studio-btn studio-btn--record" onClick={handleRecord}>
              🎙️ Enregistrer
            </button>
          )}
          {recState === STATE.RECORDING && (
            <button className="studio-btn studio-btn--stop" onClick={handleStop}>
              ⏹ Arrêter
            </button>
          )}
          {recState === STATE.PREVIEW && (
            <>
              <button className="studio-btn studio-btn--secondary" onClick={handleReRecord}>
                🔄 Re-enregistrer
              </button>
              <button className="studio-btn studio-btn--upload" onClick={handleUpload}>
                ☁️ Sauvegarder
              </button>
            </>
          )}
          {recState === STATE.UPLOADING && (
            <button className="studio-btn studio-btn--upload" disabled>
              ⏳ Upload…
            </button>
          )}
          {recState === STATE.DONE && (
            <>
              <button className="studio-btn studio-btn--secondary" onClick={handleReRecord}>
                🔄 Re-enregistrer
              </button>
              <button className="studio-btn studio-btn--danger" onClick={handleDelete}>
                🗑 Supprimer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StudioPage() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [recordedMap, setRecordedMap] = useState({});    // phraseId → downloadURL
  const [loading, setLoading] = useState(false);
  const [activePhrase, setActivePhrase] = useState(null);
  const [activeCategory, setActiveCategory] = useState(PHRASE_CATEGORIES[0]);
  const [recordedBy, setRecordedBy] = useState(() => localStorage.getItem('studio:speaker') || '');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!unlocked) return;
    setLoading(true);
    getAllRecordedIds().then(map => { setRecordedMap(map); setLoading(false); }).catch(() => setLoading(false));
  }, [unlocked]);

  function handleSpeakerSave(name) {
    setRecordedBy(name);
    localStorage.setItem('studio:speaker', name);
  }

  const totalPhrases  = PHRASES.length;
  const totalRecorded = Object.keys(recordedMap).length;
  const pct = Math.round(totalRecorded / totalPhrases * 100);

  const filteredPhrases = (PHRASES_BY_CATEGORY[activeCategory] || []).filter(p =>
    !search || p.text.toLowerCase().includes(search.toLowerCase()) || p.fr.toLowerCase().includes(search.toLowerCase())
  );

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="studio-page">

      {/* Header */}
      <div className="studio-header">
        <button className="studio-header__back" onClick={() => navigate(-1)}>← Retour</button>
        <div className="studio-header__center">
          <h1 className="studio-header__title">🎙️ Studio NL</h1>
          <p className="studio-header__prog">{totalRecorded}/{totalPhrases} enregistrées · {pct}%</p>
        </div>
        <div className="studio-header__progress-bar">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Speaker name */}
      <div className="studio-speaker">
        <span className="studio-speaker__label">🎤 Locuteur :</span>
        <input
          className="studio-speaker__input"
          type="text"
          placeholder="Votre prénom / surnom"
          value={recordedBy}
          onChange={e => handleSpeakerSave(e.target.value)}
        />
      </div>

      {/* Search */}
      <div className="studio-search">
        <input
          className="studio-search__input"
          type="search"
          placeholder="🔍 Rechercher une phrase…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category tabs */}
      <div className="studio-cats">
        {PHRASE_CATEGORIES.map(cat => {
          const catPhrases = PHRASES_BY_CATEGORY[cat] || [];
          const catRecorded = catPhrases.filter(p => recordedMap[p.id]).length;
          return (
            <button
              key={cat}
              className={`studio-cat${activeCategory === cat ? ' studio-cat--active' : ''}`}
              onClick={() => { setActiveCategory(cat); setSearch(''); }}
            >
              {cat}
              <span className={`studio-cat__badge${catRecorded === catPhrases.length && catPhrases.length > 0 ? ' studio-cat__badge--full' : ''}`}>
                {catRecorded}/{catPhrases.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phrase list */}
      <div className="studio-list">
        {loading && <p className="studio-loading">Chargement…</p>}
        {!loading && filteredPhrases.map(phrase => {
          const isRecorded = !!recordedMap[phrase.id];
          return (
            <button
              key={phrase.id}
              className={`studio-item${isRecorded ? ' studio-item--recorded' : ''}`}
              onClick={() => setActivePhrase(phrase)}
            >
              <span className="studio-item__status" aria-label={isRecorded ? 'Enregistré' : 'À enregistrer'}>
                {isRecorded ? '✅' : '🎙️'}
              </span>
              <div className="studio-item__text">
                <span className="studio-item__nl">{phrase.text}</span>
                <span className="studio-item__fr">{phrase.fr}</span>
              </div>
              <span className="studio-item__arrow">›</span>
            </button>
          );
        })}
        {!loading && filteredPhrases.length === 0 && (
          <p className="studio-empty">Aucune phrase trouvée.</p>
        )}
      </div>

      {/* Recorder panel */}
      {activePhrase && (
        <RecorderPanel
          phrase={activePhrase}
          existingURL={recordedMap[activePhrase.id] || null}
          recordedBy={recordedBy || 'Locuteur natif'}
          onClose={() => setActivePhrase(null)}
          onUploaded={(id, url) => setRecordedMap(m => ({ ...m, [id]: url }))}
          onDeleted={id => setRecordedMap(m => { const n = { ...m }; delete n[id]; return n; })}
        />
      )}
    </div>
  );
}
