import { Clock, FileQuestionMark, Layers } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/learning/CourseOverview";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getAllCourses, getCourse } from "@/lib/content/courses";
import { formatCourseSize, plural } from "@/lib/utils/format";
import { getCourseSteps } from "@/lib/utils/steps";

// Unbekannte Kurse führen zu 404 statt zu einer Seite zur Laufzeit.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ kurs: course.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lerninhalte/[kurs]">): Promise<Metadata> {
  const { kurs } = await params;
  const course = getCourse(kurs);
  return course ? { title: course.title, description: course.description } : {};
}

// F6: Kursseite mit Kopfbereich, Fortschritt und Kursinhalt nach Modulen
export default async function KursPage({ params }: PageProps<"/lerninhalte/[kurs]">) {
  const { kurs } = await params;
  const course = getCourse(kurs);
  if (!course) notFound();

  const chapters = course.modules.flatMap((module) => module.lessons);
  const quizCount = chapters.filter((lesson) => lesson.hasQuiz).length;

  return (
    <>
      <Breadcrumb items={[{ label: "Lerninhalte", href: "/lerninhalte" }, { label: course.title }]} />

      <header className="mt-6 grid items-center gap-8 overflow-hidden rounded-[24px] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_420px]">
        <div>
          {course.level && (
            <span className="inline-block rounded-full bg-accent-soft px-3 py-1 font-mono text-xs font-medium tracking-wider text-accent uppercase">
              {course.level}
            </span>
          )}
          <h1 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{course.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{course.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <span className="inline-flex items-center gap-2 rounded-lg bg-canvas px-3 py-2">
              <Clock aria-hidden className="size-4 text-accent" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-canvas px-3 py-2">
              <Layers aria-hidden className="size-4 text-accent" />
              {formatCourseSize(course.modules.length, chapters.length)}
            </span>
            {quizCount > 0 && (
              <span className="inline-flex items-center gap-2 rounded-lg bg-canvas px-3 py-2">
                <FileQuestionMark aria-hidden className="size-4 text-accent" />
                {plural(quizCount, "Wissenstest", "Wissenstests")}
              </span>
            )}
          </div>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-card bg-accent-soft">
          <Image src={course.image} alt="" fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" priority />
        </div>
      </header>

      <CourseOverview
        courseSlug={course.slug}
        modules={course.modules}
        appendix={course.appendix}
        steps={getCourseSteps(course)}
      />
    </>
  );
}
