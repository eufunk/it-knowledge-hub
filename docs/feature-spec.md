# Feature Spec: Lernplattform „IT Knowledge Hub“ – MVP

**Stand:** 2026-10-03
**Status:** Entwurf
**Erster Kurs:** `system-und-prozessautomatisierung-grundlagen`

---

## 1. Ziel

Eine schlanke Lernplattform, auf der Kurse als Kacheln angezeigt werden. Ein Referenz-Screenshot diente als Anregung für den Funktionsumfang; Layout und Farben sind ein eigenes Design (siehe Abschnitt 6, „Gestaltung“). Ein Kurs besteht aus mehreren Lerneinheiten, die als Markdown-Dateien im Repo gepflegt werden. Lernende sehen ihren Fortschritt pro Kurs.

Das MVP liefert **einen vollständig nutzbaren Kurs** von der Übersicht bis zur letzten Lerneinheit.

## 2. Nicht-Ziele (MVP)

- Kein Login, keine Benutzerkonten, keine Datenbank
- Kein Livestream, keine News, kein Glossar, keine Notizen (kommen später, siehe `docs/todo.md`)
- Kein CMS – Inhalte werden direkt als Markdown im Repo gepflegt
- Kein Audio-Player

## 3. Nutzer & Kernszenarien

**Zielgruppe:** Lernende im IT-Umfeld (Umschulung / Weiterbildung), Einsteigerniveau.

| # | Als Lernende*r möchte ich … | damit … |
|---|---|---|
| S1 | alle Kurse als Kacheln mit Bild, Titel, Kurzbeschreibung, Dauer und Anzahl Einheiten sehen | ich schnell einen Überblick habe |
| S2 | auf jeder Kachel meinen Fortschritt sehen (`0 % Fortschritt` … `Abgeschlossen`) | ich weiß, wo ich weitermachen muss |
| S3 | einen Kurs öffnen und die Liste seiner Einheiten sehen | ich den Aufbau verstehe |
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
  - Text: Niveau (z. B. „Einsteiger“), Titel (fett), Kurzbeschreibung (max. 2 Zeilen), Dauer und Anzahl Einheiten mit Icons
  - Unten: Fortschrittsbalken
  - Ganze Kachel ist ein Link zur Kursseite, mit Hover- und Fokus-Zustand
- **F5** Kurse werden automatisch aus `content/lerninhalte/*` gelesen – neuer Ordner = neuer Kurs, kein Code nötig.

### 4.3 Kursseite `/lerninhalte/[kurs]`
- **F6** Kopfbereich: Bild, Titel, Beschreibung, Dauer, Anzahl Einheiten, Fortschrittsbalken.
- **F7** Einheiten als Zeitleiste in Reihenfolge: nummerierter Punkt (bei „erledigt“ grün mit Häkchen), Titel, Kurzbeschreibung und Dauer. Daneben (mobil darüber) eine Fortschrittskarte, die beim Scrollen stehen bleibt.
- **F8** Button „Starten“ bzw. „Weiterlernen“ (springt zur ersten nicht erledigten Einheit).

### 4.4 Lerneinheit `/lerninhalte/[kurs]/[einheit]`
- **F9** Markdown wird gerendert inkl. Überschriften, Listen, Tabellen (GFM), Codeblöcke mit Syntax-Highlighting, Bilder.
- **F10** Button „Als erledigt markieren“ (umschaltbar).
- **F11** Navigation „← Vorherige“ / „Nächste →“ (bei der letzten Einheit „Zur Kursübersicht“) und Breadcrumb `Lerninhalte › Kurs › Einheit`. Ab 1024 px zusätzlich links eine Inhaltsübersicht des Kurses mit Fortschritt, Status je Einheit und hervorgehobener aktueller Einheit.

### 4.5 Fortschritt
- **F12** Fortschritt wird im Browser (`localStorage`) gespeichert, Schlüssel pro Kurs.
- **F13** Fortschritt = erledigte Einheiten / alle Einheiten, gerundet auf ganze Prozent.
- **F14** Ohne gespeicherte Daten (oder wenn `localStorage` blockiert ist) wird 0 % angezeigt – die Seite darf nicht abstürzen.

## 5. Inhaltsmodell

### 5.1 Ordnerstruktur
```
content/lerninhalte/system-und-prozessautomatisierung-grundlagen/
├── README.md                     ← Kurs-Metadaten + Beschreibung
├── 01-einfuehrung.md
├── 02-grundlagen.md
├── 03-systemautomatisierung.md
├── 04-prozessautomatisierung.md
└── 05-uebungen.md
```
Slug der Einheit = Dateiname ohne Nummer und Endung (`01-einfuehrung.md` → `einfuehrung`). Reihenfolge = Nummernpräfix.

