import { Link, useParams } from 'react-router-dom';
import { getModuleById, getSubjectById } from '../curriculum/catalog.js';
import { useLocale } from '../../shared/i18n/LocaleContext.jsx';
import { getSubjectLabel } from '../../shared/i18n/contentLocalization.js';
import { getModuleJourney } from '../../shared/gameplay/moduleJourney.js';
import { getProgressSnapshot } from '../../services/storage/progressStore.js';
import { getGradeWorld, getDomainTheme } from '../../shared/gameplay/subjectThemes.js';
import IslandPath from '../grade/IslandPath.jsx';

// Each module stage gets a type-specific glyph (lesson/practice/challenge/exam/review).
const STAGE_CONFIG = {
  guided:      { emoji: '📖', label: 'Guiado' },
  independent: { emoji: '🧠', label: 'Autónomo' },
  challenge:   { emoji: '⚡', label: 'Desafío' },
  exam:        { emoji: '🏁', label: 'Examen' },
  review:      { emoji: '🔄', label: 'Revisión' },
};

function getStageStatus(stage, progress) {
  const total     = stage.activities.length;
  const completed = stage.activities.filter(a => progress.activities[a.id]?.completed).length;
  return { total, completed, state: completed >= total && total > 0 ? 'completed' : completed > 0 ? 'in-progress' : 'available' };
}

function getResume(activities, progress) {
  return activities.find(a => !progress.activities[a.id]?.completed) || activities[0] || null;
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

      {/* Stages path — floating-island adventure (same language as the grade map) */}
      <IslandPath
        nodes={journey.stages.map((stage) => {
          const status  = getStageStatus(stage, progress);
          const nextAct = getResume(stage.activities, progress);
          const pct     = status.total ? Math.round((status.completed / status.total) * 100) : 0;
          return {
            id: stage.id,
            title: stage.title,
            launchTo: nextAct ? `/activities/${nextAct.id}?module=${module.id}` : `/subjects/${subjectId}/grades/${gradeId}`,
            pct,
            isActive: stage.id === activeStageId,
            complete: status.state === 'completed',
            glyph: (STAGE_CONFIG[stage.id] || STAGE_CONFIG.guided).emoji,
          };
        })}
        badgeColor={gradeWorld.color}
        endIcon={gradeWorld.emoji}
        endLabel="¡Módulo completado!"
        emptyFallback={{ icon: '🗺️', label: 'Ir al mapa', to: '/map' }}
      />
    </div>
  );
}
