;(function(){
  'use strict';

  const LEVELS = Array.from({length:10}, (_,i)=>(
    {
      level: i+1,
      questions: 6,
      reward: { stars: 10 + i, coins: 5 + Math.floor(i/2) }
    }
  ));

  function buildQuestion(level){
    const roll = Math.random();

    if (level <= 3) {
      const a = rand(12, 60);
      const b = rand(6, 35);
      if (roll < 0.5) {
        const answer = a + b;
        const prompt = `L�na a ${a} billes et elle en re�oit ${b}. Combien en a-t-elle maintenant ?`;
        return withOptions(prompt, answer, 12);
      }
      const big = a + b;
      const answer = big - b;
      const prompt = `L�na a ${big} autocollants et elle en donne ${b}. Combien lui reste-t-il ?`;
      return withOptions(prompt, answer, 12);
    }

    if (level <= 6) {
      if (roll < 0.4) {
        const a = rand(40, 180);
        const b = rand(15, 120);
        const answer = a + b;
        const prompt = `La biblioth�que re�oit ${a} livres le matin et ${b} l'apr�s-midi. Combien de livres au total ?`;
        return withOptions(prompt, answer, 20);
      }
      if (roll < 0.7) {
        const total = rand(120, 280);
        const remove = rand(20, 90);
        const answer = total - remove;
        const prompt = `Dans la bo�te il y a ${total} cartes. On en retire ${remove}. Combien restent-ils ?`;
        return withOptions(prompt, answer, 20);
      }
      const a = rand(3, 9);
      const b = rand(4, 9);
      if (roll < 0.85) {
        const answer = a * b;
        const prompt = `Il y a ${a} paquets de ${b} biscuits. Combien de biscuits en tout ?`;
        return withOptions(prompt, answer, 18);
      }
      const product = a * b;
      const answer = b;
      const prompt = `${product} billes sont partag�es en ${a} groupes �gaux. Combien de billes par groupe ?`;
      return withOptions(prompt, answer, 12);
    }

    if (roll < 0.5) {
      const packs = rand(3, 7);
      const perPack = rand(6, 12);
      const given = rand(4, 18);
      const total = packs * perPack;
      const answer = total - given;
      const prompt = `L�na ach�te ${packs} paquets de ${perPack} autocollants et en offre ${given}. Combien lui en reste-t-il ?`;
      return withOptions(prompt, answer, 25);
    }
    if (roll < 0.8) {
      const tables = rand(4, 8);
      const perTable = rand(4, 7);
      const joined = rand(3, 8);
      const total = tables * perTable + joined;
      const prompt = `Dans la classe il y a ${tables} tables avec ${perTable} �l�ves chacune. ${joined} �l�ves arrivent en plus. Combien d'�l�ves maintenant ?`;
      return withOptions(prompt, total, 30);
    }
    const total = rand(60, 120);
    const groups = rand(3, 6);
    const answer = Math.floor(total / groups);
    const prompt = `On partage ${total} cartes en ${groups} groupes �gaux. Combien de cartes par groupe ?`;
    return withOptions(prompt, answer, 20);
  }

  function withOptions(prompt, answer, spread = 10){
    const options = new Set([answer]);
    while(options.size < 4){
      const noise = answer + rand(-spread, spread);
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
        title: `Niveau ${levelData.level} � Probl�mes Magiques`,
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
    const title = el('div','question-prompt fx-bounce-in-down',`Niveau ${state.levelData.level} � Probl�mes Magiques`);
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
      context.showSuccessMessage('Bravo ! Probl�mes r�solus ?');
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
