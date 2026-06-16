# ZombieWave V5 – Setup & Deployment Guide

## Übersicht der Dateien

```
zombiewave-v5/
├── server.js              ← Backend (Node.js + Socket.io + MongoDB)
├── package.json
├── .env.example           ← Vorlage für Umgebungsvariablen
├── .gitignore
├── pixel_sprites_README.md← Anleitung für die Pixel-Sprites
└── public/
    ├── index.html         ← Das komplette Spiel (Frontend)
    └── js/
        ├── config.js      ← i18n + Canvas + API-Helper
        ├── characters.js  ← Charakter-Definitionen
        ├── classes.js     ← Klassen-System
        ├── levels.js      ← Level-Definitionen
        ├── auth.js        ← Login / Register
        ├── network.js     ← Multiplayer / Socket.io
        ├── menu.js        ← Shop, Bestenliste, Einstellungen
        ├── admin.js        ← Admin-Panel
        ├── audio.js       ← Musik + SFX
        ├── draw.js        ← Canvas-Rendering
        ├── level_system.js← Level-Fortschritt
        ├── pixel_sprites.js← NEU: Animierte Pixel-Sprites
        └── game.js        ← Haupt-Game-Loop
```

---

## Schritt 1 – MongoDB Atlas (kostenlos)

1. Gehe zu https://cloud.mongodb.com und registriere dich.
2. Erstelle Cluster → **M0 Free Tier**.
3. **Database Access** → User anlegen (z.B. `zwadmin`) mit Passwort.
4. **Network Access** → IP `0.0.0.0/0` hinzufügen.
5. **Databases** → Connect → Drivers → Connection String kopieren:
   ```
   mongodb+srv://zwadmin:PASSWORT@cluster0.abc12.mongodb.net/zombiewave?retryWrites=true&w=majority
   ```

---

## Schritt 2 – GitHub Repository

```bash
cd zombiewave-v5
git init
git add .
git commit -m "Initial commit – ZombieWave V5"
git branch -M main
git remote add origin https://github.com/DEIN_USERNAME/zombiewave-v5.git
git push -u origin main
```

---

## Schritt 3 – Railway.app (Hosting, kostenlos)

1. https://railway.app → GitHub-Login → **New Project** → GitHub Repo wählen.
2. **Variables** Tab → folgende Variablen setzen:

| Variable       | Wert                                      |
|----------------|-------------------------------------------|
| `MONGODB_URI`  | Dein MongoDB Connection String            |
| `JWT_SECRET`   | Langer zufälliger String                  |
| `NODE_ENV`     | `production`                              |

3. Nach dem Speichern → Railway startet automatisch neu.
4. Unter **Settings → Domains** siehst du deine URL.

---

## Lokales Testen

```bash
npm install
cp .env.example .env
# .env ausfüllen
npm start
# Browser: http://localhost:3000
```

---

## Admin-Account

Der Account `AdminMaik` / `MrMaik` wird beim ersten Registrieren automatisch
mit vollen Rechten und allen Waffen erstellt.

---

## NEU: Pixel-Sprites

Alle Charaktere und Klassen haben jetzt animierte Pixel-Designs!
- Im Shop werden sie automatisch geladen (kein extra Schritt nötig).
- Für Details siehe `pixel_sprites_README.md`.

---

## Multiplayer

1. Menü → **Multiplayer** → Modus & Schwierigkeit wählen → **Party erstellen**
2. Den 5-stelligen Code an Mitspieler schicken
3. Alle auf **Bereit** → Leader startet das Spiel
