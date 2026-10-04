# Feature Spec: Lernplattform „IT Knowledge Hub“ – MVP

**Stand:** 2026-10-03
**Status:** Entwurf
**Erster Kurs:** `system-und-prozessautomatisierung-grundlagen`

---

## 1. Ziel

Eine schlanke Lernplattform, auf der Kurse als Kacheln angezeigt werden. Ein Referenz-Screenshot diente als Anregung für den Funktionsumfang; Layout und Farben sind ein eigenes Design (siehe Abschnitt 6, „Gestaltung“). Ein Kurs besteht aus mehreren Lerneinheiten, die als Markdown-Dateien im Repo gepflegt werden. Lernende sehen ihren Fortschritt pro Kurs.

Das MVP liefert **einen vollständig nutzbaren Kurs** von der Übersicht bis zur letzten Lerneinheit.

## 2. Nicht-Ziele (MVP)

- Kein Zurücksetzen vergessener Passwörter, keine E-Mail-Bestätigung, keine Rollen oder Administration (siehe `docs/todo.md`)
- Kein Livestream, keine News, kein Glossar, keine Notizen (kommen später, siehe `docs/todo.md`)
- Kein CMS – Inhalte werden direkt als Markdown im Repo gepflegt

## 3. Nutzer & Kernszenarien

**Zielgruppe:** Lernende im IT-Umfeld (Umschulung / Weiterbildung), Einsteigerniveau.

| # | Als Lernende*r möchte ich … | damit … |
|---|---|---|
| S1 | alle Kurse als Kacheln mit Bild, Titel, Kurzbeschreibung, Dauer und Anzahl Einheiten sehen | ich schnell einen Überblick habe |
| S2 | auf jeder Kachel meinen Fortschritt sehen (`0 % Fortschritt` … `Abgeschlossen`) | ich weiß, wo ich weitermachen muss |
| S3 | einen Kurs öffnen und seine Module und Kapitel sehen | ich den Aufbau verstehe |
| S7 | nach jedem Kapitel einen Wissenstest machen | ich prüfen kann, ob ich den Stoff verstanden habe |
| S4 | eine Einheit lesen und als erledigt markieren | mein Fortschritt steigt |
| S5 | zur nächsten / vorherigen Einheit springen | ich ohne Umweg weiterlernen kann |
| S6 | die Seite auch auf dem Handy nutzen | ich unterwegs lernen kann |

## 4. Funktionale Anforderungen

### 4.1 Layout & Navigation
- **F1** Helle Kopfleiste oben, beim Scrollen fixiert, mit Logo links und Navigation rechts:
  - Home (`/`)
  - Lerninhalte (`/lerninhalte`) – auch auf Kurs- und Einheitenseiten aktiv
  - Über uns (`/ueber-uns`)
  - Der aktive Eintrag ist farbig hinterlegt und mit `aria-current="page"` ausgezeichnet.
- **F2** Mobil (< 640 px): Die Kopfleiste bleibt, das Logo zeigt nur das Bildzeichen, die Navigationseinträge nur Text ohne Icon. Keine zusätzliche Bottom-Navigation.

### 4.2 Kursübersicht `/lerninhalte`
- **F3** Überschrift „Deine Kurse“, darunter Grid aus Kurskacheln (Desktop 3 Spalten, Tablet 2, Mobil 1).
- **F4** Kurskachel:
  - Weiße Karte mit Bild oben (16:9) und Text darunter – kein Text auf dem Bild
  - Badge oben rechts auf dem Bild: Fortschrittskreis + `NN% Fortschritt`, bei 100 % Häkchen + `Abgeschlossen` (grün)
  - Text: Niveau (z. B. „Einsteiger“), Titel (fett), Kurzbeschreibung (max. 2 Zeilen), Dauer sowie Anzahl Module und Kapitel mit Icons
  - Unten: Fortschrittsbalken
  - Ganze Kachel ist ein Link zur Kursseite, mit Hover- und Fokus-Zustand
- **F5** Kurse werden automatisch aus `content/lerninhalte/*` gelesen – neuer Ordner = neuer Kurs, kein Code nötig.

