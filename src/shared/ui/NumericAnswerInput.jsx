import { useEffect, useMemo, useState } from 'react';
import HandwritingPad from '../../features/exerciseGenerator/HandwritingPad.jsx';
import NumPad from './NumPad.jsx';
import './NumericAnswerInput.css';

export function isNumericAnswerValue(value) {
  return /^-?\d+([.,]\d+)?$/.test(String(value ?? '').trim());
}

export function supportsHandwritingValue(value) {
  return /^\d+$/.test(String(value ?? '').trim());
}

export default function NumericAnswerInput({
  value = '',
  onChange,
  onSubmit,
  expectedAnswer = '',
  placeholder = '...',
  disabled = false,
  allowNegative,
  valueLabel = 'Ta réponse',
  readLabel = "J'ai lu",
  handwritingLabel = 'Écrire la réponse',
  keypadLabel = 'Clavier numérique',
  onModeChange,
}) {
  const normalizedExpected = String(expectedAnswer ?? '').trim();
  const canUseHandwriting = useMemo(
    () => supportsHandwritingValue(normalizedExpected),
    [normalizedExpected],
  );
  const [showHandwriting, setShowHandwriting] = useState(false);
  const [recognizedValue, setRecognizedValue] = useState('');

  useEffect(() => {
    setShowHandwriting(false);
    setRecognizedValue('');
  }, [normalizedExpected]);

  useEffect(() => {
    if (!showHandwriting) setRecognizedValue('');
  }, [showHandwriting]);

  function activateNumPad() {
    setShowHandwriting(false);
    setRecognizedValue('');
    onModeChange?.('keyboard');
  }

  function activateHandwriting() {
    if (!canUseHandwriting || disabled) return;
    setShowHandwriting(true);
    onModeChange?.('handwriting');
  }

  function handleRecognized(nextValue) {
    const text = String(nextValue ?? '').trim();
    if (!text) return;
    const currentText = recognizedValue || value;
    const nextText = canUseHandwriting && normalizedExpected.length > 1
      ? `${currentText}${text}`.slice(0, normalizedExpected.length)
      : text;
    setRecognizedValue(nextText);
    onChange?.(nextText);
    onModeChange?.('handwriting');
    if (!canUseHandwriting || nextText.length >= normalizedExpected.length) {
      onSubmit?.(nextText);
    }
  }

  return (
    <div className="numeric-answer-input">
      <div className="test-answer-switcher">
        <div className="test-answer-switcher__header">
          <div className="test-answer-switcher__value">
            <span className="test-answer-switcher__label">{valueLabel}</span>
            <strong>{value || '...'}</strong>
          </div>
          {canUseHandwriting && (
            <button
              type="button"
              className={`test-answer-switcher__tool${showHandwriting ? ' is-active' : ''}`}
              onClick={() => (showHandwriting ? activateNumPad() : activateHandwriting())}
              aria-label={showHandwriting ? keypadLabel : handwritingLabel}
              title={showHandwriting ? keypadLabel : handwritingLabel}
              disabled={disabled}
            >
              {showHandwriting ? '123' : '✏️'}
            </button>
          )}
        </div>

        {!showHandwriting ? (
          <NumPad
            value={value}
            onChange={(next) => {
              onModeChange?.('keyboard');
              onChange?.(next);
            }}
            onSubmit={(next) => {
              onModeChange?.('keyboard');
              onSubmit?.(next);
            }}
            placeholder={placeholder}
            disabled={disabled}
            allowNegative={allowNegative ?? normalizedExpected.startsWith('-')}
          />
        ) : (
          <div className="test-handwriting">
            {recognizedValue && (
              <p className="test-handwriting__value">
                {readLabel} <strong>{recognizedValue}</strong>
              </p>
            )}
            <HandwritingPad
              expectedValue={normalizedExpected}
              onRecognized={handleRecognized}
              onClose={activateNumPad}
              clearOnRecognized={canUseHandwriting && normalizedExpected.length > 1}
            />
            <button type="button" className="cahier-cta cahier-cta--soft handwriting-launch" onClick={activateNumPad}>
              123
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
