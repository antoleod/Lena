/**
 * Child "secret code" storage — a 4-icon PIN built from PinIcons ids.
 *
 * The code is device-local (localStorage, not synced) and hashed from the
 * stable icon ids. `hashPin` MUST stay byte-identical forever: any drift
 * orphans every saved code.
 */

const PIN_KEY = 'lena:icon-pin:v2';   // bumped from emoji codes → resets old PINs
export const PIN_LEN = 4;

// PIN is an array of icon ids; join with a delimiter so ids stay unambiguous.
export function hashPin(pin)  { return btoa(unescape(encodeURIComponent(pin.join('|')))); }
export function savePin(pin)  { localStorage.setItem(PIN_KEY, hashPin(pin)); }
export function loadPin()     { return localStorage.getItem(PIN_KEY) || null; }
export function clearPin()    { localStorage.removeItem(PIN_KEY); }

/** True when `entered` (array of ids) matches the saved code. */
export function verifyPin(entered) {
  const saved = loadPin();
  return saved !== null && hashPin(entered) === saved;
}

/** Is a secret code currently set on this device? */
export function isPinSet() { return loadPin() !== null; }
