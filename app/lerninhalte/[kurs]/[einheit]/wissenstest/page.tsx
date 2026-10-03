import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/learning/CoursePlayer";
import { QuizRunner } from "@/components/learning/QuizRunner";
import { StepCards, StepTopBar } from "@/components/learning/StepNavigation";
import { getAllCourses, getCourse, getQuiz } from "@/lib/content/courses";
import { getPlayerData } from "@/lib/content/player";
import { lessonHref, quizStepId } from "@/lib/utils/steps";

// Kapitel ohne Wissenstest führen zu 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCourses().flatMap((course) =>
    course.lessons.filter((lesson) => lesson.hasQuiz).map((lesson) => ({ kurs: course.slug, einheit: lesson.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/lerninhalte/[kurs]/[einheit]/wissenstest">): Promise<Metadata> {
  const { kurs, einheit } = await params;
  const lesson = getCourse(kurs)?.lessons.find((item) => item.slug === einheit);
  return lesson ? { title: `Wissenstest: ${lesson.title}` } : {};
}

// F17: Wissenstest zu einem Kapitel im Kursplayer
export default async function WissenstestPage({ params }: PageProps<"/lerninhalte/[kurs]/[einheit]/wissenstest">) {
  const { kurs, einheit } = await params;
  const course = getCourse(kurs);
  const lesson = course?.lessons.find((item) => item.slug === einheit);
  const quiz = getQuiz(kurs, einheit);
  if (!course || !lesson || !quiz) notFound();

  const { nav, adjacent, stepIds } = getPlayerData(course, quizStepId(lesson.slug));
  const courseHref = `/lerninhalte/${course.slug}`;

  return (
    <CoursePlayer
      nav={nav}
      topBar={
        <StepTopBar
          breadcrumb={[
            { label: "Lerninhalte", href: "/lerninhalte" },
            { label: course.title, href: courseHref },
            { label: lesson.title, href: lessonHref(course.slug, lesson.slug) },
            { label: "Wissenstest" },
          ]}
          courseHref={courseHref}
          {...adjacent}
        />
      }
    >
      <QuizRunner
        courseSlug={course.slug}
        lessonSlug={lesson.slug}
        lessonTitle={lesson.title}
        lessonHref={lessonHref(course.slug, lesson.slug)}
        stepIds={stepIds}
        quiz={quiz}
      />
      <StepCards courseHref={courseHref} {...adjacent} />
    </CoursePlayer>
  );
}
