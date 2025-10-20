;(function(){
  'use strict';

  function start(context, cfg){
    // cfg: { title, questions:[{prompt, options[], answer}], reward:{stars,coins}, onFinish }
    const state = { i:0, cfg };
    render(context, state);
  }

  function render(context, state){
    const { cfg } = state;
    context.content.innerHTML = '';
    const title = el('div','question-prompt fx-bounce-in-down', cfg.title || 'Question');
    const box = el('div','puzzle-question-container');
    context.content.appendChild(title);
    context.content.appendChild(box);
    context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());
    ask(context, state, box);
  }

  function ask(context, state, box){
    const { cfg } = state;
    const q = cfg.questions[state.i];
    box.innerHTML = '';
    const eq = el('div','puzzle-equation', String(q.prompt));
    const grid = el('div','puzzle-options');
    q.options.forEach((opt)=>{
      const b = el('button','puzzle-option-btn', String(opt));
      b.type='button'; b.dataset.value=String(opt);
      b.addEventListener('click', ()=> answer(context, state, b, grid));
      grid.appendChild(b);
    });
    box.appendChild(eq);
    box.appendChild(grid);
    if (q.say) { context.speakText(q.say); }
  }

  function answer(context, state, btn, grid){
    const { cfg } = state;
    const q = cfg.questions[state.i];
    Array.from(grid.children).forEach(x=> x.disabled = true);
    const isCorrect = String(btn.dataset.value) === String(q.answer);
    if (isCorrect){
      btn.classList.add('is-correct');
      if (cfg.reward) context.awardReward(cfg.reward.stars||0, cfg.reward.coins||0);
      context.playPositiveSound();
      next(context, state);
    } else {
      btn.classList.add('is-wrong');
      const good = grid.querySelector(`[data-value="${q.answer}"]`); if (good) good.classList.add('is-correct');
      context.playNegativeSound();
      context.awardReward(0, -2);
      setTimeout(()=> next(context, state), 900);
    }
  }

  function next(context, state){
    const { cfg } = state;
    state.i++;
    if (state.i >= cfg.questions.length){
      context.markLevelCompleted();
      context.showSuccessMessage('Bravo Léna !');
      context.showConfetti();
      if (typeof cfg.onFinish === 'function') cfg.onFinish();
      setTimeout(()=> context.showLevelMenu(), 1200);
    } else {
      const box = context.content.querySelector('.puzzle-question-container');
      if (box) ask(context, state, box);
    }
  }

  function el(t,c,txt){ const n=document.createElement(t); if(c) n.className=c; if(txt!=null) n.textContent=txt; return n; }

  function el(t, c, txt) {
    const n = document.createElement(t);
    if (c) n.className = c;
    if (txt != null) {
      // Utiliser innerHTML si le texte contient du HTML, sinon textContent
      if (String(txt).includes('<') && String(txt).includes('>')) {
        n.innerHTML = txt;
      } else {
        n.textContent = txt;
      }
    }
    return n;
  }

  window.MCQEngine = { start };
})();
