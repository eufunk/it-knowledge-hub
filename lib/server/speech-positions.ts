// F20: Zuletzt vorgelesene Stelle je Kapitel für angemeldete Nutzer
import { getDb } from "./db.ts";

export interface StoredSpeechPosition {
  index: number;
  total: number;
  text: string;
  // Zeitpunkt der letzten Speicherung in Millisekunden (Server-Uhr)
  updatedAt: number;
}

export const MAX_POSITION_TEXT = 200;

export function getSpeechPosition(userId: number, courseSlug: string, lessonSlug: string): StoredSpeechPosition | null {
  const row = getDb()
    .prepare(
      "SELECT position, total, text, updated_at FROM speech_positions WHERE user_id = ? AND course_slug = ? AND lesson_slug = ?",
    )
    .get(userId, courseSlug, lessonSlug) as { position: number; total: number; text: string; updated_at: string } | undefined;
  return row ? { index: row.position, total: row.total, text: row.text, updatedAt: Date.parse(row.updated_at) } : null;
}

export function saveSpeechPosition(
  userId: number,
  courseSlug: string,
  lessonSlug: string,
  position: { index: number; total: number; text: string },
  now: Date = new Date(),
): StoredSpeechPosition {
  const text = position.text.slice(0, MAX_POSITION_TEXT);
  getDb()
    .prepare(
      `INSERT INTO speech_positions (user_id, course_slug, lesson_slug, position, total, text, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (user_id, course_slug, lesson_slug)
       DO UPDATE SET position = excluded.position, total = excluded.total, text = excluded.text, updated_at = excluded.updated_at`,
    )
    .run(userId, courseSlug, lessonSlug, position.index, position.total, text, now.toISOString());
  return { index: position.index, total: position.total, text, updatedAt: now.getTime() };
}

export function deleteSpeechPosition(userId: number, courseSlug: string, lessonSlug: string): void {
  getDb()
    .prepare("DELETE FROM speech_positions WHERE user_id = ? AND course_slug = ? AND lesson_slug = ?")
    .run(userId, courseSlug, lessonSlug);
}
