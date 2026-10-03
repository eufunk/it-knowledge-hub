"use client";

import { Circle, CircleCheck } from "lucide-react";
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
    <button
      type="button"
      aria-pressed={done}
      onClick={() => setLessonCompleted(courseSlug, lessonSlug, !done)}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        done
          ? "border-2 border-primary bg-white text-primary hover:bg-primary/5"
          : "bg-primary text-white hover:bg-sidebar"
      }`}
    >
      {done ? <CircleCheck aria-hidden className="size-5" /> : <Circle aria-hidden className="size-5" />}
      {done ? "Erledigt" : "Als erledigt markieren"}
    </button>
  );
}
