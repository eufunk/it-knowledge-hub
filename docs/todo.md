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

## Technik / Qualität
- [x] OneDrive und `node_modules`/`.next`: entschieden 2026-10-03 – Repo bleibt in OneDrive, Synchronisierung wird beim Entwickeln pausiert (Ausschluss nicht möglich, Junction von npm überschrieben, siehe CLAUDE.md)
- [ ] Prüfskript für die Nachverfolgbarkeit: sammelt alle Kennungen `F<n>` aus `docs/feature-spec.md` und zeigt, welche noch keinen Verweis in Code oder Tests haben (mit `--strict` für den Hook)
- [ ] Pre-Commit-Hook (`.githooks/pre-commit` + `git config core.hooksPath .githooks`), der `npm run lint`, `npm test` und das Prüfskript ausführt
- [ ] Automatische Testläufe auf GitHub (CI), sobald das Hosting entschieden ist

---

*Zuletzt aktualisiert: 2026-10-03*