Regeln für das Einlesen:
- Nur Ordner mit `README.md` sind Kurse, andere Ordner werden ignoriert.
- Nur Dateien nach dem Muster `NN-slug.md` (Kleinbuchstaben, Ziffern, Bindestriche) sind Einheiten, andere Dateien werden ignoriert.
- Kurse werden nach Slug sortiert, Einheiten numerisch nach Präfix (`10-…` nach `02-…`).
- Fehlt ein Pflichtfeld im Frontmatter (Kurs: `title`, `description`, `duration`, `image`; Einheit: `title`), bricht der Build mit einer Fehlermeldung ab, die die Datei nennt.

### 5.2 Frontmatter Kurs (`README.md`)
```yaml
---
title: "System- und Prozessautomatisierung – Grundlagen"
description: "Wie du wiederkehrende IT-Aufgaben und Geschäftsprozesse automatisierst."
duration: "1 Woche"
image: "/images/kurse/system-und-prozessautomatisierung.jpg"
level: "Einsteiger"
---
```

### 5.3 Frontmatter Einheit
```yaml
---
title: "Einführung"
description: "Was ist Automatisierung und warum lohnt sie sich?"
duration: "20 Minuten"
---
```

### 5.4 Typen (`types/learning.ts`)
```ts
export interface Course {
  slug: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  level?: string;
  lessons: LessonMeta[];
}

export interface LessonMeta {
  slug: string;
  order: number;
  title: string;
  description?: string;
  duration?: string;
}

export interface Lesson extends LessonMeta {
  courseSlug: string;
  html: string;
}
```

### 5.5 Inhalt des ersten Kurses (Gliederung)
| Nr. | Einheit | Inhalte |
|---|---|---|
| 01 | Einführung | Was ist Automatisierung? Nutzen, Risiken, typische Einsatzfelder |
| 02 | Grundlagen | Begriffe (Trigger, Aktion, Workflow, Idempotenz), Skript vs. Tool vs. Plattform |
| 03 | Systemautomatisierung | PowerShell/Bash-Grundlagen, geplante Tasks/Cron, Benutzer- & Dateiverwaltung automatisieren |
| 04 | Prozessautomatisierung | Prozesse modellieren (BPMN light), RPA, Low-Code (Power Automate, n8n), APIs & Webhooks |
| 05 | Übungen | Praxisaufgaben mit Lösungshinweisen zu 03 und 04 |

## 6. Technische Entscheidungen

| Thema | Entscheidung | Begründung |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Statische Generierung, Datei-basiertes Routing |
| Styling | Tailwind CSS v4 über `styles/globals.css` | Schnell, Design-Tokens als CSS-Variablen |
| Markdown | `gray-matter` + `remark` / `remark-gfm` / `rehype-pretty-code` | Frontmatter + GFM-Tabellen + Code-Highlighting |
| Icons | `lucide-react` | Einheitlicher Linien-Stil, große Auswahl |
| Schrift | Plus Jakarta Sans für Text, JetBrains Mono für kleine technische Beschriftungen (via `next/font/google`) | Gut lesbar, Mono-Akzente passen zum IT-Thema |
| Rendering | Statisch (`generateStaticParams`) | Kein Server nötig, schnell, hostbar auf Vercel |
| Fortschritt | Client-Komponente + `localStorage` | Kein Backend im MVP |
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
--radius-card:         16px;
```

## 7. Nicht-funktionale Anforderungen
- **Barrierefreiheit:** Kacheln per Tastatur erreichbar, sichtbarer Fokus, Alt-Texte, Textkontrast ≥ 4.5:1
- **Performance:** Lighthouse Performance ≥ 90, Bilder über `next/image`
- **Sprache:** Oberfläche komplett Deutsch, `<html lang="de">`

## 8. Akzeptanzkriterien (MVP fertig, wenn …)
- [ ] `/lerninhalte` zeigt die Kachel des Kurses mit Bild, Titel, Beschreibung, „1 Woche“, „5 Einheiten“ und „0% Fortschritt“
- [ ] Klick auf die Kachel öffnet die Kursseite mit 5 Einheiten in richtiger Reihenfolge
- [ ] Jede Einheit rendert Markdown inkl. Tabelle und Codeblock korrekt
- [ ] „Als erledigt markieren“ in 1 von 5 Einheiten → Kachel zeigt „20% Fortschritt“, auch nach Neuladen
- [ ] Alle 5 erledigt → Kachel zeigt „Abgeschlossen“ mit Häkchen
- [ ] Vor/Zurück-Navigation funktioniert, erste/letzte Einheit ohne toten Button
- [ ] Unbekannter Kurs/Einheit → 404-Seite
- [ ] Layout funktioniert bei 375 px Breite ohne horizontales Scrollen
- [ ] `npm run build`, `npm run lint` und `npm test` laufen fehlerfrei

## 9. Ausblick (nach MVP)
Alle späteren Features und offenen Entscheidungen werden in [todo.md](todo.md) gepflegt.
