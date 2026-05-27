import { Link, useParams } from 'react-router-dom';
import { getModuleById, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getModuleJourney } from '../../shared/gameplay/moduleJourney.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getGradeWorld, getDomainTheme } from '../../shared/gameplay/subjectThemes.js';

const STAGE_CONFIG = {
  guided:      { emoji: '📖', label: 'Guiado' },
  independent: { emoji: '🧠', label: 'Autónomo' },
  challenge:   { emoji: '⚡', label: 'Desafío' },
  exam:        { emoji: '🏁', label: 'Examen' },
  review:      { emoji: '🔄', label: 'Revisión' },
};

const PATH_COLS   = [1, 2, 1, 0, 1];
const NODE_SHAPES = ['circle', 'squircle', 'diamond', 'squircle', 'circle'];

function getStageStatus(stage, progress) {
  const total     = stage.activities.length;
  const completed = stage.activities.filter(a => progress.activities[a.id]?.completed).length;
  return { total, completed, state: completed >= total && total > 0 ? 'completed' : completed > 0 ? 'in-progress' : 'available' };
}

function getResume(activities, progress) {
  return activities.find(a => !progress.activities[a.id]?.completed) || activities[0] || null;
}

function PathSegment({ fromCol, toCol, color }) {
  const colToX = c => [15, 50, 85][c];
  const x1 = colToX(fromCol), x2 = colToX(toCol), cx = (x1 + x2) / 2;
  return (
    <div className="cc-path-segment" aria-hidden="true">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="14" strokeLinecap="round" />
        <path d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`} fill="none" stroke={color || 'rgba(255,255,255,0.4)'} strokeWidth="6" strokeLinecap="round" strokeDasharray="4 7" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}

export default function ModulePage() {
  const { locale, t } = useLocale();
  const { subjectId, gradeId, moduleId } = useParams();
  const subject  = getSubjectById(subjectId);
  const module   = getModuleById(moduleId);
  const progress = getProgressSnapshot();

  if (!subject || !module) {
    return <section className="panel panel--tight"><h2>{t('activityNotFound')}</h2></section>;
  }

  const gradeWorld  = getGradeWorld(subjectId, gradeId);
  const domainTheme = getDomainTheme(module.domainId, 0);

  const journey = getModuleJourney(module, {
    guided: t('practiceMode'), independent: t('continueStep'),
    challenge: t('missionChallengeLabel'), exam: t('missionExamLabel'), review: t('reinforceLabel')
  });

  const totalActivities     = journey.activities.length;
  const completedActivities = journey.activities.filter(a => progress.activities[a.id]?.completed).length;
  const progressPercent     = totalActivities ? Math.round((completedActivities / totalActivities) * 100) : 0;
  const resumeActivity      = getResume(journey.activities, progress);
  const activeStageId       = journey.stages.find(s => getStageStatus(s, progress).state !== 'completed')?.id || null;

  return (
    <div
      className="sw-grade-page"
      style={{ '--w-color': gradeWorld.color, '--w-shadow': gradeWorld.shadow, '--w-bg': gradeWorld.bg, '--w-sky': gradeWorld.sky }}
      data-testid={`module-page-${moduleId}`}
    >
      {/* Topbar */}
      <div className="cc-topbar">
        <Link className="cc-back-btn" to={`/subjects/${subjectId}/grades/${gradeId}`}>←</Link>
        <div className="cc-topbar__title">{gradeWorld.emoji} {module.title}</div>
        <div className="cc-topbar__progress">
          <div className="cc-xp-bar"><div className="cc-xp-fill" style={{ width: `${progressPercent}%`, background: gradeWorld.bg }} /></div>
          <span className="cc-xp-text" style={{ color: gradeWorld.color }}>{progressPercent}%</span>
        </div>
      </div>

      {/* Module hero */}
      <div className="sw-grade-hero">
        <div className="sw-grade-hero__planet" style={{ '--planet-bg': domainTheme.bg }}>
          <span>📘</span>
        </div>
        <div className="sw-grade-hero__info">
          <span className="sw-grade-hero__subject">{module.domainLabel} · {gradeId}</span>
          <h2 className="sw-grade-hero__name">{module.title}</h2>
          <p className="sw-grade-hero__desc">{module.summary}</p>
          <div className="sw-grade-hero__stats">
            <span>{completedActivities}/{totalActivities} actividades</span>
            <span>·</span>
            <span>{getSubjectLabel(subject, locale, t)}</span>
          </div>
        </div>
      </div>

      {/* Quick play */}
      {resumeActivity && (
        <Link
          to={`/activities/${resumeActivity.id}?module=${module.id}`}
          className="cc-mission-banner"
          style={{ '--node-color': gradeWorld.color }}
          data-testid="module-primary-cta"
        >
          <div className="cc-mission-banner__icon">{completedActivities > 0 ? '▶' : '✨'}</div>
          <div className="cc-mission-banner__info">
            <span className="cc-mission-banner__label">{completedActivities > 0 ? t('continue') : t('startAdventure')}</span>
            <strong className="cc-mission-banner__name">{module.phases?.introduction || module.title}</strong>
          </div>
          <div className="cc-mission-banner__cta" style={{ background: gradeWorld.bg }}>
            {completedActivities > 0 ? '▶ Continuar' : '✨ Empezar'}
          </div>
        </Link>
      )}

      {/* Stages path */}
      <div className="sw-grade-path">
        <div className="cc-grid">
          {journey.stages.map((stage, index) => {
            const status   = getStageStatus(stage, progress);
            const nextAct  = getResume(stage.activities, progress);
            const col      = PATH_COLS[index % PATH_COLS.length];
            const nextCol  = index < journey.stages.length - 1 ? PATH_COLS[(index + 1) % PATH_COLS.length] : null;
            const shape    = NODE_SHAPES[index % NODE_SHAPES.length];
            const colClass = ['cc-col--left', 'cc-col--center', 'cc-col--right'][col];
            const cfg      = STAGE_CONFIG[stage.id] || STAGE_CONFIG.guided;
            // Each stage gets a theme derived from the domain + index
            const stageTheme = getDomainTheme(module.domainId, index);
            const isActive = stage.id === activeStageId;
            const complete = status.state === 'completed';
            const pct      = status.total ? Math.round((status.completed / status.total) * 100) : 0;
            const launchTo = nextAct ? `/activities/${nextAct.id}?module=${module.id}` : `/subjects/${subjectId}/grades/${gradeId}`;

            return (
              <div key={stage.id} className="cc-row">
                <div className="cc-node-slot">
                  <Link to={launchTo} className="cc-node-link" data-testid={`module-stage-${stage.id}`}>
                    <div
                      className={`cc-node ${isActive ? 'cc-node--current' : ''} ${complete ? 'cc-node--complete' : ''} cc-node--${shape} ${colClass}`}
                      style={{ '--node-color': stageTheme.color, '--node-shadow': stageTheme.shadow, '--node-bg': stageTheme.bg, animationDelay: `${index * 100}ms` }}
                    >
                      {isActive && <div className="cc-node__arrow" style={{ color: gradeWorld.color }}>▼</div>}
                      <div className="cc-node__body">
                        <span className="cc-node__emoji">{cfg.emoji}</span>
                        {complete && <div className="cc-node__crown">✓</div>}
                      </div>
                      <div className="cc-node__label"><span className="cc-node__num">{index + 1}</span></div>
                      <div className="cc-stars">
                        {[33, 66, 100].map((thr, i) => (
                          <span key={i} className={pct >= thr ? 'cc-star cc-star--on' : 'cc-star cc-star--off'}>★</span>
                        ))}
                      </div>
                      <div className="cc-node__type-badge" style={{ background: stageTheme.color }}>{cfg.label}</div>
                      {isActive && <div className="cc-node__pulse" />}
                    </div>
                    <span className="cc-node__title">{stage.title}</span>
                  </Link>
                  <div className="cc-subject-card cc-subject-card--static">
                    <div className="cc-subject-card__name">{status.completed}/{status.total}</div>
                    <div className="cc-subject-card__bar">
                      <div className="cc-subject-card__fill" style={{ width: `${pct}%`, background: stageTheme.bg }} />
                    </div>
                    <span className="cc-subject-card__stat">{status.state === 'completed' ? '✓' : status.state === 'in-progress' ? '…' : '○'}</span>
                  </div>
                </div>
                {nextCol !== null && <PathSegment fromCol={col} toCol={nextCol} color={gradeWorld.color} />}
              </div>
            );
          })}

          {journey.stages.length === 0 && (
            <div className="cc-row">
              <div className="cc-end-trophy"><span>🗺️</span><Link to="/map" className="cc-end-trophy__label" style={{ color: 'inherit', textDecoration: 'none' }}>Ir al mapa</Link></div>
            </div>
          )}
          {journey.stages.length > 0 && (
            <div className="cc-row">
              <div className="cc-end-trophy">
                <span style={{ filter: `drop-shadow(0 4px 12px ${gradeWorld.color}88)` }}>{gradeWorld.emoji}</span>
                <span className="cc-end-trophy__label">¡Módulo completado!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
