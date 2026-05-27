import { Link, useParams } from 'react-router-dom';
import { getSubjectById, gradeCatalog } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getProgressSnapshot, getLessonProgress } from '../../services/storage/progressStore.js';
import { getLessonsByContext } from '../../content/lessons/lessonsCatalog.js';
import { getGradeJourney } from '../../shared/gameplay/moduleJourney.js';
import { inferLevelNumFromGrade } from '../../services/learning/levelSystem.js';
import { getSubjectUniverse, getGradeWorld, getDomainTheme } from '../../shared/gameplay/subjectThemes.js';

const PATH_COLS  = [1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0];
const NODE_SHAPES = ['circle', 'squircle', 'diamond', 'squircle', 'circle'];

function getLevelNum(activity) {
  return activity.levelNum ?? inferLevelNumFromGrade(activity);
}

function PathSegment({ fromCol, toCol, worldColor }) {
  const colToX = c => [15, 50, 85][c];
  const x1 = colToX(fromCol), x2 = colToX(toCol), cx = (x1 + x2) / 2;
  return (
    <div className="cc-path-segment" aria-hidden="true">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="14" strokeLinecap="round" />
        <path d={`M ${x1} 0 C ${cx} 0, ${cx} 60, ${x2} 60`} fill="none" stroke={worldColor || 'rgba(255,255,255,0.4)'} strokeWidth="6" strokeLinecap="round" strokeDasharray="4 7" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}

export default function GradePage() {
  const { subjectId, gradeId } = useParams();
  const { locale, t } = useLocale();
  const subject = getSubjectById(subjectId);
  const progress = getProgressSnapshot();
  const gradeOptions = gradeCatalog.filter(e => subject?.grades?.includes(e));

  if (!subject) return <section className="panel panel--tight"><h2>{t('subjectNotFound')}</h2></section>;

  const universe  = getSubjectUniverse(subjectId);
  const gradeWorld = getGradeWorld(subjectId, gradeId);

  const gradeJourney = getGradeJourney(subjectId, gradeId, {
    guided: t('practiceMode'), independent: t('continueStep'),
    challenge: t('missionChallengeLabel'), exam: t('missionExamLabel'), review: t('reinforceLabel')
  });

  const modules         = gradeJourney.modules;
  const gradeActivities = gradeJourney.standaloneActivities;

  const moduleActivityIds = new Set(gradeJourney.moduleJourneys.flatMap(j => j.activities.map(a => a.id)));
  const bonusActivities   = gradeActivities.filter(a => !moduleActivityIds.has(a.id));

  const completedModules = gradeJourney.moduleJourneys.filter(j => {
    const done = j.activities.filter(a => progress.activities[a.id]?.completed).length;
    return j.activities.length > 0 && done >= j.activities.length;
  }).length;

  const totalJourneyActivities = gradeJourney.moduleJourneys.reduce((s, j) => s + j.activities.length, 0);
  const overallPct = modules.length ? Math.round((completedModules / modules.length) * 100) : 0;

  // Build flat node list
  const allNodes = [];
  modules.forEach((mod, i) => {
    const journey = gradeJourney.moduleJourneys.find(j => j.module.id === mod.id);
    const total = journey?.activities.length || 0;
    const done  = (journey?.activities || []).filter(a => progress.activities[a.id]?.completed).length;
    const theme = getDomainTheme(mod.domainId, i);
    allNodes.push({ type: 'module', id: mod.id, title: mod.title, domain: mod.domainLabel || mod.domainId, done, total, pct: total ? Math.round((done/total)*100) : 0, theme, launchTo: `/subjects/${subjectId}/grades/${gradeId}/modules/${mod.id}` });
  });

  const stageActs = modules.length ? [] : [...(bonusActivities.length ? bonusActivities : gradeActivities)];
  stageActs.forEach((act, i) => {
    const done  = progress.activities[act.id]?.completed ? 1 : 0;
    const theme = getDomainTheme(act.subskill || act.subject, i);
    allNodes.push({ type: 'activity', id: act.id, title: act.title, domain: act.subskill || act.subject, done, total: 1, pct: done * 100, theme, launchTo: `/activities/${act.id}` });
  });

  const activeNodeId = allNodes.find(n => n.pct < 100)?.id || null;
  const contextLessons = getLessonsByContext(subjectId, gradeId);

  return (
    <div
      className="sw-grade-page"
      style={{
        '--w-color':     gradeWorld.color,
        '--w-shadow':    gradeWorld.shadow,
        '--w-bg':        gradeWorld.bg,
        '--w-sky':       gradeWorld.sky,
        '--uni-accent':  universe.accent,
        '--uni-bg':      universe.accentBg,
      }}
      data-testid={`grade-page-${subjectId}-${gradeId}`}
    >
      {/* Topbar */}
      <div className="cc-topbar sw-grade-topbar">
        <Link className="cc-back-btn" to={`/subjects/${subjectId}`}>←</Link>
        <div className="cc-topbar__title">{gradeWorld.emoji} {gradeWorld.name}</div>
        <div className="cc-topbar__progress">
          <div className="cc-xp-bar"><div className="cc-xp-fill" style={{ width: `${overallPct}%`, background: gradeWorld.bg }} /></div>
          <span className="cc-xp-text" style={{ color: gradeWorld.color }}>{overallPct}%</span>
        </div>
      </div>

      {/* World hero banner */}
      <div className="sw-grade-hero">
        <div className="sw-grade-hero__planet">
          <span>{gradeWorld.emoji}</span>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="sw-grade-hero__orbit-dot" style={{ '--i': i, '--c': gradeWorld.color }}>•</span>
          ))}
        </div>
        <div className="sw-grade-hero__info">
          <span className="sw-grade-hero__subject">{getSubjectLabel(subject, locale, t)}</span>
          <h2 className="sw-grade-hero__name">{gradeWorld.name}</h2>
          <div className="sw-grade-hero__stats">
            <span>{completedModules}/{modules.length || allNodes.length} completados</span>
            <span>·</span>
            <span>{totalJourneyActivities || gradeActivities.length} ejercicios</span>
          </div>
        </div>
      </div>

      {/* Grade switcher */}
      <div className="cc-grade-switcher">
        {gradeOptions.map(g => {
          const gw = getGradeWorld(subjectId, g);
          return (
            <Link key={g} to={`/subjects/${subjectId}/grades/${g}`}
              className={`cc-grade-chip ${g === gradeId ? 'cc-grade-chip--active' : ''}`}
              style={g === gradeId ? { background: gradeWorld.bg, borderColor: gradeWorld.color, color: 'white' } : {}}>
              {gw.emoji} {g}
            </Link>
          );
        })}
      </div>

      {/* Missions path */}
      <div className="sw-grade-path">
        {allNodes.length === 0 && (
          <div className="cc-end-trophy">
            <span>🗺️</span>
            <Link to="/map" className="cc-end-trophy__label" style={{ color: 'inherit', textDecoration: 'none' }}>Ver el mapa de aventura</Link>
          </div>
        )}

        <div className="cc-grid">
          {allNodes.map((node, index) => {
            const col      = PATH_COLS[index % PATH_COLS.length];
            const nextCol  = index < allNodes.length - 1 ? PATH_COLS[(index + 1) % PATH_COLS.length] : null;
            const shape    = NODE_SHAPES[index % NODE_SHAPES.length];
            const colClass = ['cc-col--left', 'cc-col--center', 'cc-col--right'][col];
            const isActive = node.id === activeNodeId;
            const complete = node.pct === 100 && node.total > 0;

            return (
              <div key={node.id} className="cc-row">
                <div className="cc-node-slot">
                  <Link to={node.launchTo} className="cc-node-link">
                    <div
                      className={`cc-node ${isActive ? 'cc-node--current' : ''} ${complete ? 'cc-node--complete' : ''} cc-node--${shape} ${colClass}`}
                      style={{ '--node-color': node.theme.color, '--node-shadow': node.theme.shadow, '--node-bg': node.theme.bg, animationDelay: `${index * 70}ms` }}
                    >
                      {isActive && <div className="cc-node__arrow" style={{ color: gradeWorld.color }}>▼</div>}
                      <div className="cc-node__body">
                        <span className="cc-node__emoji">{node.type === 'module' ? '📘' : '⚡'}</span>
                        {complete && <div className="cc-node__crown">✓</div>}
                      </div>
                      <div className="cc-node__label"><span className="cc-node__num">{index + 1}</span></div>
                      <div className="cc-stars">
                        {[33, 66, 100].map((thr, i) => (
                          <span key={i} className={node.pct >= thr ? 'cc-star cc-star--on' : 'cc-star cc-star--off'}>★</span>
                        ))}
                      </div>
                      <div className="cc-node__type-badge" style={{ background: node.theme.color }}>
                        {node.domain?.slice(0, 12) || (node.type === 'module' ? 'Módulo' : 'Ejercicio')}
                      </div>
                      {isActive && <div className="cc-node__pulse" />}
                    </div>
                    <span className="cc-node__title">{node.title}</span>
                  </Link>
                </div>
                {nextCol !== null && <PathSegment fromCol={col} toCol={nextCol} worldColor={gradeWorld.color} />}
              </div>
            );
          })}

          {allNodes.length > 0 && (
            <div className="cc-row">
              <div className="cc-end-trophy">
                <span style={{ filter: `drop-shadow(0 4px 12px ${gradeWorld.color}88)` }}>{gradeWorld.emoji}</span>
                <span className="cc-end-trophy__label">¡{gradeWorld.name} completado!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {contextLessons.length > 0 && (
        <div className="sw-grade-lessons">
          <div className="sw-grade-lessons__header">
            <span className="sw-grade-lessons__eyebrow">📚 Leçons disponibles</span>
          </div>
          <div className="sw-grade-lessons__strip">
            {contextLessons.map(lesson => {
              const prog = getLessonProgress(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  to={`/lessons/${lesson.id}`}
                  className="sw-grade-lesson-card"
                  style={{ '--lp-color': lesson.color, '--lp-shadow': lesson.shadow, '--lp-bg': lesson.bg }}
                >
                  <span className="sw-grade-lesson-card__emoji">{lesson.emoji}</span>
                  <div className="sw-grade-lesson-card__body">
                    <strong className="sw-grade-lesson-card__title">{lesson.title}</strong>
                    <span className="sw-grade-lesson-card__meta">{lesson.duration} · {lesson.slides.length} étapes</span>
                  </div>
                  {prog.completed && <span className="sw-grade-lesson-card__done">✓</span>}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
