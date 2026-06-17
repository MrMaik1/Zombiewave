// DRAW + MAP
const TILE=64;
function tileAt(col,row){const h=(col*2654435761^row*1234567891)>>>0,v=h%100;if(col%6===0&&row%5===0)return 1;if(col%6===1&&row%5===0)return 2;if(col%6===0&&row%5===1)return 3;if(v<5)return 4;if(v<8)return 5;if(v<11)return 6;return 0;}
function drawMap(camX,camY){const lvl=LEVELS.find(l=>l.id===selectedLevel)||LEVELS[0];ctx.fillStyle=lvl.bgColor||'#1e3a2f';ctx.fillRect(0,0,W,H);const c0=Math.floor(camX/TILE)-1,r0=Math.floor(camY/TILE)-1,c1=c0+Math.ceil(W/TILE)+2,r1=r0+Math.ceil(H/TILE)+2;for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++)drawTile(c,r,c*TILE-camX,r*TILE-camY,lvl.mapTheme);}

// Deterministisches Pseudo-Random je Tile (stabil über Frames hinweg)
function tileRand(col,row,salt){const h=((col*374761393+row*668265263+salt*2654435761)^((col*row+salt)>>>3))>>>0;return (h%1000)/1000;}

function drawTile(col,row,sx,sy,theme){
  const type=tileAt(col,row),seed=((col*31+row*17)>>>0)%8;
  const fns=MAP_TILE_FNS[theme]||MAP_TILE_FNS.city;
  switch(type){
    case 0: fns.road(sx,sy,col,row,seed); break;
    case 1: case 2: case 3: fns.building(sx,sy,col,row,seed,type-1); break;
    case 4: fns.rubble(sx,sy,col,row,seed); break;
    case 5: fns.special(sx,sy,col,row,seed); break;
    case 6: fns.special2(sx,sy,col,row,seed); break;
  }
}

