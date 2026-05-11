// ═══════════════════════════════════════════════════════
//  SHOP DATA
// ═══════════════════════════════════════════════════════
const WEAPONS_SHOP = [
  { id:'pistol',  name:'Pistole',     icon:'🔫', price:0,     desc:'Startwaffe. 15 Schuss.' },
  { id:'rifle',   name:'Sturmgewehr', icon:'🪖', price:300,   desc:'Feuerrate +, 30 Schuss.' },
  { id:'shotgun', name:'Schrotflinte',icon:'💥', price:500,   desc:'5 Zombies, kurze Reichweite.' },
  { id:'kunai',   name:'Kunai',       icon:'🗡️', price:750,   desc:'Auto-Ziel. Wirft Kunais.' },
  { id:'sniper',  name:'Sniper',      icon:'🎯', price:1250,  desc:'Große Reichweite, hoher Schaden.' },
  { id:'rpg',     name:'RPG',         icon:'🚀', price:7500,  desc:'Explosionsrakete, AOE.' },
  { id:'molotov', name:'Molotov',     icon:'🍾', price:5500,  desc:'Feuerzone, Schaden über Zeit.' },
  { id:'minigun', name:'Minigun',     icon:'⚙️', price:25000, desc:'Dauerfeuer, 4 Sek Cooldown.' },
];
const PERMA_SHOP = [
  { id:'hp',    name:'+HP',     icon:'❤️', price:300, max:5, desc:'+25 HP/Stufe.' },
  { id:'speed', name:'Speed',   icon:'👟', price:300, max:5, desc:'+10% Speed/Stufe.' },
  { id:'dmg',   name:'Schaden', icon:'💥', price:350, max:5, desc:'+15% Dmg/Stufe.' },
  { id:'reload',name:'Reload',  icon:'🔄', price:300, max:5, desc:'-10% Reload/Stufe.' },
  { id:'mag',   name:'Magazin', icon:'📦', price:300, max:5, desc:'+10 Schuss/Stufe.' },
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
  // set lang btn state
  document.getElementById('lang-de').classList.toggle('on', currentLang === 'de');
  document.getElementById('lang-en').classList.toggle('on', currentLang === 'en');
  menuTab('play');
  renderShop();
  renderLevelGrid('level-grid', false);
  // Show admin button in menu too
  const isAdminMenu = ['mrmaik','mrmaik'].includes((currentUser?.username||'').toLowerCase());
  const abtn = document.getElementById('admin-btn');
  if(abtn) abtn.style.display = isAdminMenu ? 'block' : 'none';
}

function menuTab(tab) {
  ['play','mp','shop','upgrades','hs','friends','settings','admin-view'].forEach(id => {
    const el = document.getElementById('tab-' + id);
    if (el) el.style.display = id === tab ? 'block' : 'none';
    const btn = document.getElementById('mt-' + id);
    if (btn) btn.classList.toggle('on', id === tab);
  });
  if (tab === 'shop') renderShop();
  if (tab === 'upgrades') renderPermaUpg();
  if (tab === 'hs') { hsCurrentFilter = 'all'; renderHS(); }
  if (tab === 'friends') refreshFriends();
  if (tab === 'mp') renderLevelGrid('mp-level-grid', true);
}

