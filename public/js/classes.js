// ZOMBIEWAVE V5 – CLASS DEFINITIONS
const CLASSES = [
  { id:'vampire', name:'Vampir', icon:'🧛', price:7500, desc:'Saugt Leben aus Gegnern.', rarity:'epic', color:'#8b0000', mpAllowed:true, soloAllowed:true,
    levels:[{xpRequired:0,name:'Lehrling',bonus:'Lifesteal: 3% des Schadens als HP zurück.'},{xpRequired:50,name:'Bluttrinker',bonus:'Lifesteal: 7%. +10% Schaden.'},{xpRequired:150,name:'Nachtalb',bonus:'Lifesteal: 12%. Schaden +20%. Bei Kill: +5 HP.'},{xpRequired:300,name:'Graf',bonus:'Lifesteal: 18%. Schaden +30%. Kill-Heal +10 HP.'},{xpRequired:500,name:'Fürst der Nacht',bonus:'🌙 ULTIMATE: Lifesteal 25%. Schaden +45%. Jeder 10. Kill = Vollheilung!'}],
    effects:{lifestealPct:[0.03,0.07,0.12,0.18,0.25],dmgBonus:[0,0.10,0.20,0.30,0.45],killHeal:[0,0,5,10,10],ultimateKills:10} },
  { id:'medic', name:'Medic', icon:'🩺', price:1200, desc:'Heilt Teammates im MP. Solo: Selbstheilung.', rarity:'rare', color:'#27ae60', mpAllowed:true, soloAllowed:true, soloNote:'Im Solo-Modus macht der Medic normalen Schaden und heilt sich selbst.',
    levels:[{xpRequired:0,name:'Sanitäter',bonus:'Alle 8 Sek: +8 HP (Solo) / Heilt nächsten Ally +5.'},{xpRequired:40,name:'Feldarzt',bonus:'Alle 6 Sek: +12 HP / Ally +8. Schaden +5%.'},{xpRequired:120,name:'Chirurg',bonus:'Alle 5 Sek: +18 HP / Ally +15. Schaden +10%.'},{xpRequired:250,name:'Traumamedic',bonus:'Alle 4 Sek: +25 HP / Ally +22. Schaden +15%.'},{xpRequired:450,name:'💚 Lebensretter',bonus:'💉 ULTIMATE: Heilpuls alle 3 Sek. Notfall +50 HP!'}],
    effects:{healInterval:[480,360,300,240,180],selfHeal:[8,12,18,25,30],allyHeal:[5,8,15,22,30],dmgBonus:[0,0.05,0.10,0.15,0.15],emergencyThreshold:0.2,emergencyHeal:50} },
  { id:'shadow', name:'Schatten', icon:'🌑', price:2000, desc:'Kurze Unsichtbarkeit nach Kills.', rarity:'epic', color:'#2c3e50', mpAllowed:true, soloAllowed:true,
    levels:[{xpRequired:0,name:'Läufer',bonus:'Nach Kill: 0.8 Sek unsichtbar.'},{xpRequired:60,name:'Schleicher',bonus:'Unsichtbar: 1.2 Sek. Aus Unsichtbarkeit: +20% Schaden.'},{xpRequired:180,name:'Phantom',bonus:'Unsichtbar: 1.8 Sek. Bonus: +35%. Dash lädt sich schneller.'},{xpRequired:350,name:'Assassine',bonus:'Unsichtbar: 2.5 Sek. Bonus: +50%.'},{xpRequired:600,name:'🌑 GHOST',bonus:'👁 ULTIMATE: Unsichtbar 4 Sek. Erster Schuss danach = 2× Crit!'}],
    effects:{invisDuration:[48,72,108,150,240],dmgFromInvis:[0,0.20,0.35,0.50,1.0],dashReduction:[0,0,0.15,0.25,0.25]} },
  { id:'engineer', name:'Ingenieur', icon:'🔧', price:1800, desc:'Platziert Geschütztürme und Fallen.', rarity:'epic', color:'#e67e22', mpAllowed:true, soloAllowed:true,
    levels:[{xpRequired:0,name:'Lehrling',bonus:'Platziere 1 Turret (E-Taste).'},{xpRequired:55,name:'Techniker',bonus:'2 Turrets. Turret-Schaden +20%.'},{xpRequired:160,name:'Experte',bonus:'3 Turrets. Schaden +35%.'},{xpRequired:320,name:'Meister',bonus:'3 Turrets + Landmine (Shift+E).'},{xpRequired:550,name:'⚙ Architekt',bonus:'⚙ ULTIMATE: 4 Turrets + Minen + Boss-Erkennung!'}],
    effects:{maxTurrets:[1,2,3,3,4],turretDmgMul:[1.0,1.2,1.35,1.35,1.6],turretDuration:[600,700,1200,1200,1800],hasMine:[false,false,false,true,true]} },
  { id:'pyro', name:'Pyro', icon:'🔥', price:1600, desc:'Zündet Feinde an. Feuerschaden über Zeit.', rarity:'rare', color:'#e74c3c', mpAllowed:true, soloAllowed:true,
    levels:[{xpRequired:0,name:'Zündler',bonus:'Treffer: 15% Chance Feind brennt (5 Sek, 3 Dmg/Sek).'},{xpRequired:45,name:'Brandstifter',bonus:'25% Chance. 8 Dmg/Sek.'},{xpRequired:130,name:'Flammler',bonus:'40% Chance. 12 Dmg/Sek. Feuer springt auf Nachbarn.'},{xpRequired:280,name:'Inferno',bonus:'55% Chance. 18 Dmg/Sek.'},{xpRequired:500,name:'🔥 INFERNO',bonus:'🔥 ULTIMATE: 70% Chance. 25 Dmg/Sek. Kettenexplosion bei Boss-Kill!'}],
    effects:{igniteChance:[0.15,0.25,0.40,0.55,0.70],fireDps:[3,8,12,18,25],fireDuration:[300,300,300,300,300],spreadFire:[false,false,true,true,true],spreadRadius:[0,0,80,120,150]} },
];

