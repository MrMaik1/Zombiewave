// ARENA & KOLLISIONS-SYSTEM
const WORLD_RADIUS=1800;
let arenaActive=false,arenaX=400,arenaY=300,arenaRadius=420,arenaWallAlpha=0;

function activateArena(bossX,bossY){
  arenaActive=true;
  arenaX=(G.px+bossX)/2; arenaY=(G.py+bossY)/2;
  arenaRadius=420; arenaWallAlpha=0;
  spawnFT(G.px,G.py-60,'⚠ BOSS-ARENA AKTIV!','#c0392b');
  spawnFT(G.px,G.py-80,'Du kannst nicht fliehen!','#e74c3c');
  triggerFlash('#ff0000',.15,20);
}

function deactivateArena(){
  arenaActive=false; arenaWallAlpha=0;
  spawnFT(G.px,G.py-60,'🏆 ARENA FREI!','#27ae60');
}

function applyWorldBounds(){
  if(!G)return;
  if(arenaActive){
    const dx=G.px-arenaX,dy=G.py-arenaY;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist>arenaRadius-18){
      const nx=dx/dist,ny=dy/dist;
      G.px=arenaX+nx*(arenaRadius-18);
      G.py=arenaY+ny*(arenaRadius-18);
    }
  } else {
    const dx=G.px-400,dy=G.py-300;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist>WORLD_RADIUS-40){
      const nx=dx/dist,ny=dy/dist;
      G.px-=nx*4; G.py-=ny*4;
      if(dist>WORLD_RADIUS){G.px=400+nx*(WORLD_RADIUS-20);G.py=300+ny*(WORLD_RADIUS-20);}
    }
  }
  applyMapCollisions();
}

function applyMapCollisions(){
  if(!G)return;
  const TILE=64,PR=10;
  const c0=Math.floor((G.px-200)/TILE)-1,r0=Math.floor((G.py-200)/TILE)-1;
  for(let r=r0;r<=r0+7;r++){
    for(let c=c0;c<=c0+7;c++){
      const type=tileAt(c,r);
      if(type!==5&&type!==4)continue;
      const seed=((c*31+r*17)>>>0)%8;
      const wx=c*TILE,wy=r*TILE;
      let obj=null;
      if(type===5) obj={x:wx+4,y:wy+14,w:TILE-8,h:30};
      else if(type===4&&seed<3) obj={x:wx+4,y:wy+8,w:22,h:22};
      if(!obj)continue;
      const cx2=Math.max(obj.x,Math.min(G.px,obj.x+obj.w));
      const cy2=Math.max(obj.y,Math.min(G.py,obj.y+obj.h));
      const dx=G.px-cx2,dy=G.py-cy2;
      const dSq=dx*dx+dy*dy;
      if(dSq<PR*PR){const d=Math.sqrt(dSq)||1;G.px+=(dx/d)*(PR-d);G.py+=(dy/d)*(PR-d);}
    }
  }
}

