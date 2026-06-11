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

SIDEBAR_MARKER = "SIDEBAR PROFILE V3"
sidebar_css = r"""
/* ═══════════════════════════════════════════════════════════════
   SIDEBAR PROFILE V3 — player-profile card (avatar, level, XP, stats)
   ═══════════════════════════════════════════════════════════════ */
.app-sidebar__profile {
  display: flex !important;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 12px 12px !important;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(124,58,237,0.28), rgba(37,99,235,0.18));
  border: 1.5px solid rgba(168,85,247,0.4);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
  cursor: pointer;
  text-align: left;
}
.app-sidebar__profile:hover { border-color: rgba(168,85,247,0.7); }
.app-sidebar__avatar-wrap {
  position: relative; flex-shrink: 0;
  width: 52px; height: 52px; border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, rgba(255,150,200,0.35), rgba(124,58,237,0.25));
  border: 2px solid rgba(255,255,255,0.35);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  box-shadow: 0 3px 10px rgba(124,58,237,0.4);
}
.app-sidebar__avatar { width: 56px; height: 56px; object-fit: contain; margin-top: 4px; }
.app-sidebar__profile-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
.app-sidebar__profile-name {
  font-family: 'Fredoka', sans-serif; font-weight: 800; color: #fff;
  font-size: 1rem; line-height: 1.05; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.app-sidebar__profile-level { font-size: 0.72rem; font-weight: 700; color: #fbbf24; }
.app-sidebar__xpbar {
  display: block; height: 7px; border-radius: 4px; overflow: hidden;
  background: rgba(0,0,0,0.35); margin-top: 2px;
}
.app-sidebar__xpbar-fill {
  display: block; height: 100%; border-radius: 4px;
  background: linear-gradient(90deg, #22d3ee, #a855f7, #fbbf24);
  box-shadow: 0 0 8px rgba(168,85,247,0.7); transition: width 0.7s ease;
}
.app-sidebar__stats { display: flex; gap: 6px; margin: 4px 0 2px; }
.app-sidebar__stat {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 3px;
  padding: 6px 4px; border-radius: 12px;
  font-size: 0.78rem; font-weight: 800; color: #fff;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
}
.app-sidebar__stat--fire { background: rgba(249,115,22,0.2); border-color: rgba(249,115,22,0.38); }
.app-sidebar__stat--star { background: rgba(251,191,36,0.18); border-color: rgba(251,191,36,0.38); }
.app-sidebar__stat--gem  { background: rgba(34,211,238,0.16); border-color: rgba(34,211,238,0.38); }
"""

COLOR_MARKER = "MASCOT COLOR V1"
color_css = r"""
/* ═══════════════════════════════════════════════════════════════
   MASCOT COLOR V1 — global hue recolor + customizer colour picker
   The pink base SVG is recoloured app-wide via --mascot-hue (set by
   AppShell from the equipped mascotColor reward). Each rule keeps its
   own drop-shadow and appends hue-rotate.
   ═══════════════════════════════════════════════════════════════ */
.login-mascot-hero {
  filter:
    drop-shadow(0 0 28px rgba(255,150,200,0.55))
    drop-shadow(0 8px 20px rgba(140,60,180,0.4))
    hue-rotate(var(--mascot-hue, 0deg));
}
.al-hero__mascot {
  filter: drop-shadow(0 6px 16px rgba(140,60,180,0.5)) hue-rotate(var(--mascot-hue, 0deg));
}
.app-sidebar__avatar { filter: hue-rotate(var(--mascot-hue, 0deg)); }
.mascot-img { filter: hue-rotate(var(--mascot-hue, 0deg)); }
.mascot-character:hover .mascot-img {
  filter: drop-shadow(0 8px 20px rgba(255,100,180,0.35)) hue-rotate(var(--mascot-hue, 0deg));
}
.al-subject-card__sky::after {
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3)) hue-rotate(var(--mascot-hue, 0deg));
}

/* ── Customizer: mascot colour picker ── */
.drawer-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(86px, 1fr));
  gap: 10px;
}
.drawer-color-btn {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 10px 6px 8px;
  border-radius: 16px;
  border: 2px solid rgba(124,58,237,0.18);
  background: rgba(124,58,237,0.05);
  cursor: pointer;
  transition: transform 0.14s, border-color 0.16s, box-shadow 0.16s;
}
.drawer-color-btn:hover { transform: translateY(-2px); border-color: rgba(124,58,237,0.45); }
.drawer-color-btn.is-active {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124,58,237,0.2), 0 6px 16px rgba(124,58,237,0.25);
  background: rgba(124,58,237,0.1);
}
.drawer-color-btn.is-locked { opacity: 0.72; }
.drawer-color-swatch {
  width: 58px; height: 58px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  background: radial-gradient(circle at 38% 32%, #fff6, var(--swatch, #ff9ecf));
  box-shadow: inset 0 -4px 10px rgba(0,0,0,0.18), 0 3px 8px rgba(0,0,0,0.18);
}
.drawer-color-swatch img { width: 60px; height: 60px; object-fit: contain; margin-top: 4px; pointer-events: none; }
.drawer-color-name { font-size: 0.72rem; font-weight: 700; text-align: center; line-height: 1.1; }
.drawer-color-check {
  position: absolute; top: 6px; right: 8px;
  color: #7c3aed; font-weight: 900; font-size: 0.95rem;
}
.drawer-color-lock { font-size: 0.66rem; font-weight: 700; color: var(--text-soft, #888); }
.drawer-color-hint {
  margin: 10px 0 0; font-size: 0.78rem; font-weight: 600;
  color: rgba(124,58,237,0.85); text-align: center;
}
"""

