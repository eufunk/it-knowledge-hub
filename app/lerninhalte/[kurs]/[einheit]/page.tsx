import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/learning/CoursePlayer";
import { MarkCompleteButton } from "@/components/learning/MarkCompleteButton";
import { ReadAloudPlayer } from "@/components/learning/ReadAloudPlayer";
import { ReadingProgress } from "@/components/learning/ReadingProgress";
import { StepCards, StepTopBar } from "@/components/learning/StepNavigation";
import { getAllCourses, getCourse, getLesson } from "@/lib/content/courses";
import { courseBreadcrumbStart } from "@/lib/utils/course-groups";
import { getPlayerData } from "@/lib/content/player";

// Unbekannte Kapitel führen zu 404 statt zu einer Seite zur Laufzeit.
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

// F9–F11, F15, F16, F20: Kapitel im Kursplayer
export default async function KapitelPage({ params }: PageProps<"/lerninhalte/[kurs]/[einheit]">) {
  const { kurs, einheit } = await params;
  const course = getCourse(kurs);
  const lesson = await getLesson(kurs, einheit);
  if (!course || !lesson) notFound();

  const { nav, adjacent, stepIds } = getPlayerData(course, lesson.slug);
  const courseHref = `/lerninhalte/${course.slug}`;
  const courseModule = course.modules.find((item) => item.lessons.some((entry) => entry.slug === lesson.slug));

  return (
    <CoursePlayer
      nav={nav}
      topBar={
        <StepTopBar
          breadcrumb={[
            ...courseBreadcrumbStart(course),
            { label: course.title, href: courseHref },
            { label: lesson.title },
          ]}
          courseHref={courseHref}
          {...adjacent}
        />
      }
    >
      <div id="kapitel" className="mt-6 rounded-[24px] border border-line bg-surface">
        <header id="kapitel-kopf" className="p-6 pb-6 sm:p-10 sm:pb-8">
          <p data-vorlesen="nein" className="font-mono text-sm text-accent">
            {lesson.appendix ? "Anhang" : `Modul ${courseModule?.number} · Kapitel ${String(lesson.order).padStart(2, "0")}`}
            {lesson.duration && <span className="text-muted"> · {lesson.duration}</span>}
          </p>
          <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{lesson.title}</h1>
          {lesson.description && <p className="mt-3 text-lg text-muted">{lesson.description}</p>}
        </header>

        <ReadingProgress targetId="kapitel" className="sticky top-16 z-10" />

        {/* Inhalt stammt aus dem eigenen Repository (siehe CLAUDE.md, „Markdown-HTML“). */}
        <article
          id="kapitel-text"
          className="lesson-content prose max-w-none p-6 sm:p-10 sm:prose-lg"
          dangerouslySetInnerHTML={{ __html: lesson.html }}
        />
      </div>

      {!lesson.appendix && (
        <div className="mt-6">
          <MarkCompleteButton courseSlug={course.slug} stepId={lesson.slug} stepIds={stepIds} />
        </div>
      )}

      <StepCards courseHref={courseHref} {...adjacent} />

      {/* Platz, damit der schwebende Vorlese-Player nichts verdeckt */}
      <div aria-hidden className="h-20" />
      <ReadAloudPlayer targetIds={["kapitel-kopf", "kapitel-text"]} />
    </CoursePlayer>
  );
}
