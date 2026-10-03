import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight, FileQuestionMark, FileText } from "lucide-react";
import Link from "next/link";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import type { AdjacentSteps, CourseStep } from "@/types/learning";

const buttonBase =
  "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

// F11: Kopfzeile mit Breadcrumb und Zurück/Weiter; nach dem letzten Schritt zurück zur Kursseite
export function StepTopBar({
  breadcrumb,
  prev,
  next,
  courseHref,
}: AdjacentSteps & { breadcrumb: BreadcrumbItem[]; courseHref: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Breadcrumb items={breadcrumb} />
      <div className="flex gap-2">
        {prev ? (
          <Link href={prev.href} className={`${buttonBase} border border-line bg-surface hover:border-accent/40 hover:text-accent`}>
            <ChevronsLeft aria-hidden className="size-4" />
            Zurück
          </Link>
        ) : (
          <span aria-disabled="true" className={`${buttonBase} cursor-not-allowed border border-line bg-canvas text-muted/60`}>
            <ChevronsLeft aria-hidden className="size-4" />
            Zurück
          </span>
        )}
        <Link href={next?.href ?? courseHref} className={`${buttonBase} bg-accent text-white hover:bg-accent-strong`}>
          Weiter
          <ChevronsRight aria-hidden className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function StepIcon({ step }: { step: CourseStep }) {
  const Icon = step.kind === "quiz" ? FileQuestionMark : FileText;
  return <Icon aria-hidden className="size-4 shrink-0 text-accent" />;
}

const cardClass =
  "group flex min-w-0 flex-1 items-center gap-3 rounded-card border border-line bg-surface p-4 transition hover:border-accent/30 hover:shadow-md focus-visible:outline-3 focus-visible:outline-accent sm:max-w-[48%]";

// F11: Karten „Vorheriger“ / „Nächster“ Schritt unter dem Inhalt
export function StepCards({ prev, next, courseHref }: AdjacentSteps & { courseHref: string }) {
  return (
    <nav aria-label="Lernschritte" className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
      {prev ? (
        <Link href={prev.href} className={cardClass}>
          <ArrowLeft
            aria-hidden
            className="size-5 shrink-0 text-muted transition group-hover:-translate-x-0.5 group-hover:text-accent"
          />
          <span className="min-w-0">
            <span className="block font-mono text-xs text-muted">Vorheriger Schritt</span>
            <span className="flex items-center gap-1.5 font-bold">
              <StepIcon step={prev} />
              <span className="truncate">{prev.title}</span>
            </span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      <Link href={next?.href ?? courseHref} className={`${cardClass} justify-end text-right`}>
        <span className="min-w-0">
          <span className="block font-mono text-xs text-muted">{next ? "Nächster Schritt" : "Geschafft"}</span>
          <span className="flex items-center justify-end gap-1.5 font-bold">
            {next && <StepIcon step={next} />}
            <span className="truncate">{next ? next.title : "Zur Kursübersicht"}</span>
          </span>
        </span>
        <ArrowRight
          aria-hidden
          className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </Link>
    </nav>
  );
}
