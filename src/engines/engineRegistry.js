import BaseTenActivity from './base-ten/BaseTenActivity.jsx';
import MultipleChoiceActivity from './multiple-choice/MultipleChoiceActivity.jsx';
import StoryActivity from './story/StoryActivity.jsx';

const registry = Object.freeze({
  'multiple-choice': { id: 'multiple-choice', component: MultipleChoiceActivity },
  'base-ten': { id: 'base-ten', component: BaseTenActivity },
  story: { id: 'story', component: StoryActivity },
  ordering: { id: 'ordering', component: MultipleChoiceActivity },
  matching: { id: 'matching', component: MultipleChoiceActivity },
  fill: { id: 'fill', component: MultipleChoiceActivity },
  'drag-drop': { id: 'drag-drop', component: MultipleChoiceActivity },
  'visual-logic': { id: 'visual-logic', component: MultipleChoiceActivity }
});

export function getEngineRegistry() {
  return registry;
}

export function getEngineDefinition(engineType) {
  return registry[engineType] || registry['multiple-choice'];
}
