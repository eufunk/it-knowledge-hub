# Umsetzungsplan – 2026-10-03

Ziel für heute: **MVP laut [feature-spec.md](feature-spec.md) lauffähig**, mit dem ersten Kurs `system-und-prozessautomatisierung-grundlagen`.
Geschätzter Aufwand: ca. 6–7 Stunden. Nach jedem Block wird committet.

---

## Block 1 – Projekt-Setup (≈ 45 min) ✅ erledigt 2026-10-03
- [x] Next.js-Projekt im bestehenden Repo anlegen:
      `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"`
      (vorhandene `README.md` / `.gitignore` behalten)
- [x] `globals.css` nach `styles/globals.css` verschieben, Import in `app/layout.tsx` anpassen
- [x] Abhängigkeiten: `gray-matter remark remark-gfm remark-rehype rehype-stringify rehype-pretty-code shiki lucide-react`
- [x] Dev-Abhängigkeiten: `vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom`
- [x] Ordner anlegen: `components/{layout,navigation,learning,ui}`, `lib/{content,utils}`, `types`, `public/{images,icons,documents}`, `tests/{components,content}`
- [x] Scripts in `package.json`: `test`, `test:watch`
- [x] ✅ Check: `npm run dev` startet, Startseite erreichbar
- [x] Commit: `Next.js-Projekt aufsetzen`

> Abweichungen: Next.js 16 statt 15 (aktuelle Version von create-next-app). Gerüst im temporären Ordner erzeugt und übernommen, weil create-next-app in einen Ordner mit README.md/CLAUDE.md nicht schreibt. `@types/node` auf 24 angehoben (passend zu Node 24, sonst Konflikt mit vitest 5). Zusätzlich `@tailwindcss/typography` und `@testing-library/dom` installiert.

> ⚠️ Das Repo liegt in OneDrive. Während der Arbeit die OneDrive-Synchronisierung pausieren (Taskleiste → OneDrive → Zahnrad → „Synchronisierung anhalten“), sonst kann es bei `npm install` und `npm run build` zu Dateisperren kommen.

## Block 2 – Inhaltsmodell & Content-Loader (≈ 1 h) ✅ erledigt 2026-10-03
- [x] `types/learning.ts` mit `Course`, `LessonMeta`, `Lesson` (siehe Spec 5.4)
- [x] `lib/content/courses.ts`:
  - `getAllCourses(): Course[]` – liest alle Ordner in `content/lerninhalte`
  - `getCourse(slug): Course | null`
  - `getLesson(courseSlug, lessonSlug): Promise<Lesson | null>`
  - `getAdjacentLessons(course, lessonSlug)` → `{ prev, next }`
- [x] `lib/content/markdown.ts`: `markdownToHtml()` (remark-gfm + rehype-pretty-code)
- [x] `lib/utils/progress.ts`: reine Funktion `calcProgress(done, total)` → Prozent
- [x] Tests in `tests/content/`: Sortierung nach Nummernpräfix, Slug-Bildung, unbekannter Slug → `null`, `calcProgress` (0, 20, 100, total = 0)
- [x] Commit: `Content-Loader für Kurse und Lerneinheiten`

> Ergänzt: Pflichtfelder im Frontmatter werden geprüft, Regeln für das Einlesen in der Spec (Abschnitt 5.1). Tests arbeiten mit eigenem Testinhalt unter `tests/content/fixtures/`.

## Block 3 – Kursinhalt schreiben (≈ 1,5 h, parallel zu Block 4 möglich)
> Stand: Kursgerüst mit Metadaten, Platzhalter-Kursbild (SVG) und fünf Einheiten mit Gliederung angelegt, damit die Oberfläche etwas zeigt. Die eigentlichen Texte fehlen noch.
- [ ] `README.md` mit Kurs-Frontmatter
- [ ] `01-einfuehrung.md` – Was ist Automatisierung, Nutzen, Risiken
- [ ] `02-grundlagen.md` – Begriffe, Werkzeugarten (inkl. Vergleichstabelle)
- [ ] `03-systemautomatisierung.md` – PowerShell/Bash-Beispiele, geplante Tasks
- [ ] `04-prozessautomatisierung.md` – Prozessmodellierung, RPA, Low-Code, APIs
- [ ] `05-uebungen.md` – 3–5 Aufgaben mit Lösungshinweisen
- [ ] Platzhalter-Kursbild nach `public/images/kurse/` (endgültiges Bild → [todo.md](todo.md))
- [ ] Commit: `content: Kurs System- und Prozessautomatisierung Grundlagen`