WORLDS_MARKER = "GAME WORLDS V1"
worlds_css = r"""
/* ═══════════════════════════════════════════════════════════════
   GAME WORLDS V1 — subjects as immersive destinations (not cards)
   ═══════════════════════════════════════════════════════════════ */

/* Remove repeated mascot watermark — mascot is only the hero guide now */
.al-subject-card__sky::after { content: none !important; }

.al-worlds-header { padding: 18px 16px 4px; }
.al-worlds-header__title {
  margin: 0; font-family: 'Fredoka', sans-serif;
  font-size: 1.3rem; font-weight: 800; color: #fff;
}
.al-worlds-header__sub { margin: 3px 0 0; font-size: 0.85rem; color: rgba(255,255,255,0.55); }

.al-worlds-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  padding: 10px 16px 4px;
}

.al-world {
  position: relative;
  display: block;
  min-height: 158px;
  border-radius: 24px;
  overflow: hidden;
  text-decoration: none;
  border: 1.5px solid color-mix(in srgb, var(--w-accent) 45%, transparent);
  background: linear-gradient(158deg, var(--w-sky-top) 0%, var(--w-sky-bot) 100%);
  box-shadow: 0 12px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
  transition: transform 0.2s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.22s, border-color 0.2s;
  opacity: 0;
  transform: translateY(14px);
  animation: alWorldIn 0.5s cubic-bezier(0.34,1.4,0.64,1) forwards;
  animation-delay: calc(var(--w-i, 0) * 0.05s);
  isolation: isolate;
}
@keyframes alWorldIn { to { opacity: 1; transform: translateY(0); } }
.al-world:hover {
  transform: translateY(-5px) scale(1.012);
  box-shadow: 0 20px 46px rgba(0,0,0,0.5), 0 0 36px color-mix(in srgb, var(--w-accent) 40%, transparent);
  border-color: color-mix(in srgb, var(--w-accent) 80%, transparent);
}
.al-world:active { transform: scale(0.985); }

/* Atmosphere */
.al-world__bg { position: absolute; inset: 0; overflow: hidden; z-index: 0; }
.al-world__halo {
  position: absolute; right: -10%; top: -30%;
  width: 70%; height: 120%;
  background: radial-gradient(circle, color-mix(in srgb, var(--w-accent) 55%, transparent), transparent 65%);
  filter: blur(18px); opacity: 0.55;
}
.al-world__particle {
  position: absolute;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--w-accent) 70%, #fff);
  opacity: 0.5;
  animation: alWorldFloat 6s ease-in-out infinite;
  animation-delay: calc(var(--p) * 0.7s);
}
.al-world__particle:nth-child(1){top:18%;left:12%}.al-world__particle:nth-child(2){top:60%;left:24%}
.al-world__particle:nth-child(3){top:30%;left:46%}.al-world__particle:nth-child(4){top:72%;left:58%}
.al-world__particle:nth-child(5){top:14%;left:70%}.al-world__particle:nth-child(6){top:50%;left:84%}
@keyframes alWorldFloat { 0%,100%{transform:translateY(0) scale(1);opacity:.35} 50%{transform:translateY(-8px) scale(1.2);opacity:.8} }

/* Landmark icon = the place */
.al-world__landmark {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  z-index: 1; opacity: 0.92;
  filter: drop-shadow(0 6px 16px color-mix(in srgb, var(--w-shadow) 70%, transparent));
  animation: alWorldBob 5s ease-in-out infinite;
}
@keyframes alWorldBob { 0%,100%{transform:translateY(-50%)} 50%{transform:translateY(calc(-50% - 7px))} }
.al-world__landmark-emoji { font-size: 4.4rem; line-height: 1; }

/* Text scrim + overlay */
.al-world__overlay {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; justify-content: space-between;
  height: 100%; min-height: 158px;
  padding: 14px 16px;
  background: linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 55%, transparent 80%);
}
.al-world__top { display: flex; align-items: center; justify-content: space-between; }
.al-world__badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 11px; border-radius: 13px;
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
  color: #fff;
  background: color-mix(in srgb, var(--w-accent) 55%, rgba(0,0,0,0.3));
  border: 1px solid color-mix(in srgb, var(--w-accent) 70%, transparent);
}
.al-world__crown { font-size: 1.3rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); }
.al-world__info { margin: 6px 0; }
.al-world__name {
  display: block; font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem; font-weight: 800; color: #fff; line-height: 1.05;
  text-shadow: 0 2px 10px rgba(0,0,0,0.55);
}
.al-world__story {
  display: block; margin-top: 3px; max-width: 78%;
  font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.85);
  text-shadow: 0 1px 4px rgba(0,0,0,0.5); line-height: 1.3;
}
.al-world__foot { display: flex; align-items: center; gap: 12px; }
.al-world__journey { flex: 1; display: flex; align-items: center; gap: 8px; max-width: 70%; }
.al-world__bar {
  flex: 1; height: 8px; border-radius: 5px; overflow: hidden;
  background: rgba(0,0,0,0.4); box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
}
.al-world__bar-fill {
  height: 100%; border-radius: 5px;
  background: linear-gradient(90deg, #fff, var(--w-accent));
  box-shadow: 0 0 10px color-mix(in srgb, var(--w-accent) 80%, transparent);
  transition: width 0.7s ease;
}
.al-world__pct { font-size: 0.74rem; font-weight: 800; color: #fff; }
.al-world__cta {
  flex-shrink: 0; display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 14px;
  font-size: 0.82rem; font-weight: 800; color: #fff;
  background: color-mix(in srgb, var(--w-accent) 80%, #000);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--w-accent) 45%, transparent);
}

@media (min-width: 600px) {
  .al-worlds-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}
@media (min-width: 1024px) {
  .al-worlds-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; padding: 12px 16px; }
  .al-world { min-height: 172px; }
  .al-world__overlay { min-height: 172px; }
  .al-world__landmark-emoji { font-size: 5rem; }
}
"""

target = pathlib.Path("src/shared/theme/app.css")
existing = target.read_text(encoding="utf-8")
out = existing
if MARKER not in out:
    out += "\n" + css
    print("Dashboard CSS appended OK")
else:
    print("Dashboard CSS already present, skipping")
if SIDEBAR_MARKER not in out:
    out += "\n" + sidebar_css
    print("Sidebar CSS appended OK")
else:
    print("Sidebar CSS already present, skipping")
if COLOR_MARKER not in out:
    out += "\n" + color_css
    print("Mascot colour CSS appended OK")
else:
    print("Mascot colour CSS already present, skipping")
if WORLDS_MARKER not in out:
    out += "\n" + worlds_css
    print("Game worlds CSS appended OK")
else:
    print("Game worlds CSS already present, skipping")
if out != existing:
    target.write_text(out, encoding="utf-8")
