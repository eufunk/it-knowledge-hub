# CLAUDE.md

Arbeitskonventionen und Hinweise für Claude Code (claude.ai/code) in diesem Repository.

@AGENTS.md

IT Knowledge Hub: Lernplattform (Lerninhalte nur mit Anmeldung) mit Next.js 16 (App Router, TypeScript), auf der Kurse als Kacheln angezeigt werden und aus Lerneinheiten bestehen, die als Markdown im Repository liegen. Ohne Anmeldung wird der Lernfortschritt im Browser gespeichert (`localStorage`), mit Konto in einer SQLite-Datenbank (`node:sqlite`). Die Inhaltsseiten sind statisch; Anmeldung, Registrierung und die Schnittstellen unter `app/api/` laufen auf dem Node-Server. Erster Kurs: `system-und-prozessautomatisierung-grundlagen`. Projektsprache ist Deutsch: Oberflächentexte, Kursinhalte, Dokumentation, Commit-Nachrichten und Code-Kommentare.

## Fachliche Referenz

`docs/feature-spec.md` ist die verbindliche fachliche Spezifikation. Bei Änderungen an Anforderungen wird **zuerst dort nachgezogen, dann der Code angepasst**, nicht umgekehrt. Bei Unsicherheit, ob eine Umsetzung noch das tut, was fachlich vereinbart wurde, dort nachschlagen.

Die Ablage der Dokumentation ist so aufgeteilt:

| Datei | Inhalt |
|---|---|
| `docs/feature-spec.md` | nur der **Ist- bzw. Soll-Zustand** des aktuellen Umfangs |
| `docs/HISTORIE.md` | reine Historie: wann sich was geändert hat, frühere Verhaltensweisen, entfernte oder umbenannte Funktionen und Kennungen |
| `docs/todo.md` | alles, was **noch nicht umgesetzt** ist, aber irgendwann umgesetzt werden muss: offene Entscheidungen, spätere Features, Platzhalter, technische Schulden |
| `docs/plan_TT.MM.JJ.md` | Umsetzungsplan für einen Arbeitstag, benannt nach dem Datum (z. B. `plan_03.10.26.md`) |
| `docs/Archiv/` | abgeschlossene Pläne |

Was verschoben, nur als Platzhalter umgesetzt oder offen gelassen wird, kommt **sofort** in `docs/todo.md`. Specs und Pläne verweisen darauf, statt eigene Listen zu führen. Erledigte Punkte werden dort abgehakt und mit Datum versehen, nicht gelöscht.

Ist ein Plan vollständig umgesetzt (alle Blöcke erledigt oder bewusst in `docs/todo.md` verschoben), wird er mit `git mv` nach `docs/Archiv/` verschoben und im selben Commit festgehalten. Im Ordner `docs/` liegt damit immer nur der laufende Plan.

### Nachverfolgbarkeit der Anforderungen

Jede prüfbare funktionale Anforderung in `docs/feature-spec.md` trägt eine Kennung (`F1`, `F2`, …). Wer eine solche Anforderung umsetzt oder testet, schreibt dieselbe Kennung als Klartext in den Kommentar der zuständigen Komponente oder Funktion bzw. in den `describe`-Block des Tests, z. B. `// F4: Kurskachel`. Ein reines Textvorkommen genügt. Neue Anforderungen bekommen beim Anlegen die nächste freie Nummer. Kennungen werden nie neu vergeben. Umbenannte oder entfernte Kennungen werden in `docs/HISTORIE.md` festgehalten.

Ein Prüfskript, das fehlende Verweise automatisch findet, ist geplant (siehe `docs/todo.md`).

## Commit-Konvention

- Nach jedem abgeschlossenen und geprüften logischen Schritt wird **selbstständig committet**, nicht erst am Ende einer größeren Aufgabe. Ein logischer Schritt ist z. B. ein Block aus dem Tagesplan oder eine Komponente samt Tests, deren Tests grün laufen. Vor jedem Commit `npm run lint` und `npm test` ausführen.
- **Gepusht wird nur auf ausdrückliche Anweisung.**
- Commit-Nachrichten auf Deutsch, erste Zeile als knappe Zusammenfassung, darunter die wesentlichen Punkte.
- Fremde, nicht selbst erstellte Dateien im Arbeitsverzeichnis (z. B. eigene Notizen) nicht ungefragt mitcommitten. Dateien daher gezielt per Pfad hinzufügen statt mit `git add -A`.
- Diese Konvention gilt dauerhaft, auch für künftige Änderungen.

