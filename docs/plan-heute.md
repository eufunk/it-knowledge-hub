# Umsetzungsplan – 2026-10-03

Ziel für heute: **MVP laut [feature-spec.md](feature-spec.md) lauffähig**, mit dem ersten Kurs `system-und-prozessautomatisierung-grundlagen`.
Geschätzter Aufwand: ca. 6–7 Stunden. Nach jedem Block wird committet.

---

## Block 1 – Projekt-Setup (≈ 45 min)
- [ ] Next.js-Projekt im bestehenden Repo anlegen:
      `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"`
      (vorhandene `README.md` / `.gitignore` behalten)
- [ ] `globals.css` nach `styles/globals.css` verschieben, Import in `app/layout.tsx` anpassen
- [ ] Abhängigkeiten: `gray-matter remark remark-gfm remark-rehype rehype-stringify rehype-pretty-code shiki lucide-react`
- [ ] Dev-Abhängigkeiten: `vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Ordner anlegen: `components/{layout,navigation,learning,ui}`, `lib/{content,utils}`, `types`, `public/{images,icons,documents}`, `tests/{components,content}`
- [ ] Scripts in `package.json`: `test`, `test:watch`
- [ ] ✅ Check: `npm run dev` startet, Startseite erreichbar
- [ ] Commit: `chore: Next.js-Projekt aufsetzen`

> ⚠️ Das Repo liegt in OneDrive. `node_modules` und `.next` sollten von der Synchronisierung ausgeschlossen werden (oder das Repo außerhalb von OneDrive liegen), sonst wird die Installation langsam und es kann zu Dateisperren kommen.

## Block 2 – Inhaltsmodell & Content-Loader (≈ 1 h)
- [ ] `types/learning.ts` mit `Course`, `LessonMeta`, `Lesson` (siehe Spec 5.4)
- [ ] `lib/content/courses.ts`:
  - `getAllCourses(): Course[]` – liest alle Ordner in `content/lerninhalte`
  - `getCourse(slug): Course | null`
  - `getLesson(courseSlug, lessonSlug): Promise<Lesson | null>`
  - `getAdjacentLessons(course, lessonSlug)` → `{ prev, next }`
- [ ] `lib/content/markdown.ts`: `markdownToHtml()` (remark-gfm + rehype-pretty-code)
- [ ] `lib/utils/progress.ts`: reine Funktion `calcProgress(done, total)` → Prozent
- [ ] Tests in `tests/content/`: Sortierung nach Nummernpräfix, Slug-Bildung, unbekannter Slug → `null`, `calcProgress` (0, 20, 100, total = 0)
- [ ] Commit: `feat: Content-Loader für Kurse und Lerneinheiten`

## Block 3 – Kursinhalt schreiben (≈ 1,5 h, parallel zu Block 4 möglich)
- [ ] `README.md` mit Kurs-Frontmatter
- [ ] `01-einfuehrung.md` – Was ist Automatisierung, Nutzen, Risiken
- [ ] `02-grundlagen.md` – Begriffe, Werkzeugarten (inkl. Vergleichstabelle)
- [ ] `03-systemautomatisierung.md` – PowerShell/Bash-Beispiele, geplante Tasks
- [ ] `04-prozessautomatisierung.md` – Prozessmodellierung, RPA, Low-Code, APIs
- [ ] `05-uebungen.md` – 3–5 Aufgaben mit Lösungshinweisen
- [ ] Platzhalter-Kursbild nach `public/images/kurse/` (endgültiges Bild → [todo.md](todo.md))
- [ ] Commit: `content: Kurs System- und Prozessautomatisierung Grundlagen`

## Block 4 – Layout & Navigation (≈ 1 h)
- [ ] Design-Tokens + Schrift (Outfit) in `styles/globals.css` / `app/layout.tsx`, `lang="de"`
- [ ] `components/navigation/Sidebar.tsx` – Logo, Home / Lerninhalte / Über uns, aktiver Zustand via `usePathname`
- [ ] `components/navigation/MobileNav.tsx` – Bottom-Navigation < 768 px
- [ ] `components/layout/AppShell.tsx` – Sidebar + Inhaltsbereich
- [ ] `app/page.tsx` (Home: kurzer Willkommenstext + Link zu Lerninhalten), `app/ueber-uns/page.tsx` (Platzhalter)
- [ ] Commit: `feat: App-Layout mit Sidebar-Navigation`

## Block 5 – Kursübersicht (≈ 1 h)
- [ ] `components/learning/ProgressBadge.tsx` – Kreis + `NN % Fortschritt` / Häkchen + `Abgeschlossen`
- [ ] `components/learning/useCourseProgress.ts` – Hook für `localStorage` (try/catch, Fallback 0 %)
- [ ] `components/learning/CourseCard.tsx` – Bild, Verlauf, Badge, Titel, Meta, Hover/Fokus
- [ ] `app/lerninhalte/page.tsx` – „Deine Kurse“, responsives Grid
- [ ] Tests: `ProgressBadge` (0 %, 22 %, 100 % → „Abgeschlossen“)
- [ ] Commit: `feat: Kursübersicht mit Kurskacheln`

## Block 6 – Kursseite & Lerneinheit (≈ 1,5 h)
- [ ] `app/lerninhalte/[kurs]/page.tsx` – Kopfbereich, Fortschrittsbalken, Einheitenliste, „Starten/Weiterlernen“, `generateStaticParams`, `notFound()`
- [ ] `app/lerninhalte/[kurs]/[einheit]/page.tsx` – Breadcrumb, gerendertes Markdown, `generateStaticParams`, `notFound()`
- [ ] `components/learning/MarkCompleteButton.tsx` (Client)
- [ ] `components/learning/LessonNav.tsx` – Vorherige / Nächste
- [ ] Typografie für Markdown (`prose`-Styles via `@tailwindcss/typography`)
- [ ] `generateMetadata` für Seitentitel
- [ ] Commit: `feat: Kursseite und Lerneinheiten`

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
