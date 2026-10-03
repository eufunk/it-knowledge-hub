import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { QuizRunner } from "@/components/learning/QuizRunner";
import { parseCompleted, readProgressRaw } from "@/lib/utils/progress-store";
import type { Quiz } from "@/types/learning";

const quiz: Quiz = {
  sections: { "1.1": "Thema eins" },
  questions: Array.from({ length: 12 }, (_, i) => ({
    section: "1.1",
    question: `Frage ${i + 1}?`,
    options: [`richtig ${i + 1}`, `falsch a ${i + 1}`, `falsch b ${i + 1}`, `falsch c ${i + 1}`],
    explanation: `Erklärung ${i + 1}`,
  })),
};

function renderQuiz() {
  render(
    <QuizRunner
      courseSlug="kurs-c"
      lessonSlug="start"
      lessonTitle="Start"
      lessonHref="/lerninhalte/kurs-c/start"
      stepIds={["start", "start/wissenstest"]}
      quiz={quiz}
    />,
  );
}

function answerCurrent(correct: boolean) {
  const heading = screen.getByRole("heading", { level: 2 }).textContent!;
  const number = heading.match(/Frage (\d+)\?/)![1];
  fireEvent.click(screen.getByRole("button", { name: new RegExp(correct ? `richtig ${number}$` : `falsch a ${number}$`) }));
}

describe("F17: QuizRunner", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("zeigt vor dem Start Pool-Größe und Bestehensgrenze", () => {
    renderQuiz();
    expect(screen.getByText(/10 zufällige Fragen aus einem Pool von 12 Fragen/)).toBeInTheDocument();
    expect(screen.getByText(/Bestanden ab 8 von 10/)).toBeInTheDocument();
  });

  it("gibt nach jeder Antwort Rückmeldung mit Erklärung und Thema", () => {
    renderQuiz();
    fireEvent.click(screen.getByRole("button", { name: "Test starten" }));
    expect(screen.getByText("Frage 1 von 10")).toBeInTheDocument();
    expect(screen.getByText("Thema: Thema eins")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nächste Frage" })).toBeDisabled();

    answerCurrent(false);
    expect(screen.getByText("Leider falsch.")).toBeInTheDocument();
    expect(screen.getByText(/^Erklärung \d+$/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nächste Frage" })).toBeEnabled();
  });

  it("markiert den Wissenstest bei mindestens 8 richtigen Antworten als erledigt", () => {
    renderQuiz();
    fireEvent.click(screen.getByRole("button", { name: "Test starten" }));
    for (let i = 0; i < 10; i++) {
      answerCurrent(i >= 2);
      fireEvent.click(screen.getByRole("button", { name: i === 9 ? "Ergebnis anzeigen" : "Nächste Frage" }));
    }
    expect(screen.getByText("8 von 10 richtig")).toBeInTheDocument();
    expect(screen.getByText(/Bestanden!/)).toBeInTheDocument();
    expect(parseCompleted(readProgressRaw("kurs-c"))).toContain("start/wissenstest");
  });

  it("markiert bei weniger als 8 richtigen Antworten nichts", () => {
    renderQuiz();
    fireEvent.click(screen.getByRole("button", { name: "Test starten" }));
    for (let i = 0; i < 10; i++) {
      answerCurrent(i >= 3);
      fireEvent.click(screen.getByRole("button", { name: i === 9 ? "Ergebnis anzeigen" : "Nächste Frage" }));
    }
    expect(screen.getByText("7 von 10 richtig")).toBeInTheDocument();
    expect(screen.getByText(/Noch nicht bestanden/)).toBeInTheDocument();
    expect(parseCompleted(readProgressRaw("kurs-c"))).not.toContain("start/wissenstest");
  });
});
