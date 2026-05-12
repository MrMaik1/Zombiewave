// ═══════════════════════════════════════════════════════
//  ZOMBIEWAVE V5 – CHARACTER DEFINITIONS
//  10 real characters + 1 troll
//  Shop bars shown at MAX. In-game stats = actual multipliers.
//  Troll: bars = 10/10/10/10 → real stats absolute minimum.
// ═══════════════════════════════════════════════════════

const CHARACTERS = [
  {
    id: 'ghost',
    name: 'Ghost',
    icon: '👻',
    price: 0,
    desc: 'Schnell wie der Wind, zerbrechlich wie Glas.',
    rarity: 'common',
    bars: { speed: 9, hp: 3, shield: 2, dmg: 6 },
    stats: { speedMul: 1.45, hpMul: 0.65, shieldMul: 0.5, dmgMul: 1.0 },
    color: '#7ecff7',
  },
  {
    id: 'tank',
    name: 'Tank',
    icon: '🛡️',
    price: 400,
    desc: 'Langsam aber unzerstörbar. Hält alles aus.',
    rarity: 'common',
    bars: { speed: 3, hp: 10, shield: 9, dmg: 5 },
    stats: { speedMul: 0.75, hpMul: 1.8, shieldMul: 2.0, dmgMul: 0.85 },
    color: '#95a5a6',
  },
  {
    id: 'hunter',
    name: 'Hunter',
    icon: '🎯',
    price: 600,
    desc: 'Präzision über alles. Hoher Waffenschaden.',
    rarity: 'uncommon',
    bars: { speed: 7, hp: 5, shield: 4, dmg: 9 },
    stats: { speedMul: 1.15, hpMul: 0.9, shieldMul: 0.8, dmgMul: 1.35 },
    color: '#e67e22',
  },
  {
    id: 'brawler',
    name: 'Brawler',
    icon: '🥊',
    price: 800,
    desc: 'Ausgeglichen und solide. Der sichere Allrounder.',
    rarity: 'common',
    bars: { speed: 6, hp: 6, shield: 6, dmg: 6 },
    stats: { speedMul: 1.0, hpMul: 1.0, shieldMul: 1.0, dmgMul: 1.0 },
    color: '#f7c948',
  },
  {
    id: 'berserker',
    name: 'Berserker',
    icon: '🪓',
    price: 1200,
    desc: 'Je weniger HP, desto mehr Schaden. Lebt gefährlich.',
    rarity: 'rare',
    bars: { speed: 7, hp: 4, shield: 2, dmg: 10 },
    stats: { speedMul: 1.1, hpMul: 0.7, shieldMul: 0.4, dmgMul: 1.5 },
    color: '#c0392b',
    specialTag: 'rage',
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    icon: '⚔️',
    price: 1000,
    desc: 'Hoher Schild, Schaden ok. Schild regeneriert.',
    rarity: 'rare',
    bars: { speed: 4, hp: 7, shield: 10, dmg: 6 },
    stats: { speedMul: 0.85, hpMul: 1.2, shieldMul: 2.5, dmgMul: 0.9 },
    color: '#8e44ad',
    specialTag: 'shieldregen',
  },
  {
    id: 'reaper',
    name: 'Reaper',
    icon: '💀',
    price: 1500,
    desc: 'Maximaler Schaden. Kein Schild. Leben am Limit.',
    rarity: 'epic',
    bars: { speed: 8, hp: 3, shield: 1, dmg: 10 },
    stats: { speedMul: 1.25, hpMul: 0.55, shieldMul: 0.2, dmgMul: 1.7 },
    color: '#8b0000',
  },
  {
    id: 'ninja',
    name: 'Ninja',
    icon: '🥷',
    price: 1800,
    desc: 'Blitzschnell, Doppel-Dash, Schatten-Instinkt.',
    rarity: 'epic',
    bars: { speed: 10, hp: 4, shield: 3, dmg: 7 },
    stats: { speedMul: 1.6, hpMul: 0.72, shieldMul: 0.6, dmgMul: 1.05 },
    color: '#1abc9c',
    specialTag: 'doubledash',
  },
  {
    id: 'guardian_char',
    name: 'Guardian',
    icon: '🔰',
    price: 2000,
    desc: 'HP regen passiv. Stark im Ausdauerkampf.',
    rarity: 'epic',
    bars: { speed: 5, hp: 8, shield: 7, dmg: 5 },
    stats: { speedMul: 0.9, hpMul: 1.4, shieldMul: 1.5, dmgMul: 0.8 },
    color: '#27ae60',
    specialTag: 'hpregen',
  },
  {
    id: 'juggernaut',
    name: 'Juggernaut',
    icon: '🦾',
    price: 3500,
    desc: 'Maximale HP & Schild — kaum Tempo oder Schaden.',
    rarity: 'legendary',
    bars: { speed: 2, hp: 10, shield: 10, dmg: 3 },
    stats: { speedMul: 0.6, hpMul: 2.0, shieldMul: 3.0, dmgMul: 0.65 },
    color: '#d4a017',
  },
  // ── TROLL ─────────────────────────────────────────────
  {
    id: 'troll',
    name: '???',
    icon: '🤡',
    price: 10,
    desc: 'Nur 10 Münzen! Das beste Angebot im ganzen Shop!',
    rarity: 'troll',
    bars: { speed: 10, hp: 10, shield: 10, dmg: 10 },
    stats: { speedMul: 0.3, hpMul: 0.2, shieldMul: 0.1, dmgMul: 0.15 },
    color: '#ff69b4',
    specialTag: 'troll',
    trollReveal: true,
  },
];

const RARITY_COLORS = {
  common:   '#9db4c8',
  uncommon: '#27ae60',
  rare:     '#3498db',
  epic:     '#8e44ad',
  legendary:'#f7c948',
  troll:    '#ff69b4',
};
const RARITY_LABELS = {
  common:   'Gewöhnlich',
  uncommon: 'Ungewöhnlich',
  rare:     'Selten',
  epic:     'Episch',
  legendary:'Legendär',
  troll:    '???',
};

function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
}
function isCharUnlocked(charId) {
  if (charId === 'ghost') return true;
  return (currentUser?.ownedChars || []).includes(charId);
}
