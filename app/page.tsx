import { ArrowRight } from "lucide-react";
import { CourseGrid } from "@/components/learning/CourseGrid";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getAllCourses } from "@/lib/content/courses";

export default function Home() {
  const courses = getAllCourses().slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden rounded-[24px] bg-ink px-6 py-14 text-white sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-80 rounded-full bg-accent/50 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-size-[40px_40px]"
        />
        <div className="relative max-w-2xl">
          <p className="font-mono text-sm text-indigo-200">IT Knowledge Hub</p>
          <h1 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
            IT verstehen.
            <br />
            <span className="text-indigo-300">Schritt für Schritt.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            Strukturierte Lerneinheiten, praxisnahe Übungen und verständlich aufbereitete Grundlagen zu technischen
            und organisatorischen IT-Themen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/lerninhalte">
              Zu den Lerninhalten
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {courses.length > 0 && (
        <section className="mt-16" aria-labelledby="kurse">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="kurse" className="text-2xl font-bold tracking-tight">
              Kurse
            </h2>
            <ButtonLink href="/lerninhalte" variant="secondary" className="py-2 text-sm">
              Alle anzeigen
            </ButtonLink>
          </div>
          <CourseGrid courses={courses} />
        </section>
      )}
    </>
  );
}
