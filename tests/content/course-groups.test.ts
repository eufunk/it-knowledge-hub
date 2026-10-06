import { describe, expect, it } from "vitest";
import { courseBreadcrumbStart, groupCourses, groupSlug } from "@/lib/utils/course-groups";
import type { Course } from "@/types/learning";

const course = (slug: string, group?: string) => ({ slug, group }) as Course;

describe("F27: Kursgruppen", () => {
  it("bildet aus dem Gruppentitel ein Sprungziel", () => {
    expect(groupSlug("IT Administration und Automation")).toBe("it-administration-und-automation");
    expect(groupSlug("Größe & Übersicht")).toBe("groesse-uebersicht");
  });

  it("bündelt Kurse nach Gruppe in der Reihenfolge ihres ersten Kurses, ohne Gruppe am Ende", () => {
    const groups = groupCourses([course("a", "Zweite"), course("b"), course("c", "Erste"), course("d", "Zweite")]);
    expect(groups.map((g) => [g.title, g.courses.map((c) => c.slug)])).toEqual([
      ["Zweite", ["a", "d"]],
      ["Erste", ["c"]],
      ["Weitere Kurse", ["b"]],
    ]);
    expect(groups[0].slug).toBe("zweite");
  });

  it("liefert ohne Gruppen eine Liste ohne Zwischenüberschrift", () => {
    const groups = groupCourses([course("a"), course("b")]);
    expect(groups).toHaveLength(1);
    expect(groups[0].title).toBeUndefined();
    expect(groupCourses([])).toEqual([]);
  });

  it("setzt die Gruppe in den Breadcrumb, wenn der Kurs eine hat", () => {
    expect(courseBreadcrumbStart({ group: "IT Administration und Automation" })).toEqual([
      { label: "Lerninhalte", href: "/lerninhalte" },
      { label: "IT Administration und Automation", href: "/lerninhalte#it-administration-und-automation" },
    ]);
    expect(courseBreadcrumbStart({})).toEqual([{ label: "Lerninhalte", href: "/lerninhalte" }]);
  });
});