Ein Pre-Commit-Hook, der Lint und Tests technisch erzwingt, ist geplant (siehe `docs/todo.md`). Bis dahin gilt die Prüfung von Hand.

## Befehle

Windows, Node.js 24, npm:

```bash
npm install            # Abhängigkeiten installieren
npm run dev            # Entwicklungsserver, http://localhost:3000
npm run build          # Produktions-Build (prüft auch Typen und statische Seiten)
npm run lint           # ESLint
npm test               # alle Tests (Vitest, einmaliger Lauf)
npm run test:watch     # Tests im Beobachtungsmodus
npm run db:seed        # Testkonto testuser / testuser123 anlegen (nur Entwicklung)
npx vitest run tests/content/courses.test.ts   # einzelne Testdatei
```

- Neue Abhängigkeiten immer mit `npm install <paket>` (bzw. `-D` für Entwicklungswerkzeuge), damit `package.json` und `package-lock.json` im selben Schritt aktualisiert werden. `package-lock.json` wird mitcommittet.
- **Unter Windows kann ein alter Dev-Server den Port 3000 belegen.** Next.js weicht dann still auf 3001 aus. Nach dem Start die ausgegebene Adresse prüfen. Belegte Ports zeigt `netstat -ano | grep ":3000 "` (ein deutsches Windows zeigt `ABHÖREN` statt `LISTEN`).
- **Windows Application Control:** Blockiert Windows die native Datei `next-swc.win32-x64-msvc.node` („An Application Control policy has blocked this file“), startet Turbopack nicht. Dann `npx next dev --webpack -p 3001` verwenden (siehe `docs/todo.md`).
- Prüfskripte und Bildschirmfotos (z. B. mit Playwright) gehören ins temporäre Arbeitsverzeichnis der Sitzung, nie ins Repository.

## Architektur im Überblick

**Ordnerstruktur:**

| Ordner | Inhalt |
|---|---|
| `app/` | Routen (App Router): `page.tsx` (Home), `lerninhalte/page.tsx` (Kursübersicht), `lerninhalte/[kurs]/page.tsx` (Kursseite), `lerninhalte/[kurs]/[einheit]/page.tsx` (Kapitel im Kursplayer), `lerninhalte/[kurs]/[einheit]/wissenstest/page.tsx` (Wissenstest), `anmelden/`, `registrieren/`, `konto/actions.ts` (Server Actions), `api/sitzung` und `api/fortschritt` (Route Handler), `ueber-uns/page.tsx` |
| `components/` | `layout/` (AppShell), `navigation/` (Kopfleiste), `learning/` (Kurskachel, Kursinhalt nach Modulen, Kursplayer mit Seitenleiste `CourseNav`, Zurück/Weiter, Lesefortschritt, Wissenstest `QuizRunner`, Fortschritt), `ui/` (allgemeine Bausteine wie Fortschrittsbalken, Button, Breadcrumb) |
| `content/lerninhalte/<kurs>/` | Kursinhalte: `README.md` mit Kurs-Frontmatter inkl. `modules`, Kapitel als `NN-slug.md` (Anhänge mit `anhang: true`), Fragen-Pools als `wissenstest/<slug>.json` (erste Antwort = richtige) |
| `lib/` | `content/` (Einlesen und Rendern der Inhalte), `utils/` (reine Hilfsfunktionen, z. B. Fortschrittsberechnung) |
| `types/` | gemeinsame Typen, `learning.ts` (`Course`, `LessonMeta`, `Lesson`) |
| `styles/` | `globals.css` mit Tailwind und Design-Tokens |
| `public/` | `images/`, `icons/`, `documents/` |
| `tests/` | `components/`, `content/` |
| `docs/` | Spec, laufender Plan, ToDo, Historie, `Archiv/` mit abgeschlossenen Plänen |

**Routen sind dynamisch.** Kurse werden über `[kurs]` und `[einheit]` abgebildet, nicht über feste Ordner pro Kurs. Ein neuer Kurs braucht nur einen neuen Ordner unter `content/lerninhalte/`, keinen neuen Code. Alle Seiten werden statisch erzeugt (`generateStaticParams`). Unbekannte Kurse oder Einheiten führen zu `notFound()`.

**Inhalte:** Der Slug einer Einheit ist der Dateiname ohne Nummernpräfix und Endung (`01-einfuehrung.md` → `einfuehrung`). Die Reihenfolge ergibt sich aus dem Präfix. Kurs- und Einheiten-Metadaten stehen im YAML-Frontmatter (Felder siehe `docs/feature-spec.md`, Abschnitt 5). Inhalte werden ausschließlich über `lib/content/` gelesen. Keine Komponente liest selbst Dateien aus `content/`.

