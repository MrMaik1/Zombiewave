// ═══════════════════════════════════════════════════════
//  SHOP DATA
// ═══════════════════════════════════════════════════════
const WEAPONS_SHOP = [
  { id:'pistol',  name:'Pistole',     icon:'🔫', price:0,     desc:'Startwaffe. 15 Schuss.' },
  { id:'rifle',   name:'Sturmgewehr', icon:'🪖', price:1,   desc:'Feuerrate +, 30 Schuss.' },
  { id:'shotgun', name:'Schrotflinte',icon:'💥', price:1,   desc:'5 Zombies, kurze Reichweite.' },
  { id:'kunai',   name:'Kunai',       icon:'🗡️', price:1,   desc:'Auto-Ziel. Wirft Kunais.' },
  { id:'sniper',  name:'Sniper',      icon:'🎯', price:1,  desc:'Große Reichweite, hoher Schaden.' },
  { id:'rpg',     name:'RPG',         icon:'🚀', price:1,  desc:'Explosionsrakete, AOE.' },
  { id:'molotov', name:'Molotov',     icon:'🍾', price:1,  desc:'Feuerzone, Schaden über Zeit.' },
  { id:'minigun', name:'Minigun',     icon:'⚙️', price:1, desc:'Dauerfeuer, 4 Sek Cooldown.' },
];
const PERMA_SHOP = [
  { id:'hp',    name:'+HP',     icon:'❤️', price:1, max:5, desc:'+25 HP/Stufe.' },
  { id:'speed', name:'Speed',   icon:'👟', price:1, max:5, desc:'+10% Speed/Stufe.' },
  { id:'dmg',   name:'Schaden', icon:'💥', price:1, max:5, desc:'+15% Dmg/Stufe.' },
  { id:'reload',name:'Reload',  icon:'🔄', price:1, max:5, desc:'-10% Reload/Stufe.' },
  { id:'mag',   name:'Magazin', icon:'📦', price:1, max:5, desc:'+10 Schuss/Stufe.' },
];
const KUNAI_SHOP = [
  { id:'kunai_count', name:'Kunai-Anzahl', icon:'🗡️', price:400, max:4, desc:'+1 Kunai gleichzeitig (bis 5).' },
  { id:'kunai_speed', name:'Kunai-Tempo',  icon:'⚡', price:400, max:4, desc:'-0.1 Sek Wurfzeit (bis 0.1s).' },
];

let selectedDiff = 'easy';
function selDiff(d, el) {
  selectedDiff = d;
  document.querySelectorAll('#tab-play .diff-card').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
}
// ═══════════════════════════════════════════════════════
//  MENU
// ═══════════════════════════════════════════════════════
function openMenu() {
  hideAll(); show('ov-menu');
  if (currentUser) {
    document.getElementById('menu-welcome').textContent =
      t('welcome_back') + ' ' + currentUser.username + '!  🪙 ' + (currentUser.coins||0) + ' ' + t('coins_total');
  }
  const isAdmin = currentUser?.username?.toLowerCase() === 'mrmaik';
  document.getElementById('admin-btn').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('lang-de').classList.toggle('on', currentLang === 'de');
  document.getElementById('lang-en').classList.toggle('on', currentLang === 'en');
  menuTab('play');
  renderShop();
  renderLevelGrid('level-grid', false);
  const abtn = document.getElementById('admin-btn');
  if(abtn) abtn.style.display = isAdmin ? 'block' : 'none';
}

function menuTab(tab) {
  ['play','mp','shop','upgrades','hs','friends','settings','admin-view'].forEach(id => {
    const el = document.getElementById('tab-' + id);
    if (el) el.style.display = id === tab ? 'block' : 'none';
    const btn = document.getElementById('mt-' + id);
    if (btn) btn.classList.toggle('on', id === tab);
  });
  if (tab === 'shop') { renderShop(); shopSubTab('weapons'); }
  if (tab === 'upgrades') renderPermaUpg();
  if (tab === 'hs') { hsCurrentFilter = 'all'; renderHS(); }
  if (tab === 'friends') refreshFriends();
  if (tab === 'mp') renderLevelGrid('mp-level-grid', true);
}

// ═══════════════════════════════════════════════════════
//  SHOP SUB-TABS
// ═══════════════════════════════════════════════════════
let _currentShopTab = 'weapons';

function shopSubTab(sub) {
  _currentShopTab = sub;
  ['weapons','perma','chars','classes'].forEach(s => {
    const el = document.getElementById('shop-sub-' + s);
    if (el) el.style.display = s === sub ? 'block' : 'none';
    const btn = document.getElementById('shop-stab-' + s);
    if (btn) btn.classList.toggle('on', s === sub);
  });
  if (sub === 'weapons') renderWeaponsShop();
  if (sub === 'perma')   renderPermaShop();
  if (sub === 'chars')   renderCharactersShop();
  if (sub === 'classes') renderClassesShop();
}

function renderShop() {
  if (!currentUser) return;
  document.getElementById('shop-coins').textContent = currentUser.coins || 0;
  shopSubTab(_currentShopTab || 'weapons');
}

