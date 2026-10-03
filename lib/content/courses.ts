import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { AdjacentLessons, Course, Lesson, LessonMeta } from "@/types/learning";
import { markdownToHtml } from "./markdown";

// F5: Kurse werden automatisch aus content/lerninhalte/* gelesen.
export const CONTENT_DIR = path.join(process.cwd(), "content", "lerninhalte");

const COURSE_FILE = "README.md";
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

function readLessonMetas(courseDir: string): LessonMeta[] {
  return lessonFiles(courseDir).map(({ name, order, slug }) => {
    const file = path.join(courseDir, name);
    const { data } = matter(fs.readFileSync(file, "utf8"));
    return {
      slug,
      order,
      title: requireString(data, "title", file),
      description: optionalString(data, "description"),
      duration: optionalString(data, "duration"),
    };
  });
}

function isCourseDir(root: string, slug: string): boolean {
  return SLUG.test(slug) && fs.existsSync(path.join(root, slug, COURSE_FILE));
}

export function getCourse(slug: string, root: string = CONTENT_DIR): Course | null {
  if (!isCourseDir(root, slug)) return null;

  const courseDir = path.join(root, slug);
  const file = path.join(courseDir, COURSE_FILE);
  const { data } = matter(fs.readFileSync(file, "utf8"));

  return {
    slug,
    title: requireString(data, "title", file),
    description: requireString(data, "description", file),
    duration: requireString(data, "duration", file),
    image: requireString(data, "image", file),
    level: optionalString(data, "level"),
    lessons: readLessonMetas(courseDir),
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

// F11: vorherige und nächste Einheit; am Anfang bzw. Ende null
export function getAdjacentLessons(course: Course, lessonSlug: string): AdjacentLessons {
  const index = course.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: course.lessons[index - 1] ?? null,
    next: course.lessons[index + 1] ?? null,
  };
}
