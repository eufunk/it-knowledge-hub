// Inhaltsmodell der Lernplattform (siehe docs/feature-spec.md, Abschnitt 5.4)

export interface LessonMeta {
  slug: string;
  order: number;
  title: string;
  description?: string;
  duration?: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  level?: string;
  lessons: LessonMeta[];
}

export interface Lesson extends LessonMeta {
  courseSlug: string;
  html: string;
}

export interface AdjacentLessons {
  prev: LessonMeta | null;
  next: LessonMeta | null;
}
