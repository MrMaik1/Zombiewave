// WEAPON SKINS – Gems-basiert
const WEAPON_SKINS={
  pistol:[
    {id:'pistol_default',name:'Standard',gems:0,colors:{body:'#2c2c2c',barrel:'#1a1a1a',accent:'#555'},desc:'Klassisch.'},
    {id:'pistol_gold',name:'Vergoldet',gems:120,colors:{body:'#b8860b',barrel:'#8b6914',accent:'#ffd700'},desc:'Für echte Profis.'},
    {id:'pistol_blood',name:'Blutrot',gems:80,colors:{body:'#8b0000',barrel:'#5a0000',accent:'#cc2200'},desc:'Getauft im Blut.'},
    {id:'pistol_ice',name:'Eis-Kanone',gems:100,colors:{body:'#1a4a6a',barrel:'#0a2a4a',accent:'#88ccff'},desc:'Kalt wie der Tod.'},
    {id:'pistol_neon',name:'Neon-Pink',gems:90,colors:{body:'#4a0040',barrel:'#2a0020',accent:'#ff00cc'},desc:'Leuchtet im Dunkeln.'},
    {id:'pistol_obsidian',name:'Obsidian',gems:150,colors:{body:'#0a0a1a',barrel:'#050510',accent:'#3a3a6a'},desc:'Schwärzer als die Nacht.'},
  ],
  rifle:[
    {id:'rifle_default',name:'Standard',gems:0,colors:{body:'#2c2c2c',stock:'#5a3a1a',accent:'#3a3a3a'},desc:'Zuverlässig.'},
    {id:'rifle_desert',name:'Wüstensturm',gems:100,colors:{body:'#c8a060',stock:'#8b6914',accent:'#e8c070'},desc:'Erprobt in der Hitze.'},
    {id:'rifle_arctic',name:'Arktis',gems:110,colors:{body:'#d0e8f0',stock:'#a0c0d0',accent:'#e8f8ff'},desc:'Kalt wie Eis.'},
    {id:'rifle_inferno',name:'Höllenfeuer',gems:130,colors:{body:'#3a0a00',stock:'#5a1a00',accent:'#ff4400'},desc:'Aus der Hölle.'},
    {id:'rifle_royal',name:'Königlich',gems:160,colors:{body:'#1a0040',stock:'#2a0060',accent:'#9b59b6'},desc:'Für Könige.'},
  ],
  shotgun:[
    {id:'shotgun_default',name:'Standard',gems:0,colors:{body:'#5a3010',barrel:'#2c2c2c',accent:'#3a2010'},desc:'Doppelt hält besser.'},
    {id:'shotgun_rusty',name:'Verrostet',gems:60,colors:{body:'#7a3010',barrel:'#5a2010',accent:'#c06020'},desc:'Alt, aber tödlich.'},
    {id:'shotgun_chrome',name:'Chrom',gems:130,colors:{body:'#c0c0c0',barrel:'#a0a0a0',accent:'#e8e8e8'},desc:'Spiegelglatt.'},
    {id:'shotgun_jade',name:'Jade',gems:120,colors:{body:'#0a3a20',barrel:'#052010',accent:'#2ecc71'},desc:'Selten und wertvoll.'},
  ],
  sniper:[
    {id:'sniper_default',name:'Standard',gems:0,colors:{body:'#2c3a2c',scope:'rgba(150,220,255,.6)',accent:'#3a4a3a'},desc:'Präzision über alles.'},
    {id:'sniper_midnight',name:'Mitternacht',gems:150,colors:{body:'#0a0a1a',scope:'rgba(100,100,255,.8)',accent:'#1a1a3a'},desc:'Im Schatten der Nacht.'},
    {id:'sniper_void',name:'Der Abgrund',gems:200,colors:{body:'#050505',scope:'rgba(180,0,255,.9)',accent:'#2a0040'},desc:'Aus dem Nichts.'},
    {id:'sniper_snow',name:'Schneeleopard',gems:130,colors:{body:'#e0e8e0',scope:'rgba(200,240,255,.6)',accent:'#a0b0a0'},desc:'Weiß und letal.'},
  ],
  minigun:[
    {id:'minigun_default',name:'Standard',gems:0,colors:{body:'#444',barrel:'#333',accent:'#555'},desc:'Dauerfeuer.'},
    {id:'minigun_hellfire',name:'Höllenfeuer',gems:200,colors:{body:'#2a0000',barrel:'#1a0000',accent:'#ff2200'},desc:'Die Hölle rotiert.'},
    {id:'minigun_robot',name:'Roboter',gems:180,colors:{body:'#3a4a5a',barrel:'#2a3a4a',accent:'#7ecff7'},desc:'Cyberpunk.'},
    {id:'minigun_golden',name:'Goldene Göttin',gems:300,colors:{body:'#b8860b',barrel:'#8b6914',accent:'#ffd700'},desc:'Das teuerste Spielzeug.'},
  ],
  rpg:[
    {id:'rpg_default',name:'Standard',gems:0,colors:{body:'#4a5a3a',head:'#c0392b',accent:'#5a6a4a'},desc:'Boom.'},
    {id:'rpg_nuclear',name:'Nuklear',gems:160,colors:{body:'#1a3a1a',head:'#80ff00',accent:'#2a4a2a'},desc:'Radioaktiv.'},
    {id:'rpg_candy',name:'Candy',gems:120,colors:{body:'#ff69b4',head:'#ff1493',accent:'#ffb6c1'},desc:'Süß. Aber tödlich.'},
  ],
  molotov:[
    {id:'molotov_default',name:'Standard',gems:0,colors:{bottle:'#2e6b2e',liquid:'#ff8800',flame:'#ff4400'},desc:'Klassiker.'},
    {id:'molotov_blue',name:'Blaue Flamme',gems:80,colors:{bottle:'#1a2a6a',liquid:'#4488ff',flame:'#0044ff'},desc:'Kalt und brennend.'},
    {id:'molotov_purple',name:'Hexengebräu',gems:100,colors:{bottle:'#2a0a4a',liquid:'#aa00ff',flame:'#8800cc'},desc:'Aus dem Kessel.'},
  ],
  kunai:[
    {id:'kunai_default',name:'Standard',gems:0,colors:{blade:'#aaa',handle:'#2c2c2c',accent:'#c0392b'},desc:'Schnell und leise.'},
    {id:'kunai_shadow',name:'Schatten',gems:90,colors:{blade:'#1a1a1a',handle:'#0a0a0a',accent:'#2c3e50'},desc:'Unsichtbar.'},
    {id:'kunai_sakura',name:'Sakura',gems:110,colors:{blade:'#ffaabb',handle:'#ff6688',accent:'#ff4466'},desc:'Schön und tödlich.'},
    {id:'kunai_electric',name:'Elektrisch',gems:120,colors:{blade:'#ffff00',handle:'#aa8800',accent:'#ffcc00'},desc:'Blitzschnell.'},
  ],
  crossbow:[
    {id:'crossbow_default',name:'Standard',gems:0,colors:{stock:'#5a3a1a',bow:'#4a6a4a',string:'#c8a060'},desc:'Lautlos.'},
    {id:'crossbow_bone',name:'Knochen',gems:100,colors:{stock:'#d4c8a0',bow:'#c8b880',string:'#e8d8b0'},desc:'Aus Zombie-Knochen.'},
    {id:'crossbow_steel',name:'Stahl',gems:120,colors:{stock:'#5a6a7a',bow:'#3a4a5a',string:'#aabbcc'},desc:'Kalt. Hart. Tödlich.'},
  ],
  flamethrower:[
    {id:'flame_default',name:'Standard',gems:0,colors:{tank:'#666',barrel:'#444',flame:'#ff6600'},desc:'Alles brennt.'},
    {id:'flame_ice',name:'Eisstrahl',gems:150,colors:{tank:'#1a3a6a',barrel:'#0a2a5a',flame:'#88ccff'},desc:'Gefriert statt brennt.'},
    {id:'flame_dark',name:'Höllenfeuer',gems:180,colors:{tank:'#1a0000',barrel:'#0a0000',flame:'#ff0000'},desc:'Direkt aus der Hölle.'},
  ],
  grenade:[
    {id:'grenade_default',name:'Standard',gems:0,colors:{body:'#3a5a2a',drum:'#2a2a2a',barrel:'#2a3a1a'},desc:'Boom.'},
    {id:'grenade_gold',name:'Goldene Henne',gems:200,colors:{body:'#b8860b',drum:'#8b6914',barrel:'#ffd700'},desc:'Explodierend golden.'},
    {id:'grenade_punk',name:'Punk',gems:130,colors:{body:'#2a0020',drum:'#1a0010',barrel:'#aa0040'},desc:'Anarchie.'},
  ],
};

