import type { Metadata } from "next";
import { CourseGrid } from "@/components/learning/CourseGrid";
import { getAllCourses } from "@/lib/content/courses";
import { getCurrentUser } from "@/lib/server/session";
import { groupCourses } from "@/lib/utils/course-groups";
import { localDate, visibleCourses } from "@/lib/utils/release";

export const metadata: Metadata = {
  title: "Lerninhalte",
};

const courseCount = (count: number) => (count === 1 ? "1 Kurs" : `${count} Kurse`);

// F3: Kursübersicht „Deine Kurse“, F27: gruppiert nach Kursgruppen, F28: nur freigegebene Kurse (Tester: alle)
// Wird pro Aufruf erzeugt, weil die Auswahl von Datum und Konto abhängt.
export default async function LerninhaltePage() {
  const courses = visibleCourses(getAllCourses(), await getCurrentUser(), localDate(new Date()));
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
