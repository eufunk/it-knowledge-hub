"use client";

import { ArrowRight, BookOpen, Check, Clock, FileQuestionMark, FileText } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { lessonHref, quizHref, quizStepId } from "@/lib/utils/steps";
import type { CourseModule, CourseStep, LessonMeta } from "@/types/learning";
import { useCourseProgress } from "./useCourseProgress";

interface CourseOverviewProps {
  courseSlug: string;
  modules: CourseModule[];
  appendix: LessonMeta[];
  steps: CourseStep[];
}

function StatusChip({ done, href, icon: Icon, label }: { done: boolean; href: string; icon: typeof FileText; label: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
        done ? "bg-success-soft text-success" : "bg-canvas text-muted hover:text-accent"
      }`}
    >
      {done ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : <Icon aria-hidden className="size-3.5" />}
      {label}
      <span className="sr-only">{done ? "(erledigt)" : "(offen)"}</span>
    </Link>
  );
}

// F7/F8: Kapitel als Zeitleiste nach Modulen, daneben Fortschrittskarte mit Starten/Weiterlernen
export function CourseOverview({ courseSlug, modules, appendix, steps }: CourseOverviewProps) {
  const countedSteps = steps.filter((step) => step.counts);
  const { completed, percent } = useCourseProgress(
    courseSlug,
    countedSteps.map((step) => step.id),
  );

  const nextStep = countedSteps.find((step) => !completed.has(step.id)) ?? countedSteps[0];
  const startLabel =
    completed.size === 0 ? "Kurs starten" : completed.size === countedSteps.length ? "Kurs wiederholen" : "Weiterlernen";

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
      <section aria-labelledby="inhalt" className="min-w-0">
        <h2 id="inhalt" className="text-2xl font-bold tracking-tight">
          Kursinhalt
        </h2>

        {modules.map((module) => (
          <div key={module.number} className="mt-8">
            <h3 className="flex items-center gap-3 font-bold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-ink font-mono text-sm text-white">
                {module.number}
              </span>
              <span>
                <span className="block font-mono text-xs font-medium tracking-wider text-muted uppercase">
                  Modul {module.number}
                </span>
                {module.title}
              </span>
            </h3>
            <ol className="mt-4">
              {module.lessons.map((lesson, index) => {
                const lessonDone = completed.has(lesson.slug);
                const quizDone = completed.has(quizStepId(lesson.slug));
                const done = lessonDone && (!lesson.hasQuiz || quizDone);
                const isLast = index === module.lessons.length - 1;
                return (
                  <li key={lesson.slug} className={`relative pl-14 ${isLast ? "" : "pb-4"}`}>
                    {!isLast && <span aria-hidden className="absolute top-11 bottom-0 left-[19px] w-0.5 bg-line" />}
                    <span
                      className={`absolute top-3 left-0 flex size-10 items-center justify-center rounded-full border-2 font-mono text-sm font-bold ${
                        done ? "border-success bg-success text-white" : "border-line bg-surface text-muted"
                      }`}
                    >
                      {done ? (
                        <Check aria-label="erledigt" className="size-5" strokeWidth={3} />
                      ) : (
                        String(lesson.order).padStart(2, "0")
                      )}
                    </span>
                    <div className="rounded-card border border-line bg-surface p-4 transition hover:border-accent/30 hover:shadow-md">
                      <Link
                        href={lessonHref(courseSlug, lesson.slug)}
                        className="block font-bold hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        {lesson.title}
                      </Link>
                      {lesson.description && <p className="mt-0.5 text-sm text-muted">{lesson.description}</p>}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <StatusChip
                          done={lessonDone}
                          href={lessonHref(courseSlug, lesson.slug)}
                          icon={FileText}
                          label="Kapitel lesen"
                        />
                        {lesson.hasQuiz && (
                          <StatusChip
                            done={quizDone}
                            href={quizHref(courseSlug, lesson.slug)}
                            icon={FileQuestionMark}
                            label="Wissenstest"
                          />
                        )}
                        {lesson.duration && (
                          <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-muted">
                            <Clock aria-hidden className="size-3.5" />
                            {lesson.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}

        {appendix.length > 0 && (
          <div className="mt-10">
            <h3 className="font-mono text-xs font-medium tracking-wider text-muted uppercase">Anhang</h3>
            <ul className="mt-3 space-y-2">
              {appendix.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={lessonHref(courseSlug, lesson.slug)}
                    className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 font-semibold transition hover:border-accent/30 hover:text-accent"
                  >
                    <BookOpen aria-hidden className="size-5 text-accent" />
                    {lesson.title}
                    {lesson.description && <span className="text-sm font-normal text-muted">– {lesson.description}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <aside className="order-first h-fit rounded-card border border-line bg-surface p-6 lg:sticky lg:top-24 lg:order-none">
        <p className="font-mono text-xs font-medium tracking-wider text-muted uppercase">Dein Stand</p>
        <p className="mt-2 text-3xl font-bold tracking-tight">
          {completed.size}
          <span className="text-lg font-semibold text-muted"> / {countedSteps.length} Lernschritte</span>
        </p>
        <ProgressBar percent={percent} className="mt-4" />
        {nextStep && (
          <ButtonLink href={nextStep.href} className="mt-6 w-full">
            {startLabel}
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        )}
        {nextStep && completed.size > 0 && completed.size < countedSteps.length && (
          <p className="mt-3 text-sm text-muted">Als Nächstes: {nextStep.title}</p>
        )}
      </aside>
    </div>
  );
}
