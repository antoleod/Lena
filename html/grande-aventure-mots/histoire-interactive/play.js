(function () {
  'use strict';

  const SETTINGS = window.HISTOIRE_INTERACTIVE_SETTINGS || { storageKey: 'gam_histoire_interactive' };
  const LEVELS = window.HISTOIRE_INTERACTIVE_LEVELS || [];

  const elements = {
    title: document.getElementById('levelTitle'),
    description: document.getElementById('levelDescription'),
    counter: document.getElementById('progressCounter'),
    feedback: document.getElementById('feedback'),
    storyText: document.getElementById('storyText'),
    choicesContainer: document.getElementById('choicesContainer'),
    replay: document.getElementById('btnReplay'),
    back: document.getElementById('btnBack')
  };

  const query = new URLSearchParams(window.location.search);
  const levelId = query.get('level') || 'niveau1';
  const level = LEVELS.find(item => item.id === levelId) || LEVELS[0];
  if (!level) {
    elements.description.textContent = 'Aucun niveau disponible pour le moment.';
    return;
  }

  const story = level.story;
  let currentNodeKey = story.start;

  function updateTitle() {
    if (elements.title) {
      elements.title.innerHTML = `<span>🌟</span>${level.title}`;
    }
    if (elements.description) {
      const intro = SETTINGS.introText ? `${SETTINGS.introText}
` : '';
      elements.description.textContent = `${intro}${level.description || ''}`.trim();
    }
  }

  function renderNode() {
    const node = story.nodes[currentNodeKey];
    if (!node) { return; }

    elements.storyText.textContent = node.text;
    GAM.speak(node.text);

    elements.choicesContainer.innerHTML = '';
    if (node.choices && node.choices.length > 0) {
      node.choices.forEach(choice => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'action-btn';
        button.textContent = choice.text;
        button.addEventListener('click', () => {
          currentNodeKey = choice.target;
          renderNode();
        });
        elements.choicesContainer.appendChild(button);
      });
    } else {
      // End of story
      GAM.markCompleted(SETTINGS.storageKey, level.id, 1);
      GAM.playConfetti();
      elements.feedback.textContent = 'Histoire terminée !';
      const restartButton = document.createElement('button');
      restartButton.type = 'button';
      restartButton.className = 'action-btn';
      restartButton.textContent = 'Recommencer l’histoire';
      restartButton.addEventListener('click', () => {
        currentNodeKey = story.start;
        renderNode();
        elements.feedback.textContent = '';
      });
      elements.choicesContainer.appendChild(restartButton);
    }
  }

  function initControls() {
    if (elements.back) {
      elements.back.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
    if (elements.replay) {
      elements.replay.addEventListener('click', () => {
        const node = story.nodes[currentNodeKey];
        if (node) {
          GAM.speak(node.text);
        }
      });
    }
  }

  function init() {
    updateTitle();
    initControls();
    renderNode();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
