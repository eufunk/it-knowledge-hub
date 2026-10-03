import type { CourseNavProps } from "@/components/learning/CourseNav";
import { getAdjacentSteps, getCourseSteps, getProgressStepIds } from "@/lib/utils/steps";
import type { AdjacentSteps, Course } from "@/types/learning";

// Gemeinsame Daten für die Seiten im Kursplayer (Kapitel und Wissenstest)
export function getPlayerData(course: Course, stepId: string): { nav: CourseNavProps; adjacent: AdjacentSteps; stepIds: string[] } {
  const stepIds = getProgressStepIds(course);
  return {
    nav: {
      courseSlug: course.slug,
      courseTitle: course.title,
      modules: course.modules,
      appendix: course.appendix,
      stepIds,
      currentStepId: stepId,
    },
    adjacent: getAdjacentSteps(getCourseSteps(course), stepId),
    stepIds,
  };
}
