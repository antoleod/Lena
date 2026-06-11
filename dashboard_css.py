import pathlib

MARKER = "APPRENDRE DASHBOARD V3"

css = r"""
/* ═══════════════════════════════════════════════════════════════
   APPRENDRE DASHBOARD V3 — premium hero, Grand Voyage, rewards
   ═══════════════════════════════════════════════════════════════ */

/* ── Hero ── */
.al-hero {
  position: relative;
  margin: 14px 14px 4px;
  border-radius: 26px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px 18px 14px;
  background:
    radial-gradient(ellipse 70% 90% at 12% 20%, rgba(124,58,237,0.55), transparent 60%),
    radial-gradient(ellipse 60% 80% at 90% 90%, rgba(34,211,238,0.32), transparent 60%),
    linear-gradient(135deg, #3b1d8f 0%, #2a1170 45%, #1a0b4a 100%);
  border: 1.5px solid rgba(168,85,247,0.4);
  box-shadow: 0 14px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1);
}
.al-hero__stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.al-hero__star {
  position: absolute;
  width: 4px; height: 4px; border-radius: 50%;
  background: #fff;
  opacity: 0.25;
  animation: alHeroTwinkle 2.6s ease-in-out infinite alternate;
  animation-delay: calc(var(--i) * 0.3s);
}
.al-hero__star:nth-child(odd)  { top: calc(8% + var(--i) * 9%); left: calc(20% + var(--i) * 7%); }
.al-hero__star:nth-child(even) { top: calc(70% - var(--i) * 5%); left: calc(12% + var(--i) * 8%); }
@keyframes alHeroTwinkle { from { opacity: 0.12; transform: scale(0.7); } to { opacity: 0.9; transform: scale(1.25); } }

.al-hero__mascot-wrap { position: relative; flex-shrink: 0; width: 120px; z-index: 1; }
.al-hero__mascot {
  width: 120px; height: 120px; object-fit: contain;
  filter: drop-shadow(0 6px 16px rgba(140,60,180,0.5));
  user-select: none; pointer-events: none;
}
.al-hero__mascot-glow {
  position: absolute; inset: 18% 8%; z-index: -1; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255,150,200,0.4), transparent 70%);
  filter: blur(16px);
}

.al-hero__main { position: relative; z-index: 1; flex: 1; min-width: 0; }
.al-hero__greet {
  margin: 0; font-family: 'Fredoka', sans-serif;
  font-size: 1.55rem; font-weight: 800; color: #fff; line-height: 1.1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.al-hero__sub { margin: 2px 0 10px; font-size: 0.88rem; color: rgba(255,255,255,0.78); }

.al-hero__levelrow { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 5px; }
.al-hero__level-badge {
  font-size: 0.82rem; font-weight: 800; color: #fff;
  padding: 4px 12px; border-radius: 14px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 3px 10px rgba(245,158,11,0.4);
  white-space: nowrap;
}
.al-hero__xp { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.75); white-space: nowrap; }
.al-hero__bar {
  height: 10px; border-radius: 6px; overflow: hidden;
  background: rgba(0,0,0,0.3); box-shadow: inset 0 1px 3px rgba(0,0,0,0.4);
  margin-bottom: 10px;
}
.al-hero__bar-fill {
  height: 100%; border-radius: 6px;
  background: linear-gradient(90deg, #22d3ee, #a855f7, #fbbf24);
  box-shadow: 0 0 12px rgba(168,85,247,0.7);
  transition: width 0.8s cubic-bezier(0.34,1.56,0.64,1);
}
.al-hero__chips { display: flex; flex-wrap: wrap; gap: 7px; }
.al-hero__chip {
  font-size: 0.76rem; font-weight: 700; color: #fff;
  padding: 4px 11px; border-radius: 13px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  white-space: nowrap;
}
.al-hero__chip--fire { background: rgba(249,115,22,0.22); border-color: rgba(249,115,22,0.4); }
.al-hero__chip--star { background: rgba(251,191,36,0.18); border-color: rgba(251,191,36,0.4); }
.al-hero__chip--gift { background: rgba(34,211,238,0.16); border-color: rgba(34,211,238,0.4); }

/* ── Grand Voyage ── */
.al-voyage {
  position: relative;
  display: block;
  margin: 16px 14px 4px;
  border-radius: 24px;
  overflow: hidden;
  text-decoration: none;
  min-height: 150px;
  border: 1.5px solid rgba(168,85,247,0.45);
  box-shadow: 0 12px 36px rgba(0,0,0,0.4);
  background:
    radial-gradient(ellipse 50% 80% at 78% 60%, rgba(124,58,237,0.6), transparent 65%),
    linear-gradient(120deg, #1a0b4a 0%, #2d1070 45%, #0d2a6e 100%);
  transition: transform 0.16s, box-shadow 0.2s;
}
.al-voyage:hover  { transform: translateY(-3px); box-shadow: 0 18px 44px rgba(124,58,237,0.4); }
.al-voyage:active { transform: scale(0.99); }
.al-voyage__sky { position: absolute; inset: 0; pointer-events: none; }
.al-voyage__deco {
  position: absolute; font-size: 1rem; opacity: 0.5;
  animation: floaty 5s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.7s);
}
.al-voyage__deco:nth-child(1){top:14%;left:10%}.al-voyage__deco:nth-child(2){top:24%;left:34%}
.al-voyage__deco:nth-child(3){top:60%;left:20%}.al-voyage__deco:nth-child(4){top:18%;left:60%}
.al-voyage__deco:nth-child(5){top:66%;left:48%}.al-voyage__deco:nth-child(6){top:30%;left:84%}
.al-voyage__castle {
  position: absolute; right: 14px; bottom: 6px; font-size: 5.5rem;
  filter: drop-shadow(0 6px 18px rgba(124,58,237,0.6));
  animation: floaty 6s ease-in-out infinite;
  pointer-events: none;
}
.al-voyage__content { position: relative; z-index: 1; padding: 18px 18px 16px; max-width: 75%; }
.al-voyage__head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.al-voyage__map-emoji { font-size: 2.2rem; flex-shrink: 0; }
.al-voyage__title {
  display: block; font-family: 'Fredoka', sans-serif;
  font-size: 1.4rem; font-weight: 800; color: #fff; line-height: 1.1;
}
.al-voyage__desc { display: block; font-size: 0.82rem; color: rgba(196,181,253,0.9); margin-top: 2px; }
.al-voyage__progress { margin-bottom: 12px; max-width: 320px; }
.al-voyage__prog-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.al-voyage__prog-label { font-size: 0.78rem; color: rgba(255,255,255,0.7); font-weight: 600; }
.al-voyage__prog-pct { font-size: 0.95rem; font-weight: 800; color: #fbbf24; }
.al-voyage__bar { height: 9px; border-radius: 5px; overflow: hidden; background: rgba(0,0,0,0.35); }
.al-voyage__bar-fill {
  height: 100%; border-radius: 5px;
  background: linear-gradient(90deg, #22d3ee, #a855f7);
  box-shadow: 0 0 10px rgba(168,85,247,0.7); transition: width 0.8s ease;
}
.al-voyage__cta {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 16px;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: #fff; font-size: 0.9rem; font-weight: 800;
  box-shadow: 0 5px 16px rgba(124,58,237,0.55);
}

/* ── Rewards ── */
.al-rewards-section { padding: 18px 14px 0; }
.al-rewards-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.al-rewards-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
}
.al-reward {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 14px; border-radius: 18px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--rw-c) 22%, #160a36), #160a36);
  border: 1.5px solid color-mix(in srgb, var(--rw-c) 50%, transparent);
  box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  transition: transform 0.16s, box-shadow 0.2s;
  cursor: pointer;
}
.al-reward:hover { transform: translateY(-3px); box-shadow: 0 12px 28px color-mix(in srgb, var(--rw-c) 35%, transparent); }
.al-reward__icon {
  font-size: 1.9rem; flex-shrink: 0;
  filter: drop-shadow(0 3px 8px color-mix(in srgb, var(--rw-c) 60%, transparent));
}
.al-reward__body { flex: 1; min-width: 0; }
.al-reward__title { display: block; font-size: 0.92rem; font-weight: 800; color: #fff; line-height: 1.15; }
.al-reward__sub { display: block; font-size: 0.74rem; color: rgba(255,255,255,0.6); margin-top: 1px; }
.al-reward__plus {
  flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--rw-c) 70%, transparent);
  color: #fff; font-weight: 800; font-size: 1.1rem; line-height: 1;
}

/* ── Mascot watermark on subject cards ── */
.al-subject-card__sky { position: relative; }
.al-subject-card__sky::after {
  content: '';
  position: absolute; right: -8px; bottom: -10px;
  width: 64px; height: 64px;
  background: url('/assets/characters/mascot-happy.svg') no-repeat center / contain;
  opacity: 0.9; pointer-events: none;
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
}

/* ── Responsive (tablet priority) ── */
@media (min-width: 768px) {
  .al-hero { margin: 18px 16px 6px; padding: 22px 28px 22px 18px; gap: 22px; }
  .al-hero__mascot-wrap, .al-hero__mascot { width: 168px; }
  .al-hero__mascot { height: 168px; }
  .al-hero__greet { font-size: 2.1rem; }
  .al-hero__sub { font-size: 1rem; }
  .al-rewards-grid { grid-template-columns: repeat(4, 1fr); }
  .al-voyage { min-height: 180px; }
  .al-voyage__castle { font-size: 7rem; }
  .al-voyage__title { font-size: 1.7rem; }
}
@media (min-width: 1024px) {
  .al-hero__greet { font-size: 2.4rem; }
}
"""

target = pathlib.Path("src/shared/theme/app.css")
existing = target.read_text(encoding="utf-8")
if MARKER not in existing:
    target.write_text(existing + "\n" + css, encoding="utf-8")
    print("Dashboard CSS appended OK")
else:
    print("Already present, skipping")
