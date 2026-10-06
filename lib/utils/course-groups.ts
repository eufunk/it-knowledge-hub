import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import type { Course } from "@/types/learning";

export const UNGROUPED_TITLE = "Weitere Kurse";

export interface CourseGroup {
  // fehlt, wenn es überhaupt keine Gruppen gibt (dann keine Zwischenüberschrift)
  title?: string;
  slug?: string;
  courses: Course[];
}

// Gruppentitel → Sprungziel, z. B. „IT Administration und Automation“ → „it-administration-und-automation“
export function groupSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// F27: Kurse nach `group` bündeln, Reihenfolge nach dem ersten Kurs der Gruppe, Kurse ohne Gruppe am Ende
export function groupCourses(courses: Course[]): CourseGroup[] {
  const groups = new Map<string, Course[]>();
  const ungrouped: Course[] = [];
  for (const course of courses) {
    if (!course.group) {
      ungrouped.push(course);
      continue;
    }
    const list = groups.get(course.group) ?? [];
    list.push(course);
    groups.set(course.group, list);
  }

  if (groups.size === 0) return courses.length > 0 ? [{ courses }] : [];

  const result: CourseGroup[] = [...groups].map(([title, list]) => ({ title, slug: groupSlug(title), courses: list }));
  if (ungrouped.length > 0) {
    result.push({ title: UNGROUPED_TITLE, slug: groupSlug(UNGROUPED_TITLE), courses: ungrouped });
  }
  return result;
}

// F6/F11/F27: Breadcrumb-Anfang „Lerninhalte › Gruppe“ (Gruppe nur, wenn der Kurs eine hat)
export function courseBreadcrumbStart(course: Pick<Course, "group">): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: "Lerninhalte", href: "/lerninhalte" }];
  if (course.group) items.push({ label: course.group, href: `/lerninhalte#${groupSlug(course.group)}` });
  return items;
}
