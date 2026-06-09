import './NumPad.css';

/**
 * Child-friendly numeric keypad — replaces the system keyboard for all
 * math/answer inputs across the app.
 *
 * Props:
 *   value         {string}   controlled value (digits typed so far)
 *   onChange      {fn}       called with new string value on each key press
 *   onSubmit      {fn}       called with current value when OK is pressed
 *   placeholder   {string}   shown in display when value is empty
 *   disabled      {boolean}  lock all buttons after answer submitted
 *   allowNegative {boolean}  show ± button (for geometry / signed answers)
 */
export default function NumPad({
  value = '',
  onChange,
  onSubmit,
  placeholder = '?',
  disabled = false,
  allowNegative = false,
}) {
  function press(digit) {
    if (disabled) return;
    if (value === '0') {
      onChange(digit);
    } else if (value.length < 8) {
      onChange(value + digit);
    }
  }

  function del() {
    if (disabled) return;
    onChange(value.slice(0, -1));
  }

  function toggleSign() {
    if (disabled) return;
    if (value.startsWith('-')) onChange(value.slice(1));
    else if (value) onChange('-' + value);
  }

  function submit() {
    if (disabled || !value || value === '-') return;
    onSubmit(value);
  }

  const isEmpty = !value;
  const canSubmit = !disabled && !isEmpty && value !== '-';

  return (
    <div className={`numpad${disabled ? ' numpad--disabled' : ''}`}>
      {/* Value display */}
      <div className={`numpad__display${isEmpty ? ' numpad__display--empty' : ''}`}>
        {isEmpty
          ? <span className="numpad__placeholder">{placeholder}</span>
          : <span className="numpad__value">{value}</span>}
      </div>

      {/* 3 × 3 digit grid: 7 8 9 / 4 5 6 / 1 2 3 */}
      <div className="numpad__grid">
        {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((d) => (
          <button
            key={d}
            type="button"
            className="numpad__btn numpad__btn--digit"
            disabled={disabled}
            onPointerDown={(e) => { e.preventDefault(); press(d); }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Bottom row: [±?] [⌫] [0] [OK] */}
      <div className={`numpad__row${allowNegative ? ' numpad__row--4' : ' numpad__row--3'}`}>
        {allowNegative && (
          <button
            type="button"
            className="numpad__btn numpad__btn--sign"
            disabled={disabled || isEmpty}
            onPointerDown={(e) => { e.preventDefault(); toggleSign(); }}
          >
            ±
          </button>
        )}

        <button
          type="button"
          className="numpad__btn numpad__btn--del"
          disabled={disabled || isEmpty}
          onPointerDown={(e) => { e.preventDefault(); del(); }}
        >
          ⌫
        </button>

        <button
          type="button"
          className="numpad__btn numpad__btn--digit"
          disabled={disabled}
          onPointerDown={(e) => { e.preventDefault(); press('0'); }}
        >
          0
        </button>

        <button
          type="button"
          className={`numpad__btn numpad__btn--ok${!canSubmit ? ' numpad__btn--ok-empty' : ''}`}
          disabled={!canSubmit}
          onPointerDown={(e) => { e.preventDefault(); submit(); }}
        >
          OK →
        </button>
      </div>
    </div>
  );
}
