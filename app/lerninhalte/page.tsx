import type { Metadata } from "next";
import { CourseGrid } from "@/components/learning/CourseGrid";
import { getAllCourses } from "@/lib/content/courses";
import { groupCourses } from "@/lib/utils/course-groups";

export const metadata: Metadata = {
  title: "Lerninhalte",
};

const courseCount = (count: number) => (count === 1 ? "1 Kurs" : `${count} Kurse`);

// F3: Kursübersicht „Deine Kurse“, F27: gruppiert nach Kursgruppen
export default function LerninhaltePage() {
  const courses = getAllCourses();
  const groups = groupCourses(courses);

  return (
    <>
      <header className="mb-10">
        <p className="font-mono text-sm text-accent">Lerninhalte</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Deine Kurse</h1>
        <p className="mt-3 text-lg text-muted">
          {courseCount(courses.length)} – wähle einen Kurs aus und starte mit der ersten Einheit.
        </p>
      </header>
      {courses.length === 0 ? (
        <p className="text-muted">Noch keine Kurse vorhanden.</p>
      ) : (
        <div className="space-y-14">
          {groups.map((group) =>
            group.title ? (
              <section key={group.slug} id={group.slug} aria-labelledby={`${group.slug}-titel`} className="scroll-mt-24">
                <div className="mb-6">
                  <h2 id={`${group.slug}-titel`} className="text-2xl font-bold tracking-tight">
                    {group.title}
                  </h2>
                  <p className="mt-1 text-muted">{courseCount(group.courses.length)}</p>
                </div>
                <CourseGrid courses={group.courses} headingLevel={3} />
              </section>
            ) : (
              <CourseGrid key="alle" courses={group.courses} />
            ),
          )}
        </div>
      )}
    </>
  );
}
