import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import {
  getLevelProgressRecord,
  getMission,
  getMissionProgress,
  getNextMissionTarget,
  getWorldById
} from '../../shared/gameplay/worldMap.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';

const STAGE_CONFIG = {
  practice:  { emoji: '📖', color: '#4aa8f2', shadow: '#2878c4', bg: 'linear-gradient(145deg,#a3d8ff,#4aa8f2)', label: 'Práctica' },
  challenge: { emoji: '⚡', color: '#ffc34a', shadow: '#cc8c00', bg: 'linear-gradient(145deg,#ffe9a3,#ffc34a)', label: 'Desafío' },
  exam:      { emoji: '🏁', color: '#f96bbd', shadow: '#c93d90', bg: 'linear-gradient(145deg,#ffc2e8,#f96bbd)', label: 'Examen' },
};

const PATH_COLS = [1, 2, 1];
const NODE_SHAPES = ['circle', 'squircle', 'diamond'];

function buildMissionStages(mission, progress, t) {
  const totalLevels = mission.levels.length;
  const examOrder = totalLevels;
  const challengeOrder = totalLevels >= 3 ? totalLevels - 1 : null;
  const practiceLevels = mission.levels.filter(l => challengeOrder ? l.order < challengeOrder : l.order < examOrder);
  const challengeLevel = challengeOrder ? mission.levels.find(l => l.order === challengeOrder) : null;
  const examLevel = mission.levels.find(l => l.order === examOrder) || null;

  return [
    { id: 'practice',  title: t('missionPracticeLabel'),   levels: practiceLevels,             launchLevel: practiceLevels.find(l => !getLevelProgressRecord(progress, l)?.completed) || practiceLevels[0] || null },
    { id: 'challenge', title: t('missionChallengeLabel'),  levels: challengeLevel ? [challengeLevel] : [], launchLevel: challengeLevel },
    { id: 'exam',      title: t('missionExamLabel'),       levels: examLevel ? [examLevel] : [], launchLevel: examLevel },
  ].map(stage => {
    const total = stage.levels.length;
    const completed = stage.levels.filter(l => getLevelProgressRecord(progress, l)?.completed).length;
    return { ...stage, total, completed, status: completed >= total && total > 0 ? 'completed' : completed > 0 ? 'in-progress' : 'available' };
  }).filter(s => s.total > 0);
}

function PathSegment({ fromCol, toCol }) {
  const colToX = c => [15, 50, 85][c];
  const x1 = colToX(fromCol), x2 = colToX(toCol), cx = (x1 + x2) / 2;
  return (
    <div className="cc-path-segment" aria-hidden="true">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="14" strokeLinecap="round" />
        <path d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="8" strokeLinecap="round" strokeDasharray="4 6" />
      </svg>
    </div>
  );
}