### 4.3 Kursseite `/lerninhalte/[kurs]`
- **F6** Kopfbereich: Bild, Titel, Beschreibung, Dauer, Anzahl Module und Kapitel.
- **F7** Kapitel als Zeitleiste, gruppiert nach Modulen (Modulnummer und -titel als Zwischenüberschrift). Je Kapitel: nummerierter Punkt (grün mit Häkchen, wenn Kapitel und Wissenstest erledigt sind), Titel, Kurzbeschreibung, Dauer und Status von „Lesen“ und „Wissenstest“. Anhänge (z. B. Glossar) folgen nach den Modulen. Daneben (mobil darüber) eine Fortschrittskarte, die beim Scrollen stehen bleibt.
- **F8** Button „Kurs starten“ bzw. „Weiterlernen“ (springt zum ersten nicht erledigten Lernschritt, siehe F13).

### 4.4 Kursplayer: Kapitel `/lerninhalte/[kurs]/[einheit]` und Wissenstest `/lerninhalte/[kurs]/[einheit]/wissenstest`
Angelehnt an den Referenz-Screenshot der Kursansicht, aber im eigenen Design.
- **F9** Markdown wird gerendert inkl. Überschriften, Listen, Tabellen (GFM und HTML), Codeblöcke mit Syntax-Highlighting, Bilder.
- **F10** Am Ende eines Kapitels: Button „Als erledigt markieren“ (umschaltbar).
- **F11** Kopfzeile über dem Inhalt mit Breadcrumb `Lerninhalte › Kurs › Kapitel` und Buttons „Zurück“ / „Weiter“. Die Reihenfolge der Lernschritte ist: Kapitel 1 → Wissenstest 1 → Kapitel 2 → … → Wissenstest 9 → Anhänge. Am Anfang ist „Zurück“ deaktiviert, nach dem letzten Schritt führt „Weiter“ zur Kursseite. Unter dem Inhalt zusätzlich Karten „Vorheriger“ / „Nächster“ Schritt.
- **F15** Seitenleiste „Kursinhalt“ links: Module aufklappbar, darin Kapitel aufklappbar mit den Einträgen „Kapitel lesen“ und „Wissenstest“, jeweils mit Status (offen / erledigt). Modul und Kapitel des aktuellen Schritts sind geöffnet, der aktuelle Eintrag ist hervorgehoben. Anhänge stehen am Ende. Oben Kursname und Fortschrittsbalken. Ab 1024 px dauerhaft sichtbar und ausblendbar; darunter als aufklappbarer Bereich „Kursinhalt“ über dem Inhalt.
- **F16** Lesefortschritt: Unter dem Kapiteltitel zeigt ein schmaler Balken, wie weit das Kapitel gelesen ist (Scrollposition).
- **F17** Wissenstest je Kapitel:
  - Startseite mit Kapitelname, Anzahl Fragen im Pool, Ablauf und Bestehensgrenze
  - Ein Durchlauf besteht aus 10 zufällig gezogenen Fragen aus dem Pool des Kapitels; die Antwortreihenfolge wird gemischt, außer bei Richtig/Falsch-Fragen (Antworten „Richtig“ und „Falsch“, immer in dieser Reihenfolge)
  - Nach dem Auswählen einer Antwort sofort Rückmeldung (richtig / falsch, richtige Antwort markiert) mit Erklärung und dem Thema der Frage
  - Am Ende: Ergebnis (z. B. „8 von 10“); bestanden ab 80 % → Wissenstest gilt als erledigt; „Neuer Durchlauf“ jederzeit möglich, ein bestandener Test bleibt erledigt
- **F18** Hinweisboxen: Blockzitate, die mit **Definition:**, **Tipp:**, **Wichtig:**, **Achtung:**, **Hinweis:**, **Merke:** oder **Kurz gesagt:** beginnen, werden als farbige Boxen mit Icon dargestellt. Musterlösungen und Lösungsvorschläge sind eingeklappt („Musterlösung anzeigen“).
- **F19** Anhänge (z. B. Glossar) sind Kapitel ohne Wissenstest, ohne Erledigt-Button und zählen nicht zum Fortschritt.
- **F20** Vorlesen: Auf jeder Kapitelseite gibt es einen Vorlese-Player (unten rechts schwebend, mobil am unteren Rand). Er nutzt die Sprachausgabe des Browsers (Web Speech API, kein Server, keine Kosten).
  - Bedienung: Abspielen/Pause, vorheriger/nächster Abschnitt, Anzeige „Abschnitt N von M“, Geschwindigkeit (0,75× bis 1,5×) und Auswahl einer deutschen Stimme. Geschwindigkeit und Stimme werden im Browser gemerkt.
  - Vorgelesen werden Überschriften, Absätze, Listenpunkte, Hinweisboxen und Tabellen. Tabellen zeilenweise: erste Spalte, dann jede weitere Zelle mit ihrer Spaltenüberschrift („Manuell. Beschreibung: … Beispiel: …“), eingeleitet mit „Tabelle mit N Zeilen“.
  - Übersprungen werden Codeblöcke und eingeklappte Musterlösungen.
  - Flüssiges Vorlesen: Abkürzungen werden ausgeschrieben („z. B.“ → „zum Beispiel“), der nächste Abschnitt wird vorab in die Warteschlange gelegt, Text wird nur bei Stimmen mit Längenbegrenzung (Google-Stimmen in Chrome) an Satzenden geteilt. Natürliche Stimmen stehen in der Auswahl oben und sind als „empfohlen“ markiert.
  - Der gerade gelesene Abschnitt (bei Tabellen die Zeile) wird hervorgehoben und in den sichtbaren Bereich gescrollt.
  - Beim Verlassen der Seite stoppt die Ausgabe. Unterstützt der Browser keine Sprachausgabe oder gibt es keine deutsche Stimme, zeigt der Player einen Hinweis statt der Bedienelemente.

