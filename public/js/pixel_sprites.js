// ═══════════════════════════════════════════════════════
//  ZOMBIEWAVE V5 – PIXEL SPRITE SYSTEM
//  Animierte Pixel-Designs für alle Charaktere und Klassen.
//  Wird von renderCharactersShop() und renderClassesShop() genutzt.
//
//  EINBINDUNG in index.html (vor game.js):
//    <script src="/js/pixel_sprites.js"></script>
//
//  VERWENDUNG:
//    const anim = spawnSpriteCanvas(containerId, charId, 3);
//    // später aufräumen:
//    anim.stop();
// ═══════════════════════════════════════════════════════

// ── Globaler Animations-Manager ─────────────────────────
const SPRITE_ANIMS = new Map(); // containerId -> { rafId, stop }

/**
 * Erzeugt ein animiertes Pixel-Canvas in einem Container-Element.
 * @param {string|HTMLElement} container  - ID oder DOM-Element
 * @param {string}             spriteId   - Charakter- oder Klassen-ID
 * @param {number}             [scale=3]  - Pixel-Scale (1px = scale×scale CSS-px)
 * @returns {{ canvas, stop }}
 */
function spawnSpriteCanvas(container, spriteId, scale = 3) {
  const wrap = typeof container === 'string'
    ? document.getElementById(container)
    : container;
  if (!wrap) return { canvas: null, stop: () => {} };

  // Alten Anim-Loop für diesen Container stoppen
  const key = wrap.id || spriteId;
  if (SPRITE_ANIMS.has(key)) SPRITE_ANIMS.get(key).stop();

  const W = 24, H = 28; // native Pixel-Dimensionen
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  canvas.style.width           = (W * scale) + 'px';
  canvas.style.height          = (H * scale) + 'px';
  canvas.style.imageRendering  = 'pixelated';
  canvas.style.imageRendering  = 'crisp-edges';
  canvas.style.display         = 'block';
  wrap.innerHTML = '';
  wrap.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const drawFn = SPRITE_DRAW[spriteId] || SPRITE_DRAW['ghost'];
  let tick = 0;
  let rafId;

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawFn(ctx, tick++);
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    SPRITE_ANIMS.delete(key);
  }

  loop();
  SPRITE_ANIMS.set(key, { stop });
  return { canvas, stop };
}

