// QUEST & SEASON SYSTEM – Gems-Währung
const SEASONS=[
  {id:1,name:'Season 1 – Die Verdammten',icon:'💀',color:'#c0392b',quests:[
    {id:'s1q1',name:'Massenmörder',desc:'Töte 5.000 Zombies.',icon:'☠️',type:'kills',target:5000,gems:80},
    {id:'s1q2',name:'Schaden-Maschine',desc:'500.000 Gesamtschaden.',icon:'💥',type:'damage',target:500000,gems:100},
    {id:'s1q3',name:'Überlebenskünstler',desc:'10 Runden abschließen.',icon:'🛡️',type:'rounds',target:10,gems:60},
    {id:'s1q4',name:'Waffenmeister',desc:'5 Waffen kaufen.',icon:'🔫',type:'weapons_owned',target:5,gems:50},
    {id:'s1q5',name:'Boss-Jäger',desc:'15 Bosse töten.',icon:'👑',type:'boss_kills',target:15,gems:120},
  ]},
  {id:2,name:'Season 2 – Blut & Feuer',icon:'🔥',color:'#e67e22',quests:[
    {id:'s2q1',name:'Inferno',desc:'1.000.000 Schaden.',icon:'🔥',type:'damage',target:1000000,gems:120},
    {id:'s2q2',name:'Wellen-Surfer',desc:'Welle 20 erreichen.',icon:'🌊',type:'max_wave',target:20,gems:150},
    {id:'s2q3',name:'Geizkragen',desc:'50.000 Coins gesamt.',icon:'🪙',type:'coins_earned',target:50000,gems:90},
    {id:'s2q4',name:'Nightmare-Läufer',desc:'5× Nightmare gewinnen.',icon:'😱',type:'nightmare_wins',target:5,gems:180},
    {id:'s2q5',name:'Vollständig',desc:'Alle 5 Level freischalten.',icon:'🗺️',type:'levels_unlocked',target:5,gems:100},
  ]},
  {id:3,name:'Season 3 – Apokalypse',icon:'☣️',color:'#8e44ad',quests:[
    {id:'s3q1',name:'Unaufhaltbar',desc:'3 Bosse in EINEM Run.',icon:'🏆',type:'bosses_one_run',target:3,gems:200},
    {id:'s3q2',name:'Milliarden-Schaden',desc:'5.000.000 Gesamtschaden.',icon:'💥',type:'damage',target:5000000,gems:250},
    {id:'s3q3',name:'Kein Tod',desc:'3 Runden ohne zu sterben.',icon:'💚',type:'deathless',target:3,gems:160},
    {id:'s3q4',name:'Klassen-Meister',desc:'Eine Klasse auf Level 5.',icon:'⭐',type:'class_max',target:1,gems:140},
    {id:'s3q5',name:'Koop-Held',desc:'10 Multiplayer-Runden.',icon:'🤝',type:'mp_rounds',target:10,gems:110},
  ]},
];

const DAILY_POOL=[
  {id:'d_kills_100',name:'Zombie-Killer',desc:'Töte 100 Zombies.',icon:'☠️',type:'kills',target:100,gems:10},
  {id:'d_kills_250',name:'Zombie-Jäger',desc:'Töte 250 Zombies.',icon:'☠️',type:'kills',target:250,gems:20},
  {id:'d_damage_50k',name:'Schaden-Dealer',desc:'50.000 Schaden.',icon:'💥',type:'damage',target:50000,gems:15},
  {id:'d_damage_100k',name:'Vernichter',desc:'100.000 Schaden.',icon:'💥',type:'damage',target:100000,gems:25},
  {id:'d_survive_5',name:'Überlebender',desc:'5 Minuten überleben.',icon:'⏱️',type:'survive_time',target:300,gems:20},
  {id:'d_survive_10',name:'Zäher Kämpfer',desc:'10 Minuten überleben.',icon:'⏱️',type:'survive_time',target:600,gems:35},
  {id:'d_boss',name:'Boss-Besieger',desc:'Einen Boss töten.',icon:'👑',type:'boss_kills',target:1,gems:30},
  {id:'d_wave_10',name:'Wellen-Reiter',desc:'Welle 10 erreichen.',icon:'🌊',type:'max_wave',target:10,gems:18},
  {id:'d_wave_15',name:'Wellen-Surfer',desc:'Welle 15 erreichen.',icon:'🌊',type:'max_wave',target:15,gems:28},
  {id:'d_coins_1k',name:'Münzsammler',desc:'1.000 Coins in einem Run.',icon:'🪙',type:'coins_run',target:1000,gems:12},
  {id:'d_sniper_20',name:'Präzision',desc:'20 Zombies mit Sniper.',icon:'🎯',type:'sniper_kills',target:20,gems:22},
  {id:'d_hard',name:'Hardcore',desc:'Eine Runde auf Schwer.',icon:'😤',type:'hard_round',target:1,gems:15},
  {id:'d_nightmare',name:'Wahnsinnig',desc:'Eine Runde auf Albtraum.',icon:'😱',type:'nightmare_round',target:1,gems:30},
];

