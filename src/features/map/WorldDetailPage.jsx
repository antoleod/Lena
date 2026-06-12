import { Link, useParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getMissionProgress, getWorldById, getWorldProgress, worldMap } from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { resolveNodeGlyph } from '../../shared/gameplay/nodeGlyphs.js';
import IslandPath from '../grade/IslandPath.jsx';

// Per-nodeType glyph for non-lesson nodes (lessons get a content-matched glyph).
const NODE_TYPE_GLYPH = {
  checkpoint: '🏁',
  reward: '🎁',
  revision: '🔄',
  boss: '⚔️',
};

// Badge accent per world theme.
const THEME_COLOR = {
  forest: '#34d399',
  village: '#f59e0b',
  city: '#38bdf8',
  explorer: '#a78bfa',
  laboratory: '#f472b6',
};

function isMissionUnlocked(world, missionOrder, progress) {
  if (world.order === 1 && missionOrder === 1) return true;
  if (missionOrder === 1) {
    const previousWorld = worldMap.find(e => e.order === world.order - 1);
    const prev = previousWorld ? getWorldProgress(previousWorld, progress) : null;
    return !prev || prev.completed >= Math.max(1, Math.floor(prev.total * 0.4));
  }
  const previousMission = world.missions.find(e => e.order === missionOrder - 1);
  const prev = previousMission ? getMissionProgress(previousMission, progress) : null;
  return !prev || prev.completed >= Math.max(1, Math.floor(prev.total * 0.4));
}

export default function WorldDetailPage() {
  const { worldId } = useParams();
  const { t } = useLocale();
  const world = getWorldById(worldId);
  const progress = getProgressSnapshot();

  if (!world) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">Retour</Link>
      </section>
    );
  }

  const worldProgress = getWorldProgress(world, progress);
  const overallPct = worldProgress.total
    ? Math.round((worldProgress.completed / worldProgress.total) * 100)
    : 0;
  const subjectId = world.subjectIds?.[0];

  // First incomplete unlocked mission = active.
  const activeMissionOrder = (() => {
    for (const m of world.missions) {
      const mp = getMissionProgress(m, progress);
      if (isMissionUnlocked(world, m.order, progress) && mp.completed < mp.total) return m.order;
    }
    return null;
  })();

  const nodes = world.missions.map((mission, index) => {
    const mp = getMissionProgress(mission, progress);
    const pct = mp.total ? Math.round((mp.completed / mp.total) * 100) : 0;
    const glyph = mission.nodeType && NODE_TYPE_GLYPH[mission.nodeType]
      ? NODE_TYPE_GLYPH[mission.nodeType]
      : resolveNodeGlyph({ subjectId, domain: mission.title, index });
    return {
      id: mission.id,
      title: mission.title,
      launchTo: mission.lessonId
        ? `/lessons/${mission.lessonId}?returnTo=/map/${world.id}`
        : `/map/${world.id}/missions/${mission.id}`,
      pct,
      isActive: mission.order === activeMissionOrder,
      complete: mp.total > 0 && mp.completed >= mp.total,
      glyph,
    };
  });

  return (
    <div className="cc-map-page" data-testid="world-detail-page">
      <div className="cc-topbar">
        <Link className="cc-back-btn" to="/map">←</Link>
        <div className="cc-topbar__title">{world.title}</div>
        <div className="cc-topbar__progress">
          <div className="cc-xp-bar">
            <div className="cc-xp-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <span className="cc-xp-text">{overallPct}%</span>
        </div>
      </div>

      <IslandPath
        nodes={nodes}
        badgeColor={THEME_COLOR[world.theme] || '#38bdf8'}
        endIcon="🌟"
        endLabel="¡Mundo completado!"
        emptyFallback={{ icon: '🌟', label: 'Retour à la carte', to: '/map' }}
      />
    </div>
  );
}