// ── Pixel-Helper ─────────────────────────────────────────
function px(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

// ═══════════════════════════════════════════════════════
//  CHARAKTER-SPRITES
// ═══════════════════════════════════════════════════════

const SPRITE_DRAW = {

  // ── Ghost ──────────────────────────────────────────────
  ghost(ctx, t) {
    const bob = Math.sin(t * 0.08) * 2;
    const b   = Math.floor(bob);
    px(ctx, 4, 12 + b, 16, 2, '#e8f8ff');
    px(ctx, 2, 10 + b, 20, 14, '#b8eaff');
    px(ctx, 0, 16 + b, 24, 8,  '#7ecff7');
    // Schlieren-Enden
    px(ctx, 2,  24 + b, 4, 4, '#7ecff7');
    px(ctx, 10, 26 + b, 4, 2, '#7ecff7');
    px(ctx, 18, 24 + b, 4, 4, '#7ecff7');
    // Augen
    px(ctx, 6, 14 + b, 4, 4, '#0a2040');
    px(ctx, 14, 14 + b, 4, 4, '#0a2040');
    px(ctx, 6, 15 + b, 2, 2, '#fff');
    px(ctx, 14, 15 + b, 2, 2, '#fff');
    // Transparenz-Pulsieren
    const a = 0.25 + 0.15 * Math.sin(t * 0.05);
    ctx.globalAlpha = a;
    px(ctx, 0, 10 + b, 24, 20, '#7ecff7');
    ctx.globalAlpha = 1;
  },

  // ── Tank ───────────────────────────────────────────────
  tank(ctx, t) {
    const walk = Math.floor(Math.sin(t * 0.05) * 1.5);
    // Beine
    px(ctx, 2,  20 + walk, 8, 6, '#5a5a5a');
    px(ctx, 14, 20 - walk, 8, 6, '#5a5a5a');
    px(ctx, 2,  24, 8, 4, '#4a4a4a');
    px(ctx, 14, 24, 8, 4, '#4a4a4a');
    // Körper / Panzerung
    px(ctx, 0, 6,  24, 16, '#7a7a7a');
    px(ctx, 0, 6,  24, 4,  '#8a8a8a');
    px(ctx, 4, 4,  16, 4,  '#6a6a6a');
    // Schulter-Platten
    px(ctx, -2, 8,  4, 10, '#888');
    px(ctx, 22, 8,  4, 10, '#888');
    // Bolzen
    px(ctx, 4, 8,  2, 2, '#aaa');
    px(ctx, 18, 8, 2, 2, '#aaa');
    px(ctx, 4, 16, 2, 2, '#aaa');
    px(ctx, 18, 16, 2, 2, '#aaa');
    // Visier
    px(ctx, 6, 8,  4, 4, '#2a3a50');
    px(ctx, 14, 8, 4, 4, '#2a3a50');
    // Helm
    px(ctx, 4, 4,  16, 4, '#6a6a6a');
    px(ctx, 8, 2,  8,  4, '#555');
    px(ctx, 8, 0,  8,  2, '#f7c948');
    // Gürtel-Detail
    px(ctx, 2, 20, 20, 2, '#666');
  },

  // ── Hunter ─────────────────────────────────────────────
  hunter(ctx, t) {
    const aim   = Math.sin(t * 0.07);
    const aimY  = Math.floor(aim);
    // Beine
    px(ctx, 8, 20, 4, 8, '#5a3a1a');
    px(ctx, 12, 20, 4, 8, '#5a3a1a');
    // Körper
    px(ctx, 6, 14, 12, 8, '#7a5a2a');
    px(ctx, 4, 8,  16, 8, '#8b6a30');
    // Gewehr
    px(ctx, 18, 10 + aimY, 10, 3, '#4a3a2a');
    px(ctx, 16, 10 + aimY, 4,  3, '#6a5a3a');
    px(ctx, 26, 10 + aimY, 2,  1, '#888');
    // Arme
    px(ctx, 2, 12, 4, 6, '#7a5a2a');
    px(ctx, 18, 12, 4, 6, '#7a5a2a');
    // Schulter-Pad
    px(ctx, 4, 6, 16, 4, '#7a5a20');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 8, 5,  2,  2, '#1a0a00');
    px(ctx, 14, 5, 2,  2, '#1a0a00');
    // Hut
    px(ctx, 6, 0,  12, 3, '#e67e22');
    px(ctx, 4, 0,  2,  4, '#e67e22');
    px(ctx, 18, 0, 2,  4, '#e67e22');
    // Zielvisier-Effekt
    if (Math.floor(t / 8) % 3 === 0) {
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth   = 0.5;
      ctx.beginPath();
      ctx.arc(22, 10 + aimY, 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  },

  // ── Brawler ────────────────────────────────────────────
  brawler(ctx, t) {
    const punch = Math.abs(Math.sin(t * 0.06)) * 3;
    const pY    = Math.floor(punch);
    // Beine
    px(ctx, 8, 20, 4, 8, '#3d5a8a');
    px(ctx, 12, 20, 4, 8, '#3d5a8a');
    // Körper
    px(ctx, 6, 14, 12, 8, '#4a5a9a');
    px(ctx, 4, 8,  16, 8, '#5a6aaa');
    // Arme – einer schlägt vor, einer zurück
    px(ctx, 2, 14, 4, 6, '#5a7aaa');
    px(ctx, 18, 14, 4, 6, '#5a7aaa');
    // Fäuste
    px(ctx, -2, 13 + pY, 4, 4, '#f7c948');
    px(ctx, 22, 13 - pY, 4, 4, '#f7c948');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 8, 5,  2,  2, '#1a0a00');
    px(ctx, 14, 5, 2,  2, '#1a0a00');
    // Stirnband
    px(ctx, 4, 4,  16, 2, '#f7c948');
    // Narbe
    px(ctx, 10, 6, 2, 4, '#a0603a');
  },

  // ── Berserker ──────────────────────────────────────────
  berserker(ctx, t) {
    const rage     = 0.4 + 0.5 * Math.sin(t * 0.12);
    const axeSwing = Math.floor(Math.sin(t * 0.1) * 4);
    // Beine
    px(ctx, 8, 20, 4, 8, '#5a1a1a');
    px(ctx, 12, 20, 4, 8, '#5a1a1a');
    // Körper
    px(ctx, 4, 14, 16, 8, '#7a2020');
    px(ctx, 4, 8,  16, 8, '#8a2a2a');
    // Arme
    px(ctx, 0, 12, 4, 10, '#8a2a2a');
    px(ctx, 20, 12, 4, 10, '#8a2a2a');
    // Axt
    px(ctx, -4, 4 + axeSwing, 2, 14, '#666');
    px(ctx, -6, 4 + axeSwing, 4,  6, '#aaa');
    px(ctx, -6, 2 + axeSwing, 4,  4, '#ccc');
    px(ctx, -8, 4 + axeSwing, 2,  6, '#ddd');
    // Axt-Blut
    px(ctx, -8, 4 + axeSwing, 2, 2, '#c0392b');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 8, 5,  2,  2, '#ff4444');
    px(ctx, 14, 5, 2,  2, '#ff4444');
    // Wut-Adern
    px(ctx, 6,  6, 2, 2, '#ff6600');
    px(ctx, 16, 6, 2, 2, '#ff6600');
    // Wut-Aura pulsiert
    ctx.globalAlpha = rage * 0.5;
    px(ctx, 0, 0, 24, 28, '#ff000022');
    ctx.globalAlpha = 1;
    // Helm-Hörner
    px(ctx, 6, 2,  2, 4, '#c0392b');
    px(ctx, 16, 2, 2, 4, '#c0392b');
    px(ctx, 4, 0,  4, 2, '#c0392b');
    px(ctx, 16, 0, 4, 2, '#c0392b');
  },

  // ── Sentinel ───────────────────────────────────────────
  sentinel(ctx, t) {
    const shieldPulse = Math.floor(Math.sin(t * 0.07) * 1);
    const sp          = shieldPulse;
    // Beine
    px(ctx, 8, 20, 4, 8, '#4a1a6a');
    px(ctx, 12, 20, 4, 8, '#4a1a6a');
    // Körper
    px(ctx, 6, 14, 12, 8, '#5a2a7a');
    px(ctx, 4, 8,  16, 8, '#6a3a8a');
    // Arm
    px(ctx, 20, 10, 4, 8, '#6a3a8a');
    // Schild
    px(ctx, -2, 6 + sp, 6, 16, '#7a4a9a');
    px(ctx, -2, 6 + sp, 6, 2,  '#9a6aaa');
    px(ctx, -2, 6 + sp, 2, 16, '#9a6aaa');
    px(ctx,  0, 8 + sp, 2, 12, '#fff3');
    // Schild-Zier
    px(ctx, -1, 13 + sp, 4, 2, '#d4a0ff');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 8, 5,  2,  2, '#1a0a00');
    px(ctx, 14, 5, 2,  2, '#1a0a00');
    // Helm
    px(ctx, 6, 2,  12, 4, '#8e44ad');
    px(ctx, 4, 2,  2,  6, '#8e44ad');
    px(ctx, 18, 2, 2,  6, '#8e44ad');
    // Schild-Puls-Aura
    ctx.globalAlpha = 0.25 + sp * 0.1;
    ctx.strokeStyle = '#8e44ad';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(12, 14, 14 + sp, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  },

  // ── Reaper ─────────────────────────────────────────────
  reaper(ctx, t) {
    const scytheSpin = t * 0.07;
    const sx = Math.floor(Math.cos(scytheSpin) * 5) + 5;
    const sy = Math.floor(Math.sin(scytheSpin) * 2);
    // Beine (Umhang-unten)
    px(ctx, 6, 20, 12, 8, '#1a0a0a');
    // Körper / Umhang
    px(ctx, 4, 8,  16, 14, '#2a0a0a');
    px(ctx, 2, 10, 20, 10, '#220a0a');
    px(ctx, 0, 14, 24, 6,  '#1a0808');
    // Arme
    px(ctx, 2, 12, 4, 8, '#2a0a0a');
    px(ctx, 18, 12, 4, 8, '#2a0a0a');
    // Sense
    px(ctx, sx, 2 + sy,   2, 16, '#666');
    px(ctx, sx - 4, 2 + sy, 8,  2, '#aaa');
    px(ctx, sx - 6, 0 + sy, 10, 4, '#888');
    px(ctx, sx - 8, 0 + sy, 2,  3, '#bbb');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 8, 5,  2,  2, '#ff0000');
    px(ctx, 14, 5, 2,  2, '#ff0000');
    // Kapuze
    px(ctx, 4, 0,  16, 6, '#1a0a0a');
    px(ctx, 6, 0,  12, 2, '#2a1a1a');
    // Dunkle Aura
    ctx.globalAlpha = 0.35;
    px(ctx, 0, 0, 24, 28, '#8b000022');
    ctx.globalAlpha = 1;
  },

  // ── Ninja ──────────────────────────────────────────────
  ninja(ctx, t) {
    const dash  = Math.abs(Math.sin(t * 0.1));
    const trail = Math.floor(dash * 8);
    // Dash-Trail
    ctx.globalAlpha = 0.22;
    px(ctx, 4 - trail,     6, 16, 20, '#1abc9c');
    ctx.globalAlpha = 0.12;
    px(ctx, 4 - trail * 2, 8, 14, 16, '#1abc9c');
    ctx.globalAlpha = 1;
    // Beine
    px(ctx, 8, 20, 4, 8, '#1a1a1a');
    px(ctx, 12, 20, 4, 8, '#1a1a1a');
    // Körper
    px(ctx, 6, 14, 12, 8, '#222');
    px(ctx, 4, 8,  16, 8, '#2a2a2a');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    // Masken-Streifen
    px(ctx, 4, 4,  2,  6, '#1abc9c');
    px(ctx, 18, 4, 2,  6, '#1abc9c');
    px(ctx, 6, 2,  12, 3, '#1abc9c');
    // Augen
    px(ctx, 8, 5,  2, 2, '#1a0a00');
    px(ctx, 14, 5, 2, 2, '#1a0a00');
    // Schulter-Schnüre
    px(ctx, 2, 10, 4, 2, '#1abc9c');
    // Shuriken fliegend
    const sa = t * 0.18;
    const shx = Math.floor(12 + Math.cos(sa) * 10);
    const shy = Math.floor(10 + Math.sin(sa) * 4);
    ctx.save();
    ctx.translate(shx, shy);
    ctx.rotate(sa * 2);
    px(ctx, -2, -1, 4, 2, '#1abc9c');
    px(ctx, -1, -2, 2, 4, '#1abc9c');
    ctx.restore();
  },

  // ── Guardian ───────────────────────────────────────────
  guardian(ctx, t) {
    const regen = Math.floor(Math.sin(t * 0.05) * 1.5);
    // Beine
    px(ctx, 8,  20 + regen, 4, 8, '#1a4a2a');
    px(ctx, 12, 20 + regen, 4, 8, '#1a4a2a');
    // Körper
    px(ctx, 6, 14, 12, 8, '#1a5a2a');
    px(ctx, 4, 8,  16, 8, '#1a6a2a');
    // Schulter-Platten
    px(ctx, -2, 10, 4, 8, '#1a5a2a');
    px(ctx, 22, 10, 4, 8, '#1a5a2a');
    // Brustplatten-Kreuz
    px(ctx, 10, 8, 4, 8, '#27ae60');
    px(ctx, 6, 12, 12, 4, '#27ae60');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 8, 5,  2,  2, '#1a0a00');
    px(ctx, 14, 5, 2,  2, '#1a0a00');
    // Helm
    px(ctx, 6, 2,  12, 4, '#27ae60');
    px(ctx, 4, 0,  16, 2, '#27ae60');
    // rotierende Klingen-Wächter
    const ga = t * 0.06;
    for (let i = 0; i < 3; i++) {
      const a  = ga + i * (Math.PI * 2 / 3);
      const gx = Math.floor(12 + Math.cos(a) * 12);
      const gy = Math.floor(14 + Math.sin(a) * 8);
      px(ctx, gx, gy, 3, 3, '#27ae60');
      px(ctx, gx + 1, gy + 1, 1, 1, '#6aea90');
    }
    // Regen-Aura pulsiert
    ctx.globalAlpha = 0.2 + 0.1 * Math.sin(t * 0.08);
    px(ctx, 0, 0, 24, 28, '#27ae6020');
    ctx.globalAlpha = 1;
  },

  // ── Juggernaut ─────────────────────────────────────────
  juggernaut(ctx, t) {
    const stomp = Math.abs(Math.floor(Math.sin(t * 0.04) * 2));
    // Beine – massiv
    px(ctx, 2,  22 + stomp, 10, 6, '#5a5a5a');
    px(ctx, 12, 22 + stomp, 10, 6, '#5a5a5a');
    // Rüstungs-Körper
    px(ctx, 0, 10, 24, 14, '#7a6a4a');
    px(ctx, 0, 8,  24, 4,  '#8a7a5a');
    px(ctx, 0, 8,  24, 2,  '#9a8a6a');
    // Schultern – übergroß
    px(ctx, -4, 8,  6, 14, '#6a5a3a');
    px(ctx, 22, 8,  6, 14, '#6a5a3a');
    px(ctx, -6, 10, 4, 10, '#5a4a2a');
    px(ctx, 24, 10, 4, 10, '#5a4a2a');
    // Bolzen / Ziernieten
    px(ctx, 0, 10, 2, 2, '#aaa');
    px(ctx, 22, 10, 2, 2, '#aaa');
    px(ctx, 0, 18, 2, 2, '#aaa');
    px(ctx, 22, 18, 2, 2, '#aaa');
    // Kopf
    px(ctx, 4, 4,  16, 6, '#8a7a5a');
    px(ctx, 6, 2,  12, 4, '#c8884a');
    px(ctx, 8, 3,  2,  2, '#1a0a00');
    px(ctx, 14, 3, 2,  2, '#1a0a00');
    // Gold-Akzent Linie
    px(ctx, 0, 8,  24, 2, '#d4a017');
    px(ctx, 2, 20, 20, 2, '#d4a01788');
    // Boden-Stomp-Effekt
    if (stomp > 0) {
      ctx.globalAlpha = stomp * 0.3;
      ctx.strokeStyle = '#d4a017';
      ctx.lineWidth   = 0.5;
      ctx.beginPath();
      ctx.ellipse(12, 28, 10 + stomp * 2, 3, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  },

  // ── Troll ──────────────────────────────────────────────
  troll(ctx, t) {
    const wobble = Math.floor(Math.sin(t * 0.14) * 3);
    const blink  = (t % 40 < 3);
    // Körper (chaotisch)
    px(ctx, 4, 18,     16, 10, '#ff69b4');
    px(ctx, 2, 14 + wobble, 20, 6, '#ff1493');
    px(ctx, 0, 16,     24, 4,  '#ff69b4');
    // Arme wild
    px(ctx, -4, 14 + wobble, 6, 4, '#ff69b4');
    px(ctx, 22, 14 - wobble, 6, 4, '#ff69b4');
    // Kopf
    px(ctx, 4, 4,  16, 6, '#c8884a');
    // Augen
    if (!blink) {
      px(ctx, 6, 5,  4, 4, '#ff0000');
      px(ctx, 14, 5, 4, 4, '#ff0000');
      px(ctx, 6, 5,  2, 2, '#ffff00');
      px(ctx, 14, 5, 2, 2, '#ffff00');
    }
    // Mund Grinsen
    px(ctx, 8, 8,  2, 2, '#fff');
    px(ctx, 10, 8, 2, 2, '#ff69b4');
    px(ctx, 12, 8, 2, 2, '#fff');
    px(ctx, 14, 8, 2, 2, '#ff69b4');
    px(ctx, 16, 8, 2, 2, '#fff');
    // Haare/Krone (chaotisch)
    px(ctx, 4,  0, 4, 6, '#ff1493');
    px(ctx, 10, 0, 4, 4, '#ff69b4');
    px(ctx, 16, 0, 4, 6, '#ff1493');
    // Glitzer-Effekt
    ctx.globalAlpha = 0.5 + 0.4 * Math.sin(t * 0.18);
    px(ctx, 0, 0, 24, 28, '#ff69b420');
    ctx.globalAlpha = 1;
    // Geld-Symbol
    const coin = (Math.floor(t / 15) % 8) < 4;
    if (coin) {
      ctx.fillStyle = '#f7c948';
      ctx.font      = '4px monospace';
      ctx.fillText('$', 10, 16);
    }
  },

  // ═══════════════════════════════════════════════════════
  //  KLASSEN-SPRITES
  // ═══════════════════════════════════════════════════════

  // ── Vampir ─────────────────────────────────────────────
  vampire(ctx, t) {
    const cape = Math.floor(Math.sin(t * 0.07) * 2);
    // Beine
    px(ctx, 8, 20, 4, 8, '#2a0a0a');
    px(ctx, 12, 20, 4, 8, '#2a0a0a');
    // Umhang-Flügel
    px(ctx, 2, 14,        4, 10 + cape, '#1a0808');
    px(ctx, 18, 14,       4, 10 - cape, '#1a0808');
    px(ctx, 0, 18 + cape, 6, 8, '#110606');
    px(ctx, 18, 18 - cape, 6, 8, '#110606');
    // Körper
    px(ctx, 4, 12, 16, 10, '#3a0a0a');
    px(ctx, 4, 8,  16, 6,  '#4a0a0a');
    // Weißes Hemd
    px(ctx, 8, 12, 8, 6, '#e8e8e8');
    px(ctx, 10, 10, 4, 4, '#fff');
    // Kragen
    px(ctx, 4, 8,  6, 4, '#fff');
    px(ctx, 14, 8, 6, 4, '#fff');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#d4a0a0');
    px(ctx, 8, 5,  2,  2, '#8b0000');
    px(ctx, 14, 5, 2,  2, '#8b0000');
    // Zähne
    px(ctx, 9, 8, 2, 2, '#fff');
    px(ctx, 13, 8, 2, 2, '#fff');
    // Haar
    px(ctx, 4, 0,  16, 6, '#1a0a0a');
    px(ctx, 2, 2,  4,  4, '#1a0a0a');
    px(ctx, 18, 2, 4,  4, '#1a0a0a');
    // Blut-Tropfen
    const dropProgress = (t % 60) / 60;
    const dropY        = Math.floor(dropProgress * 12);
    if (dropY < 10) {
      ctx.globalAlpha = 1 - dropProgress;
      px(ctx, 12, 12 + dropY, 2, 2, '#cc0000');
      ctx.globalAlpha = 1;
    }
    // Rote Aura
    ctx.globalAlpha = 0.15 + 0.1 * Math.sin(t * 0.1);
    px(ctx, 0, 0, 24, 28, '#8b000015');
    ctx.globalAlpha = 1;
  },

  // ── Medic ──────────────────────────────────────────────
  medic(ctx, t) {
    // Beine
    px(ctx, 8,  20, 4, 8, '#1a3a2a');
    px(ctx, 12, 20, 4, 8, '#1a3a2a');
    // Körper
    px(ctx, 4, 8,  16, 14, '#ffffff');
    px(ctx, 4, 8,  2,  14, '#e0e0e0');
    px(ctx, 18, 8, 2,  14, '#e0e0e0');
    // Arme
    px(ctx, -2, 10, 6, 8, '#1a3a2a');
    px(ctx, 20, 10, 6, 8, '#1a3a2a');
    // Rotes Kreuz – pulsiert
    const pulse = 0.7 + 0.3 * Math.sin(t * 0.1);
    ctx.globalAlpha = pulse;
    px(ctx, 10, 8,  4, 12, '#e74c3c');
    px(ctx, 6, 12,  12, 4, '#e74c3c');
    ctx.globalAlpha = 1;
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 8, 5,  2,  2, '#1a0a00');
    px(ctx, 14, 5, 2,  2, '#1a0a00');
    // Haube
    px(ctx, 6, 2,  12, 4, '#fff');
    px(ctx, 4, 0,  16, 2, '#e0e0e0');
    // Heilpuls-Ring
    const hp = (t % 90) / 90;
    ctx.globalAlpha = (1 - hp) * 0.6;
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth   = 0.5;
    ctx.beginPath();
    ctx.arc(12, 14, 6 + hp * 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  },

  // ── Schatten ───────────────────────────────────────────
  shadow(ctx, t) {
    const invis = 0.45 + 0.45 * Math.sin(t * 0.05);
    ctx.globalAlpha = invis;
    // Beine
    px(ctx, 8,  20, 4, 8, '#1a1a2a');
    px(ctx, 12, 20, 4, 8, '#1a1a2a');
    // Körper
    px(ctx, 4, 8,  16, 14, '#1a2a4a');
    // Kapuze
    px(ctx, 4, 0,  16, 10, '#2c3e50');
    px(ctx, 2, 2,  4,  8,  '#2c3e50');
    px(ctx, 18, 2, 4,  8,  '#2c3e50');
    // Augen – glühend
    px(ctx, 8, 5,  2, 2, '#3498db');
    px(ctx, 14, 5, 2, 2, '#3498db');
    ctx.globalAlpha = 1;
    // Partikel-Schleier
    for (let i = 0; i < 6; i++) {
      const sa  = (t * 0.04 + i * 1.05) % 1;
      const spx = Math.floor(12 + Math.cos(sa * Math.PI * 2) * 12);
      const spy = Math.floor(14 + Math.sin(sa * Math.PI * 2) * 8);
      ctx.globalAlpha = sa * 0.55;
      px(ctx, spx, spy, 2, 2, '#2c3e50');
    }
    ctx.globalAlpha = 1;
  },

  // ── Ingenieur ──────────────────────────────────────────
  engineer(ctx, t) {
    // Beine
    px(ctx, 8,  20, 4, 8, '#5a4a1a');
    px(ctx, 12, 20, 4, 8, '#5a4a1a');
    // Körper
    px(ctx, 4, 8,  16, 14, '#7a6a3a');
    // Werkzeug-Gürtel
    px(ctx, 4, 18, 16, 2, '#5a4a2a');
    px(ctx, 6, 18, 2,  2, '#aaa');
    px(ctx, 10, 18, 2, 2, '#aaa');
    px(ctx, 14, 18, 2, 2, '#aaa');
    px(ctx, 18, 18, 2, 2, '#aaa');
    // Arm + Schraubenschlüssel
    px(ctx, 20, 12, 4, 8, '#8a7a4a');
    const wa = Math.floor(Math.sin(t * 0.08) * 3);
    px(ctx, 22, 8 + wa,  4, 2, '#aaa');
    px(ctx, 20, 6 + wa,  6, 2, '#888');
    px(ctx, 22, 10 + wa, 2, 4, '#999');
    // Kopf
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 8, 5,  2,  2, '#1a0a00');
    px(ctx, 14, 5, 2,  2, '#1a0a00');
    // Helm + Brille
    px(ctx, 4, 2,  16, 4, '#e67e22');
    px(ctx, 6, 4,  4,  2, '#2980b9');
    px(ctx, 12, 4, 4,  2, '#2980b9');
    px(ctx, 10, 4, 2,  2, '#1a3a5a');
    // Kleiner Turret-Schatten
    const ta = t * 0.05;
    const tx = Math.floor(4 + Math.cos(ta) * 2);
    px(ctx, -4 + tx, 16, 6, 6, '#666');
    px(ctx, -5 + tx, 17, 8, 2, '#888');
    px(ctx, -7 + tx, 18, 4, 2, '#555');
  },

  // ── Pyro ───────────────────────────────────────────────
  pyro(ctx, t) {
    const flicker = Math.random() * 0.3 + 0.7;
    // Beine
    px(ctx, 8,  20, 4, 8, '#3a1a0a');
    px(ctx, 12, 20, 4, 8, '#3a1a0a');
    // Körper – Schutzanzug
    px(ctx, 4, 8,  16, 14, '#5a3a1a');
    px(ctx, 2, 10, 4,  10, '#6a4a2a');
    px(ctx, 18, 10, 4, 10, '#6a4a2a');
    // Feuer-Maske
    px(ctx, 6, 4,  12, 6, '#c8884a');
    px(ctx, 4, 2,  2,  6, '#3a1a0a');
    px(ctx, 18, 2, 2,  6, '#3a1a0a');
    px(ctx, 6, 2,  12, 2, '#3a1a0a');
    px(ctx, 8, 4,  2,  2, '#ff4400');
    px(ctx, 14, 4, 2,  2, '#ff4400');
    // Flammenwerfer
    px(ctx, 18, 14, 8, 3, '#666');
    px(ctx, 24, 14, 2, 3, '#888');
    // Flammen pulsieren
    ctx.globalAlpha = flicker;
    px(ctx, 24, 10, 4, 6, '#ff6600');
    px(ctx, 26, 8,  4, 4, '#ff8800');
    px(ctx, 28, 6,  2, 4, '#ffaa00');
    // Ember-Partikel
    for (let i = 0; i < 8; i++) {
      const fa  = t * 0.14 + i * 0.78;
      const efx = Math.floor(26 + Math.cos(fa) * (3 + Math.random() * 8));
      const efy = Math.floor(12 - Math.random() * 14);
      ctx.globalAlpha = Math.random() * 0.8;
      const fc = ['#ff6600','#ff4400','#ffaa00','#ffcc00','#ff8800'];
      px(ctx, efx, efy, 2, 2, fc[Math.floor(Math.random() * fc.length)]);
    }
    ctx.globalAlpha = 1;
  },
};