// ── Weapons ──────────────────────────────────────────
function renderWeaponsShop() {
  if (!currentUser) return;
  document.getElementById('shop-coins').textContent = currentUser.coins || 0;
  const wc = document.getElementById('shop-weapons-list'); if (!wc) return;
  wc.innerHTML = '';
  WEAPONS_SHOP.forEach(w => {
    const owned = (currentUser.weapons || []).includes(w.id);
    const canBuy = !owned && (currentUser.coins||0) >= w.price;
    const c = document.createElement('div');
    c.className = 'shop-card' + (owned ? ' owned' : '') + (!owned && !canBuy ? ' locked' : '');
    c.innerHTML = `<div class="shop-icon">${w.icon}</div><div class="shop-name">${w.name}</div>
      <div class="shop-price">${owned ? '✓ Besitzt' : w.price===0 ? 'Free' : '🪙 '+w.price}</div>
      <div class="shop-desc">${w.desc}</div>`;
    if (canBuy) c.onclick = () => buyWeapon(w);
    wc.appendChild(c);
  });

  // Kunai extras (only if kunai owned)
  const kc = document.getElementById('shop-kunai-list'); if (!kc) return;
  kc.innerHTML = '';
  if ((currentUser.weapons||[]).includes('kunai')) {
    KUNAI_SHOP.forEach(k => {
      const lvl = k.id==='kunai_count' ? (currentUser.kunaiCountLvl||0) : (currentUser.kunaiSpeedLvl||0);
      const maxed = lvl >= k.max;
      const cost = k.price;
      const canBuy = !maxed && (currentUser.coins||0) >= cost;
      const c = document.createElement('div');
      c.className = 'shop-card' + (maxed ? ' owned maxlvl' : '') + (!maxed && !canBuy ? ' locked' : '');
      c.innerHTML = `<div class="shop-icon">${k.icon}</div><div class="shop-name">${k.name} Lv${lvl}${maxed?' ★':''}</div>
        <div class="shop-price">${maxed ? 'MAX ★' : '🪙 '+cost}</div><div class="shop-desc">${k.desc}</div>`;
      if (canBuy) c.onclick = () => buyKunai(k);
      kc.appendChild(c);
    });
    // Guardian
    const gLvl = currentUser.guardianShopLvl || 0;
    const gMaxed = gLvl >= 6;
    const gCost = 600 * (gLvl + 1);
    const gc = document.createElement('div');
    gc.className = 'shop-card' + (gMaxed?' owned maxlvl':'') + (!gMaxed&&(currentUser.coins||0)<gCost?' locked':'');
    gc.innerHTML = `<div class="shop-icon">⚔️</div><div class="shop-name">Guardian Lv${gLvl}${gMaxed?' ★':''}</div>
      <div class="shop-price">${gMaxed?'MAX ★':'🪙 '+gCost}</div>
      <div class="shop-desc">Lv1-5: Klingen 30s an/15s aus. Lv6: 6 Klingen permanent!</div>`;
    if (!gMaxed && (currentUser.coins||0) >= gCost) gc.onclick = () => buyGuardian();
    kc.appendChild(gc);
  } else {
    kc.innerHTML = '<p style="color:#5a7a90;font-size:.78rem;padding:.4rem 0;">🗡️ Kaufe zuerst Kunai um Upgrades freizuschalten.</p>';
  }
}

// ── Perma upgrades ───────────────────────────────────
function renderPermaShop() {
  if (!currentUser) return;
  document.getElementById('shop-coins').textContent = currentUser.coins || 0;
  const el = document.getElementById('shop-perma-list'); if (!el) return;
  el.innerHTML = '';
  PERMA_SHOP.forEach(u => {
    const lvl = (currentUser.perma||{})[u.id] || 0;
    const maxed = lvl >= u.max;
    const cost = u.price * (lvl + 1);
    const canBuy = !maxed && (currentUser.coins||0) >= cost;
    const c = document.createElement('div');
    c.className = 'shop-card' + (maxed?' owned maxlvl':'') + (!maxed&&!canBuy?' locked':'');
    c.innerHTML = `<div class="shop-icon">${u.icon}</div><div class="shop-name">${u.name} Lv${lvl}${maxed?' ★':''}</div>
      <div class="shop-price">${maxed?'MAX ★':'🪙 '+cost}</div><div class="shop-desc">${u.desc}</div>`;
    if (canBuy) c.onclick = () => buyPermaFromShop(u);
    el.appendChild(c);
  });
}

// ── Characters ────────────────────────────────────────
let selectedCharId = null;

function renderCharactersShop() {
  if (!currentUser) return;
  document.getElementById('shop-coins').textContent = currentUser.coins || 0;
  const activeChar = currentUser.activeChar || 'ghost';
  selectedCharId = activeChar;

  const grid = document.getElementById('shop-chars-grid'); if (!grid) return;
  grid.innerHTML = '';

  CHARACTERS.forEach(ch => {
    const owned = isCharUnlocked(ch.id);
    const canBuy = !owned && (currentUser.coins||0) >= ch.price;
    const isActive = ch.id === activeChar;
    const rc = RARITY_COLORS[ch.rarity] || '#9db4c8';

    const card = document.createElement('div');
    card.className = 'char-card' + (isActive ? ' active' : '') + (!owned && !canBuy ? ' locked' : '');
    card.style.borderColor = isActive ? ch.color : (owned ? rc : '#2a3a50');

    // Troll: don't reveal real stats label
    const isTroll = ch.id === 'troll';

    card.innerHTML = `
      <div class="char-icon" style="color:${ch.color}">${ch.icon}</div>
      <div class="char-name" style="color:${ch.color}">${ch.name}</div>
      <div class="char-rarity" style="color:${rc}">${RARITY_LABELS[ch.rarity]||''}</div>
      <div class="char-bars">
        ${renderStatBars(ch.bars, isTroll)}
      </div>
      <div class="char-desc">${ch.desc}</div>
      <div class="char-price">
        ${isActive ? '<span style="color:#27ae60;font-weight:700;">✓ AKTIV</span>'
          : owned   ? '<button class="btn green sm char-select-btn">Auswählen</button>'
          : ch.price === 0 ? '<span style="color:#27ae60;">Gratis</span>'
          : `<span style="color:${canBuy?'#f7c948':'#555'}">🪙 ${ch.price}</span>`}
      </div>
    `;

    if (!owned && canBuy) {
      card.onclick = () => buyCharacter(ch);
    } else if (owned && !isActive) {
      card.querySelector('.char-select-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        selectCharacter(ch.id);
      });
    }

    grid.appendChild(card);
  });
}

function renderStatBars(bars, isTroll = false) {
  const labels = { speed: '⚡ Speed', hp: '❤️ HP', shield: '🛡️ Schild', dmg: '💥 Schaden' };
  const colors  = { speed: '#7ecff7', hp: '#e74c3c', shield: '#8e44ad', dmg: '#e67e22' };
  return Object.entries(bars).map(([key, val]) => {
    const pct = isTroll ? 100 : (val / 10) * 100;
    return `<div class="stat-bar-row">
      <span class="stat-bar-label">${labels[key]||key}</span>
      <div class="stat-bar-track">
        <div class="stat-bar-fill" style="width:${pct}%;background:${colors[key]||'#f7c948'}"></div>
      </div>
    </div>`;
  }).join('');
}

async function buyCharacter(ch) {
  if (!currentUser || (currentUser.coins||0) < ch.price) return;
  currentUser.coins -= ch.price;
  if (!currentUser.ownedChars) currentUser.ownedChars = [];
  currentUser.ownedChars.push(ch.id);

  // Troll reveal after purchase
  if (ch.trollReveal) {
    setTimeout(() => {
      alert('😂 HA! Du dachtest wirklich das wäre gut?\n\n🤡 "Der Trümmer" hat alle Stats auf Minimum!\nSpeed ×0.3 | HP ×0.2 | Schild ×0.1 | Schaden ×0.15\n\nGenieß deine 10 Münzen!');
    }, 300);
  }

  await saveUserServer({ coins: currentUser.coins, ownedChars: currentUser.ownedChars });
  renderCharactersShop();
}

