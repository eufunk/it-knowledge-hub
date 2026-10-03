# Historie

Änderungen am fachlichen Verhalten, entfernte oder umbenannte Funktionen und Anforderungskennungen, jeweils mit Datum. Neueste Einträge oben.

---

## 2026-10-03
- Kapitel 01 „Einführung in die Systemautomatisierung“ überarbeitet: zusätzliche Inhalte (Definition, Wetter-Beispiel, 8 Arten, Übung, KI-Typen nach Funktionsweise, Batch/Workflow, Grundprinzipien, Werkzeugbeispiele Zapier/Power Automate/Ansible, Herausforderungen). Tabelle „Arten“ neu: Zeilen Aufgabenautomatisierung, BPA und Hyperautomation entfallen (BPA/RPA als Hinweis). Wissenstest 33 → 59 Fragen, Abschnitte neu nummeriert (1.8 Grundprinzipien, 1.9 Werkzeuge, 1.10 Toolauswahl, 1.11 Herausforderungen), Frage zu Hyperautomation ersetzt.
- Wissenstest Kapitel 01: 6 weitere Fragen (65), darunter die erste Richtig/Falsch-Frage; Richtig/Falsch-Fragen werden nicht gemischt.
- Fehler behoben: `<code>` und HTML-Entities in Quizfragen wurden als roher Text angezeigt (741 Stellen in 8 Wissenstests).
- Vorlesen flüssiger gemacht: keine Abbrüche mehr zwischen Textstücken, Teilung nur noch bei Google-Stimmen und nur an Satzenden (vorher auch an Doppelpunkt/Semikolon und ab 220 Zeichen), Abkürzungen ausgeschrieben.
- Neu: Vorlesen von Kapiteln über die Sprachausgabe des Browsers (F20), Tabellen zeilenweise, Code und Musterlösungen werden übersprungen.
- Kursinhalt übernommen aus `System_und_Prozessautomatisierung_Grundlagen.docx` (9 Kapitel + Glossar) und `Systemautomatisierung_Quiz.html` (410 Fragen). Die fünf Platzhalter-Einheiten (`einfuehrung`, `grundlagen`, `systemautomatisierung`, `prozessautomatisierung`, `uebungen`) wurden entfernt; ihre Adressen liefern jetzt 404, gespeicherter Fortschritt dazu wird ignoriert.
- Neu: Module (F15), Kursplayer mit Seitenleiste, Zurück/Weiter und Lesefortschritt (F11, F15, F16), Wissenstests (F17), Hinweisboxen und eingeklappte Musterlösungen (F18), Anhänge (F19). Fortschritt zählt jetzt Lernschritte (Kapitel + Wissenstests) statt Einheiten (F13). Die frühere Inhaltsübersicht neben der Lerneinheit (F11 alt) ist in der Seitenleiste aufgegangen.
- Projekt angelegt: Feature-Spec für das MVP (`docs/feature-spec.md`, Anforderungen F1–F14), Tagesplan, ToDo-Liste und `CLAUDE.md`.
- Eigenes Design statt Nachbildung des Referenz-Screenshots: Kopfleiste oben statt dunkler Sidebar links und Bottom-Navigation (F1, F2), Kurskachel als Karte mit Bild oben und Text darunter statt Text auf dem Bild (F4), Grid mit 3 statt 4 Spalten (F3), Einheiten als Zeitleiste (F7), Inhaltsübersicht neben der Lerneinheit (F11). Farben Indigo/Grün statt Petrol, Schrift Plus Jakarta Sans statt Outfit.
- Projekt-Setup: Next.js 16 statt des in der ersten Spec-Fassung genannten Next.js 15 (aktuelle Version von create-next-app).
- Entscheidung: Repo bleibt in OneDrive, Synchronisierung wird beim Entwickeln pausiert.
- Entscheidung: dynamische Routen `app/lerninhalte/[kurs]/` und `[kurs]/[einheit]/` statt einer festen Seite pro Kurs.