// ── Patch: renderCharactersShop & renderClassesShop ──────
// Überschreibt die Karten so, dass das animierte Sprite-Canvas
// statt dem Emoji-Icon angezeigt wird.
// Diese Funktion wird einmal beim Laden aufgerufen.
(function patchShopRenderers() {

  function injectSprite(card, spriteId, charColor) {
    const iconDiv = card.querySelector('.char-icon, .class-icon');
    if (!iconDiv) return;
    iconDiv.textContent = '';
    iconDiv.style.cssText = `
      display:flex;align-items:center;justify-content:center;
      height:56px;margin-bottom:.2rem;
    `;
    const canvasId = 'sprite-' + spriteId + '-' + Math.random().toString(36).slice(2, 7);
    const wrap     = document.createElement('div');
    wrap.id        = canvasId;
    iconDiv.appendChild(wrap);
    // kleiner Delay damit DOM fertig ist
    requestAnimationFrame(() => spawnSpriteCanvas(wrap, spriteId, 2));
  }

  // Patche MutationObserver auf die Shop-Grids
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (!node.querySelectorAll) return;
        // Char-Cards
        node.querySelectorAll
          ? [node, ...node.querySelectorAll('.char-card, .class-card')].forEach(card => {
              if (card.dataset.spriteInjected) return;
              const id = card.querySelector('.char-icon, .class-icon');
              if (!id) return;
              // ID aus data-charId/data-classId oder aus der card selbst
              const spriteId = card.dataset.charId || card.dataset.classId;
              if (!spriteId) return;
              card.dataset.spriteInjected = '1';
              injectSprite(card, spriteId, null);
            })
          : null;
      });
    });
  });

  // Warte bis DOM bereit
  window.addEventListener('load', () => {
    const grids = ['shop-chars-grid', 'shop-classes-grid'];
    grids.forEach(gId => {
      const el = document.getElementById(gId);
      if (el) observer.observe(el, { childList: true, subtree: true });
    });
  });

})();

