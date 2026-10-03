// @vitest-environment node
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAllCourses, getCourse, getLesson, getQuiz } from "@/lib/content/courses";

const ROOT = path.join(import.meta.dirname, "fixtures", "lerninhalte");
const BROKEN = path.join(import.meta.dirname, "fixtures", "fehlerhaft");

describe("F5: getAllCourses", () => {
  it("liest alle Kursordner mit README.md, sortiert nach Slug", () => {
    expect(getAllCourses(ROOT).map((course) => course.slug)).toEqual(["kurs-a", "kurs-b", "kurs-c"]);
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

  it("sortiert Kapitel numerisch nach Präfix und bildet den Slug ohne Nummer", () => {
    const lessons = getCourse("kurs-a", ROOT)!.lessons;
    expect(lessons.map((lesson) => [lesson.order, lesson.slug])).toEqual([
      [1, "einfuehrung"],
      [2, "grundlagen"],
      [10, "uebungen"],
    ]);
  });

  it("übernimmt optionale Felder des Kapitels", () => {
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
    expect(() => getCourse("kaputt", BROKEN)).toThrow(/Pflichtfeld "image"/);
  });
});

describe("F7/F15/F19: Module und Anhänge", () => {
  it("bildet ohne Angabe ein Modul „Kursinhalt“ aus allen Kapiteln", () => {
    const course = getCourse("kurs-a", ROOT)!;
    expect(course.modules).toHaveLength(1);
    expect(course.modules[0]).toMatchObject({ number: 1, title: "Kursinhalt" });
    expect(course.modules[0].lessons.map((lesson) => lesson.slug)).toEqual(["einfuehrung", "grundlagen", "uebungen"]);
    expect(course.appendix).toEqual([]);
  });

  it("ordnet Kapitel den Modulen aus dem Frontmatter zu", () => {
    const course = getCourse("kurs-c", ROOT)!;
    expect(course.modules.map((module) => [module.number, module.title, module.lessons.map((l) => l.slug)])).toEqual([
      [1, "Erstes Modul", ["start", "mitte"]],
      [2, "Zweites Modul", ["ende"]],
    ]);
  });

  it("führt Anhänge separat und ohne Wissenstest", () => {
    const course = getCourse("kurs-c", ROOT)!;
    expect(course.appendix.map((lesson) => lesson.slug)).toEqual(["glossar"]);
    expect(course.appendix[0]).toMatchObject({ appendix: true, hasQuiz: false });
  });

  it("erkennt Wissenstests an der JSON-Datei", () => {
    const lessons = getCourse("kurs-c", ROOT)!.lessons;
    expect(Object.fromEntries(lessons.map((lesson) => [lesson.slug, lesson.hasQuiz]))).toEqual({
      start: true,
      mitte: false,
      ende: true,
      glossar: false,
    });
  });

  it("bricht bei unbekannten Kapiteln im Modul ab", () => {
    expect(() => getCourse("modul-unbekannt", BROKEN)).toThrow(/unbekanntes Kapitel "drei"/);
  });

  it("bricht bei Kapiteln ohne Modul ab", () => {
    expect(() => getCourse("kapitel-ohne-modul", BROKEN)).toThrow(/Kapitel ohne Modul.*zwei/);
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

  it("liefert null für unbekannte Kapitel oder Kurse", async () => {
    expect(await getLesson("kurs-a", "gibt-es-nicht", ROOT)).toBeNull();
    expect(await getLesson("gibt-es-nicht", "einfuehrung", ROOT)).toBeNull();
  });
});

describe("F17: getQuiz", () => {
  it("liest den Fragen-Pool eines Kapitels", () => {
    const quiz = getQuiz("kurs-c", "start", ROOT);
    expect(quiz?.questions).toHaveLength(12);
    expect(quiz?.sections).toEqual({ "1.1": "Thema eins" });
    expect(quiz?.questions[0]).toMatchObject({ section: "1.1", question: "Frage 1", options: expect.any(Array) });
  });

  it("liefert null für Kapitel ohne Wissenstest und für Anhänge", () => {
    expect(getQuiz("kurs-c", "mitte", ROOT)).toBeNull();
    expect(getQuiz("kurs-c", "glossar", ROOT)).toBeNull();
  });

  it("bricht ab, wenn der Pool zu klein ist", () => {
    expect(() => getQuiz("quiz-zu-klein", "eins", BROKEN)).toThrow(/mindestens 10 Fragen/);
  });
});
