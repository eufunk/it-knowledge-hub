import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonNav } from "@/components/learning/LessonNav";
import { MarkCompleteButton } from "@/components/learning/MarkCompleteButton";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getAdjacentLessons, getAllCourses, getCourse, getLesson } from "@/lib/content/courses";

// Unbekannte Einheiten führen zu 404 statt zu einer Seite zur Laufzeit.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCourses().flatMap((course) =>
    course.lessons.map((lesson) => ({ kurs: course.slug, einheit: lesson.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/lerninhalte/[kurs]/[einheit]">): Promise<Metadata> {
  const { kurs, einheit } = await params;
  const lesson = getCourse(kurs)?.lessons.find((item) => item.slug === einheit);
  return lesson ? { title: lesson.title, description: lesson.description } : {};
}

// F9–F11: Lerneinheit mit gerendertem Markdown, Erledigt-Button und Vor/Zurück
export default async function EinheitPage({ params }: PageProps<"/lerninhalte/[kurs]/[einheit]">) {
  const { kurs, einheit } = await params;
  const course = getCourse(kurs);
  const lesson = await getLesson(kurs, einheit);
  if (!course || !lesson) notFound();

  const { prev, next } = getAdjacentLessons(course, lesson.slug);
  const position = course.lessons.findIndex((item) => item.slug === lesson.slug) + 1;

  return (
    <div className="max-w-3xl">
      <Breadcrumb
        items={[
          { label: "Lerninhalte", href: "/lerninhalte" },
          { label: course.title, href: `/lerninhalte/${course.slug}` },
          { label: lesson.title },
        ]}
      />

      <header className="mt-6">
        <p className="text-sm font-medium text-primary">
          Einheit {position} von {course.lessons.length}
          {lesson.duration && ` · ${lesson.duration}`}
        </p>
        <h1 className="mt-2 text-4xl leading-tight font-semibold">{lesson.title}</h1>
        {lesson.description && <p className="mt-3 text-lg text-heading/80">{lesson.description}</p>}
      </header>

      {/* Inhalt stammt aus dem eigenen Repository (siehe CLAUDE.md, „Markdown-HTML“). */}
      <article className="lesson-content prose prose-lg mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: lesson.html }} />

      <div className="mt-12">
        <MarkCompleteButton
          courseSlug={course.slug}
          lessonSlug={lesson.slug}
          lessonSlugs={course.lessons.map((item) => item.slug)}
        />
      </div>

      <LessonNav courseSlug={course.slug} prev={prev} next={next} />
    </div>
  );
}
