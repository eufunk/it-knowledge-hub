"use client";

import { Clock, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCourseSize } from "@/lib/utils/format";
import { ProgressBadge } from "./ProgressBadge";
import { useCourseProgress } from "./useCourseProgress";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  level?: string;
  moduleCount: number;
  chapterCount: number;
  stepIds: string[];
  // Überschriftenebene des Titels: h3 unter einer Zwischenüberschrift (Startseite, Kursgruppe), sonst h2
  headingLevel?: 2 | 3;
}

// F4: Kurskachel – Bild oben, Text darunter, Fortschritt unten
export function CourseCard({
  slug,
  title,
  description,
  duration,
  image,
  level,
  moduleCount,
  chapterCount,
  stepIds,
  headingLevel = 2,
}: CourseCardProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const { percent } = useCourseProgress(slug, stepIds);

  return (
    <Link
      href={`/lerninhalte/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <div className="relative aspect-video overflow-hidden bg-accent-soft">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <ProgressBadge percent={percent} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {level && <p className="font-mono text-xs font-medium tracking-wider text-accent uppercase">{level}</p>}
        <Heading className="mt-1.5 text-xl leading-snug font-bold tracking-tight">{title}</Heading>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{description}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-4" />
            {duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers aria-hidden className="size-4" />
            {formatCourseSize(moduleCount, chapterCount)}
          </span>
        </div>

        <ProgressBar percent={percent} className="mt-auto pt-5" />
      </div>
    </Link>
  );
}
