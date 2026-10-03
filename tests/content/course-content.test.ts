// @vitest-environment node
// Prüft die echten Kursinhalte unter content/lerninhalte – fällt bei Tippfehlern im Inhalt auf.
import { describe, expect, it } from "vitest";
import { getAllCourses, getQuiz } from "@/lib/content/courses";
import { quizPlainText } from "@/lib/utils/quiz-text";

const courses = getAllCourses();

describe("Kursinhalte", () => {
  it("enthält mindestens einen Kurs", () => {
    expect(courses.length).toBeGreaterThan(0);
  });

  for (const course of courses) {
    describe(course.title, () => {
      it("hat in jedem Modul mindestens ein Kapitel", () => {
        for (const courseModule of course.modules) expect(courseModule.lessons.length).toBeGreaterThan(0);
      });

      for (const lesson of course.lessons.filter((item) => item.hasQuiz)) {
        it(`Wissenstest „${lesson.title}“ ist stimmig`, () => {
          const quiz = getQuiz(course.slug, lesson.slug)!;
          for (const question of quiz.questions) {
            const where = `${lesson.slug}: ${quizPlainText(question.question).slice(0, 60)}`;
            expect(quiz.sections[question.section], `Abschnitt ${question.section} fehlt (${where})`).toBeTruthy();
            const options = question.options.map(quizPlainText);
            expect(new Set(options).size, `doppelte Antworten (${where})`).toBe(options.length);
          }
          const texts = quiz.questions.map((question) => quizPlainText(question.question));
          expect(new Set(texts).size, `doppelte Fragen in ${lesson.slug}`).toBe(texts.length);
        });
      }
    });
  }
});