function getActiveSkin(wpnId){return currentUser?.activeSkins?.[wpnId]||wpnId+'_default';}
function getSkinColors(wpnId){const sid=getActiveSkin(wpnId);const sk=(WEAPON_SKINS[wpnId]||[]).find(s=>s.id===sid);return sk?sk.colors:{};}
function isSkinOwned(sid){return !!(currentUser?.ownedSkins?.[sid])||(sid.endsWith('_default'));}

async function buySkin(wpnId,sid){
  const sk=(WEAPON_SKINS[wpnId]||[]).find(s=>s.id===sid);if(!sk||isSkinOwned(sid))return;
  const qd=getQuestData?getQuestData():{gems:0};
  if((qd.gems||0)<sk.gems)return;
  qd.gems-=sk.gems;if(currentUser.questData)currentUser.questData.gems=qd.gems;currentUser.gems=qd.gems;
  if(!currentUser.ownedSkins)currentUser.ownedSkins={};
  currentUser.ownedSkins[sid]=true;
  await saveUserServer({questData:currentUser.questData,ownedSkins:currentUser.ownedSkins});
  renderSkinsShop(wpnId);
}

async function activateSkin(wpnId,sid){
  if(!isSkinOwned(sid))return;
  if(!currentUser.activeSkins)currentUser.activeSkins={};
  currentUser.activeSkins[wpnId]=sid;
  await saveUserServer({activeSkins:currentUser.activeSkins});
  renderSkinsShop(wpnId);
}