**Next.js 16:** Vor dem Schreiben von Routen- oder Konfigurationscode die mitgelieferte Doku unter `node_modules/next/dist/docs/` lesen (siehe `AGENTS.md`), besonders `01-app/02-guides/upgrading/version-16.md`. Wichtig hier: `params` in Seiten, Layouts und `generateMetadata` ist ein **Promise** und wird mit `await` gelesen. Seiten- und Layout-Props werden mit den globalen Typen `PageProps<"/route">` bzw. `LayoutProps<"/route">` typisiert. `AGENTS.md` wird von `next dev` gepflegt und nicht von Hand geändert.

**Konten und Datenbank (F21–F25):** Alles Serverseitige liegt in `lib/server/`: `db.ts` (Verbindung, Schema), `password.ts` (scrypt), `accounts.ts` (Konten, Sitzungen), `progress.ts` (Fortschritt), `progress-input.ts` (Prüfung gegen die Kursinhalte), `session.ts` (Cookie, nur in Server Actions/Route Handlern). `db.ts`, `password.ts`, `accounts.ts` und `progress.ts` importieren nur `node:*` und sich gegenseitig mit relativer `.ts`-Endung, damit `scripts/db-seed.ts` sie direkt mit Node ausführen kann – dort keine `@/`-Importe verwenden. Der Datenbankpfad kommt aus `databasePath()` und lässt sich mit `IKH_DB_PATH` umlenken (Tests). Im Browser hält `lib/utils/account-store.ts` Anmeldestatus und Konto-Fortschritt; `progress-store.ts` entscheidet, ob Browser oder Konto gilt. **Zugangsschutz (F26):** `proxy.ts` im Projektstamm lässt `/lerninhalte` und alles darunter nur mit gültiger Sitzung durch, sonst Weiterleitung zu `/anmelden?weiter=…`. Neue geschützte Bereiche dort in `config.matcher` eintragen. Server Actions und Route Handler prüfen die Anmeldung trotzdem selbst. Seiten, die Konto-Daten brauchen, lesen sie im Browser über `/api/sitzung` – keine `cookies()` in Layouts oder Inhaltsseiten, sonst werden sie dynamisch.

**Server- und Client-Komponenten:** Seiten und alles, was Inhalte liest, sind Server-Komponenten. Nur Bausteine, die `localStorage` oder Browser-Ereignisse brauchen (Fortschritt, „Als erledigt markieren“, aktiver Navigationspunkt), sind Client-Komponenten mit `"use client"`. Diese Grenze möglichst weit unten im Komponentenbaum ziehen.

## Tests

- **Lernschritte:** Fortschritt, Zurück/Weiter und „Weiterlernen“ basieren auf `lib/utils/steps.ts` (`getCourseSteps`). Schritt-IDs sind `<kapitel>` und `<kapitel>/wissenstest`; sie sind die Werte im `localStorage`. IDs nicht umbenennen, sonst geht gespeicherter Fortschritt verloren (oder den Speicherschlüssel versionieren).
- **Vorlesen (F20):** `ReadAloudPlayer` nutzt `window.speechSynthesis`. Was vorgelesen wird, bestimmt `extractSegments` in `lib/utils/speech.ts`; neue Inhaltselemente (z. B. eigene Komponenten im Markdown) dort berücksichtigen. Pausieren bricht ab und setzt am aktuellen Satz neu an, weil `speechSynthesis.pause()` in Chrome unzuverlässig ist.
- **Hinweisboxen:** Ein Blockzitat wird zur Box, wenn es mit `**Definition:**`, `**Tipp:**`, `**Wichtig:**`, `**Achtung:**`, `**Hinweis:**`, `**Merke:**` oder `**Kurz gesagt:**` beginnt (`lib/content/markdown.ts`, Styles in `styles/globals.css`).
- Tests liegen in `tests/` (nicht neben den Komponenten), gegliedert in `content/` (Loader, Markdown, reine Funktionen), `components/` (Rendering mit Testing Library) und `server/` (Datenbank, Konten – jeweils mit temporärer Datenbank über `IKH_DB_PATH`). Dateinamen: `<name>.test.ts` bzw. `.test.tsx`.
- Vor dem Anlegen einer neuen Testdatei prüfen, ob es für dieselbe Komponente schon eine gibt (Glob `tests/**/*.test.*`). Lieber ergänzen als eine zweite Datei daneben anlegen.
- Loader-Tests arbeiten mit eigenen Testinhalten (kleiner Fixture-Ordner), nicht mit dem echten Kurs. Sonst bricht jede inhaltliche Änderung am Kurs die Tests.
- Fortschrittslogik als reine Funktion testen (`calcProgress(done, total)`), inkl. Randfällen: 0 Einheiten, alle erledigt, Rundung.
- Logik, die vom heutigen Datum abhängt (falls sie später dazukommt), bekommt „heute“ als Parameter, statt intern `new Date()` aufzurufen. So bleiben Tests stabil.