// ── Hilfsfunktion: Detail-Sprite (groß, 4× Scale) ────────
/**
 * Rendert das große Sprite im Charakter-Detail-Bereich.
 * Aufruf z.B. bei Hover oder Klick auf eine Karte.
 */
function showDetailSprite(containerId, spriteId) {
  spawnSpriteCanvas(containerId, spriteId, 4);
}

// ── NEUE WAFFEN-SPRITES ────────────────────────────────────
SPRITE_DRAW['crossbow'] = function(ctx, t) {
  const tension = Math.abs(Math.sin(t * .05)) * 3;
  // Schaft
  px(ctx, 0, 12, 24, 5, '#5a3a1a'); px(ctx, 1, 13, 22, 3, '#6a4a2a');
  // Bogen
  ctx.strokeStyle = '#4a6a4a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(20, 14, 10, -.6, .6); ctx.stroke();
  // Sehne (gespannt, bewegt sich)
  ctx.strokeStyle = '#c8a060'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(20, 7 + tension); ctx.lineTo(26, 14); ctx.lineTo(20, 21 - tension); ctx.stroke();
  // Bolzen
  px(ctx, 14, 13, 8, 2, '#8b6914'); px(ctx, 20, 12, 3, 4, '#c0392b');
  // Abzug
  px(ctx, 10, 14, 2, 5, '#2c2c2c');
  // Scope
  px(ctx, 6, 11, 8, 3, '#1a1a1a'); px(ctx, 7, 12, 6, 1, 'rgba(150,220,255,.5)');
};

