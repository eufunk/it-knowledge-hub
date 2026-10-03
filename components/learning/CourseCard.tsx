"use client";

import Image from "next/image";
import Link from "next/link";
import { formatLessonCount } from "@/lib/utils/format";
import { ProgressBadge } from "./ProgressBadge";
import { useCourseProgress } from "./useCourseProgress";

interface CourseCardProps {
  slug: string;
  title: string;
  duration: string;
  image: string;
  lessonSlugs: string[];
}

// F4: Kurskachel mit Bild, Verlauf, Fortschritts-Badge, Titel und Dauer
export function CourseCard({ slug, title, duration, image, lessonSlugs }: CourseCardProps) {
  const { percent } = useCourseProgress(slug, lessonSlugs);

  return (
    <Link
      href={`/lerninhalte/${slug}`}
      className="group relative block aspect-square overflow-hidden rounded-card bg-sidebar shadow-md transition-shadow hover:shadow-xl focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent" />

      <div className="absolute top-5 left-5">
        <ProgressBadge percent={percent} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h2 className="text-2xl leading-snug font-semibold">{title}</h2>
        <p className="mt-1 text-lg text-white/90">
          Dauer: {duration} · {formatLessonCount(lessonSlugs.length)}
        </p>
      </div>
    </Link>
  );
}