### 4.5 Fortschritt
- **F12** Fortschritt wird im Browser (`localStorage`) gespeichert, Schlüssel pro Kurs.
- **F13** Fortschritt = erledigte Lernschritte / alle Lernschritte, gerundet auf ganze Prozent. Lernschritte sind jedes Kapitel (außer Anhängen) und jeder Wissenstest.
- **F14** Ohne gespeicherte Daten (oder wenn `localStorage` blockiert ist) wird 0 % angezeigt – die Seite darf nicht abstürzen.

### 4.6 Konto und Anmeldung
- **F21** Registrierung `/registrieren`: Jede Person kann ein Konto anlegen. Felder: Benutzername, Passwort, Passwort wiederholen.
  - Benutzername: 3–32 Zeichen, nur Buchstaben a–z, Ziffern, Punkt, Bindestrich und Unterstrich; Groß-/Kleinschreibung wird nicht unterschieden (gespeichert in Kleinbuchstaben); bereits vergebene Namen werden abgelehnt.
  - Passwort: mindestens 8, höchstens 200 Zeichen; beide Eingaben müssen übereinstimmen.
  - Fehler werden am Formular angezeigt, Eingaben (außer Passwörtern) bleiben erhalten. Nach Erfolg ist die Person angemeldet.
- **F22** Anmeldung `/anmelden` und Abmelden: Bei falschem Namen oder Passwort erscheint dieselbe allgemeine Meldung („Benutzername oder Passwort ist falsch.“). Eine Sitzung gilt 30 Tage. Die Kopfleiste zeigt angemeldet den Benutzernamen und „Abmelden“, sonst „Anmelden“. Nach dem Anmelden geht es zur vorher besuchten Seite bzw. zu den Lerninhalten.
- **F23** Fortschritt mit Konto: Erledigte Kapitel und bestandene Wissenstests werden in der Datenbank gespeichert und auf allen Seiten und Geräten von dort gelesen. Der Browser-Speicher (F12) dient nur noch als Rückfall, falls die Sitzung während des Lernens abläuft oder der Server nicht erreichbar ist.
- **F24** Übernahme des Browser-Fortschritts: Beim Anmelden und Registrieren wird der im Browser gespeicherte Fortschritt aller Kurse (z. B. aus der Zeit vor dem Zugangsschutz) mit dem Konto zusammengeführt (Vereinigung – es geht nichts verloren).
- **F25** Sicherheit:
  - Passwörter nur als Hash mit zufälligem Salz (`scrypt`), Vergleich in konstanter Zeit.
  - Sitzungs-Token zufällig (256 Bit); in der Datenbank nur dessen Hash. Cookie `httpOnly`, `SameSite=Lax`, in Produktion `Secure`.
  - Änderungen am Fortschritt werden nur von derselben Herkunft (Origin) angenommen und nur für angemeldete Nutzer.
  - Ein Testkonto (`testuser`) wird nur über das Entwicklungsskript `npm run db:seed` angelegt, nie automatisch.
