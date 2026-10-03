# Umsetzungsplan – 2026-10-04

Ziel für morgen: **MVP im Browser abnehmen**, offene Entscheidungen treffen und das Übungsmaterial in den Kurs bringen.
Ausgangslage: Stand vom 2026-10-03 (Plan im [Archiv](Archiv/plan_03.10.26.md)), alle automatischen Prüfungen grün.
Geschätzter Aufwand: ca. 5–6 Stunden. Nach jedem Block wird committet.

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

## Block 2 – Entscheidung Vorlesen (≈ 30 min)
- [ ] Ergebnis aus Block 1 (Edge) bewerten
- [ ] Falls nicht ausreichend: Anbieter für fertige Audiodateien vergleichen (Azure, Google, OpenAI, ElevenLabs) – Stimmen, Preis für ca. 250.000 Zeichen, Lizenz für Lernplattform
- [ ] Entscheidung in [todo.md](todo.md) und [HISTORIE.md](HISTORIE.md) festhalten; bei „ja“ Hörprobe für ein Kapitel planen

## Block 3 – Übungsmaterial bereitstellen (≈ 1,5 h)
Material aus `IT_Administration_und_Automatisierung/System_und_Prozessautomatisierung_Grundlagen/Uebungen_*`.
- [ ] Bestand sichten: Aufgabenstellungen, Skripte (`.ps1`, `.sh`, `.psm1`), Lösungen, Testanleitungen; Testdateien unter `tmp/` aussortieren
- [ ] Zuordnung zu Kapiteln festlegen (z. B. PowerShell-Übungen → Kapitel 04, `signal_cleanup.sh` → Kapitel 05)
- [ ] Spec ergänzen (neue Anforderung: Downloads/Übungen je Kapitel)
- [ ] Umsetzung: Dateien unter `public/documents/<kurs>/`, Abschnitt „Übungen & Downloads“ im Kapitel bzw. auf der Kursseite
- [ ] Tests und Inhaltsprüfung erweitern

## Block 4 – Offene Entscheidungen (≈ 30 min, Nutzerin)
- [ ] Logo / Name der Plattform: Text-Logo behalten oder eigenes Logo?
- [ ] Kursbild: eigenes Bild, Stockfoto oder SVG-Platzhalter behalten?
- [ ] Hosting: Vercel oder GitHub Pages (statischer Export)? Danach Deployment und ggf. CI einrichten

## Block 5 – Technik und Qualität (≈ 1–1,5 h, nach Zeit)
- [ ] `npm audit`: Warnungen ansehen und bewerten, sichere Updates einspielen (kein `--force` ohne Prüfung)
- [ ] Pre-Commit-Hook (`.githooks/pre-commit`): Lint und Tests vor jedem Commit
- [ ] Prüfskript für die Nachverfolgbarkeit der Anforderungen (F-Kennungen in Code und Tests)
- [ ] Commit-Push nach GitHub besprechen (bisher nichts gepusht – Sicherung!)

## Block 6 – Plan abschließen (≈ 15 min)
- [ ] Plan abhaken, Unerledigtes nach [todo.md](todo.md) bzw. in den nächsten Plan
- [ ] Plan nach `docs/Archiv/` verschieben

---

## Reihenfolge & Puffer
Block 1 zuerst, weil Fehler aus der Abnahme Vorrang haben. Danach Block 2 und 4 (kurze Entscheidungen), dann Block 3. Block 5 nur, wenn Zeit bleibt – sonst in den nächsten Plan.

## Weitere offene Punkte
Alles Weitere (Notizen im Kursplayer, Suche, Import-Skript für Word-Kurse, weitere Kurse …) steht in [todo.md](todo.md).
