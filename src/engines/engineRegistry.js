import BaseTenActivity from './base-ten/BaseTenActivity.jsx';
import MultipleChoiceActivity from './multiple-choice/MultipleChoiceActivity.jsx';
import StoryActivity from './story/StoryActivity.jsx';
import ColoringActivity from './renforcement/coloring/ColoringActivity.jsx';
import TraceActivity from './renforcement/trace/TraceActivity.jsx';
import GridActivity from './renforcement/grid/GridActivity.jsx';
import SpotDifferenceActivity from './renforcement/observe/SpotDifferenceActivity.jsx';

const registry = Object.freeze({
  'multiple-choice': { id: 'multiple-choice', component: MultipleChoiceActivity },
  'base-ten': { id: 'base-ten', component: BaseTenActivity },
  story: { id: 'story', component: StoryActivity },
  ordering: { id: 'ordering', component: MultipleChoiceActivity },
  matching: { id: 'matching', component: MultipleChoiceActivity },
  fill: { id: 'fill', component: MultipleChoiceActivity },
  'fill-word': { id: 'fill-word', component: MultipleChoiceActivity },
  'fill-sentence': { id: 'fill-sentence', component: MultipleChoiceActivity },
  'fill-number': { id: 'fill-number', component: MultipleChoiceActivity },
  comparison: { id: 'comparison', component: MultipleChoiceActivity },
  sequence: { id: 'sequence', component: MultipleChoiceActivity },
  'drag-drop': { id: 'drag-drop', component: MultipleChoiceActivity },
  'visual-logic': { id: 'visual-logic', component: MultipleChoiceActivity },
  coloring: { id: 'coloring', component: ColoringActivity },
  trace: { id: 'trace', component: TraceActivity },
  grid: { id: 'grid', component: GridActivity },
  'spot-difference': { id: 'spot-difference', component: SpotDifferenceActivity }
});

export function getEngineRegistry() {
  return registry;
}

export function getEngineDefinition(engineType) {
  return registry[engineType] || registry['multiple-choice'];
}
