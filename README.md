# it-knowledge-hub

Zentrale Lernplattform für IT-Inhalte mit strukturierten Lerneinheiten, praxisnahen Übungen und verständlich aufbereiteten Grundlagen zu technischen und organisatorischen Themen.

Kursgruppe **IT Administration und Automation** mit den Kursen **Einführung in System- und Prozessautomatisierung** – 3 Module, 5 Kapitel, Glossar und 5 Wissenstests – und **Netzwerkautomatisierung und Tools** – 3 Module, 6 Kapitel und 6 Wissenstests.

## Funktionen

- Kursübersicht mit Kurskacheln und Fortschritt
- Kursseite mit Modulen, Kapiteln und Status je Lernschritt
- Kursplayer mit Seitenleiste, Zurück/Weiter und Lesefortschritt
- Wissenstest je Kapitel: 10 zufällige Fragen, Rückmeldung mit Erklärung, bestanden ab 80 %
- Vorlesen von Kapiteln über die Sprachausgabe des Browsers
- Konto mit Registrierung und Anmeldung: Fortschritt in einer SQLite-Datenbank, auf allen Geräten verfügbar
- Lerninhalte nur mit Anmeldung; offen sind Startseite, „Über uns“, Anmelden und Registrieren
- Fortschritt, der früher ohne Anmeldung im Browser gespeichert wurde, wird beim Anmelden ins Konto übernommen

## Starten

Voraussetzung: Node.js 24.

```bash
npm install
npm run dev            # http://localhost:3000
npm run db:seed        # Testkonto testuser / testuser123 anlegen (nur Entwicklung)
```

Die Datenbank liegt in `data/it-knowledge-hub.db` und wird beim ersten Zugriff angelegt.

Weitere Befehle:

```bash
npm test               # Tests (Vitest)
npm run lint           # ESLint
npm run build          # Produktions-Build (statische Seiten)
```

> Das Repository liegt in OneDrive. Während der Arbeit die OneDrive-Synchronisierung pausieren, sonst kann es bei `npm install` und `npm run build` zu Dateisperren kommen.

## Struktur

| Ordner | Inhalt |
|---|---|
| `app/` | Seiten und Routen (Next.js App Router) |
| `components/` | Oberfläche: Layout, Navigation, Lernbausteine, allgemeine Bausteine |
| `content/lerninhalte/` | Kursinhalte als Markdown und Wissenstests als JSON |
| `lib/` | Einlesen der Inhalte, Fortschritt, Wissenstest, Vorlesen |
| `types/` | gemeinsame Typen |
| `tests/` | automatische Tests |
| `docs/` | Feature-Spec, laufender Plan, ToDo, Historie, `Archiv/` mit abgeschlossenen Plänen |

Details zu Anforderungen und Inhaltsformat: [docs/feature-spec.md](docs/feature-spec.md). Arbeitskonventionen: [CLAUDE.md](CLAUDE.md).

## Neuen Kurs anlegen

1. Ordner `content/lerninhalte/<kurs-slug>/` anlegen (Kleinbuchstaben, Ziffern, Bindestriche).
2. `README.md` mit Kurs-Metadaten:

   ```yaml
   ---
   title: "Kurstitel"
   description: "Kurzbeschreibung"
   duration: "1 Woche"
   image: "/images/kurse/mein-kurs.svg"
   level: "Einsteiger"
   modules:
     - title: "Erstes Modul"
       chapters: ["erstes-kapitel", "zweites-kapitel"]
   ---
   ```

3. Kapitel als `01-erstes-kapitel.md`, `02-zweites-kapitel.md` … mit Frontmatter `title`, `description`, `duration`. Anhänge wie ein Glossar bekommen `anhang: true`.
4. Optional je Kapitel einen Wissenstest unter `wissenstest/<kapitel-slug>.json` (mindestens 10 Fragen; die erste Antwort ist jeweils die richtige).
5. Kursbild nach `public/images/kurse/` legen.
6. `npm test` ausführen: Die Tests prüfen auch die Kursinhalte (Module, Pflichtfelder, Wissenstests).

Der Kurs erscheint danach automatisch in der Kursübersicht, ohne Änderungen am Code.
