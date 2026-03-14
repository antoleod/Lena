export function createModule({
  id,
  subjectId,
  gradeId,
  domainId,
  domainLabel,
  title,
  summary,
  goal,
  demo,
  guidedActivityIds,
  independentActivityIds,
  challengeActivityId,
  examActivityId,
  suggestedReviewIds = [],
  missionTitle,
  missionSummary,
  levelTitles = {}
}) {
  const levelActivityIds = [
    ...(guidedActivityIds || []),
    ...(independentActivityIds || []),
    ...(challengeActivityId ? [challengeActivityId] : []),
    ...(examActivityId ? [examActivityId] : [])
  ];

  const levels = levelActivityIds.map((activityId, index) => ({
    id: `${id}::level-${index + 1}`,
    order: index + 1,
    title: levelTitles[activityId] || `Level ${index + 1}`,
    activityId
  }));

  return {
    id,
    subjectId,
    gradeId,
    domainId,
    domainLabel,
    title,
    summary,
    mission: {
      id: `${id}::mission`,
      title: missionTitle || title,
      summary: missionSummary || summary,
      levels
    },
    phases: {
      introduction: `${summary} ${goal}`,
      demonstration: demo,
      guidedPractice: guidedActivityIds,
      independentPractice: independentActivityIds,
      miniChallenge: challengeActivityId,
      miniExam: examActivityId,
      reward: 'crystals-stars-store',
      suggestedReview: suggestedReviewIds
    }
  };
}
