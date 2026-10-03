"use client";

import { Check, CircleCheck, CircleX, FileQuestionMark, RotateCcw, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { setLessonCompleted } from "@/lib/utils/progress-store";
import { drawQuestions, isPassed, PASS_RATIO, QUIZ_LENGTH, type PreparedQuestion } from "@/lib/utils/quiz";
import { quizStepId } from "@/lib/utils/steps";
import type { Quiz } from "@/types/learning";
import { QuizText } from "./QuizText";
import { useCourseProgress } from "./useCourseProgress";

interface QuizRunnerProps {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonHref: string;
  stepIds: string[];
  quiz: Quiz;
}

type Phase =
  | { name: "start" }
  | { name: "run"; questions: PreparedQuestion[]; index: number; answers: (number | null)[] }
  | { name: "result"; questions: PreparedQuestion[]; answers: (number | null)[] };

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-white shadow-sm shadow-accent/25 transition-colors hover:bg-accent-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent";

function countCorrect(questions: PreparedQuestion[], answers: (number | null)[]): number {
  return questions.filter((question, index) => answers[index] === question.correctIndex).length;
}

// F17: Wissenstest – 10 zufällige Fragen, sofortige Rückmeldung, bestanden ab 80 %
export function QuizRunner({ courseSlug, lessonSlug, lessonTitle, lessonHref, stepIds, quiz }: QuizRunnerProps) {
  const [phase, setPhase] = useState<Phase>({ name: "start" });
  const { completed } = useCourseProgress(courseSlug, stepIds);
  const alreadyPassed = completed.has(quizStepId(lessonSlug));
  const length = Math.min(QUIZ_LENGTH, quiz.questions.length);
  const required = Math.ceil(length * PASS_RATIO);

  const start = () => {
    const questions = drawQuestions(quiz.questions, length);
    setPhase({ name: "run", questions, index: 0, answers: questions.map(() => null) });
  };

  if (phase.name === "start") {
    return (
      <div className="mt-6 rounded-[24px] border border-line bg-surface p-6 sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <FileQuestionMark aria-hidden className="size-6" />
        </span>
        <p className="mt-5 font-mono text-sm text-accent">Wissenstest</p>
        <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{lessonTitle}</h1>
        <ul className="mt-6 space-y-2 text-muted">
          <li>
            • {length} zufällige Fragen aus einem Pool von {quiz.questions.length} Fragen
          </li>
          <li>• Nach jeder Antwort siehst du sofort, ob sie richtig war, und eine Erklärung</li>
          <li>
            • Bestanden ab {required} von {length} richtigen Antworten
          </li>
        </ul>
        {alreadyPassed && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-success-soft px-4 py-2 font-semibold text-success">
            <CircleCheck aria-hidden className="size-5" />
            Bereits bestanden – du kannst den Test jederzeit wiederholen.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={start} className={primaryButton}>
            Test starten
          </button>
          <Link href={lessonHref} className={secondaryButton}>
            Kapitel nochmal lesen
          </Link>
        </div>
      </div>
    );
  }

  if (phase.name === "result") {
    const correct = countCorrect(phase.questions, phase.answers);
    const passed = isPassed(correct, phase.questions.length);
    return (
      <div className="mt-6 rounded-[24px] border border-line bg-surface p-6 sm:p-10">
        <span
          className={`flex size-12 items-center justify-center rounded-2xl ${
            passed ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
          }`}
        >
          {passed ? <Trophy aria-hidden className="size-6" /> : <RotateCcw aria-hidden className="size-6" />}
        </span>
        <p className="mt-5 font-mono text-sm text-accent">Ergebnis</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
          {correct} von {phase.questions.length} richtig
        </h1>
        <p className={`mt-3 text-lg font-semibold ${passed ? "text-success" : "text-danger"}`}>
          {passed
            ? "Bestanden! Der Wissenstest ist als erledigt markiert."
            : `Noch nicht bestanden – du brauchst mindestens ${required} richtige Antworten.`}
        </p>

        <ol className="mt-8 space-y-2">
          {phase.questions.map((question, index) => {
            const right = phase.answers[index] === question.correctIndex;
            return (
              <li key={question.question} className="flex gap-3 rounded-xl border border-line p-3 text-sm">
                {right ? (
                  <CircleCheck aria-label="richtig" className="mt-0.5 size-5 shrink-0 text-success" />
                ) : (
                  <CircleX aria-label="falsch" className="mt-0.5 size-5 shrink-0 text-danger" />
                )}
                <span>
                  <span className="font-semibold">
                    <QuizText text={question.question} />
                  </span>
                  {!right && (
                    <span className="mt-1 block text-muted">
                      Richtig: <QuizText text={question.options[question.correctIndex]} />
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={start} className={passed ? secondaryButton : primaryButton}>
            <RotateCcw aria-hidden className="size-4" />
            Neuer Durchlauf
          </button>
          {!passed && (
            <Link href={lessonHref} className={secondaryButton}>
              Kapitel nochmal lesen
            </Link>
          )}
        </div>
      </div>
    );
  }

  const { questions, index, answers } = phase;
  const question = questions[index];
  const answer = answers[index];
  const answered = answer !== null;
  const isLast = index === questions.length - 1;

  const choose = (option: number) => {
    if (answered) return;
    setPhase({ ...phase, answers: answers.map((value, i) => (i === index ? option : value)) });
  };

  const next = () => {
    if (!isLast) {
      setPhase({ ...phase, index: index + 1 });
      return;
    }
    if (isPassed(countCorrect(questions, answers), questions.length)) {
      setLessonCompleted(courseSlug, quizStepId(lessonSlug), true);
    }
    setPhase({ name: "result", questions, answers });
  };

  return (
    <div className="mt-6 rounded-[24px] border border-line bg-surface p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-sm text-accent">
          Frage {index + 1} von {questions.length}
        </p>
        <ol className="flex gap-1" aria-hidden>
          {questions.map((item, i) => (
            <li
              key={item.question}
              className={`h-1.5 w-4 rounded-full sm:w-6 ${
                answers[i] === null
                  ? i === index
                    ? "bg-accent/40"
                    : "bg-line"
                  : answers[i] === item.correctIndex
                    ? "bg-success"
                    : "bg-danger"
              }`}
            />
          ))}
        </ol>
      </div>

      <p className="mt-6 text-sm text-muted">Thema: {quiz.sections[question.section] ?? question.section}</p>
      <h2 className="mt-1 text-2xl leading-snug font-bold tracking-tight">
        <QuizText text={question.question} />
      </h2>

      <ul className="mt-6 space-y-3">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctIndex;
          const isChosen = optionIndex === answer;
          const look = !answered
            ? "border-line hover:border-accent/50 hover:bg-accent-soft"
            : isCorrect
              ? "border-success bg-success-soft"
              : isChosen
                ? "border-danger bg-danger-soft"
                : "border-line opacity-60";
          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => choose(optionIndex)}
                disabled={answered}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors focus-visible:outline-3 focus-visible:outline-accent disabled:cursor-default ${look}`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas font-mono text-sm font-bold">
                  {LETTERS[optionIndex]}
                </span>
                <span className="flex-1">
                  <QuizText text={option} />
                </span>
                {answered && isCorrect && <Check aria-label="richtige Antwort" className="size-5 shrink-0 text-success" />}
                {answered && isChosen && !isCorrect && <X aria-label="deine Antwort" className="size-5 shrink-0 text-danger" />}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div
          aria-live="polite"
          className={`mt-6 rounded-xl border-l-4 p-4 ${
            answer === question.correctIndex ? "border-success bg-success-soft" : "border-danger bg-danger-soft"
          }`}
        >
          <p className="font-bold">{answer === question.correctIndex ? "Richtig!" : "Leider falsch."}</p>
          <p className="mt-1">
            <QuizText text={question.explanation} />
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button type="button" onClick={next} disabled={!answered} className={`${primaryButton} disabled:opacity-40`}>
          {isLast ? "Ergebnis anzeigen" : "Nächste Frage"}
        </button>
      </div>
    </div>
  );
}
