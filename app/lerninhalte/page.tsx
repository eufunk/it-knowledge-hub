import type { Metadata } from "next";
import { CourseCard } from "@/components/learning/CourseCard";
import { getAllCourses } from "@/lib/content/courses";

export const metadata: Metadata = {
  title: "Lerninhalte",
};

// F3: Kursübersicht „Deine Kurse“
export default function LerninhaltePage() {
  const courses = getAllCourses();

  return (
    <>
      <h1 className="text-4xl font-semibold">Deine Kurse</h1>
      {courses.length === 0 ? (
        <p className="mt-6 text-heading/70">Noch keine Kurse vorhanden.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => (
            <li key={course.slug}>
              <CourseCard
                slug={course.slug}
                title={course.title}
                duration={course.duration}
                image={course.image}
                lessonSlugs={course.lessons.map((lesson) => lesson.slug)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