function getQuestData(){return currentUser?.questData||{daily:{},season:{},gems:0,lastDailyReset:0,activeDailies:[]};}
function getCurrentSeason(){const m=new Date().getMonth();return SEASONS[m%3]||SEASONS[0];}

function getActiveDailies(){
  const qd=getQuestData();const now=Date.now();
  if(!qd.activeDailies||qd.activeDailies.length===0||now-qd.lastDailyReset>86400000){
    return [...DAILY_POOL].sort(()=>Math.random()-.5).slice(0,3);
  }
  return qd.activeDailies.map(id=>DAILY_POOL.find(q=>q.id===id)).filter(Boolean);
}

async function initDailiesIfNeeded(){
  if(!currentUser)return;
  const qd=getQuestData();const now=Date.now();
  if(!qd.activeDailies||qd.activeDailies.length===0||now-qd.lastDailyReset>86400000){
    const picks=[...DAILY_POOL].sort(()=>Math.random()-.5).slice(0,3);
    qd.activeDailies=picks.map(q=>q.id);qd.lastDailyReset=now;
    picks.forEach(q=>{if(qd.daily[q.id])delete qd.daily[q.id];});
    if(!currentUser.questData)currentUser.questData=qd;
    else Object.assign(currentUser.questData,qd);
    await saveQuestData();
  }
}

async function saveQuestData(){if(!currentUser)return;try{await saveUserServer({questData:currentUser.questData});}catch(e){}}

async function updateQuestProgress(type,value){
  if(!currentUser)return;
  if(!currentUser.questData)currentUser.questData=getQuestData();
  const qd=currentUser.questData;let changed=false;
  const season=getCurrentSeason();const dailies=getActiveDailies();
  dailies.forEach(q=>{
    if(q.type!==type)return;
    if(!qd.daily[q.id])qd.daily[q.id]={progress:0,completed:false};
    const d=qd.daily[q.id];if(d.completed)return;
    d.progress=Math.min(d.progress+value,q.target);
    if(d.progress>=q.target){d.completed=true;qd.gems=(qd.gems||0)+q.gems;currentUser.gems=qd.gems;showQuestComplete(q,false);changed=true;}
  });
  season.quests.forEach(q=>{
    if(q.type!==type)return;
    if(!qd.season[q.id])qd.season[q.id]={progress:0,completed:false};
    const s=qd.season[q.id];if(s.completed)return;
    s.progress=Math.min(s.progress+value,q.target);
    if(s.progress>=q.target){s.completed=true;qd.gems=(qd.gems||0)+q.gems;currentUser.gems=qd.gems;showQuestComplete(q,true);changed=true;}
  });
  if(changed){clearTimeout(window._questSaveTimer);window._questSaveTimer=setTimeout(saveQuestData,3000);}
}