- **F26** Zugangsschutz: Ohne Anmeldung sind nur Startseite (`/`), „Über uns“, Anmelden und Registrieren erreichbar. Alle Seiten unter `/lerninhalte` (Kursübersicht, Kursseite, Kapitel, Wissenstests) verlangen eine gültige Sitzung; sonst geht es zu `/anmelden?weiter=<aufgerufene Seite>` und nach der Anmeldung zurück. Die Prüfung erfolgt zentral in `proxy.ts`; Schnittstellen und Server Actions prüfen die Anmeldung zusätzlich selbst. Nach dem Abmelden auf einer geschützten Seite geht es zur Startseite. Die Startseite zeigt die Kurse als Vorschau mit Hinweis auf Anmeldung/Registrierung.

## 5. Inhaltsmodell

### 5.1 Ordnerstruktur
```
content/lerninhalte/system-und-prozessautomatisierung-grundlagen/
├── README.md                                  ← Kurs-Metadaten inkl. Module
├── 01-einfuehrung-systemautomatisierung.md    ← Kapitel
├── …
├── 09-fehlerbehandlung-in-skripten.md
├── 10-glossar.md                              ← Anhang
└── wissenstest/
    ├── einfuehrung-systemautomatisierung.json ← Fragen-Pool je Kapitel
    └── …
```
Slug des Kapitels = Dateiname ohne Nummer und Endung (`01-einfuehrung-systemautomatisierung.md` → `einfuehrung-systemautomatisierung`). Reihenfolge = Nummernpräfix. Ein Kapitel hat einen Wissenstest, wenn `wissenstest/<slug>.json` existiert.

Regeln für das Einlesen:
- Nur Ordner mit `README.md` sind Kurse, andere Ordner werden ignoriert.
- Nur Dateien nach dem Muster `NN-slug.md` (Kleinbuchstaben, Ziffern, Bindestriche) sind Kapitel, andere Dateien werden ignoriert.
- Kurse werden nach Slug sortiert, Kapitel numerisch nach Präfix (`10-…` nach `02-…`).
- Fehlt ein Pflichtfeld im Frontmatter (Kurs: `title`, `description`, `duration`, `image`; Kapitel: `title`), bricht der Build mit einer Fehlermeldung ab, die die Datei nennt.
- Jedes Kapitel ohne `anhang: true` muss genau einem Modul zugeordnet sein; ein Modul darf nur vorhandene Kapitel nennen. Sonst bricht der Build ab. Ohne `modules` im Kurs bilden alle Kapitel ein Modul „Kursinhalt“.
- Ein Wissenstest muss mindestens 10 Fragen mit je mindestens 2 Antworten und einer Erklärung haben, sonst bricht der Build ab.

### 5.2 Frontmatter Kurs (`README.md`)
```yaml
---
title: "System- und Prozessautomatisierung"
description: "…"
duration: "1 Woche"
image: "/images/kurse/system-und-prozessautomatisierung.svg"
level: "Einsteiger"
modules:
  - title: "Grundlagen der Automatisierung"
    chapters: ["einfuehrung-systemautomatisierung", "ueberwachen-wiederkehrender-systemablaeufe"]
---
```

### 5.3 Frontmatter Kapitel
```yaml
---
title: "Einführung in die Systemautomatisierung"
description: "Was Automatisierung bedeutet …"
duration: "15 Minuten"
anhang: false          # optional; true z. B. für das Glossar
---
```

### 5.4 Wissenstest (`wissenstest/<slug>.json`)
```json
{
  "sections": { "1.1": "Was bedeutet Automatisierung?" },
  "questions": [
    {
      "section": "1.1",
      "question": "Was bedeutet das griechische Wort „autómatos“ …?",
      "options": ["richtige Antwort", "falsch", "falsch", "falsch"],
      "explanation": "…"
    }
  ]
}
```
Die **erste** Antwort in `options` ist die richtige; beim Anzeigen wird gemischt. Texte dürfen `<code>…</code>`, `<br>` und HTML-Entities (z. B. `&gt;`) enthalten; sie werden sicher dargestellt, ohne HTML einzufügen. Andere Tags werden entfernt. `section` verweist auf den Abschnitt im Kapitel, `sections` liefert dessen Kurztitel für die Rückmeldung.

### 5.5 Typen (`types/learning.ts`)
Wichtigste Typen: `Course` (mit `modules: CourseModule[]`, `lessons`, `appendix`), `LessonMeta` (mit `hasQuiz`, `appendix`), `Lesson`, `Quiz`, `QuizQuestion` und `CourseStep` (ein Lernschritt: Kapitel oder Wissenstest, mit `id` für den Fortschritt).

