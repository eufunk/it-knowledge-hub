import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { AdjacentLessons } from "@/types/learning";

// F11: Vorherige / Nächste Einheit; an den Rändern ohne toten Button
export function LessonNav({ courseSlug, prev, next }: AdjacentLessons & { courseSlug: string }) {
  const linkClass =
    "flex max-w-[48%] items-center gap-2 rounded-card border border-heading/15 px-4 py-3 transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-3 focus-visible:outline-primary";

  return (
    <nav aria-label="Einheiten" className="mt-12 flex justify-between gap-4 border-t border-heading/10 pt-8">
      {prev ? (
        <Link href={`/lerninhalte/${courseSlug}/${prev.slug}`} className={linkClass}>
          <ChevronLeft aria-hidden className="size-5 shrink-0" />
          <span>
            <span className="block text-sm text-heading/60">Vorherige</span>
            <span className="block font-semibold">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/lerninhalte/${courseSlug}/${next.slug}`} className={`${linkClass} text-right`}>
          <span>
            <span className="block text-sm text-heading/60">Nächste</span>
            <span className="block font-semibold">{next.title}</span>
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0" />
        </Link>
      ) : (
        <Link href={`/lerninhalte/${courseSlug}`} className={`${linkClass} text-right`}>
          <span>
            <span className="block text-sm text-heading/60">Fertig</span>
            <span className="block font-semibold">Zur Kursübersicht</span>
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0" />
        </Link>
      )}
    </nav>
  );
}
