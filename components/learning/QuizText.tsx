import { Fragment } from "react";
import { parseQuizText } from "@/lib/utils/quiz-text";

// F17: Quiztext mit Inline-Code und Zeilenumbrüchen, ohne HTML einzufügen
export function QuizText({ text }: { text: string }) {
  return (
    <>
      {parseQuizText(text).map((part, index) => {
        if (part.type === "br") return <br key={index} />;
        if (part.type === "code")
          return (
            <code key={index} className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
              {part.value}
            </code>
          );
        return <Fragment key={index}>{part.value}</Fragment>;
      })}
    </>
  );
}