let _activeSkinsWeapon='pistol';
function renderSkinsShop(wpnId){
  wpnId=wpnId||_activeSkinsWeapon;_activeSkinsWeapon=wpnId;
  const el=document.getElementById('shop-skins-content');if(!el)return;
  const gems=(getQuestData?getQuestData():currentUser?.questData||{}).gems||0;
  const skins=WEAPON_SKINS[wpnId]||[];
  const WN={pistol:'Pistole',rifle:'Gewehr',shotgun:'Schrotflinte',sniper:'Sniper',minigun:'Minigun',rpg:'RPG',molotov:'Molotov',kunai:'Kunai',crossbow:'Armbrust',flamethrower:'Flammenwerfer',grenade:'Granatwerfer'};
  const tabs=Object.keys(WEAPON_SKINS).map(w=>`<button onclick="renderSkinsShop('${w}')" style="padding:3px 8px;border-radius:6px;border:1.5px solid ${w===wpnId?'#a855f7':'#2a3a50'};background:${w===wpnId?'#2a1a40':'transparent'};color:${w===wpnId?'#a855f7':'#5a7a90'};font-size:.68rem;cursor:pointer;">${WN[w]||w}</button>`).join('');
  const cards=skins.map(sk=>{
    const owned=isSkinOwned(sk.id);const active=getActiveSkin(wpnId)===sk.id;const canBuy=!owned&&gems>=sk.gems;
    const dots=Object.values(sk.colors).slice(0,3).map(c=>`<div style="width:10px;height:10px;border-radius:50%;background:${c};display:inline-block;margin:0 1px;border:1px solid rgba(255,255,255,.2);"></div>`).join('');
    return `<div style="background:${active?'#1a0a2a':'#0d1825'};border:1.5px solid ${active?'#a855f7':owned?'#27ae60':'#2a3a50'};border-radius:10px;padding:.6rem;text-align:center;cursor:pointer;"
      onclick="${owned?`activateSkin('${wpnId}','${sk.id}')`:canBuy?`buySkin('${wpnId}','${sk.id}')`:''}" >
      <div style="font-family:Bangers,cursive;font-size:.82rem;color:${active?'#a855f7':owned?'#27ae60':'#f0f0f0'};">${active?'✓ ':''}${sk.name}</div>
      <div style="margin:4px 0;">${dots}</div>
      <div style="font-size:.62rem;color:#5a7a90;margin-bottom:3px;">${sk.desc}</div>
      <div style="font-size:.78rem;font-family:Bangers,cursive;color:${active?'#a855f7':owned?'#27ae60':gems<sk.gems?'#555':'#a855f7'};">${active?'Aktiv':owned?'Ausgewählt':sk.gems===0?'Gratis':sk.gems+' 💎'}</div>
    </div>`;
  }).join('');
  el.innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:.5rem;"><div style="font-family:Bangers,cursive;font-size:1rem;color:#a855f7;">💎 ${gems} Gems</div></div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:.7rem;">${tabs}</div><div style="font-family:Bangers,cursive;color:#f0f0f0;margin-bottom:.5rem;">${WN[wpnId]} — Skins</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:7px;">${cards}</div>`;
}
