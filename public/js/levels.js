// ZOMBIEWAVE V5 – LEVEL DEFINITIONS
const LEVELS = [
  { id:1, name:'Verlassene Stadt', icon:'🏚️', desc:'Die Innenstadt ist gefallen. Überall Zombies.', unlocked:true, requiredLevel:0, survivalGoal:300, mapTheme:'city', zombieTypes:['a','b','c'], bossMultiplier:1.0, spawnRate:1.0, bgColor:'#1e3a2f', accentColor:'#f7c948', ambientDesc:'Straßen und Trümmer' },
  { id:2, name:'Industriegebiet', icon:'🏭', desc:'Fabriken voller Explosions-Zombies. Gefährlich!', unlocked:false, requiredLevel:1, survivalGoal:300, mapTheme:'industrial', zombieTypes:['a','b','c','d'], bossMultiplier:1.2, spawnRate:1.1, bgColor:'#1a2a1a', accentColor:'#e67e22', ambientDesc:'Rohre, Maschinen, Öl' },
  { id:3, name:'Krankenhaus', icon:'🏥', desc:'Heiler-Zombies überall. Töte sie zuerst!', unlocked:false, requiredLevel:2, survivalGoal:300, mapTheme:'hospital', zombieTypes:['a','b','c','d','e'], bossMultiplier:1.4, spawnRate:1.2, bgColor:'#1a2030', accentColor:'#2ecc71', ambientDesc:'Weiße Gänge, Krankenbetten' },
  { id:4, name:'Militärstützpunkt', icon:'🪖', desc:'Riesen-Zombies in voller Rüstung. Viel Glück.', unlocked:false, requiredLevel:3, survivalGoal:300, mapTheme:'military', zombieTypes:['b','c','d','e','f'], bossMultiplier:1.7, spawnRate:1.35, bgColor:'#1a2015', accentColor:'#8e44ad', ambientDesc:'Sandsäcke, Stacheldraht, Bunker' },
  { id:5, name:'Unterstadt', icon:'🌆', desc:'Alle Zombie-Typen. Das letzte Level.', unlocked:false, requiredLevel:4, survivalGoal:300, mapTheme:'downtown', zombieTypes:['a','b','c','d','e','f'], bossMultiplier:2.0, spawnRate:1.5, bgColor:'#0d1525', accentColor:'#c0392b', ambientDesc:'Hochhäuser, Neon-Ruinen' },
];

function getLevelZombieTypes(levelId, wave) {
  const lvl = LEVELS.find(l => l.id === levelId) || LEVELS[0];
  const available = lvl.zombieTypes;
  if (wave <= 2) return available.slice(0, Math.min(2, available.length));
  if (wave <= 4) return available.slice(0, Math.min(3, available.length));
  return available;
}