function showQuestComplete(quest,isSeason){
  if(window.G&&typeof spawnFT==='function')spawnFT(G.px,G.py-80,(isSeason?'🏆 SEASON: ':'📋 QUEST: ')+quest.name+' +'+quest.gems+'💎',isSeason?'#f7c948':'#3498db');
  const ex=document.getElementById('quest-toast');if(ex)ex.remove();
  const t=document.createElement('div');t.id='quest-toast';
  t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);background:'+(isSeason?'#1a1200':'#001020')+';border:2px solid '+(isSeason?'#f7c948':'#3498db')+';border-radius:12px;padding:12px 20px;z-index:99999;display:flex;align-items:center;gap:10px;font-family:Nunito,sans-serif;color:#fff;font-size:.9rem;box-shadow:0 4px 20px rgba(0,0,0,.6);min-width:280px;';
  t.innerHTML='<span style="font-size:1.6rem;">'+quest.icon+'</span><div><div style="font-family:Bangers,cursive;color:'+(isSeason?'#f7c948':'#3498db')+';font-size:1rem;">'+(isSeason?'Season Quest!':'Tägliche Quest!')+'</div><div style="font-size:.82rem;color:#c8d8e8;">'+quest.name+'</div></div><div style="margin-left:auto;font-family:Bangers,cursive;color:#a855f7;font-size:1.1rem;">+'+quest.gems+' 💎</div>';
  document.body.appendChild(t);setTimeout(()=>t.remove(),4000);
}

function renderQuestsTab(){
  const tab=document.getElementById('tab-quests');if(!tab)return;
  const qd=getQuestData();const dailies=getActiveDailies();const season=getCurrentSeason();const gems=qd.gems||0;
  const msLeft=Math.max(0,(qd.lastDailyReset||0)+86400000-Date.now());
  const hLeft=Math.floor(msLeft/3600000);const mLeft=Math.floor((msLeft%3600000)/60000);
  tab.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem;">
    <div><div style="font-family:Bangers,cursive;font-size:1.3rem;color:#a855f7;">💎 ${gems.toLocaleString()} Gems</div>
    <div style="font-size:.7rem;color:#5a7a90;">Daily-Reset: ${hLeft}h ${mLeft}m</div></div>
    <div style="background:${season.color}22;border:1.5px solid ${season.color};border-radius:10px;padding:5px 12px;text-align:center;">
    <div style="font-size:1.2rem;">${season.icon}</div><div style="font-family:Bangers,cursive;font-size:.75rem;color:${season.color};">${season.name}</div></div></div>
    <div style="margin-bottom:1rem;"><div style="font-family:Bangers,cursive;color:#3498db;font-size:1rem;letter-spacing:1px;margin-bottom:.5rem;">📋 TÄGLICHE QUESTS</div>
    ${dailies.map(q=>renderQuestCard(q,qd.daily[q.id],false)).join('')}</div>
    <div><div style="font-family:Bangers,cursive;color:${season.color};font-size:1rem;letter-spacing:1px;margin-bottom:.5rem;">🏆 SEASON QUESTS</div>
    ${season.quests.map(q=>renderQuestCard(q,qd.season[q.id],true)).join('')}</div>`;
}

function renderQuestCard(quest,progress,isSeason){
  const prog=progress||{progress:0,completed:false};
  const pct=Math.min(100,Math.round((prog.progress/quest.target)*100));
  const done=prog.completed;const bar=isSeason?'#f7c948':'#3498db';
  return `<div style="background:#0d1825;border:1.5px solid ${done?'#27ae60':isSeason?'#2a2000':'#0a1a2a'};border-radius:10px;padding:.65rem .8rem;margin-bottom:.5rem;display:flex;align-items:center;gap:10px;opacity:${done?.7:1};">
    <span style="font-size:1.4rem;">${quest.icon}</span>
    <div style="flex:1;min-width:0;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
        <span style="font-family:Bangers,cursive;font-size:.9rem;color:${done?'#27ae60':'#f0f0f0'};">${done?'✓ ':''}${quest.name}</span>
        <span style="font-size:.72rem;color:#a855f7;margin-left:6px;">+${quest.gems} 💎</span></div>
      <div style="font-size:.68rem;color:#5a7a90;margin-bottom:4px;">${quest.desc}</div>
      <div style="background:#1a2535;border-radius:3px;height:5px;overflow:hidden;">
        <div style="height:100%;background:${done?'#27ae60':bar};width:${done?100:pct}%;border-radius:3px;"></div></div>
      <div style="font-size:.62rem;color:#5a7a90;margin-top:2px;text-align:right;">${done?'Abgeschlossen!':prog.progress.toLocaleString()+' / '+quest.target.toLocaleString()}</div>
    </div></div>`;
}
