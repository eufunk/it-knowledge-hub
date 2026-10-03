import type { QuizQuestion } from "@/types/learning";

// F17: Ablauf des Wissenstests
export const QUIZ_LENGTH = 10;
export const PASS_RATIO = 0.8;

export interface PreparedQuestion {
  section: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const TRUE_FALSE = ["Richtig", "Falsch"];

export function isTrueFalse(options: readonly string[]): boolean {
  return options.length === 2 && TRUE_FALSE.every((label) => options.includes(label));
}

// Zieht zufällige Fragen und mischt die Antworten; die richtige Antwort steht in der Quelle an erster Stelle.
// Richtig/Falsch-Fragen behalten die feste Reihenfolge „Richtig“, „Falsch“.
export function drawQuestions(
  pool: readonly QuizQuestion[],
  count: number = QUIZ_LENGTH,
  random: () => number = Math.random,
): PreparedQuestion[] {
  return shuffle(pool, random)
    .slice(0, count)
    .map((item) => {
      const labelled = item.options.map((text, index) => ({ text, correct: index === 0 }));
      const options = isTrueFalse(item.options)
        ? TRUE_FALSE.map((label) => labelled.find((option) => option.text === label)!)
        : shuffle(labelled, random);
      return {
        section: item.section,
        question: item.question,
        options: options.map((option) => option.text),
        correctIndex: options.findIndex((option) => option.correct),
        explanation: item.explanation,
      };
    });
}

export function isPassed(correct: number, total: number): boolean {
  return total > 0 && correct / total >= PASS_RATIO;
}
