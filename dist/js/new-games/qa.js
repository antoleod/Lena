;(function () {
  'use strict';

  const registry = window.newGamesRegistry;
  if (!registry) { return; }

  function runQA() {
    const results = [];
    registry.games.forEach((game) => {
      const issues = [];
      if (!game.levels || game.levels.length !== 10) {
        issues.push(`levels=${game.levels ? game.levels.length : 0}`);
      }
      const expectedCount = game.exercisesPerLevel;
      game.levels.forEach((level) => {
        if (!level.exercises || level.exercises.length !== expectedCount) {
          issues.push(`level ${level.level} exercises=${level.exercises ? level.exercises.length : 0}`);
        }
        (level.exercises || []).forEach((exercise, index) => {
          if (!exercise || !exercise.type) {
            issues.push(`level ${level.level} #${index + 1} missing type`);
          }
          if (!exercise.promptKey) {
            issues.push(`level ${level.level} #${index + 1} missing promptKey`);
          }
          if (exercise.type === 'chips' && typeof exercise.answer === 'undefined') {
            issues.push(`level ${level.level} #${index + 1} missing answer`);
          }
          if (exercise.type === 'build' && typeof exercise.target !== 'number') {
            issues.push(`level ${level.level} #${index + 1} missing target`);
          }
          if (exercise.type === 'subtract' && typeof exercise.subtrahend !== 'number') {
            issues.push(`level ${level.level} #${index + 1} missing subtrahend`);
          }
        });
      });
      results.push({
        id: game.id,
        status: issues.length ? 'FAIL' : 'PASS',
        issues
      });
    });
    return {
      status: results.every(r => r.status === 'PASS') ? 'PASS' : 'FAIL',
      games: results
    };
  }

  function renderPanel(report) {
    let panel = document.getElementById('ng-qa-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'ng-qa-panel';
      panel.style.position = 'fixed';
      panel.style.right = '16px';
      panel.style.bottom = '16px';
      panel.style.background = '#fff';
      panel.style.borderRadius = '12px';
      panel.style.padding = '12px';
      panel.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
      panel.style.fontFamily = 'sans-serif';
      panel.style.fontSize = '12px';
      panel.style.zIndex = 9999;
      document.body.appendChild(panel);
    }
    panel.innerHTML = `
      <strong>QA ${report.status}</strong><br/>
      ${report.games.map(g => `${g.id}: ${g.status}`).join('<br/>')}
      <div style="margin-top:6px;color:#666;">Lang: ${(window.i18n?.getLanguage && window.i18n.getLanguage()) || 'fr'}</div>
    `;
  }

  function togglePanel() {
    const report = runQA();
    const existing = document.getElementById('ng-qa-panel');
    if (existing) {
      existing.remove();
      return;
    }
    renderPanel(report);
  }

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyD') {
      togglePanel();
    }
  });

  window.runNewGamesQA = runQA;
})();
