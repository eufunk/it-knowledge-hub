import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/learning/CourseOverview";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getAllCourses, getCourse } from "@/lib/content/courses";
import { formatLessonCount } from "@/lib/utils/format";

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

// F6: Kursseite mit Kopfbereich, Fortschritt und Einheiten
export default async function KursPage({ params }: PageProps<"/lerninhalte/[kurs]">) {
  const { kurs } = await params;
  const course = getCourse(kurs);
  if (!course) notFound();

  return (
    <div className="max-w-5xl">
      <Breadcrumb items={[{ label: "Lerninhalte", href: "/lerninhalte" }, { label: course.title }]} />

      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start">
        <div className="relative aspect-square w-full max-w-60 shrink-0 overflow-hidden rounded-card bg-sidebar shadow-md">
          <Image src={course.image} alt="" fill sizes="240px" className="object-cover" priority />
        </div>
        <div className="min-w-0 flex-1">
          {course.level && (
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {course.level}
            </span>
          )}
          <h1 className="mt-3 text-4xl leading-tight font-semibold">{course.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-heading/80">{course.description}</p>
          <p className="mt-3 font-medium text-heading/70">
            Dauer: {course.duration} · {formatLessonCount(course.lessons.length)}
          </p>
        </div>
      </div>

      <CourseOverview courseSlug={course.slug} lessons={course.lessons} />
    </div>
  );
}
