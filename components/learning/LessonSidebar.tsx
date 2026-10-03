"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { LessonMeta } from "@/types/learning";
import { useCourseProgress } from "./useCourseProgress";

interface LessonSidebarProps {
  courseSlug: string;
  courseTitle: string;
  lessons: LessonMeta[];
  currentSlug: string;
}

// F11: Inhaltsübersicht des Kurses neben der Lerneinheit (ab 1024 px)
export function LessonSidebar({ courseSlug, courseTitle, lessons, currentSlug }: LessonSidebarProps) {
  const { completed, percent } = useCourseProgress(
    courseSlug,
    lessons.map((lesson) => lesson.slug),
  );

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-card border border-line bg-surface p-5">
        <p className="font-mono text-xs font-medium tracking-wider text-muted uppercase">Kurs</p>
        <Link href={`/lerninhalte/${courseSlug}`} className="mt-1 block leading-snug font-bold hover:text-accent">
          {courseTitle}
        </Link>
        <ProgressBar percent={percent} className="mt-4" />

        <nav aria-label="Einheiten dieses Kurses" className="mt-5 border-t border-line pt-4">
          <ol className="space-y-1">
            {lessons.map((lesson) => {
              const current = lesson.slug === currentSlug;
              const done = completed.has(lesson.slug);
              return (
                <li key={lesson.slug}>
                  <Link
                    href={`/lerninhalte/${courseSlug}/${lesson.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors ${
                      current ? "bg-accent-soft font-semibold text-accent" : "text-muted hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                        done ? "bg-success text-white" : current ? "bg-accent text-white" : "bg-canvas text-muted"
                      }`}
                    >
                      {done ? <Check aria-label="erledigt" className="size-3.5" strokeWidth={3} /> : lesson.order}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </aside>
  );
}