async function selectCharacter(charId) {
  if (!currentUser) return;
  currentUser.activeChar = charId;
  await saveUserServer({ activeChar: charId });
  renderCharactersShop();
  // Toast
  const ch = getCharacter(charId);
  if (ch && window.spawnFT && window.G) spawnFT(G.px||400, (G.py||300) - 40, ch.icon + ' ' + ch.name + ' aktiv!', ch.color);
}

// ── Classes ───────────────────────────────────────────
function renderClassesShop() {
  if (!currentUser) return;
  document.getElementById('shop-coins').textContent = currentUser.coins || 0;
  const activeClass = currentUser.activeClass || null;

  const grid = document.getElementById('shop-classes-grid'); if (!grid) return;
  grid.innerHTML = '';

  CLASSES.forEach(cls => {
    const owned = isClassUnlocked(cls.id);
    const canBuy = !owned && (currentUser.coins||0) >= cls.price;
    const isActive = cls.id === activeClass;
    const clvl = getClassLevel(cls.id);
    const cxp  = getClassXP(cls.id);
    const nextXp = clvl < cls.levels.length - 1 ? cls.levels[clvl + 1].xpRequired : null;
    const rc = CLASS_RARITY_COLORS[cls.rarity] || '#9db4c8';

    const card = document.createElement('div');
    card.className = 'class-card' + (isActive ? ' active' : '') + (!owned && !canBuy ? ' locked' : '');
    card.style.borderColor = isActive ? cls.color : (owned ? rc : '#2a3a50');

    const levelInfo = owned
      ? `<div class="class-level-bar">
          <div style="display:flex;justify-content:space-between;font-size:.68rem;color:#9db4c8;margin-bottom:2px;">
            <span style="color:${cls.color};font-weight:700;">${cls.levels[clvl].name}</span>
            <span>Lv ${clvl+1}/5</span>
          </div>
          <div style="background:#0d1825;border-radius:4px;height:6px;overflow:hidden;">
            <div style="height:100%;background:${cls.color};width:${nextXp ? Math.round(cxp/nextXp*100) : 100}%;transition:width .3s;"></div>
          </div>
          <div style="font-size:.6rem;color:#5a7a90;margin-top:1px;">${nextXp ? cxp+'/'+nextXp+' XP' : 'MAX LEVEL'}</div>
        </div>`
      : '';

    const abilityText = cls.levels[clvl]?.bonus || '';

    card.innerHTML = `
      <div class="class-icon" style="color:${cls.color}">${cls.icon}</div>
      <div class="class-name" style="color:${cls.color}">${cls.name}</div>
      <div class="class-rarity" style="color:${rc}">${CLASS_RARITY_COLORS[cls.rarity] ? (cls.rarity==='epic'?'Episch':cls.rarity==='rare'?'Selten':'Gewöhnlich') : ''}</div>
      <div class="class-desc">${cls.desc}</div>
      ${owned ? `<div class="class-ability">📖 ${abilityText}</div>` : `<div class="class-ability" style="color:#4a6070;">${cls.levels[0].bonus}</div>`}
      ${levelInfo}
      <div class="class-mp-badge">${cls.soloNote ? `<span title="${cls.soloNote}" style="font-size:.62rem;color:#3498db;">ℹ Solo+MP</span>` : ''}</div>
      <div class="char-price" style="margin-top:.4rem;">
        ${isActive ? '<span style="color:#27ae60;font-weight:700;">✓ AKTIV</span>'
          : owned   ? '<button class="btn green sm class-select-btn">Auswählen</button>'
          : `<span style="color:${canBuy?'#f7c948':'#555'}">🪙 ${cls.price}</span>`}
      </div>
    `;

    if (!owned && canBuy) {
      card.onclick = () => buyClass(cls);
    } else if (owned && !isActive) {
      card.querySelector('.class-select-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        selectClass(cls.id);
      });
    }

    // Show level detail on click (owned)
    if (owned) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => showClassDetail(cls.id));
    }

    grid.appendChild(card);
  });
}

function showClassDetail(classId) {
  const cls = getClassDef(classId);
  if (!cls) return;
  const clvl = getClassLevel(classId);
  let html = `<div style="text-align:center;margin-bottom:.7rem;">
    <span style="font-size:2rem;">${cls.icon}</span>
    <div style="font-family:Bangers,cursive;font-size:1.4rem;color:${cls.color};letter-spacing:1px;">${cls.name}</div>
    <div style="font-size:.78rem;color:#9db4c8;">${cls.desc}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:5px;margin:.5rem 0;">`;
  cls.levels.forEach((lv, i) => {
    const isCur = i === clvl;
    const isLocked = i > clvl;
    html += `<div style="padding:5px 9px;border-radius:7px;border:1.5px solid ${isCur ? cls.color : (isLocked ? '#1a2535' : '#2a3a50')};
      background:${isCur ? 'rgba(0,0,0,.4)' : '#0a1220'};opacity:${isLocked ? .5 : 1};">
      <div style="font-family:Bangers,cursive;color:${isCur ? cls.color : '#9db4c8'};font-size:.85rem;">
        Lv${i+1}: ${lv.name} ${isCur ? '← AKTUELL' : (isLocked ? '🔒' : '✓')}
      </div>
      <div style="font-size:.7rem;color:#7a9ab0;margin-top:2px;">${lv.bonus}</div>
      ${i > 0 ? `<div style="font-size:.62rem;color:#4a6070;">Benötigt: ${lv.xpRequired} XP (Kills)</div>` : ''}
    </div>`;
  });
  html += '</div>';
  // Quick modal using existing panel style
  const ov = document.getElementById('ov-class-detail');
  if (ov) {
    document.getElementById('class-detail-body').innerHTML = html;
    const isActive = currentUser?.activeClass === classId;
    const selBtn = document.getElementById('class-detail-sel');
    if (selBtn) {
      selBtn.textContent = isActive ? '✓ Aktiv' : 'Auswählen';
      selBtn.className = 'btn ' + (isActive ? 'grey' : 'green');
      selBtn.onclick = () => { if (!isActive) selectClass(classId); closeClassDetail(); };
    }
    ov.classList.remove('h');
  }
}

function closeClassDetail() {
  const ov = document.getElementById('ov-class-detail');
  if (ov) ov.classList.add('h');
}

