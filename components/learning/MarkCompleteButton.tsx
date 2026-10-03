"use client";

import { Check, CircleCheck } from "lucide-react";
import { setLessonCompleted } from "@/lib/utils/progress-store";
import { useCourseProgress } from "./useCourseProgress";

interface MarkCompleteButtonProps {
  courseSlug: string;
  lessonSlug: string;
  lessonSlugs: string[];
}

// F10: Einheit als erledigt markieren (umschaltbar)
export function MarkCompleteButton({ courseSlug, lessonSlug, lessonSlugs }: MarkCompleteButtonProps) {
  const { completed } = useCourseProgress(courseSlug, lessonSlugs);
  const done = completed.has(lessonSlug);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 rounded-card border p-5 ${
        done ? "border-success/30 bg-success-soft" : "border-line bg-surface"
      }`}
    >
      <p className="font-semibold">
        {done ? "Diese Einheit hast du erledigt." : "Alles verstanden? Dann markiere die Einheit als erledigt."}
      </p>
      <button
        type="button"
        aria-pressed={done}
        onClick={() => setLessonCompleted(courseSlug, lessonSlug, !done)}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          done
            ? "border border-success/40 bg-surface text-success hover:bg-success-soft"
            : "bg-accent text-white shadow-sm shadow-accent/25 hover:bg-accent-strong"
        }`}
      >
        {done ? <CircleCheck aria-hidden className="size-5" /> : <Check aria-hidden className="size-5" />}
        {done ? "Erledigt" : "Als erledigt markieren"}
      </button>
    </div>
  );
}
