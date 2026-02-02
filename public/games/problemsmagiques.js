;(function(){
  'use strict';

  const LEVELS = Array.from({length:10}, (_,i)=>({
    level: i+1,
    questions: 5,
    reward: { stars: 8 + i, coins: 4 + Math.floor(i/2) }
  }));

  function buildQuestion(level){
    // Simple everyday word problems with addition/subtraction
    const a = rand(3, 9 + level);
    const b = rand(2, 7 + Math.floor(level/2));
    const type = Math.random() < 0.5 ? 'add' : 'sub';
    if (type === 'add') {
      const answer = a + b;
      const prompt = `Léna a ${a} billes et elle en reçoit ${b} de plus. Combien a‑t‑elle maintenant ?`;
      return withOptions(prompt, answer);
    } else {
      const big = a + b; // ensure positive
      const answer = big - b;
      const prompt = `Léna a ${big} autocollants et elle en donne ${b}. Combien lui reste‑t‑il ?`;
      return withOptions(prompt, answer);
    }
  }

  function withOptions(prompt, answer){
    const options = new Set([answer]);
    while(options.size < 4){
      const noise = answer + rand(-4, 8);
      if (noise >= 0) options.add(noise);
    }
    const mix = shuffle([...options]);
    return { prompt, answer, options: mix };
  }

  function start(context){
    const idx = Math.max(0, Math.min(LEVELS.length, context.currentLevel) - 1);
    const levelData = LEVELS[idx];
    const questions = Array.from({length: levelData.questions}, ()=>buildQuestion(levelData.level));
    if (window.MCQEngine) {
      window.MCQEngine.start(context, {
        title: `Niveau ${levelData.level} – Problèmes Magiques`,
        questions,
        reward: levelData.reward,
        onFinish: null
      });
      return;
    }
    const state = { i:0, levelData, questions };
    render(context, state);
  }

  function render(context, state){
    context.content.innerHTML = '';
    const title = el('div','question-prompt fx-bounce-in-down',`Niveau ${state.levelData.level} – Problèmes Magiques`);
    const container = el('div','puzzle-question-container');
    context.content.appendChild(title);
    context.content.appendChild(container);
    context.configureBackButton('Retour aux niveaux', () => context.showLevelMenu());
    renderQuestion(context, state, container);
  }

  function renderQuestion(context, state, container){
    container.innerHTML = '';
    const q = state.questions[state.i];
    const prompt = el('div','puzzle-equation', q.prompt);
    const grid = el('div','puzzle-options');
    q.options.forEach(v=>{
      const b = el('button','puzzle-option-btn', String(v));
      b.type = 'button';
      b.dataset.value = String(v);
      b.addEventListener('click', ()=> handle(context, state, b, grid));
      grid.appendChild(b);
    });
    container.appendChild(prompt);
    container.appendChild(grid);
    context.speakText(q.prompt);
  }

  function handle(context, state, btn, grid){
    const q = state.questions[state.i];
    const val = Number(btn.dataset.value);
    Array.from(grid.children).forEach(x=> x.disabled = true);
    if (val === q.answer){
      btn.classList.add('is-correct');
      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      next(context, state);
    } else {
      btn.classList.add('is-wrong');
      const good = grid.querySelector(`[data-value="${q.answer}"]`);
      if (good) good.classList.add('is-correct');
      context.playNegativeSound();
      context.awardReward(0, -2);
      setTimeout(()=> next(context, state), 900);
    }
  }

  function next(context, state){
    state.i++;
    if (state.i >= state.questions.length){
      context.markLevelCompleted();
      context.showSuccessMessage('Bravo ! Problèmes résolus ✨');
      context.showConfetti();
      setTimeout(()=> context.showLevelMenu(), 1200);
    } else {
      renderQuestion(context, state, context.content.querySelector('.puzzle-question-container'));
    }
  }

  function el(tag, cls, text){
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

  window.problemsMagiquesGame = { start, getLevelCount: ()=>LEVELS.length };
})();