### 5.6 Datenbank
| Tabelle | Spalten |
|---|---|
| `users` | `id`, `username` (eindeutig, Kleinbuchstaben), `password_hash`, `created_at` |
| `sessions` | `token_hash` (Primärschlüssel), `user_id`, `created_at`, `expires_at` |
| `progress` | `user_id`, `course_slug`, `step_id`, `completed_at` – Primärschlüssel aus den ersten drei |

Schritt-IDs sind dieselben wie im Browser (`<kapitel>` bzw. `<kapitel>/wissenstest`). Das Schema wird beim ersten Zugriff angelegt.

### 5.7 Inhalt des ersten Kurses
Quelle: `System_und_Prozessautomatisierung_Grundlagen.docx` (Kapitel; Kapitel 01 am 2026-10-03, Kapitel 02 und 03 am 2026-10-04 überarbeitet und erweitert, Freigabe-Entwürfe `Kapitel01_…_Entwurf.docx` bis `Kapitel03_…_Entwurf.docx`) und `Systemautomatisierung_Quiz.html` (410 Fragen), einmalig nach Markdown bzw. JSON übernommen. Danach sind die Dateien im Repository die maßgebliche Quelle.

| Modul | Kapitel | Fragen |
|---|---|---|
| 1 Grundlagen der Automatisierung | 01 Einführung in die Systemautomatisierung · 02 Überwachen wiederkehrender Systemabläufe | 65 · 69 |
| 2 Skriptsprachen: Bash und PowerShell | 03 Grundlagen von Bash und Shell-Scripting · 04 PowerShell Basics für Administratoren | 92 · 50 |
| 3 Fortgeschrittene Linux-Skripte | 05 Aufbau fortgeschrittener Linux-Skripte | 60 |
| 4 Prozesse und Strategien | 06 Analyse und Identifikation automatisierbarer Prozesse · 07 Entwurf von Automatisierungsstrategien | 35 · 46 |
| 5 Sicherheit und Fehlerbehandlung | 08 Sicherheitsaspekte bei der Automatisierung · 09 Erkennung und Handling von Fehlern in Skripten | 47 · 68 |
| Anhang | 10 Glossar | – |

## 6. Technische Entscheidungen

| Thema | Entscheidung | Begründung |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Statische Generierung, Datei-basiertes Routing |
| Styling | Tailwind CSS v4 über `styles/globals.css` | Schnell, Design-Tokens als CSS-Variablen |
| Markdown | `gray-matter` + `remark` / `remark-gfm` / `rehype-pretty-code` | Frontmatter + GFM-Tabellen + Code-Highlighting |
| Icons | `lucide-react` | Einheitlicher Linien-Stil, große Auswahl |
| Schrift | Plus Jakarta Sans für Text, JetBrains Mono für kleine technische Beschriftungen (via `next/font/google`) | Gut lesbar, Mono-Akzente passen zum IT-Thema |
| Rendering | Inhaltsseiten statisch (`generateStaticParams`); Anmeldung, Registrierung und Schnittstellen dynamisch | Inhalte bleiben schnell; Konten brauchen einen Node-Server |
| Fortschritt | Ohne Anmeldung `localStorage`, mit Anmeldung Datenbank; Sitzung und Fortschritt lädt der Browser über `/api/sitzung` | Inhaltsseiten bleiben statisch, Konto-Daten kommen nachträglich |
| Datenbank | SQLite über das in Node eingebaute `node:sqlite`, Datei `data/it-knowledge-hub.db` | Keine Zusatzdienste; kein natives Paket (Windows-Application-Control) |
| Anmeldung | Eigene Umsetzung: Server Actions, `scrypt`, Sitzungen in der Datenbank | Keine externen Abhängigkeiten, überschaubarer Umfang |
| Tests | Vitest + Testing Library | Schnell, gute Next.js-Integration |

**Abweichung von der vorgeschlagenen Ordnerstruktur:** Statt einer festen Seite `app/lerninhalte/system-und-prozessautomatisierung-grundlagen/page.tsx` werden dynamische Routen `app/lerninhalte/[kurs]/page.tsx` und `app/lerninhalte/[kurs]/[einheit]/page.tsx` verwendet. So braucht jeder weitere Kurs nur einen neuen Content-Ordner. Die URL bleibt identisch.

### Gestaltung und Design-Tokens
Eigenes Design: heller, kühler Hintergrund, weiße Karten mit feinem Rahmen, dunkle Schrift, Indigo als Akzent, Grün für „erledigt“. Inhalte stehen zentriert mit maximal 1152 px Breite.

