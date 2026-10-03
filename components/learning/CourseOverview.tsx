"use client";

import { ArrowRight, Check, Clock } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { LessonMeta } from "@/types/learning";
import { useCourseProgress } from "./useCourseProgress";

interface CourseOverviewProps {
  courseSlug: string;
  lessons: LessonMeta[];
}

// F7/F8: Einheiten als Zeitleiste, daneben Fortschrittskarte mit Starten/Weiterlernen
export function CourseOverview({ courseSlug, lessons }: CourseOverviewProps) {
  const lessonSlugs = lessons.map((lesson) => lesson.slug);
  const { completed, percent } = useCourseProgress(courseSlug, lessonSlugs);

  const nextLesson = lessons.find((lesson) => !completed.has(lesson.slug)) ?? lessons[0];
  const startLabel =
    completed.size === 0 ? "Kurs starten" : completed.size === lessons.length ? "Kurs wiederholen" : "Weiterlernen";

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
      <section aria-labelledby="einheiten">
        <h2 id="einheiten" className="text-2xl font-bold tracking-tight">
          Einheiten
        </h2>
        <ol className="mt-6">
          {lessons.map((lesson, index) => {
            const done = completed.has(lesson.slug);
            const isLast = index === lessons.length - 1;
            return (
              <li key={lesson.slug} className={`relative pl-14 ${isLast ? "" : "pb-5"}`}>
                {!isLast && <span aria-hidden className="absolute top-11 bottom-0 left-[19px] w-0.5 bg-line" />}
                <span
                  className={`absolute top-1 left-0 flex size-10 items-center justify-center rounded-full border-2 font-mono text-sm font-bold ${
                    done ? "border-success bg-success text-white" : "border-line bg-surface text-muted"
                  }`}
                >
                  {done ? <Check aria-label="erledigt" className="size-5" strokeWidth={3} /> : String(lesson.order).padStart(2, "0")}
                </span>
                <Link
                  href={`/lerninhalte/${courseSlug}/${lesson.slug}`}
                  className="group flex items-center gap-4 rounded-card border border-line bg-surface p-4 transition hover:border-accent/30 hover:shadow-md focus-visible:outline-3 focus-visible:outline-accent"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{lesson.title}</span>
                    {lesson.description && <span className="mt-0.5 block text-sm text-muted">{lesson.description}</span>}
                    {lesson.duration && (
                      <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-muted">
                        <Clock aria-hidden className="size-3.5" />
                        {lesson.duration}
                      </span>
                    )}
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <aside className="order-first h-fit rounded-card border border-line bg-surface p-6 lg:sticky lg:top-24 lg:order-none">
        <p className="font-mono text-xs font-medium tracking-wider text-muted uppercase">Dein Stand</p>
        <p className="mt-2 text-3xl font-bold tracking-tight">
          {completed.size}
          <span className="text-lg font-semibold text-muted"> / {lessons.length} erledigt</span>
        </p>
        <ProgressBar percent={percent} className="mt-4" />
        {nextLesson && (
          <ButtonLink href={`/lerninhalte/${courseSlug}/${nextLesson.slug}`} className="mt-6 w-full">
            {startLabel}
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        )}
      </aside>
    </div>
  );
}
