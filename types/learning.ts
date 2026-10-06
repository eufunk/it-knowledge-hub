// Inhaltsmodell der Lernplattform (siehe docs/feature-spec.md, Abschnitt 5)

export interface LessonMeta {
  slug: string;
  order: number;
  title: string;
  description?: string;
  duration?: string;
  // F19: Anhang (z. B. Glossar) – ohne Wissenstest, zählt nicht zum Fortschritt
  appendix: boolean;
  hasQuiz: boolean;
}

export interface CourseModule {
  number: number;
  title: string;
  lessons: LessonMeta[];
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  level?: string;
  // F27: Kursgruppe in der Übersicht, z. B. „IT Administration und Automation“
  group?: string;
  // Reihenfolge in Übersicht und Gruppe (kleinere Zahl zuerst)
  order?: number;
  // F28: Freigabedatum „JJJJ-MM-TT“; ohne Angabe sofort sichtbar
  release?: string;
  // alle Kapitel inkl. Anhänge, sortiert nach Nummernpräfix
  lessons: LessonMeta[];
  modules: CourseModule[];
  appendix: LessonMeta[];
}

export interface Lesson extends LessonMeta {
  courseSlug: string;
  html: string;
}

export interface QuizQuestion {
  section: string;
  question: string;
  // die erste Antwort ist die richtige
  options: string[];
  explanation: string;
}

export interface Quiz {
  sections: Record<string, string>;
  questions: QuizQuestion[];
}

// Ein Lernschritt im Kursplayer: Kapitel lesen oder Wissenstest
export interface CourseStep {
  id: string;
  kind: "lesson" | "quiz";
  lessonSlug: string;
  title: string;
  href: string;
  // false für Anhänge (zählen nicht zum Fortschritt)
  counts: boolean;
}

export interface AdjacentSteps {
  prev: CourseStep | null;
  next: CourseStep | null;
}
