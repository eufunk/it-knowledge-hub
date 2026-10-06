// Kurs-Frontmatter ohne Kapitel und Markdown-Renderer – schlank genug für proxy.ts (F28)
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { RELEASE_PATTERN } from "@/lib/utils/release";

// F5: Kurse werden automatisch aus content/lerninhalte/* gelesen.
export const CONTENT_DIR = path.join(process.cwd(), "content", "lerninhalte");
export const COURSE_FILE = "README.md";
export const SLUG = /^[a-z0-9-]+$/;

export function isCourseDir(root: string, slug: string): boolean {
  return SLUG.test(slug) && fs.existsSync(path.join(root, slug, COURSE_FILE));
}

export function readCourseFrontmatter(root: string, slug: string): { data: Record<string, unknown>; file: string } {
  const file = path.join(root, slug, COURSE_FILE);
  return { data: matter(fs.readFileSync(file, "utf8")).data, file };
}

// YAML liest ein Datum ohne Anführungszeichen als Date – beide Schreibweisen sind erlaubt.
export function parseRelease(value: unknown, file: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  if (typeof text !== "string" || !RELEASE_PATTERN.test(text) || Number.isNaN(Date.parse(text))) {
    throw new Error(`"release" muss ein Datum JJJJ-MM-TT sein in ${file}`);
  }
  return text;
}

export function parseOrder(value: unknown, file: string): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`"order" muss eine ganze Zahl sein in ${file}`);
  return value;
}

// F28: Freigabedatum eines Kurses; unbekannte Kurse liefern undefined (die Seite antwortet dann mit 404)
export function getCourseRelease(slug: string, root: string = CONTENT_DIR): string | undefined {
  if (!isCourseDir(root, slug)) return undefined;
  const { data, file } = readCourseFrontmatter(root, slug);
  return parseRelease(data.release, file);
}
