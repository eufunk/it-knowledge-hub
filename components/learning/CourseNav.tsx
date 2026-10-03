"use client";

import { BookOpen, ChevronDown, CircleCheck, FileQuestionMark, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { lessonHref, quizHref, quizStepId } from "@/lib/utils/steps";
import type { CourseModule, LessonMeta } from "@/types/learning";
import { useCourseProgress } from "./useCourseProgress";

export interface CourseNavProps {
  courseSlug: string;
  courseTitle: string;
  modules: CourseModule[];
  appendix: LessonMeta[];
  stepIds: string[];
  currentStepId: string;
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function NavEntry({
  href,
  label,
  icon: Icon,
  done,
  current,
}: {
  href: string;
  label: string;
  icon: typeof FileText;
  done: boolean;
  current: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
          current ? "bg-accent-soft font-semibold text-accent" : "text-muted hover:bg-canvas hover:text-ink"
        }`}
      >
        <Icon aria-hidden className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {done && <CircleCheck aria-label="erledigt" className="size-4 shrink-0 text-success" />}
      </Link>
    </li>
  );
}

// F15: Seitenleiste „Kursinhalt“ – Module und Kapitel aufklappbar, Status je Lernschritt
export function CourseNav({ courseSlug, courseTitle, modules, appendix, stepIds, currentStepId }: CourseNavProps) {
  const { completed, percent } = useCourseProgress(courseSlug, stepIds);
  const currentLesson = currentStepId.split("/")[0];
  const currentModule = modules.find((module) => module.lessons.some((lesson) => lesson.slug === currentLesson));

  const [openModules, setOpenModules] = useState(() => new Set(currentModule ? [currentModule.number] : [1]));
  const [openLessons, setOpenLessons] = useState(() => new Set([currentLesson]));

  const lessonDone = (lesson: LessonMeta) =>
    completed.has(lesson.slug) && (!lesson.hasQuiz || completed.has(quizStepId(lesson.slug)));

  return (
    <div>
      <p className="font-mono text-xs font-medium tracking-wider text-muted uppercase">Kursinhalt</p>
      <Link href={`/lerninhalte/${courseSlug}`} className="mt-1 block leading-snug font-bold hover:text-accent">
        {courseTitle}
      </Link>
      <ProgressBar percent={percent} className="mt-3" />

      <ol className="mt-5 space-y-2">
        {modules.map((module) => {
          const open = openModules.has(module.number);
          const moduleDone = module.lessons.every(lessonDone);
          return (
            <li key={module.number} className="rounded-xl border border-line bg-canvas/60">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenModules((set) => toggle(set, module.number))}
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-white ${
                    moduleDone ? "bg-success" : "bg-ink"
                  }`}
                >
                  {module.number}
                </span>
                <span className="min-w-0 flex-1 text-sm leading-snug font-bold">{module.title}</span>
                <ChevronDown aria-hidden className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <ol className="space-y-1 border-t border-line bg-surface p-2">
                  {module.lessons.map((lesson) => {
                    const lessonOpen = openLessons.has(lesson.slug);
                    return (
                      <li key={lesson.slug}>
                        <button
                          type="button"
                          aria-expanded={lessonOpen}
                          onClick={() => setOpenLessons((set) => toggle(set, lesson.slug))}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-canvas focus-visible:outline-2 focus-visible:outline-accent"
                        >
                          <span className="font-mono text-xs font-bold text-muted">
                            {String(lesson.order).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1 text-sm leading-snug font-semibold">{lesson.title}</span>
                          {lessonDone(lesson) && <CircleCheck aria-label="erledigt" className="size-4 shrink-0 text-success" />}
                          <ChevronDown
                            aria-hidden
                            className={`size-4 shrink-0 text-muted transition-transform ${lessonOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {lessonOpen && (
                          <ul className="mt-1 mb-2 ml-4 space-y-0.5 border-l-2 border-line pl-2">
                            <NavEntry
                              href={lessonHref(courseSlug, lesson.slug)}
                              label="Kapitel lesen"
                              icon={FileText}
                              done={completed.has(lesson.slug)}
                              current={currentStepId === lesson.slug}
                            />
                            {lesson.hasQuiz && (
                              <NavEntry
                                href={quizHref(courseSlug, lesson.slug)}
                                label="Wissenstest"
                                icon={FileQuestionMark}
                                done={completed.has(quizStepId(lesson.slug))}
                                current={currentStepId === quizStepId(lesson.slug)}
                              />
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>

      {appendix.length > 0 && (
        <>
          <p className="mt-5 px-1 font-mono text-xs font-medium tracking-wider text-muted uppercase">Anhang</p>
          <ul className="mt-1 space-y-0.5">
            {appendix.map((lesson) => (
              <NavEntry
                key={lesson.slug}
                href={lessonHref(courseSlug, lesson.slug)}
                label={lesson.title}
                icon={BookOpen}
                done={false}
                current={currentStepId === lesson.slug}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
