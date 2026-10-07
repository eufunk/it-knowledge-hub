// F23/F24: Fortschritt aus dem Browser nur übernehmen, wenn Kurs und Lernschritt wirklich existieren.
import { getCourse } from "@/lib/content/courses";
import { getProgressStepIds } from "@/lib/utils/steps";
import type { ProgressByCourse } from "./progress";

const MAX_COURSES = 100;

function validSteps(courseSlug: string): Set<string> | null {
  const course = getCourse(courseSlug);
  return course ? new Set(getProgressStepIds(course)) : null;
}

export function isValidStep(courseSlug: unknown, stepId: unknown): courseSlug is string {
  if (typeof courseSlug !== "string" || typeof stepId !== "string") return false;
  return validSteps(courseSlug)?.has(stepId) ?? false;
}

// F20: Vorlese-Stelle nur für vorhandene Kapitel (auch Anhänge) speichern
export function isValidLesson(courseSlug: unknown, lessonSlug: unknown): courseSlug is string {
  if (typeof courseSlug !== "string" || typeof lessonSlug !== "string") return false;
  return getCourse(courseSlug)?.lessons.some((lesson) => lesson.slug === lessonSlug) ?? false;
}

// Erwartet JSON wie {"kurs-slug": ["kapitel", "kapitel/wissenstest"]}; Ungültiges wird verworfen.
export function parseLocalProgress(raw: unknown): ProgressByCourse {
  if (typeof raw !== "string" || raw.length > 100_000) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};

  const result: ProgressByCourse = {};
  for (const [courseSlug, steps] of Object.entries(data).slice(0, MAX_COURSES)) {
    const allowed = validSteps(courseSlug);
    if (!allowed || !Array.isArray(steps)) continue;
    const kept = [...new Set(steps.filter((step): step is string => typeof step === "string" && allowed.has(step)))];
    if (kept.length > 0) result[courseSlug] = kept;
  }
  return result;
}