SPRITE_DRAW['flamethrower'] = function(ctx, t) {
  const flicker = Math.random() * .3 + .7;
  // Tank (Rücken)
  px(ctx, 0, 8, 10, 14, '#666'); px(ctx, 1, 9, 8, 12, '#777'); px(ctx, 3, 7, 4, 2, '#555');
  // Verbindungsrohr
  px(ctx, 9, 12, 6, 4, '#555');
  // Lauf
  px(ctx, 14, 11, 14, 6, '#444'); px(ctx, 26, 12, 2, 4, '#333');
  // Griff
  px(ctx, 12, 15, 4, 7, '#3a3a3a');
  // Flammen (pulsierend)
  ctx.globalAlpha = flicker;
  px(ctx, 28, 10, 4, 8, '#ff6600');
  px(ctx, 30, 8, 4, 4, '#ff8800');
  px(ctx, 32, 6, 2, 4, '#ffaa00');
  // Funken
  for (let i = 0; i < 6; i++) {
    const fa = t * .15 + i * 1.05;
    const efx = Math.floor(28 + Math.cos(fa) * (3 + Math.random() * 8));
    const efy = Math.floor(12 - Math.random() * 14);
    ctx.globalAlpha = Math.random() * .8;
    const fc = ['#ff6600','#ff4400','#ffaa00','#ffcc00'];
    px(ctx, efx, efy, 2, 2, fc[Math.floor(Math.random() * fc.length)]);
  }
  ctx.globalAlpha = 1;
};