// ── CITY: Asphalt mit Textur, Laternen, Blutflecken, Autowracks ──
const cityTheme={
  road(sx,sy,col,row,seed){
    const v=170+Math.floor(tileRand(col,row,1)*16-8);
    ctx.fillStyle=`rgb(${v-130},${v-130},${v-130})`;ctx.fillRect(sx,sy,TILE,TILE);
    // feine Asphalt-Körnung
    for(let i=0;i<10;i++){
      const px_=Math.floor(tileRand(col,row,i+10)*TILE),py_=Math.floor(tileRand(col,row,i+20)*TILE);
      ctx.fillStyle=tileRand(col,row,i+30)>.5?'rgba(255,255,255,.04)':'rgba(0,0,0,.08)';
      ctx.fillRect(sx+px_,sy+py_,2,2);
    }
    // Fahrbahnmarkierung
    if(seed%4===0){ctx.fillStyle='rgba(247,201,72,.5)';ctx.fillRect(sx+TILE/2-1,sy,2,TILE);}
    // Schlagloch
    if(seed===2){ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.ellipse(sx+30,sy+34,12,7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=2;ctx.stroke();}
    // Blutflecken
    if(seed===5){ctx.fillStyle='rgba(110,0,0,.35)';ctx.beginPath();ctx.ellipse(sx+20,sy+44,14,8,-.3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(sx+38,sy+20,6,4,.5,0,Math.PI*2);ctx.fill();}
  },
  building(sx,sy,col,row,seed,variant){
    const clrs=['#1a2535','#1e2d1e','#231e1e'];
    ctx.fillStyle=clrs[variant%3];ctx.fillRect(sx,sy,TILE,TILE);
    // Backstein-Linien
    ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;
    for(let by=0;by<TILE;by+=8){ctx.beginPath();ctx.moveTo(sx,sy+by);ctx.lineTo(sx+TILE,sy+by);ctx.stroke();}
    // Fenster (mit zerbrochenen Varianten)
    [[6,6],[6,28],[32,6],[32,28]].forEach(([ox,oy],i)=>{
      const broken=tileRand(col,row,i+40)<.3;
      if(broken){
        ctx.fillStyle='rgba(10,10,10,.6)';ctx.fillRect(sx+ox,sy+oy,14,12);
        ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(sx+ox+2,sy+oy+1);ctx.lineTo(sx+ox+9,sy+oy+10);ctx.moveTo(sx+ox+12,sy+oy+2);ctx.lineTo(sx+ox+5,sy+oy+11);ctx.stroke();
      }else if((seed+ox)%3!==0){
        const lit=tileRand(col,row,i+50)<.4;
        ctx.fillStyle=lit?'rgba(255,220,80,.35)':'rgba(120,150,180,.12)';
        ctx.fillRect(sx+ox,sy+oy,14,12);
        ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.strokeRect(sx+ox,sy+oy,14,12);
        if(lit){ctx.fillStyle='rgba(255,220,80,.08)';ctx.fillRect(sx+ox-3,sy+oy-3,20,18);}
      }
    });
    // Vertikale Regenrohre
    if(seed%2===0){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(sx+2,sy,3,TILE);}
    ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;ctx.strokeRect(sx,sy,TILE,TILE);
  },
  rubble(sx,sy,col,row,seed){
    ctx.fillStyle='#2a2520';ctx.fillRect(sx,sy,TILE,TILE);
    // Trümmer-Steine
    ctx.fillStyle='#3a3028';[[4,8,22,16],[22,6,18,22],[8,28,26,18]].forEach(([rx,ry,rw,rh])=>{ctx.fillRect(sx+rx,sy+ry,rw,rh);ctx.strokeStyle='rgba(0,0,0,.3)';ctx.strokeRect(sx+rx,sy+ry,rw,rh);});
    // Risse
    ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(sx+10,sy+5);ctx.lineTo(sx+18,sy+20);ctx.lineTo(sx+12,sy+40);ctx.stroke();
    // Gras-Sprossen
    if(seed%3===0){ctx.fillStyle='rgba(80,140,60,.5)';for(let i=0;i<3;i++)ctx.fillRect(sx+15+i*8,sy+50,2,8);}
  },
  special(sx,sy,col,row,seed){
    // Ausgebranntes Auto
    ctx.fillStyle='#1a1a1a';ctx.fillRect(sx,sy,TILE,TILE);
    const cc=['#5a1a1a','#1a3a5a','#1a4a2a'][seed%3];
    ctx.fillStyle=cc;ctx.fillRect(sx+4,sy+16,TILE-8,28);
    ctx.fillStyle='#0a0a0a';ctx.fillRect(sx+4,sy+16,TILE-8,4);
    // Fenster (zerbrochen, schwarz)
    ctx.fillStyle='#000';ctx.fillRect(sx+8,sy+20,16,8);ctx.fillRect(sx+34,sy+20,18,8);
    // Räder
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(sx+12,sy+44,7,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(sx+50,sy+44,7,0,Math.PI*2);ctx.fill();
    // Rauch/Brandflecken
    ctx.fillStyle='rgba(80,80,80,.25)';ctx.beginPath();ctx.ellipse(sx+32,sy+10,20,8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,100,0,.15)';ctx.beginPath();ctx.ellipse(sx+32,sy+18,14,6,0,0,Math.PI*2);ctx.fill();
  },
  special2(sx,sy,col,row,seed){
    // Trümmerstraße mit Pflasterstein-Muster
    ctx.fillStyle='#302828';ctx.fillRect(sx,sy,TILE,TILE);
    for(let bx=0;bx<TILE;bx+=12)for(let by=0;by<TILE;by+=8){
      const off=(Math.floor(by/8)%2)*6;
      ctx.fillStyle=(bx+by)%16===0?'#3a3030':'#282020';
      ctx.fillRect(sx+bx+off-6,sy+by,11,7);
      ctx.strokeStyle='rgba(0,0,0,.2)';ctx.strokeRect(sx+bx+off-6,sy+by,11,7);
    }
  },
};

// ── INDUSTRIAL: Metallboden, Rohre, Öl, Funken ──
const industrialTheme={
  road(sx,sy,col,row,seed){
    ctx.fillStyle='#1e1a14';ctx.fillRect(sx,sy,TILE,TILE);
    // Riffelblech-Muster
    ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;
    for(let i=0;i<TILE;i+=6){ctx.beginPath();ctx.moveTo(sx,sy+i);ctx.lineTo(sx+TILE,sy+i);ctx.stroke();}
    // Markierungslinie
    if(seed%3===0){ctx.fillStyle='rgba(200,120,0,.25)';ctx.fillRect(sx,sy+TILE/2-1,TILE,3);}
    // Öl-Lache
    if(seed===2){ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(sx+22,sy+34,16,10,.4,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(60,80,40,.2)';ctx.beginPath();ctx.ellipse(sx+22,sy+34,16,10,.4,0,Math.PI*2);ctx.fill();}
    // Schrauben
    if(seed%5===0){ctx.fillStyle='#666';ctx.fillRect(sx+6,sy+6,3,3);ctx.fillRect(sx+TILE-9,sy+6,3,3);ctx.fillRect(sx+6,sy+TILE-9,3,3);ctx.fillRect(sx+TILE-9,sy+TILE-9,3,3);}
  },
  building(sx,sy,col,row,seed){
    ctx.fillStyle='#2a1e10';ctx.fillRect(sx,sy,TILE,TILE);
    // Wellblech-Wand
    for(let i=0;i<TILE;i+=8){ctx.fillStyle=i%16===0?'#352616':'#241a0e';ctx.fillRect(sx,sy+i,TILE,8);}
    // Vertikale Rohre
    ctx.fillStyle='#3a3020';ctx.fillRect(sx+4,sy,8,TILE);ctx.fillRect(sx+TILE-12,sy,8,TILE);
    ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(sx+4,sy,2,TILE);ctx.fillRect(sx+TILE-12,sy,2,TILE);
    // Ventil
    ctx.fillStyle='#8a6a30';ctx.beginPath();ctx.arc(sx+8,sy+20,5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#5a4010';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx+4,sy+20);ctx.lineTo(sx+12,sy+20);ctx.moveTo(sx+8,sy+16);ctx.lineTo(sx+8,sy+24);ctx.stroke();
    // Warnstreifen
    if(seed%2===0){ctx.fillStyle='rgba(255,180,0,.18)';ctx.fillRect(sx+16,sy+10,4,4);}
    // Glühende Rohröffnung
    if(seed<3){ctx.fillStyle='rgba(255,120,0,.5)';ctx.beginPath();ctx.arc(sx+TILE-8,sy+44,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,180,0,.15)';ctx.beginPath();ctx.arc(sx+TILE-8,sy+44,10,0,Math.PI*2);ctx.fill();}
  },
  rubble(sx,sy,col,row,seed){
    ctx.fillStyle='#1e1a10';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#2a2215';[[2,4,20,20],[28,10,22,16]].forEach(([rx,ry,rw,rh])=>{ctx.fillRect(sx+rx,sy+ry,rw,rh);ctx.strokeStyle='rgba(0,0,0,.3)';ctx.strokeRect(sx+rx,sy+ry,rw,rh);});
    // glühende Kohle
    ctx.fillStyle='rgba(255,100,0,.3)';ctx.beginPath();ctx.arc(sx+20,sy+20,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,200,0,.2)';ctx.beginPath();ctx.arc(sx+20,sy+20,4,0,Math.PI*2);ctx.fill();
  },
  special(sx,sy,col,row,seed){
    // Förderband
    ctx.fillStyle='#1a1a1a';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#3a3a3a';ctx.fillRect(sx,sy+20,TILE,24);
    for(let i=0;i<TILE;i+=10){ctx.fillStyle='#222';ctx.fillRect(sx+i,sy+20,3,24);}
    ctx.fillStyle='#555';ctx.fillRect(sx,sy+18,TILE,2);ctx.fillRect(sx,sy+44,TILE,2);
    // Kisten darauf
    ctx.fillStyle='#5a4020';ctx.fillRect(sx+14,sy+12,18,16);ctx.strokeStyle='#3a2a10';ctx.strokeRect(sx+14,sy+12,18,16);
  },
  special2(sx,sy,col,row,seed){
    ctx.fillStyle='#302828';ctx.fillRect(sx,sy,TILE,TILE);
    // Industrieboden-Gitter
    for(let bx=0;bx<TILE;bx+=10)for(let by=0;by<TILE;by+=10){ctx.strokeStyle='rgba(255,150,0,.05)';ctx.strokeRect(sx+bx,sy+by,10,10);}
    ctx.fillStyle='rgba(255,100,0,.08)';ctx.fillRect(sx,sy+TILE-4,TILE,4);
  },
};

// ── HOSPITAL: Fliesen, Krankenbetten, Rotes Kreuz ──
const hospitalTheme={
  road(sx,sy,col,row,seed){
    ctx.fillStyle=(col+row)%2===0?'#1c2128':'#181d24';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.strokeStyle='rgba(150,180,210,.07)';ctx.lineWidth=1;ctx.strokeRect(sx,sy,TILE,TILE);
    // Bodenmarkierung (Pfeile zu Notausgang)
    if(seed===1){ctx.fillStyle='rgba(80,200,120,.2)';ctx.beginPath();ctx.moveTo(sx+20,sy+32);ctx.lineTo(sx+40,sy+32);ctx.lineTo(sx+34,sy+24);ctx.moveTo(sx+40,sy+32);ctx.lineTo(sx+34,sy+40);ctx.fill();}
    // Blutspur
    if(seed===4){ctx.fillStyle='rgba(140,0,0,.3)';for(let i=0;i<4;i++)ctx.fillRect(sx+10+i*12,sy+20+((i%2)*6),6,6);}
  },
  building(sx,sy,col,row,seed){
    ctx.fillStyle='#1e2840';ctx.fillRect(sx,sy,TILE,TILE);
    // Kachel-Wand-Linien
    ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;
    for(let i=0;i<TILE;i+=10){ctx.beginPath();ctx.moveTo(sx,sy+i);ctx.lineTo(sx+TILE,sy+i);ctx.stroke();}
    // Fenster
    [[6,6],[6,28],[32,6],[32,28]].forEach(([ox,oy],i)=>{
      if((seed+ox)%2===0){
        ctx.fillStyle='rgba(180,220,255,.18)';ctx.fillRect(sx+ox,sy+oy,14,12);
        ctx.strokeStyle='rgba(255,255,255,.1)';ctx.strokeRect(sx+ox,sy+oy,14,12);
      }
    });
    // Rotes Kreuz Schild
    if(seed===1){
      ctx.fillStyle='#fff';ctx.fillRect(sx+22,sy+20,20,20);
      ctx.fillStyle='#c0392b';ctx.fillRect(sx+30,sy+22,4,16);ctx.fillRect(sx+24,sy+28,16,4);
    }
    // Türrahmen
    if(seed===5){ctx.fillStyle='#2a3550';ctx.fillRect(sx+24,sy+10,16,40);ctx.fillStyle='#3a4560';ctx.fillRect(sx+26,sy+12,12,36);}
  },
  rubble(sx,sy,col,row,seed){
    ctx.fillStyle='#141820';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#1e2030';[[6,6,20,20],[28,20,18,14]].forEach(([rx,ry,rw,rh])=>{ctx.fillRect(sx+rx,sy+ry,rw,rh);ctx.strokeStyle='rgba(0,0,0,.3)';ctx.strokeRect(sx+rx,sy+ry,rw,rh);});
    // umgekippter IV-Ständer
    if(seed%2===0){ctx.strokeStyle='#888';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx+40,sy+10);ctx.lineTo(sx+50,sy+50);ctx.stroke();ctx.fillStyle='rgba(200,220,255,.3)';ctx.beginPath();ctx.arc(sx+40,sy+10,4,0,Math.PI*2);ctx.fill();}
  },
  special(sx,sy,col,row,seed){
    // Krankenbett
    ctx.fillStyle=(col+row)%2===0?'#1c2128':'#181d24';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#d8d8d8';ctx.fillRect(sx+8,sy+18,48,26);
    ctx.fillStyle='#b8b8b8';ctx.fillRect(sx+8,sy+18,48,6);
    ctx.fillStyle='#e8e0c8';ctx.fillRect(sx+12,sy+24,40,18);
    ctx.fillStyle='#888';ctx.fillRect(sx+6,sy+16,4,30);ctx.fillRect(sx+54,sy+16,4,30);
    // Blutfleck auf Bett
    if(seed%2===0){ctx.fillStyle='rgba(140,0,0,.45)';ctx.beginPath();ctx.ellipse(sx+30,sy+30,12,7,0,0,Math.PI*2);ctx.fill();}
  },
  special2(sx,sy,col,row,seed){
    // Medizinschrank
    ctx.fillStyle=(col+row)%2===0?'#1c2128':'#181d24';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#b8d0e0';ctx.fillRect(sx+10,sy+6,44,52);
    ctx.fillStyle='#98b8cc';ctx.fillRect(sx+12,sy+8,40,48);
    for(let i=0;i<4;i++){ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(sx+14,sy+12+i*11,36,8);ctx.strokeStyle='rgba(0,0,0,.15)';ctx.strokeRect(sx+14,sy+12+i*11,36,8);}
    ctx.fillStyle='#c0392b';ctx.fillRect(sx+28,sy+30,8,2);ctx.fillRect(sx+31,sy+27,2,8);
  },
};

// ── MILITARY: Schlamm, Sandsäcke, Stacheldraht, Krater ──
const militaryTheme={
  road(sx,sy,col,row,seed){
    const v=30+Math.floor(tileRand(col,row,1)*16);
    ctx.fillStyle=`rgb(${v+8},${v+4},${v-4})`;ctx.fillRect(sx,sy,TILE,TILE);
    // Schlamm-Flecken
    for(let i=0;i<6;i++){
      const px_=tileRand(col,row,i+10)*TILE,py_=tileRand(col,row,i+20)*TILE;
      ctx.fillStyle='rgba(20,15,10,.2)';ctx.beginPath();ctx.ellipse(sx+px_,sy+py_,6,4,0,0,Math.PI*2);ctx.fill();
    }
    // Reifenspuren
    if(seed%3===0){ctx.strokeStyle='rgba(20,15,5,.3)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sx+16,sy);ctx.lineTo(sx+16,sy+TILE);ctx.moveTo(sx+44,sy);ctx.lineTo(sx+44,sy+TILE);ctx.stroke();}
    // Granathülsen
    if(seed===4){ctx.fillStyle='#8a7030';ctx.fillRect(sx+30,sy+30,3,8);ctx.fillRect(sx+36,sy+34,3,8);}
  },
  building(sx,sy,col,row,seed){
    ctx.fillStyle='#1e2818';ctx.fillRect(sx,sy,TILE,TILE);
    // Tarnnetz-Muster
    for(let i=0;i<TILE;i+=8){
      ctx.fillStyle=i%16===0?'#28341c':'#1a2414';
      ctx.fillRect(sx,sy+i,TILE,8);
    }
    // Sandsäcke am unteren Rand
    for(let i=0;i<4;i++){
      ctx.fillStyle=['#8a7a5a','#7a6a4a','#9a8a6a'][i%3];
      ctx.beginPath();ctx.ellipse(sx+8+i*14,sy+TILE-6,8,7,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,.25)';ctx.stroke();
    }
    // Bunkerfenster (dunkel mit Lichtschimmer)
    if(seed%2===0){ctx.fillStyle='rgba(150,180,80,.12)';ctx.fillRect(sx+24,sy+10,16,10);ctx.strokeStyle='#1a2510';ctx.strokeRect(sx+24,sy+10,16,10);}
  },
  rubble(sx,sy,col,row,seed){
    ctx.fillStyle='#181e14';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#252c1a';[[4,4,18,18],[26,16,20,14]].forEach(([rx,ry,rw,rh])=>{ctx.fillRect(sx+rx,sy+ry,rw,rh);ctx.strokeStyle='rgba(0,0,0,.3)';ctx.strokeRect(sx+rx,sy+ry,rw,rh);});
    // Stacheldraht-Rolle
    if(seed%2===0){ctx.strokeStyle='#888';ctx.lineWidth=1;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(sx+44,sy+44,4+i*2,0,Math.PI*2);ctx.stroke();}}
  },
  special(sx,sy,col,row,seed){
    // Explosionskrater
    ctx.fillStyle='#1e2218';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#100c08';ctx.beginPath();ctx.ellipse(sx+32,sy+32,26,16,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(80,40,0,.4)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sx+32,sy+32,28,18,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='rgba(255,80,0,.1)';ctx.beginPath();ctx.ellipse(sx+32,sy+32,14,8,0,0,Math.PI*2);ctx.fill();
  },
  special2(sx,sy,col,row,seed){
    // Stacheldraht-Zaun
    ctx.fillStyle='#1e2218';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#555';ctx.fillRect(sx+10,sy,4,TILE);ctx.fillRect(sx+50,sy,4,TILE);
    ctx.strokeStyle='#999';ctx.lineWidth=1;
    for(let i=0;i<TILE;i+=10){ctx.beginPath();ctx.moveTo(sx+10,sy+i);ctx.lineTo(sx+54,sy+i);ctx.stroke();
      for(let j=0;j<4;j++){ctx.beginPath();ctx.moveTo(sx+14+j*10,sy+i);ctx.lineTo(sx+18+j*10,sy+i+4);ctx.stroke();}
    }
  },
};

// ── DOWNTOWN: Neon, Regen-Reflexionen, Glas-Hochhäuser ──
const downtownTheme={
  road(sx,sy,col,row,seed){
    ctx.fillStyle='#0e1020';ctx.fillRect(sx,sy,TILE,TILE);
    // Nasser Asphalt mit Glanz
    ctx.fillStyle='rgba(255,255,255,.02)';for(let i=0;i<8;i++){const px_=tileRand(col,row,i+10)*TILE,py_=tileRand(col,row,i+20)*TILE;ctx.fillRect(sx+px_,sy+py_,8,1);}
    // Neon-Reflexion
    const neonColors=['rgba(255,0,100,.07)','rgba(0,200,255,.06)','rgba(180,0,255,.05)','rgba(0,255,120,.05)'];
    ctx.fillStyle=neonColors[seed%4];ctx.fillRect(sx,sy,TILE,TILE);
    // Reflektierte Lichtstreifen
    if(seed%3===0){ctx.fillStyle=neonColors[(seed+1)%4].replace(/[\d.]+\)$/,'.2)');ctx.fillRect(sx,sy+20,TILE,4);}
  },
  building(sx,sy,col,row,seed){
    const clrs=['#0d1530','#1a1040','#200d30'];
    ctx.fillStyle=clrs[seed%3];ctx.fillRect(sx,sy,TILE,TILE);
    const neonW=['rgba(255,50,100,.45)','rgba(0,200,255,.4)','rgba(180,0,255,.35)','rgba(0,255,120,.4)'];
    const nc=neonW[(col+row)%4];
    [[6,6],[6,28],[32,6],[32,28]].forEach(([ox,oy],i)=>{
      if((seed+ox)%2===0){
        ctx.fillStyle=nc;ctx.fillRect(sx+ox,sy+oy,14,12);
        ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(sx+ox+1,sy+oy+1,12,2);
        // Glow
        ctx.fillStyle=nc.replace(/[\d.]+\)$/,'.12)');ctx.fillRect(sx+ox-3,sy+oy-3,20,18);
      }else{
        ctx.fillStyle='rgba(10,10,25,.5)';ctx.fillRect(sx+ox,sy+oy,14,12);
      }
    });
    // Vertikale Neonröhre an Gebäudekante
    if(seed%4===0){ctx.fillStyle=nc;ctx.fillRect(sx,sy,2,TILE);ctx.fillStyle=nc.replace(/[\d.]+\)$/,'.15)');ctx.fillRect(sx-3,sy,8,TILE);}
  },
  rubble(sx,sy,col,row,seed){
    ctx.fillStyle='#0a0c18';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='rgba(180,0,255,.12)';ctx.beginPath();ctx.arc(sx+28,sy+20,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#14182a';[[6,8,20,18]].forEach(([rx,ry,rw,rh])=>{ctx.fillRect(sx+rx,sy+ry,rw,rh);ctx.strokeStyle='rgba(180,0,255,.1)';ctx.strokeRect(sx+rx,sy+ry,rw,rh);});
  },
  special(sx,sy,col,row,seed){
    // Neon-Werbetafel
    ctx.fillStyle='#0a0c18';ctx.fillRect(sx,sy,TILE,TILE);
    ctx.fillStyle='#1a1530';ctx.fillRect(sx+4,sy+10,56,30);
    const cols=['#ff3366','#33ccff','#cc33ff','#33ff99'];
    for(let i=0;i<3;i++){ctx.fillStyle=cols[i];ctx.globalAlpha=.6;ctx.fillRect(sx+8,sy+14+i*8,48,4);}
    ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(sx+4,sy+10,56,30);
  },
  special2(sx,sy,col,row,seed){
    // Regen-Pfütze mit Reflexion
    ctx.fillStyle='#0a0c18';ctx.fillRect(sx,sy,TILE,TILE);
    const cols=['rgba(255,0,100,.18)','rgba(0,200,255,.15)','rgba(180,0,255,.13)'];
    ctx.fillStyle=cols[seed%3];ctx.beginPath();ctx.ellipse(sx+32,sy+44,24,8,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(sx+32,sy+44,24,8,0,0,Math.PI*2);ctx.stroke();
  },
};

const MAP_TILE_FNS={
  city: {road:(sx,sy,c,r,sd)=>cityTheme.road(sx,sy,c,r,sd), building:(sx,sy,c,r,sd,v)=>cityTheme.building(sx,sy,c,r,sd,v), rubble:(sx,sy,c,r,sd)=>cityTheme.rubble(sx,sy,c,r,sd), special:(sx,sy,c,r,sd)=>cityTheme.special(sx,sy,c,r,sd), special2:(sx,sy,c,r,sd)=>cityTheme.special2(sx,sy,c,r,sd)},
  industrial: {road:(sx,sy,c,r,sd)=>industrialTheme.road(sx,sy,c,r,sd), building:(sx,sy,c,r,sd)=>industrialTheme.building(sx,sy,c,r,sd), rubble:(sx,sy,c,r,sd)=>industrialTheme.rubble(sx,sy,c,r,sd), special:(sx,sy,c,r,sd)=>industrialTheme.special(sx,sy,c,r,sd), special2:(sx,sy,c,r,sd)=>industrialTheme.special2(sx,sy,c,r,sd)},
  hospital: {road:(sx,sy,c,r,sd)=>hospitalTheme.road(sx,sy,c,r,sd), building:(sx,sy,c,r,sd)=>hospitalTheme.building(sx,sy,c,r,sd), rubble:(sx,sy,c,r,sd)=>hospitalTheme.rubble(sx,sy,c,r,sd), special:(sx,sy,c,r,sd)=>hospitalTheme.special(sx,sy,c,r,sd), special2:(sx,sy,c,r,sd)=>hospitalTheme.special2(sx,sy,c,r,sd)},
  military: {road:(sx,sy,c,r,sd)=>militaryTheme.road(sx,sy,c,r,sd), building:(sx,sy,c,r,sd)=>militaryTheme.building(sx,sy,c,r,sd), rubble:(sx,sy,c,r,sd)=>militaryTheme.rubble(sx,sy,c,r,sd), special:(sx,sy,c,r,sd)=>militaryTheme.special(sx,sy,c,r,sd), special2:(sx,sy,c,r,sd)=>militaryTheme.special2(sx,sy,c,r,sd)},
  downtown: {road:(sx,sy,c,r,sd)=>downtownTheme.road(sx,sy,c,r,sd), building:(sx,sy,c,r,sd)=>downtownTheme.building(sx,sy,c,r,sd), rubble:(sx,sy,c,r,sd)=>downtownTheme.rubble(sx,sy,c,r,sd), special:(sx,sy,c,r,sd)=>downtownTheme.special(sx,sy,c,r,sd), special2:(sx,sy,c,r,sd)=>downtownTheme.special2(sx,sy,c,r,sd)},
};

function draw(){
  ctx.clearRect(0,0,W,H);drawMap(G.camX,G.camY);
  const cx=-G.camX,cy=-G.camY;
  G.aoeRings.forEach(r=>{ctx.save();ctx.translate(r.x+cx,r.y+cy);ctx.strokeStyle=`rgba(192,57,43,${r.life/45*.8})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r.r,0,Math.PI*2);ctx.stroke();ctx.fillStyle=`rgba(192,57,43,${r.life/45*.1})`;ctx.beginPath();ctx.arc(0,0,r.r,0,Math.PI*2);ctx.fill();ctx.restore();});
  G.lootDrops.forEach(l=>{const by=Math.sin(l.bob)*5;ctx.save();ctx.translate(l.x+cx,l.y+cy+by);ctx.fillStyle='#f7c948';ctx.strokeStyle='#b8860b';ctx.lineWidth=2;rr(ctx,-18,-12,36,26,6);ctx.fill();ctx.stroke();ctx.fillStyle='#b8860b';ctx.font='bold 9px Nunito';ctx.textAlign='center';ctx.fillText('BEUTE!',0,5);ctx.restore();});
  G.particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/40);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x+cx,p.y+cy,p.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;
  G.enemies.forEach(e=>{const sx=e.x+cx,sy=e.y+cy;if(sx<-80||sx>W+80||sy<-100||sy>H+100)return;const et=(e.tick||0)||globalTick;if(e.type==='a')drawZombieA(sx,sy,e.size,e.hp,e.maxHp,e.hat,et);else if(e.type==='b')drawZombieB(sx,sy,e.size,e.hp,e.maxHp,et);else if(e.type==='c')drawZombieC(sx,sy,e.size,e.hp,e.maxHp,et);else if(e.type==='d')drawZombieD(sx,sy,e.size,e.hp,e.maxHp,et);else if(e.type==='e')drawZombieE(sx,sy,e.size,e.hp,e.maxHp,et);else if(e.type==='f')drawZombieF(sx,sy,e.size,e.hp,e.maxHp,et);});
  if(G.bossActive&&G.boss){const b=G.boss;drawBoss(b.x+cx,b.y+cy,b.hp,b.maxHp,(b.tick||0)||globalTick,b.slamAnim||0);document.getElementById('boss-fill').style.width=Math.max(0,b.hp/b.maxHp*100)+'%';}
  if(G.isMP&&G.mpSnapshot){G.mpSnapshot.members.forEach(m=>{if(m.username===currentUser.username)return;drawRemotePlayer(m.x+cx,m.y+cy,m.username);});}
  if(G.guardians&&G.guardianVisible){G.guardians.forEach(gd=>{const sx=gd.x+cx,sy=gd.y+cy;ctx.save();ctx.translate(sx,sy);ctx.rotate(gd.angle);ctx.fillStyle='#c0392b';ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(4,0);ctx.lineTo(0,5);ctx.lineTo(-4,0);ctx.closePath();ctx.fill();ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();ctx.restore();});}
  if(G.rockets)G.rockets.forEach(r=>{
    const sx=r.x+cx,sy=r.y+cy;const ang=Math.atan2(r.vy,r.vx);
    ctx.save();ctx.translate(sx,sy);ctx.rotate(ang);
    if(r.wpnId==='grenade'){
      // Rotierende Granate
      ctx.rotate(globalTick*.2);
      ctx.fillStyle='#3a5a1a';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#9acd32';ctx.beginPath();ctx.arc(0,0,2,0,Math.PI*2);ctx.fill();
    }else{
      ctx.fillStyle='#e74c3c';rr(ctx,-4,-3,14,6,3);ctx.fill();
      ctx.fillStyle='#ff6600';ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(-9,-4);ctx.lineTo(-9,4);ctx.closePath();ctx.fill();
    }
    ctx.restore();
    // Kurzer Exhaust-Trail
    ctx.globalAlpha=.5;ctx.fillStyle='#ff8800';
    ctx.beginPath();ctx.arc(sx-r.vx*1.2,sy-r.vy*1.2,3,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  });
  if(G.fireZones)G.fireZones.forEach(fz=>{const sx=fz.x+cx,sy=fz.y+cy;const alpha=(fz.life/fz.maxLife)*.7;ctx.fillStyle=`rgba(255,100,0,${alpha*.4})`;ctx.beginPath();ctx.arc(sx,sy,fz.r,0,Math.PI*2);ctx.fill();ctx.fillStyle=`rgba(255,200,0,${alpha*.6})`;ctx.beginPath();ctx.arc(sx,sy,fz.r*.5,0,Math.PI*2);ctx.fill();});
  G.kunais.forEach(k=>{const sx=k.x+cx,sy=k.y+cy;ctx.save();ctx.translate(sx,sy);ctx.rotate(k.rot);ctx.fillStyle='#2c2c2c';ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(3,4);ctx.lineTo(0,8);ctx.lineTo(-3,4);ctx.closePath();ctx.fill();ctx.fillStyle='#c0392b';ctx.fillRect(-2,0,4,5);ctx.restore();});

  // ── Projektile: kurzer Pixel-Trail + kompaktes Geschoss ──
  G.bullets.forEach(b=>{
    const sx=b.x+cx,sy=b.y+cy;
    const spd=Math.sqrt(b.vx*b.vx+b.vy*b.vy)||1;
    const dirX=b.vx/spd,dirY=b.vy/spd;
    const trailLen=Math.min(16,b.size*2.2);

    if(b.isFlame){
      // Flammen-Partikel: weicher Glow statt scharfem Strich
      ctx.globalAlpha=Math.max(0,Math.min(1,b.life/30));
      ctx.fillStyle=b.color+'55';ctx.beginPath();ctx.arc(sx,sy,b.size+3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=b.color;ctx.beginPath();ctx.arc(sx,sy,b.size,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ffdd88';ctx.beginPath();ctx.arc(sx,sy,b.size*.5,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
      return;
    }

    if(b.wpnId==='crossbow'){
      // Bolzen: Pixel-Pfeil statt Kreis
      ctx.save();ctx.translate(sx,sy);ctx.rotate(Math.atan2(dirY,dirX));
      ctx.globalAlpha=.35;ctx.fillStyle='#c8a060';ctx.fillRect(-trailLen,-1,trailLen,2);ctx.globalAlpha=1;
      ctx.fillStyle='#8b6914';ctx.fillRect(-6,-1,8,2);
      ctx.fillStyle='#ddd';ctx.beginPath();ctx.moveTo(2,-2);ctx.lineTo(6,0);ctx.lineTo(2,2);ctx.closePath();ctx.fill();
      ctx.restore();
      return;
    }

    // Kurzer Strich-Trail in Bewegungsrichtung (sichtbar, aber nicht überlang)
    ctx.strokeStyle=b.color+'70';ctx.lineWidth=Math.max(1.5,b.size*.5);
    ctx.beginPath();ctx.moveTo(sx-dirX*trailLen,sy-dirY*trailLen);ctx.lineTo(sx,sy);ctx.stroke();
    // Glow
    ctx.fillStyle=b.color+'33';ctx.beginPath();ctx.arc(sx,sy,b.size+3,0,Math.PI*2);ctx.fill();
    // Kern
    ctx.fillStyle=b.color;ctx.beginPath();ctx.arc(sx,sy,b.size,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(sx,sy,b.size*.4,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  });
  drawPlayer(G.px+cx,G.py+cy,G.facing);
  const psx=G.px+cx,psy=G.py+cy,hpPct=G.playerHp/G.playerMaxHp;
  ctx.fillStyle='rgba(0,0,0,.55)';rr(ctx,psx-22,psy+18,44,6,2);ctx.fill();ctx.fillStyle=hpPct>.5?'#27ae60':hpPct>.25?'#f39c12':'#c0392b';rr(ctx,psx-22,psy+18,44*hpPct,6,2);ctx.fill();
  if(G.shield){ctx.strokeStyle='rgba(52,152,219,.7)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(psx,psy,20,0,Math.PI*2);ctx.stroke();}
  G.floatingTexts.forEach(tt=>{ctx.globalAlpha=Math.max(0,tt.alpha);ctx.fillStyle=tt.color;ctx.font='bold 13px Nunito';ctx.textAlign='center';ctx.fillText(tt.text,tt.x+cx,tt.y+cy);});ctx.globalAlpha=1;
  drawHUD();
  if(screenFlash.alpha>0){ctx.fillStyle=screenFlash.color;ctx.globalAlpha=screenFlash.alpha;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;screenFlash.alpha=Math.max(0,screenFlash.alpha-screenFlash.max/screenFlash.duration);}
}

function drawRemotePlayer(sx,sy,name){ctx.save();ctx.translate(sx,sy);ctx.fillStyle='rgba(52,152,219,.7)';ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#3498db';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 10px Nunito';ctx.textAlign='center';ctx.fillText(name.substring(0,8),0,24);ctx.restore();}

function px2(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}

// ── SPIELER: animierter Pixel-Walkcycle ────────────────────
// Läuft, wenn sich die Position seit letztem Frame ändert; Beine + leichtes
// Body-Bob werden über G._walkTick angetrieben, Farbe richtet sich nach
// dem aktiven Charakter (charDef.color, Fallback Standard-Lila).
function drawPlayer(sx,sy,angle){
  ctx.save();ctx.translate(sx,sy);ctx.rotate(angle);

  // Bewegungs-Tick für Walk-Animation
  const moving=(keys['w']||keys['a']||keys['s']||keys['d']||keys['arrowup']||keys['arrowdown']||keys['arrowleft']||keys['arrowright']||(window._touchMoveX||window._touchMoveY));
  G._walkTick=(G._walkTick||0)+(moving?1:0.15);
  const wt=G._walkTick;
  const run=Math.floor(Math.sin(wt*.35)*2.4);
  const bob=Math.floor(Math.abs(Math.sin(wt*.35))*1.6);

  // Charakter-Farbe
  const charDef=(typeof getCharacter==='function')?getCharacter(G.activeCharId||'ghost'):null;
  const bodyCol=charDef?charDef.color:'#5b2d8e';
  const bodyDark=shadeColor(bodyCol,-30);
  const bodyLight=shadeColor(bodyCol,20);

  // Schatten
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,15,11,4,0,0,Math.PI*2);ctx.fill();

  // Beine (alternierend laufend)
  px2(-8,8+Math.max(0,run),7,13-Math.max(0,run),bodyDark);
  px2(1,8+Math.max(0,-run),7,13-Math.max(0,-run),bodyDark);
  px2(-10,19,9,4,'#1a1a1a');
  px2(1,19,9,4,'#1a1a1a');

  // Körper mit leichtem Bob
  px2(-10,-5-bob*0.3,20,14,bodyCol);
  px2(-10,-5-bob*0.3,20,3,bodyLight);

  // Kopf
  px2(-3,-7-bob*0.3,6,4,'#c8884a');
  px2(-10,-20-bob*0.3,20,14,'#c8884a');
  px2(-6,-16-bob*0.3,3,3,'#1a0a00');
  px2(4,-16-bob*0.3,3,3,'#1a0a00');
  px2(-6,-16-bob*0.3,1,1,'#fff');
  px2(4,-16-bob*0.3,1,1,'#fff');

  // Helm
  px2(-10,-24-bob*0.3,20,6,'#c0392b');
  px2(-13,-22-bob*0.3,4,4,'#c0392b');
  px2(9,-22-bob*0.3,5,3,'#a93226');
  px2(-8,-24-bob*0.3,14,2,'#e74c3c');

  // Waffe – animiert je Typ
  drawHeldWeapon();

  if(G.dashActive){ctx.strokeStyle='rgba(126,207,247,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

// Hilfsfunktion: Farbe abdunkeln/aufhellen (Hex -> Hex)
function shadeColor(hex,percent){
  hex=hex.replace('#','');
  if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');
  let r=parseInt(hex.substring(0,2),16),g=parseInt(hex.substring(2,4),16),b=parseInt(hex.substring(4,6),16);
  r=Math.max(0,Math.min(255,Math.round(r+(percent/100)*255)));
  g=Math.max(0,Math.min(255,Math.round(g+(percent/100)*255)));
  b=Math.max(0,Math.min(255,Math.round(b+(percent/100)*255)));
  return `rgb(${r},${g},${b})`;
}

// ── GEHALTENE WAFFE: animierte Pixel-Modelle pro Waffentyp ──
function drawHeldWeapon(){
  const w=curWpn();if(!w)return;
  const t=globalTick;
  const recoil=w.fireCooldown>0?Math.min(3,w.fireCooldown*0.4):0;
  const muzzle=w.fireCooldown>(w.fireRate*0.7);

  if(w.id==='minigun'){
    // Rotierende Mehrfachläufe
    ctx.fillStyle='#444';rr(ctx,5-recoil,-6,28,12,4);ctx.fill();
    ctx.fillStyle='#333';rr(ctx,29-recoil,-8,14,5,2);ctx.fill();rr(ctx,29-recoil,3,14,5,2);ctx.fill();
    const spin=t*(w.cooling?0:1.2);
    for(let i=0;i<3;i++){
      const a=spin+i*(Math.PI*2/3);
      const ry=Math.sin(a)*3;
      ctx.fillStyle='#555';ctx.fillRect(31-recoil,Math.round(-2+ry),12,2);
    }
    if(muzzle&&!w.cooling){ctx.fillStyle='#ffe066';ctx.beginPath();ctx.arc(45-recoil,-1,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(45-recoil,-1,2,0,Math.PI*2);ctx.fill();}
  }
  else if(w.id==='rpg'){
    ctx.fillStyle='#5a5a5a';rr(ctx,4-recoil,-4,26,8,3);ctx.fill();
    ctx.fillStyle='#c0392b';rr(ctx,6-recoil,-6,6,12,2);ctx.fill();
    ctx.fillStyle='#3a3a3a';rr(ctx,28-recoil,-3,6,6,2);ctx.fill();
    if(muzzle){ctx.fillStyle='#ff6600';ctx.beginPath();ctx.arc(34-recoil,0,6,0,Math.PI*2);ctx.fill();}
  }
  else if(w.id==='grenade'){
    // Granatwerfer: Trommel rotiert
    ctx.fillStyle='#3a5a2a';rr(ctx,2-recoil,-5,22,10,3);ctx.fill();
    const spin=t*.06;
    ctx.save();ctx.translate(8-recoil,0);
    for(let i=0;i<6;i++){const a=spin+i*(Math.PI/3);ctx.fillStyle='#2a2a2a';ctx.beginPath();ctx.arc(Math.cos(a)*4,Math.sin(a)*4,2,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#1a1a1a';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();
    ctx.restore();
    ctx.fillStyle='#2a3a1a';rr(ctx,23-recoil,-3,9,6,2);ctx.fill();
    if(muzzle){ctx.fillStyle='#9acd32';ctx.beginPath();ctx.arc(33-recoil,0,5,0,Math.PI*2);ctx.fill();}
  }
  else if(w.id==='molotov'){
    const swing=Math.sin(t*.05)*.15;
    ctx.save();ctx.rotate(swing);
    ctx.fillStyle='#2e6b2e';rr(ctx,8,-5,12,10,4);ctx.fill();
    ctx.fillStyle='#3a8a3a';rr(ctx,9,-4,10,3,2);ctx.fill();
    // Docht mit Flamme
    px2(13,-8,2,4,'#8b6914');
    const fl=Math.random();
    ctx.globalAlpha=.6+fl*.4;
    ctx.fillStyle='#ff4400';ctx.beginPath();ctx.arc(14,-9,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffaa00';ctx.beginPath();ctx.arc(14,-10,1.5,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
    ctx.restore();
  }
  else if(w.id==='shotgun'){
    const pump=Math.abs(Math.sin(t*.15))*1.5;
    ctx.fillStyle='#5a3010';rr(ctx,6-recoil,-4,24,8,3);ctx.fill();
    ctx.fillStyle='#2c2c2c';rr(ctx,24-recoil,-5,14,5,2);ctx.fill();
    ctx.fillStyle='#3a3a3a';ctx.fillRect(12-recoil,-6+pump,8,2);
    if(muzzle){ctx.fillStyle='#ff8844';ctx.beginPath();ctx.arc(38-recoil,-2,5,0,Math.PI*2);ctx.fill();}
  }
  else if(w.id==='sniper'){
    ctx.fillStyle='#2c3a2c';rr(ctx,6-recoil,-3,30,6,2);ctx.fill();
    // Scope
    ctx.fillStyle='#1a1a1a';ctx.fillRect(12-recoil,-9,8,4);
    ctx.fillStyle='rgba(150,220,255,.6)';ctx.fillRect(13-recoil,-8,6,2);
    // Bipod
    ctx.strokeStyle='#555';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(28-recoil,3);ctx.lineTo(26-recoil,9);ctx.stroke();
    ctx.beginPath();ctx.moveTo(32-recoil,3);ctx.lineTo(34-recoil,9);ctx.stroke();
    if(muzzle){ctx.fillStyle='#aaffaa';ctx.beginPath();ctx.arc(38-recoil,0,4,0,Math.PI*2);ctx.fill();}
  }
  else if(w.id==='crossbow'){
    ctx.fillStyle='#5a3a1a';rr(ctx,4-recoil,-3,20,6,2);ctx.fill();
    // Bogen
    const tension=w.reloading?2:0;
    ctx.strokeStyle='#4a6a4a';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(22-recoil,0,9,-1,1);ctx.stroke();
    ctx.strokeStyle='#c8a060';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(22-recoil,-7+tension);ctx.lineTo(27-recoil,0);ctx.lineTo(22-recoil,7-tension);ctx.stroke();
    // Bolzen
    if(!w.reloading){ctx.fillStyle='#c0392b';ctx.fillRect(20-recoil,-1,7,2);}
  }
  else if(w.id==='flamethrower'){
    ctx.fillStyle='#666';rr(ctx,2-recoil,-5,8,10,2);ctx.fill();
    ctx.fillStyle='#444';rr(ctx,9-recoil,-3,16,6,2);ctx.fill();
    if(mouse.down&&!w.reloading&&w.ammo>0){
      for(let i=0;i<4;i++){
        const fa=t*.2+i*.5;const fy=Math.sin(fa)*3;const flicker=Math.random();
        ctx.globalAlpha=flicker*.85;
        const cols=['#ff6600','#ff4400','#ffaa00','#ffcc00'];
        ctx.fillStyle=cols[i%4];
        ctx.beginPath();ctx.arc(28-recoil+i*5,fy,3-i*0.3,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;
    }
  }
  else{
    // Pistole / Gewehr / Standard
    const len=w.id==='rifle'?26:22;
    ctx.fillStyle='#2c2c2c';rr(ctx,6-recoil,-3,len,7,2);ctx.fill();
    ctx.fillStyle='#1a1a1a';rr(ctx,6+len-recoil,-5,10,4,1);ctx.fill();
    if(w.id==='rifle'){
      // Magazin + Kimme
      ctx.fillStyle='#3a2a1a';ctx.fillRect(12-recoil,2,4,6);
      ctx.fillStyle='#555';ctx.fillRect(8-recoil,-5,2,2);
    }
    if(muzzle){ctx.fillStyle='#ffe066';ctx.beginPath();ctx.arc(16+len-recoil,-3,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(16+len-recoil,-3,2,0,Math.PI*2);ctx.fill();}
  }
}

function drawZHPbar(hp,maxHp){if(hp>=maxHp)return;const bw=36;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(-bw/2,22,bw,5);ctx.fillStyle='#f7c948';ctx.fillRect(-bw/2,22,bw*(hp/maxHp),5);}
function drawZombieA(sx,sy,sz,hp,maxHp,hat,tick){
  ctx.save();ctx.translate(sx,sy);const s=sz/18;ctx.scale(s,s);
  const run=Math.floor(Math.sin(tick*.12)*2.5);
  const bob=Math.abs(Math.sin(tick*.12))*1.5;
  const armL=Math.floor(Math.sin(tick*.12+1)*4); // Arme strecken sich vor
  const armR=Math.floor(Math.sin(tick*.12)*4);
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,23,10,3,0,0,Math.PI*2);ctx.fill();
  // Beine (laufend)
  px2(-9,8+Math.max(0,run),7,14-Math.max(0,run),'#3d6b3d');
  px2(2,8+Math.max(0,-run),7,14-Math.max(0,-run),'#3d6b3d');
  px2(-11,20,9,5,'#1a1a1a');px2(2,20,9,5,'#1a1a1a');
  // Körper
  px2(-10,-2-bob,20,12,'#3a6b4a');
  // Arme (gestreckt nach vorne - Zombie-typisch)
  px2(-22,-2+armL,13,7,'#4a8a4a');px2(9,-2+armR,13,7,'#4a8a4a');
  px2(-26,-3+armL,5,9,'#4a8a4a');px2(21,-3+armR,5,9,'#4a8a4a');
  // Kopf
  px2(-10,-18-bob,20,18,'#4a8a4a');
  px2(-7,-12-bob,5,5,'#cc2200');px2(2,-12-bob,5,5,'#cc2200');
  px2(-6,-11-bob,3,3,'#ff4400');px2(3,-11-bob,3,3,'#ff4400');
  ctx.fillStyle='#1a1a1a';ctx.fillRect(-6,-5-bob,12,3);
  ctx.fillStyle='#cc0000';ctx.fillRect(-4,-5-bob,2,3);ctx.fillRect(0,-5-bob,2,3);ctx.fillRect(4,-5-bob,2,3);
  px2(-10,-19-bob,20,3,'#1a1a1a');
  if(hat){px2(-4,-26-bob,8,3,'#e67e22');px2(-6,-24-bob,12,3,'#e67e22');px2(-3,-28-bob,6,3,'#fff');}
  drawZHPbar(hp,maxHp);ctx.restore();
}
function drawZombieB(sx,sy,sz,hp,maxHp,tick){
  ctx.save();ctx.translate(sx,sy);const s=sz/14;ctx.scale(s,s);
  const run=Math.floor(Math.sin(tick*.18)*3); // schneller als A
  const bob=Math.abs(Math.sin(tick*.18))*2;
  const lean=-2; // nach vorne gelehnt (Sprint)
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(0,19,8,3,0,0,Math.PI*2);ctx.fill();
  px2(-6,6+Math.max(0,run),5,10-Math.max(0,run),'#3d5a3d');
  px2(1,6+Math.max(0,-run),5,10-Math.max(0,-run),'#3d5a3d');
  px2(-8,15,7,4,'#222');px2(1,15,7,4,'#222');
  // Körper (rotes Hemd)
  px2(-8,-2-bob,16,10,'#c0392b');
  // Arme seitlich beim Sprint
  px2(-16,-3+Math.floor(Math.sin(tick*.18)*3),9,5,'#4a8a4a');
  px2(7,-3+Math.floor(Math.sin(tick*.18+Math.PI)*3),9,5,'#4a8a4a');
  // Kopf nach vorne geneigt
  px2(-10,-16-bob,18,16,'#4a8a4a');
  px2(-6,-10-bob,4,4,'#ff2200');px2(2,-10-bob,4,4,'#ff2200');
  ctx.fillStyle='#111';ctx.fillRect(-5,-4-bob,10,3);
  px2(-10,-17-bob,18,3,'#222');
  drawZHPbar(hp,maxHp);ctx.restore();
}
function drawZombieC(sx,sy,sz,hp,maxHp,tick){
  ctx.save();ctx.translate(sx,sy);const s=sz/22;ctx.scale(s,s);
  const run=Math.floor(Math.sin(tick*.07)*2); // langsam, schwer
  const bob=Math.abs(Math.sin(tick*.07))*2.5;
  const stomp=stomp2=(tick*.07+0);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,25,14,5,0,0,Math.PI*2);ctx.fill();
  // Beine (schwere Stampfbewegung)
  px2(-12,10+Math.max(0,run),10,16,'#2e5a2e');
  px2(2,10+Math.max(0,-run),10,16,'#2e5a2e');
  px2(-14,24,12,6,'#111');px2(2,24,12,6,'#111');
  // Massiger Körper
  px2(-14,-4-bob,28,16,'#2e4a2e');
  // Arme hängend (langsam schwingend)
  const aSwing=Math.floor(Math.sin(tick*.07)*3);
  px2(-24,-3+aSwing,11,9,'#3a7a3a');px2(13,-3-aSwing,11,9,'#3a7a3a');
  px2(-13,-22-bob,26,20,'#3a7a3a');
  px2(-8,-14-bob,6,6,'#cc2200');px2(2,-14-bob,6,6,'#cc2200');
  ctx.fillStyle='#111';ctx.fillRect(-7,-4-bob,14,4);
  px2(-13,-23-bob,26,4,'#1a1a1a');
  drawZHPbar(hp,maxHp);ctx.restore();
}
function drawZombieD(sx,sy,sz,hp,maxHp,tick){
  ctx.save();ctx.translate(sx,sy);const s=sz/15;ctx.scale(s,s);
  const run=Math.floor(Math.sin(tick*.13)*2.5);
  const bob=Math.abs(Math.sin(tick*.13))*1.5;
  // Blink-Effekt: schneller wenn bereit zu explodieren (HP < 50%)
  const blinkRate=hp/maxHp<.5?tick*.35:tick*.18;
  const glow=.35+Math.abs(Math.sin(blinkRate))*.45;
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(0,17,7,3,0,0,Math.PI*2);ctx.fill();
  px2(-5,5+Math.max(0,run),5,8,'#8b4513');
  px2(0,5+Math.max(0,-run),5,8,'#8b4513');
  px2(-7,13,6,4,'#111');px2(1,13,6,4,'#111');
  px2(-8,-1-bob,16,8,'#cc5500');
  px2(-12,0,5,5,'#e07020');px2(7,0,5,5,'#e07020');
  px2(-8,-14-bob,16,14,'#e06000');
  px2(-5,-9-bob,4,4,'#ff3300');px2(1,-9-bob,4,4,'#ff3300');
  ctx.fillStyle='#111';ctx.fillRect(-5,-4-bob,10,3);
  // Zünder blinkt
  px2(-1,-17-bob,2,5,'#f7c948');
  ctx.fillStyle=`rgba(255,100,0,${glow})`;ctx.beginPath();ctx.arc(0,-18-bob,3,0,Math.PI*2);ctx.fill();
  // Explosive Aura pulsiert
  ctx.strokeStyle=`rgba(255,100,0,${glow*.8})`;ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.stroke();
  // Extra-Ring bei niedrigem HP
  if(hp/maxHp<.35){ctx.strokeStyle=`rgba(255,50,0,${glow})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.stroke();}
  drawZHPbar(hp,maxHp);ctx.restore();
}
function drawZombieE(sx,sy,sz,hp,maxHp,tick){
  ctx.save();ctx.translate(sx,sy);const s=sz/20;ctx.scale(s,s);
  const run=Math.floor(Math.sin(tick*.09)*2);
  const bob=Math.abs(Math.sin(tick*.09))*1.5;
  // Umhang weht
  const capeL=Math.floor(Math.sin(tick*.08)*4);
  const capeR=Math.floor(Math.sin(tick*.08+1)*4);
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(0,23,10,4,0,0,Math.PI*2);ctx.fill();
  // Umhang (dynamisch)
  ctx.fillStyle='#5a0080';
  ctx.beginPath();ctx.moveTo(-12,20+capeL);ctx.lineTo(-10,-2);ctx.lineTo(10,-2);ctx.lineTo(12,20+capeR);ctx.closePath();ctx.fill();
  // Arme mit Heilorbs (pulsierend)
  const healPulse=.5+.45*Math.abs(Math.sin(tick*.1));
  px2(-20,0+run,12,6,'#3a7a3a');px2(8,0-run,12,6,'#3a7a3a');
  ctx.fillStyle=`rgba(50,255,80,${healPulse})`;
  ctx.beginPath();ctx.arc(-22,3+run,5+healPulse*2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(22,3-run,5+healPulse*2,0,Math.PI*2);ctx.fill();
  // Heilaura-Ringe
  for(let i=0;i<2;i++){
    const rp=(tick*.05+i*.5)%1;
    ctx.strokeStyle=`rgba(50,200,80,${(1-rp)*.4})`;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,20+rp*16,0,Math.PI*2);ctx.stroke();
  }
  // Kopf mit Kapuze
  ctx.fillStyle='#3a6b3a';ctx.beginPath();ctx.arc(0,-14-bob,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3a0055';ctx.beginPath();ctx.arc(0,-16-bob,13,Math.PI,0);ctx.fill();
  px2(-6,-10-bob,4,4,'#cc00ff');px2(2,-10-bob,4,4,'#cc00ff');
  ctx.fillStyle='#111';ctx.fillRect(-5,-5-bob,10,3);
  drawZHPbar(hp,maxHp);ctx.restore();
}
function drawZombieF(sx,sy,sz,hp,maxHp,tick){
  ctx.save();ctx.translate(sx,sy);const s=sz/30;ctx.scale(s,s);
  const stomp=Math.abs(Math.floor(Math.sin(tick*.06)*3));
  const bob=stomp*.5;
  const armSwing=Math.floor(Math.sin(tick*.06)*5);
  if(stomp>1){ctx.fillStyle='rgba(0,0,0,'+stomp*.08+')';ctx.beginPath();ctx.ellipse(0,38,20+stomp*2,4,0,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,33,20,6,0,0,Math.PI*2);ctx.fill();
  px2(-16,14+Math.max(0,Math.floor(Math.sin(tick*.06)*3)),13,22,'#1e4a1e');
  px2(3,14+Math.max(0,Math.floor(Math.sin(tick*.06+Math.PI)*3)),13,22,'#1e4a1e');
  px2(-20,34,14,8,'#111');px2(6,34,14,8,'#111');
  ctx.fillStyle='#1a4a1a';ctx.beginPath();ctx.ellipse(0,2-bob,22,20,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#4a4a4a';ctx.beginPath();ctx.ellipse(0,0-bob,18,14,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#2a2a2a';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#888';
  [[0,-8],[0,8],[-10,0],[10,0]].forEach(function(pos){ctx.beginPath();ctx.arc(pos[0],pos[1]-bob,2,0,Math.PI*2);ctx.fill();});
  px2(-32,-4+armSwing,16,10,'#1a4a1e');px2(16,-4-armSwing,16,10,'#1a4a1e');
  px2(-38,-5+armSwing,8,14,'#2a6a2a');px2(30,-5-armSwing,8,14,'#2a6a2a');
  ctx.fillStyle='#1a4a1a';ctx.beginPath();ctx.arc(0,-22-bob,18,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#333';ctx.beginPath();ctx.arc(0,-24-bob,19,Math.PI,0);ctx.fill();
  ctx.fillStyle='#ff2200';
  ctx.beginPath();ctx.arc(-8,-24-bob,7,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(8,-24-bob,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ff6600';
  ctx.beginPath();ctx.arc(-8,-24-bob,4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(8,-24-bob,4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.fillRect(-12,-18-bob,24,6);
  ctx.fillStyle='#eee';
  [-8,-4,0,4,8].forEach(function(tx2){ctx.fillRect(tx2,-18-bob,3,5);});
  var bw=60;
  ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(-bw/2,36,bw,7);
  ctx.fillStyle=hp/maxHp>.5?'#27ae60':hp/maxHp>.25?'#f39c12':'#c0392b';
  ctx.fillRect(-bw/2,36,bw*(hp/maxHp),7);
  ctx.restore();
}
function drawBoss(sx,sy,hp,maxHp,tick,slamAnim){
  ctx.save();ctx.translate(sx,sy);
  const bob=Math.sin(tick*.07)*2;
  const rage=1-(hp/maxHp); // 0=voll HP, 1=tot
  // Wut-Aura bei niedrigem HP
  if(rage>.5){
    ctx.fillStyle=`rgba(200,0,0,${(rage-.5)*.3})`;
    ctx.beginPath();ctx.arc(0,0,60+(rage-.5)*20,0,Math.PI*2);ctx.fill();
  }
  // Atem-Dampf-Partikel
  const breathPhase=(tick*.08)%1;
  ctx.fillStyle=`rgba(200,230,200,${breathPhase<.5?(breathPhase*2)*.3:(1-breathPhase*2+1)*.3})`;
  ctx.beginPath();ctx.arc(Math.floor(Math.sin(tick*.1)*6),-40-breathPhase*20,4+breathPhase*6,0,Math.PI*2);ctx.fill();
  ctx.translate(0,bob);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,42,28,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2e6b2e';ctx.beginPath();ctx.ellipse(0,5,28,30,0,0,Math.PI*2);ctx.fill();px2(-20,28,16,20,'#2a5a2a');px2(4,28,16,20,'#2a5a2a');px2(-22,46,18,8,'#1a1a1a');px2(4,46,18,8,'#1a1a1a');px2(-38,-2,18,10,'#2e6b2e');px2(-44,-4,10,14,'#3a8a3a');ctx.save();ctx.translate(30,0);ctx.rotate(slamAnim>0?-0.8+slamAnim*1.5:-0.3);px2(0,-4,12,28,'#3a8a3a');ctx.fillStyle='#5a3a1a';ctx.fillRect(-4,-34,20,36);ctx.fillStyle='#6b4a2a';ctx.fillRect(-8,-42,28,14);ctx.restore();ctx.fillStyle='#2e6b2e';ctx.beginPath();ctx.arc(0,-30,22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#cc0000';ctx.beginPath();ctx.arc(-8,-32,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(8,-32,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff6600';ctx.beginPath();ctx.arc(-8,-32,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(8,-32,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(-12,-22,24,5);ctx.fillStyle='#eee';[-8,-4,0,4,8].forEach(tx2=>ctx.fillRect(tx2,-22,3,5));px2(-22,-48,44,18,'#5a7a3a');px2(-18,-52,36,8,'#4a6a2a');px2(-14,-58,28,10,'#3a5a1a');const bw=90;ctx.fillStyle='rgba(0,0,0,.6)';rr(ctx,-bw/2,52,bw,9,3);ctx.fill();ctx.fillStyle='#c0392b';rr(ctx,-bw/2,52,bw*(hp/maxHp),9,3);ctx.fill();ctx.restore();}

function drawHUD(){
  ctx.fillStyle='rgba(5,8,18,.82)';rr(ctx,W/2-250,8,500,36,8);ctx.fill();
  ctx.font='bold 13px Nunito';ctx.textAlign='center';
  const w=curWpn();
  ctx.fillStyle='#c0392b';ctx.fillText('❤ '+Math.max(0,Math.round(G.playerHp))+'/'+G.playerMaxHp,W/2-180,31);
  ctx.fillStyle='#7ecff7';ctx.fillText('Welle '+G.wave,W/2-65,31);
  if(!G.isMP){const lvlDef=LEVELS.find(l=>l.id===selectedLevel)||LEVELS[0];const prog=Math.min(1,levelTimer/lvlDef.survivalGoal);const barW=200,barX=W/2-barW/2;ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(barX,46,barW,4);ctx.fillStyle=levelGoalReached?'#27ae60':'#f7c948';ctx.fillRect(barX,46,barW*prog,4);if(!levelGoalReached){const remaining=Math.max(0,lvlDef.survivalGoal-Math.floor(levelTimer));ctx.fillStyle='rgba(200,200,200,.5)';ctx.font='9px Nunito';ctx.textAlign='center';ctx.fillText('Ziel: '+Math.floor(remaining/60)+'m'+('0'+(remaining%60)).slice(-2)+'s',W/2,56);}}
  ctx.fillStyle='#27ae60';ctx.fillText('☠ '+G.kills,W/2+40,31);
  ctx.fillStyle='#f7c948';ctx.fillText('🪙 '+G.earnedCoins,W/2+135,31);
  const secs=Math.floor(G.gameTime/60);ctx.fillStyle='#9db4c8';ctx.fillText('⏱ '+Math.floor(secs/60)+':'+(secs%60).toString().padStart(2,'0'),W/2+225,31);
  if(w){ctx.fillStyle='rgba(5,8,18,.82)';rr(ctx,W-172,8,160,50,8);ctx.fill();ctx.fillStyle='#f7c948';ctx.font='bold 11px Nunito';ctx.textAlign='left';ctx.fillText(w.icon+' '+w.name,W-162,25);if(w.id==='minigun'){if(w.cooling){ctx.fillStyle='#e74c3c';ctx.fillText('COOLDOWN',W-162,42);}else{ctx.fillStyle='#aaa';ctx.fillText('∞',W-162,42);}}else if(w.reloading){ctx.fillStyle='#e67e22';ctx.fillText('LADEN '+(((1-w.reloadTimer/w.reloadTime)*100)|0)+'%',W-162,42);}else{ctx.fillStyle=w.ammo<=w.maxAmmo*.25?'#e74c3c':'#aaa';ctx.fillText(w.ammo==='999'||w.ammo===999?'∞':w.ammo+'/'+w.maxAmmo,W-162,42);}}
  if(G.bossWarn>0&&Math.floor(G.bossWarn/8)%2===0){document.getElementById('boss-warn').style.display='block';}else{document.getElementById('boss-warn').style.display='none';}
  const tgt=nearestEnemy(G.px,G.py,(curWpn()||{range:300}).range||300);if(tgt){const tsx=tgt.x-G.camX,tsy=tgt.y-G.camY;ctx.strokeStyle='rgba(247,80,50,.5)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(mouse.x,mouse.y);ctx.lineTo(tsx,tsy);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='rgba(247,80,50,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(tsx,tsy,tgt.size+6,0,Math.PI*2);ctx.stroke();}
  ctx.strokeStyle='rgba(247,201,72,.9)';ctx.lineWidth=1.5;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(mouse.x-10,mouse.y);ctx.lineTo(mouse.x-4,mouse.y);ctx.stroke();ctx.beginPath();ctx.moveTo(mouse.x+4,mouse.y);ctx.lineTo(mouse.x+10,mouse.y);ctx.stroke();ctx.beginPath();ctx.moveTo(mouse.x,mouse.y-10);ctx.lineTo(mouse.x,mouse.y-4);ctx.stroke();ctx.beginPath();ctx.moveTo(mouse.x,mouse.y+4);ctx.lineTo(mouse.x,mouse.y+10);ctx.stroke();ctx.strokeStyle='rgba(247,201,72,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(mouse.x,mouse.y,5,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='rgba(150,170,190,.45)';ctx.font='10px Nunito';ctx.textAlign='left';ctx.fillText('[ESC] Pause  [R] Reload  [1-8] Waffe  [Shift] Dash',8,H-8);
  const abn=document.getElementById('ab-name');if(abn)abn.textContent=currentUser?.username||'';
  const abc=document.getElementById('ab-coins');if(abc)abc.textContent=((G.earnedCoins||0)+(currentUser?.coins||0)).toLocaleString();
}