async function buyClass(cls) {
  if (!currentUser || (currentUser.coins||0) < cls.price) return;
  currentUser.coins -= cls.price;
  if (!currentUser.ownedClasses) currentUser.ownedClasses = [];
  currentUser.ownedClasses.push(cls.id);
  if (!currentUser.classLevels) currentUser.classLevels = {};
  if (!currentUser.classXP) currentUser.classXP = {};
  currentUser.classLevels[cls.id] = 0;
  currentUser.classXP[cls.id] = 0;
  await saveUserServer({
    coins: currentUser.coins,
    ownedClasses: currentUser.ownedClasses,
    classLevels: currentUser.classLevels,
    classXP: currentUser.classXP,
  });
  renderClassesShop();
}

async function selectClass(classId) {
  if (!currentUser) return;
  currentUser.activeClass = classId;
  await saveUserServer({ activeClass: classId });
  renderClassesShop();
}

async function deactivateClass() {
  if (!currentUser) return;
  currentUser.activeClass = null;
  await saveUserServer({ activeClass: null });
  renderClassesShop();
}

// ═══════════════════════════════════════════════════════
//  PERMA UPGRADES TAB (separate from shop)
// ═══════════════════════════════════════════════════════
function renderPermaUpg() {
  if (!currentUser) return;
  document.getElementById('upg-coins').textContent = currentUser.coins || 0;
  const el = document.getElementById('perma-upg-list'); el.innerHTML = '';
  PERMA_SHOP.forEach(u => {
    const lvl = (currentUser.perma||{})[u.id] || 0;
    const maxed = lvl >= u.max;
    const cost = u.price * (lvl + 1);
    const c = document.createElement('div');
    c.className = 'shop-card' + (maxed?' owned maxlvl':'') + (!maxed&&(currentUser.coins||0)<cost?' locked':'');
    c.innerHTML = `<div class="shop-icon">${u.icon}</div><div class="shop-name">${u.name} Lv${lvl}${maxed?' ★':''}</div>
      <div class="shop-price">${maxed?'MAX ★':'🪙'+cost}</div><div class="shop-desc">${u.desc}</div>`;
    if (!maxed && (currentUser.coins||0) >= cost) c.onclick = () => buyPerma(u);
    el.appendChild(c);
  });
}

// ═══════════════════════════════════════════════════════
//  BUY FUNCTIONS
// ═══════════════════════════════════════════════════════
async function buyWeapon(w) {
  if (!currentUser || (currentUser.coins||0) < w.price) return;
  currentUser.coins -= w.price;
  currentUser.weapons = [...(currentUser.weapons||[]), w.id];
  await saveUserServer({ coins: currentUser.coins, weapons: currentUser.weapons });
  renderWeaponsShop();
  document.getElementById('shop-coins').textContent = currentUser.coins;
}
async function buyKunai(k) {
  if (!currentUser || (currentUser.coins||0) < k.price) return;
  currentUser.coins -= k.price;
  if (k.id==='kunai_count') currentUser.kunaiCountLvl = (currentUser.kunaiCountLvl||0)+1;
  else currentUser.kunaiSpeedLvl = (currentUser.kunaiSpeedLvl||0)+1;
  await saveUserServer({ coins: currentUser.coins, kunaiCountLvl: currentUser.kunaiCountLvl, kunaiSpeedLvl: currentUser.kunaiSpeedLvl });
  renderWeaponsShop();
  document.getElementById('shop-coins').textContent = currentUser.coins;
}
async function buyGuardian() {
  const gLvl = currentUser.guardianShopLvl || 0;
  const cost = 600 * (gLvl + 1);
  if (!currentUser || (currentUser.coins||0) < cost || gLvl >= 6) return;
  currentUser.coins -= cost;
  currentUser.guardianShopLvl = gLvl + 1;
  await saveUserServer({ coins: currentUser.coins, guardianShopLvl: currentUser.guardianShopLvl });
  renderWeaponsShop();
  document.getElementById('shop-coins').textContent = currentUser.coins;
}
async function buyPerma(u) {
  const lvl = (currentUser.perma||{})[u.id] || 0;
  const cost = u.price * (lvl + 1);
  if (!currentUser || (currentUser.coins||0) < cost || lvl >= u.max) return;
  currentUser.coins -= cost;
  if (!currentUser.perma) currentUser.perma = {};
  currentUser.perma[u.id] = lvl + 1;
  await saveUserServer({ coins: currentUser.coins, perma: currentUser.perma });
  renderPermaUpg();
  document.getElementById('upg-coins').textContent = currentUser.coins;
}
async function buyPermaFromShop(u) {
  const lvl = (currentUser.perma||{})[u.id] || 0;
  const cost = u.price * (lvl + 1);
  if (!currentUser || (currentUser.coins||0) < cost || lvl >= u.max) return;
  currentUser.coins -= cost;
  if (!currentUser.perma) currentUser.perma = {};
  currentUser.perma[u.id] = lvl + 1;
  await saveUserServer({ coins: currentUser.coins, perma: currentUser.perma });
  renderPermaShop();
  document.getElementById('shop-coins').textContent = currentUser.coins;
}

// ═══════════════════════════════════════════════════════
//  PASSWORD CHANGE
// ═══════════════════════════════════════════════════════
async function changePassword() {
  const old = document.getElementById('pw-old').value;
  const nw  = document.getElementById('pw-new').value;
  const nw2 = document.getElementById('pw-new2').value;
  const msg = document.getElementById('pw-msg');
  msg.style.color = '#e74c3c';
  if (!old)  { msg.textContent = 'Altes Passwort eingeben.'; return; }
  if (nw.length < 4) { msg.textContent = 'Neues Passwort: mind. 4 Zeichen.'; return; }
  if (nw !== nw2)    { msg.textContent = 'Passwörter stimmen nicht überein.'; return; }
  try {
    await api('POST', '/api/me/password', { oldPassword: old, newPassword: nw });
    msg.style.color = '#27ae60';
    msg.textContent = '✓ Passwort erfolgreich geändert!';
    document.getElementById('pw-old').value = '';
    document.getElementById('pw-new').value = '';
    document.getElementById('pw-new2').value = '';
    setTimeout(() => { msg.textContent = ''; }, 4000);
  } catch(e) {
    msg.style.color = '#e74c3c';
    msg.textContent = '❌ ' + e.message;
  }
}

// ═══════════════════════════════════════════════════════
//  LEADERBOARD EDIT (owner only)
// ═══════════════════════════════════════════════════════
let hsEditMode = false;
let hsCurrentEntries = [];

function toggleHsEdit() {
  hsEditMode = !hsEditMode;
  const btn = document.getElementById('hs-edit-btn');
  if(btn) {
    btn.textContent = hsEditMode ? '✓ Fertig' : '✏ Bearbeiten';
    btn.style.background = hsEditMode ? '#27ae60' : 'transparent';
    btn.style.color = hsEditMode ? '#fff' : '#e74c3c';
  }
  renderHS();
}

