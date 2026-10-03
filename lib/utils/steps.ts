import type { AdjacentSteps, Course, CourseStep, LessonMeta } from "@/types/learning";

export function lessonHref(courseSlug: string, lessonSlug: string): string {
  return `/lerninhalte/${courseSlug}/${lessonSlug}`;
}

export function quizHref(courseSlug: string, lessonSlug: string): string {
  return `${lessonHref(courseSlug, lessonSlug)}/wissenstest`;
}

export function quizStepId(lessonSlug: string): string {
  return `${lessonSlug}/wissenstest`;
}

// F11/F13: Reihenfolge der Lernschritte – Kapitel → Wissenstest → nächstes Kapitel … → Anhänge
export function getCourseSteps(course: Pick<Course, "slug" | "modules" | "appendix">): CourseStep[] {
  const lessonSteps = (lesson: LessonMeta): CourseStep[] => {
    const steps: CourseStep[] = [
      {
        id: lesson.slug,
        kind: "lesson",
        lessonSlug: lesson.slug,
        title: lesson.title,
        href: lessonHref(course.slug, lesson.slug),
        counts: !lesson.appendix,
      },
    ];
    if (lesson.hasQuiz && !lesson.appendix) {
      steps.push({
        id: quizStepId(lesson.slug),
        kind: "quiz",
        lessonSlug: lesson.slug,
        title: `Wissenstest: ${lesson.title}`,
        href: quizHref(course.slug, lesson.slug),
        counts: true,
      });
    }
    return steps;
  };

  return [...course.modules.flatMap((module) => module.lessons), ...course.appendix].flatMap(lessonSteps);
}

// F13: Lernschritte, die zum Fortschritt zählen
export function getProgressStepIds(course: Pick<Course, "slug" | "modules" | "appendix">): string[] {
  return getCourseSteps(course)
    .filter((step) => step.counts)
    .map((step) => step.id);
}

export function getAdjacentSteps(steps: CourseStep[], stepId: string): AdjacentSteps {
  const index = steps.findIndex((step) => step.id === stepId);
  if (index === -1) return { prev: null, next: null };
  return { prev: steps[index - 1] ?? null, next: steps[index + 1] ?? null };
}
