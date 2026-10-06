import { describe, expect, it } from "vitest";
import { courseSlugFromPath, isCourseVisible, localDate, visibleCourses } from "@/lib/utils/release";

const TESTER = { tester: true };
const NORMAL = { tester: false };

describe("F28: Kursfreigabe", () => {
  it("bildet den Kalendertag in lokaler Zeit", () => {
    expect(localDate(new Date(2026, 9, 5, 23, 59))).toBe("2026-10-05");
    expect(localDate(new Date(2026, 0, 1, 0, 0))).toBe("2026-01-01");
  });

  it("gibt Kurse ab dem Freigabetag frei, Kurse ohne Datum sofort", () => {
    expect(isCourseVisible(undefined, NORMAL, "2026-10-06")).toBe(true);
    expect(isCourseVisible("2026-10-12", NORMAL, "2026-10-11")).toBe(false);
    expect(isCourseVisible("2026-10-12", NORMAL, "2026-10-12")).toBe(true);
    expect(isCourseVisible("2026-10-12", null, "2026-10-11")).toBe(false);
  });

  it("zeigt Testern alle Kurse unabhängig vom Datum", () => {
    expect(isCourseVisible("2999-01-01", TESTER, "2026-10-06")).toBe(true);
  });

  it("filtert die Kursliste und behält die Reihenfolge", () => {
    const courses = [{ slug: "a", release: "2026-10-05" }, { slug: "b", release: "2026-10-12" }, { slug: "c" }];
    expect(visibleCourses(courses, NORMAL, "2026-10-06").map((c) => c.slug)).toEqual(["a", "c"]);
    expect(visibleCourses(courses, TESTER, "2026-10-06").map((c) => c.slug)).toEqual(["a", "b", "c"]);
  });

  it("liest den Kurs-Slug aus Adressen unter /lerninhalte", () => {
    expect(courseSlugFromPath("/lerninhalte")).toBeNull();
    expect(courseSlugFromPath("/lerninhalte/kurs")).toBe("kurs");
    expect(courseSlugFromPath("/lerninhalte/kurs/kapitel/wissenstest")).toBe("kurs");
  });
});
