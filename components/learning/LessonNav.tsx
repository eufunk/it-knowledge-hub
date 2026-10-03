import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { AdjacentLessons } from "@/types/learning";

const linkClass =
  "group flex min-w-0 flex-1 items-center gap-3 rounded-card border border-line bg-surface p-4 transition hover:border-accent/30 hover:shadow-md focus-visible:outline-3 focus-visible:outline-accent sm:max-w-[48%]";

// F11: Vorherige / Nächste Einheit; nach der letzten Einheit zurück zur Kursübersicht
export function LessonNav({ courseSlug, prev, next }: AdjacentLessons & { courseSlug: string }) {
  const nextHref = next ? `/lerninhalte/${courseSlug}/${next.slug}` : `/lerninhalte/${courseSlug}`;

  return (
    <nav aria-label="Einheiten" className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
      {prev ? (
        <Link href={`/lerninhalte/${courseSlug}/${prev.slug}`} className={linkClass}>
          <ArrowLeft aria-hidden className="size-5 shrink-0 text-muted transition group-hover:-translate-x-0.5 group-hover:text-accent" />
          <span className="min-w-0">
            <span className="block font-mono text-xs text-muted">Vorherige</span>
            <span className="block truncate font-bold">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      <Link href={nextHref} className={`${linkClass} justify-end text-right`}>
        <span className="min-w-0">
          <span className="block font-mono text-xs text-muted">{next ? "Nächste" : "Fertig"}</span>
          <span className="block truncate font-bold">{next ? next.title : "Zur Kursübersicht"}</span>
        </span>
        <ArrowRight aria-hidden className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
      </Link>
    </nav>
  );
}
