import { useState } from 'react';
import { PIN_ICONS, PinIcon } from './PinIcons.jsx';
import { PIN_LEN } from './iconPinStore.js';

// ── Code slots (show chosen icons) ─────────────────────────────────────────────
export function IconPinSlots({ pin, shake }) {
  return (
    <div className={`ep-slots${shake ? ' ep-slots--shake' : ''}`}>
      {Array.from({ length: PIN_LEN }, (_, i) => (
        <div key={i} className={`ep-slot${i < pin.length ? ' ep-slot--filled' : ''}`}>
          {pin[i] ? <PinIcon id={pin[i]} /> : null}
        </div>
      ))}
    </div>
  );
}

// ── Icon pad (3D candy keypad) ──────────────────────────────────────────────────
// `onComplete` fires with the 4-icon array. NOTE: this instance keeps its filled
// state after completing — remount it (change `key`) to reset between entries.
export default function IconPinPad({ onComplete, onBack, shake }) {
  const [pin, setPin] = useState([]);

  function tap(id) {
    if (pin.length >= PIN_LEN) return;
    const next = [...pin, id];
    setPin(next);
    if (next.length === PIN_LEN) setTimeout(() => onComplete(next), 180);
  }

  return (
    <div className="ep-pad">
      <IconPinSlots pin={pin} shake={shake} />
      <div className="ep-grid">
        {PIN_ICONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`ep-emoji${pin.includes(id) ? ' ep-emoji--used' : ''}`}
            onClick={() => tap(id)}
            aria-label={`Choisir ${label}`}
          ><PinIcon id={id} /></button>
        ))}
      </div>
      <div className="ep-controls">
        {onBack && (
          <button className="ep-ctrl ep-ctrl--back" onClick={onBack} type="button">← Retour</button>
        )}
        <button
          className="ep-ctrl ep-ctrl--del"
          onClick={() => setPin(p => p.slice(0, -1))}
          disabled={pin.length === 0}
          type="button"
        >⌫</button>
      </div>
    </div>
  );
}
