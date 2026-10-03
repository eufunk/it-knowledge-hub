"use client";

import { useMemo, useSyncExternalStore } from "react";
import { calcProgress } from "@/lib/utils/progress";
import { parseCompleted, readProgressRaw, subscribeProgress } from "@/lib/utils/progress-store";

export interface CourseProgress {
  completed: Set<string>;
  percent: number;
}

// Auf dem Server und beim ersten Rendern gilt 0 % (kein localStorage, keine Hydration-Abweichung).
export function useCourseProgress(courseSlug: string, lessonSlugs: string[]): CourseProgress {
  const raw = useSyncExternalStore(
    subscribeProgress,
    () => readProgressRaw(courseSlug),
    () => null,
  );

  return useMemo(() => {
    const known = new Set(lessonSlugs);
    const completed = new Set(parseCompleted(raw).filter((slug) => known.has(slug)));
    return { completed, percent: calcProgress(completed.size, lessonSlugs.length) };
  }, [raw, lessonSlugs]);
}
