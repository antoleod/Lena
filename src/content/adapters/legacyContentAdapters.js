import {
  defineModule,
  defineSubject
} from '../../shared/types/index.js';
import {
  createRenderableExercise,
  createRenderableOption,
  createTextContextSlots
} from '../../engines/activity-engine/index.js';

function cloneList(list) {
  return Array.isArray(list) ? [...list] : [];
}

function uniqueList(list) {
  return [...new Set(cloneList(list).filter(Boolean))];
}

function slugFragment(value, fallback) {
  return String(value || fallback || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || String(fallback || 'item');
}

function createOptionRecords(choices = [], answer) {
  const options = cloneList(choices).map((choice, index) => {
    const value = String(choice);
    return createRenderableOption({
      id: `option-${slugFragment(value, index + 1)}-${index + 1}`,
      value,
      label: value
    });
  });

  const correctMatch = options.find((option) => option.value === String(answer));
  return {
    options,
    correctOptionIds: correctMatch ? [correctMatch.id] : []
  };
}

function normalizeExerciseType(activity) {
  switch (activity.engineType) {
    case 'base-ten':
      return 'fill-number';
    case 'story':
      return 'multiple-choice';
    default:
      return 'multiple-choice';
  }
}

function createExerciseBase(activity, exerciseId, prompt, extra = {}) {
  return {
    id: exerciseId,
    sourceActivityId: activity.id,
    sourceQuestionId: exerciseId,
    subjectId: activity.subject,
    gradeId: activity.gradeBand?.[0] || 'P2',
    renderType: normalizeExerciseType(activity),
    prompt,
    instruction: activity.instructions || '',
    contextSlots: [],
    acceptedValues: [],
    feedback: {
      hint: activity.hints?.[0] || '',
      explanation: '',
      successText: '',
      errorText: ''
    },
    meta: {
      rewardValue: 0,
      difficulty: activity.difficulty || '',
      tags: uniqueList([...(activity.tags || []), activity.subskill]),
      correctionType: activity.correctionType || 'auto',
      accessibility: cloneList(activity.accessibility)
    },
    ...extra
  };
}

function adaptMultipleChoiceExercises(activity) {
  const sections = activity.sections || [
    {
      id: 'default',
      title: activity.title,
      kind: 'practice',
      lessons: cloneList(activity.lessons)
    }
  ];

  return sections.flatMap((section, sectionIndex) =>
    cloneList(section.lessons).map((lesson, lessonIndex) => {
      const optionData = createOptionRecords(lesson.choices || lesson.options, lesson.answer);
      return createRenderableExercise({
        ...createExerciseBase(
          activity,
          `${activity.id}::${section.id || `section-${sectionIndex + 1}`}::${lesson.id || lessonIndex + 1}`,
          lesson.prompt || lesson.question,
          {
            options: optionData.options,
            correctOptionIds: optionData.correctOptionIds,
            contextSlots: createTextContextSlots(
              lesson.context,
              `${activity.id}-context-${section.id || sectionIndex + 1}-${lesson.id || lessonIndex + 1}`
            ),
            feedback: {
              hint: lesson.hint || activity.hints?.[0] || '',
              explanation: lesson.explanation || '',
              successText: '',
              errorText: ''
            },
            meta: {
              difficulty: lesson.level || activity.difficulty || '',
              rewardValue: 0,
              correctionType: activity.correctionType || 'auto',
              accessibility: cloneList(activity.accessibility),
              tags: uniqueList([
                ...(activity.tags || []),
                activity.subskill,
                section.kind,
                section.title
              ])
            }
          }
        )
      });
    })
  );
}

function adaptBaseTenExercises(activity) {
  return cloneList(activity.levels).map((level, index) => {
    const expectedValue = String(level.target);
    const option = createRenderableOption({
      id: `${activity.id}::target::${index + 1}`,
      value: expectedValue,
      label: expectedValue
    });

    return createRenderableExercise({
      ...createExerciseBase(
        activity,
        `${activity.id}::level::${index + 1}`,
        `Build the number ${level.target}`,
        {
          renderType: 'fill-number',
          options: [option],
          correctOptionIds: [option.id],
          acceptedValues: [expectedValue],
          contextSlots: level.hint ? createTextContextSlots([level.hint], `${activity.id}-hint-${index + 1}`) : [],
          feedback: {
            hint: level.hint || '',
            explanation: level.hint || '',
            successText: '',
            errorText: ''
          },
          meta: {
            rewardValue: 0,
            difficulty: activity.difficulty || '',
            correctionType: activity.correctionType || 'manual',
            accessibility: cloneList(activity.accessibility),
            tags: uniqueList([...(activity.tags || []), activity.subskill, 'base-ten'])
          }
        }
      )
    });
  });
}

function adaptStoryExercises(activity) {
  return cloneList(activity.stories).flatMap((story, storyIndex) =>
    cloneList(story.quiz).map((question, questionIndex) => {
      const optionData = createOptionRecords(question.choices, question.answer);
      return createRenderableExercise({
        ...createExerciseBase(
          activity,
          `${activity.id}::story-${story.id || storyIndex + 1}::question-${questionIndex + 1}`,
          question.prompt,
          {
            options: optionData.options,
            correctOptionIds: optionData.correctOptionIds,
            contextSlots: createTextContextSlots(
              story.text,
              `${activity.id}-story-${story.id || storyIndex + 1}`
            ),
            feedback: {
              hint: activity.hints?.[0] || '',
              explanation: question.explanation || '',
              successText: '',
              errorText: ''
            },
            meta: {
              rewardValue: 0,
              difficulty: activity.difficulty || '',
              correctionType: activity.correctionType || 'auto',
              accessibility: cloneList(activity.accessibility),
              tags: uniqueList([
                ...(activity.tags || []),
                activity.subskill,
                'story',
                slugFragment(story.theme, `theme-${storyIndex + 1}`)
              ])
            }
          }
        )
      });
    })
  );
}

function adaptGeneratedSectionPlan(activity) {
  return cloneList(activity.generatorConfig?.sections).map((section, index) => Object.freeze({
    id: section.id || `generated-section-${index + 1}`,
    title: section.title || `Section ${index + 1}`,
    kind: section.kind || 'practice',
    plannedExerciseCount: section.count || 0,
    exerciseIds: []
  }));
}

function adaptStaticSectionPlan(activity, exercises) {
  if (activity.engineType === 'base-ten') {
    return [
      Object.freeze({
        id: 'base-ten',
        title: activity.title,
        kind: 'practice',
        plannedExerciseCount: exercises.length,
        exerciseIds: exercises.map((exercise) => exercise.id)
      })
    ];
  }

  if (activity.engineType === 'story') {
    return cloneList(activity.stories).map((story, storyIndex) => {
      const prefix = `${activity.id}::story-${story.id || storyIndex + 1}::`;
      return Object.freeze({
        id: story.id || `story-${storyIndex + 1}`,
        title: story.title,
        kind: 'story',
        plannedExerciseCount: cloneList(story.quiz).length,
        exerciseIds: exercises
          .filter((exercise) => exercise.id.startsWith(prefix))
          .map((exercise) => exercise.id)
      });
    });
  }

  return cloneList(activity.sections).map((section, sectionIndex) => {
    const prefix = `${activity.id}::${section.id || `section-${sectionIndex + 1}`}::`;
    return Object.freeze({
      id: section.id || `section-${sectionIndex + 1}`,
      title: section.title || activity.title,
      kind: section.kind || 'practice',
      plannedExerciseCount: cloneList(section.lessons).length,
      exerciseIds: exercises
        .filter((exercise) => exercise.id.startsWith(prefix))
        .map((exercise) => exercise.id)
    });
  });
}

export function adaptLegacySubject(subject) {
  return defineSubject({
    id: subject.id,
    label: subject.label,
    grades: cloneList(subject.grades),
    description: subject.description || '',
    color: subject.color || '',
    accent: subject.accent || '',
    roadmap: cloneList(subject.roadmap)
  });
}

export function adaptLegacyModule(module) {
  return defineModule({
    id: module.id,
    subjectId: module.subjectId,
    gradeId: module.gradeId,
    domainId: module.domainId,
    domainLabel: module.domainLabel || '',
    title: module.title,
    summary: module.summary,
    goal: module.phases?.introduction || '',
    demo: module.phases?.demonstration || '',
    activityIds: uniqueList([
      ...(module.phases?.guidedPractice || []),
      ...(module.phases?.independentPractice || []),
      module.phases?.miniChallenge,
      module.phases?.miniExam,
      ...(module.phases?.suggestedReview || [])
    ]),
    levelIds: [],
    tags: uniqueList([module.gradeId, module.domainId, module.subjectId])
  });
}

export function adaptLegacyActivity(activity) {
  let exercises = [];

  if (activity.engineType === 'base-ten') {
    exercises = adaptBaseTenExercises(activity);
  } else if (activity.engineType === 'story') {
    exercises = adaptStoryExercises(activity);
  } else if (activity.sections || activity.lessons) {
    exercises = adaptMultipleChoiceExercises(activity);
  }

  return Object.freeze({
    id: activity.id,
    sourceActivityId: activity.id,
    slug: activity.slug || activity.id,
    title: activity.title,
    subjectId: activity.subject,
    gradeIds: cloneList(activity.gradeBand),
    language: activity.language || 'fr',
    engineType: activity.engineType || 'multiple-choice',
    estimatedDurationMin: activity.estimatedDurationMin || 0,
    instructions: activity.instructions || '',
    correctionType: activity.correctionType || '',
    hints: cloneList(activity.hints),
    tags: uniqueList([...(activity.tags || []), activity.subskill]),
    generated: Boolean(activity.generatorConfig),
    generatorConfig: activity.generatorConfig || null,
    sectionPlan: activity.generatorConfig
      ? adaptGeneratedSectionPlan(activity)
      : adaptStaticSectionPlan(activity, exercises),
    exerciseIds: exercises.map((exercise) => exercise.id),
    exercises
  });
}

export function buildLegacyContentContracts({ subjects = [], modules = [], activities = [] }) {
  const adaptedSubjects = subjects.map(adaptLegacySubject);
  const adaptedModules = modules.map(adaptLegacyModule);
  const adaptedActivities = activities.map(adaptLegacyActivity);
  const adaptedExercises = adaptedActivities.flatMap((activity) => activity.exercises);

  return Object.freeze({
    subjects: adaptedSubjects,
    modules: adaptedModules,
    activities: adaptedActivities,
    exercises: adaptedExercises,
    subjectById: Object.freeze(Object.fromEntries(adaptedSubjects.map((entry) => [entry.id, entry]))),
    moduleById: Object.freeze(Object.fromEntries(adaptedModules.map((entry) => [entry.id, entry]))),
    activityById: Object.freeze(Object.fromEntries(adaptedActivities.map((entry) => [entry.id, entry]))),
    exerciseById: Object.freeze(Object.fromEntries(adaptedExercises.map((entry) => [entry.id, entry])))
  });
}
