import { getProgressStepIds } from "@/lib/utils/steps";
import type { Course } from "@/types/learning";
import { CourseCard } from "./CourseCard";

// F3: Grid aus Kurskacheln (Mobil 1, Tablet 2, Desktop 3 Spalten)
export function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <li key={course.slug}>
          <CourseCard
            slug={course.slug}
            title={course.title}
            description={course.description}
            duration={course.duration}
            image={course.image}
            level={course.level}
            moduleCount={course.modules.length}
            chapterCount={course.modules.reduce((sum, module) => sum + module.lessons.length, 0)}
            stepIds={getProgressStepIds(course)}
          />
        </li>
      ))}
    </ul>
  );
}
