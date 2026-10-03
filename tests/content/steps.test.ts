// @vitest-environment node
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getCourse } from "@/lib/content/courses";
import { getAdjacentSteps, getCourseSteps, getProgressStepIds } from "@/lib/utils/steps";

const ROOT = path.join(import.meta.dirname, "fixtures", "lerninhalte");
const course = getCourse("kurs-c", ROOT)!;

describe("F11: Reihenfolge der Lernschritte", () => {
  it("folgt Kapitel → Wissenstest → nächstes Kapitel … → Anhänge", () => {
    expect(getCourseSteps(course).map((step) => step.id)).toEqual([
      "start",
      "start/wissenstest",
      "mitte",
      "ende",
      "ende/wissenstest",
      "glossar",
    ]);
  });

  it("baut die Adressen für Kapitel und Wissenstest", () => {
    const [lesson, quiz] = getCourseSteps(course);
    expect(lesson).toMatchObject({ kind: "lesson", href: "/lerninhalte/kurs-c/start" });
    expect(quiz).toMatchObject({ kind: "quiz", href: "/lerninhalte/kurs-c/start/wissenstest", title: "Wissenstest: Start" });
  });

  it("liefert Nachbarn, am Anfang ohne vorherigen und am Ende ohne nächsten Schritt", () => {
    const steps = getCourseSteps(course);
    expect(getAdjacentSteps(steps, "start").prev).toBeNull();
    expect(getAdjacentSteps(steps, "start").next?.id).toBe("start/wissenstest");
    expect(getAdjacentSteps(steps, "mitte").prev?.id).toBe("start/wissenstest");
    expect(getAdjacentSteps(steps, "glossar").next).toBeNull();
    expect(getAdjacentSteps(steps, "gibt-es-nicht")).toEqual({ prev: null, next: null });
  });
});

describe("F13/F19: Lernschritte für den Fortschritt", () => {
  it("zählt Kapitel und Wissenstests, aber keine Anhänge", () => {
    expect(getProgressStepIds(course)).toEqual(["start", "start/wissenstest", "mitte", "ende", "ende/wissenstest"]);
  });
});