function drawArena(cx,cy){
  if(!arenaActive&&arenaWallAlpha<=0)return;
  if(arenaActive&&arenaWallAlpha<.85)arenaWallAlpha=Math.min(.85,arenaWallAlpha+.02);
  if(!arenaActive&&arenaWallAlpha>0)arenaWallAlpha=Math.max(0,arenaWallAlpha-.03);
  const sx=arenaX+cx,sy=arenaY+cy;
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,'+(arenaWallAlpha*.55)+')';
  ctx.beginPath();ctx.rect(-100,-100,W+200,H+200);
  ctx.arc(sx,sy,arenaRadius,0,Math.PI*2,true);ctx.fill('evenodd');
  const pulse=.6+.3*Math.sin(globalTick*.08);
  ctx.strokeStyle='rgba(192,57,43,'+(arenaWallAlpha*pulse)+')';
  ctx.lineWidth=6;ctx.setLineDash([20,10]);
  ctx.beginPath();ctx.arc(sx,sy,arenaRadius,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(231,76,60,'+(arenaWallAlpha*.4)+')';
  ctx.lineWidth=18;ctx.setLineDash([]);
  ctx.beginPath();ctx.arc(sx,sy,arenaRadius,0,Math.PI*2);ctx.stroke();
  const pDist=Math.sqrt((G.px-arenaX)**2+(G.py-arenaY)**2);
  if(pDist>arenaRadius-80){
    const ang=Math.atan2(G.py-arenaY,G.px-arenaX);
    const ax=sx-Math.cos(ang)*(arenaRadius-30),ay=sy-Math.sin(ang)*(arenaRadius-30);
    ctx.save();ctx.translate(ax,ay);ctx.rotate(ang+Math.PI);
    ctx.fillStyle='rgba(231,76,60,'+(0.7+.3*Math.sin(globalTick*.2))+')';
    ctx.beginPath();ctx.moveTo(-12,-8);ctx.lineTo(12,0);ctx.lineTo(-12,8);ctx.closePath();ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawMapObjects(cx,cy){
  const TILE=64;
  const lvl=LEVELS.find(l=>l.id===selectedLevel)||LEVELS[0];
  const c0=Math.floor(G.camX/TILE)-1,r0=Math.floor(G.camY/TILE)-1;
  const c1=c0+Math.ceil(W/TILE)+2,r1=r0+Math.ceil(H/TILE)+2;
  for(let r=r0;r<=r1;r++){
    for(let c=c0;c<=c1;c++){
      if(tileAt(c,r)!==5)continue;
      const seed=((c*31+r*17)>>>0)%8;
      drawCarWreck(c*TILE+cx,r*TILE+cy,seed,lvl.mapTheme);
    }
  }
}

function drawCarWreck(sx,sy,seed,theme){
  const TILE=64;
  const palettes={city:['#3a1a1a','#1a2a4a','#1a3a1a'],industrial:['#2a2010','#3a2010','#2a1010'],hospital:['#d8d8d8','#c0c0c0','#a8a8b8'],military:['#2a3a1a','#3a4a1a','#1a2a10'],downtown:['#1a0a2a','#2a0a3a','#0a0a2a']};
  const cols=(palettes[theme]||palettes.city);
  ctx.save();ctx.translate(sx+TILE/2,sy+TILE/2);ctx.rotate((seed-3)*.08);
  // Karosserie
  ctx.fillStyle=cols[seed%3];ctx.beginPath();ctx.roundRect(-26,-14,52,28,4);ctx.fill();
  // Dach
  ctx.fillStyle='#111';ctx.beginPath();ctx.roundRect(-16,-22,32,12,3);ctx.fill();
  // Fenster
  ctx.fillStyle='rgba(10,10,20,.7)';ctx.fillRect(-13,-20,12,8);ctx.fillRect(2,-20,12,8);
  ctx.strokeStyle='rgba(200,220,255,.15)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(-10,-20);ctx.lineTo(-5,-13);ctx.lineTo(-13,-14);ctx.stroke();
  // Räder
  [[-22,-12],[22,-12],[-22,12],[22,12]].forEach(function(pos){
    ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.ellipse(pos[0],pos[1],7,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#333';ctx.beginPath();ctx.arc(pos[0],pos[1],3,0,Math.PI*2);ctx.fill();
  });
  // Brandfleck
  ctx.fillStyle='rgba(255,80,0,.18)';ctx.beginPath();ctx.ellipse(0,0,20,10,0,0,Math.PI*2);ctx.fill();
  // Schatten
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,16,24,6,0,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawWorldBounds(cx,cy){
  if(arenaActive)return;
  const sx=400+cx,sy=300+cy;
  const pDist=Math.sqrt((G.px-400)**2+(G.py-300)**2);
  const fadeStart=WORLD_RADIUS-300;
  if(pDist<fadeStart)return;
  const alpha=Math.min(.7,(pDist-fadeStart)/300);
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,'+(alpha*.6)+')';
  ctx.beginPath();ctx.rect(-100,-100,W+200,H+200);
  ctx.arc(sx,sy,WORLD_RADIUS,0,Math.PI*2,true);ctx.fill('evenodd');
  if(pDist>WORLD_RADIUS-150){
    const wa=Math.min(.8,(pDist-(WORLD_RADIUS-150))/150);
    ctx.strokeStyle='rgba(241,196,15,'+(wa*(.5+.4*Math.sin(globalTick*.15)))+')';
    ctx.lineWidth=4;ctx.setLineDash([15,8]);
    ctx.beginPath();ctx.arc(sx,sy,WORLD_RADIUS,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  }
  ctx.restore();
}