export default function MissionPage() {
  const { t } = useLocale();
  const [searchParams] = useSearchParams();
  const { worldId, missionId } = useParams();
  const world = getWorldById(worldId);
  const mission = getMission(worldId, missionId);
  const progress = getProgressSnapshot();

  if (!world || !mission) {
    return (
      <section className="panel panel--tight">
        <h2>{t('activityNotFound')}</h2>
        <Link className="text-link" to="/map">{t('backHome')}</Link>
      </section>
    );
  }

  const missionProgress = getMissionProgress(mission, progress);
  const completedMission = missionProgress.completed >= missionProgress.total;
  const perfectMission = completedMission && missionProgress.perfect >= missionProgress.total;
  const completionReward = Number(searchParams.get('reward') || 0);
  const showCompletionBanner = searchParams.get('complete') === '1' && completedMission;
  const nextTarget = getNextMissionTarget(world.id, mission.id, mission.levels.length);
  const nextPlayableLevel = mission.levels.find(l => !getLevelProgressRecord(progress, l)?.completed) || mission.levels[0];
  const stages = buildMissionStages(mission, progress, t);

  const missionPct = missionProgress.total ? Math.round((missionProgress.completed / missionProgress.total) * 100) : 0;
  const activeStageId = stages.find(s => s.status !== 'completed')?.id || null;

  return (
    <div className="cc-map-page" data-testid={`mission-page-${missionId}`}>
      <div className="cc-topbar">
        <Link className="cc-back-btn" to={`/map/${world.id}`}>←</Link>
        <div className="cc-topbar__title">{mission.title}</div>
        <div className="cc-topbar__progress">
          <div className="cc-xp-bar"><div className="cc-xp-fill" style={{ width: `${missionPct}%` }} /></div>
          <span className="cc-xp-text">{missionPct}%</span>
        </div>
      </div>

      {/* Completion banner */}
      {showCompletionBanner && (
        <div className="cc-completion-banner">
          <div className="cc-completion-banner__stars">
            {[1,2,3].map(i => <span key={i} className="cc-completion-banner__star">⭐</span>)}
          </div>
          <div className="cc-completion-banner__title">
            {perfectMission ? `${t('missionExamLabel')} · ${t('missionPerfectLabel')}` : t('missionCompleteLabel')}
          </div>
          <div className="cc-completion-banner__reward">+{completionReward} {t('crystals')} 💎</div>
          <div className="cc-completion-banner__actions">
            {nextTarget ? (
              <Link className="cc-mission-banner__cta" to={`/activities/${nextTarget.activityId}?world=${nextTarget.worldId}&mission=${nextTarget.missionId}&level=${nextTarget.levelOrder}`}>
                ▶ {t('continue')}
              </Link>
            ) : (
              <Link className="cc-mission-banner__cta" to={`/map/${world.id}`}>🗺 {t('missions')}</Link>
            )}
          </div>
        </div>
      )}

      {/* Mission info banner */}
      <div className="cc-world-banner">
        <div className="cc-world-banner__left">
          <span className="cc-world-banner__eyebrow">Mundo {world.order} · {world.title}</span>
          <p className="cc-world-banner__desc">{mission.description || `Misión ${mission.order}`}</p>
        </div>
        <div className="cc-world-banner__stats">
          <div className="cc-world-banner__stat">
            <span className="cc-world-banner__stat-val">{missionProgress.completed}</span>
            <span className="cc-world-banner__stat-lbl">listos</span>
          </div>
          <div className="cc-world-banner__divider" />
          <div className="cc-world-banner__stat">
            <span className="cc-world-banner__stat-val">{missionProgress.total}</span>
            <span className="cc-world-banner__stat-lbl">total</span>
          </div>
        </div>
      </div>

      {/* Quick play CTA */}
      <Link
        to={`/activities/${nextPlayableLevel.activityId}?world=${world.id}&mission=${mission.id}&level=${nextPlayableLevel.order}`}
        className="cc-mission-banner"
      >
        <div className="cc-mission-banner__icon">{completedMission ? '🔁' : '▶'}</div>
        <div className="cc-mission-banner__info">
          <span className="cc-mission-banner__label">{completedMission ? 'Repetir misión' : 'Continuar'}</span>
          <strong className="cc-mission-banner__name">{mission.title}</strong>
        </div>
        <div className="cc-mission-banner__cta">{completedMission ? '🔁' : '▶ Jugar'}</div>
      </Link>

      {/* Stages path */}
      <div className="cc-path-canvas">
        <div className="cc-bg-clouds" aria-hidden="true">
          <span className="cc-cloud" style={{ top: '15%', left: '5%',  fontSize: '1.8rem', animationDelay: '0s' }}>☁️</span>
          <span className="cc-cloud" style={{ top: '55%', right: '5%', fontSize: '1.5rem', animationDelay: '1.4s' }}>☁️</span>
        </div>

        <div className="cc-grid">
          {stages.map((stage, index) => {
            const col = PATH_COLS[index % PATH_COLS.length];
            const nextCol = index < stages.length - 1 ? PATH_COLS[(index + 1) % PATH_COLS.length] : null;
            const shape = NODE_SHAPES[index % NODE_SHAPES.length];
            const colClass = ['cc-col--left', 'cc-col--center', 'cc-col--right'][col];
            const stageCfg = STAGE_CONFIG[stage.id] || STAGE_CONFIG.practice;
            const isActive = stage.id === activeStageId;
            const complete = stage.status === 'completed';
            const pct = stage.total ? Math.round((stage.completed / stage.total) * 100) : 0;
            const launchTo = stage.launchLevel
              ? `/activities/${stage.launchLevel.activityId}?world=${world.id}&mission=${mission.id}&level=${stage.launchLevel.order}`
              : `/map/${world.id}`;

            return (
              <div key={stage.id} className="cc-row">
                <div className="cc-node-slot">
                  <Link to={launchTo} className="cc-node-link">
                    <div
                      className={`cc-node ${isActive ? 'cc-node--current' : ''} ${complete ? 'cc-node--complete' : ''} cc-node--${shape} ${colClass}`}
                      style={{ '--node-color': stageCfg.color, '--node-shadow': stageCfg.shadow, '--node-bg': stageCfg.bg, animationDelay: `${index * 120}ms` }}
                    >
                      {isActive && <div className="cc-node__arrow">▼</div>}
                      <div className="cc-node__body">
                        <span className="cc-node__emoji">{stageCfg.emoji}</span>
                        {complete && <div className="cc-node__crown">✓</div>}
                      </div>
                      <div className="cc-node__label"><span className="cc-node__num">{index + 1}</span></div>
                      <div className="cc-stars">
                        {[33, 66, 100].map((thr, i) => (
                          <span key={i} className={pct >= thr ? 'cc-star cc-star--on' : 'cc-star cc-star--off'}>★</span>
                        ))}
                      </div>
                      <div className="cc-node__type-badge" style={{ background: stageCfg.color }}>{stageCfg.label}</div>
                      {isActive && <div className="cc-node__pulse" />}
                    </div>
                    <span className="cc-node__title">{stage.title}</span>
                  </Link>

                  <div className="cc-subject-card cc-subject-card--static">
                    <div className="cc-subject-card__name">
                      {stage.levels[0]?.order}{stage.total > 1 ? `–${stage.levels[stage.levels.length - 1]?.order}` : ''} · {stage.completed}/{stage.total}
                    </div>
                    <div className="cc-subject-card__bar">
                      <div className="cc-subject-card__fill" style={{ width: `${pct}%`, background: stageCfg.bg }} />
                    </div>
                    <span className="cc-subject-card__stat">
                      {stage.status === 'completed' ? t('completed') : stage.status === 'in-progress' ? t('continue') : t('start')}
                    </span>
                  </div>
                </div>
                {nextCol !== null && <PathSegment fromCol={col} toCol={nextCol} />}
              </div>
            );
          })}

          <div className="cc-row">
            <div className="cc-end-trophy">
              <span>{completedMission ? '🏆' : '🎯'}</span>
              <span className="cc-end-trophy__label">{completedMission ? '¡Misión completada!' : 'Meta final'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