function renderShop() {
  if (!currentUser) return;
  document.getElementById('shop-coins').textContent = currentUser.coins || 0;
  const wc = document.getElementById('shop-weapons'); wc.innerHTML = '';
  WEAPONS_SHOP.forEach(w => {
    const owned = (currentUser.weapons || []).includes(w.id);
    const c = document.createElement('div');
    c.className = 'shop-card' + (owned ? ' owned' : '') + (!owned && (currentUser.coins||0) < w.price ? ' locked' : '');
    c.innerHTML = `<div class="shop-icon">${w.icon}</div><div class="shop-name">${w.name}</div>
      <div class="shop-price">${owned ? '✓' : w.price===0 ? 'Free' : '🪙'+w.price}</div>
      <div class="shop-desc">${w.desc}</div>`;
    if (!owned && (currentUser.coins||0) >= w.price) c.onclick = () => buyWeapon(w);
    wc.appendChild(c);
  });
  const pc = document.getElementById('shop-perma'); pc.innerHTML = '';
  if ((currentUser.weapons||[]).includes('kunai')) {
    KUNAI_SHOP.forEach(k => {
      const lvl = k.id==='kunai_count' ? (currentUser.kunaiCountLvl||0) : (currentUser.kunaiSpeedLvl||0);
      const maxed = lvl >= k.max;
      const c = document.createElement('div');
      c.className = 'shop-card' + (maxed ? ' owned maxlvl' : '') + (!maxed&&(currentUser.coins||0)<k.price ? ' locked' : '');
      c.innerHTML = `<div class="shop-icon">${k.icon}</div><div class="shop-name">${k.name} Lv${lvl}${maxed?' ★':''}</div>
        <div class="shop-price">${maxed ? 'MAX ★' : '🪙'+k.price}</div><div class="shop-desc">${k.desc}</div>`;
      if (!maxed && (currentUser.coins||0) >= k.price) c.onclick = () => buyKunai(k);
      pc.appendChild(c);
    });
  }
  // Guardian
  const gLvl = currentUser.guardianShopLvl || 0;
  const gMaxed = gLvl >= 6;
  const gCost = 600 * (gLvl + 1);
  const gc = document.createElement('div');
  gc.className = 'shop-card' + (gMaxed?' owned maxlvl':'') + (!gMaxed&&(currentUser.coins||0)<gCost?' locked':'');
  gc.innerHTML = `<div class="shop-icon">⚔️</div><div class="shop-name">Guardian Lv${gLvl}${gMaxed?' ★':''}</div>
    <div class="shop-price">${gMaxed?'MAX ★':'🪙'+gCost}</div>
    <div class="shop-desc">Lv1-5: Klingen 30s an/15s aus. Lv6: 6 Klingen permanent!</div>`;
  if (!gMaxed && (currentUser.coins||0) >= gCost) gc.onclick = () => buyGuardian();
  pc.appendChild(gc);
}

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

