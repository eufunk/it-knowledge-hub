// F28: Kursfreigabe nach Datum; Tester sehen alle Kurse

export const RELEASE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface Viewer {
  tester: boolean;
}

// Kalendertag in der Zeitzone des Servers bzw. Browsers als „JJJJ-MM-TT“
export function localDate(now: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function isCourseVisible(release: string | undefined, viewer: Viewer | null, today: string): boolean {
  return Boolean(viewer?.tester) || !release || release <= today;
}

export function visibleCourses<T extends { release?: string }>(courses: T[], viewer: Viewer | null, today: string): T[] {
  return courses.filter((course) => isCourseVisible(course.release, viewer, today));
}

// Kurs-Slug aus einer Adresse unter /lerninhalte, z. B. /lerninhalte/kurs/kapitel → „kurs“
export function courseSlugFromPath(pathname: string): string | null {
  return /^\/lerninhalte\/([^/]+)/.exec(pathname)?.[1] ?? null;
}
