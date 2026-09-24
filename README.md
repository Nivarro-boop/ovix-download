# Ovix Download-Seite

Statische Webseite zum Anbieten eigener Apps. Kein Server-Code, keine Build-Schritte.

## Funktionen

- Suche, Filter nach Plattform, Sortierung (neueste / A–Z)
- Hauptbutton passt sich dem Betriebssystem des Besuchers an
- Detailfenster pro App mit Screenshots, Changelog, SHA-256-Prüfsumme und teilbarem Link (`seite.de/#app-id`)
- „Neu“-Badge für frische Versionen, „Bald verfügbar“ für Plattformen ohne Datei
- Hell/Dunkel-Umschalter, Handy-tauglich, Tastenkürzel `/` für die Suche

## App hinzufügen

1. `neue-app.html` im Browser öffnen.
2. Formular ausfüllen und die App-Datei ins Feld ziehen. Pfad, Größe, Plattform und SHA-256 füllen sich automatisch.
3. „Code kopieren“ klicken und den Text in `apps.js` in die Liste `window.APPS = [ … ]` einfügen.
4. App-Datei in den Ordner `downloads/` legen (Icons in `icons/`, Screenshots in `screenshots/`).

Plattformen: `windows`, `mac`, `linux`, `android`, `ios`, `web`.
Leeres `file: ""` zeigt „Bald verfügbar“.

Name, Überschrift, Text und Kontakt stehen oben in `apps.js` unter `window.SITE`.

## Lokal ansehen

```
python -m http.server 8080
```

Dann http://localhost:8080 öffnen.

## Online stellen

Ganzen Ordner auf einen statischen Hoster hochladen, z. B.:

- **Netlify Drop**: https://app.netlify.com/drop – Ordner ins Browserfenster ziehen.
- **GitHub Pages**: Dateien über 100 MB gehen dort nicht. Große Dateien als
  GitHub-Release hochladen und die Release-URL als `file` eintragen.
- Eigener Webspace per FTP.

`neue-app.html` und `.claude/` müssen nicht mit hochgeladen werden.
