# Umsetzungsplan – 2026-10-04

Ziel: **MVP im Browser abnehmen**, **Login mit Fortschritt in der Datenbank**, offene Entscheidungen treffen und das Übungsmaterial in den Kurs bringen.
Ausgangslage: Stand vom 2026-10-03 (Plan im [Archiv](Archiv/plan_03.10.26.md)), alle automatischen Prüfungen grün.
Geschätzter Aufwand: ca. 8–9 Stunden – voraussichtlich nicht alles an einem Tag; Rest wandert in den nächsten Plan. Nach jedem Block wird committet.

> ⚠️ Vor dem Start die OneDrive-Synchronisierung pausieren.

---

## Block 1 – Abnahme im Browser (≈ 45 min, Nutzerin + Claude)
Die Punkte aus [feature-spec.md](feature-spec.md), Abschnitt 8, die nur im Browser prüfbar sind:
- [ ] Seitenleiste im Kursplayer: Module und Kapitel aufklappbar, „Kapitel lesen“ / „Wissenstest“, aktueller Eintrag hervorgehoben, Seitenleiste ausblendbar
- [ ] Ein Kapitel als erledigt markieren → Kachel zeigt „6% Fortschritt“, auch nach Neuladen
- [ ] Alle 18 Lernschritte erledigt → Kachel zeigt „Abgeschlossen“ (zum Testen per Entwicklerwerkzeuge im `localStorage` setzen, danach wieder löschen)
- [ ] Layout bei 375 px Breite ohne horizontales Scrollen (Entwicklerwerkzeuge → Geräteansicht)
- [ ] Tastaturbedienung: alle Links und Buttons per Tab erreichbar, Fokus sichtbar, Wissenstest per Tastatur lösbar
- [ ] Vorlesen in **Edge** mit einer „Natural“-Stimme anhören
- [ ] Gefundene Fehler direkt beheben bzw. in [todo.md](todo.md) eintragen

> Optional: Playwright für automatische Browser-Tests einrichten (Screenshots bei 375 px und 1280 px, Klickpfad Kapitel → Wissenstest). Dann kann Claude die Optik künftig selbst prüfen.

## Block 2 – Login, Registrierung und Fortschritt in der Datenbank (≈ 3–4 h) ✅ erledigt 2026-10-04
Wunsch: Der Lernfortschritt soll unter dem eigenen Login gespeichert werden (Testkonto `testuser` / `testuser123`). Datenbank: SQLite.

**Technische Leitplanken**
- SQLite über das in Node 24 eingebaute Modul `node:sqlite` – kein natives Zusatzpaket wie `better-sqlite3`, das die Windows-Application-Control-Sperre (siehe [todo.md](todo.md)) treffen könnte.
- Passwörter nur als Hash mit Salz (`scrypt` aus `node:crypto`), nie im Klartext.
- Sitzung über ein zufälliges Token in der Datenbank und ein `httpOnly`-Cookie (`SameSite=Lax`, `Secure` in Produktion).
- Datenbankdatei unter `data/` (per `.gitignore` ausgeschlossen); Pfad über eine zentrale Stelle, für Tests umlenkbar.
- Ohne Login funktioniert die Plattform weiter wie bisher (Fortschritt im Browser).

**Schritte**
- [x] Spec anpassen: „Kein Login“ aus den Nicht-Zielen streichen, neue Anforderungen für Registrierung, Anmeldung, Abmeldung und serverseitigen Fortschritt; Abschnitt 6 (Rendering: Seiten mit Login brauchen einen Node-Server)
- [x] Datenbank-Schicht: Tabellen `users`, `sessions`, `progress` (Nutzer, Kurs, Lernschritt, erledigt am); Schema wird beim Start angelegt
- [x] Seite `/registrieren`: Benutzername, Passwort, Passwort wiederholen; Prüfung auf Pflichtfelder, Mindestlänge und vergebene Namen
- [x] Seite `/anmelden` und Abmelden; Anmeldestatus und Abmelden in der Kopfleiste
- [x] Fortschritt mit Konto: Erledigt-Markierungen und bestandene Wissenstests werden in der Datenbank gespeichert und auf allen Seiten von dort gelesen
- [x] **Vorhandenen Fortschritt übernehmen:** Beim ersten Anmelden wird der im Browser gespeicherte Fortschritt in das Konto übernommen (zusammengeführt, nichts geht verloren)
- [x] Testkonto `testuser` / `testuser123` per Startskript (`npm run db:seed`) anlegen – nur für die Entwicklung, nicht für eine öffentliche Installation
- [x] Tests: Passwort-Hash, Registrierung (doppelter Name, zu kurzes Passwort), Anmeldung (falsches Passwort), Sitzung, Fortschritt speichern/lesen, Zusammenführen mit Browser-Fortschritt – mit temporärer Datenbank
- [x] CLAUDE.md, README, Historie nachziehen

