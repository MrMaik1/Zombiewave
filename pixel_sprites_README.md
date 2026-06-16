# Pixel Sprites – Einbauanleitung

## 1. Datei kopieren
`pixel_sprites.js` → `public/js/pixel_sprites.js`

## 2. In index.html einbinden
Direkt VOR `game.js` (aber nach `classes.js`):

```html
<script src="/js/classes.js"></script>
<script src="/js/pixel_sprites.js"></script>   ← NEU
<script src="/js/auth.js"></script>
```

## 3. Shop-Karten anpassen (menu.js → renderCharactersShop)
Füge `data-char-id="${ch.id}"` zu jeder `.char-card` hinzu:

```js
// Vorher:
const card = document.createElement('div');
card.className = 'char-card' + ...

// Nachher:
const card = document.createElement('div');
card.className = 'char-card' + ...
card.dataset.charId = ch.id;   // ← NEU
```

Und für Klassen in `renderClassesShop`:
```js
card.dataset.classId = cls.id;  // ← NEU
```

## 4. Manuell ein Sprite spawnen
Überall im Code kannst du `spawnSpriteCanvas` nutzen:

```js
// In einem beliebigen Container-Element:
const anim = spawnSpriteCanvas('mein-div-id', 'ninja', 3);

// Aufräumen wenn nicht mehr nötig:
anim.stop();

// Großes Detail-Sprite (4× Scale):
showDetailSprite('detail-container-id', 'ghost');
```

## Verfügbare Sprite-IDs

### Charaktere
| ID            | Name        |
|---------------|-------------|
| `ghost`       | Ghost       |
| `tank`        | Tank        |
| `hunter`      | Hunter      |
| `brawler`     | Brawler     |
| `berserker`   | Berserker   |
| `sentinel`    | Sentinel    |
| `reaper`      | Reaper      |
| `ninja`       | Ninja       |
| `guardian`    | Guardian    |
| `juggernaut`  | Juggernaut  |
| `troll`       | ???         |

### Klassen
| ID          | Name       |
|-------------|------------|
| `vampire`   | Vampir     |
| `medic`     | Medic      |
| `shadow`    | Schatten   |
| `engineer`  | Ingenieur  |
| `pyro`      | Pyro       |

## Eigene Sprites hinzufügen
Im `SPRITE_DRAW`-Objekt in `pixel_sprites.js` eine neue Funktion eintragen:

```js
SPRITE_DRAW['meinchar'] = function(ctx, t) {
  // ctx ist ein 24×28 Pixel-Canvas (1px = 1 Pixel)
  // t ist der Animations-Tick (läuft hoch)
  // px(ctx, x, y, breite, höhe, farbe) zeichnet einen Pixel-Block
  px(ctx, 4, 0, 16, 28, '#ff0000');  // roter Quader
};
```

## Performance-Hinweis
Jede Karte läuft in einem eigenen `requestAnimationFrame`-Loop.
Bei sehr vielen gleichzeitigen Karten (20+) kann es helfen,
einen einzelnen globalen Loop zu nutzen. Das Plugin stopt
automatisch alle alten Animationen wenn ein Container neu befüllt wird.
