;(function(){
  'use strict';

  const LEVELS = Array.from({length:10},(_,i)=>({ level:i+1, count:8, reward:{stars:11+i, coins:5+Math.floor(i/3)} }));

  function qFor(level){
    const table = Math.min(10, 2 + Math.floor((level-1)/1)); // ramp 2..10
    const a = table;
    const b = rand(2, 10);
    const answer = a*b;
    const prompt = `Calcule: ${a} × ${b}`;
    const opts = new Set([answer]);
    while(opts.size<4){
      opts.add(answer + rand(-5,8));
    }
    return { prompt, answer, options: shuffle([...opts]) };
  }

  function start(context){
    const idx = Math.max(0, Math.min(LEVELS.length, context.currentLevel)-1);
    const L = LEVELS[idx];
    const qs = Array.from({length:L.count}, ()=> qFor(L.level));
    if (window.MCQEngine){
      window.MCQEngine.start(context, { title:`Niveau ${L.level} – Tables Défi`, questions: qs, reward: L.reward });
      return;
    }
    const s = {i:0, L, qs};
    render(context,s);
  }
  function render(context,s){
    context.content.innerHTML='';
    context.content.appendChild(div('question-prompt fx-bounce-in-down',`Niveau ${s.L.level} – Tables Défi`));
    const box = div('puzzle-question-container'); context.content.appendChild(box);
    context.configureBackButton('Retour aux niveaux', ()=> context.showLevelMenu());
    showQ(context,s,box);
  }
  function showQ(context,s,box){
    box.innerHTML=''; const q=s.qs[s.i]; box.appendChild(div('puzzle-equation', q.prompt + ' ✖️'));
    const grid = div('puzzle-options');
    q.options.forEach(o=>{ const b=btn(String(o)); b.dataset.value=String(o); b.addEventListener('click',()=>ans(context,s,b,grid)); grid.appendChild(b); });
    box.appendChild(grid);
  }
  function ans(context,s,b,grid){ const q=s.qs[s.i]; Array.from(grid.children).forEach(x=>x.disabled=true); if(Number(b.dataset.value)===q.answer){ b.classList.add('is-correct'); context.playPositiveSound(); context.awardReward(s.L.reward.stars,s.L.reward.coins); nxt(context,s);} else { b.classList.add('is-wrong'); const g=grid.querySelector(`[data-value="${q.answer}"]`); if(g) g.classList.add('is-correct'); context.playNegativeSound(); context.awardReward(0,-2); setTimeout(()=>nxt(context,s),900);} }
  function nxt(context,s){ s.i++; if(s.i>=s.qs.length){ context.markLevelCompleted(); context.showSuccessMessage('Record battu !'); context.showConfetti(); setTimeout(()=>context.showLevelMenu(),1200);} else { showQ(context,s, context.content.querySelector('.puzzle-question-container')); } }

  function div(c,t){ const d=document.createElement('div'); if(c) d.className=c; if(t!=null) d.textContent=t; return d; }
  function btn(t){ const b=document.createElement('button'); b.type='button'; b.className='puzzle-option-btn'; b.textContent=t; return b; }
  function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

  window.tablesDefiGame = { start, getLevelCount: ()=>LEVELS.length };
})();
