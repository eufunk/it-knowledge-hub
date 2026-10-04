# Historie

Änderungen am fachlichen Verhalten, entfernte oder umbenannte Funktionen und Anforderungskennungen, jeweils mit Datum. Neueste Einträge oben.

---

## 2026-10-04
- Kapitel 03 „Grundlagen von Bash und Shell-Scripting“ überarbeitet (Freigabe per Word-Entwurf): neuer Abschnitt „Auffrischung der Grundlagen“ (Programmiergrundlagen, Datenstrukturen, APIs und Bibliotheken, Betriebssystemkenntnisse), „Interaktion mit der Befehlszeile“ (Shell und IDE, Eingabe/Ausgabe/Rückmeldung), Pfade, Vergleichsoperatoren, drei `if`-Beispiele, Schleifen, Kommentare, eigener Abschnitt „Mehrzeilige Bash-Skripte“ und Übung „Verständnis bestehender Skripte“ mit Lösung. Korrigiert gegenüber der Vorlage: Mac-Tastenkürzel (control statt ⌘), Zeichen-Vergleichsoperatoren nur in `(( … ))` bzw. alphabetisch in `[[ … ]]`, `env` in der Shebang-Zeile. Wissenstest 37 → 88 Fragen, Abschnitte neu gegliedert (3.1–3.9).
- Wissenstest Kapitel 02: 9 weitere Fragen aus der Vorlage (69).
- Kapitel 02 „Überwachen wiederkehrender Systemabläufe“ überarbeitet (Freigabe per Word-Entwurf): 6 Schritte der Systemüberwachung mit Werkzeugkategorien, Übung mit 4 Szenarien und Lösungsvorschlag, Mustererkennung und Vorhersage-Methoden, 6 Fallstricke, Frühwarnsysteme, prädiktive Wartung, neuer Abschnitt „Vorbereitung auf den Ernstfall“ (Notfallplan, Penetrations- und Stresstests), „Fazit zu Modul 1“. Wissenstest 34 → 60 Fragen; Abschnitt Dokumentation von 2.9 auf 2.10 verschoben, 2.9 ist jetzt „Vorbereitung auf den Ernstfall“.
- Zugangsschutz (F26): Lerninhalte nur noch mit Anmeldung, offen bleiben Startseite, „Über uns“, Anmelden, Registrieren. Fortschritt ohne Anmeldung (F12) ist damit nur noch Rückfall; F23/F24 angepasst.
- Neu: Registrierung, Anmeldung und Abmelden (F21, F22); Fortschritt angemeldeter Nutzer in SQLite (F23); Browser-Fortschritt wird beim Anmelden/Registrieren übernommen (F24); Sicherheitsanforderungen (F25). „Kein Login“ aus den Nicht-Zielen der Spec entfernt. Die Plattform braucht damit einen Node-Server (kein reiner statischer Export mehr).
- Testkonto `testuser` per `npm run db:seed` angelegt.

## 2026-10-03
- Tagesplan abgeschlossen und nach `docs/Archiv/plan_03.10.26.md` verschoben; Plan für den 2026-10-04 angelegt.
- Kapitel 01 „Einführung in die Systemautomatisierung“ überarbeitet: zusätzliche Inhalte (Definition, Wetter-Beispiel, 8 Arten, Übung, KI-Typen nach Funktionsweise, Batch/Workflow, Grundprinzipien, Werkzeugbeispiele Zapier/Power Automate/Ansible, Herausforderungen). Tabelle „Arten“ neu: Zeilen Aufgabenautomatisierung, BPA und Hyperautomation entfallen (BPA/RPA als Hinweis). Wissenstest 33 → 59 Fragen, Abschnitte neu nummeriert (1.8 Grundprinzipien, 1.9 Werkzeuge, 1.10 Toolauswahl, 1.11 Herausforderungen), Frage zu Hyperautomation ersetzt.
- Kapitel 01: Büroautomatisierung um Kundenkommunikation und Chatbots im Kundenservice ergänzt (passend zur Wissenstest-Frage).
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
