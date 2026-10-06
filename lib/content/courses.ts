import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Course, CourseModule, Lesson, LessonMeta, Quiz, QuizQuestion } from "@/types/learning";
import { QUIZ_LENGTH } from "@/lib/utils/quiz";
import { markdownToHtml } from "./markdown";

// F5: Kurse werden automatisch aus content/lerninhalte/* gelesen.
export const CONTENT_DIR = path.join(process.cwd(), "content", "lerninhalte");

const COURSE_FILE = "README.md";
const QUIZ_DIR = "wissenstest";
const SLUG = /^[a-z0-9-]+$/;
const LESSON_FILE = /^(\d+)-([a-z0-9-]+)\.md$/;

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Pflichtfeld "${key}" fehlt im Frontmatter von ${file}`);
  }
  return value;
}

function optionalString(data: Record<string, unknown>, key: string): string | undefined {
  const value = data[key];
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function lessonFiles(courseDir: string): { name: string; order: number; slug: string }[] {
  return fs
    .readdirSync(courseDir)
    .flatMap((name) => {
      const match = LESSON_FILE.exec(name);
      return match ? [{ name, order: Number(match[1]), slug: match[2] }] : [];
    })
    .sort((a, b) => a.order - b.order);
}

function quizFile(courseDir: string, lessonSlug: string): string {
  return path.join(courseDir, QUIZ_DIR, `${lessonSlug}.json`);
}

function readLessonMetas(courseDir: string): LessonMeta[] {
  return lessonFiles(courseDir).map(({ name, order, slug }) => {
    const file = path.join(courseDir, name);
    const { data } = matter(fs.readFileSync(file, "utf8"));
    const appendix = data.anhang === true;
    return {
      slug,
      order,
      title: requireString(data, "title", file),
      description: optionalString(data, "description"),
      duration: optionalString(data, "duration"),
      appendix,
      hasQuiz: !appendix && fs.existsSync(quizFile(courseDir, slug)),
    };
  });
}

// Module aus dem Frontmatter; jedes Kapitel (außer Anhängen) gehört zu genau einem Modul.
function buildModules(rawModules: unknown, lessons: LessonMeta[], file: string): CourseModule[] {
  const chapters = lessons.filter((lesson) => !lesson.appendix);
  if (rawModules === undefined) {
    return chapters.length > 0 ? [{ number: 1, title: "Kursinhalt", lessons: chapters }] : [];
  }
  if (!Array.isArray(rawModules)) throw new Error(`"modules" muss eine Liste sein in ${file}`);

  const bySlug = new Map(chapters.map((lesson) => [lesson.slug, lesson]));
  const assigned = new Set<string>();

  const modules = rawModules.map((raw: Record<string, unknown>, index): CourseModule => {
    const title = requireString(raw ?? {}, "title", `${file} (Modul ${index + 1})`);
    const slugs = raw.chapters;
    if (!Array.isArray(slugs) || slugs.length === 0) {
      throw new Error(`Modul "${title}" in ${file} braucht eine Liste "chapters"`);
    }
    return {
      number: index + 1,
      title,
      lessons: slugs.map((slug: unknown) => {
        const lesson = typeof slug === "string" ? bySlug.get(slug) : undefined;
        if (!lesson) throw new Error(`Modul "${title}" in ${file} nennt unbekanntes Kapitel "${String(slug)}"`);
        if (assigned.has(lesson.slug)) throw new Error(`Kapitel "${lesson.slug}" ist mehreren Modulen zugeordnet (${file})`);
        assigned.add(lesson.slug);
        return lesson;
      }),
    };
  });

  const missing = chapters.filter((lesson) => !assigned.has(lesson.slug));
  if (missing.length > 0) {
    throw new Error(`Kapitel ohne Modul in ${file}: ${missing.map((lesson) => lesson.slug).join(", ")}`);
  }
  return modules;
}

function isCourseDir(root: string, slug: string): boolean {
  return SLUG.test(slug) && fs.existsSync(path.join(root, slug, COURSE_FILE));
}

export function getCourse(slug: string, root: string = CONTENT_DIR): Course | null {
  if (!isCourseDir(root, slug)) return null;

  const courseDir = path.join(root, slug);
  const file = path.join(courseDir, COURSE_FILE);
  const { data } = matter(fs.readFileSync(file, "utf8"));
  const lessons = readLessonMetas(courseDir);

  return {
    slug,
    title: requireString(data, "title", file),
    description: requireString(data, "description", file),
    duration: requireString(data, "duration", file),
    image: requireString(data, "image", file),
    level: optionalString(data, "level"),
    group: optionalString(data, "group"),
    lessons,
    modules: buildModules(data.modules, lessons, file),
    appendix: lessons.filter((lesson) => lesson.appendix),
  };
}

// Ordner ohne README.md sind keine Kurse und werden übersprungen.
export function getAllCourses(root: string = CONTENT_DIR): Course[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isCourseDir(root, entry.name))
    .map((entry) => entry.name)
    .sort()
    .map((slug) => getCourse(slug, root))
    .filter((course): course is Course => course !== null);
}

export async function getLesson(
  courseSlug: string,
  lessonSlug: string,
  root: string = CONTENT_DIR,
): Promise<Lesson | null> {
  const course = getCourse(courseSlug, root);
  const meta = course?.lessons.find((lesson) => lesson.slug === lessonSlug);
  if (!meta) return null;

  const courseDir = path.join(root, courseSlug);
  const entry = lessonFiles(courseDir).find((file) => file.slug === lessonSlug)!;
  const { content } = matter(fs.readFileSync(path.join(courseDir, entry.name), "utf8"));
  return { ...meta, courseSlug, html: await markdownToHtml(content) };
}

function validateQuestion(raw: unknown, file: string, index: number): QuizQuestion {
  const q = (raw ?? {}) as Record<string, unknown>;
  const where = `${file} (Frage ${index + 1})`;
  const options = q.options;
  if (!Array.isArray(options) || options.length < 2 || !options.every((o) => typeof o === "string" && o.trim())) {
    throw new Error(`Mindestens zwei Antworten nötig in ${where}`);
  }
  return {
    section: requireString(q, "section", where),
    question: requireString(q, "question", where),
    options: options as string[],
    explanation: requireString(q, "explanation", where),
  };
}

// F17: Fragen-Pool des Wissenstests zu einem Kapitel
export function getQuiz(courseSlug: string, lessonSlug: string, root: string = CONTENT_DIR): Quiz | null {
  const lesson = getCourse(courseSlug, root)?.lessons.find((item) => item.slug === lessonSlug);
  if (!lesson?.hasQuiz) return null;

  const file = quizFile(path.join(root, courseSlug), lessonSlug);
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as { sections?: unknown; questions?: unknown };
  if (!Array.isArray(data.questions) || data.questions.length < QUIZ_LENGTH) {
    throw new Error(`Wissenstest braucht mindestens ${QUIZ_LENGTH} Fragen: ${file}`);
  }
  const sections =
    data.sections && typeof data.sections === "object" ? (data.sections as Record<string, string>) : {};
  return { sections, questions: data.questions.map((q, index) => validateQuestion(q, file, index)) };
}
