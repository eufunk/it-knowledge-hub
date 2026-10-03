# ToDo / Backlog

Hier steht alles, was **noch nicht umgesetzt** wird, aber **irgendwann umgesetzt werden muss**.
Erledigte Punkte werden abgehakt und mit Datum versehen, nicht gelöscht.

---

## Offene Entscheidungen
- [ ] **Logo / Name der Plattform** – Ist „IT Knowledge Hub“ als Text-Logo in Ordnung oder wird ein eigenes Logo (SVG) erstellt? *(Bis dahin: Text-Logo als Platzhalter)*
- [ ] **Kursbild** für `system-und-prozessautomatisierung-grundlagen` – eigenes Bild oder Stockfoto (z. B. Unsplash, Quelle und Lizenz notieren)? *(Bis dahin: Platzhalterbild)*
- [ ] **Hosting** – Vercel oder GitHub Pages (statischer Export via `output: "export"`)? Danach Deployment einrichten.

## Features (nach dem MVP)
- [ ] Glossar (Navigationseintrag „Glossar“)
- [ ] Notizen pro Lerneinheit (Navigationseintrag „Notizen“)
- [ ] News-Bereich
- [ ] Livestream-Bereich
- [ ] Audio-Player (Widget unten rechts wie im Referenz-Screenshot)
- [ ] Suche über alle Kurse und Einheiten
- [ ] Quiz-Komponente für Übungen
- [ ] Login und serverseitig gespeicherter Fortschritt (statt `localStorage`)
- [ ] Weitere Kurse

- [ ] Notizen im Kursplayer (Reiter „Kurs | Notizen“ und „Notiz erstellen“ wie im Referenz-Screenshot der Kursansicht)
- [ ] Übungsmaterial aus `IT_Administration_und_Automatisierung/System_und_Prozessautomatisierung_Grundlagen/Uebungen_*` (Skripte, Aufgabenstellungen, Testanleitungen) im Kurs bereitstellen, z. B. als Downloads unter `public/documents/`

## Technik / Qualität
- [x] OneDrive und `node_modules`/`.next`: entschieden 2026-10-03 – Repo bleibt in OneDrive, Synchronisierung wird beim Entwickeln pausiert (Ausschluss nicht möglich, Junction von npm überschrieben, siehe CLAUDE.md)
- [ ] Prüfskript für die Nachverfolgbarkeit: sammelt alle Kennungen `F<n>` aus `docs/feature-spec.md` und zeigt, welche noch keinen Verweis in Code oder Tests haben (mit `--strict` für den Hook)
- [ ] Pre-Commit-Hook (`.githooks/pre-commit` + `git config core.hooksPath .githooks`), der `npm run lint`, `npm test` und das Prüfskript ausführt
- [ ] Import-Skript für Kurse aus Word (`.docx`) und Quiz-HTML ins Repository übernehmen, falls weitere Kurse so geliefert werden. Der Import vom 2026-10-03 lief einmalig mit `mammoth` und `cheerio` außerhalb des Repos.
- [ ] Automatische Testläufe auf GitHub (CI), sobald das Hosting entschieden ist
- [x] `npm run build` war am 2026-10-03 einmal langsam (7,5 min für 12 Seiten). Erneuter Build am selben Tag mit 26 Seiten: 28 s. Markdown-Rendern ist schnell (< 1 s je Kapitel), Ursache war vermutlich die OneDrive-Synchronisierung. Bei erneutem Auftreten zuerst OneDrive pausieren.

---

*Zuletzt aktualisiert: 2026-10-03*