SPRITE_DRAW['grenade'] = function(ctx, t) {
  const spin = t * .06; const b = Math.floor(Math.sin(t * .04));
  // Körper
  px(ctx, 2, 10 + b, 20, 8, '#3a5a2a'); px(ctx, 3, 11 + b, 18, 6, '#4a6a3a');
  // Rotierende Trommel
  ctx.save(); ctx.translate(10, 14 + b);
  for (let i = 0; i < 6; i++) {
    const a = spin + i * (Math.PI / 3);
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath(); ctx.arc(Math.cos(a) * 4, Math.sin(a) * 4, 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // Lauf
  px(ctx, 21, 11 + b, 8, 6, '#2a3a1a'); px(ctx, 27, 12 + b, 3, 4, '#888');
  // Griff
  px(ctx, 14, 16 + b, 4, 7, '#2c2c2c');
  // Visier
  px(ctx, 3, 10 + b, 2, 2, '#888'); px(ctx, 22, 10 + b, 1, 2, '#888');
};

// ── STANDARD-SPIELER (Default-Character animiert) ─────────
SPRITE_DRAW['player'] = function(ctx, t) {
  const run = Math.floor(Math.sin(t * .35) * 2.4);
  const bob = Math.floor(Math.abs(Math.sin(t * .35)) * 1.6);
  // Schatten
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath();
  ctx.ellipse(12, 26, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
  // Beine (laufend)
  px(ctx, 6, 16 + Math.max(0, run), 5, 8 - Math.max(0, run), '#3d3d8a');
  px(ctx, 13, 16 + Math.max(0, -run), 5, 8 - Math.max(0, -run), '#3d3d8a');
  px(ctx, 5, 23 + Math.max(0, run), 6, 3, '#1a1a1a');
  px(ctx, 13, 23 + Math.max(0, -run), 6, 3, '#1a1a1a');
  // Körper
  px(ctx, 4, 9 - bob * .3, 16, 9, '#4a4aaa');
  px(ctx, 4, 9 - bob * .3, 16, 3, '#5a5abb');
  // Arme (schwingen)
  px(ctx, 1, 11 + Math.max(0, run), 4, 6, '#4a4aaa');
  px(ctx, 19, 11 + Math.max(0, -run), 4, 6, '#4a4aaa');
  // Gürtel-Detail
  px(ctx, 4, 16, 16, 2, '#2a2a6a');
  // Kopf
  px(ctx, 6, 3 - bob * .3, 12, 8, '#c8884a');
  px(ctx, 8, 4 - bob * .3, 3, 3, '#1a0a00');
  px(ctx, 13, 4 - bob * .3, 3, 3, '#1a0a00');
  px(ctx, 8, 4 - bob * .3, 1, 1, '#fff');
  px(ctx, 13, 4 - bob * .3, 1, 1, '#fff');
  // Helm
  px(ctx, 5, 1 - bob * .3, 14, 4, '#c0392b');
  px(ctx, 3, 2 - bob * .3, 4, 3, '#c0392b');
  px(ctx, 17, 2 - bob * .3, 4, 3, '#a93226');
  px(ctx, 5, 1 - bob * .3, 14, 2, '#e74c3c');
  // Waffe (kleines Pistolenmodell)
  const wr = Math.floor(Math.sin(t * .06) * .5);
  px(ctx, 19, 12 + wr, 7, 3, '#2c2c2c');
  px(ctx, 24, 12 + wr, 4, 2, '#1a1a1a');
  // Mündungsfeuer gelegentlich
  if (Math.floor(t / 8) % 12 === 0) {
    ctx.globalAlpha = .9;
    ctx.fillStyle = '#ffe066';
    ctx.beginPath(); ctx.arc(26, 13 + wr, 3, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
};
