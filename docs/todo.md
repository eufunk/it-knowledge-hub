# ToDo / Backlog

Hier steht alles, was **noch nicht umgesetzt** wird, aber **irgendwann umgesetzt werden muss**.
Erledigte Punkte werden abgehakt und mit Datum versehen, nicht gelöscht.

---

## Offene Entscheidungen
- [ ] **Logo / Name der Plattform** – Ist „IT Knowledge Hub“ als Text-Logo in Ordnung oder wird ein eigenes Logo (SVG) erstellt? *(Bis dahin: Text-Logo als Platzhalter)*
- [ ] **Kursbilder** für `system-und-prozessautomatisierung-grundlagen` und `netzwerkautomatisierung-und-tools` – eigene Bilder oder Stockfotos (z. B. Unsplash, Quelle und Lizenz notieren)? *(Bis dahin: Platzhalterbilder in Indigo bzw. Grün)*
- [ ] **Kurs „Netzwerkautomatisierung und Tools“: weitere Module** – bisher nur Modul 1 „Automatisierung lokaler Wartungsaufgaben“; weitere Module übernehmen, sobald `Netzwerkautomatisierung_und_Tools.docx` sie enthält
- [ ] **Hosting** – Vercel oder GitHub Pages (statischer Export via `output: "export"`)? Danach Deployment einrichten.

## Features (nach dem MVP)
- [ ] Glossar (Navigationseintrag „Glossar“)
- [ ] Notizen pro Lerneinheit (Navigationseintrag „Notizen“)
- [ ] News-Bereich
- [ ] Livestream-Bereich
- [x] Audio-Player: erledigt 2026-10-03 als Vorlese-Player mit der Sprachausgabe des Browsers (F20)
- [ ] Vorlesen mit fertigen Audiodateien von einem Sprachdienst (Azure, Google, OpenAI, ElevenLabs): gleichbleibende Stimme in allen Browsern, echte Zeitleiste zum Spulen. Braucht Konto, API-Schlüssel und Neuvertonung bei Textänderungen; Kosten vorher prüfen.
- [ ] Suche über alle Kurse und Einheiten
- [ ] Quiz-Komponente für Übungen
- [ ] Login und serverseitig gespeicherter Fortschritt (statt `localStorage`) – eingeplant in [plan_04.10.26.md](plan_04.10.26.md), Block 2
- [ ] Weitere Kurse

- [ ] Notizen im Kursplayer (Reiter „Kurs | Notizen“ und „Notiz erstellen“ wie im Referenz-Screenshot der Kursansicht)
- [ ] Übungsmaterial aus `IT_Administration_und_Automatisierung/System_und_Prozessautomatisierung_Grundlagen/Uebungen_*` (Skripte, Aufgabenstellungen, Testanleitungen) im Kurs bereitstellen, z. B. als Downloads unter `public/documents/`

## Konto (nach Login-MVP)
- [ ] Passwort ändern und vergessenes Passwort zurücksetzen
- [ ] Konto löschen (inkl. Fortschritt) – Datenschutz
- [ ] Schutz gegen massenhaftes Raten von Passwörtern (Begrenzung der Anmeldeversuche)
- [ ] Abgelaufene Sitzungen regelmäßig aus der Datenbank löschen
- [ ] Rollen/Administration (z. B. Konten verwalten), falls benötigt

## Technik / Qualität
- [x] OneDrive und `node_modules`/`.next`: entschieden 2026-10-03 – Repo bleibt in OneDrive, Synchronisierung wird beim Entwickeln pausiert (Ausschluss nicht möglich, Junction von npm überschrieben, siehe CLAUDE.md)
- [ ] Prüfskript für die Nachverfolgbarkeit: sammelt alle Kennungen `F<n>` aus `docs/feature-spec.md` und zeigt, welche noch keinen Verweis in Code oder Tests haben (mit `--strict` für den Hook)
- [ ] Pre-Commit-Hook (`.githooks/pre-commit` + `git config core.hooksPath .githooks`), der `npm run lint`, `npm test` und das Prüfskript ausführt
- [ ] Import-Skript für Kurse aus Word (`.docx`) und Quiz-HTML ins Repository übernehmen, falls weitere Kurse so geliefert werden. Der Import vom 2026-10-03 lief einmalig mit `mammoth` und `cheerio` außerhalb des Repos.
- [ ] Windows blockiert seit 2026-10-04 per Application-Control-Richtlinie (vermutlich „Intelligente App-Steuerung“) die native Next.js-Datei `node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node`. Folge: `next dev` mit Turbopack startet nicht. Übergangslösung: `npx next dev --webpack`. Klären: Ausnahme in Windows-Sicherheit möglich? `npm run build` läuft weiterhin mit Turbopack (geprüft 2026-10-04) – betroffen ist nur der Dev-Server.
- [ ] `npm audit` meldet seit dem Setup Warnungen – prüfen und sichere Updates einspielen (siehe plan_04.10.26.md)
- [ ] Automatische Browser-Tests mit Playwright (Klickpfade, Screenshots mobil/Desktop), damit die Optik ohne manuelles Prüfen abgesichert ist
- [ ] Regelmäßig nach GitHub pushen (zuletzt 2026-10-05: Stand `fccf776` gesichert; gepusht wird weiterhin nur auf Anweisung)
- [ ] Automatische Testläufe auf GitHub (CI), sobald das Hosting entschieden ist
- [x] `npm run build` war am 2026-10-03 einmal langsam (7,5 min für 12 Seiten). Erneuter Build am selben Tag mit 26 Seiten: 28 s. Markdown-Rendern ist schnell (< 1 s je Kapitel), Ursache war vermutlich die OneDrive-Synchronisierung. Bei erneutem Auftreten zuerst OneDrive pausieren.

---

*Zuletzt aktualisiert: 2026-10-03*
