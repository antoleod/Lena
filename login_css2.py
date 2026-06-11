import pathlib

css = r"""
/* ── Child account creation button ── */
.login-child-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  border-radius: 20px;
  border: 2px solid rgba(251,191,36,0.5);
  background: linear-gradient(135deg, rgba(251,191,36,0.18), rgba(249,115,22,0.15));
  cursor: pointer;
  text-align: left;
  transition: transform 0.12s, box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 4px 20px rgba(251,191,36,0.15);
  -webkit-tap-highlight-color: transparent;
}
.login-child-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(251,191,36,0.8);
  box-shadow: 0 8px 28px rgba(251,191,36,0.25);
}
.login-child-btn:active { transform: scale(0.97); }
.login-child-btn__icon { font-size: 2rem; flex-shrink: 0; }
.login-child-btn__title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2px;
}
.login-child-btn__sub {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
}

/* ── Name input screen ── */
.login-name-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.login-name-input {
  width: 100%;
  padding: 16px 18px;
  border-radius: 18px;
  border: 2px solid rgba(251,191,36,0.5);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, background 0.2s;
  letter-spacing: 0.5px;
}
.login-name-input::placeholder { color: rgba(255,255,255,0.3); font-size: 1rem; font-weight: 400; }
.login-name-input:focus {
  border-color: rgba(251,191,36,0.85);
  background: rgba(251,191,36,0.1);
}
.login-name-emojis {
  display: flex;
  gap: 6px;
  font-size: 1.3rem;
  opacity: 0.6;
}
"""

target = pathlib.Path("src/shared/theme/app.css")
existing = target.read_text(encoding="utf-8")
marker = "/* ── Child account creation button ──"
if marker not in existing:
    target.write_text(existing + "\n" + css, encoding="utf-8")
    print("CSS appended OK")
else:
    print("Already present")
