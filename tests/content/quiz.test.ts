import { describe, expect, it } from "vitest";
import { drawQuestions, isPassed, shuffle } from "@/lib/utils/quiz";
import type { QuizQuestion } from "@/types/learning";

// Reproduzierbarer Zufall für die Tests
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const pool: QuizQuestion[] = Array.from({ length: 15 }, (_, i) => ({
  section: "1.1",
  question: `Frage ${i + 1}`,
  options: [`richtig ${i + 1}`, "falsch a", "falsch b", "falsch c"],
  explanation: `Erklärung ${i + 1}`,
}));

describe("F17: Wissenstest", () => {
  it("mischt, ohne Elemente zu verlieren oder die Eingabe zu verändern", () => {
    const items = [1, 2, 3, 4, 5];
    const result = shuffle(items, seeded(1));
    expect([...result].sort()).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });

  it("zieht 10 verschiedene Fragen aus dem Pool", () => {
    const drawn = drawQuestions(pool, 10, seeded(7));
    expect(drawn).toHaveLength(10);
    expect(new Set(drawn.map((q) => q.question)).size).toBe(10);
  });

  it("merkt sich die richtige Antwort auch nach dem Mischen", () => {
    for (const question of drawQuestions(pool, 10, seeded(42))) {
      const number = question.question.replace("Frage ", "");
      expect(question.options[question.correctIndex]).toBe(`richtig ${number}`);
      expect(question.options).toHaveLength(4);
    }
  });

  it("gilt ab 80 % als bestanden", () => {
    expect(isPassed(8, 10)).toBe(true);
    expect(isPassed(10, 10)).toBe(true);
    expect(isPassed(7, 10)).toBe(false);
    expect(isPassed(0, 0)).toBe(false);
  });
});
