;(function(){
  'use strict';

  const LEVELS = Array.from({length:10}, (_,i)=>({ level:i+1, count:7, reward:{stars:10+i, coins:5+Math.floor(i/2)} }));

  function question(level){
    // Show simple fraction of a pizza: choose fraction text that matches
    const denominators = [2,3,4,6,8];
    const d = denominators[Math.min(denominators.length-1, Math.floor((level-1)/2))];
    const n = Math.floor(Math.random()* (d-1)) + 1; // 1..d-1
    const prompt = `Quelle fraction est coloriée ? (${n}/${d})`;
    const correct = `${n}/${d}`;
    const opts = new Set([correct]);
    while(opts.size<4){
      const nn = Math.max(1, n + rand(-1,1));
      const dd = d + rand(-1,1);
      const s = `${nn}/${Math.max(2,dd)}`;
      opts.add(s);
    }
    return { prompt, answer: correct, options: shuffle([...opts]) };
  }

  function start(context){
    const idx = Math.max(0, Math.min(LEVELS.length, context.currentLevel)-1);
    const levelData = LEVELS[idx];
    const qs = Array.from({length:levelData.count}, ()=>question(levelData.level));
    if (window.MCQEngine){
      window.MCQEngine.start(context, { title:`Niveau ${levelData.level} – Fractions Fantastiques`, questions: qs, reward: levelData.reward });
      return;
    }
    const state = { i:0, levelData, qs };
    draw(context,state);
  }

  function draw(context,state){
    context.content.innerHTML = '';
    const title = mk('div','question-prompt fx-bounce-in-down',`Niveau ${state.levelData.level} – Fractions Fantastiques`);
    const container = mk('div','puzzle-question-container');
    context.content.appendChild(title);
    context.content.appendChild(container);
    context.configureBackButton('Retour aux niveaux', ()=> context.showLevelMenu());
    drawQ(context,state,container);
  }

  function drawQ(context,state,container){
    container.innerHTML = '';
    const q = state.qs[state.i];
    const visual = mk('div','puzzle-equation', q.prompt + ' 🍰');
    const grid = mk('div','puzzle-options');
    q.options.forEach(o=>{
      const b = mk('button','puzzle-option-btn', o);
      b.type='button'; b.dataset.value=o;
      b.addEventListener('click', ()=> onAnswer(context,state,b,grid));
      grid.appendChild(b);
    });
    container.appendChild(visual);
    container.appendChild(grid);
  }

  function onAnswer(context,state,btn,grid){
    const q = state.qs[state.i];
    Array.from(grid.children).forEach(x=>x.disabled=true);
    if (btn.dataset.value===q.answer){
      btn.classList.add('is-correct');
      context.playPositiveSound();
      context.awardReward(state.levelData.reward.stars, state.levelData.reward.coins);
      advance(context,state);
    } else {
      btn.classList.add('is-wrong');
      const good = grid.querySelector(`[data-value="${q.answer}"]`); if(good) good.classList.add('is-correct');
      context.playNegativeSound();
      context.awardReward(0,-2);
      setTimeout(()=>advance(context,state),900);
    }
  }

  function advance(context,state){
    state.i++;
    if (state.i>=state.qs.length){
      context.markLevelCompleted();
      context.showSuccessMessage('Super ! Tu comprends les fractions ✨');
      context.showConfetti();
      setTimeout(()=> context.showLevelMenu(), 1200);
    } else {
      drawQ(context,state, context.content.querySelector('.puzzle-question-container'));
    }
  }

  function mk(t,c,txt){ const n=document.createElement(t); if(c) n.className=c; if(txt!=null) n.textContent=txt; return n; }
  function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

  window.fractionsFantastiquesGame = { start, getLevelCount: ()=>LEVELS.length };
})();
