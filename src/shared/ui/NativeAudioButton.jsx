import { useCallback, useRef, useState } from 'react';
import { getRecordingURL } from '../../services/firebase/audioService.js';

const urlCache = {};  // phraseId → URL (session-level cache)

export default function NativeAudioButton({ phraseId, size = 'md' }) {
  const [state, setState] = useState('idle');  // idle | loading | playing | error | missing
  const audioRef = useRef(null);

  const handleClick = useCallback(async () => {
    if (state === 'loading') return;

    // Stop if already playing
    if (state === 'playing') {
      audioRef.current?.pause();
      audioRef.current = null;
      setState('idle');
      return;
    }

    setState('loading');

    try {
      let url = urlCache[phraseId];
      if (!url) {
        url = await getRecordingURL(phraseId);
        if (!url) { setState('missing'); return; }
        urlCache[phraseId] = url;
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      setState('playing');

      audio.onended = () => setState('idle');
      audio.onerror = () => setState('error');
      await audio.play();
    } catch {
      setState('error');
    }
  }, [phraseId, state]);

  const icons = {
    idle:    '🔊',
    loading: '⏳',
    playing: '⏸',
    error:   '⚠️',
    missing: '—',
  };

  if (state === 'missing') return null;

  return (
    <button
      className={`native-audio-btn native-audio-btn--${size} native-audio-btn--${state}`}
      onClick={handleClick}
      aria-label={state === 'playing' ? 'Pause audio' : 'Écouter la prononciation native'}
      title="Prononciation par un locuteur natif"
      type="button"
    >
      {icons[state]}
    </button>
  );
}