const CLASS_RARITY_COLORS = { common:'#9db4c8', uncommon:'#27ae60', rare:'#3498db', epic:'#8e44ad', legendary:'#f7c948' };

function getClassDef(id) { return CLASSES.find(c => c.id === id) || null; }
function isClassUnlocked(classId) { return (currentUser?.ownedClasses || []).includes(classId); }
function getClassLevel(classId) { return (currentUser?.classLevels || {})[classId] || 0; }
function getClassXP(classId) { return (currentUser?.classXP || {})[classId] || 0; }

async function addClassXP(classId, amount) {
  if (!currentUser || !classId) return;
  if (!currentUser.classXP) currentUser.classXP = {};
  if (!currentUser.classLevels) currentUser.classLevels = {};
  currentUser.classXP[classId] = (currentUser.classXP[classId] || 0) + amount;
  const cls = getClassDef(classId); if (!cls) return;
  let lvl = currentUser.classLevels[classId] || 0;
  while (lvl < cls.levels.length - 1 && currentUser.classXP[classId] >= cls.levels[lvl + 1].xpRequired) {
    lvl++; currentUser.classLevels[classId] = lvl;
    if (window.G && window.spawnFT) spawnFT(G.px, G.py - 60, cls.icon + ' Klasse Lv' + (lvl + 1) + '!', cls.color);
  }
  currentUser.classLevels[classId] = lvl;
  clearTimeout(window._classXpSaveTimer);
  window._classXpSaveTimer = setTimeout(async () => { try { await saveUserServer({ classXP: currentUser.classXP, classLevels: currentUser.classLevels }); } catch(e) {} }, 5000);
}

