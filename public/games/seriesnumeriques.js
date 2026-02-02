;(function(){
  'use strict';

  function rand(a,b){ if (a > b) [a,b] = [b,a]; return Math.floor(Math.random()*(b-a+1))+a; }

  const LEVELS = Array.from({length:12},(_,i)=>({ level:i+1, count:rand(6,8), reward:{stars:10+i, coins:5+Math.floor(i/3)} }));

  function build(level){
    // arithmetic progression with missing value
    const start = rand(1, 10 + level * 2);
    const step = rand(1, Math.max(2, Math.floor(level/2)+1));
    const len = 5;
    const seq = Array.from({length:len}, (_,i)=> start + i*step);
    const missingIndex = rand(1, len-2);
    const answer = seq[missingIndex];
    const shown = seq.map((v,i)=> i===missingIndex ? '…' : v);
    const prompt = `Complète la série: ${shown.join('  ')}`;
    
    const opts = new Set([answer]);
    let safety = 0;
    while(opts.size < 4 && safety < 50){
        const delta = rand(1, step * 2);
        const sign = Math.random() < 0.5 ? -1 : 1;
        opts.add(answer + delta * sign);
        safety++;
    }
    // Ensure we have 4 distinct options
    while(opts.size < 4) {
        opts.add(answer + rand(step + 1, step * 3) * (Math.random() < 0.5 ? -1 : 1));
    }

    const finalOptions = shuffle([...opts]);
    if (!finalOptions.includes(answer)) {
        finalOptions[rand(0, finalOptions.length - 1)] = answer;
    }

    return { prompt, answer, options: finalOptions.slice(0, 4) };
  }

  function start(context){
    const idx = Math.max(0, Math.min(LEVELS.length, context.currentLevel)-1);
    const L = LEVELS[idx];
    const qs = Array.from({length:L.count}, ()=> build(L.level));
    if (window.MCQEngine){
      window.MCQEngine.start(context, { title:`Niveau ${L.level} – Séries Numériques`, questions: qs, reward: L.reward });
      return;
    }
    const s = {i:0, L, qs};
    draw(context,s);
  }
  function draw(context,s){
    context.content.innerHTML='';
    context.content.appendChild(div('question-prompt fx-bounce-in-down',`Niveau ${s.L.level} – Séries Numériques`));
    const box = div('puzzle-question-container'); context.content.appendChild(box);
    context.configureBackButton('Retour aux niveaux', ()=> context.showLevelMenu());
    ask(context,s,box);
  }
  function ask(context,s,box){
    box.innerHTML=''; const q=s.qs[s.i]; box.appendChild(div('puzzle-equation', q.prompt + ' 🔢'));
    const grid = div('puzzle-options');
    q.options.forEach(o=>{ const b=btn(String(o)); b.dataset.value=String(o); b.addEventListener('click',()=>ans(context,s,b,grid)); grid.appendChild(b); });
    box.appendChild(grid);
  }
  function ans(context,s,b,grid){ const q=s.qs[s.i]; Array.from(grid.children).forEach(x=>x.disabled=true); if(Number(b.dataset.value)===q.answer){ b.classList.add('is-correct'); context.playPositiveSound(); context.awardReward(s.L.reward.stars,s.L.reward.coins); nxt(context,s);} else { b.classList.add('is-wrong'); const g=grid.querySelector(`[data-value="${q.answer}"]`); if(g) g.classList.add('is-correct'); context.playNegativeSound(); context.awardReward(0,-2); setTimeout(()=>nxt(context,s),900);} }
  function nxt(context,s){ s.i++; if(s.i>=s.qs.length){ context.markLevelCompleted(); context.showSuccessMessage('Bien joué !'); context.showConfetti(); setTimeout(()=>context.showLevelMenu(),1200);} else { ask(context,s, context.content.querySelector('.puzzle-question-container')); } }

  function div(c,t){ const d=document.createElement('div'); if(c) d.className=c; if(t!=null) d.textContent=t; return d; }
  function btn(t){ const b=document.createElement('button'); b.type='button'; b.className='puzzle-option-btn'; b.textContent=t; return b; }
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

  window.seriesNumeriquesGame = { start, getLevelCount: ()=>LEVELS.length };
})();