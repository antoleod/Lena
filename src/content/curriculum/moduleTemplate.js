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
  suggestedReviewIds = []
}) {
  return {
    id,
    subjectId,
    gradeId,
    domainId,
    domainLabel,
    title,
    summary,
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
