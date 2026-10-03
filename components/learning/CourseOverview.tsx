"use client";

import { Circle, CircleCheck } from "lucide-react";
import Link from "next/link";
import type { LessonMeta } from "@/types/learning";
import { useCourseProgress } from "./useCourseProgress";

interface CourseOverviewProps {
  courseSlug: string;
  lessons: LessonMeta[];
}

// F6–F8: Fortschrittsbalken, Starten/Weiterlernen und Liste der Einheiten mit Status
export function CourseOverview({ courseSlug, lessons }: CourseOverviewProps) {
  const lessonSlugs = lessons.map((lesson) => lesson.slug);
  const { completed, percent } = useCourseProgress(courseSlug, lessonSlugs);

  const nextLesson = lessons.find((lesson) => !completed.has(lesson.slug)) ?? lessons[0];
  const startLabel =
    completed.size === 0 ? "Kurs starten" : completed.size === lessons.length ? "Kurs wiederholen" : "Weiterlernen";

  return (
    <>
      <div className="mt-8 max-w-xl">
        <div className="flex justify-between text-sm font-medium">
          <span>Fortschritt</span>
          <span>{percent} %</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Kursfortschritt"
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-primary/15"
        >
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {nextLesson && (
        <Link
          href={`/lerninhalte/${courseSlug}/${nextLesson.slug}`}
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-sidebar focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {startLabel}
        </Link>
      )}

      <h2 className="mt-12 text-2xl font-semibold">Einheiten</h2>
      <ol className="mt-4 divide-y divide-heading/10 overflow-hidden rounded-card border border-heading/10">
        {lessons.map((lesson) => {
          const done = completed.has(lesson.slug);
          return (
            <li key={lesson.slug}>
              <Link
                href={`/lerninhalte/${courseSlug}/${lesson.slug}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
              >
                {done ? (
                  <CircleCheck className="size-6 shrink-0 text-primary" aria-label="erledigt" />
                ) : (
                  <Circle className="size-6 shrink-0 text-heading/30" aria-label="offen" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">
                    {lesson.order}. {lesson.title}
                  </span>
                  {lesson.description && (
                    <span className="block text-sm text-heading/70">{lesson.description}</span>
                  )}
                </span>
                {lesson.duration && (
                  <span className="shrink-0 text-sm whitespace-nowrap text-heading/60">{lesson.duration}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
