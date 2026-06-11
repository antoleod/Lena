import pathlib

css = r"""
/* ═══════════════════════════════════════════════════════════════
   LOGIN PAGE — child-friendly emoji PIN
   ═══════════════════════════════════════════════════════════════ */

/* Page wrapper */
.login-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a0533 0%, #2d0b5a 40%, #0d1b6e 100%);
  padding: 16px;
  position: relative;
  overflow: hidden;
}

/* Animated blobs */
.login-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.login-bg__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
  animation: blobFloat 8s ease-in-out infinite alternate;
}
.login-bg__blob--1 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #ff6ec7, #a855f7);
  top: -80px; left: -80px;
  animation-delay: 0s;
}
.login-bg__blob--2 {
  width: 250px; height: 250px;
  background: radial-gradient(circle, #38bdf8, #6366f1);
  bottom: -60px; right: -60px;
  animation-delay: 3s;
}
.login-bg__blob--3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, #fbbf24, #f97316);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 6s;
}
@keyframes blobFloat {
  0%   { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.15) translate(20px, 20px); }
}

/* Floating stars */
.login-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.login-star {
  position: absolute;
  width: var(--size, 6px);
  height: var(--size, 6px);
  border-radius: 50%;
  background: #fff;
  opacity: 0.7;
  animation: starTwinkle 2.5s ease-in-out infinite alternate;
  animation-delay: var(--delay, 0s);
}
@keyframes starTwinkle {
  0%   { opacity: 0.2; transform: scale(0.8); }
  100% { opacity: 0.9; transform: scale(1.2); }
}

/* Card */
.login-card {
  position: relative;
  z-index: 1;
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.18);
  border-radius: 28px;
  padding: 32px 28px 28px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
}
.login-card--centered { justify-content: center; min-height: 200px; }

/* Logo / header area */
.login-logo {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.login-logo__icon { font-size: 2.6rem; line-height: 1; }
.login-logo__name {
  font-size: 1.9rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  margin: 0;
  background: linear-gradient(135deg, #fff 30%, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.login-logo__sub {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.55);
  margin: 0;
}
.login-avatar-bubble {
  font-size: 3rem;
  width: 80px; height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #6366f1);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 4px rgba(168,85,247,0.3), 0 4px 16px rgba(0,0,0,0.4);
  margin-bottom: 4px;
}
.login-hello {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-align: center;
}
.login-instruction {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  margin: 0;
  text-align: center;
}

/* Parent label badge */
.login-parent-label {
  background: rgba(251,191,36,0.15);
  border: 1px solid rgba(251,191,36,0.35);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.78rem;
  color: #fbbf24;
  text-align: center;
  width: 100%;
}

/* ── Emoji PIN pad ── */
.ep-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}

/* Slots */
.ep-slots {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.ep-slot {
  width: 58px; height: 58px;
  border-radius: 16px;
  border: 2px dashed rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.7rem;
  transition: transform 0.15s, border-color 0.2s, background 0.2s;
}
.ep-slot--filled {
  border: 2px solid rgba(168,85,247,0.7);
  background: rgba(168,85,247,0.18);
  transform: scale(1.08);
}
.ep-slots--shake {
  animation: slotShake 0.5s ease;
}
@keyframes slotShake {
  0%,100% { transform: translateX(0); }
  20%  { transform: translateX(-8px); }
  40%  { transform: translateX(8px); }
  60%  { transform: translateX(-6px); }
  80%  { transform: translateX(6px); }
}

/* Emoji grid */
.ep-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
}
.ep-emoji {
  aspect-ratio: 1;
  font-size: 1.65rem;
  border: none;
  border-radius: 14px;
  background: rgba(255,255,255,0.1);
  cursor: pointer;
  transition: transform 0.12s, background 0.15s, box-shadow 0.15s;
  display: flex; align-items: center; justify-content: center;
  padding: 0;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
}
.ep-emoji:hover { background: rgba(168,85,247,0.3); transform: scale(1.12); }
.ep-emoji:active { transform: scale(0.92); }
.ep-emoji--used {
  background: rgba(168,85,247,0.45);
  box-shadow: 0 0 0 2px rgba(168,85,247,0.6);
}

/* Controls row */
.ep-controls {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  width: 100%;
}
.ep-ctrl {
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.ep-ctrl--del {
  background: rgba(239,68,68,0.25);
  color: #fca5a5;
  font-size: 1.1rem;
  padding: 8px 14px;
}
.ep-ctrl--del:hover { background: rgba(239,68,68,0.4); }
.ep-ctrl--del:disabled { opacity: 0.3; cursor: not-allowed; }
.ep-ctrl--back {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
}
.ep-ctrl--back:hover { background: rgba(255,255,255,0.2); }

/* ── Auth buttons ── */
.login-google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 13px 20px;
  border-radius: 16px;
  border: 2px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.97);
  color: #1e1e2e;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.2s, background 0.15s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.login-google-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.login-google-btn:active { transform: scale(0.97); }
.login-google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.login-google-icon { width: 22px; height: 22px; flex-shrink: 0; }

.login-email-toggle {
  background: none;
  border: none;
  color: rgba(255,255,255,0.55);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: color 0.15s;
}
.login-email-toggle:hover { color: rgba(255,255,255,0.9); }

.login-divider {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.3);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.login-divider::before, .login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.15);
}

.login-toggle {
  display: flex;
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.15);
  width: 100%;
}
.login-toggle__btn {
  flex: 1;
  padding: 9px 0;
  background: none;
  border: none;
  color: rgba(255,255,255,0.55);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.login-toggle__btn--active {
  background: rgba(168,85,247,0.5);
  color: #fff;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.login-field__input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1.5px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;
}
.login-field__input::placeholder { color: rgba(255,255,255,0.35); }
.login-field__input:focus {
  border-color: rgba(168,85,247,0.7);
  background: rgba(168,85,247,0.12);
}

.login-submit-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%;
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #a855f7, #6366f1);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.12s;
  box-shadow: 0 4px 14px rgba(168,85,247,0.4);
}
.login-submit-btn:hover:not(:disabled) { transform: translateY(-1px); opacity: 0.92; }
.login-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Error message */
.login-error {
  background: rgba(239,68,68,0.2);
  border: 1px solid rgba(239,68,68,0.4);
  border-radius: 12px;
  padding: 8px 14px;
  color: #fca5a5;
  font-size: 0.85rem;
  text-align: center;
  margin: 0;
  width: 100%;
}

/* Guest button */
.login-guest-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: color 0.15s;
  text-align: center;
}
.login-guest-btn:hover { color: rgba(255,255,255,0.75); }

/* Spinner */
.login-spinner {
  display: inline-block;
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
.login-spinner--lg { width: 36px; height: 36px; border-width: 4px; }
@keyframes spin { to { transform: rotate(360deg); } }
"""

target = pathlib.Path("src/shared/theme/app.css")
existing = target.read_text(encoding="utf-8")
marker = "/* ═══════════════════════════════════════════════════════════════\n   LOGIN PAGE — child-friendly emoji PIN"
if marker not in existing:
    target.write_text(existing + "\n" + css, encoding="utf-8")
    print("CSS appended OK")
else:
    print("CSS already present, skipping")