```css
--color-canvas:        #f5f6fa;  /* Seitenhintergrund */
--color-surface:       #ffffff;  /* Karten, Kopfleiste */
--color-ink:           #151826;  /* Text, Überschriften */
--color-muted:         #5d6479;  /* Nebentext */
--color-line:          #e3e6ee;  /* Rahmen, Trennlinien */
--color-accent:        #4338ca;  /* Indigo: Links, Buttons, aktiver Zustand */
--color-accent-strong: #3730a3;  /* Hover */
--color-accent-soft:   #eef0ff;  /* Hinterlegung aktiver Navigation */
--color-success:       #047857;  /* erledigt / abgeschlossen */
--color-success-soft:  #e6f6ef;
--color-warning:       #b45309;  /* Hinweisbox „Wichtig/Achtung“ */
--color-warning-soft:  #fdf3e2;
--color-danger:        #b42318;  /* falsche Antwort im Wissenstest */
--color-danger-soft:   #fdecea;
--radius-card:         16px;
```

## 7. Nicht-funktionale Anforderungen
- **Barrierefreiheit:** Kacheln per Tastatur erreichbar, sichtbarer Fokus, Alt-Texte, Textkontrast ≥ 4.5:1
- **Performance:** Lighthouse Performance ≥ 90, Bilder über `next/image`
- **Sprache:** Oberfläche komplett Deutsch, `<html lang="de">`

## 8. Akzeptanzkriterien (MVP fertig, wenn …)
- [x] `/lerninhalte` zeigt die Kachel des Kurses mit Bild, Titel, Beschreibung, „1 Woche“, „5 Module · 9 Kapitel“ und „0% Fortschritt“ – automatisch geprüft 2026-10-03 (HTML)
- [x] Klick auf die Kachel öffnet die Kursseite mit 5 Modulen, 9 Kapiteln in richtiger Reihenfolge und dem Glossar als Anhang – automatisch geprüft 2026-10-03 (Loader-Tests, HTML)
- [ ] Seitenleiste im Kursplayer zeigt Module und Kapitel mit „Kapitel lesen“ und „Wissenstest“, aktueller Eintrag hervorgehoben
- [x] Wissenstest: 10 Fragen, Rückmeldung mit Erklärung, bei mindestens 8 richtigen gilt er als erledigt – automatisch geprüft 2026-10-03 (Komponententest)
- [x] Jedes Kapitel rendert Markdown inkl. Tabelle, Codeblock, Hinweisbox und eingeklappter Musterlösung korrekt – automatisch geprüft 2026-10-03 (Tests, HTML)
- [ ] „Als erledigt markieren“ in 1 von 18 Lernschritten → Kachel zeigt „6% Fortschritt“, auch nach Neuladen
- [ ] Alle 18 Lernschritte erledigt → Kachel zeigt „Abgeschlossen“ mit Häkchen
- [x] Zurück/Weiter folgt der Reihenfolge Kapitel → Wissenstest → nächstes Kapitel; am Anfang ist „Zurück“ deaktiviert – automatisch geprüft 2026-10-03 (Tests)
- [x] Unbekannter Kurs/Einheit → 404-Seite – automatisch geprüft 2026-10-03 (HTTP 404)
- [ ] Layout funktioniert bei 375 px Breite ohne horizontales Scrollen
- [ ] Registrieren, Anmelden und Abmelden funktionieren; Fehlermeldungen bei ungültigen Eingaben und falschem Passwort
- [ ] Ohne Anmeldung führt jede Seite unter `/lerninhalte` zur Anmeldung und danach zurück zur gewünschten Seite
- [ ] Angemeldet als `testuser`: Fortschritt bleibt nach Abmelden/Anmelden und in einem anderen Browser erhalten; vorhandener Browser-Fortschritt wurde übernommen
- [x] Vorlesen: Kapitel wird abschnittsweise vorgelesen, Tabellen zeilenweise, Code wird übersprungen, aktueller Abschnitt ist hervorgehoben – automatisch geprüft 2026-10-03 mit simulierter Sprachausgabe; echte Stimme noch im Browser prüfen
- [x] `npm run build`, `npm run lint` und `npm test` laufen fehlerfrei – automatisch geprüft 2026-10-03 (79 Tests)

## 9. Ausblick (nach MVP)
Alle späteren Features und offenen Entscheidungen werden in [todo.md](todo.md) gepflegt.
