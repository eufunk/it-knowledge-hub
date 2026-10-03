import type { Metadata } from "next";
import { CourseGrid } from "@/components/learning/CourseGrid";
import { getAllCourses } from "@/lib/content/courses";

export const metadata: Metadata = {
  title: "Lerninhalte",
};

// F3: Kursübersicht „Deine Kurse“
export default function LerninhaltePage() {
  const courses = getAllCourses();

  return (
    <>
      <header className="mb-10">
        <p className="font-mono text-sm text-accent">Lerninhalte</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Deine Kurse</h1>
        <p className="mt-3 text-lg text-muted">
          {courses.length === 1 ? "1 Kurs" : `${courses.length} Kurse`} – wähle einen Kurs aus und starte mit der
          ersten Einheit.
        </p>
      </header>
      {courses.length === 0 ? <p className="text-muted">Noch keine Kurse vorhanden.</p> : <CourseGrid courses={courses} />}
    </>
  );
}
