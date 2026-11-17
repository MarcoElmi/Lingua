# Lingua – private Sprachlern-App

Offline-fähige Web-App (PWA) ohne Build-Schritt. Einfach alle Dateien auf GitHub Pages (oder einen anderen statischen Webserver) legen.

- `index.html`, `css/`, `js/app.js` – die App
- `lang/fr/pack.js` – Sprachpaket Französisch (neue Einträge immer anhängen)
- `sw.js` – Offline-Speicher; bei jeder Änderung `CACHE` hochzählen
- Weitere Sprache: `lang/it/pack.js` nach gleichem Muster anlegen und in `index.html` + `sw.js` eintragen.

Der Lernfortschritt bleibt nur auf dem Gerät (localStorage). Backup: Réglages → Sauvegarde.
