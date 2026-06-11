import pathlib

# Idempotent append: premium polish layer #4 (nebula, shooting stars,
# subtitle, bigger tablet/desktop mascot, logo aura).
MARKER = "LOGIN POLISH LAYER 4"

css = r"""
/* ═══════════════════════════════════════════════════════════════
   LOGIN POLISH LAYER 4 — nebula, shooting stars, subtitle, tablet
   ═══════════════════════════════════════════════════════════════ */

/* ── Nebula clouds: soft colored depth behind everything ── */
.login-nebula { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.login-nebula__cloud {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.5;
  animation: loginNebulaDrift 18s ease-in-out infinite alternate;
}
.login-nebula__cloud--1 {
  width: 46vw; height: 46vw; max-width: 520px; max-height: 520px;
  top: -8%; left: -10%;
  background: radial-gradient(circle, rgba(168,85,247,0.55), transparent 70%);
}
.login-nebula__cloud--2 {
  width: 40vw; height: 40vw; max-width: 460px; max-height: 460px;
  bottom: -10%; right: -8%;
  background: radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%);
  animation-delay: -6s;
}
.login-nebula__cloud--3 {
  width: 34vw; height: 34vw; max-width: 400px; max-height: 400px;
  top: 38%; left: 60%;
  background: radial-gradient(circle, rgba(251,191,36,0.28), transparent 70%);
  animation-delay: -11s;
}
@keyframes loginNebulaDrift {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(4%, -4%) scale(1.12); }
}

/* ── Shooting stars: streak across the cosmos ── */
.login-shooting { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.login-shoot {
  position: absolute;
  width: 2px; height: 2px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px 1px rgba(255,255,255,0.9);
  opacity: 0;
}
.login-shoot::after {
  content: '';
  position: absolute;
  top: 50%; right: 2px;
  width: 120px; height: 1.5px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, rgba(255,255,255,0.85), transparent);
}
.login-shoot--1 { top: 12%; left: 80%; animation: loginShoot 7s ease-in 1.5s infinite; }
.login-shoot--2 { top: 28%; left: 95%; animation: loginShoot 9s ease-in 4.5s infinite; }
.login-shoot--3 { top: 6%;  left: 60%; animation: loginShoot 11s ease-in 8s infinite; }
@keyframes loginShoot {
  0%   { opacity: 0; transform: translate(0, 0) rotate(18deg) scale(0.6); }
  6%   { opacity: 1; }
  18%  { opacity: 1; }
  30%  { opacity: 0; transform: translate(-60vw, 34vh) rotate(18deg) scale(1); }
  100% { opacity: 0; transform: translate(-60vw, 34vh) rotate(18deg) scale(1); }
}

/* ── Subtitle: Explorer • Apprendre • Rêver • Grandir ── */
.login-logo__subtitle {
  margin: 2px 0 0 !important;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #c4b5fd, #67e8f9, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 8px rgba(124,58,237,0.4));
}

/* ── Logo aura: soft pulsing halo behind the wordmark ── */
.login-logo__name {
  position: relative;
}
.login-logo__name::before {
  content: '';
  position: absolute;
  inset: -30% -10%;
  z-index: -1;
  background: radial-gradient(ellipse, rgba(168,85,247,0.35) 0%, transparent 70%);
  filter: blur(18px);
  animation: loginAuraPulse 4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes loginAuraPulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 0.95; transform: scale(1.08); }
}

/* ── Tablet & desktop: bigger mascot + brighter planets so no
      empty space, mascot reaches ~30% of viewport ── */
@media (min-width: 700px) {
  .login-mascot-hero { width: 300px !important; height: 300px !important; }
  .login-mascot-hero-wrap { margin-bottom: -120px !important; }
  .login-scene { max-width: 600px !important; }
  .login-card--welcome { padding-top: 140px !important; }
  .login-scene .login-card:not(.login-card--welcome) { padding-top: 140px !important; }
  .login-planet--1 { width: 140px !important; height: 140px !important; opacity: 0.95; }
  .login-planet--2 { width: 90px !important; height: 90px !important; opacity: 0.95; }
}
@media (min-width: 1024px) {
  .login-mascot-hero { width: 340px !important; height: 340px !important; }
  .login-mascot-hero-wrap { margin-bottom: -135px !important; }
}
"""

target = pathlib.Path("src/shared/theme/app.css")
existing = target.read_text(encoding="utf-8")
if MARKER not in existing:
    target.write_text(existing + "\n" + css, encoding="utf-8")
    print("CSS appended OK")
else:
    print("Already present, skipping")