> Ergebnis: 98 automatische Tests grün; zusätzlich Browser-Test mit Edge (12 Prüfungen: falsches Passwort, Anmelden, Registrieren, Übernahme des Browser-Fortschritts, Erledigt-Markierung im Konto, Abmelden, anderer Browser, Weiterleitung, 375 px). Dabei gefunden und behoben: Ein Klick auf „Als erledigt markieren“, während der Anmeldestatus noch lud, landete nur im Browser. Testkonto `testuser` angelegt; Testdaten danach aus der Datenbank entfernt.

**Geklärt / offen**
- [x] Jede Person darf sich selbst registrieren (Entscheidung 2026-10-04).
- [x] Lerninhalte nur mit Anmeldung (Entscheidung 2026-10-04) – umgesetzt als Zugangsschutz F26 in `proxy.ts`; Browser-Test um Weiterleitung, Rückkehr zur Zielseite und Abmelden erweitert (16 Prüfungen grün).
- Folge für das Hosting (Block 5, offen): Ein reiner statischer Export (GitHub Pages) reicht nicht mehr; Vercel speichert keine SQLite-Datei dauerhaft. Infrage kommen z. B. ein kleiner Server/VPS, Render, Fly.io oder Railway mit Volume.

## Zusatz – Kapitel 02 überarbeitet ✅ erledigt 2026-10-04
- [x] Neue Inhalte mit bestehendem Kapitel 02 zusammengeführt, Word-Entwurf zur Freigabe
- [x] Nach Freigabe als Lerneinheit übernommen
- [x] Wissenstest auf 60 Fragen erweitert, Abschnitte neu nummeriert

## Block 3 – Entscheidung Vorlesen (≈ 30 min)
- [ ] Ergebnis aus Block 1 (Edge) bewerten
- [ ] Falls nicht ausreichend: Anbieter für fertige Audiodateien vergleichen (Azure, Google, OpenAI, ElevenLabs) – Stimmen, Preis für ca. 250.000 Zeichen, Lizenz für Lernplattform
- [ ] Entscheidung in [todo.md](todo.md) und [HISTORIE.md](HISTORIE.md) festhalten; bei „ja“ Hörprobe für ein Kapitel planen

## Block 4 – Übungsmaterial bereitstellen (≈ 1,5 h)
Material aus `IT_Administration_und_Automatisierung/System_und_Prozessautomatisierung_Grundlagen/Uebungen_*`.
- [ ] Bestand sichten: Aufgabenstellungen, Skripte (`.ps1`, `.sh`, `.psm1`), Lösungen, Testanleitungen; Testdateien unter `tmp/` aussortieren
- [ ] Zuordnung zu Kapiteln festlegen (z. B. PowerShell-Übungen → Kapitel 04, `signal_cleanup.sh` → Kapitel 05)
- [ ] Spec ergänzen (neue Anforderung: Downloads/Übungen je Kapitel)
- [ ] Umsetzung: Dateien unter `public/documents/<kurs>/`, Abschnitt „Übungen & Downloads“ im Kapitel bzw. auf der Kursseite
- [ ] Tests und Inhaltsprüfung erweitern

## Block 5 – Offene Entscheidungen (≈ 30 min, Nutzerin)
- [ ] Logo / Name der Plattform: Text-Logo behalten oder eigenes Logo?
- [ ] Kursbild: eigenes Bild, Stockfoto oder SVG-Platzhalter behalten?
- [ ] Hosting: Mit Login und SQLite (Block 2) wird ein Node-Server mit dauerhaftem Speicher gebraucht – z. B. kleiner Server/VPS, Render, Fly.io oder Railway mit Volume. Danach Deployment und ggf. CI einrichten

## Block 6 – Technik und Qualität (≈ 1–1,5 h, nach Zeit)
- [ ] `npm audit`: Warnungen ansehen und bewerten, sichere Updates einspielen (kein `--force` ohne Prüfung)
- [ ] Pre-Commit-Hook (`.githooks/pre-commit`): Lint und Tests vor jedem Commit
- [ ] Prüfskript für die Nachverfolgbarkeit der Anforderungen (F-Kennungen in Code und Tests)
- [ ] Commit-Push nach GitHub besprechen (bisher nichts gepusht – Sicherung!)

## Block 7 – Plan abschließen (≈ 15 min)
- [ ] Plan abhaken, Unerledigtes nach [todo.md](todo.md) bzw. in den nächsten Plan
- [ ] Plan nach `docs/Archiv/` verschieben

---

## Reihenfolge & Puffer
Block 1 zuerst, weil Fehler aus der Abnahme Vorrang haben. Danach Block 2 (Login), weil er die Hosting-Entscheidung in Block 5 beeinflusst. Dann Block 3 und 5 (kurze Entscheidungen), danach Block 4. Block 6 nur, wenn Zeit bleibt – sonst in den nächsten Plan.

## Weitere offene Punkte
Alles Weitere (Notizen im Kursplayer, Suche, Import-Skript für Word-Kurse, weitere Kurse …) steht in [todo.md](todo.md).
