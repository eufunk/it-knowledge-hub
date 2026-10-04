// F23/F24: Lernfortschritt angemeldeter Nutzer in der Datenbank
import { getDb } from "./db.ts";

export type ProgressByCourse = Record<string, string[]>;

export function getAllProgress(userId: number): ProgressByCourse {
  const rows = getDb()
    .prepare("SELECT course_slug, step_id FROM progress WHERE user_id = ? ORDER BY course_slug, completed_at, step_id")
    .all(userId) as { course_slug: string; step_id: string }[];
  const result: ProgressByCourse = {};
  for (const row of rows) (result[row.course_slug] ??= []).push(row.step_id);
  return result;
}

export function setStepCompleted(userId: number, courseSlug: string, stepId: string, completed: boolean): void {
  const db = getDb();
  if (completed) {
    db.prepare("INSERT OR IGNORE INTO progress (user_id, course_slug, step_id, completed_at) VALUES (?, ?, ?, ?)").run(
      userId,
      courseSlug,
      stepId,
      new Date().toISOString(),
    );
  } else {
    db.prepare("DELETE FROM progress WHERE user_id = ? AND course_slug = ? AND step_id = ?").run(userId, courseSlug, stepId);
  }
}

// Vereinigung: vorhandene Einträge bleiben, neue kommen hinzu – es geht nichts verloren.
export function mergeProgress(userId: number, progress: ProgressByCourse): void {
  const db = getDb();
  const insert = db.prepare("INSERT OR IGNORE INTO progress (user_id, course_slug, step_id, completed_at) VALUES (?, ?, ?, ?)");
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    for (const [courseSlug, steps] of Object.entries(progress)) {
      for (const stepId of steps) insert.run(userId, courseSlug, stepId, now);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