async function deleteScore(id, playerName) {
  if (!confirm('Eintrag von ' + playerName + ' löschen?')) return;
  try { await api('DELETE', '/api/admin/score/' + id); renderHS(); }
  catch(e) { alert('Fehler: ' + e.message); }
}

async function deleteAllScores(playerName) {
  if (!confirm('ALLE Einträge von ' + playerName + ' löschen?')) return;
  try { await api('DELETE', '/api/admin/scores/' + playerName); renderHS(); }
  catch(e) { alert('Fehler: ' + e.message); }
}

// ═══════════════════════════════════════════════════════
//  LEADERBOARD
// ═══════════════════════════════════════════════════════
let hsCurrentView = 'global', hsCurrentFilter = 'all', hsCurrentSort = 'secs';
const DIFF_LABELS = { easy:'Einfach',normal:'Normal',hard:'Schwer',nightmare:'Albtraum' };
const DIFF_BADGE_CLASS = { easy:'diff-easy',normal:'diff-normal',hard:'diff-hard',nightmare:'diff-nightmare' };
const RANK_MEDALS = ['🥇','🥈','🥉'];

function hsFilter(f, btn) {
  hsCurrentFilter = f;
  document.querySelectorAll('.hs-filter-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderHS();
}
function hsSetView(v, btn) {
  hsCurrentView = v;
  document.querySelectorAll('.hs-view-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('hs-sort-row').style.display = v==='global' ? 'flex' : 'none';
  renderHS();
}
function hsSetSort(s, btn) {
  hsCurrentSort = s;
  document.querySelectorAll('.hs-sort-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderHS();
}

async function renderHS() {
  const tbody  = document.getElementById('hs-tbody');
  const empty  = document.getElementById('hs-empty');
  const summary= document.getElementById('hs-summary');
  const myRank = document.getElementById('hs-my-rank');
  const thead  = document.getElementById('hs-thead-row');

  if (tbody._hsDelHandler) {
    tbody.removeEventListener('click', tbody._hsDelHandler);
    tbody._hsDelHandler = null;
  }
  tbody.innerHTML = '';

  let entries;
  try {
    if (hsCurrentView === 'global') {
      entries = await api('GET', `/api/scores?diff=${hsCurrentFilter}&sort=${hsCurrentSort}&limit=50`);
    } else {
      entries = await api('GET', `/api/scores/me?diff=${hsCurrentFilter}`);
    }
  } catch (e) {
    empty.style.display = 'block';
    empty.textContent = 'Fehler: ' + e.message;
    return;
  }

  const isGlobal = hsCurrentView === 'global';
  const showEdit = isGlobal && hsEditMode;

  const editTh = showEdit ? '<th style="width:54px;min-width:54px;"></th>' : '';
  thead.innerHTML = isGlobal
    ? editTh + '<th class="c">#</th><th>Spieler</th><th>Zeit</th><th class="r">☠ Kills</th><th class="c">Diff</th><th class="r">Welle</th><th class="r">Modus</th><th class="r" style="font-size:.65rem;">Datum</th>'
    : '<th class="c">#</th><th>Zeit</th><th class="r">☠ Kills</th><th class="c">Diff</th><th class="r">Welle</th><th class="r">Modus</th><th class="r" style="font-size:.65rem;">Datum</th>';

  if (!entries.length) {
    empty.style.display = 'block';
    empty.textContent = t('no_entries');
    summary.textContent = ''; myRank.textContent = '';
    return;
  }
  empty.style.display = 'none';

  const diffL = DIFF_LABELS;
  let myBestRank = -1;

  entries.forEach((entry, i) => {
    const player  = String(entry.player || '?');
    const entryId = String(entry._id   || '');
    const isMe    = isGlobal && player.toLowerCase() === (currentUser?.username||'').toLowerCase();
    if (isMe && myBestRank === -1) myBestRank = i + 1;

    const medal     = i < 3 ? RANK_MEDALS[i] : String(i + 1);
    const dc        = DIFF_BADGE_CLASS[entry.diff] || 'diff-normal';
    const dl        = diffL[entry.diff] || entry.diff || '?';
    const modeLabel = entry.mode === 'coop' ? '🤝' : entry.mode === 'versus' ? '⚔️' : '👤';

    const tr = document.createElement('tr');
    if (isMe) tr.className = 'my-row';

    if (showEdit) {
      const td = document.createElement('td');
      td.className = 'c';
      td.style.whiteSpace = 'nowrap';
      const btnOne = document.createElement('button');
      btnOne.textContent = '✕'; btnOne.title = 'Eintrag löschen';
      btnOne.className = 'hs-del-one'; btnOne.dataset.id = entryId; btnOne.dataset.player = player;
      btnOne.style.cssText = 'background:#3a0808;border:none;border-radius:3px;color:#ff6666;font-size:.6rem;padding:2px 6px;cursor:pointer;margin:1px;';
      const btnAll = document.createElement('button');
      btnAll.textContent = '✕✕'; btnAll.title = 'Alle Einträge dieses Spielers löschen';
      btnAll.className = 'hs-del-all'; btnAll.dataset.player = player;
      btnAll.style.cssText = 'background:#5a0000;border:none;border-radius:3px;color:#ff4444;font-size:.6rem;padding:2px 6px;cursor:pointer;margin:1px;';
      td.appendChild(btnOne); td.appendChild(btnAll); tr.appendChild(td);
    }

    function addTd(html, cls, extraStyle) {
      const td = document.createElement('td');
      if (cls) td.className = cls;
      if (extraStyle) td.style.cssText = extraStyle;
      td.innerHTML = html;
      tr.appendChild(td);
    }

    if (isGlobal) {
      addTd(medal, 'c');
      const nameStyle = isMe ? 'font-weight:700;color:#f7c948;' : '';
      addTd((isMe ? '★ ' : '') + player, '', nameStyle);
    }
    addTd('<b>' + (entry.time||'?') + '</b>');
    addTd(String(entry.kills||0), 'r');
    addTd('<span class="diff-badge ' + dc + '">' + dl + '</span>', 'c');
    addTd(String(entry.wave||'?'), 'r');
    addTd(modeLabel, 'r');
    addTd(entry.date||'', 'r', 'color:#4a6a80;font-size:.68rem;');
    tbody.appendChild(tr);
  });

  if (showEdit) {
    tbody._hsDelHandler = async function(ev) {
      const btnOne = ev.target.closest('.hs-del-one');
      const btnAll = ev.target.closest('.hs-del-all');
      if (!btnOne && !btnAll) return;
      ev.stopPropagation();
      if (btnOne) {
        const id = btnOne.dataset.id; const player = btnOne.dataset.player;
        if (!id || id === 'undefined') { alert('Fehler: Kein Eintrag-ID.'); return; }
        if (!confirm('Eintrag von "' + player + '" löschen?')) return;
        btnOne.disabled = true; btnOne.textContent = '⏳';
        try { await api('DELETE', '/api/admin/score/' + id); await renderHS(); }
        catch(e) { alert('Fehler: ' + e.message); await renderHS(); }
      } else if (btnAll) {
        const player = btnAll.dataset.player;
        if (!confirm('ALLE Einträge von "' + player + '" löschen?')) return;
        btnAll.disabled = true; btnAll.textContent = '⏳';
        try { await api('DELETE', '/api/admin/scores/' + encodeURIComponent(player)); await renderHS(); }
        catch(e) { alert('Fehler: ' + e.message); await renderHS(); }
      }
    };
    tbody.addEventListener('click', tbody._hsDelHandler);
  }

  if (isGlobal) {
    const playerCount = new Set(entries.map(e=>(e.player||'').toLowerCase())).size;
    const totalKills  = entries.reduce((s,e)=>s+(e.kills||0),0);
    summary.innerHTML = '<b style="color:#f7c948;">' + entries.length + '</b> Einträge von <b style="color:#7ecff7;">' + playerCount + '</b> Spielern · Kills: <b style="color:#27ae60;">' + totalKills.toLocaleString() + '</b>';
    myRank.innerHTML = myBestRank > 0 ? 'Deine beste Platzierung: <b style="color:#f7c948;">#' + myBestRank + '</b>' : 'Du hast noch keinen Eintrag.';
  } else {
    summary.innerHTML = '<b style="color:#f7c948;">' + entries.length + '</b> Runden · Beste Zeit: <b style="color:#f7c948;">' + entries[0].time + '</b>';
    myRank.textContent = '';
  }
}

// ═══════════════════════════════════════════════════════
//  FRIENDS SYSTEM
// ═══════════════════════════════════════════════════════
async function sendFriendRequest() {
  const input = document.getElementById('friend-search-input');
  const target = input.value.trim();
  const err = document.getElementById('friend-err');
  if (!target) { err.textContent = 'Benutzername eingeben.'; return; }
  if (target.toLowerCase() === (currentUser?.username||'').toLowerCase()) { err.textContent = 'Du kannst dir nicht selbst eine Anfrage senden.'; return; }
  try {
    await api('POST', '/api/friends/request', { to: target });
    err.style.color = '#27ae60';
    err.textContent = 'Anfrage an ' + target + ' gesendet!';
    input.value = '';
    setTimeout(() => { err.textContent = ''; err.style.color = ''; }, 3000);
  } catch(e) { err.style.color = '#e74c3c'; err.textContent = e.message; }
}

async function refreshFriends() {
  const err = document.getElementById('friend-err');
  if(err) err.textContent = '';
  try {
    const data = await api('GET', '/api/friends');
    renderFriendsList(data.friends || [], data.incoming || []);
  } catch(e) { if(err) err.textContent = 'Fehler: ' + e.message; }
}

function renderFriendsList(friends, incoming) {
  const reqSection = document.getElementById('friend-requests-section');
  const reqList = document.getElementById('friend-requests-list');
  if (incoming.length > 0) {
    reqSection.style.display = 'block';
    reqList.innerHTML = '';
    incoming.forEach(req => {
      const row = document.createElement('div');
      row.className = 'friend-req-row';
      row.innerHTML = `<div class="friend-avatar">${req.from[0].toUpperCase()}</div>
        <span style="flex:1;"><b>${req.from}</b> möchte befreundet sein</span>
        <button class="btn green sm" style="font-size:.7rem;padding:3px 8px;" onclick="respondFriendRequest('${req.from}',true)">✓</button>
        <button class="btn red sm" style="font-size:.7rem;padding:3px 8px;" onclick="respondFriendRequest('${req.from}',false)">✕</button>`;
      reqList.appendChild(row);
    });
    document.getElementById('friend-notif').style.display = 'inline-block';
  } else {
    reqSection.style.display = 'none';
    document.getElementById('friend-notif').style.display = 'none';
  }
  const list = document.getElementById('friends-list');
  const empty = document.getElementById('friends-empty');
  list.innerHTML = '';
  if (!friends.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  friends.forEach(f => {
    const row = document.createElement('div');
    row.className = 'friend-row';
    const sc = f.status==='online'?'online':f.status==='ingame'?'ingame':'offline';
    const st = f.status==='online'?'🟢 Online':f.status==='ingame'?'🎮 Im Spiel':'⚫ Offline';
    row.innerHTML = `<div class="friend-avatar">${f.username[0].toUpperCase()}</div>
      <div class="friend-name">${f.username}</div>
      <span class="friend-status ${sc}">${st}</span>
      <button class="btn blue sm" style="font-size:.7rem;padding:3px 8px;" onclick="inviteFriend('${f.username}')">Einladen</button>
      <button class="btn grey sm" style="font-size:.7rem;padding:3px 8px;" onclick="removeFriend('${f.username}')">✕</button>`;
    list.appendChild(row);
  });
}

async function respondFriendRequest(from, accept) {
  try { await api('POST', '/api/friends/respond', { from, accept }); refreshFriends(); }
  catch(e) { document.getElementById('friend-err').textContent = e.message; }
}
async function removeFriend(username) {
  try { await api('DELETE', '/api/friends/' + username); refreshFriends(); }
  catch(e) { document.getElementById('friend-err').textContent = e.message; }
}
function inviteFriend(username) {
  const err = document.getElementById('friend-err');
  if (!currentParty) { err.style.color='#e74c3c'; err.textContent = 'Erstelle zuerst eine Party!'; setTimeout(()=>{err.textContent='';err.style.color='';},3000); return; }
  if (socket) socket.emit('party:inviteFriend', { to: username, code: currentParty.code });
  err.style.color = '#27ae60'; err.textContent = 'Einladung an ' + username + ' gesendet!';
  setTimeout(()=>{ err.textContent=''; err.style.color=''; }, 3000);
}
async function checkFriendNotifications() {
  try {
    const data = await api('GET', '/api/friends');
    if ((data.incoming || []).length > 0) document.getElementById('friend-notif').style.display = 'inline-block';
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════
//  CANVAS SIZE SETTING
// ═══════════════════════════════════════════════════════
let canvasScalePct = parseInt(localStorage.getItem('zw_canvas_scale') || '100');

function setCanvasScale(pct) {
  canvasScalePct = parseInt(pct);
  localStorage.setItem('zw_canvas_scale', canvasScalePct);
  const label = document.getElementById('canvas-size-label');
  if (label) label.textContent = canvasScalePct + '%';
  applyCanvasScale();
}

function applyCanvasScale() {
  const scale = canvasScalePct / 100;
  const wrap  = document.getElementById('wrap');
  if (!wrap) return;
  wrap.style.transform = scale === 1 ? '' : `scale(${scale})`;
  const slider = document.getElementById('canvas-size-slider');
  if (slider) slider.value = canvasScalePct;
  const label = document.getElementById('canvas-size-label');
  if (label) label.textContent = canvasScalePct + '%';
}

window.addEventListener('load', () => { applyCanvasScale(); }, { once: false });

// ═══════════════════════════════════════════════════════
//  JUMPSCARE SYSTEM
// ═══════════════════════════════════════════════════════
let jumpscareActive = false;
const JS_FACES = ['👹','💀','👻','🎃','😱','👁️'];

function triggerJumpscare(onDone) {
  if (jumpscareActive) return;
  jumpscareActive = true;
  if (typeof paused !== 'undefined') paused = true;
  if (typeof mouse !== 'undefined')  mouse.down = false;
  const ov   = document.getElementById('ov-jumpscare');
  const face = document.getElementById('js-face');
  const txt  = document.getElementById('js-text');
  ov.style.display   = 'flex';
  face.style.display = 'block';
  txt.style.display  = 'none';
  face.style.fontSize = '0';
  face.textContent    = JS_FACES[Math.floor(Math.random() * JS_FACES.length)];
  face.style.filter   = 'none';
  playJumpscareSound();
  setTimeout(() => { face.style.fontSize = '25rem'; face.style.filter = 'drop-shadow(0 0 40px #ff0000) drop-shadow(0 0 80px #cc0000)'; }, 50);
  let shakeCount = 0;
  const shakeInterval = setInterval(() => {
    ov.style.transform = `translate(${(Math.random()-.5)*30}px,${(Math.random()-.5)*30}px)`;
    if (++shakeCount > 15) { clearInterval(shakeInterval); ov.style.transform = ''; }
  }, 50);
  setTimeout(() => {
    face.style.display = 'none'; txt.style.display = 'block'; txt.innerHTML = '';
    startGlitchText(txt, 'you think you can outplay me .....', () => {
      setTimeout(() => {
        txt.style.display = 'none'; face.style.display = 'block';
        face.textContent = JS_FACES[Math.floor(Math.random() * JS_FACES.length)];
        face.style.fontSize = '0'; face.style.filter = 'drop-shadow(0 0 60px #ff0000)';
        playJumpscareSound();
        setTimeout(() => { face.style.fontSize = '30rem'; }, 30);
        setTimeout(() => {
          ov.style.display = 'none'; face.style.display = 'none';
          txt.style.display = 'none'; face.style.fontSize = '0';
          jumpscareActive = false;
          if (onDone) onDone();
          setTimeout(triggerDelayedJumpscare, 45000 + Math.random() * 30000);
        }, 1800);
      }, 600);
    });
  }, 2200);
}

function triggerDelayedJumpscare() {
  const ov   = document.getElementById('ov-jumpscare');
  const face = document.getElementById('js-face');
  if (!ov) return;
  if (typeof paused !== 'undefined') paused = true;
  if (typeof mouse  !== 'undefined') mouse.down = false;
  ov.style.display = 'flex'; face.style.display = 'block';
  face.textContent = JS_FACES[Math.floor(Math.random() * JS_FACES.length)];
  face.style.fontSize = '0'; face.style.filter = 'drop-shadow(0 0 60px #ff0000)';
  playJumpscareSound();
  setTimeout(() => { face.style.fontSize = '28rem'; }, 30);
  let sc = 0;
  const si = setInterval(() => {
    ov.style.transform = `translate(${(Math.random()-.5)*25}px,${(Math.random()-.5)*25}px)`;
    if (++sc > 12) { clearInterval(si); ov.style.transform = ''; }
  }, 55);
  setTimeout(() => {
    ov.style.display = 'none'; face.style.fontSize = '0'; jumpscareActive = false;
    if (typeof paused !== 'undefined') paused = false;
  }, 1500);
}

function startGlitchText(el, message, onDone) {
  const glitchChars = '!@#$%^&*<>?/\\|{}[]~`ÄÖÜ€£¥§';
  let revealed = 0;
  el.style.cssText = 'color:#ff0000;font-size:2.8rem;font-family:Bangers,cursive;letter-spacing:4px;line-height:1.5;text-shadow:3px 3px 0 #440000, -2px -2px 8px #ff4400;';
  const revealInterval = setInterval(() => {
    let display = '';
    for (let i = 0; i < message.length; i++) {
      display += i < revealed ? message[i] : glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    el.style.color = Math.random() < 0.3 ? '#ffffff' : '#ff0000';
    el.style.textShadow = Math.random() < 0.2 ? '-4px 0 #00ffff, 4px 0 #ff00ff' : '3px 3px 0 #440000, -2px -2px 8px #ff4400';
    if (Math.random() < 0.15) el.style.transform = `translate(${(Math.random()-.5)*8}px,${(Math.random()-.5)*4}px)`;
    else el.style.transform = '';
    el.textContent = display;
    revealed += 0.5;
    if (revealed >= message.length) {
      clearInterval(revealInterval);
      el.textContent = message; el.style.color = '#ff0000'; el.style.transform = '';
      if (onDone) setTimeout(onDone, 1200);
    }
  }, 60);
}

function playJumpscareSound() {
  try {
    if (typeof ensureAC === 'function') ensureAC();
    if (!AC) return;
    const t = AC.currentTime;
    const buf = AC.createBuffer(1, AC.sampleRate * 0.8, AC.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.4));
    const src = AC.createBufferSource(), filt = AC.createBiquadFilter(), gain = AC.createGain();
    filt.type = 'highpass'; filt.frequency.value = 2000;
    gain.gain.setValueAtTime(1.5, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    src.buffer = buf; src.connect(filt); filt.connect(gain); gain.connect(AC.destination);
    src.start(t); src.stop(t + 0.8);
    const osc = AC.createOscillator(), og = AC.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, t); osc.frequency.exponentialRampToValueAtTime(20, t + 0.5);
    og.gain.setValueAtTime(2.0, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(og); og.connect(AC.destination); osc.start(t); osc.stop(t + 0.5);
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════
//  DEVICE CONFIG (no picker — auto-detect)
// ═══════════════════════════════════════════════════════
let currentDevice = 'pc';

function applyDeviceConfig(device) {
  currentDevice = device || 'pc';
  const isMobile = currentDevice === 'mobile';
  const isTablet = currentDevice === 'tablet';
  const touch = isMobile || isTablet;

  document.body.style.cursor = touch ? 'default' : 'none';

  const saved = localStorage.getItem('zw_canvas_scale');
  const defaultScale = isMobile ? 60 : isTablet ? 85 : 100;
  canvasScalePct = saved ? parseInt(saved) : defaultScale;
  applyCanvasScale();

  const slider = document.getElementById('canvas-size-slider');
  if (slider) slider.value = canvasScalePct;
  const lbl = document.getElementById('canvas-size-label');
  if (lbl) lbl.textContent = canvasScalePct + '%';

  const touchUI = document.getElementById('touch-ui');
  if (touchUI) touchUI.style.display = touch ? 'block' : 'none';

  const di = document.getElementById('current-device-label');
  if (di) di.textContent = currentDevice;
}

// Auto-detect device on load, no picker shown
window.addEventListener('load', () => {
  const ua = navigator.userAgent;
  let device = 'pc';
  if (/Mobi|Android|iPhone/i.test(ua)) device = 'mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'tablet';
  applyDeviceConfig(device);
}, { once: true });

// ── Admin panel positioning ──────────────────────────
function positionAdminPanels() {
  // Fixed to viewport top-right — unaffected by canvas scale
  const adminBtn     = document.getElementById('admin-btn');
  const adminPanel   = document.getElementById('admin-panel');
  const grantedBtn   = document.getElementById('granted-admin-btn');
  const grantedPanel = document.getElementById('granted-admin-panel');
  if (adminBtn)    { adminBtn.style.top    = '8px';  adminBtn.style.right    = '8px';   adminBtn.style.left    = 'auto'; }
  if (adminPanel)  { adminPanel.style.top  = '46px'; adminPanel.style.right  = '8px';   adminPanel.style.left  = 'auto'; }
  if (grantedBtn)  { grantedBtn.style.top  = '8px';  grantedBtn.style.right  = '100px'; grantedBtn.style.left  = 'auto'; }
  if (grantedPanel){ grantedPanel.style.top = '46px'; grantedPanel.style.right = '100px'; grantedPanel.style.left = 'auto'; }
}

const _origApplyScale = applyCanvasScale;
function applyCanvasScale() { _origApplyScale(); setTimeout(positionAdminPanels, 50); }
window.addEventListener('resize', positionAdminPanels);

// ═══════════════════════════════════════════════════════
//  TOUCH CONTROLS
// ═══════════════════════════════════════════════════════
let joystickActive = false, joystickId = null;
let joystickOriginX = 0, joystickOriginY = 0;
let touchMoveX = 0, touchMoveY = 0;

function initTouchControls() {
  const zone = document.getElementById('joystick-zone');
  if (!zone || zone._touchInited) return;
  zone._touchInited = true;
  zone.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.changedTouches[0]; joystickActive = true; joystickId = t.identifier;
    const r = zone.getBoundingClientRect();
    joystickOriginX = r.left + r.width/2; joystickOriginY = r.top + r.height/2;
    moveJoystick(t.clientX, t.clientY);
  }, { passive: false });
  zone.addEventListener('touchmove', e => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickId) moveJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
    }
  }, { passive: false });
  zone.addEventListener('touchend', e => {
    e.preventDefault(); joystickActive = false; joystickId = null; touchMoveX = 0; touchMoveY = 0;
    const knob = document.getElementById('joystick-knob');
    if (knob) knob.style.transform = 'translate(-50%,-50%)';
  }, { passive: false });
  const cv = document.getElementById('c');
  if (cv) {
    cv.addEventListener('touchmove', e => {
      e.preventDefault();
      if (!window.gameRunning) return;
      const r = cv.getBoundingClientRect(); const scale = (window.canvasScalePct || 100) / 100;
      let rt = e.touches[0];
      for (let i = 1; i < e.touches.length; i++) { if (e.touches[i].clientX > rt.clientX) rt = e.touches[i]; }
      if (window.mouse) { window.mouse.x = (rt.clientX - r.left) / scale; window.mouse.y = (rt.clientY - r.top) / scale; }
    }, { passive: false });
  }
}

function moveJoystick(cx, cy) {
  const dx = cx - joystickOriginX, dy = cy - joystickOriginY;
  const dist = Math.sqrt(dx*dx + dy*dy), maxR = 38, clamp = Math.min(dist, maxR);
  touchMoveX = dist > 5 ? dx/dist : 0; touchMoveY = dist > 5 ? dy/dist : 0;
  const knob = document.getElementById('joystick-knob');
  if (knob) {
    const kx = dist > 0 ? (dx/dist)*clamp : 0, ky = dist > 0 ? (dy/dist)*clamp : 0;
    knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
  }
}

function touchShootOn(e)  { e.preventDefault(); if (window.mouse) window.mouse.down = true;  if (typeof ensureAC === 'function') ensureAC(); }
function touchShootOff()  { if (window.mouse) window.mouse.down = false; }
function touchReload()    { const w = typeof curWpn === 'function' ? curWpn() : null; if (w && window.gameRunning) startReload(w); }
function touchDash()      { if (window.G && window.G.hasDash && window.G.dashCd <= 0) { window.G.dashActive = true; window.G.dashTimer = 18; window.G.dashCd = 220; } }

function buildTouchWpnRow() {
  const row = document.getElementById('touch-wpn-row');
  if (!row || !window.G) return;
  row.innerHTML = '';
  (window.G.ownedWpns || []).forEach((w, i) => {
    const btn = document.createElement('div');
    btn.className = 'twpn' + (i === window.G.activeWpn ? ' active' : '');
    btn.textContent = w.icon;
    btn.addEventListener('touchstart', e => { e.preventDefault(); if (typeof switchWpn === 'function') switchWpn(i); buildTouchWpnRow(); });
    row.appendChild(btn);
  });
}

Object.defineProperty(window, '_touchMoveX', { get: () => touchMoveX });
Object.defineProperty(window, '_touchMoveY', { get: () => touchMoveY });

function changeDevice() {
  // Settings: manually pick touch/pc
  const pick = prompt('Gerät wählen: pc / tablet / mobile');
  if (pick && ['pc','tablet','mobile'].includes(pick.toLowerCase())) applyDeviceConfig(pick.toLowerCase());
}
