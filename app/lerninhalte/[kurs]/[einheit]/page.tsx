import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonNav } from "@/components/learning/LessonNav";
import { LessonSidebar } from "@/components/learning/LessonSidebar";
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

// F9–F11: Lerneinheit mit Inhaltsübersicht, gerendertem Markdown, Erledigt-Button und Vor/Zurück
export default async function EinheitPage({ params }: PageProps<"/lerninhalte/[kurs]/[einheit]">) {
  const { kurs, einheit } = await params;
  const course = getCourse(kurs);
  const lesson = await getLesson(kurs, einheit);
  if (!course || !lesson) notFound();

  const { prev, next } = getAdjacentLessons(course, lesson.slug);
  const position = course.lessons.findIndex((item) => item.slug === lesson.slug) + 1;

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <LessonSidebar
        courseSlug={course.slug}
        courseTitle={course.title}
        lessons={course.lessons}
        currentSlug={lesson.slug}
      />

      <div className="min-w-0">
        <Breadcrumb
          items={[
            { label: "Lerninhalte", href: "/lerninhalte" },
            { label: course.title, href: `/lerninhalte/${course.slug}` },
            { label: lesson.title },
          ]}
        />

        <div className="mt-6 rounded-[24px] border border-line bg-surface p-6 sm:p-10">
          <header className="border-b border-line pb-8">
            <p className="font-mono text-sm text-accent">
              Einheit {String(position).padStart(2, "0")} / {String(course.lessons.length).padStart(2, "0")}
              {lesson.duration && <span className="text-muted"> · {lesson.duration}</span>}
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{lesson.title}</h1>
            {lesson.description && <p className="mt-3 text-lg text-muted">{lesson.description}</p>}
          </header>

          {/* Inhalt stammt aus dem eigenen Repository (siehe CLAUDE.md, „Markdown-HTML“). */}
          <article
            className="lesson-content prose mt-8 max-w-none sm:prose-lg"
            dangerouslySetInnerHTML={{ __html: lesson.html }}
          />
        </div>

        <div className="mt-6">
          <MarkCompleteButton
            courseSlug={course.slug}
            lessonSlug={lesson.slug}
            lessonSlugs={course.lessons.map((item) => item.slug)}
          />
        </div>

        <LessonNav courseSlug={course.slug} prev={prev} next={next} />
      </div>
    </div>
  );
}
