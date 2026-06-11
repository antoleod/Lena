import pathlib, re

css = r"""
/* ═══════════════════════════════════════════════════════════════
   LOGIN — Premium mascot layout overrides (Duolingo-style)
   ═══════════════════════════════════════════════════════════════ */

/* ── Scene wrapper: mascot floats above + overlaps card ── */
.login-scene {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 520px;
  padding: 0 16px;
}

/* ── Mascot hero: real SVG from assets ── */
.login-mascot-hero-wrap {
  position: relative;
  z-index: 3;
  margin-bottom: -90px;
  flex-shrink: 0;
}

.login-mascot-hero {
  width: 210px;
  height: 210px;
  object-fit: contain;
  /* SVG already has float3D animation built in */
  filter:
    drop-shadow(0 0 28px rgba(255, 150, 200, 0.55))
    drop-shadow(0 8px 20px rgba(140, 60, 180, 0.4));
  user-select: none;
  pointer-events: none;
}

.login-mascot-glow {
  position: absolute;
  inset: 20% 10%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255,150,200,0.35) 0%, transparent 70%);
  filter: blur(20px);
  pointer-events: none;
  z-index: -1;
}

/* ── Card: larger, more padding, premium glass ── */
.login-card {
  position: relative;
  z-index: 2;
  width: 100%;
  background: rgba(20, 8, 60, 0.72) !important;
  backdrop-filter: blur(28px) !important;
  -webkit-backdrop-filter: blur(28px) !important;
  border: 1.5px solid rgba(168, 85, 247, 0.35) !important;
  border-radius: 32px !important;
  padding: 36px 32px 32px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.06) inset,
    0 24px 60px rgba(0,0,0,0.55),
    0 0 80px rgba(124,58,237,0.12) !important;
}

/* Welcome card needs extra top padding for mascot overlap */
.login-card--welcome {
  padding-top: 100px !important;
  min-height: 62vh;
}

/* ── Logo: huge, multicolor gradient, glow ── */
.login-logo__name {
  font-size: 3.4rem !important;
  font-weight: 900 !important;
  letter-spacing: -1.5px !important;
  background: linear-gradient(135deg,
    #fff 0%,
    #e0c3fc 20%,
    #22D3EE 45%,
    #FBBF24 70%,
    #fff 100%) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  filter: drop-shadow(0 0 18px rgba(200, 100, 255, 0.6)) !important;
  margin: 0 !important;
  line-height: 1.05 !important;
  text-align: center;
}

.login-logo__tagline {
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  color: rgba(255,255,255,0.88) !important;
  text-align: center;
  line-height: 1.4;
  margin: 0 !important;
  max-width: 320px;
}

/* ── Social proof chips ── */
.login-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.login-stat {
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  white-space: nowrap;
}

/* ── Buttons: bigger, full width, premium ── */
.login-google-btn {
  height: 56px !important;
  border-radius: 28px !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.35) !important;
}

.login-primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  border-radius: 28px;
  border: none;
  background: linear-gradient(135deg, #7C3AED 0%, #2563EB 60%, #22D3EE 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.14s, opacity 0.18s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(124,58,237,0.55), 0 0 0 0 rgba(124,58,237,0);
  letter-spacing: 0.3px;
  -webkit-tap-highlight-color: transparent;
}
.login-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(124,58,237,0.65);
}
.login-primary-btn:active { transform: scale(0.97); }

.login-secondary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 52px;
  border-radius: 26px;
  border: 1.5px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.12s;
  -webkit-tap-highlight-color: transparent;
}
.login-secondary-btn:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.35);
}
.login-secondary-btn:active { transform: scale(0.97); }
.login-secondary-btn--sm { height: 46px; font-size: 0.88rem; }

.login-email-toggle {
  background: none !important;
  border: none !important;
  color: rgba(255,255,255,0.6) !important;
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: color 0.15s;
  text-align: center;
}
.login-email-toggle:hover { color: rgba(255,255,255,0.9) !important; }

/* ── Safety tag ── */
.login-safety {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.38);
  text-align: center;
  margin: 0;
}

/* ── Hello / instruction headings inside non-welcome cards ── */
.login-hello {
  font-size: 1.5rem !important;
  font-weight: 800 !important;
  color: #fff !important;
  text-align: center;
  margin: 0 !important;
  line-height: 1.2;
}

.login-instruction {
  font-size: 0.95rem !important;
  color: rgba(255,255,255,0.7) !important;
  text-align: center;
  margin: 0 !important;
  line-height: 1.5;
}

/* ── Non-welcome cards: top padding for mascot ── */
.login-scene .login-card:not(.login-card--welcome) {
  padding-top: 100px !important;
}

/* ── Background: richer cosmos ── */
.login-page {
  background:
    radial-gradient(ellipse 80% 50% at 20% 10%, rgba(124,58,237,0.45) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 85%, rgba(37,99,235,0.4) 0%, transparent 55%),
    radial-gradient(ellipse 50% 60% at 50% 50%, rgba(58,28,143,0.6) 0%, transparent 70%),
    radial-gradient(ellipse 100% 100% at 50% 50%, #1B0B4F 0%, #0d0620 100%) !important;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 24px 0 !important;
}

/* ── Responsive ── */
@media (max-width: 440px) {
  .login-mascot-hero { width: 170px; height: 170px; }
  .login-mascot-hero-wrap { margin-bottom: -75px; }
  .login-card--welcome { padding-top: 86px !important; }
  .login-scene .login-card:not(.login-card--welcome) { padding-top: 86px !important; }
  .login-logo__name { font-size: 2.8rem !important; }
  .login-card { padding: 28px 22px 26px !important; border-radius: 26px !important; }
  .login-google-btn { height: 52px !important; }
  .login-primary-btn { height: 52px; }
}

@media (min-width: 640px) {
  .login-mascot-hero { width: 240px; height: 240px; }
  .login-mascot-hero-wrap { margin-bottom: -100px; }
  .login-card--welcome { padding-top: 110px !important; }
  .login-scene .login-card:not(.login-card--welcome) { padding-top: 110px !important; }
  .login-logo__name { font-size: 3.8rem !important; }
  .login-scene { max-width: 560px; }
}
"""

target = pathlib.Path("src/shared/theme/app.css")
existing = target.read_text(encoding="utf-8")
marker = "/* ═══════════════════════════════════════════════════════════════\n   LOGIN — Premium mascot layout overrides"
if marker not in existing:
    target.write_text(existing + "\n" + css, encoding="utf-8")
    print("CSS appended OK")
else:
    print("Already present, skipping")
