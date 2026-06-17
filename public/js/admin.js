// ADMIN SERVER COMMANDS
function sendAdminCmd() {
  const input = document.getElementById('admin-cmd-input');
  const raw = input.value.trim(); if (!raw || !socket) return;
  const parts = raw.replace(/^\//, '').split(' '); const cmd = parts[0].toLowerCase(); const target = parts.slice(1).join(' ');
  if (!target && cmd !== 'help') { showAdminResult('Format: /join {name}  oder  /check {name}'); return; }
  if (cmd === 'help') { showAdminResult('/join {name}\n/check {name}\n/edit {name} {feld} {wert}\n/delete {name}\n/admin {name} [revoke]\n/ban {name}  |  /unban {name}\n/reset-all'); return; }
  socket.emit('admin:command', { cmd, target }); input.value = '';
}
function showAdminResult(text) { const el = document.getElementById('admin-cmd-result'); if (!el) return; el.style.display='block'; el.textContent=text; }
function wireAdminSocket() {
  if (!socket) return;
  socket.off('admin:result'); socket.off('admin:error'); socket.off('admin:profileUpdated');
  socket.on('admin:result', ({ cmd, success, error, data, msg, code, party }) => {
    if (error) { showAdminResult('❌ ' + error); return; }
    if (cmd === 'join') { showAdminResult('✓ Party ' + code + ' beigetreten!'); if (party) { currentParty = party; showLobby(code, party); menuTab('mp'); } }
    else if (cmd === 'check' && data) {
      if (socket._adminPatchPerma && socket._adminPatchPerma.target === data.username) { const patch=socket._adminPatchPerma; socket._adminPatchPerma=null; const newPerma={...(data.perma||{}),[patch.field]:patch.val}; socket.emit('admin:command',{cmd:'edit',target:data.username+' perma '+JSON.stringify(newPerma)}); setTimeout(()=>recheckAdminView(),500); return; }
      if (window._pendingDelete?.type==='weapon') { const wpnId=window._pendingDelete.id; window._pendingDelete=null; const newWpns=(data.weapons||[]).filter(w=>w!==wpnId); if(!newWpns.includes('pistol'))newWpns.unshift('pistol'); socket.emit('admin:command',{cmd:'edit',target:data.username+' weapons '+newWpns.join(',')}); setTimeout(()=>recheckAdminView(),500); return; }
      openAdminView(data); showAdminResult('✓ ' + data.username + ' wird angezeigt');
    }
    else if (cmd === 'edit') { showAdminResult('✓ ' + msg); }
  });
  socket.on('admin:error', (msg) => showAdminResult('❌ ' + msg));
  socket.on('admin:granted', () => { document.getElementById('granted-admin-btn').style.display='block'; alert('Du hast Admin-Rechte erhalten!'); });
  socket.on('admin:revoked', () => { document.getElementById('granted-admin-btn').style.display='none'; document.getElementById('granted-admin-panel').style.display='none'; });
  socket.on('banned', ({ reason }) => { gameRunning=false; stopMusic(); if(animId)cancelAnimationFrame(animId); authToken=''; localStorage.removeItem('zw_token'); currentUser=null; hideAll(); document.getElementById('l-err').textContent='🚫 ' + (reason||'Gesperrt.'); show('ov-auth'); });
  socket.on('game:adminWave', ({ count }) => { if(G) spawnFT(G.px||400,(G.py||300)-50,'+'+count+' ZOMBIES!','#e74c3c'); });
  socket.on('admin:profileUpdated', () => { api('GET','/api/me').then(u=>{currentUser=u;}).catch(()=>{}); });
}
let adminViewTarget = null;
function openAdminView(data) {
  adminViewTarget = data.username;
  const WEAPON_NAMES = {pistol:'Pistole',rifle:'Sturmgewehr',shotgun:'Schrotflinte',kunai:'Kunai',sniper:'Sniper',rpg:'RPG',molotov:'Molotov',minigun:'Minigun',crossbow:'Armbrust',flamethrower:'Flammenwerfer',grenade:'Granatwerfer'};
  document.getElementById('admin-view-name').textContent = data.username;
  const wEl = document.getElementById('admin-view-weapons'); wEl.innerHTML = '';
  (data.weapons || []).forEach(w => { const row=document.createElement('div'); row.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:2px 0;border-bottom:1px solid #1a2535;'; row.innerHTML=`<span>${WEAPON_NAMES[w]||w}</span>${w!=='pistol'?`<button onclick="adminDeleteWeapon('${w}')" style="background:#3a0808;border:none;border-radius:4px;color:#ff6666;font-size:.65rem;padding:1px 6px;cursor:pointer;">✕</button>`:'<span style="color:#555;font-size:.65rem;">Standard</span>'}`; wEl.appendChild(row); });
  if(!data.weapons?.length) wEl.innerHTML='<span style="color:#555;">Keine Waffen</span>';
  const uEl = document.getElementById('admin-view-upgrades'); const PERMA_LABELS={hp:'Max-HP',speed:'Speed',dmg:'Schaden',reload:'Nachladen',mag:'Magazin'}; uEl.innerHTML='';
  const perma = data.perma||{};
  Object.entries(PERMA_LABELS).forEach(([k,label])=>{ const lvl=perma[k]||0; if(lvl===0)return; const row=document.createElement('div'); row.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:2px 0;border-bottom:1px solid #1a2535;'; row.innerHTML=`<span>${label}: Lv${lvl}</span><button onclick="adminDeletePerma('${k}')" style="background:#3a0808;border:none;border-radius:4px;color:#ff6666;font-size:.65rem;padding:1px 6px;cursor:pointer;">✕</button>`; uEl.appendChild(row); });
  if(!uEl.innerHTML) uEl.innerHTML='<span style="color:#555;">Keine Upgrades</span>';
  document.getElementById('admin-view-misc').innerHTML=`🪙 Münzen: <b style="color:#f7c948;">${data.coins}</b>`;
  const btn=document.getElementById('mt-admin-view'); if(btn) btn.style.display='inline-block'; menuTab('admin-view');
}
function closeAdminView() { adminViewTarget=null; document.getElementById('mt-admin-view').style.display='none'; menuTab('play'); }
async function adminSetField(field, value) { if(!adminViewTarget)return; setAdminViewMsg('⏳ Wird gespeichert...'); if(socket) socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' '+field+' '+JSON.stringify(value)}); setTimeout(()=>recheckAdminView(),800); }
async function adminDeleteWeapon(wpnId) { if(!adminViewTarget)return; setAdminViewMsg('⏳...'); if(socket) socket.emit('admin:command',{cmd:'check',target:adminViewTarget}); window._pendingDelete={type:'weapon',id:wpnId}; }
async function adminDeleteWeapons() { if(!adminViewTarget||!confirm('Alle Waffen von '+adminViewTarget+' löschen?'))return; if(socket) socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' weapons pistol'}); setAdminViewMsg('✓ Waffen gelöscht'); setTimeout(()=>recheckAdminView(),600); }
async function adminDeleteUpgrades() { if(!adminViewTarget||!confirm('Alle Upgrades von '+adminViewTarget+' löschen?'))return; if(socket){socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' perma {"hp":0,"speed":0,"dmg":0,"reload":0,"mag":0}'});socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' kunaiCountLvl 0'});socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' kunaiSpeedLvl 0'});socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' guardianShopLvl 0'});} setAdminViewMsg('✓ Alle Upgrades gelöscht'); setTimeout(()=>recheckAdminView(),800); }
async function adminDeletePerma(field){if(!adminViewTarget)return;adminSetPermaField(field,0);}
async function adminSetPermaField(field,val){if(!adminViewTarget||!socket)return;socket._adminPatchPerma={field,val,target:adminViewTarget};socket.emit('admin:command',{cmd:'check',target:adminViewTarget});}
async function adminResetPlayer(){if(!adminViewTarget||!confirm('Komplett zurücksetzen?'))return;if(socket){socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' weapons pistol'});socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' coins 0'});socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' perma {"hp":0,"speed":0,"dmg":0,"reload":0,"mag":0}'});socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' kunaiCountLvl 0'});socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' kunaiSpeedLvl 0'});socket.emit('admin:command',{cmd:'edit',target:adminViewTarget+' guardianShopLvl 0'});}setAdminViewMsg('✓ '+adminViewTarget+' komplett zurückgesetzt!');setTimeout(()=>recheckAdminView(),1000);}
async function adminResetAll(){if(!confirm('ACHTUNG: Alle Spieler zurücksetzen?'))return;if(!confirm('Wirklich sicher?'))return;try{await api('POST','/api/admin/reset-all');setAdminViewMsg('✓ Alle Spieler zurückgesetzt!');}catch(e){setAdminViewMsg('❌ '+e.message);}}
function recheckAdminView(){if(!adminViewTarget||!socket)return;socket.emit('admin:command',{cmd:'check',target:adminViewTarget});}
function setAdminViewMsg(msg){const el=document.getElementById('admin-view-err');if(el){el.textContent=msg;setTimeout(()=>{if(el)el.textContent='';},4000);}}
function isAdminUser(){return currentUser&&currentUser.username.toLowerCase()==='mrmaik';}
function toggleAdminPanel(){const p=document.getElementById('admin-panel');if(p.style.display==='none'){p.style.display='block';wireAdminSocket();const ingame=document.getElementById('owner-ingame-btns');if(ingame)ingame.style.display=gameRunning?'block':'none';}else{p.style.display='none';}}
function toggleGrantedAdminPanel(){const p=document.getElementById('granted-admin-panel');p.style.display=p.style.display==='none'?'block':'none';}
function grantedAdminCmd(cmd){if(!socket||!gameRunning)return;if(cmd==='spawn_boss')socket.emit('admin:spawnBoss');if(cmd==='spawn_wave')socket.emit('admin:spawnWave');const res=document.getElementById('granted-admin-result');if(res){res.textContent='Gesendet!';setTimeout(()=>res.textContent='',2000);}}
function adminCmd(cmd){if(!isAdminUser()||!G)return;if(cmd==='inf_hp'){G.playerHp=999999;G.playerMaxHp=999999;G.godMode=true;spawnFT(G.px,G.py-40,'∞ HP!','#e74c3c');}if(cmd==='inf_coins'){if(currentUser)currentUser.coins=999999;saveUserServer({coins:999999});spawnFT(G.px,G.py-40,'∞ 🪙!','#f7c948');}if(cmd==='minigun_nocool'){G.adminMingunNoCool=true;spawnFT(G.px,G.py-40,'Minigun!','#ff4444');}if(cmd==='spawn_boss'&&!G.bossActive)spawnBoss();if(cmd==='spawn_wave')spawnWave();if(cmd==='god_mode'){G.godMode=!G.godMode;spawnFT(G.px,G.py-40,'God: '+(G.godMode?'AN':'AUS'),'#e74c3c');}}
