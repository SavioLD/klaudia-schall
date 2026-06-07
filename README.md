# Klaudia Schall · Schlafberatung (Seven Sundays)

Statische Landingpage – kein Build-Tool nötig. **Alle Dateien liegen flach im
Wurzelverzeichnis** (keine Unterordner).

## Dateien

```
index.html         ← Landingpage
impressum.html
datenschutz.html
style.css
main.js            ← Nav, Reveal, Formular-Logik
logo.png / logo.svg
BILDER.md          ← welche Fotos mit welchem Namen ablegen
.nojekyll          ← für GitHub Pages
```

## Lokal ansehen

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deployen (GitHub Pages)

1. Alle Dateien ins Repo-Root legen und pushen.
2. Settings → Pages → Branch `main`, Ordner `/root` → Save.
3. Optional eigene Domain `klaudia-schall.de` (zusätzlich `CNAME`-Datei mit
   `klaudia-schall.de` anlegen).

## Noch zu erledigen

- **Bilder** mit den Namen aus `BILDER.md` neben `index.html` ablegen
  (Platzhalter tauschen automatisch).
- **Web3Forms-Key**: in `main.js` (`WEB3FORMS_ACCESS_KEY`) eigenen Key für
  Klaudia eintragen, damit Anfragen direkt bei ihr landen.
- **Impressum**: USt-IdNr. ergänzen (bzw. Kleinunternehmer-Hinweis).

---
Webseite von [Ländle Digital](https://laendle-digital.com).
