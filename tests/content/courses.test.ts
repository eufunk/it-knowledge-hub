// @vitest-environment node
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getAdjacentLessons,
  getAllCourses,
  getCourse,
  getLesson,
} from "@/lib/content/courses";

const ROOT = path.join(import.meta.dirname, "fixtures", "lerninhalte");

describe("F5: getAllCourses", () => {
  it("liest alle Kursordner mit README.md, sortiert nach Slug", () => {
    expect(getAllCourses(ROOT).map((course) => course.slug)).toEqual(["kurs-a", "kurs-b"]);
  });

  it("liefert eine leere Liste, wenn der Inhaltsordner fehlt", () => {
    expect(getAllCourses(path.join(ROOT, "gibt-es-nicht"))).toEqual([]);
  });
});

describe("getCourse", () => {
  it("liest die Kurs-Metadaten aus dem Frontmatter", () => {
    expect(getCourse("kurs-a", ROOT)).toMatchObject({
      slug: "kurs-a",
      title: "Kurs A",
      description: "Beschreibung A",
      duration: "1 Woche",
      image: "/images/kurse/a.jpg",
      level: "Einsteiger",
    });
  });

  it("sortiert Einheiten numerisch nach Präfix und bildet den Slug ohne Nummer", () => {
    const lessons = getCourse("kurs-a", ROOT)!.lessons;
    expect(lessons.map((lesson) => [lesson.order, lesson.slug])).toEqual([
      [1, "einfuehrung"],
      [2, "grundlagen"],
      [10, "uebungen"],
    ]);
  });

  it("übernimmt optionale Felder der Einheit", () => {
    const [first, second] = getCourse("kurs-a", ROOT)!.lessons;
    expect(first).toMatchObject({ title: "Einführung", duration: "20 Minuten" });
    expect(second.duration).toBeUndefined();
  });

  it("liefert null für unbekannte Kurse, Ordner ohne README.md und ungültige Slugs", () => {
    expect(getCourse("gibt-es-nicht", ROOT)).toBeNull();
    expect(getCourse("ohne-readme", ROOT)).toBeNull();
    expect(getCourse("../kurs-a", ROOT)).toBeNull();
  });

  it("meldet fehlende Pflichtfelder mit Dateinamen", () => {
    expect(() => getCourse("kaputt", path.join(import.meta.dirname, "fixtures", "fehlerhaft"))).toThrow(
      /Pflichtfeld "image"/,
    );
  });
});

describe("F9: getLesson", () => {
  it("rendert Markdown mit Tabelle und hervorgehobenem Codeblock, ohne Frontmatter", async () => {
    const lesson = await getLesson("kurs-a", "einfuehrung", ROOT);
    expect(lesson?.courseSlug).toBe("kurs-a");
    expect(lesson?.title).toBe("Einführung");
    expect(lesson?.html).toContain("<table>");
    expect(lesson?.html).toContain('data-language="bash"');
    expect(lesson?.html).not.toContain("title:");
  });

  it("liefert null für unbekannte Einheiten oder Kurse", async () => {
    expect(await getLesson("kurs-a", "gibt-es-nicht", ROOT)).toBeNull();
    expect(await getLesson("gibt-es-nicht", "einfuehrung", ROOT)).toBeNull();
  });
});

describe("F11: getAdjacentLessons", () => {
  const course = getCourse("kurs-a", ROOT)!;

  it("hat bei der ersten Einheit keine vorherige", () => {
    const { prev, next } = getAdjacentLessons(course, "einfuehrung");
    expect(prev).toBeNull();
    expect(next?.slug).toBe("grundlagen");
  });

  it("hat bei der letzten Einheit keine nächste", () => {
    const { prev, next } = getAdjacentLessons(course, "uebungen");
    expect(prev?.slug).toBe("grundlagen");
    expect(next).toBeNull();
  });

  it("liefert null/null für eine unbekannte Einheit", () => {
    expect(getAdjacentLessons(course, "gibt-es-nicht")).toEqual({ prev: null, next: null });
  });
});