## Block 4 – Layout & Navigation (≈ 1 h) ✅ erledigt 2026-10-03
- [x] Design-Tokens + Schrift (Outfit) in `styles/globals.css` / `app/layout.tsx`, `lang="de"`
- [x] `components/navigation/Sidebar.tsx` – Logo, Home / Lerninhalte / Über uns, aktiver Zustand via `usePathname`
- [x] `components/navigation/MobileNav.tsx` – Bottom-Navigation < 768 px
- [x] `components/layout/AppShell.tsx` – Sidebar + Inhaltsbereich
- [x] `app/page.tsx` (Home: kurzer Willkommenstext + Link zu Lerninhalten), `app/ueber-uns/page.tsx` (Platzhalter)
- [x] Commit: `feat: App-Layout mit Sidebar-Navigation`

> Vorgezogen vor Block 3, damit die Plattform früh sichtbar ist. Fortschritt über `useSyncExternalStore` (`lib/utils/progress-store.ts`), dadurch keine Hydration-Abweichung.

## Block 5 – Kursübersicht (≈ 1 h) ✅ erledigt 2026-10-03
- [x] `components/learning/ProgressBadge.tsx` – Kreis + `NN % Fortschritt` / Häkchen + `Abgeschlossen`
- [x] `components/learning/useCourseProgress.ts` – Hook für `localStorage` (try/catch, Fallback 0 %)
- [x] `components/learning/CourseCard.tsx` – Bild, Verlauf, Badge, Titel, Meta, Hover/Fokus
- [x] `app/lerninhalte/page.tsx` – „Deine Kurse“, responsives Grid
- [x] Tests: `ProgressBadge` (0 %, 22 %, 100 % → „Abgeschlossen“)
- [x] Commit: `feat: Kursübersicht mit Kurskacheln`

## Block 6 – Kursseite & Lerneinheit (≈ 1,5 h) ✅ erledigt 2026-10-03
- [x] `app/lerninhalte/[kurs]/page.tsx` – Kopfbereich, Fortschrittsbalken, Einheitenliste, „Starten/Weiterlernen“, `generateStaticParams`, `notFound()`
- [x] `app/lerninhalte/[kurs]/[einheit]/page.tsx` – Breadcrumb, gerendertes Markdown, `generateStaticParams`, `notFound()`
- [x] `components/learning/MarkCompleteButton.tsx` (Client)
- [x] `components/learning/LessonNav.tsx` – Vorherige / Nächste
- [x] Typografie für Markdown (`prose`-Styles via `@tailwindcss/typography`)
- [x] `generateMetadata` für Seitentitel
- [x] Commit: `feat: Kursseite und Lerneinheiten`

> Unbekannte Kurse/Einheiten liefern 404 über `dynamicParams = false`. Zusätzlich Tests für den Fortschrittsspeicher (F12, F14).

## Block 7 – Abnahme & Feinschliff (≈ 30 min)
- [ ] Akzeptanzkriterien aus Spec Abschnitt 8 einzeln durchklicken
- [ ] Mobil (375 px) und Tastaturbedienung prüfen
- [ ] `npm run lint && npm test && npm run build`
- [ ] Root-`README.md` ergänzen: Start, Struktur, „Neuen Kurs anlegen“
- [ ] Commit: `docs: README und Abnahme MVP`

---

## Reihenfolge & Puffer
```
1 Setup → 2 Loader → 4 Layout → 5 Übersicht → 6 Kursseite/Einheit → 7 Abnahme
                 ↘ 3 Inhalt (jederzeit dazwischen) ↗
```
Wenn die Zeit knapp wird, in dieser Reihenfolge kürzen:
1. Inhalt der Einheiten 03–05 zunächst als Gerüst (Überschriften + Stichpunkte)
2. Mobile Bottom-Navigation → einfaches Einklappen der Sidebar
3. Syntax-Highlighting → einfache `<pre>`-Formatierung

## Offene Punkte
Logo, Kursbild und Hosting sowie alle späteren Features stehen in [todo.md](todo.md). Für heute werden Platzhalter verwendet (Text-Logo, Platzhalterbild).
