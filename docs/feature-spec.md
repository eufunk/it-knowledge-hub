# Feature Spec: Lernplattform „IT Knowledge Hub“ – MVP

**Stand:** 2026-10-03
**Status:** Entwurf
**Erster Kurs:** `system-und-prozessautomatisierung-grundlagen`

---

## 1. Ziel

Eine schlanke Lernplattform, auf der Kurse als Kacheln angezeigt werden (siehe Referenz-Screenshot „Deine Kurse“). Ein Kurs besteht aus mehreren Lerneinheiten, die als Markdown-Dateien im Repo gepflegt werden. Lernende sehen ihren Fortschritt pro Kurs.

Das MVP liefert **einen vollständig nutzbaren Kurs** von der Übersicht bis zur letzten Lerneinheit.

## 2. Nicht-Ziele (MVP)

- Kein Login, keine Benutzerkonten, keine Datenbank
- Kein Livestream, keine News, kein Glossar, keine Notizen (Navigationseinträge aus dem Screenshot kommen später)
- Kein CMS – Inhalte werden direkt als Markdown im Repo gepflegt
- Kein Audio-Player (Widget unten rechts im Screenshot)

## 3. Nutzer & Kernszenarien

**Zielgruppe:** Lernende im IT-Umfeld (Umschulung / Weiterbildung), Einsteigerniveau.

| # | Als Lernende*r möchte ich … | damit … |
|---|---|---|
| S1 | alle Kurse als Kacheln mit Bild, Titel, Dauer und Anzahl Einheiten sehen | ich schnell einen Überblick habe |
| S2 | auf jeder Kachel meinen Fortschritt sehen (`0 % Fortschritt` … `Abgeschlossen`) | ich weiß, wo ich weitermachen muss |
| S3 | einen Kurs öffnen und die Liste seiner Einheiten sehen | ich den Aufbau verstehe |
| S4 | eine Einheit lesen und als erledigt markieren | mein Fortschritt steigt |
| S5 | zur nächsten / vorherigen Einheit springen | ich ohne Umweg weiterlernen kann |
| S6 | die Seite auch auf dem Handy nutzen | ich unterwegs lernen kann |

## 4. Funktionale Anforderungen

### 4.1 Layout & Navigation
- **F1** Feste Sidebar links (dunkles Petrol, siehe Screenshot) mit Logo und Icons + Label:
  - Home (`/`)
  - Lerninhalte (`/lerninhalte`) – aktiver Zustand hervorgehoben (helle „Pille“ hinter dem Icon)
  - Über uns (`/ueber-uns`)
- **F2** Mobil (< 768 px): Sidebar wird zur Bottom-Navigation.

### 4.2 Kursübersicht `/lerninhalte`
- **F3** Überschrift „Deine Kurse“, darunter Grid aus Kurskacheln (Desktop 4 Spalten, Tablet 2, Mobil 1).
- **F4** Kurskachel:
  - Hintergrundbild mit dunklem Verlauf von unten für Lesbarkeit
  - Badge oben links: Fortschrittskreis + `NN % Fortschritt`, bei 100 % Häkchen + `Abgeschlossen`
  - Unten: Titel (fett), darunter `Dauer: X · N Einheiten`
  - Ganze Kachel ist ein Link zur Kursseite, mit Hover- und Fokus-Zustand
- **F5** Kurse werden automatisch aus `content/lerninhalte/*` gelesen – neuer Ordner = neuer Kurs, kein Code nötig.

### 4.3 Kursseite `/lerninhalte/[kurs]`
- **F6** Kopfbereich: Bild, Titel, Beschreibung, Dauer, Anzahl Einheiten, Fortschrittsbalken.
- **F7** Liste der Einheiten in Reihenfolge, mit Status (offen / erledigt) und geschätzter Lesezeit.
- **F8** Button „Starten“ bzw. „Weiterlernen“ (springt zur ersten nicht erledigten Einheit).

### 4.4 Lerneinheit `/lerninhalte/[kurs]/[einheit]`
- **F9** Markdown wird gerendert inkl. Überschriften, Listen, Tabellen (GFM), Codeblöcke mit Syntax-Highlighting, Bilder.
- **F10** Button „Als erledigt markieren“ (umschaltbar).
- **F11** Navigation „← Vorherige“ / „Nächste →“ und Breadcrumb `Lerninhalte › Kurs › Einheit`.

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
| Icons | `lucide-react` | Entspricht dem Linien-Stil im Screenshot |
| Schrift | Outfit (via `next/font/google`) | Kommt der Schrift im Screenshot sehr nahe |
| Rendering | Statisch (`generateStaticParams`) | Kein Server nötig, schnell, hostbar auf Vercel |
| Fortschritt | Client-Komponente + `localStorage` | Kein Backend im MVP |
| Tests | Vitest + Testing Library | Schnell, gute Next.js-Integration |

**Abweichung von der vorgeschlagenen Ordnerstruktur:** Statt einer festen Seite `app/lerninhalte/system-und-prozessautomatisierung-grundlagen/page.tsx` werden dynamische Routen `app/lerninhalte/[kurs]/page.tsx` und `app/lerninhalte/[kurs]/[einheit]/page.tsx` verwendet. So braucht jeder weitere Kurs nur einen neuen Content-Ordner. Die URL bleibt identisch.

### Design-Tokens (aus dem Screenshot abgeleitet)
```css
--color-sidebar:   #0b3d4a;  /* dunkles Petrol */
--color-primary:   #0f766e;  /* Badge / Buttons */
--color-heading:   #0b2e3a;
--color-bg:        #ffffff;
--radius-card:     12px;
```

## 7. Nicht-funktionale Anforderungen
- **Barrierefreiheit:** Kacheln per Tastatur erreichbar, sichtbarer Fokus, Alt-Texte, Kontrast ≥ 4.5:1 auf Bildern (Verlauf)
- **Performance:** Lighthouse Performance ≥ 90, Bilder über `next/image`
- **Sprache:** Oberfläche komplett Deutsch, `<html lang="de">`

## 8. Akzeptanzkriterien (MVP fertig, wenn …)
- [ ] `/lerninhalte` zeigt die Kachel des Kurses mit Bild, Titel, „Dauer: 1 Woche · 5 Einheiten“ und „0 % Fortschritt“
- [ ] Klick auf die Kachel öffnet die Kursseite mit 5 Einheiten in richtiger Reihenfolge
- [ ] Jede Einheit rendert Markdown inkl. Tabelle und Codeblock korrekt
- [ ] „Als erledigt markieren“ in 1 von 5 Einheiten → Kachel zeigt „20 % Fortschritt“, auch nach Neuladen
- [ ] Alle 5 erledigt → Kachel zeigt „Abgeschlossen“ mit Häkchen
- [ ] Vor/Zurück-Navigation funktioniert, erste/letzte Einheit ohne toten Button
- [ ] Unbekannter Kurs/Einheit → 404-Seite
- [ ] Layout funktioniert bei 375 px Breite ohne horizontales Scrollen
- [ ] `npm run build`, `npm run lint` und `npm test` laufen fehlerfrei

## 9. Ausblick (nach MVP)
Alle späteren Features und offenen Entscheidungen werden in [todo.md](todo.md) gepflegt.