## Datenablage

| Ort | Inhalt | Versioniert? |
|---|---|---|
| `content/lerninhalte/` | Kursinhalte (Markdown) | **ja**, das sind die Primärdaten |
| `public/images/` | Kursbilder (Herkunft und Lizenz in der Commit-Nachricht oder in `docs/` notieren) | ja |
| `localStorage` im Browser | Lernfortschritt ohne Anmeldung, ein Schlüssel pro Kurs (`progress:v1:<kurs>`); Vorlese-Einstellungen (`vorlesen:v1`) | nein, nur beim jeweiligen Browser |
| `data/it-knowledge-hub.db` | Konten (Passwort-Hashes), Sitzungen, Fortschritt angemeldeter Nutzer | **nein** (gitignored) – Primärdaten, vor Schemaänderungen sichern |

- Jeder Zugriff auf `localStorage` steht in `try/catch` und fällt auf 0 % zurück (F14). Er kann in privaten Fenstern oder bei blockierten Website-Daten fehlschlagen.
- Ändert sich das Format der gespeicherten Fortschrittsdaten, wird der Schlüssel versioniert (z. B. `progress:v2:<kurs>`), damit alte Daten nicht zu Fehlern führen.

## Vereinbarungen und Stolperfallen

- **Dokumentation mitpflegen.** Reihenfolge bei fachlichen Änderungen: `docs/feature-spec.md` → Code → `docs/HISTORIE.md` (Eintrag mit Datum) → `docs/todo.md` (Status). Alles durchgehend auf Deutsch.
- **OneDrive:** Das Repository liegt in OneDrive und bleibt dort (Verschieben ist ausgeschlossen). Ein Ausschluss einzelner Ordner ist bei einem privaten OneDrive nicht möglich, eine Junction für `node_modules` ersetzt `npm install` stillschweigend durch einen normalen Ordner. Vereinbart ist deshalb: Die Synchronisierung wird beim Entwickeln pausiert. Bei Dateisperren (`EPERM`, `EBUSY`) zuerst den Dev-Server beenden, OneDrive pausieren und den Befehl wiederholen, bevor der Code verdächtigt wird.
- **Hydration:** Server-HTML kennt keinen `localStorage`. Fortschrittsanzeigen rendern zuerst den neutralen Zustand (0 %) und lesen den gespeicherten Wert erst in `useEffect`. Sonst gibt es Hydration-Warnungen.
- **Markdown-HTML:** Gerendertes Markdown wird per `dangerouslySetInnerHTML` eingefügt, und der Renderer lässt HTML im Markdown zu (`rehype-raw`, z. B. für `<details>` bei Musterlösungen). Das ist nur zulässig, weil die Inhalte aus dem eigenen Repository stammen. Inhalte aus fremden Quellen (später z. B. ein CMS oder Eingaben von Nutzern) müssen vorher bereinigt werden (z. B. `rehype-sanitize`).
- **Gestaltung:** Eigenes Design, keine Nachbildung des Referenz-Screenshots. Farben nur über die Tokens in `styles/globals.css` (z. B. `bg-accent`, `text-muted`, `border-line`), keine fest eingetragenen Hex-Werte in Komponenten. Neue Tokens zuerst in der Spec (Abschnitt 6) ergänzen.
- **Bilder:** Immer über `next/image` mit sinnvollem `alt`-Text. Kein Text auf Bildern, damit der Kontrast nicht vom Bild abhängt.
- **`hidden`-Attribut gegen eigene `display`-Regel:** Eine Klasse mit `display: …` (auch Tailwind `flex`, `grid`) hebt das `hidden`-Attribut auf. Ein- und Ausblenden deshalb über bedingtes Rendern oder `hidden`-Klassen lösen, nicht über das Attribut.
- **Barrierefreiheit:** Interaktive Elemente sind per Tastatur erreichbar und haben einen sichtbaren Fokus. `<html lang="de">`.