function applyClassOnKill(classId, enemy) {
  if (!window.G) return; const cls = getClassDef(classId); if (!cls) return; const lvl = getClassLevel(classId);
  addClassXP(classId, 1);
  if (classId === 'vampire') {
    const kh = cls.effects.killHeal[lvl] || 0;
    if (kh > 0) { G.playerHp = Math.min(G.playerHp + kh, G.playerMaxHp); spawnFT(G.px, G.py - 30, '+' + kh + ' 🩸', '#c0392b'); }
    if (lvl >= 4) { G._vampireKillCount = (G._vampireKillCount || 0) + 1; if (G._vampireKillCount >= cls.effects.ultimateKills) { G._vampireKillCount = 0; G.playerHp = G.playerMaxHp; spawnFT(G.px, G.py - 50, '🌙 VOLLHEILUNG!', '#ff4444'); if (typeof triggerFlash === 'function') triggerFlash('#8b0000', 0.3, 10); } }
  }
  if (classId === 'shadow') { G._shadowInvisTimer = cls.effects.invisDuration[lvl] || 48; G._shadowInvis = true; spawnFT(G.px, G.py - 28, '🌑 Unsichtbar', '#2c3e50'); }
  if (classId === 'pyro' && cls.effects.spreadFire[lvl] && enemy) {
    const r = cls.effects.spreadRadius[lvl] || 80;
    G.enemies.forEach(e => { if (e.hp > 0 && Math.sqrt((e.x - enemy.x) ** 2 + (e.y - enemy.y) ** 2) < r) { if (!e._onFire) { e._onFire = true; e._fireTick = 0; e._fireDur = cls.effects.fireDuration[lvl]; e._fireDps = cls.effects.fireDps[lvl]; } } });
  }
}

function applyClassOnHit(classId, enemy, dmgDealt) {
  if (!window.G) return; const cls = getClassDef(classId); if (!cls) return; const lvl = getClassLevel(classId);
  if (classId === 'vampire') { const pct = cls.effects.lifestealPct[lvl] || 0.03; const heal = Math.ceil(dmgDealt * pct); if (heal > 0) G.playerHp = Math.min(G.playerHp + heal, G.playerMaxHp); }
  if (classId === 'pyro') { const chance = cls.effects.igniteChance[lvl] || 0.15; if (Math.random() < chance && enemy && !enemy._onFire) { enemy._onFire = true; enemy._fireTick = 0; enemy._fireDur = cls.effects.fireDuration[lvl]; enemy._fireDps = cls.effects.fireDps[lvl]; } }
}

function applyClassOnTick(classId, dt) {
  if (!window.G) return; const cls = getClassDef(classId); if (!cls) return; const lvl = getClassLevel(classId);
  if (classId === 'shadow') {
    if (G._shadowInvis) { G._shadowInvisTimer = (G._shadowInvisTimer || 0) - dt; if (G._shadowInvisTimer <= 0) { G._shadowInvis = false; G._shadowFirstShot = true; } }
    if (cls.effects.dashReduction[lvl] > 0 && G.dashCd > 0) G.dashCd -= dt * cls.effects.dashReduction[lvl];
  }
  if (classId === 'medic') {
    G._medicHealTick = (G._medicHealTick || 0) + dt;
    if (G._medicHealTick >= cls.effects.healInterval[lvl]) { G._medicHealTick = 0; const heal = cls.effects.selfHeal[lvl]; G.playerHp = Math.min(G.playerHp + heal, G.playerMaxHp); spawnFT(G.px, G.py - 32, '+' + heal + ' 💚', '#27ae60'); }
  }
  if (classId === 'pyro') {
    G.enemies.forEach(e => { if (e._onFire) { e._fireTick = (e._fireTick || 0) + dt; if (e._fireTick >= 60) { e._fireTick = 0; e._fireDur = (e._fireDur || 0) - 60; e.hp -= e._fireDps || 3; if (e._fireDur <= 0) e._onFire = false; if (e.hp <= 0 && typeof killEnemy === 'function') killEnemy(e); } } });
  }
}

function getClassDmgBonus(classId) { const cls = getClassDef(classId); if (!cls || !cls.effects?.dmgBonus) return 0; const lvl = getClassLevel(classId); return cls.effects.dmgBonus[lvl] || 0; }
function isShadowInvis() { return window.G?._shadowInvis || false; }