async function buyWeapon(w) {
  if (!currentUser || (currentUser.coins||0) < w.price) return;
  currentUser.coins -= w.price;
  currentUser.weapons = [...(currentUser.weapons||[]), w.id];
  await saveUserServer({ coins: currentUser.coins, weapons: currentUser.weapons });
  renderShop();
}
async function buyKunai(k) {
  if (!currentUser || (currentUser.coins||0) < k.price) return;
  currentUser.coins -= k.price;
  if (k.id==='kunai_count') currentUser.kunaiCountLvl = (currentUser.kunaiCountLvl||0)+1;
  else currentUser.kunaiSpeedLvl = (currentUser.kunaiSpeedLvl||0)+1;
  await saveUserServer({ coins: currentUser.coins, kunaiCountLvl: currentUser.kunaiCountLvl, kunaiSpeedLvl: currentUser.kunaiSpeedLvl });
  renderShop();
}
async function buyGuardian() {
  const gLvl = currentUser.guardianShopLvl || 0;
  const cost = 60 * (gLvl + 1);
  if (!currentUser || (currentUser.coins||0) < cost || gLvl >= 6) return;
  currentUser.coins -= cost;
  currentUser.guardianShopLvl = gLvl + 1;
  await saveUserServer({ coins: currentUser.coins, guardianShopLvl: currentUser.guardianShopLvl });
  renderShop();
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
let hsCurrentEntries = []; // cache last loaded entries with their _id

function toggleHsEdit() {
  hsEditMode = !hsEditMode;
  const btn = document.getElementById('hs-edit-btn');
  if(btn) {
    btn.textContent = hsEditMode ? '✓ Fertig' : '✏ Bearbeiten';
    btn.style.background = hsEditMode ? '#27ae60' : 'transparent';
    btn.style.color = hsEditMode ? '#fff' : '#e74c3c';
  }
  renderHS(); // re-render with/without delete buttons
}

async function deleteScore(id, playerName) {
  if (!confirm('Eintrag von ' + playerName + ' löschen?')) return;
  try {
    await api('DELETE', '/api/admin/score/' + id);
    renderHS();
  } catch(e) { alert('Fehler: ' + e.message); }
}

async function deleteAllScores(playerName) {
  if (!confirm('ALLE Einträge von ' + playerName + ' löschen?')) return;
  try {
    await api('DELETE', '/api/admin/scores/' + playerName);
    renderHS();
  } catch(e) { alert('Fehler: ' + e.message); }
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

  // Detach any old click handler before clearing tbody
  if (tbody._hsDelHandler) {
    tbody.removeEventListener('click', tbody._hsDelHandler);
    tbody._hsDelHandler = null;
  }
  tbody.innerHTML = '';

  let entries;
  try {
    if (hsCurrentView === 'global') {
      entries = await api('GET',
        `/api/scores?diff=${hsCurrentFilter}&sort=${hsCurrentSort}&limit=50`);
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

  // Build thead
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
      // Build delete cell with DOM (no innerHTML quoting issues)
      const td = document.createElement('td');
      td.className = 'c';
      td.style.whiteSpace = 'nowrap';

      const btnOne = document.createElement('button');
      btnOne.textContent = '✕';
      btnOne.title = 'Eintrag löschen';
      btnOne.className = 'hs-del-one';
      btnOne.dataset.id = entryId;
      btnOne.dataset.player = player;
      btnOne.style.cssText = 'background:#3a0808;border:none;border-radius:3px;color:#ff6666;font-size:.6rem;padding:2px 6px;cursor:pointer;margin:1px;';

      const btnAll = document.createElement('button');
      btnAll.textContent = '✕✕';
      btnAll.title = 'Alle Einträge dieses Spielers löschen';
      btnAll.className = 'hs-del-all';
      btnAll.dataset.player = player;
      btnAll.style.cssText = 'background:#5a0000;border:none;border-radius:3px;color:#ff4444;font-size:.6rem;padding:2px 6px;cursor:pointer;margin:1px;';

      td.appendChild(btnOne);
      td.appendChild(btnAll);
      tr.appendChild(td);
    }

    // Build data cells with DOM too (safest approach)
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

  // Attach ONE persistent delegated click handler
  if (showEdit) {
    tbody._hsDelHandler = async function hsClickHandler(ev) {
      const btnOne = ev.target.closest('.hs-del-one');
      const btnAll = ev.target.closest('.hs-del-all');
      if (!btnOne && !btnAll) return;
      ev.stopPropagation();

      if (btnOne) {
        const id     = btnOne.dataset.id;
        const player = btnOne.dataset.player;
        if (!id || id === 'undefined') {
          alert('Fehler: Kein Eintrag-ID gefunden. Seite neu laden und nochmal versuchen.');
          return;
        }
        if (!confirm('Eintrag von "' + player + '" löschen?')) return;
        btnOne.disabled = true;
        btnOne.textContent = '⏳';
        try {
          await api('DELETE', '/api/admin/score/' + id);
          await renderHS();
        } catch(e) {
          alert('Fehler beim Löschen: ' + e.message);
          await renderHS();
        }
      } else if (btnAll) {
        const player = btnAll.dataset.player;
        if (!confirm('ALLE Einträge von "' + player + '" löschen?')) return;
        btnAll.disabled = true;
        btnAll.textContent = '⏳';
        try {
          await api('DELETE', '/api/admin/scores/' + encodeURIComponent(player));
          await renderHS();
        } catch(e) {
          alert('Fehler: ' + e.message);
          await renderHS();
        }
      }
    };
    tbody.addEventListener('click', tbody._hsDelHandler);
  }

  // Footer summary
  if (isGlobal) {
    const playerCount  = new Set(entries.map(e=>(e.player||'').toLowerCase())).size;
    const totalKills   = entries.reduce((s,e)=>s+(e.kills||0),0);
    summary.innerHTML  = '<b style="color:#f7c948;">' + entries.length + '</b> Einträge von ' +
      '<b style="color:#7ecff7;">' + playerCount + '</b> Spielern · ' +
      'Kills: <b style="color:#27ae60;">' + totalKills.toLocaleString() + '</b>';
    myRank.innerHTML = myBestRank > 0
      ? 'Deine beste Platzierung: <b style="color:#f7c948;">#' + myBestRank + '</b>'
      : 'Du hast noch keinen Eintrag.';
  } else {
    summary.innerHTML = '<b style="color:#f7c948;">' + entries.length + '</b> Runden · ' +
      'Beste Zeit: <b style="color:#f7c948;">' + entries[0].time + '</b>';
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
  err.style.color = '#27ae60';
  err.textContent = 'Einladung an ' + username + ' gesendet!';
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
  // Update slider to match saved value
  const slider = document.getElementById('canvas-size-slider');
  if (slider) slider.value = canvasScalePct;
  const label = document.getElementById('canvas-size-label');
  if (label) label.textContent = canvasScalePct + '%';
}

// Apply on load
window.addEventListener('load', () => { applyCanvasScale(); }, { once: false });


// ═══════════════════════════════════════════════════════
//  JUMPSCARE SYSTEM
//  Triggered when player tries "Next Level" on Easy mode
// ═══════════════════════════════════════════════════════

let jumpscareActive = false;
let jumpscareTimeout1 = null;
let jumpscareTimeout2 = null;

// Jumpscare faces / characters (pure emoji + styling for effect)
const JS_FACES = ['👹', '💀', '👻', '🎃', '😱', '👁️'];

function triggerJumpscare(onDone) {
  if (jumpscareActive) return;
  jumpscareActive = true;

  // Pause game if running
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

  // Play a scary sound using Web Audio
  playJumpscareSound();

  // Phase 1: face slams in BIG
  setTimeout(() => {
    face.style.fontSize = '25rem';
    face.style.filter   = 'drop-shadow(0 0 40px #ff0000) drop-shadow(0 0 80px #cc0000)';
  }, 50);

  // Phase 2: screen shakes
  let shakeCount = 0;
  const shakeInterval = setInterval(() => {
    const x = (Math.random() - 0.5) * 30;
    const y = (Math.random() - 0.5) * 30;
    ov.style.transform = `translate(${x}px,${y}px)`;
    if (++shakeCount > 15) { clearInterval(shakeInterval); ov.style.transform = ''; }
  }, 50);

  // Phase 3: face fades, glitch text appears
  setTimeout(() => {
    face.style.display = 'none';
    txt.style.display  = 'block';
    txt.innerHTML      = '';
    startGlitchText(txt, 'you think you can outplay me .....', () => {
      // After glitch text – second jumpscare!
      setTimeout(() => {
        txt.style.display   = 'none';
        face.style.display  = 'block';
        face.textContent    = JS_FACES[Math.floor(Math.random() * JS_FACES.length)];
        face.style.fontSize = '0';
        face.style.filter   = 'drop-shadow(0 0 60px #ff0000)';
        playJumpscareSound();
        setTimeout(() => {
          face.style.fontSize = '30rem';
        }, 30);
        setTimeout(() => {
          // End jumpscare
          ov.style.display   = 'none';
          face.style.display = 'none';
          txt.style.display  = 'none';
          face.style.fontSize = '0';
          jumpscareActive    = false;
          if (onDone) onDone();

          // Plant a delayed 3rd jumpscare 45-75 seconds later no matter what
          const delay = 45000 + Math.random() * 30000;
          jumpscareTimeout1 = setTimeout(() => {
            triggerDelayedJumpscare();
          }, delay);
        }, 1800);
      }, 600);
    });
  }, 2200);
}

function triggerDelayedJumpscare() {
  const ov   = document.getElementById('ov-jumpscare');
  const face = document.getElementById('js-face');
  const txt  = document.getElementById('js-text');
  if (!ov) return;

  // Pause game silently
  if (typeof paused !== 'undefined') paused = true;
  if (typeof mouse  !== 'undefined') mouse.down = false;

  ov.style.display   = 'flex';
  face.style.display = 'block';
  txt.style.display  = 'none';
  face.textContent   = JS_FACES[Math.floor(Math.random() * JS_FACES.length)];
  face.style.fontSize = '0';
  face.style.filter  = 'drop-shadow(0 0 60px #ff0000)';

  playJumpscareSound();

  setTimeout(() => { face.style.fontSize = '28rem'; }, 30);

  // Screen shake
  let sc = 0;
  const si = setInterval(() => {
    ov.style.transform = `translate(${(Math.random()-.5)*25}px,${(Math.random()-.5)*25}px)`;
    if (++sc > 12) { clearInterval(si); ov.style.transform = ''; }
  }, 55);

  setTimeout(() => {
    ov.style.display   = 'none';
    face.style.fontSize = '0';
    jumpscareActive    = false;
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
      if (i < revealed) {
        display += message[i];
      } else {
        // Random glitch character
        display += glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
    }
    // Glitch color flicker
    el.style.color = Math.random() < 0.3 ? '#ffffff' : '#ff0000';
    el.style.textShadow = Math.random() < 0.2
      ? `-4px 0 #00ffff, 4px 0 #ff00ff`
      : `3px 3px 0 #440000, -2px -2px 8px #ff4400`;
    // Chromatic aberration glitch
    if (Math.random() < 0.15) {
      el.style.transform = `translate(${(Math.random()-.5)*8}px, ${(Math.random()-.5)*4}px)`;
    } else {
      el.style.transform = '';
    }
    el.textContent = display;
    revealed += 0.5; // slow reveal
    if (revealed >= message.length) {
      clearInterval(revealInterval);
      el.textContent = message;
      el.style.color = '#ff0000';
      el.style.transform = '';
      if (onDone) setTimeout(onDone, 1200);
    }
  }, 60);
}

function playJumpscareSound() {
  try {
    if (typeof ensureAC === 'function') ensureAC();
    if (!AC) return;
    // Low rumble + high screech
    const t = AC.currentTime;
    // Screech (high pitched noise burst)
    const buf = AC.createBuffer(1, AC.sampleRate * 0.8, AC.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.4));
    }
    const src  = AC.createBufferSource();
    const filt = AC.createBiquadFilter();
    const gain = AC.createGain();
    filt.type = 'highpass'; filt.frequency.value = 2000;
    gain.gain.setValueAtTime(1.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    src.buffer = buf;
    src.connect(filt); filt.connect(gain); gain.connect(AC.destination);
    src.start(t); src.stop(t + 0.8);
    // Deep bass hit
    const osc  = AC.createOscillator();
    const og   = AC.createGain();
    osc.type   = 'sawtooth';
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.5);
    og.gain.setValueAtTime(2.0, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(og); og.connect(AC.destination);
    osc.start(t); osc.stop(t + 0.5);
  } catch(e) {}
}



// ═══════════════════════════════════════════════════════
//  DEVICE SELECTION + ADAPTIVE LAYOUT
// ═══════════════════════════════════════════════════════
let currentDevice = null; // never saved – must pick every session

const DEVICE_CONFIGS = {
  pc: {
    canvasW: 820, canvasH: 580,
    defaultScale: 100,
    touch: false,
    cursor: 'none',
    label: 'PC'
  },
  tablet: {
    canvasW: 820, canvasH: 580,
    defaultScale: 85,
    touch: true,
    cursor: 'default',
    label: 'Tablet'
  },
  mobile: {
    canvasW: 820, canvasH: 580,
    defaultScale: 60,
    touch: true,
    cursor: 'default',
    label: 'Handy'
  }
};

function selectDevice(device) {
  currentDevice = device;
  // not saved – intentional (must choose each session)
  applyDeviceConfig(device);
  // Hide picker, show auth
  document.getElementById('ov-device').style.display = 'none';
  document.getElementById('ov-auth').classList.remove('h');
}

function applyDeviceConfig(device) {
  const cfg = DEVICE_CONFIGS[device] || DEVICE_CONFIGS.pc;

  // Set body cursor
  document.body.style.cursor = cfg.cursor;

  // Apply canvas scale (use saved scale or device default)
  const saved = localStorage.getItem('zw_canvas_scale');
  const scale = saved ? parseInt(saved) : cfg.defaultScale;
  canvasScalePct = scale;
  applyCanvasScale();

  // Update slider
  const slider = document.getElementById('canvas-size-slider');
  if (slider) slider.value = scale;
  const lbl = document.getElementById('canvas-size-label');
  if (lbl) lbl.textContent = scale + '%';

  // Show/hide touch UI
  const touchUI = document.getElementById('touch-ui');
  if (touchUI) touchUI.style.display = cfg.touch ? 'block' : 'none';

  // Show/hide device indicator in settings
  const di = document.getElementById('current-device-label');
  if (di) di.textContent = cfg.label;
}

// On page load: if device already chosen, skip picker
window.addEventListener('load', () => {
  // Always show device picker first – user must choose each session
  document.getElementById('ov-auth').classList.add('h');
  // (device picker already visible by default)
});

// ── Admin panel position fix: always top-right of viewport ──
function positionAdminPanels() {
  const wrap = document.getElementById('wrap');
  if (!wrap) return;
  const r = wrap.getBoundingClientRect();
  const scale = canvasScalePct / 100;

  const adminBtn = document.getElementById('admin-btn');
  const adminPanel = document.getElementById('admin-panel');
  const grantedBtn = document.getElementById('granted-admin-btn');
  const grantedPanel = document.getElementById('granted-admin-panel');

  // Position admin-btn top-right of the scaled wrap
  const right = window.innerWidth - r.right;
  const top   = r.top;

  if (adminBtn) {
    adminBtn.style.right = Math.max(8, right + 8) + 'px';
    adminBtn.style.top   = (top + 8) + 'px';
  }
  if (adminPanel) {
    adminPanel.style.right = Math.max(8, right + 8) + 'px';
    adminPanel.style.top   = (top + 46) + 'px';
  }
  if (grantedBtn) {
    grantedBtn.style.right = Math.max(96, right + 96) + 'px';
    grantedBtn.style.top   = (top + 8) + 'px';
  }
  if (grantedPanel) {
    grantedPanel.style.right = Math.max(96, right + 96) + 'px';
    grantedPanel.style.top   = (top + 46) + 'px';
  }
}

// Call on scale change and window resize
const _origApplyScale = applyCanvasScale;
function applyCanvasScale() {
  _origApplyScale();
  setTimeout(positionAdminPanels, 50);
}
window.addEventListener('resize', positionAdminPanels);


// ═══════════════════════════════════════════════════════
//  TOUCH CONTROLS
// ═══════════════════════════════════════════════════════
let joystickActive = false, joystickId = null;
let joystickOriginX = 0, joystickOriginY = 0;
let touchMoveX = 0, touchMoveY = 0;
let touchShooting = false;

function initTouchControls() {
  const zone = document.getElementById('joystick-zone');
  if (!zone || zone._touchInited) return;
  zone._touchInited = true;

  zone.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    joystickActive = true; joystickId = t.identifier;
    const r = zone.getBoundingClientRect();
    joystickOriginX = r.left + r.width  / 2;
    joystickOriginY = r.top  + r.height / 2;
    moveJoystick(t.clientX, t.clientY);
  }, { passive: false });

  zone.addEventListener('touchmove', e => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickId)
        moveJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
    }
  }, { passive: false });

  zone.addEventListener('touchend', e => {
    e.preventDefault();
    joystickActive = false; joystickId = null;
    touchMoveX = 0; touchMoveY = 0;
    const knob = document.getElementById('joystick-knob');
    if (knob) knob.style.transform = 'translate(-50%,-50%)';
  }, { passive: false });

  // Canvas touch for aiming
  const cv = document.getElementById('c');
  if (cv) {
    cv.addEventListener('touchmove', e => {
      e.preventDefault();
      if (!window.gameRunning) return;
      const r = cv.getBoundingClientRect();
      const scale = (window.canvasScalePct || 100) / 100;
      // Rightmost touch = aim
      let rt = e.touches[0];
      for (let i = 1; i < e.touches.length; i++) {
        if (e.touches[i].clientX > rt.clientX) rt = e.touches[i];
      }
      if (window.mouse) {
        window.mouse.x = (rt.clientX - r.left) / scale;
        window.mouse.y = (rt.clientY - r.top)  / scale;
      }
    }, { passive: false });
  }
}

function moveJoystick(cx, cy) {
  const dx = cx - joystickOriginX, dy = cy - joystickOriginY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxR = 38;
  const clamp = Math.min(dist, maxR);
  touchMoveX = dist > 5 ? dx / dist : 0;
  touchMoveY = dist > 5 ? dy / dist : 0;
  const knob = document.getElementById('joystick-knob');
  if (knob) {
    const kx = dist > 0 ? (dx / dist) * clamp : 0;
    const ky = dist > 0 ? (dy / dist) * clamp : 0;
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

// Hook touch movement into update() via global variables read by game.js
Object.defineProperty(window, '_touchMoveX', { get: () => touchMoveX });
Object.defineProperty(window, '_touchMoveY', { get: () => touchMoveY });

function changeDevice() {
  // Show the device picker again
  currentDevice = null;
  document.getElementById('ov-device').style.display = 'flex';
  hideAll();
}
